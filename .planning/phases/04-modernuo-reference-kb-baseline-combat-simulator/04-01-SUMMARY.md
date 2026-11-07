---
phase: 04-modernuo-reference-kb-baseline-combat-simulator
plan: 01
subsystem: mechanics-kb
tags: [modernuo, bushido, ninjitsu, knowledge-base, state-machine-mapping]

requires:
  - phase: 03-system-knowledge-base-engine-capabilities
    provides: mechanics KB linter (kb.py), engine-capability-matrix, class-structural-parity, combat-niches
provides:
  - 17 atomic ModernUO KB pages in mechanics/modernuo/ covering every Bushido, Ninjitsu, and Tokuno item C# file
  - 2 master class synthesis KB pages (mechanics/classes/modernuo-bushido.md, mechanics/classes/modernuo-ninjitsu.md)
  - Rebuilt mechanics/INDEX.md with 31 verified KB pages and 0 errors
  - design/MODERNUO_MAPPING.md translating Bushido and Ninjitsu mechanics to Mode A (Data-Only) and Mode B (Surgical <20 LOC C# Hook) UO Idle primitives
affects: [05-class-architecture-balance-blueprints, 06-patch-generation-validation-pipeline]

actuals:
  tokens: 18500
  tasks: 2
  commits: 2

tech-stack:
  added: []
  patterns:
    - "ModernUO C# claim verification via [modernuo-stated] status rank and verbatim source[0] line spans"
    - "Dual-track Mode A (pure JSON) and Mode B (<20 LOC surgical C# hook) mechanic adaptation matrices"

key-files:
  created:
    - mechanics/modernuo/bushido-perfection-honor.md
    - mechanics/modernuo/bushido-honorable-execution.md
    - mechanics/modernuo/bushido-confidence.md
    - mechanics/modernuo/bushido-counter-attack.md
    - mechanics/modernuo/bushido-lightning-strike.md
    - mechanics/modernuo/bushido-evasion.md
    - mechanics/modernuo/bushido-momentum-strike.md
    - mechanics/modernuo/ninjitsu-mirror-image.md
    - mechanics/modernuo/ninjitsu-focus-attack.md
    - mechanics/modernuo/ninjitsu-backstab.md
    - mechanics/modernuo/ninjitsu-stealth-hiding.md
    - mechanics/modernuo/ninjitsu-shadowjump.md
    - mechanics/modernuo/ninjitsu-surprise-attack.md
    - mechanics/modernuo/ninjitsu-ki-attack.md
    - mechanics/modernuo/ninjitsu-death-strike.md
    - mechanics/modernuo/ninjitsu-animal-form.md
    - mechanics/modernuo/ninjitsu-items.md
    - mechanics/classes/modernuo-bushido.md
    - mechanics/classes/modernuo-ninjitsu.md
    - design/MODERNUO_MAPPING.md
  modified:
    - mechanics/INDEX.md

key-decisions:
  - "Mapped ModernUO Weapon Parry (BaseWeapon.cs shield vs two-handed vs one-handed Bushido divisor) to passive block/evasion and Counter Attack reactive windows in UO Idle"
  - "Reconciled all 12 pre-existing samurai_* and ninja_* prototype entries in abilities-catalog.json against canonical ModernUO Bushido/Ninjitsu formulas and normalized their unlock tiers to L1-L60 gE milestones"
  - "Provided both Mode A (zero C# changes) and Mode B (<20 LOC surgical C# hook) implementations for all 8 Bushido mechanics, 9 Ninjitsu mechanics, and 4 Tokuno Ninjitsu items"

patterns-established:
  - "ModernUO KB pages anchor primary claims exclusively to sources[0] with [modernuo-stated] status and cross-link companion C# files in ## Related"
  - "Spatial/tile/stealth mechanics from ModernUO translate to deterministic time-window buffs, evasion/parry triggers, and debuff-conditional damage multipliers in UO Idle's 100ms tick loop"

requirements-completed: [SIM-01]

coverage:
  - id: D1
    description: "17 atomic mechanics/modernuo/*.md pages and 2 master synthesis pages (modernuo-bushido.md, modernuo-ninjitsu.md) verified by kb.py check with 31 pages and 0 errors"
    requirement: SIM-01
    verification:
      - kind: integration
        ref: "python3 mechanics/tools/kb.py check --root mechanics"
        status: pass
    human_judgment: false
  - id: D2
    description: "design/MODERNUO_MAPPING.md Mode A and Mode B state-machine adaptation specification covering 8 Bushido mechanics, 9 Ninjitsu mechanics, 4 Tokuno items, and 12 pre-existing catalog prototypes"
    requirement: SIM-01
    verification:
      - kind: other
        ref: "test -f design/MODERNUO_MAPPING.md && grep -q 'Weapon Parry' design/MODERNUO_MAPPING.md && grep -q 'Mode A' design/MODERNUO_MAPPING.md && grep -q 'Mode B' design/MODERNUO_MAPPING.md"
        status: pass
    human_judgment: false

duration: 12min
completed: 2026-11-06
status: complete
---

# Phase 4 Plan 01: ModernUO Reference KB & State-Machine Adaptation Spec Summary

**19 citation-verified ModernUO Bushido/Ninjitsu KB pages passing `kb.py check` (31 pages, 0 errors) plus `design/MODERNUO_MAPPING.md` translating spatial/stealth/parry mechanics into Mode A (pure JSON) and Mode B (`<20 LOC` C# hook) UO Idle primitives**

## Performance

- **Duration:** 12 min
- **Started:** 2026-11-07T05:40:43Z
- **Completed:** 2026-11-07T05:53:50Z
- **Tasks:** 2
- **Files modified:** 21

## Accomplishments
- Authored 17 atomic KB pages in [mechanics/modernuo/](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo) covering every ModernUO Bushido, Ninjitsu, and Tokuno item C# source file in `mechanics/_raw/modernuo/`, plus 2 master class synthesis pages ([modernuo-bushido.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/classes/modernuo-bushido.md) and [modernuo-ninjitsu.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/classes/modernuo-ninjitsu.md)).
- Rebuilt [mechanics/INDEX.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/INDEX.md) and verified the entire 31-page knowledge base passes `python3 mechanics/tools/kb.py --self-test` and `python3 mechanics/tools/kb.py check --root mechanics` with 0 errors.
- Authored [design/MODERNUO_MAPPING.md](file:///Users/brbrainerd/dev/uoIdle/design/MODERNUO_MAPPING.md) mapping all 8 Bushido mechanics (including Weapon Parry), 9 Ninjitsu mechanics, and 4 Tokuno Ninjitsu items into both Mode A (data-only JSON) and Mode B (`<20 LOC` surgical C# hook) UO Idle combat primitives, and reconciling all 12 pre-existing `samurai_*` and `ninja_*` prototype entries in `abilities-catalog.json`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author 17 atomic `mechanics/modernuo/*.md` pages and 2 master class synthesis pages** - `088c210` (feat)
2. **Task 2: Author `design/MODERNUO_MAPPING.md` Mode A & Mode B state-machine adaptation spec** - `73a74f4` (docs)

## Files Created/Modified
- [bushido-perfection-honor.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/bushido-perfection-honor.md) - Perfection streak bonus and Honor Virtue lifecycle claims from `HonorVirtue.cs`
- [bushido-honorable-execution.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/bushido-honorable-execution.md) - Honorable Execution swing speed buff and failure penalty claims from `HonorableExecution.cs`
- [bushido-confidence.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/bushido-confidence.md) - Confidence parry-triggered heal/stamina and regen aura claims from `Confidence.cs`
- [bushido-counter-attack.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/bushido-counter-attack.md) - Counter Attack stance and parry counter-swing claims from `CounterAttack.cs`
- [bushido-lightning-strike.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/bushido-lightning-strike.md) - Lightning Strike accuracy bonus and critical scaling claims from `LightningStrike.cs`
- [bushido-evasion.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/bushido-evasion.md) - Evasion spell-parry and parry modifier scaling claims from `Evasion.cs`
- [bushido-momentum-strike.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/bushido-momentum-strike.md) - Momentum Strike two-target cleave and transfer damage bonus claims from `MomentumStrike.cs`
- [ninjitsu-mirror-image.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/ninjitsu-mirror-image.md) - Mirror Image clone spell and Clone AI claims from `MirrorImage.cs`
- [ninjitsu-focus-attack.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/ninjitsu-focus-attack.md) - Focus Attack weapon scalar and hit-effect multiplier claims from `FocusAttack.cs`
- [ninjitsu-backstab.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/ninjitsu-backstab.md) - Backstab stealth strike and Stalking bonus claims from `Backstab.cs`
- [ninjitsu-stealth-hiding.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/ninjitsu-stealth-hiding.md) - Stealth step budget and Hiding combat check claims from `Stealth.cs`
- [ninjitsu-shadowjump.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/ninjitsu-shadowjump.md) - Shadowjump stealth teleport claims from `Shadowjump.cs`
- [ninjitsu-surprise-attack.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/ninjitsu-surprise-attack.md) - Surprise Attack defense-penalty debuff claims from `SurpriseAttack.cs`
- [ninjitsu-ki-attack.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/ninjitsu-ki-attack.md) - Ki Attack distance-scaled damage bonus claims from `KiAttack.cs`
- [ninjitsu-death-strike.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/ninjitsu-death-strike.md) - Death Strike delayed step/timer damage formula claims from `DeathStrike.cs`
- [ninjitsu-animal-form.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/ninjitsu-animal-form.md) - Animal Form polymorph speed/stealth/combat bonuses from `AnimalForm.cs`
- [ninjitsu-items.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/modernuo/ninjitsu-items.md) - Fukiya, Shuriken, SmokeBomb, and EggBomb item mechanics from `Fukiya.cs`
- [modernuo-bushido.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/classes/modernuo-bushido.md) - Master Bushido & Weapon Parry synthesis page anchored to `BaseWeapon.cs`
- [modernuo-ninjitsu.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/classes/modernuo-ninjitsu.md) - Master Ninjitsu synthesis page anchored to `NinjaMove.cs`
- [INDEX.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/INDEX.md) - Rebuilt KB index with all 31 pages
- [MODERNUO_MAPPING.md](file:///Users/brbrainerd/dev/uoIdle/design/MODERNUO_MAPPING.md) - Mode A & Mode B state-machine adaptation matrix and 12-milestone progression blueprints for Samurai and Ninja

## Decisions Made
- Anchored `mechanics/classes/modernuo-bushido.md` to `BaseWeapon.cs` so the canonical ModernUO Bushido Weapon Parry formula (shield penalty vs one-handed `48000` vs two-handed `41140` divisor) is verified directly against C# source lines.
- Preserved verbatim C# string and tab characters in KB claim quotes because `kb.py`'s regex extracts raw quotes without JSON-unescaping backslashes.
- Reconciled all 12 pre-existing `samurai_*` and `ninja_*` prototype entries in `abilities-catalog.json` by mapping their legacy unlock tiers (`1, 5, 10, 75, 200, 300`) into standard 12-milestone `L1..L60` class progressions while documenting both Mode A (pure JSON) and Mode B (`<20 LOC` surgical C# hook) implementations.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Initial `kb.py check` flagged 4 quotes that had escaped `\"` or `\\t` sequences and 1 off-by-one closing brace line number (`L35-L45` vs `L35-L46` in `ninjitsu-death-strike.md`). Replaced escaped characters with literal `"` and `\t` and updated the line span to `L35-L46`, after which `kb.py check` passed with 31 pages and 0 errors.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 4 Plan 01 (`SIM-01`) complete; all 19 ModernUO KB pages and `design/MODERNUO_MAPPING.md` are committed and ready for Phase 5 class architecture and balance blueprint authoring.

---
*Phase: 04-modernuo-reference-kb-baseline-combat-simulator*
*Completed: 2026-11-06*
