# W25 — Coverage Audit: Landing Page vs Internal Marketing Files

**Auditor:** W25 worker
**Date:** 2026-08-22
**Sources audited against:**
- `Fabrica-marketing/internal/brand/brand-guidelines.md` (BG)
- `Fabrica-marketing/internal/brand/positioning-statement.md` (PS)
- `Fabrica-marketing/internal/research/competitor-landscape.md` (CL)

**Audit targets:**
- `messages/en.json` (current, post-rewrite)
- `components/Blocks/*` (18 components)
- `app/[locale]/page.tsx` (16-section order: Hero → DaemonTicker → ShowcaseCarousel → Pain → Turn → Crew → Orchestration → Control → BeyondCode → IntegrationsMarquee → WhyFabrica → Comparison → Testimonials → Pricing → FAQ → FinalCta)

**Verdict up front, honestly:** The page is structurally strong on mechanism coverage — CLI agent management, worktrees, approval gates, budget caps, BYOK, mobile oversight are all present and repeated. But it **fails the sources' own evidence standard in three places** (fabricated testimonials, invented metrics, a leaked price point), it **omits two named differentiators entirely** (the adaptive interface, the business roadmap), it **overstates spend tracking** without the sources' mandatory qualifier, and its hero leads with pain-cleverness instead of the positioning statement's who/what/why-different. Details below.

---

## 1. COVERAGE MAP

Legend: COVERED / WEAK (present but underplayed) / MISSING

### From brand-guidelines.md

| # | Source concept | Source ref | Where on page | Status |
|---|---|---|---|---|
| B1 | Tagline "The Next AI Exit" | BG L284 | `hero.badgeLabel` (en.json:14), `cta.headline` (en.json:729), footer copyright (en.json:821), showcase s2 | COVERED |
| B2 | Tagline clarifier "From doing every task to directing the work" | BG L287 | Nowhere | **MISSING** |
| B3 | Brand promise "Your business, automated. Your judgment, still in the loop." | BG L61; PS L9 | Not present verbatim or near-verbatim anywhere. Closest spirit: `control.paragraph` "Agents propose; you approve" (en.json:419) | **MISSING** (spirit only) |
| B4 | Manages Claude Code/Codex/OpenCode/Cursor/Devin via local terminals | BG L10–12 | `hero.subheadline` (en.json:20), `faq.a1` (en.json:710), `footer.tagline` (en.json:796), `layout.description` (en.json:888) | COVERED |
| B5 | Slack-style channel interface; agents discuss/delegate/report in plain language | BG L20–25 | `hero.pillarEisenhowerSub` (en.json:29), `orchestration.paragraph` (en.json:339), `faq.a1`, `comparison.r2/r6` | COVERED |
| B6 | Event-driven UI (triggers on task completion / budget threshold / gate opening) | BG L25–28; PS L7 | `hero.pillarZeroPrompt` + Sub (en.json:26–27) | COVERED (one chip only — WEAK placement for a named differentiator) |
| B7 | Adaptive UI that learns behaviors/preferences/patterns | BG L30–35; PS L27 (dedicated differentiator bullet) | **Nowhere on the page** | **MISSING** |
| B8 | Approval gates for consequential actions | BG L13; PS L30 | `control` section entire, `hero.pillarFieldOpsSub` (en.json:31), `pillars.gates` (en.json:552–555), gates cards (en.json:464–489) | COVERED (strongest section on page) |
| B9 | Hard budget caps / auto-stops | BG L13; CL L14 | `control.card3` (en.json:445–452), `pillars.budget` (en.json:547–550), `turn.budgetLabel` (en.json:272) | COVERED — but honesty qualifier missing (see H3) |
| B10 | Spend tracking only where agents expose quota data | BG L302 "(where the CLI agent exposes it)"; CL L83, L101 | Not stated anywhere. Page implies universal per-agent tracking (`comparison.r3` en.json:592, `control.card3.desc` en.json:448) | **MISSING** (and actively contradicted) |
| B11 | Shared knowledge vault as source of truth | BG L15, L301, L312 | `comparison.r5` (en.json:603–606), `orchestration.step3.desc` (en.json:353), showcase s7 | WEAK — appears only in passing rows/steps; no dedicated card despite being called out twice as a top differentiator (CL L29, L183) |
| B12 | Business roadmap alongside vault ("documents + plan = source of truth") | BG L301; PS L21, L28 | Vault yes; roadmap never mentioned | **MISSING** |
| B13 | Agents collaborate with each other in channels | BG L14 | `orchestration.paragraph` (en.json:339), `comparison.r2`, showcase s7 | COVERED |
| B14 | 24/7 runtime ops: customer support, ecommerce, content pipelines, HR | BG L16–17, L313; PS L29 | `beyond.headline/paragraph` (en.json:493–494), `faq.a7` (en.json:722), `comparison.r7` (en.json:616), showcase s1/s4 | COVERED |
| B15 | Isolated git worktrees / parallel no-collision execution | BG L247, L405 | Pervasive: `pillars.worktrees`, `orchestration.step2`, `faq.a3`, kanban mock | COVERED |
| B16 | BYOK — keys go to provider directly, never through Fabrica | BG L295, L325; CL L16, L100 | `hero.pillarVaultSub` (en.json:33), `integrations` section (en.json:519–520), `control.card2`, `faq.a2` | COVERED |
| B17 | Client-side credential vault / local-first privacy | CL L33, L117; SWOT L188 | `control.card2` (en.json:430–444), `faq.a2` (en.json:711–712) | COVERED |
| B18 | Mobile companion / approve on the go | BG L189 (SWOT); CL L78 | `fieldOps.mobileCompanion` (en.json:155–159), `orchestration.mobileApp` block (en.json:404–414), `pillars.autonomy`, `faq.a4` | COVERED |
| B19 | Kill switch / circuit breaker | CL L142 | `orchestration.killswitch` (en.json:409), `daemon10` "killswitch armed" (en.json:74), `control.card3.autoKill` | WEAK — named but never explained; CL play #5 calls it a headline proof of the human-in-the-loop standard |
| B20 | Risk tiers on consequential actions | BG L311; PS L21, L30 | One mention: `faq.a6` (en.json:720). ControlSection has no risk-tier UI/copy | WEAK |
| B21 | Audience: technical founders/solo builders | BG L54 | Pain section, crew hooks, pricing solo tier | COVERED |
| B22 | Audience: non-technical entrepreneurs directing in plain language | BG L56; CL play #4 (L137–139) | `faq.a5` (en.json:718), `comparison.r6` (en.json:610). Hero and pain sections assume a technical reader (git branches, staging, AST) | WEAK — solution exists, audience not addressed until FAQ |
| B23 | Audience: operators running continuous business workflows | BG L57 | `beyond` section, `comparison.r7` | WEAK — beyond-code is one mid-page block; CL says this is positioning opportunity #2 (L15) |
| B24 | Audience: lean teams / agencies w/ client budget partitioning | CL L195 | `pricing.tiers.team` (en.json:689–701) only | WEAK |
| B25 | Recommended hero: "Direct the crew. Keep the call." + body + CTA "See the Slack-style interface" | BG L382–387 | NOT used. Page uses pain-led headline instead; CTA is "Get Early Access"/"Explore Command Center" | **MISSING** (deliberate deviation — see §5) |
| B26 | Messaging hierarchy outcome: "without becoming the coordination bottleneck" | BG L300 | Phrase absent; `pain.badge` "THE 11 PM BOTTLENECK" gestures at bottleneck but frames it differently (founder-as-bottleneck vs coordination-bottleneck) | WEAK |
| B27 | Elevator pitch 60-word version (brief → channels → vault → review → budget → local keys) | BG L295 | Content distributed across page but never delivered as one tight paragraph; `turn` paragraph is closest (en.json:269) | WEAK |
| B28 | Evidence standard: never invent counts/time-savings/quotes | BG L331–336, L197; PS L45, L72 | **VIOLATED** — see §3 items H1–H2 | FAIL |
| B29 | Blacklist compliance ("AI-powered", "revolutionary", "game-changing", "seamless", "effortless", "magic", "set it and forget it") | BG L264–276 | None found in en.json (grep-clean). Good. | PASS |
| B30 | Word bank usage (crew, brief, gates, vault, worktree, guardrail, operator…) | BG L254–259 | Used consistently and correctly throughout | PASS |
| B31 | Forge Pulse signature visual | BG L203–212 | Not auditable from copy alone — no copy references an "alive/running" pulse cue on active agents | UNVERIFIED |

### From positioning-statement.md

| # | Source concept | Source ref | Where on page | Status |
|---|---|---|---|---|
| P1 | Full positioning promise (who / what / how / why different) in first touch | PS L7 | Partially: mechanism in `hero.subheadline`; who-for absent from hero; why-different below fold | WEAK (see §5) |
| P2 | "Without requiring technical fluency to direct them" | PS L7 | Only at `comparison.r6` and `faq.a5` | WEAK |
| P3 | Problem framing: siloed tools, "Nobody gives you one place to manage all your CLI agents" | PS L17 | `pain.paragraph` (en.json:251) is a near-verbatim lift | COVERED (good fidelity) |
| P4 | Smart agents know what/when each needs — no manual orchestration | PS L21, L28; BG L301 | `orchestration.paragraph` final sentence (en.json:339) | COVERED (single line; underplayed given it's a claimed Orca differentiator, CL L29) |
| P5 | Differentiator: manages agents, not a model | PS L25 | `integrations.paragraph`, `faq.a1`, `layout.description` | COVERED |
| P6 | Differentiator: adaptive interface | PS L27 | — | **MISSING** (= B7) |
| P7 | Differentiator: run business continuously | PS L29 | `beyond.headline` verbatim match to CL L15 | COVERED |
| P8 | Differentiator: n8n plugin, 400+ SaaS integrations | PS L31; CL L47 | Only `comparison.r8` (en.json:621–624) + showcase s4 caption. No dedicated treatment; `beyond.plugins.custom` doesn't name n8n | WEAK — a listed key differentiator reduced to one table row |
| P9 | Social proof rule: lead with demonstrable workflows until evidence verified | PS L45 | Violated by TestimonialSection | FAIL (see H1) |
| P10 | Workflow pattern "Brief the crew. Review the plan. Approve the run. Ship the output." | PS L73 | `orchestration` steps 1→4 mirror it exactly (Draft Spec → Plan & Scaffold → Parallel Execution → Inspect & Sign-Off) | COVERED |
| P11 | Usage note: lead founder outcome/control BEFORE technical mechanism | PS L70 | Hero subheadline opens with mechanism list (agent names) before any founder outcome | WEAK |

### From competitor-landscape.md

| # | Source concept | Source ref | Where on page | Status |
|---|---|---|---|---|
| C1 | Wedge: desktop CLI agent management platform (not another assistant) | CL L8–10 | `hero.badgeSub` (en.json:15), `layout.title` (en.json:887), `faq.a1` | COVERED |
| C2 | Play 1: "Manage your CLI agents. Run your business. Keep the control." | CL L125 | Split across sections but this exact triad never appears as one message | WEAK |
| C3 | Play 2: financial control concrete AND honest | CL L129–131 | Concrete yes; honest qualifier no (see H3) | WEAK |
| C4 | Play 3: runtime operations contrast "App builders give you a prototype. Fabrica runs the business after the demo." | CL L135 | Spirit present in `beyond`; the sharp prototype-vs-run contrast is absent | WEAK |
| C5 | Play 5: own human-in-the-loop standard (diffs, kill switch, credential vault as operating safeguards, not optional settings) | CL L117, L141–143 | Gates/vault covered; safeguards framed as features, not as *the* trust answer to the market's trust deficit | WEAK |
| C6 | Trust gap stats: 66% frustrated by almost-right output, only 3% highly trust, 87% accuracy concerns | CL L18, L117, L157 | Unused anywhere | **MISSING** |
| C7 | Coordination gap stat: 54% use six or more tools | CL L121 | Unused (pain section's "fourteen tabs" is invented flavor where a real stat exists) | **MISSING** |
| C8 | Competitive contrast vs Manus/Devin/cloud agents (local vs cloud-metered, inspectable state) | CL L42, L107–113 | Comparison table contrasts only vs "Doing It Alone" and "Generic AI Chats" (en.json:575–576) — the weakest possible opponents | **MISSING** (see Missing Gold G5) |
| C9 | Pricing discipline: price TBD, don't publish tiers/prices before approved; avoid "unlimited agents"; avoid inference-cost claims for closed-source agents | CL L93, L101 | PricingSection shows feature lists + trial CTA but no prices (good). Violations elsewhere: "$149/mo" in hero log (H4), "Unlimited Parallel Agent Crews" (H5) | PARTIAL FAIL |
| C10 | Spend-tracking footnote (Claude Code/Codex/OpenCode only; closed agents gated by approvals) | CL L57 fn, L83, L185 | Absent; page implies all-agent spend tracking | **MISSING** (= B10) |
| C11 | Founder-specific outcome templates, not generic code prompts (strategic implication 2) | CL L201 | Kanban/Eisenhower mock tasks are deeply technical: "JWT Refresh Token Worktree Migration" (en.json:92), "TypeScript AST Diffs" (en.json:128) | FAIL against recommendation — mock content skews dev-tool, not founder-outcome |
| C12 | SWOT honesty: BYOK adds onboarding complexity; users maintain own CLI installs/accounts | CL L184 | Opposite claim published: `hero.platformSetup` "Zero Technical Setup" (en.json:23) | CONTRADICTED (see H6) |
| C13 | Don't claim "first"/"only" | CL L150 | No such claims found | PASS |
| C14 | Do not obscure Orca lineage internally / differentiate externally | CL L149 | N/A externally (correct — no Orca mention on public page) | PASS |

---

## 2. MISSING GOLD

Valuable source material unused by the landing page:

**G1. The adaptive interface differentiator.**
- What: The UI learns user behaviors/preferences/patterns, surfaces relevant views/alerts/controls, personalizes with every run.
- From: PS L27 (full differentiator bullet); BG L30–35; CL L10 ("becoming more personalized with every run").
- Why it matters for conversion: It's one of seven named key differentiators and the only one with *compounding* value — "gets better the more you use it" is a retention argument none of the six current pillars make. It also answers "why not just use my agents directly forever?"
- Where: Add as a seventh pillar in `features.pillars` (or replace/augment a weak pillar), plus one sentence in `hero`. No new section needed.

**G2. The business roadmap alongside the knowledge vault.**
- What: Vault is "documents + a plan that becomes the source of truth for the entire operation"; agents reference the roadmap so they never drift off context.
- From: BG L301; PS L21 ("shared knowledge vault and business roadmap"), L28.
- Why it matters: It upgrades the vault from "file storage" to "your company's brain" — a much stronger plain-language story for non-technical operators, and it explains *why* agents don't need re-briefing.
- Where: `comparison.r5` and `orchestration.step3.desc`; ideally also `crew.paragraph`.

**G3. Market-trust data as pain validation.**
- What: 66% frustrated by "almost right" outputs; only 3% highly trust AI output; 84% adoption vs 3% trust gap; 54% juggle 6+ tools.
- From: CL L18, L117, L156–158, L121.
- Why it matters: The pain section currently invents flavor ("3.5 hrs/day", "14 tabs") when cited third-party statistics would make the same point *verifiably*. Anti-hype brands win by citing evidence — these numbers do that work for free.
- Where: `PainSection` intro paragraph and/or `p1Metric` slot, with attribution ("Stack Overflow Developer Survey, 2025").

**G4. Dedicated n8n capability-partner story.**
- What: Native plugin gives every agent workflow 400+ SaaS integrations; n8n framed as capability multiplier, not competitor.
- From: PS L31, L41; CL L28, L47, L79.
- Why it matters: It neutralizes the "so is this just Zapier?" objection and expands perceived scope from coding to whole-business automation in one stroke. Currently buried in comparison row r8.
- Where: `BeyondCodeSection` (add a fifth plugin card or fold into `plugins.custom`) and/or `IntegrationsMarquee`.

**G5. Named competitive category contrasts (local vs cloud; management layer vs IDE).**
- What: The source matrix contrasts Fabrica with Manus (cloud-metered, uninspectable), IDEs (coding-only), app builders (stop at prototype), orchestration frameworks (require Python).
- From: CL L107–113 frame table; PS L35–41 "How Fabrica differs" table.
- Why it matters: The live comparison table fights "Doing It Alone" and "Generic AI Chats" — strawmen nobody buys instead of. Visitors arriving from a Manus/Devin/Cursor search find nothing that speaks to them. Even category-level columns ("Cloud autonomous agents," "AI code editors") without naming names would comply with CL's caution while converting high-intent traffic.
- Where: `ComparisonSection` — restructure columns per PS L35–41.

**G6. The brand promise line.**
- What: "Your business, automated. Your judgment, still in the loop."
- From: BG L59–64; PS L9 (short form).
- Why it matters: It is *the* operating idea for all communication (BG says so explicitly) and the perfect anti-hype summary of the control story. The page says pieces of it but never lands the sentence.
- Where: `TurnSection` headline area or `FinalCta`.

**G7. Kill-switch / global circuit breaker as a named control.**
- What: "Global circuit-breaker kill switch" listed among the human-in-the-loop standard proofs.
- From: CL L142; already teased in `orchestration.killswitch` and `daemon10`.
- Why it matters: For a nervous first-time buyer, "one button stops everything" is the single most reassuring sentence available — and the page already shows the UI for it without ever explaining it.
- Where: `ControlSection.card1` or the autonomy dial card.

**G8. Agency multi-client budget partitioning.**
- What: Agencies serving multiple clients with approvals and budget partitioning per client.
- From: CL L195 (Opportunities); echoed in `pricing.tiers.team` features.
- Why it matters: Highest-willingness-to-pay segment gets generic team-tier bullets instead of the specific "partition budgets per client, approve per client" story.
- Where: `pricing.tiers.team.tagline/features` and one `beyond.plugins` card.

---

## 3. HONESTY CHECK

Claims on the page **not supported by the sources**, ordered by severity. PS L72 rule: *"Do not publish pricing, customer metrics, time-saved claims, or testimonials until they are verified and approved."* PS L45: *"No customer counts, performance claims, testimonials, or logos are approved for publication."*

### H1. CRITICAL — Fabricated testimonials with fabricated metrics
`testimonials.t1/t2/t3` (en.json:632–649): three "Beta User" quotes with attributed roles and metric badges:
- "14+ hrs saved per sprint" (t1.metric, en.json:637)
- "3x faster client turnaround" (t2.metric, en.json:643)
- "100% budget adherence" (t3.metric, en.json:649)

This violates four separate directives simultaneously:
- PS L45/L72 (no testimonials, time-saved claims, customer metrics until verified)
- BG L336 ("Never invent user counts, time savings… quotes")
- BG L197 imagery rules ("Avoid … fabricated metrics/testimonials")
- BG L342 (avoid "anonymous praise presented as a case study" — these are anonymous)

Even the section badge "EARLY ADOPTER FEEDBACK" implies real people. This is the single largest integrity failure on the page. BG §5.2 provides the sanctioned alternative: workflow proof cards (BG L356–362).

### H2. HIGH — Invented quantitative claims outside testimonials
- `pain.p1Metric`: "3.5 hrs/day lost to prompt-juggling" (en.json:256) — no source in any file; presented as fact.
- `eisenhower.goalTracking`: "Goal Tracking: 94% on target" (en.json:102) and `statusMargin`: "78.4% Margin Forecasted" (en.json:134) — fabricated precision inside product mocks.
- Crew member spend figures ($18.40/$12.10/$8.50/$9.20, en.json:168–211) and daemon ticker lines (en.json:65–74) — acceptable *as clearly-labeled illustrative UI*, but nothing on the page labels them as simulated, and BG L196 warns against "fake terminal output."

### H3. HIGH — Spend-tracking overstatement (contradicts the sources' own footnote)
- `comparison.r3.fabrica`: "Hard auto-stops at caps you set, with per-agent spend tracking" (en.json:592)
- `control.card3.desc`: "Set per-task, per-agent, or per-project spending thresholds…" (en.json:448)

CL L83/L101 and BG L302 are explicit: spend tracking works **only** for Claude Code, Codex, OpenCode; closed-source agents (Cursor, Devin, Hermes, Pi) are governed by approval gates, **not cost tracking**. The page sells universal spend visibility for exactly the agents (Cursor, Devin) it names in the hero subheadline. This will produce refund-worthy disappointment and contradicts the "state limits plainly" voice rule (BG L227).

### H4. MEDIUM — Price figure leaked in hero mockup
`crewMembers.analyst.logs[1]`: "Calculated margin: 78.4% gross margin at $149/mo tier" (en.json:214). CL L93: "paid price to be finalized"; CL L101: no paid-tier price before public and approved. Even inside a mockup, publishing "$149/mo" anchors a price the company hasn't set.

### H5. MEDIUM — "Unlimited Parallel Agent Crews"
`pricing.tiers.pro.features[0]` (en.json:681). CL L101 lists "unlimited agents" among claims to avoid. Also internally inconsistent with the solo tier's hard cap framing.

### H6. MEDIUM — "Zero Technical Setup"
`hero.platformSetup` (en.json:23). Directly contradicted by CL L184 (SWOT weakness): "BYOK adds onboarding complexity; users must maintain their own CLI agent installations and model accounts." Users must install Claude Code/Codex/etc. themselves and bring API keys. This claim sets a false expectation in the very first screen. BG voice requires being "grounded: state limits, prerequisites, and evidence plainly" (BG L225).

### H7. LOW-MEDIUM — "Free tier available"
`cta.trustText` (en.json:737). Sources document a **14-day free trial** on all tiers (CL L93), not a free tier. PricingSection CTAs say "Start 14-Day Free Trial" — the trust strip and the pricing section disagree with each other.

### H8. LOW — Absolute/intensity language drifting toward hype
- "Credentials remain **100% encrypted**" (en.json:143), "**100% Isolated Disk**" (en.json:51), "**Zero** Cloud Key Storage" (en.json:737) — absolutes the sources never assert at 100%/zero granularity.
- `showcase.s11.caption`: "rendered on a single **holographic plane**" (en.json:882) — BG L42: metaphors must not "become costume or science fiction."
- `features.paragraph`: "supervised, budget-capped autonomous **factory**" (en.json:525) — factory metaphor isn't in the word bank; forge/foundry/platform are.

### H9. CLEAN — Things that correctly pass
Blacklist terms absent (BG §3.5). No "first/only" claims (CL L150). No prices published in PricingSection proper. BYOK/no-inference-markup messaging matches the sanctioned claim nearly verbatim (CL L100 vs en.json:520, 655). "Agents propose; you approve" quoted exactly from BG L302/PS L30.

---

## 4. PAIN-SOLVING AUDIT

For each pain the sources name: does the page name it AND show the resolution?

| Pain (source) | Source | Named on page? | Solution shown? | Verdict |
|---|---|---|---|---|
| Siloed tools; no single place to manage CLI agents | PS L17; CL L58 | Yes — `pain.paragraph` (en.json:251), near-verbatim | Yes — `TurnSection` + whole platform story | ✅ Best-executed pain→solution arc on the page |
| Runaway bills / unchecked agent loops | CL L120; pain implied | Yes — `pain.p2Title/p2Desc` (en.json:257–258) | Yes — `control.card3`, `pillars.budget` | ✅ Strong. Caveat: solution overstated for closed-source agents (H3) |
| Branch collisions / parallel task conflicts | BG L313; CL L113 | Yes — `pain.p3Desc` (en.json:261) | Yes — worktrees everywhere (`pillars.worktrees`, `faq.a3`) | ✅ Strong |
| Context loss between sessions/tools ("nearly right" verification burden) | CL L118, L166; BG L239 | Half — p1 describes tab-juggling and context forgetting (en.json:255) but never frames the *verification* cost; "almost right" frustration absent | Diff review/QA exists (`orchestration.step4`, gates) but is never connected back to p1 | ⚠️ Pain and solution exist on the page but in unlinked sections; the strongest market statistic (66%, 3% trust — CL L18) goes unused |
| Non-developer can't direct software/ops work | CL L119, L168; BG L56 | **No.** PainSection speaks fluent developer: "git branches," "staging," "API bill," "database schema" (en.json:253–262) | Yes — `faq.a5`, `comparison.r6` | ❌ Solution-without-pain. The page's single biggest audience (non-technical operators per PS L3) sees zero acknowledgment of itself until the FAQ |
| Keys/info too sensitive to scatter | CL L169 | Weakly — p2 mentions rogue patches, not key exposure; no pain copy about credential risk | Yes — `control.card2` is thorough | ⚠️ Solution presented before its pain is established |
| Prototype-vs-run ("I can get a prototype but cannot reliably run the work") | CL L165 | No — `beyond.headline` states the positive ("Run a business, not only build one") without naming the prototype trap | Partially — `beyond` plugins | ⚠️ CL play #3's sharpest contrast line ("App builders give you a prototype. Fabrica runs the business after the demo.", CL L135) unused |
| Founder as coordination bottleneck | BG L300; PS L56 | Reframed — `pain.badge` "THE 11 PM BOTTLENECK" makes the *tools* the bottleneck context, but the hierarchy's precise idea (you become the coordination bottleneck between brief and result) survives only in `pain.headline` (en.json:250) | Yes — Turn + crew direction | ✅ Adequate |

Summary: three pains fully traced, three partially, one (non-technical operator) has a solution with no matching pain anywhere in the top half of the page.

---

## 5. VALUE-PROP CLARITY

PS L7 promise decomposed: (a) what Fabrica is, (b) who it's for, (c) why it's different. Can a first-time visitor get all three in the first screen?

**What the hero currently says** (en.json:13–33):
- Badge: "The Next AI Exit" / "Desktop CLI Agent Management Platform"
- Headline (rotating): "Fourteen tabs. Three broken contexts." / "It's 11 PM. Direct the crew instead."
- Subheadline: "Manage Claude Code, Codex, OpenCode, Cursor, Devin, and other CLI agents through local terminals. Define specialist crews and let parallel agents execute your goals around the clock — from one desktop command center."
- Pillar chips: Event-Driven Execution / Slack-Style Channels / Field Ops & Safety / Client-Side Vault

**Honest evaluation:**

- **(a) What it is: CLEAR.** `badgeSub` + subheadline deliver the exact category sentence from CL L10 within seconds. This is the hero's strongest asset.
- **(b) Who it's for: NOT STATED.** Neither the headline nor subheadline contains "founders," "operators," "builders," or any audience word. The visitor must self-select from the 11 PM scene. Compare BG's ready-made body (L384): "Fabrica helps founders put focused business and coding work in motion…" — the word *founders* was available and omitted. PS L70 explicitly instructs leading with the founder outcome.
- **(c) Why it's different: DEFERRED.** The differentiators (approval gates, budget caps, BYOK) sit in small chips; "keep the control" — half of the primary message (BG L299, PS L54) — appears nowhere in the hero headline or subheadline. The hero's emotional promise is "direct the crew," which is capacity, not control. Per BG L61–63, the control half is the operating idea of the entire brand.
- **Tagline usage violates its own guideline:** BG L286–287 — use "The Next AI Exit" as "a perspective, not an unexplained slogan," paired with the clarifier. The badge uses it bare. To anyone outside the company, "The Next AI Exit" is genuinely ambiguous (exit *from what*? exit *to* where? acquisition?). It reads as insider shorthand.

**Score: 2 of 3 promise components land in the first screen.** Mechanism excellent, audience absent, differentiation underplayed. One sentence fix (subheadline or a new line): name the audience and the control half.

---

## 6. ENHANCEMENT RECOMMENDATIONS (prioritized, source-grounded)

### P1 — Integrity & compliance (fix before anything else)

1. **Replace TestimonialSection with workflow proof cards.** Use BG §5.2 template (L356–362): Brief / Control / Output / Evidence per card, labeled "illustrative workflow." Remove all three quotes and metrics (en.json:632–649). Drawn from PS L45, PS L72, BG L331–344.
2. **Delete or attribute invented metrics.** Replace `pain.p1Metric` "3.5 hrs/day" (en.json:256) with the sourced stat "66% of developers are frustrated by 'almost right' AI output" (CL L18, cited to Stack Overflow 2025). Remove "$149/mo" from analyst logs (en.json:214) per CL L93/L101. Label hero/daemon mock content as simulated UI.
3. **Add the spend-tracking qualifier everywhere spend is claimed.** In `control.card3.desc`, `comparison.r3`, and a new FAQ item: "Spend tracking works where CLI agents expose quota data (Claude Code, Codex, OpenCode); all other agents are governed by approval gates." Verbatim basis: CL L83, L101, L130; BG L302; PS L25. Also soften `comparison.r3.fabrica` accordingly.
4. **Remove "Zero Technical Setup"** (en.json:23). Replace with honest setup truth per CL L184, e.g., "Bring your own CLI agents and keys." Keeps BYOK story intact without the false expectation.
5. **Fix "Free tier available" → "14-day free trial"** in `cta.trustText` (en.json:737), matching CL L93 and the pricing CTAs.
6. **Rename "Unlimited Parallel Agent Crews"** (en.json:681) to a concrete scope (e.g., "Multiple concurrent crews") per CL L101's explicit "claims to avoid."

### P2 — Close coverage gaps on named differentiators

7. **Add the adaptive-interface differentiator.** New pillar (or extend `features.architecture.point3`) using PS L27 / BG L30–35 language: interface learns your patterns, surfaces priority alerts and the controls that matter. Currently a fully MISSING named differentiator.
8. **Pair "business roadmap" with every knowledge-vault mention.** Update `comparison.r5`, `orchestration.step3.desc` per BG L301 and PS L21/L28 ("documents + plan = source of truth").
9. **State the short-form brand promise once, prominently.** "Your business, automated. Your judgment, still in the loop." (BG L61, PS L9) — best fit: `turn.headline` area or FinalCta. Zero current presence (B3).
10. **Upgrade n8n from a table row to a story.** Add to BeyondCodeSection and/or IntegrationsMarquee per PS L31/L41 and CL L47: "every agent workflow reaches 400+ SaaS integrations through the native plugin."
11. **Make the hero name the audience and control half.** One clause fixes both gaps in §5, e.g., append to subheadline: "…for founders and operators who want to direct the work — and keep every consequential decision." Grounded in BG L299, L382–387; PS L7, L70.
12. **Add a non-technical-operator pain beat.** PainSection currently excludes the audience PS L3 puts first. Insert a fourth pain drawn from CL L168/L119: "You're not a developer, but you need software and operations done" — resolved by pointing at `faq.a5`/plain-language channels (already on page).

### P3 — Sharpening & strategic polish

13. **Pair the tagline with its clarifier.** Under the hero badge: "From doing every task to directing the work" — the exact pairing mandated by BG L286–287.
14. **Restructure ComparisonSection columns from strawmen to categories.** Current opponents ("Doing It Alone," "Generic AI Chats," en.json:575–576) convert no one. Use PS L35–41 / CL L107–113 category columns: cloud autonomous agents, AI code editors, workflow automation — keeping the CL L150 caution (no "first/only", no unverifiable competitor claims).
15. **Rewrite mock tasks as founder outcomes, not dev jargon.** CL L201 prescribes examples like "research a market, create a landing page, prepare the launch sequence, request approval." Swap at least 3 of the 7 kanban items (en.json:90–96) and Eisenhower tasks (en.json:123–130) accordingly.
16. **Give the kill switch one explanatory sentence** in ControlSection per CL L142 ("global circuit-breaker kill switch" as proof of the human-in-the-loop standard).
17. **Surface agency/client-partitioning value** in `pricing.tiers.team` per CL L195: per-client budget partitioning and approvals as the headline benefit, not a features bullet.
18. **Adopt CL Play 1's unified triad** somewhere prominent: "Manage your CLI agents. Run your business. Keep the control." (CL L125). The page owns all three parts separately but never delivers them as the one memorable sentence CL says marketing should make memorable (cf. CL L85: the *combination*, not one capability, is the differentiator).

---

## Appendix: Section-by-section structural notes

- `page.tsx` order is sound: pain → turn → proof-of-mechanism → controls → expansion → proof → pricing → FAQ → CTA follows the sources' problem→turn→workflow→guardrails logic (PS §Messaging hierarchy).
- Redundancy note (honesty-adjacent): approval gates appear in 6 sections, worktrees in 5, BYOK in 4 — while the knowledge vault (a claimed unique differentiator, CL L183) appears substantively in ~2 and the adaptive UI in 0. The page over-invests in what competitors partially have and under-invests in what the docs say nothing else has.
- `DaemonTicker` and hero mocks contain invented operational telemetry (en.json:65–74, 161–218). Recommend a persistent "Simulated interface" caption if retained (BG L196–197).
