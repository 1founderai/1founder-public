<div align="center">

# 1Founder

### Your Expert Boardroom

**40+ specialist AI agents stress-test your startup idea in one session.**  
Chief of Staff conflict resolution · Health score · Executable output · Built for Indian founders.

[![Live](https://img.shields.io/badge/Live-1founder.ai-black?style=flat-square)](https://1founder.ai)
[![Free tier](https://img.shields.io/badge/Free_tier-1_session%2Fweek-green?style=flat-square)](https://1founder.ai)
[![Made for India](https://img.shields.io/badge/Made_for-India-orange?style=flat-square)](https://1founder.ai)
[![B2B](https://img.shields.io/badge/B2B-Investor_Platform-purple?style=flat-square)](https://1founder.ai)

</div>

---

## What is 1Founder?

1Founder is a multi-agent AI boardroom. You describe your startup idea. 7–17 specialist AI agents analyse your brief **simultaneously and independently**. The Chief of Staff synthesises all verdicts, resolves inter-agent conflicts with explicit reasoning, and produces a structured output with a 0–100 health score and prioritised action plan.

**This is not a chatbot. This is not a single model giving general advice.**

It is a structured boardroom simulation where agents disagree, conflicts are resolved, and the output is actionable.

---

## The Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTAKE                              │
│         Chief of Staff (Claude Haiku) — adaptive Q&A            │
│         Extracts: businessType · sector · geography · stage      │
└──────────────────────────┬──────────────────────────────────────┘
                           │ CoSBrief
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT SELECTION ENGINE                         │
│    Intent bucket (high/medium/low) × Plan tier × Brief context  │
│    Selects 7–17 agents from 40+ registry                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Selected agents
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              PARALLEL AGENT EXECUTION (Claude Sonnet)            │
│                                                                   │
│  Strategy  GTM  CFO  Risk  Legal  Product  Unit Economics        │
│  Market Viability  VC Analyst  Fintech  Agritech  Sales ...     │
│                                                                   │
│  Each agent runs independently — no shared context               │
└──────────────────────────┬──────────────────────────────────────┘
                           │ All agent outputs
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              CHIEF OF STAFF SYNTHESIS (Claude Sonnet)            │
│                                                                   │
│  1. Collects all agent verdicts                                  │
│  2. Identifies inter-agent conflicts                             │
│  3. Resolves conflicts with explicit reasoning                   │
│  4. Generates health score (0–100) across 8 axes                │
│  5. Produces priority actions, SWOT, CoS closing statement       │
│  6. [B2B] Generates Investor Lens + IC report draft             │
└──────────────────────────┬──────────────────────────────────────┘
                           │ CoSSynthesis
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BOARDROOM OUTPUT                             │
│                                                                   │
│  Health score · Priority actions · Agent verdicts               │
│  SWOT · Peer benchmarks · CoS closing statement                 │
│  [B2B] Investor Lens · IC report · Thesis fit · Red flags       │
└─────────────────────────────────────────────────────────────────┘
```

---

## The Health Score

A 0–100 composite score generated from parallel agent analysis across 8 axes:

| Axis | What It Measures |
|------|-----------------|
| Problem clarity | Is the problem specific, urgent, and clearly owned by a defined customer? |
| Market size & timing | Is the TAM large enough and is now the right time? |
| Founder-market fit | Does the founder have domain expertise or lived experience? |
| GTM readiness | Is there a credible path to first 100 customers? |
| Revenue model viability | Is the payer identified and the monetisation path validated? |
| Financial runway | Can the founder reach the next milestone on available capital? |
| Scalability | Can the model grow without proportional cost increases? |
| Execution risk | What is the probability of actually building and shipping this? |

**Score interpretation:** 75+ Pass · 55–74 Conditional · 35–54 Weak · <35 Reject

---

## The Conflict Resolution Layer

This is the core differentiator. When agents disagree — which they frequently do in real business decisions — the Chief of Staff does not average or ignore the disagreement.

**Example from a real session:**

```
Risk Agent:    ₹2L/month pricing will kill customer acquisition.
               CAC will be ₹50K+ with 18-month sales cycles.

CFO Agent:     ₹2L/month is financially required for unit economics.
               At ₹50K/month you need 10x the customers for the same ARR.

CoS Resolution: Pricing validation is the gate, not the answer.
               Build tiered model: ₹30K (small NBFCs) → ₹1L (mid-tier)
               → ₹2L (enterprise). Validate with 20 NBFC budget conversations
               before committing to any single price point.
               CFO Agent's unit economics + Risk Agent's market reality = tiered entry.
```

The founder gets a resolution with explicit trade-offs — not a compromise or an average.

---

## The 40+ Agent Registry

| Init | Agent | Domain |
|------|-------|--------|
| CS | Chief of Staff | Synthesis · conflict resolution · health score |
| ST | Strategy | Business model · market opportunity · competitive positioning |
| GT | GTM Strategy | Go-to-market · positioning · channels · launch sequencing |
| CF | CFO | Finance · fundraising · runway · cash flow · unit economics |
| RK | Risk | Risk assessment · scenario planning · failure modes |
| LG | Legal | Compliance · regulatory · IP · contracts |
| MV | Market Viability | TAM/SAM/SOM · break-even · price reality checks |
| PD | Product | MVP scope · roadmap · UX · build vs buy |
| UE | Unit Economics | COGS · CAC · LTV · channel margin stress-test |
| FS | Fundraising Strategy | India funding landscape · angel/VC/grants · pitch readiness |
| VC | VC Analyst | Investor lens · fundability · pitch stress-test · India VC landscape |
| SL | Sales | B2B sales strategy · pipeline · enterprise motion |
| PR | Pricing | Pricing strategy · willingness to pay · packaging |
| OP | Operations | Ops design · team structure · process |
| BD | Brand & Design | Brand positioning · visual identity · messaging |
| CX | Customer Experience | Customer journey · retention · NPS |
| DA | Data & Analytics | Metrics · KPIs · data infrastructure |
| HR | People & HR | Hiring plan · culture · org design |
| PM | Performance Marketing | Paid acquisition · ROAS · channel mix |
| CR | Consumer Research | Customer insight · market research · persona validation |
| CG | Community Growth | Community-led growth · creator economy · word of mouth |
| FT | Fintech | RBI regulations · SEBI · IRDAI · payment systems · NBFC rules |
| HT | Health/Medtech | CDSCO · NMC · health data privacy · clinical pathway |
| AT | Agritech | Input access · post-harvest · farmer commerce · FPO models |
| ED | Edtech | NEP 2020 · UGC · ed-platform economics · vernacular |
| DC | D2C & Quick Commerce | Blinkit/Zepto/Swiggy economics · D2C unit economics |
| MK | Marketplace | GMV · take rate · liquidity · marketplace dynamics |
| SC | Supply Chain | Logistics · warehousing · vendor management |
| EX | Export/Import | DGFT · FEMA · trade finance · export incentives |
| PK | Packaging | FSS regulations · eco-compliance · shelf economics |
| GV | Government/DPIIT | Startup India · DPIIT recognition · government schemes |
| PP | Proptech | RERA · land records · real estate market dynamics |
| SA | SaaS | SaaS metrics · PLG · enterprise sales · India SaaS benchmarks |
| PD2 | Portfolio Diagnostics | PE/VC portfolio health · operational intervention *(B2B only)* |
| DS | Deal Sourcing | VC deal flow · market mapping · founder pipeline *(B2B only)* |
| IP | Incubator Programme | Cohort design · programme readiness · acceleration *(B2B only)* |
| CI | Corporate Innovation | POC/pilot readiness · strategic fit · CVC *(B2B only)* |
| LP | LP Relations | Fund reporting · LP communication *(B2B only)* |
| MA | M&A & Partnerships | Deal structuring · strategic partnerships *(B2B only)* |

**Agent selection is intent-based.** A fintech founder in India gets the Fintech + Legal + CFO + GTM + Market Viability agents. A D2C founder gets D2C + Consumer Research + Pricing + Sales + Supply Chain. A SaaS founder in the US gets different agents than a SaaS founder targeting Tier 2 India.

---

## B2B Investor Platform

1Founder has a dedicated tier for VCs, accelerators, incubators, and corporate innovation teams.

### Investor Lens Output

Every B2B session produces an Investor Lens alongside the standard boardroom output:

```json
{
  "investorLens": {
    "investableScore": 68,
    "investableVerdict": "Conditional Pass — strong thesis fit, pricing validation required",
    "thesisFitSignals": [
      "Ex-RBI founder provides regulatory credibility",
      "Real compliance pain point for 2800+ NBFCs",
      "Bharat-native distribution through regulatory network"
    ],
    "redFlagsForIC": [
      "No customer validation yet",
      "Pricing assumptions 10x too high for market reality"
    ],
    "thesisFitSummary": "Perfect Bharat-focused fintech play...",
    "icReportSummary": "Ex-RBI founder building compliance automation...",
    "programReadiness": "Not ready for accelerator — needs 6+ months customer validation",
    "feedbackForStartup": "Your regulatory credibility is gold, but pricing will kill you...",
    "founderQuestionsToAsk": [
      "Walk me through your last 5 conversations with NBFC compliance heads",
      "How many warm intros can you get from your ex-RBI network in 30 days?",
      "If pricing comes in at ₹30K/month, how does that change your unit economics?"
    ]
  }
}
```

### Fund Profile

B2B accounts fill a structured thesis profile (sectors, stages, geography, ticket size, portfolio companies). This is injected directly into every session as structured data — agents check thesis alignment and portfolio conflicts on every evaluation.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Tailwind CSS + Vite 5 |
| Backend | Node.js 20 + Express + TypeScript |
| LLM (agents + synthesis) | Anthropic Claude Sonnet 4.6 |
| LLM (intake) | Anthropic Claude Haiku 4.5 |
| Embeddings | OpenAI text-embedding-3-large (3072d) |
| Vector DB | Pinecone — 20-namespace KB architecture |
| Database | Supabase (PostgreSQL 15 + Auth + Storage) |
| Real-time | Socket.io — live agent status streaming |
| Payments | Razorpay (INR primary) + Stripe (global) + Dodo |
| Hosting | Railway (backend) + Vercel (frontend) |
| Analytics | Umami (privacy-first) |
| SEO | Custom Playwright prerender script + FAQPage schema |

---

## Knowledge Base Architecture

20 Pinecone namespaces across global and geography-specific categories:

```
Global (fires on every session):
  global-l1        → Shark Tank US / Dragon's Den deal outcomes
  global-l2        → VC frameworks (Sequoia, YC, a16z, Blume)
  global-l3        → Startup post-mortems & success cases
  global-l4        → Sector benchmarks (SaaS, D2C, marketplace)
  global-failory   → Failory startup failure case studies
  platform-*       → 1Founder editorial + general content

India (fires for all India briefs):
  geo-india-regulatory  → RBI, SEBI, GST, DPIIT, FSSAI, MCA
  geo-india-market      → Inc42, YourStory, Entrackr benchmarks
  geo-india-sharktank   → Shark Tank India S1–S4 deal outcomes
  geo-india-vc          → Blume, Peak XV, Accel, Elevation playbooks
  geo-india-fintech     → Paytm, Razorpay, BharatPe — fintech cases
  geo-india-agritech    → DeHaat, Ninjacart, AgriBazaar — sector data
  geo-india-ecommerce   → Nykaa, Meesho, Zepto — D2C/ecom benchmarks

Other geos (US, UAE, UK, Singapore, EU, Australia):
  geo-{region}-regulatory → Jurisdiction-specific regulations
  geo-{region}-market     → Regional startup cases & benchmarks

User/org namespaces:
  {user_id}   → Personal KB uploads
  {org_id}    → Shared B2B org KB (fund thesis, portfolio data)
```

Claim tiers for uploaded content:
- **Tier A** — Hard fact (verified data, primary sources)
- **Tier B** — Pattern inference (research, case studies)
- **Tier C** — Judgment / best effort (analysis, frameworks)

---

## Pricing

| Plan | Price | Sessions | Target |
|------|-------|----------|--------|
| Explorer | Free | 1/week | First-time founders exploring validation |
| Starter | ₹299/month | 4/month | Active founders iterating on ideas |
| Pro | ₹799/month | 12/month | Founders preparing to fundraise |
| B2B | Custom | 40/month | VCs, accelerators, incubators |

**₹99 credit pack** — 10 credits for one-off actions (PDF export, drill-downs, extra sessions).

**Core philosophy:** Analysis quality is never gated. All 40+ agents and CoS synthesis fire on the free plan. Only session frequency and output actions are credit-gated.

---

## Open Source Components

| Package | Description | Link |
|---------|-------------|------|
| `@1founder/payment-gateway` | Multi-gateway payment abstraction for Indian SaaS (Razorpay + Stripe + Dodo) | [`/packages/payment-gateway`](./packages/payment-gateway) |

---

## Sample Output

See [`/examples/sample-boardroom-output.json`](./examples/sample-boardroom-output.json) for a redacted boardroom session output showing the full structure of agent verdicts, health scores, conflict resolutions, and CoS synthesis.

---

## Links

- **Product:** [1founder.ai](https://1founder.ai)
- **Free session:** [1founder.ai/session/new](https://1founder.ai/session/new)
- **B2B / institutional:** [1founder.ai](https://1founder.ai) — contact via the platform
- **Validate startup idea guide:** [1founder.ai/how-to-validate-a-startup-idea](https://1founder.ai/how-to-validate-a-startup-idea)
- **vs ChatGPT:** [1founder.ai/vs-chatgpt](https://1founder.ai/vs-chatgpt)

---

<div align="center">

**Built for Bharat. Available globally.**

*1Founder is bootstrapped and pre-revenue. India-first.*

</div>
