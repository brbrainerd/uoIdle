---
phase: 05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code
plan: 01
subsystem: class-design-samurai
tags: [samurai, bushido, class-schema, mode-a, mode-b, simulation-parity, drop-in]
requires:
  - phase: 04-modernuo-reference-kb-baseline-combat-simulator
    provides: ModernUO Bushido reference KB and deterministic combat simulation harness
provides:
  - Schema-validated drop-in Samurai (Bushido) ClassDefinition JSON (design/drop-in/samurai.json)
  - Formal Samurai (Bushido) class design specification (design/SAMURAI_SPEC.md) with Mode A/Mode B state machines and <20 LOC C# server hook
affects: [05-02, 05-03]
tech-stack:
  added: []
  patterns: [dual-mode-class-specification, catalog-unlock-reconciliation, bushido-parry-counter-loop]
key-files:
  created:
    - design/drop-in/samurai.json
    - design/SAMURAI_SPEC.md
  modified: []
key-decisions:
  - "Preserved raw catalog unlockLevel values (75, 1, 10, 5, 300, 200) on the 6 pre-existing samurai_* catalog entries while normalizing progressionTreeLevel onto the standard 12-milestone L1-60 curve (1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60)."
  - "Adapted HonorableExecution (ref 400) for 24/7 AFK hunting by replacing the canonical -40 all-resistance failure penalty with a threshold execute multiplier (1.85x at <=35% HP in Rank I, 1.95x in Rank II) and +15%/+12% attack speed buffs."
  - "Kept Confidence (ref 401) statusEffect null in Mode A with a 0.02x Bushido emergency heal scalar to prevent double-stacking with Samurai's built-in +8% Bushido weapon-parry mitigation in ehpPerSec."
patterns-established:
  - "Dual-Mode Ability Specification: Every class ability documents both Mode A (100% existing engine opcodes) and Mode B (<20 LOC C# server hook)."
requirements-completed: [CLASS-01, CLASS-03]
duration: 6min
completed: 2026-11-07
---

# Phase 05 Plan 01: Samurai (Bushido) Skill Line Design & Drop-in JSON Summary

**Schema-validated Samurai (`Bushido`, `classNumericId: 114`) drop-in class definition (`design/drop-in/samurai.json`) and formal Mode A / Mode B architecture specification (`design/SAMURAI_SPEC.md`) verified across `L10`, `L25`, `L45`, and `L60`.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-11-07T06:59:30Z
- **Completed:** 2026-11-07T07:05:30Z
- **Tasks:** 2
- **Files created:** 2

## Accomplishments

- Authored [`design/drop-in/samurai.json`](file:///Users/brbrainerd/dev/uoIdle/design/drop-in/samurai.json) (`id: "samurai"`, `classNumericId: 114`, `badge: "SM"`, `robeHue: 1884`, `baseStats: STR 50 / DEX 30 / INT 10`), including 8 starter skills (`bushido`, `swords`, `tactics`, `parry`, `anatomy`, `healing`, `magicResist: 30`, `focus: 50`), 4 legacy template weights summing to `100`, 8 Tokuno Samurai paperdoll layers (`Katana` `5119` with no shield), 5 seeded hotbar slots, 12 progression milestones (`L1..L60`), and 12 parity-tuned abilities preserving all 6 pre-existing `samurai_*` catalog IDs.
- Verified `design/drop-in/samurai.json` against `ClassSchema` (`npx tsx tools/validate_skills.ts design/drop-in/samurai.json` $\rightarrow$ `{"ok":true,"classes":1,"catalogAbilities":134}`) and `tools/sim_balance.ts --extra-class design/drop-in/samurai.json --json`, reproducing the exact Mode A parity curve across all four brackets (`sustainedBossDps`: `7.26` at `L10`, `47.99` at `L25`, `169.23` at `L45`, `358.21` at `L60`; `ehpPerSec`: `15.67` / `53.24` / `147.95` / `316.89`).
- Authored [`design/SAMURAI_SPEC.md`](file:///Users/brbrainerd/dev/uoIdle/design/SAMURAI_SPEC.md) documenting the protected **Perfection Ramp / Weapon Parry-Counter / Execute Duelist** niche, L1–60 progression table, all 8 Bushido mechanics (`Weapon Parry`, `Perfection & Honor`, `HonorableExecution`, `Confidence`, `CounterAttack`, `LightningStrike`, `Evasion`, `MomentumStrike`), Mode A vs Mode B state machines, a 17-LOC C# server hook specification, Tokuno weapon synergies (`Katana`, `No-Dachi`, `Daisho`, `Wakizashi`, `Bokuto`, `Lajatang`, `Tessen`), and bilingual (`en` / `pt-BR`) i18n strings.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author `design/drop-in/samurai.json` and verify against `ClassSchema` and Mode A parity simulation** — `c5df48e` (`feat`)
2. **Task 2: Author `design/SAMURAI_SPEC.md` with complete Bushido class architecture, Mode A/Mode B state machines, bilingual i18n strings, and `<20 LOC` C# server hook specification** — `bf8dd1d` (`docs`)

## Files Created/Modified

- [`design/drop-in/samurai.json`](file:///Users/brbrainerd/dev/uoIdle/design/drop-in/samurai.json) — Schema-validated Samurai (`Bushido`) `ClassDefinition` JSON with 12 L1–60 progression milestones and 12 parity-tuned abilities.
- [`design/SAMURAI_SPEC.md`](file:///Users/brbrainerd/dev/uoIdle/design/SAMURAI_SPEC.md) — Formal Samurai (`Bushido`) class design specification covering role, starter kit, L1–60 skill line, Mode A & Mode B state machines, bilingual i18n strings, and `<20 LOC` C# server hook spec.

## Decisions Made

- Reconciled legacy pre-V3 catalog `unlock` tiers (`75, 1, 10, 5, 300, 200`) on `samurai_way`, `samurai_lightning`, `samurai_honorable`, `samurai_counter`, `samurai_lightning_r2`, and `samurai_honorable_r2` by preserving `unlockLevel` for raw catalog provenance while setting `progressionTreeLevel` to `1, 5, 15, 25, 50, 60` for L1–60 progression simulation.
- Replaced `HonorableExecution`'s lethal `-40` all-resistance failure penalty with `executeThresholdHpPct: 35` (`1.85x` Rank I / `1.95x` Rank II) and haste buffs (`+15%` / `+12%` `attack_speed_pct`) so AFK boss encounters remain safe.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

- `design/drop-in/samurai.json` and `design/SAMURAI_SPEC.md` are complete and verified, ready for Plan `05-02` (Ninja `ninja.json`, `NINJA_SPEC.md`, and `items-bushido-ninjitsu.json`) and Plan `05-03` (5-class Mode A/Mode B parity verification, `classes-patch.js`, and `BALANCE_REPORT.md`).

---
*Phase: 05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code*
*Completed: 2026-11-07*
