# 1Founder B2B Investor Platform

## Overview

1Founder's B2B tier extends the core boardroom for VCs, accelerators, incubators, family offices, and corporate innovation teams. Every startup evaluation produces an Investor Lens output alongside the standard boardroom analysis.

## Who It's For

| Account Type | Primary Use Case |
|-------------|-----------------|
| Venture Capital | Deal intake evaluation, IC report preparation, thesis fit screening |
| Accelerator / Incubator | Cohort selection, programme readiness assessment, portfolio monitoring |
| Angel Investor | Deal evaluation, founder assessment |
| Private Equity | Portfolio diagnostics, operational health assessment |
| Family Office | Deal flow evaluation, strategic fit |
| Corporate / CVC | POC readiness, strategic partnership assessment |

## Session Modes

**Founder Eval** — Evaluate a startup idea through an investor lens. Produces standard boardroom output + Investor Lens.

**Portfolio Lens** — Portfolio company health assessment. Activates the Portfolio Diagnostics agent in addition to standard agents.

## Investor Lens Output

```
Investable Score: 0–100
  75+   → Pass
  55–74 → Conditional Pass
  35–54 → Weak
  <35   → Reject

Fields:
  investableVerdict      — IC-ready one-line decision with rationale
  thesisFitSignals       — 3 reasons the startup fits your thesis
  redFlagsForIC          — Top risks for the investment committee
  thesisFitSummary       — Detailed thesis alignment paragraph
  portfolioConflicts     — Conflicts with existing portfolio companies
  programReadiness       — [Accelerators] Cohort-readiness assessment
  icReportSummary        — Copy-paste ready IC memo paragraph
  feedbackForStartup     — What to tell the founder (shareable directly)
  founderQuestionsToAsk  — 3 sharp questions for the analyst call
  kbThesisUsed           — Whether fund thesis was retrieved and used
```

## Fund Profile

Structured thesis input stored per organisation. Agents reference this on every session.

| Field | Description |
|-------|-------------|
| Fund name | Organisation name |
| Org type | Incubator / Accelerator / Angel / VC / PE / Family Office / Corporate |
| Thesis | Free-text investment thesis |
| Sectors | Multi-select (20 options) |
| Stages | Multi-select (Incubation through Series B+) |
| Geography | Cities · Countries · Regions |
| Ticket size | Currency (INR/USD/EUR/GBP) + min/max range |
| Portfolio companies | Manual entry or CSV upload |
| Notes | Exclusions, special criteria |

Fund profile data is injected directly into synthesis as structured PostgreSQL data — not retrieved via embedding similarity. This means thesis fit analysis is precise and 100% reliable.

## Pitch Deck Upload

B2B users can upload a startup's PDF pitch deck during the intake session. Claude Haiku extracts:
- Business name, type, sector, stage
- Target market and geography
- Revenue model, team size, funding ask

A summary card is shown for confirmation. On confirm — Q&A is skipped, analysis begins immediately.

## B2B-Only Agents

| Agent | Domain |
|-------|--------|
| Portfolio Diagnostics | PE/VC portfolio health, operational intervention assessment |
| Deal Sourcing | VC deal flow analysis, market mapping, founder pipeline |
| Incubator Programme | Cohort design, programme readiness, acceleration track fit |
| Corporate Innovation | POC/pilot readiness, strategic fit, CVC alignment |
| LP Investor Relations | Fund reporting perspective, LP communication |
| M&A & Partnerships | Deal structuring, strategic partnership potential |

These agents only activate in B2B sessions and are exempt from the intent cap — they always fire when their conditions are met.

## Shared Knowledge Base

All members of a B2B organisation share the same KB namespace. Upload fund thesis documents, portfolio CSVs, sector reports, LP updates — all members access the same context during evaluations.

Portfolio CSV format: `Company Name, Stage, Investment Size, Sector, Geography, Description`

## Admin Controls

- Create organisations with custom org type
- Assign users to organisations (auto-upgrades to B2B plan)
- Suspend / reactivate organisations (bulk member plan management)
- Remove individual members
- Upload to any of 20 global KB namespaces
