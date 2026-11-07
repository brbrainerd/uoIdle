---
phase: 05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code
plan: 02
subsystem: class-design-ninja
tags: [ninja, ninjitsu, class-schema, mode-a, mode-b, simulation-parity, drop-in]
requires:
  - phase: 04-modernuo-reference-kb-baseline-combat-simulator
    provides: ModernUO Ninjitsu reference KB and deterministic combat simulation harness
provides:
  - Schema-validated drop-in Ninja (Ninjitsu) ClassDefinition JSON (design/drop-in/ninja.json)
  - Formal Ninja (Ninjitsu) class design specification (design/NINJA_SPEC.md) with Mode A/Mode B state machines and <20 LOC C# server hook
affects: [05-03, 06-01, 06-02]
tech-stack:
  added: []
  patterns: [dual-mode-class-specification, catalog-unlock-reconciliation, ninjitsu-stealth-detonation-loop]
key-files:
  created:
    - design/drop-in/ninja.json
    - design/NINJA_SPEC.md
  modified: []
key-decisions:
  - "Preserved raw catalog unlockLevel values (75, 1, 10, 5, 300, 200) on the 6 pre-existing ninja_* catalog entries while normalizing progressionTreeLevel onto the standard 12-milestone L1-60 curve (1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60) and adding ninja_shuriken as a 13th ability at progressionTreeLevel 35."
  - "Configured ninja_death, ninja_death_r2, and ninja_infectious_strike with top-level effectType: 'direct_damage' and statusEffect.effectType: 'dot' so src/sim/engine.ts executes the initial melee strike, applies the multi-tick DoT in Mode A, and arms the 5-swing delayed detonation in Mode B."
  - "Capped MirrorImage mitigation (-8% Rank I / -10% Rank II in Mode A; 1 ablative clone stack with 1500ms ICD in Mode B) to prevent avoidance-immortality loops while keeping ehpPerSec inside the physical baseline band."
patterns-established:
  - "Dual-Mode Ninjitsu Adaptation: Translates 2D spatial tile checks (DeathStrike 5 steps, KiAttack Euclidean distance) and depletable Tokuno consumables (SmokeBomb, Shuriken, Fukiya) into deterministic 1D swing counters and cooldown-gated Custom abilities."
requirements-completed: [CLASS-02, CLASS-03]
duration: 6min
completed: 2026-11-07
---

# Phase 05 Plan 02: Ninja (Ninjitsu) Skill Line Design & Drop-in JSON Summary

**Schema-validated Ninja (`Ninjitsu`, `classNumericId: 115`) drop-in class definition (`design/drop-in/ninja.json`) and formal Mode A / Mode B architecture specification (`design/NINJA_SPEC.md`) verified across `L10`, `L25`, `L45`, and `L60`.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-11-07T07:06:50Z
- **Completed:** 2026-11-07T07:12:50Z
- **Tasks:** 2
- **Files created:** 2

## Accomplishments

- Authored [`design/drop-in/ninja.json`](file:///Users/brbrainerd/dev/uoIdle/design/drop-in/ninja.json) (`id: "ninja"`, `classNumericId: 115`, `badge: "NJ"`, `robeHue: 1175`, `baseStats: STR 30 / DEX 50 / INT 10`), including 8 starter skills (`ninjitsu`, `fencing`, `tactics`, `hiding`, `stealth`, `anatomy`, `magicResist: 30`, `focus: 50`), 4 legacy template weights summing to `100`, 9 Tokuno Ninja paperdoll layers (`Kryss` `5121` with no shield), 5 seeded hotbar slots, 12 progression milestones (`L1..L60`), and 13 parity-tuned abilities preserving all 6 pre-existing `ninja_*` catalog IDs plus `ninja_shuriken` at `L35`.
- Verified `design/drop-in/ninja.json` against `ClassSchema` (`npx tsx tools/validate_skills.ts design/drop-in/ninja.json` $\rightarrow$ `{"ok":true,"classes":1,"catalogAbilities":134}`) and `tools/sim_balance.ts --extra-class design/drop-in/ninja.json --json`, reproducing the exact Mode A parity curve across all four brackets (`sustainedBossDps`: `7.28` at `L10`, `53.81` at `L25`, `190.26` at `L45`, `374.50` at `L60`; `ehpPerSec`: `15.55` / `45.90` / `149.46` / `325.83`).
- Authored [`design/NINJA_SPEC.md`](file:///Users/brbrainerd/dev/uoIdle/design/NINJA_SPEC.md) documenting the protected **Ablative Clone Mitigation / Stealth-State Opener / 5-Hit Delayed Detonation Assassin** niche, L1–60 progression table, all 8 Ninjitsu abilities (`FocusAttack`, `DeathStrike`, `AnimalForm`, `KiAttack`, `SurpriseAttack`, `Backstab`, `Shadowjump`, `MirrorImage`) plus Tokuno items (`SmokeBomb`, `EggBomb`, `Shuriken`, `Fukiya`), Mode A vs Mode B state machines, a 16-LOC C# server hook specification, Tokuno weapon synergies (`Kryss`, `Tekagi`, `Kama`, `Sai`, `Lajatang`, `Tessen`, `Bokuto`), and bilingual (`en` / `pt-BR`) i18n strings.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author `design/drop-in/ninja.json` and verify against `ClassSchema` and Mode A parity simulation** — `e22b969` (`feat`)
2. **Task 2: Author `design/NINJA_SPEC.md` with complete Ninjitsu class architecture, Mode A/Mode B state machines, bilingual i18n strings, and `<20 LOC` C# server hook specification** — `8b056a0` (`docs`)

## Files Created/Modified

- [`design/drop-in/ninja.json`](file:///Users/brbrainerd/dev/uoIdle/design/drop-in/ninja.json) — Schema-validated Ninja (`Ninjitsu`) `ClassDefinition` JSON with 12 L1–60 progression milestones and 13 parity-tuned abilities.
- [`design/NINJA_SPEC.md`](file:///Users/brbrainerd/dev/uoIdle/design/NINJA_SPEC.md) — Formal Ninja (`Ninjitsu`) class design specification covering role, starter kit, L1–60 skill line, Mode A & Mode B state machines, bilingual i18n strings, and `<20 LOC` C# server hook spec.

## Decisions Made

- Reconciled legacy pre-V3 catalog `unlock` tiers (`75, 1, 10, 5, 300, 200`) on `ninja_shadowjump`, `ninja_focus`, `ninja_mirror`, `ninja_death`, `ninja_mirror_r2`, and `ninja_death_r2` by preserving `unlockLevel` for raw catalog provenance while setting `progressionTreeLevel` to `1, 5, 10, 20, 50, 60` for L1–60 progression simulation, and included `ninja_shuriken` (`progressionTreeLevel: 35`) as a 13th ability alongside `ninja_smoke_bomb`.
- Used `effectType: "direct_damage"` with `statusEffect.effectType: "dot"` on `ninja_death`, `ninja_death_r2`, and `ninja_infectious_strike` so the simulation engine executes the initial weapon hit, applies the 3- or 4-tick DoT in Mode A, and triggers the 5-swing delayed detonation in Mode B.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

- Both Wave 1 plans (`05-01` Samurai and `05-02` Ninja) are complete and verified. Ready for Wave 2 (`05-03-PLAN.md`: `design/drop-in/items-bushido-ninjitsu.json`, `design/drop-in/classes-patch.js`, Mode B calibration in `src/sim/engine.ts`, 5-class `--verify` parity gates in `tools/validate_skills.ts` and `tools/sim_balance.ts`, and `design/BALANCE_REPORT.md`).

---
*Phase: 05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code*
*Completed: 2026-11-07*
