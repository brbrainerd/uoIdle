# Requirements: UO Idle — Ninja & Samurai Class Skill Lines & Mechanics Knowledgebase (v1.2)

**Defined:** 2026-11-07
**Core Value:** Deliver mechanically authentic (grounded in ModernUO Bushido/Ninjitsu), numerically balanced (parity-tested against live Warrior, Mage, and Ranger formulae), and implementation-ready Ninja and Samurai skill lines backed by a 100% source-verified UO Idle mechanics knowledgebase.

## v1.2 Requirements

Requirements for Milestone `v1.2: Live-Codebase Simulator Fidelity, Unified Tick Engine & Knowledgebase Verification Audit`. Each maps to roadmap phases `11–14`.

### Knowledgebase Audit, Verification Promotion & Coverage Expansion

- [x] **KB-05**: Audit all existing `mechanics/` pages (`combat/`, `systems/`, `classes/`, `modernuo/`, `topics/`), cross-verify claims corroborated across multiple independent sources (`_raw/bundle/`, `_raw/wiki/`, `_raw/modernuo/`, `_evidence/`), promote corroborated claims to `[verified]`, and ensure zero `kb.py check` warnings or uncited `_raw/` domain slices.
- [x] **KB-06**: Expand knowledgebase coverage with new claim-verified pages for previously uncited or under-cited `_raw/` slices (`bestiary-and-wiki.js`, `hunt-and-bot-config.js`, `progression-tree-ui.js`, `changelog-client-en.md`) and author `mechanics/topics/simulator-fidelity-audit.md` documenting every formula, cap, posture, and trigger rule bridging `mechanics/` to `src/sim/`.

### Live-Codebase Combat Math, Affix Caps, Postures & Hotbar Parity

- [x] **SIM-06**: Enforce live UO Idle `v0.99.0` combat math and attribute/affix caps in `src/sim/engine.ts` and `src/sim/types.ts`:
  - Spell Damage Increase (`SDI`) hard cap at `+50%` plus `INT` spell damage scaling (`+1%` per `10 INT`)
  - Weapon Damage Increase (`DI`) gear hard cap at `+100%` and weapon skill scaling flattening above `100`
  - Swing Speed Increase (`SSI`) gear hard cap at `60%` with additive/separate `[Arvore` progression tree `Speed` bonus (`treeSpeedPct`)
  - `LowerManaCost` (`<= 40%`), `CastSpeed` (`<= +2`), `CastRecovery` (`<= +6`), `EnhancePotions`, and `ReflectPhysical` in resource cost, potion healing, and damage reflection
  - Defender `DCI` (`defenseChanceIncreasePct`) properly applied in `computeHitChance()` and player avoidance using the canonical `2 * (100 + effectiveDci)` denominator
  - Complete 1H (`48,000`), 2H (`41,140`), and Shield (`(Parry - Bushido/4) / 400`) `CheckParry` formula from `BaseWeapon.cs`
  - Secondary-target `splashRatio` (`scalingFormula.splashRatio`) applied on multi-target cleave/splash abilities instead of dealing `100%` primary damage to all secondary targets
- [x] **SIM-07**: Align `src/sim/archetypes.ts` and `src/sim/engine.ts` with live UO Idle hunting bot, material, weapon, and hotbar rules:
  - Replace invented postures with canonical `[huntpostura` postures: `agressivo` (`+20%` outgoing damage, `+40%` incoming damage taken), `equilibrado` (`0%` / `0%`), and `defensivo` (`-40%` outgoing, `-20%` incoming) (with backward-compatible alias mapping)
  - Replace linear material interpolation in `buildMaterialTierBudget` with the live `+8%` weapon damage and `+12%` armor resistance/durability per material step ladder (`Copper` $\rightarrow$ `Valorite`)
  - Differentiate class-authentic base weapon speeds (`baseWeaponSpeedMs`) across Warrior, Mage, Ranger, Samurai, and Ninja (`weaponArchetypeCurves`: `fast_1h` `2.25s`, `balanced_1h` `2.50s`, `heavy_2h` `3.25s`)
  - Align hotbar auto-trigger evaluation with live `ro(e)`: heal potions at `hp <= 50%` (`15%`) / `<= 32%` (`25%`) / `<= 18%` (`35%`), mana potions at `mana <= 40%` (`15%`), active heals at `hp <= 50%` / `<= 40%`, and `GE` AoE skills at `enemies >= 3` (`zE(3)` when `targetCount >= 3`, or configurable AoE threshold)

### Unified Tick Kernel, 5-Class Parity Recalibration & Automated Test Suite

- [x] **SIM-08**: Refactor `src/sim/engine.ts` so `simulateScenarioDetailed` and `simulateMultiWavePull` share a unified tick-step combat kernel (eliminating the ~340-line loop duplication), and recalibrate Samurai/Ninja tuning & baseline snapshots (`baseline-v0.99.0.json`, `parity-5class-v0.99.0.json`, `gear-and-waves-v1.1.json`) so all 5 classes maintain $\pm 5\text{–}8\%$ parity across all 80 Mode A & Mode B scenarios.
- [x] **SIM-09**: Expand `tools/test_sim.ts` with deterministic unit tests covering every `v1.2` mathematical rule (`SDI <= 50%` cap, `DI <= 100%` cap, `SSI <= 60%` vs. `treeSpeedPct`, `LMC <= 40%`, `EnhancePotions`, `ReflectPhysical`, `agressivo`/`equilibrado`/`defensivo` postures, `+8%/+12%` material ladder, `splashRatio` on secondary targets, 1H/2H/Shield `CheckParry` divisors, `ro(e)` hotbar triggers, single-wave vs. 1-wave `simulateMultiWavePull` equivalence, and `2.25s / 2.50s / 3.25s` weapon speed archetypes).

### Workbench UI, Documentation Sync & Live GitHub Pages Redeployment

- [x] **UI-04**: Regenerate all 5 HTML workbenches (`mockups/*.html`, root `index.html`), Retina screenshots (`mockups/screenshots/*.png`), `design/BALANCE_REPORT.md`, `design/SAMURAI_SPEC.md`, and `design/NINJA_SPEC.md` with the high-fidelity `v1.2` simulation telemetry, pass all 7 verification gates (`npm run verify:all`), and redeploy to live GitHub Pages (`https://brbrainerd.github.io/uoIdle/`).

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| KB-05 | Phase 11 | Complete |
| KB-06 | Phase 11 | Complete |
| SIM-06 | Phase 12 | Complete |
| SIM-07 | Phase 12 | Complete |
| SIM-08 | Phase 13 | Complete |
| SIM-09 | Phase 13 | Complete |
| UI-04 | Phase 14 | Complete |

**Coverage:**
- v1.2 requirements: 7 total
- Mapped to phases: 7
- Unmapped: 0 ✓

---
*Requirements defined: 2026-11-07*
