---
phase: 07-idle-ability-overhaul-lore-blurbs-and-sim-tests
plan: 01
subsystem: class-design-and-sim
tags: [bushido, ninjitsu, idle-combat, lore, simulator, unit-tests]
provides:
  - "Upgraded Samurai & Ninja idle-combat synergies and bilingual lore blurbs (`design/drop-in/samurai.json`, `design/drop-in/ninja.json`, `design/drop-in/classes-patch.js`)"
  - "Extended v1.1 gear, affix, damage-breakdown, rotation timeline, and 10-wave dungeon pull simulation (`data/sim-baselines/gear-and-waves-v1.1.json`)"
  - "Deterministic simulator unit test suite (`tools/test_sim.ts`, 11/11 passing)"
affects: [phase-08, phase-09, phase-10]
key-files:
  created:
    - tools/test_sim.ts
    - data/sim-baselines/gear-and-waves-v1.1.json
  modified:
    - design/drop-in/samurai.json
    - design/drop-in/ninja.json
    - design/drop-in/classes-patch.js
    - design/SAMURAI_SPEC.md
    - design/NINJA_SPEC.md
    - design/BALANCE_REPORT.md
    - src/sim/types.ts
    - src/sim/archetypes.ts
    - src/sim/engine.ts
    - tools/sim_balance.ts
    - package.json
completed: 2026-11-07
---

# Phase 7 Plan 01 Summary

## Accomplishments
- **Idle-Game Ability Synergies (`IDLE-01`):** Upgraded `samurai_confidence` (*Inner Calm* `+3%` evasion/parry + Mode B on-parry HP/Stamina restore), `samurai_evasion` (*Evasion & Iaido Riposte*), `ninja_animal_form` (*Kitsune & Wolf Aspect* `+10%` attack speed, `+3%` evasion + Mode B 3rd-swing Spirit Claw slash), and `ninja_smoke_bomb` (*Vanish & Volley* `ninja_shuriken` cooldown acceleration).
- **Evocative Bilingual Lore Blurbs (`IDLE-02`):** Authored rich `en` and `pt-BR` Tokuno martial lore and mechanical descriptions across all 12 Samurai milestones, 12 Ninja milestones, and 25 catalog abilities in `samurai.json`, `ninja.json`, and `classes-patch.js`.
- **Gear, Affix & Multi-Wave Simulation Suite (`SIM-04`):** Extended `src/sim/engine.ts` and `tools/sim_balance.ts` to generate and verify `data/sim-baselines/gear-and-waves-v1.1.json` (5-channel damage breakdowns, 9 metal tiers `Iron..Valorite`, 5 Tokuno affix loadouts, 10-wave consecutive dungeon pulls, and 20s tick-by-tick rotation timelines).
- **Deterministic Unit Test Suite (`SIM-05`):** Created `tools/test_sim.ts` (`npm run test:sim`) with 11 test suites covering every combat formula and edge case (`{"ok":true,"passed":11,"failed":0}`).
