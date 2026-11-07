# Roadmap: UO Idle — Ninja & Samurai Class Skill Lines & Mechanics Knowledgebase

## Milestones

- ✅ **v1.0 UO Idle Samurai & Ninja Class Skill Lines & Mechanics Knowledgebase** — Phases 1–6 (shipped 2026-11-07) — [Archive](milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 Authentic UO Gump/Item Art, Interactive Paperdoll & Sim Telemetry UI, Idle-Tuned Ability Overhaul & Live Developer Portal** — Phases 7–10 (shipped 2026-11-07) — [Archive](milestones/v1.1-ROADMAP.md)
- ✅ **v1.2 Live-Codebase Simulator Fidelity, Weapon Swing Speed Archetypes, Unified Tick Engine & Knowledgebase Verification Audit** — Phases 11–14 (shipped 2026-11-07) — [Archive](milestones/v1.2-ROADMAP.md)

---

## Phases

<details>
<summary>✅ v1.0 UO Idle Samurai & Ninja Class Skill Lines & Mechanics Knowledgebase (Phases 1–6) — SHIPPED 2026-11-07</summary>

- [x] **Phase 1: Repository, Knowledgebase Engine & Raw Source Extraction** (`3/3` plans) — completed 2026-11-07
- [x] **Phase 2: Core Combat, Progression & Engine Capability Knowledgebase** (`2/2` plans) — completed 2026-11-07
- [x] **Phase 3: Live Classes (Warrior, Mage, Ranger) & Structural Parity Contract** (`2/2` plans) — completed 2026-11-07
- [x] **Phase 4: ModernUO Bushido/Ninjitsu Reference & Deterministic Combat Simulator** (`2/2` plans) — completed 2026-11-07
- [x] **Phase 5: Samurai & Ninja Skill Line Design, Balance Verification & Drop-In Code** (`3/3` plans) — completed 2026-11-07
- [x] **Phase 6: Dark-Fantasy Iconography, Beta UI Mockups & Developer Handoff Package** (`2/2` plans) — completed 2026-11-07

</details>

<details>
<summary>✅ v1.1 Authentic UO Gump/Item Art, Interactive Paperdoll & Sim Telemetry UI, Idle-Tuned Ability Overhaul & Live Developer Portal (Phases 7–10) — SHIPPED 2026-11-07</summary>

- [x] **Phase 7: Idle-Game Ability Overhaul, Evocative Lore Blurbs & Expanded Simulation/Test Suite** (`1/1` plan) — completed 2026-11-07
- [x] **Phase 8: Authentic UO Gump/Item Sprite Extraction & High-Detail AI Raster Iconography** (`1/1` plan) — completed 2026-11-07
- [x] **Phase 9: Interactive Visual Paperdoll, Simulator Telemetry Charts & CV UI Polish (`/gsd-ui-phase`)** (`1/1` plan) — completed 2026-11-07
- [x] **Phase 10: Lead Developer Review Portal (`index.html`), Live GitHub Pages Deployment & Final Audit** (`1/1` plan) — completed 2026-11-07

</details>

<details>
<summary>✅ v1.2 Live-Codebase Simulator Fidelity, Weapon Swing Speed Archetypes, Unified Tick Engine & Knowledgebase Verification Audit (Phases 11–14) — SHIPPED 2026-11-07</summary>

- [x] **Phase 11: Knowledgebase Audit, Claim Cross-Verification & Coverage Expansion** (`1/1` plan) — completed 2026-11-07
- [x] **Phase 12: Live-Codebase Combat Math, Affix Caps, Postures & Hotbar `ro(e)` Parity** (`1/1` plan) — completed 2026-11-07
- [x] **Phase 13: Unified Tick Kernel Refactor, Recalibrated 5-Class Parity (`±5–8%`) & Expanded Unit Tests** (`1/1` plan) — completed 2026-11-07
- [x] **Phase 14: Workbench UI & Documentation Sync, Live GitHub Pages Redeploy & Final Audit** (`1/1` plan) — completed 2026-11-07

</details>

### Phase 15: Smooth-Scroll Navigation, Sim Button Reactivity & Playwright + CV Audit

**Goal:** Replace all show/hide (`display: none`) tab/filter behavior across the Simulator (`class-comparison.html`), Samurai (`samurai-skill-tree.html`), Ninja (`ninja-skill-tree.html`), and Portal (`index.html`) workbenches with smooth section scrolling (`scrollIntoView`) and spotlight highlighting; ensure every button (including Mode A/B, Bracket L10–L60, Archetype, Material Tier, Quick-Dock chips, Mastery Seals, and Section Anchors) produces a meaningful visual and data update across tables, SVG progression charts, 5-channel breakdowns, and rotation timelines; and verify 100% button functionality via Playwright + screencapture + before/after Computer Vision (CV) pixel-diff and layout analysis.
**Requirements**: UI-SCROLL-01, SIM-BUTTONS-01, PW-CV-AUDIT-01
**Depends on:** Phase 14
**Plans:** 1 plan

Plans:
- [x] `15-01-PLAN.md` — Smooth-Scroll Navigation Overhaul, Sim View Un-Hiding & Playwright + CV Before/After Verification

### Phase 16: UI De-duplication, Progressive Disclosure, Control Clustering & Concept-Art CV Flywheel

**Goal:** Eliminate repeated information across all 4 workbench surfaces (`index.html`, `samurai-skill-tree.html`, `ninja-skill-tree.html`, `class-comparison.html`); consolidate stacked headers/toolbars into a clustered Command Deck; refactor ability cards, character/paperdoll panels, and simulator sections around progressive disclosure (headlines up front, deep-dive details in tabbed inspectors/drawers); add tasteful micro-animations; generate high-res UI Concept Art for user review first; and iterate via the Playwright + Computer Vision (CV) flywheel with inline before/after captures until the live GUI matches the approved concept art.
**Requirements**: UI-DEDUP-01, UI-PROG-DISC-01, UI-CLUSTER-01, UI-ANIM-01, UI-CONCEPT-CV-01
**Depends on:** Phase 15
**Plans:** 1 plan

Plans:
- [x] `16-01-PLAN.md` — Concept Art Review, UI De-duplication, Progressive Disclosure & Iterative CV Flywheel

---

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Repository, KB Engine & Raw Extraction | v1.0 | 3/3 | Complete | 2026-11-07 |
| 2. Core Combat, Progression & Engine Matrix | v1.0 | 2/2 | Complete | 2026-11-07 |
| 3. Live Classes & Structural Parity Contract | v1.0 | 2/2 | Complete | 2026-11-07 |
| 4. ModernUO Reference & Combat Simulator | v1.0 | 2/2 | Complete | 2026-11-07 |
| 5. Samurai & Ninja Design, Balance & Code | v1.0 | 3/3 | Complete | 2026-11-07 |
| 6. Iconography, Beta UI Mockups & Handoff | v1.0 | 2/2 | Complete | 2026-11-07 |
| 7. Idle Ability Overhaul, Lore Blurbs & Sim Tests | v1.1 | 1/1 | Complete | 2026-11-07 |
| 8. Authentic UO Gump/Item Art & AI Icons | v1.1 | 1/1 | Complete | 2026-11-07 |
| 9. Interactive Paperdoll & Sim Telemetry UI | v1.1 | 1/1 | Complete | 2026-11-07 |
| 10. Developer Portal & Live GitHub Pages | v1.1 | 1/1 | Complete | 2026-11-07 |
| 11. KB Audit, Cross-Verification & Expansion | v1.2 | 1/1 | Complete | 2026-11-07 |
| 12. Live-Codebase Combat Math & Hotbar Parity | v1.2 | 1/1 | Complete | 2026-11-07 |
| 13. Unified Tick Kernel & 5-Class Recalibration | v1.2 | 1/1 | Complete | 2026-11-07 |
| 14. Workbench Sync & GitHub Pages Redeploy | v1.2 | 1/1 | Complete | 2026-11-07 |
| 15. Smooth-Scroll Navigation, Sim Button Reactivity & Playwright + CV Audit | v1.2 | 1/1 | Complete | 2026-11-07 |
| 16. UI De-duplication, Progressive Disclosure, Control Clustering & Concept-Art CV Flywheel | v1.2 | 1/1 | Complete | 2026-11-07 |
