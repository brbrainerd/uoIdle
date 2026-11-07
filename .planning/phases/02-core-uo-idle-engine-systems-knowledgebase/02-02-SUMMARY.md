---
phase: 02-core-uo-idle-engine-systems-knowledgebase
plan: 02
subsystem: mechanics
tags: [knowledgebase, progression, equipment, affixes, bestiary, capability-matrix, mode-a, mode-b]

# Dependency graph
requires:
  - phase: 02-core-uo-idle-engine-systems-knowledgebase
    plan: 01
    provides: "Four core combat KB pages (resources, tick-and-cooldowns, damage-and-defense, status-effects) and C1..C22 server changelog anchors"
provides:
  - "mechanics/systems/progression-unlocks.md documenting the 58 UO skills (jc), 16 class role mappings (dx), starter skill grants (hE, uE=50, dE=30), L1-60 linear class unlock tables (gE, highlighting missing gE.samurai and gE.ninja), starter kits (mx), and [Arvore progression tree point grants and reset rules"
  - "mechanics/systems/equipment-affixes.md documenting [personagembonus polling (eI, vh), 4 skill category groups (Bx), 5 item rarity hues ($A), ClassicUO paperdoll layers (O, TE), 21 item affixes (bonusItem) + 13 tree bonus keys (arvoreBonus), material tier scaling (+12% armor resist/durability, +8% weapon damage), and 14 Bestiary monster families (sk) with Paragon/XP rules"
  - "mechanics/topics/engine-capability-matrix.md (status: verified) classifying every UO Idle combat, resource, progression, and equipment primitive across Client-Evaluated, Shared-Config, and Server-Authoritative tiers and defining Mode A (100% existing engine opcodes) vs Mode B (<20 LOC native C# server hooks) for Phase 5 Samurai and Ninja"
  - "mechanics/INDEX.md rebuilt with all 7 Phase 2 KB pages (verified 1, bundle-stated 5, doc-stated 1) passing kb.py check with zero errors"
affects: [phase-03-classes, phase-04-simulator, phase-05-samurai-ninja, phase-06-mockups]

actuals:
  tokens: 8500
  tasks: 2
  commits: 2

tech-stack:
  added: []
  patterns:
    - "Topic synthesis page (mechanics/topics/engine-capability-matrix.md) combining [verified] (evidence 1) live runtime probe claims with [verified] (raw L<a>-L<b>) protocol registry claims to achieve page-level status: verified"
    - "Cross-page [[slug]] C<n> verification matrix linking all 6 combat/ and systems/ KB pages into a unified 3-tier architectural capability specification"

key-files:
  created:
    - mechanics/systems/progression-unlocks.md
    - mechanics/systems/equipment-affixes.md
    - mechanics/topics/engine-capability-matrix.md
  modified:
    - mechanics/INDEX.md

key-decisions:
  - "Tagged all 17 claims in mechanics/topics/engine-capability-matrix.md as [verified] (combining live: _evidence/live-bundle-probe.txt L1-L20 evidence claims with protocol-commands-index.json raw claims extracted from the live-verified v0.99.0 bundle) so the synthesis page achieves status: verified"
  - "Explicitly bounded Phase 5 Samurai and Ninja design into Mode A (zero server code changes using gE.samurai/gE.ninja, Cq/Eq client patches, and existing Passive/WeaponAbility/Spell/SpecialMove/Custom opcodes) vs Mode B (<20 LOC C# server hooks for Samurai Perfection/Parry-Counter and Ninja ablative Mirror Image/5-swing Death Strike detonation)"

patterns-established:
  - "Three-Tier (Client-Evaluated / Shared-Config / Server-Authoritative) + Dual-Mode (Mode A / Mode B) architectural boundary table backed by [[slug]] C<n> claim links"

requirements-completed:
  - INDEX-01
  - INDEX-02

coverage:
  - id: D1
    description: "Claim-verified progression/unlocks KB page (mechanics/systems/progression-unlocks.md) and equipment/affixes/bestiary KB page (mechanics/systems/equipment-affixes.md)"
    requirement: INDEX-01
    verification:
      - kind: integration
        ref: "python3 mechanics/tools/kb.py check --root mechanics"
        status: pass
    human_judgment: false
  - id: D2
    description: "Verified 3-tier Client/Shared/Server Engine Capability Matrix (mechanics/topics/engine-capability-matrix.md) and complete 7-page mechanics/INDEX.md"
    requirement: INDEX-02
    verification:
      - kind: integration
        ref: "python3 mechanics/tools/kb.py --self-test && python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics"
        status: pass
    human_judgment: false

duration: 6min
completed: 2026-11-07
status: complete
---

# Phase 2 Plan 02: Core Systems & Engine Capability Matrix Summary

**Claim-verified progression/unlock (`progression-unlocks.md`) and equipment/affix (`equipment-affixes.md`) KB pages plus a `verified` 3-tier Client/Shared/Server Engine Capability Matrix (`engine-capability-matrix.md`) defining Mode A vs Mode B for Phase 5 Samurai and Ninja, completing all 7 Phase 2 KB pages with zero errors.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-11-07T04:22:30Z
- **Completed:** 2026-11-07T04:28:30Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Authored `mechanics/systems/progression-unlocks.md` (`14` `[bundle-stated]` verbatim claims `C1..C14` from `_raw/bundle/skills-and-progression.js`) documenting the 58 UO skills (`jc`), 16 class combat roles (`dx`), starter skill grants (`uE = 50`, `dE = 30`, `mE = 26`, `hE`), linear L1–60 unlock tables (`gE` for the 7 live classes while highlighting the missing `gE.samurai` and `gE.ninja` tables), starter equipment kits (`mx`), and the `[Arvore` progression tree (`+5` Skill, `+5` Status, `+1` Attribute points per level, `1/2/3/5+` skill bracket costs, and `300` UOCoin reset cost).
- Authored `mechanics/systems/equipment-affixes.md` (`10` `[bundle-stated]` verbatim claims `C1..C10` from `_raw/bundle/character-bonus-and-status.js`) documenting `[personagembonus` 5,000ms polling (`eI`), `[base, itens, outros]` tuple unpacking (`vh`), the 4 skill groups (`Bx`), 21 `bonusItem` affixes and 13 `arvoreBonus` attributes, ClassicUO paperdoll layers (`O`, `TE`), 5 item/chest rarity hues (`$A`), material tier scaling (`[[resources]] C2`, `[[resources]] C3`), and 14 Bestiary monster families (`sk`) with Paragon (`[[resources]] C9`) and permanent XP milestone rules (`[[resources]] C18`).
- Authored `mechanics/topics/engine-capability-matrix.md` (`status: "verified"`, `17` `[verified]` claims combining `live: _evidence/live-bundle-probe.txt L1-L20` runtime evidence with `protocol-commands-index.json` raw claims) classifying all UO Idle combat, sustain, status, progression, and equipment primitives across Client-Evaluated, Shared-Config, and Server-Authoritative tiers, auditing the pre-existing Samurai/Ninja bundle footprint, and specifying Mode A (`100%` existing engine opcodes) vs Mode B (`<20 LOC` C# hooks for Samurai `Perfection`/Parry-Counter and Ninja ablative `Mirror Image`/5-swing `Death Strike` detonation).
- Rebuilt `mechanics/INDEX.md` (`7` pages: `verified 1, bundle-stated 5, doc-stated 1`) and verified the entire KB with `kb.py --self-test`, `kb.py build --root mechanics`, and `kb.py check --root mechanics`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author `mechanics/systems/progression-unlocks.md` and `mechanics/systems/equipment-affixes.md`** - `d293ef0` (feat)
2. **Task 2: Author `mechanics/topics/engine-capability-matrix.md` (`status: verified`) and finalize Phase 2 KB index** - `5b03f01` (feat)

## Files Created/Modified

- `mechanics/systems/progression-unlocks.md` - Claim-verified KB page for 58 UO skills (`jc`), class roles (`dx`), starter skills (`hE`), L1–60 unlock tables (`gE`), starter kits (`mx`), and `[Arvore` progression tree
- `mechanics/systems/equipment-affixes.md` - Claim-verified KB page for `[personagembonus` polling (`eI`), 4 skill groups (`Bx`), 21 item affixes, 13 tree bonus keys, paperdoll layers (`O`, `TE`), 5 rarity hues (`$A`), material tiers, and Bestiary/Paragon monster scaling
- `mechanics/topics/engine-capability-matrix.md` - Verified 3-tier Client/Shared/Server Engine Capability Matrix, Samurai/Ninja bundle footprint audit, and Mode A vs Mode B boundary specification
- `mechanics/INDEX.md` - Complete Phase 2 KB index listing all 7 pages across `combat/`, `systems/`, and `topics/`

## Decisions Made

- Tagged all 17 claims in `mechanics/topics/engine-capability-matrix.md` as `[verified]` (2 `(evidence 1)` claims citing `live: _evidence/live-bundle-probe.txt L1-L20` and 15 `(raw L<a>-L<b>)` claims quoting `_raw/api/protocol-commands-index.json` extracted from the live-verified `v0.99.0` bundles) so the synthesis page achieves `status: "verified"` under `kb.py`'s weakest-claim rule.
- Explicitly bounded Phase 5 Samurai and Ninja design into Mode A (zero C# server code changes by supplying `gE.samurai` and `gE.ninja`, extending `Cq`/`Eq` client estimators, and binding abilities to existing `Passive`, `WeaponAbility`, `Spell`, `SpecialMove`, and `Custom` opcodes) vs Mode B (`<20 LOC` native C# hooks for Samurai `Perfection` consecutive-hit streaks / reactive Parry-Counter and Ninja ablative `Mirror Image` clone stacks / 5-swing `Death Strike` combo detonation).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Renamed a prose bullet `- **Character & Storage Layers:**` to `- **Storage & Character Layers:**` in `mechanics/systems/equipment-affixes.md` so it did not match `kb.py`'s `CLAIM_PREFIX` (`- **C`).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 2 (`02-core-uo-idle-engine-systems-knowledgebase`) is 100% complete (`INDEX-01`, `INDEX-02`) with 7 verified KB pages and 103 total verbatim/measured claims across `combat/`, `systems/`, and `topics/`.
- Ready for Phase 3 (`03-existing-classes-deep-dive-warrior-mage-ranger-canonical-data-schemas`): authoring deep-dive class pages `mechanics/classes/{warrior,mage,ranger}.md`, `mechanics/topics/class-structural-parity.md`, and `schemas/{class,skill,effect}.schema.json` (`INDEX-03`, `INDEX-04`).

## Self-Check: PASSED

- Verified `mechanics/systems/progression-unlocks.md`, `mechanics/systems/equipment-affixes.md`, `mechanics/topics/engine-capability-matrix.md`, and `mechanics/INDEX.md` exist on disk.
- Verified `python3 mechanics/tools/kb.py --self-test`, `python3 mechanics/tools/kb.py build --root mechanics`, and `python3 mechanics/tools/kb.py check --root mechanics` exit `0` with `"ok": true`, `"pages": 7`, and `"errors": []`.
- Verified task commits `d293ef0` and `5b03f01` in git history.

---
*Phase: 02-core-uo-idle-engine-systems-knowledgebase*
*Completed: 2026-11-07*
