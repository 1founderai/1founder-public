# 1Founder Knowledge Base Architecture

## Overview

The 1Founder KB uses a 20-namespace Pinecone architecture. Namespaces are queried selectively based on the session brief — global namespaces fire on every session, geography-specific namespaces fire when the brief geography matches.

## Namespace Map

| Namespace | Fires When | Content Type |
|-----------|-----------|-------------|
| `global-l1` | Every session | Shark Tank US / Dragon's Den deal outcomes |
| `global-l2` | Every session | VC frameworks (Sequoia, YC, a16z, Blume) |
| `global-l3` | Every session | Startup post-mortems & success cases |
| `global-l4` | Every session | Sector benchmarks (SaaS, D2C, marketplace) |
| `global-failory` | Every session | Failory startup failure case studies |
| `platform-additions` | Every session | 1Founder editorial content |
| `platform-others` | Every session | Uncategorised admin uploads |
| `geo-india-regulatory` | India briefs | RBI, SEBI, GST, DPIIT, FSSAI, MCA |
| `geo-india-market` | India briefs | Inc42, YourStory, Entrackr benchmarks |
| `geo-india-cases` | India briefs | India startup case studies |
| `geo-india-sharktank` | India briefs | Shark Tank India S1–S4 outcomes |
| `geo-india-vc` | India briefs | Blume, Peak XV, Accel, Elevation playbooks |
| `geo-india-ecommerce` | India briefs | D2C/ecom benchmarks |
| `geo-india-fintech` | India briefs | Fintech cases & regulatory |
| `geo-india-agritech` | India briefs | Agritech sector data |
| `geo-us-*` | US briefs | US regulatory + market |
| `geo-uae-*` | UAE briefs | DIFC, ADGM, UAE market |
| `geo-uk-*` | UK briefs | FCA, Companies House, UK market |
| `geo-sg-*` | Singapore briefs | MAS, ACRA, SEA market |
| `{user_id}` | Always (personal) | User's personal KB uploads |
| `{org_id}` | Always (B2B org) | Shared org KB — fund thesis, portfolio data |

## Claim Tiers

All KB content is tagged with a claim tier that affects retrieval weighting:

- **Tier A** — Hard fact: verified data, primary sources, regulatory documents
- **Tier B** — Pattern inference: research reports, case studies, benchmarks
- **Tier C** — Judgment / best effort: analysis, frameworks, editorial

## Retrieval Strategy

For each session, the retriever:
1. Always queries all global namespaces
2. Adds geography-specific namespaces based on `brief.geographyCode`
3. Always queries the user's personal namespace
4. For B2B orgs: always queries the org namespace
5. Applies minimum similarity score threshold (0.70)
6. Returns top-K chunks (default: 5, cost-optimised)

## B2B Fund Profile (Not in Pinecone)

B2B fund thesis data is stored in PostgreSQL (`fund_profiles` table), not in Pinecone. This gives 100% reliable retrieval with no similarity threshold — the exact thesis, sectors, stages, and portfolio companies are injected directly into the synthesis prompt as structured data.
