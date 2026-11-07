# Roadmap: UO Idle — Ninja & Samurai Class Skill Lines & Mechanics Knowledgebase

## Milestones

- ✅ **v1.0 UO Idle Samurai & Ninja Class Skill Lines & Mechanics Knowledgebase** — Phases 1–6 (shipped 2026-11-07) — [Archive](milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 Authentic UO Gump/Item Art, Interactive Paperdoll & Sim Telemetry UI, Idle-Tuned Ability Overhaul & Live Developer Portal** — Phases 7–10 (shipped 2026-11-07) — [Archive](milestones/v1.1-ROADMAP.md)
- ✅ **v1.2 Live-Codebase Simulator Fidelity, Unified Tick Engine & Knowledgebase Verification Audit** — Phases 11–14 (shipped 2026-11-07)

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

### ✅ v1.2 Live-Codebase Simulator Fidelity, Unified Tick Engine & Knowledgebase Verification Audit (Phases 11–14) — SHIPPED 2026-11-07

- [x] **Phase 11: Knowledgebase Audit, Claim Cross-Verification & Coverage Expansion** (`1/1` plan) — completed 2026-11-07
- [x] **Phase 12: Live-Codebase Combat Math, Affix Caps, Postures & Hotbar `ro(e)` Parity** (`1/1` plan) — completed 2026-11-07
- [x] **Phase 13: Unified Tick Kernel Refactor, Recalibrated 5-Class Parity (`±5–8%`) & Expanded Unit Tests** (`1/1` plan) — completed 2026-11-07
- [x] **Phase 14: Workbench UI & Documentation Sync, Live GitHub Pages Redeploy & Final Audit** (`1/1` plan) — completed 2026-11-07

---

## Phase Details

### Phase 11: Knowledgebase Audit, Claim Cross-Verification & Coverage Expansion
**Goal**: Audit every page in `mechanics/`, promote multi-source corroborated claims (`bundle:` + `wiki:` / `modernuo:` / `live:`) to `[verified]`, eliminate uncited `_raw/` slices (`bestiary-and-wiki.js`, `hunt-and-bot-config.js`, `progression-tree-ui.js`, `changelog-client-en.md`), and publish `mechanics/topics/simulator-fidelity-audit.md`.
**Depends on**: Phase 10
**Requirements**: `KB-05`, `KB-06`
**Success Criteria** (what must be TRUE):
  1. `python3 mechanics/tools/kb.py --self-test` and `python3 mechanics/tools/kb.py check` pass with `0` errors and `0` warnings.
  2. Multi-source corroborated KB pages (`resources.md`, `damage-and-defense.md`, `tick-and-cooldowns.md`, `equipment-affixes.md`, `status-effects.md`, `progression-and-stats.md`, and ModernUO Bushido/Ninjitsu pages) have cross-reference `evidence` entries and promoted `[verified]` claims.
  3. New claim-verified KB pages cover `bestiary-and-wiki.js`, `hunt-and-bot-config.js`, `progression-tree-ui.js`, and `mechanics/topics/simulator-fidelity-audit.md`.
**Plans**: 1 plan
- [ ] `11-01-PLAN.md` — Audit & promote KB claims, add bestiary/hunt-bot/progression-tree/simulator-fidelity KB pages, and rebuild `mechanics/INDEX.md`

### Phase 12: Live-Codebase Combat Math, Affix Caps, Postures & Hotbar `ro(e)` Parity
**Goal**: Implement exact live UO Idle `v0.99.0` combat math, stat/affix hard caps, `[huntpostura` postures, `+8%` weapon / `+12%` armor material steps, secondary-target `splashRatio`, 1H/2H/Shield `CheckParry`, class weapon speeds, and `ro(e)` hotbar auto-triggers in `src/sim/types.ts`, `src/sim/archetypes.ts`, and `src/sim/engine.ts`.
**Depends on**: Phase 11
**Requirements**: `SIM-06`, `SIM-07`
**Success Criteria** (what must be TRUE):
  1. `src/sim/engine.ts` enforces `SDI <= 50%` (+`INT` bonus), gear `DI <= 100%` (+skill `>100` flattening), gear `SSI <= 60%` (separate from `treeSpeedPct`), `LMC <= 40%`, `EnhancePotions`, `ReflectPhysical`, defender `DCI` in `computeHitChance`, 1H (`48,000`) / 2H (`41,140`) / Shield `CheckParry`, and `splashRatio` on secondary cleave/splash targets.
  2. `src/sim/archetypes.ts` implements canonical `[huntpostura` postures (`agressivo`, `equilibrado`, `defensivo`), `+8%` weapon / `+12%` armor material steps (`Copper..Valorite`), class-differentiated `baseWeaponSpeedMs`, and `ro(e)` hotbar thresholds.
**Plans**: 1 plan
- [ ] `12-01-PLAN.md` — Implement live combat caps, affixes, `[huntpostura` postures, material ladder, `splashRatio`, 1H/2H/Shield `CheckParry`, and `ro(e)` hotbar rules in `src/sim/`

### Phase 13: Unified Tick Kernel Refactor, Recalibrated 5-Class Parity (`±5–8%`) & Expanded Unit Tests
**Goal**: Unify `simulateScenarioDetailed` and `simulateMultiWavePull` onto a single shared tick-step engine, recalibrate Samurai/Ninja tuning & baseline snapshots so all 5 classes hold $\pm 5\text{–}8\%$ parity across all 80 scenarios, and expand `tools/test_sim.ts` to test every `v1.2` mathematical invariant.
**Depends on**: Phase 12
**Requirements**: `SIM-08`, `SIM-09`
**Success Criteria** (what must be TRUE):
  1. `simulateMultiWavePull` delegates tick execution to the shared combat tick kernel in `src/sim/engine.ts` with zero duplicated combat resolution loops.
  2. `npx tsx tools/sim_balance.ts --verify` passes with `overallPass: true`, `0` OOM ticks, and $\pm 5\text{–}8\%$ 5-class parity across all 80 Mode A & Mode B scenarios and gear/wave matrices.
  3. `npx tsx tools/test_sim.ts` passes all existing and new unit assertions covering caps, postures, material scaling, `splashRatio`, 1H/2H/Shield parry, `ro(e)` triggers, and single-wave/multi-wave equivalence.
**Plans**: 1 plan
- [ ] `13-01-PLAN.md` — Unify single/multi-wave tick kernel, recalibrate 5-class baselines & ability coefficients, and expand `tools/test_sim.ts`

### Phase 14: Workbench UI & Documentation Sync, Live GitHub Pages Redeploy & Final Audit
**Goal**: Regenerate all 5 HTML workbenches, Retina screenshots, `BALANCE_REPORT.md`, `SAMURAI_SPEC.md`, and `NINJA_SPEC.md` with the `v1.2` simulator outputs, verify all 7 gates (`npm run verify:all`), and redeploy to live GitHub Pages (`https://brbrainerd.github.io/uoIdle/`).
**Depends on**: Phase 13
**Requirements**: `UI-04`
**Success Criteria** (what must be TRUE):
  1. ` BALANCE_REPORT.md`, `SAMURAI_SPEC.md`, `NINJA_SPEC.md`, `mockups/*.html`, root `index.html`, and `mockups/screenshots/*.png` reflect the updated `v1.2` simulator baselines and math rules.
  2. `npm run verify:all` passes all 7 verification gates (`0` errors, `zeroPolygons: true`).
  3. Live GitHub Pages (`https://brbrainerd.github.io/uoIdle/`) is deployed and verified (`HTTP 200`).
**Plans**: 1 plan
- [ ] `14-01-PLAN.md` — Sync specs, rebuild HTML workbenches & Retina screenshots, run `verify:all`, and deploy `v1.2` to GitHub Pages

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
