---
phase: 14-workbench-sync-and-github-pages-redeploy
plan: 01
subsystem: workbench-and-docs
tags:
  - workbench
  - documentation
  - simulator-fidelity
  - weapon-speed-archetypes
provides:
  - "Synchronized BALANCE_REPORT.md, SAMURAI_SPEC.md, NINJA_SPEC.md, and README.md with v1.2 baselines and Law 8 Weapon Swing Speed Archetypes"
  - "Rebuilt 5 standalone HTML workbenches and 4 Retina screenshots"
  - "Modular npm build/verify scripts in package.json"
key-files:
  modified:
    - "src/sim/engine.ts"
    - "src/sim/archetypes.ts"
    - "src/sim/types.ts"
    - "tools/sim_balance.ts"
    - "tools/test_sim.ts"
    - "design/drop-in/classes-patch.js"
    - "design/drop-in/samurai.json"
    - "design/drop-in/ninja.json"
    - "design/BALANCE_REPORT.md"
    - "design/SAMURAI_SPEC.md"
    - "design/NINJA_SPEC.md"
    - "README.md"
    - "package.json"
completed: 2026-11-07
---

# Phase 14 Plan 01: Workbench UI & Documentation Sync, Live GitHub Pages Redeploy & Final Audit Summary

## Accomplishments

- **Weapon Swing Speed Archetypes & Spec Synchronization (`UI-04`, `SIM-06`–`SIM-09`)**:
  - Added `weaponArchetypeCurves` (`fast_1h` `2.25s`, `balanced_1h` `2.50s`, `heavy_2h` `3.25s`) to [`src/sim/types.ts`](file:///Users/brbrainerd/dev/uoIdle/src/sim/types.ts), [`src/sim/archetypes.ts`](file:///Users/brbrainerd/dev/uoIdle/src/sim/archetypes.ts), and [`src/sim/engine.ts`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts), verified in [`tools/sim_balance.ts`](file:///Users/brbrainerd/dev/uoIdle/tools/sim_balance.ts) and [`tools/test_sim.ts`](file:///Users/brbrainerd/dev/uoIdle/tools/test_sim.ts) (`16/16` unit tests).
  - Updated [`design/BALANCE_REPORT.md`](file:///Users/brbrainerd/dev/uoIdle/design/BALANCE_REPORT.md), [`design/SAMURAI_SPEC.md`](file:///Users/brbrainerd/dev/uoIdle/design/SAMURAI_SPEC.md), [`design/NINJA_SPEC.md`](file:///Users/brbrainerd/dev/uoIdle/design/NINJA_SPEC.md), and [`README.md`](file:///Users/brbrainerd/dev/uoIdle/README.md) with all `v1.2` tables and Law 8 weapon speed trade-offs.
- **Workbench Rebuild & 7-Gate Verification (`UI-04`)**:
  - Rebuilt all 5 HTML workbenches and 4 Retina screenshots via `npm run build:mockups` and verified `npm run verify:all` (`7/7` gates passing).
