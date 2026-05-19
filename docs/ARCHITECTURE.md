# 1Founder — System Architecture

## Overview

1Founder runs a multi-agent AI boardroom with three architectural layers:

1. **Intake layer** — Conversational brief extraction using Claude Haiku
2. **Agent layer** — 7–17 specialist agents running in parallel using Claude Sonnet
3. **Synthesis layer** — Chief of Staff conflict resolution and output generation

## Infrastructure

```
                    ┌─────────────┐
                    │   Vercel    │
                    │  (Frontend) │
                    │  React/Vite │
                    └──────┬──────┘
                           │ HTTPS + WSS
                    ┌──────▼──────┐
                    │   Railway   │
                    │  (Backend)  │
                    │ Node/Express │
                    └──┬───┬───┬──┘
                       │   │   │
             ┌─────────┘   │   └─────────┐
             │             │             │
      ┌──────▼──────┐ ┌────▼─────┐ ┌────▼────┐
      │  Supabase   │ │ Pinecone │ │Anthropic│
      │  (Postgres  │ │(Vector DB│ │  (LLMs) │
      │  + Auth     │ │ 20 ns KB)│ │         │
      │  + Storage) │ └──────────┘ └─────────┘
      └─────────────┘
```

## Request Lifecycle

### 1. Session Create
```
POST /sessions
  → authMiddleware validates JWT
  → checkSessionAllowance (plan limits + credit balance)
  → Insert session row (status: 'intake')
  → Return sessionId
```

### 2. Intake (1–6 turns)
```
POST /sessions/:id/intake
  → runAdaptiveIntakeTurn(history, sessionId, sessionObjective?)
  → Claude Haiku generates next question OR signals INTAKE_COMPLETE
  → Extracts: businessType, sector, geography, stage, revenueModel...
  → Returns CoS message + extractedFields
```

### 3. Submit & Agent Selection
```
POST /sessions/:id/intake (final turn)
  → buildBriefFromConversation(history, extractedFields)
  → selectAgentsForSession(brief, planTier, intentBucket)
     ├── intentBucket = high/medium/low (from CoS confidence)
     ├── Caps: high=99, medium=14, low=10 agents
     ├── B2B specialists exempt from intent cap
     └── Returns selected AgentConfig[]
  → Update session status: 'confirming'
```

### 4. Boardroom Execution
```
POST /sessions/:id/confirm
  → runBoardroomSession(sessionId, brief, userId, orgId, emit)
     ├── [B2B] Fetch org_type + fund_profile from Postgres
     ├── runAgentsBatched(selectedAgents, brief, emit)
     │    ├── Agents run in parallel batches
     │    └── Socket.io emits agent:firing / agent:complete per agent
     └── runCoSSynthesis(agentOutputs, brief, userId, orgId, orgType, fundProfile)
          ├── Pinecone KB retrieval (20 namespaces)
          ├── Conflict identification across agent outputs
          ├── Explicit conflict resolution with reasoning
          ├── Health score calculation (8 axes, 0–100)
          ├── [B2B] Investor lens generation (investable score, IC report, thesis fit)
          └── Returns CoSSynthesis object
  → Store synthesis_full in sessions.synthesis_full (JSONB)
  → Emit session:complete via Socket.io
```

## Agent Selection Logic

Agents are selected by evaluating conditions against the `CoSBrief`.
Intent bucket determines the agent count ceiling:

| Intent Bucket | Max Agents | When |
|--------------|------------|------|
| high | Plan tier limit | Clear, detailed brief |
| medium | 14 | Adequate brief |
| low | 10 | Thin brief — core team only |

B2B specialist agents bypass the intent cap entirely.

## Credit System

```
credits_balance = subscription_credits + purchased_credits

Deduction waterfall:
  1. subscription_credits (depleted first)
  2. purchased_credits (persistent, never expire)

Rollover caps (subscription_credits only):
  starter: max 60  (3 months × 20/month)
  pro:     max 180 (3 months × 60/month)
  b2b:     uncapped
```

## Security Model

- Row Level Security on all Supabase tables
- JWT validation on every request via Supabase authMiddleware
- CORS whitelist with explicit HTTP methods
- Rate limiting: 200 req/15min global, 20/min on session + upload endpoints
- HMAC-SHA256 webhook verification (Razorpay, Stripe, Dodo)
- Credit RPCs run as SECURITY DEFINER
- Webhook idempotency: unique index on payment IDs prevents double-crediting
