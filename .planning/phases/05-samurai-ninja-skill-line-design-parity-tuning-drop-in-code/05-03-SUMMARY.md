---
phase: 05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code
plan: 03
subsystem: drop-in-packaging-and-parity-verification
tags: [tokuno-items, classes-patch, validate-skills, sim-balance, mode-a, mode-b, balance-report]
requires:
  - phase: 05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code
    provides: Schema-validated Samurai (05-01) and Ninja (05-02) drop-in ClassDefinition JSON files and specifications
provides:
  - Tokuno weapon, consumable, armament, material tier, and affix catalog (design/drop-in/items-bushido-ninjitsu.json)
  - Copy-pasteable client/server bundle patch (design/drop-in/classes-patch.js)
  - Extended 5-class + Tokuno item schema validator (tools/validate_skills.ts --verify)
  - Calibrated Mode B engine hooks (src/sim/engine.ts) and 5-class Mode A/Mode B parity verifier (tools/sim_balance.ts --verify)
  - Frozen 5-class Mode A/Mode B parity telemetry artifact (data/sim-baselines/parity-5class-v0.99.0.json)
  - Comprehensive 5-class balance & parity proof report (design/BALANCE_REPORT.md)
affects: [06-01, 06-02]
tech-stack:
  added: []
  patterns: [mode-b-non-stacking-calibration, five-class-parity-envelope-gate, drop-in-bundle-table-patching]
key-files:
  created:
    - design/drop-in/items-bushido-ninjitsu.json
    - design/drop-in/classes-patch.js
    - data/sim-baselines/parity-5class-v0.99.0.json
    - design/BALANCE_REPORT.md
  modified:
    - tools/validate_skills.ts
    - src/sim/engine.ts
    - tools/sim_balance.ts
key-decisions:
  - "Scoped all Mode B calibration changes in src/sim/engine.ts strictly to mode === 'mode_b' so data/sim-baselines/baseline-v0.99.0.json remains 100% bit-for-bit identical in Mode A."
  - "Configured Mode B hooks (Perfection streak scaling capped at +12% with on-kill reset, CounterAttack 6s ICD scaled by 0.55x when counter stance buff is active, MirrorImage 1-clone stack with 10s ICD, and DeathStrike 5-swing detonation replacing the 4-tick Mode A DoT) to replace rather than double-stack with Mode A fallbacks."
  - "Enforced automated 5-class parity envelope gates in tools/sim_balance.ts --verify comparing L10/L25 physical melee classes against the live Warrior/Ranger physical DPS band and L45/L60 against the unified 3-class envelope across both Mode A and Mode B."
patterns-established:
  - "Drop-in Bundle Table Patching: Exports modular patch objects (_E, WE, yE, FE, mE, gE, b, qC, i18n) plus an idempotent applyDropInClassPatch(bundleTables) helper."
requirements-completed: [CLASS-04, SIM-03]
duration: 8min
completed: 2026-11-07
---

# Phase 05 Plan 03: Tokuno Itemization, Client/Server Bundle Patch & 5-Class Parity Verification Summary

**Drop-in Tokuno item catalog (`design/drop-in/items-bushido-ninjitsu.json`), syntax-verified client/server bundle patch (`design/drop-in/classes-patch.js`), calibrated Mode B simulation hooks, automated 5-class schema/parity CLI gates, and formal balance report (`design/BALANCE_REPORT.md`) proving $\pm 5\text{–}8\%$ parity across `L10..L60` in Mode A and Mode B.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-11-07T07:17:00Z
- **Completed:** 2026-11-07T07:25:16Z
- **Tasks:** 2
- **Files created/modified:** 7

## Accomplishments

- Authored [`design/drop-in/items-bushido-ninjitsu.json`](file:///Users/brbrainerd/dev/uoIdle/design/drop-in/items-bushido-ninjitsu.json) containing the 8 missing Tokuno weapon definitions (`Bokuto`, `Daisho`, `Lajatang`, `No-Dachi`, `Sai`, `Tekagi`, `Tessen`, `Wakizashi`), 4 Ninjitsu consumables/projectiles (`Smoke Bomb`, `Egg Bomb`, `Fukiya`, `Shuriken`), 8 iconic Tokuno armament profiles with `Iron..Valorite` damage tables, 9 material tiers, and 10 class-themed `bonusItem` / `arvoreBonus` affix definitions.
- Authored [`design/drop-in/classes-patch.js`](file:///Users/brbrainerd/dev/uoIdle/design/drop-in/classes-patch.js) (`node --check` verified) exporting `CLASS_METADATA_PATCH`, `STARTER_SKILLS_PATCH`, `STARTER_EQUIPMENT_PATCH`, `LEGACY_TEMPLATES_PATCH`, `SEEDED_HOTBAR_PATCH`, `PROGRESSION_TREE_PATCH`, `ABILITIES_CATALOG_PATCH`, `COMBAT_ESTIMATOR_PATCH`, `I18N_LOCALE_PATCH`, and `applyDropInClassPatch`.
- Extended [`tools/validate_skills.ts`](file:///Users/brbrainerd/dev/uoIdle/tools/validate_skills.ts) so `--verify` validates all 5 classes (`warrior`, `mage`, `ranger`, `samurai`, `ninja`), cross-checks the 12 pre-existing `samurai_*` / `ninja_*` catalog entries, and validates `design/drop-in/items-bushido-ninjitsu.json` (`{"ok":true,"classes":5,"catalogAbilities":134}`).
- Calibrated Mode B hooks in [`src/sim/engine.ts`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts) while keeping Mode A 100% untouched (`git diff data/sim-baselines/baseline-v0.99.0.json` empty), extended [`tools/sim_balance.ts`](file:///Users/brbrainerd/dev/uoIdle/tools/sim_balance.ts) with `--parity` and 5-class `--verify` gates, generated [`data/sim-baselines/parity-5class-v0.99.0.json`](file:///Users/brbrainerd/dev/uoIdle/data/sim-baselines/parity-5class-v0.99.0.json), and authored [`design/BALANCE_REPORT.md`](file:///Users/brbrainerd/dev/uoIdle/design/BALANCE_REPORT.md).

## Task Commits

Each task was committed atomically:

1. **Task 1: Author `design/drop-in/items-bushido-ninjitsu.json` and `design/drop-in/classes-patch.js`, and update `tools/validate_skills.ts` to validate all 5 classes and Tokuno items** — `29ada46` (`feat`)
2. **Task 2: Calibrate Mode B hooks in `src/sim/engine.ts`, extend `tools/sim_balance.ts` with 5-class Mode A/Mode B parity verification, generate `data/sim-baselines/parity-5class-v0.99.0.json`, and author `design/BALANCE_REPORT.md`** — `fc6596b` (`feat`)

## Files Created/Modified

- [`design/drop-in/items-bushido-ninjitsu.json`](file:///Users/brbrainerd/dev/uoIdle/design/drop-in/items-bushido-ninjitsu.json) — Complete Tokuno weapon, consumable, armament, material tier, and affix catalog.
- [`design/drop-in/classes-patch.js`](file:///Users/brbrainerd/dev/uoIdle/design/drop-in/classes-patch.js) — Copy-pasteable client/server JavaScript patch module for Samurai (`114`) and Ninja (`115`).
- [`tools/validate_skills.ts`](file:///Users/brbrainerd/dev/uoIdle/tools/validate_skills.ts) — Extended CLI schema validator checking all 5 classes and Tokuno item definitions under `--verify`.
- [`src/sim/engine.ts`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts) — Calibrated Mode B hooks for `Perfection`, `CounterAttack`, `MirrorImage`, and `DeathStrike`.
- [`tools/sim_balance.ts`](file:///Users/brbrainerd/dev/uoIdle/tools/sim_balance.ts) — Extended CLI simulator with `--parity`, `--write-parity`, and automated 5-class Mode A/Mode B parity envelope verification under `--verify`.
- [`data/sim-baselines/parity-5class-v0.99.0.json`](file:///Users/brbrainerd/dev/uoIdle/data/sim-baselines/parity-5class-v0.99.0.json) — Frozen 5-class Mode A (80 scenarios) and Mode B (80 scenarios) simulation baseline artifact.
- [`design/BALANCE_REPORT.md`](file:///Users/brbrainerd/dev/uoIdle/design/BALANCE_REPORT.md) — Formal 5-class numerical parity report covering Mode A, Mode B, per-archetype telemetry, resource economy, and anti-immortality verification.

## Decisions Made

- Preserved 100% bit-for-bit backward compatibility on `data/sim-baselines/baseline-v0.99.0.json` by gating all calibration changes in `src/sim/engine.ts` behind `mode === 'mode_b'` and verifying the 3-class baseline first inside `tools/sim_balance.ts --verify`.
- Eliminated Mode A + Mode B double-stacking by replacing `ninja_death` / `ninja_death_r2`'s 4-tick Mode A DoT with the 5-swing delayed detonation in Mode B and taking `Math.max(state.perfectionStreakBonusPct, buffPerfectionPct)` for Samurai `Perfection`.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

- Phase 5 (`05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code`) is 100% complete (`05-01`, `05-02`, `05-03`). Ready for Phase 6 (`06-visual-beta-ui-mockups-custom-iconography-final-deliverable-packaging`).

---
*Phase: 05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code*
*Completed: 2026-11-07*
