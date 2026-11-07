---
phase: 02-core-uo-idle-engine-systems-knowledgebase
plan: 01
subsystem: mechanics
tags: [knowledgebase, combat, hotbar, estimators, status-effects, hunting-energy]

# Dependency graph
requires:
  - phase: 01-repository-setup-kb-py-adaptation-live-extraction-pipeline
    provides: "mechanics/tools/kb.py CLI and 68 immutable _raw/ extracts in mechanics/_raw/manifest.json"
provides:
  - "mechanics/combat/resources.md anchoring C1..C22 server changelog claims, vital pool math, percentage potions/heals, Warrior 0-mana/0-Meditation caps, Paladin Chivalry gold tithe, and Hunting Energy refill formulas"
  - "mechanics/combat/tick-and-cooldowns.md documenting the 12-slot hotbar (Gn = 12, Mo = 0), ability loader/filter (Fc, Uw, OE), auto-trigger condition builders (jo, hu, hh, Td, HE, fu, fh, zE), default trigger generator (ro), seeded class bars (gh), 2s Custom CD floor, and per-difficulty respawn cooldowns"
  - "mechanics/combat/damage-and-defense.md documenting client combat estimators (Zo, vq, Gs, yq, pj, jq, wq, Nq, Sq, kq, Cq, Mq, Aq, Eq), server level scaling (casters x80, physical x60), combat postures, and attribute/resistance caps"
  - "mechanics/combat/status-effects.md documenting the 134-entry abilities-catalog.json across all 6 dispatch kinds (ItemUse, Passive, WeaponAbility, Spell, SpecialMove, Custom), status effect taxonomy, and pre-wired Bushido/Ninjitsu catalog entries"
  - "mechanics/INDEX.md rebuilt with 4 verified combat KB pages and zero errors"
affects: [02-02, phase-03-classes, phase-04-simulator, phase-05-samurai-ninja]

actuals:
  tokens: 9500
  tasks: 2
  commits: 2

tech-stack:
  added: []
  patterns:
    - "Canonical server changelog anchor page (mechanics/combat/resources.md C1..C22) cross-linked via [[resources]] C<n> across sibling KB pages"
    - "Greedy unescaped JSON quote matching for abilities-catalog.json claims in kb.py"

key-files:
  created:
    - mechanics/combat/resources.md
    - mechanics/combat/tick-and-cooldowns.md
    - mechanics/combat/damage-and-defense.md
    - mechanics/combat/status-effects.md
  modified:
    - mechanics/INDEX.md

key-decisions:
  - "Anchored 22 canonical [doc-stated] server changelog claims (C1..C22) in mechanics/combat/resources.md so all combat, progression, equipment, and capability-matrix pages can cite server rules via [[resources]] C<n> while keeping their own sources[0] bound to primary bundle slices"
  - "Cataloged all 12 pre-existing Samurai (Bushido ref 400/403/404 + samurai_way) and Ninja (Ninjitsu ref 500/501/506/507) entries already present in abilities-catalog.json and gh starter hotbars"

patterns-established:
  - "Single-source verbatim (raw L<a>-L<b>) claim blocks paired with cross-page [[slug]] C<n> citations"
  - "Avoid starting non-claim markdown bullets with '- **C' in KB body sections since kb.py's CLAIM_PREFIX matches '- **C'"

requirements-completed:
  - INDEX-01

coverage:
  - id: D1
    description: "Claim-verified combat resources & server changelog anchor page (mechanics/combat/resources.md) and combat tick/hotbar page (mechanics/combat/tick-and-cooldowns.md)"
    requirement: INDEX-01
    verification:
      - kind: integration
        ref: "python3 mechanics/tools/kb.py check --root mechanics"
        status: pass
    human_judgment: false
  - id: D2
    description: "Claim-verified damage/healing/defense formulas page (mechanics/combat/damage-and-defense.md), status effects & ability dispatch catalog page (mechanics/combat/status-effects.md), and rebuilt mechanics/INDEX.md"
    requirement: INDEX-01
    verification:
      - kind: integration
        ref: "python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics"
        status: pass
    human_judgment: false

duration: 9min
completed: 2026-11-07
status: complete
---

# Phase 2 Plan 01: Combat & Resource Mechanics Knowledgebase Summary

**Four claim-verified combat KB pages (`resources`, `tick-and-cooldowns`, `damage-and-defense`, and `status-effects`) with 62 verbatim `(raw L<a>-L<b>)` citations, cross-linked server changelog rules, and a rebuilt `mechanics/INDEX.md` passing `kb.py check` with zero errors.**

## Performance

- **Duration:** 9 min
- **Started:** 2026-11-07T04:11:30Z
- **Completed:** 2026-11-07T04:20:30Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Authored `mechanics/combat/resources.md` (`22` `[doc-stated]` verbatim claims `C1..C22` from `_raw/wiki/changelog-server-dev.md`) covering HP/Mana/Stamina pool formulas, Focus and Meditation regeneration, server percentage-based heal/mana potions (`15% / 25% / 35%`) and Magery heals (`15% / 35%`), Warrior zero-mana and zero-Meditation rules, Paladin Chivalry `1 gp/pt` gold tithe, 17-reagent graphic mapping (`ok`), and Hunting Energy drain/recovery/refill math.
- Authored `mechanics/combat/tick-and-cooldowns.md` (`12` `[bundle-stated]` verbatim claims `C1..C12` from `_raw/bundle/abilities-loader-and-hotbar.js`) documenting passive auto-attacks (`warrior_slash`, `ranger_arrow`, `monk_palm`), the 12-slot hotbar (`Gn = 12`, `Mo = 0`), catalog loader/filter (`Fc`, `Uw`, `OE`), condition builders (`jo`, `hu`, `hh`, `Td`, `HE`, `fu`, `fh`, `zE`), default condition generator `ro(e)`, seeded class bars `gh` across all 15 classes (including `ninja` and `samurai`), the 2s `Custom` cooldown floor, and 5s-stepped dungeon respawn timers.
- Authored `mechanics/combat/damage-and-defense.md` (`12` `[bundle-stated]` verbatim claims `C1..C12` from `_raw/bundle/combat-estimators-and-hotbar.js`) documenting `Eq`, `Aq`, `Mq`, `Cq`, `jq`, `wq`, `Nq`, `Sq`, `kq`, `#HABINFO` DPS formatting `fj`, server level-power multipliers (`casters ×80`, `physical ×60`), bot combat postures (`agressivo`, `equilibrado`, `defensivo`), and attribute/resistance caps.
- Authored `mechanics/combat/status-effects.md` (`16` `[bundle-stated]` verbatim claims `C1..C16` from `_raw/bundle/abilities-catalog.json`) cataloging all 6 ability dispatch kinds (`ItemUse`, `Passive`, `WeaponAbility`, `Spell`, `SpecialMove`, `Custom`), `WeaponAbility` `ref: 1..22` and monster `MO` flags, the 5 resistance channels `CO`, status effect families, and the 12 existing `samurai_*` and `ninja_*` entries in `abilities-catalog.json`.
- Rebuilt `mechanics/INDEX.md` and verified all 4 pages with `kb.py --self-test`, `kb.py build --root mechanics`, and `kb.py check --root mechanics`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author `mechanics/combat/resources.md` and `mechanics/combat/tick-and-cooldowns.md`** - `8e33341` (feat)
2. **Task 2: Author `mechanics/combat/damage-and-defense.md` and `mechanics/combat/status-effects.md` and rebuild `mechanics/INDEX.md`** - `a858a01` (feat)

## Files Created/Modified

- `mechanics/combat/resources.md` - Claim-verified KB page for HP/Mana/Stamina pools, potions, class resource overrides, reagents, Hunting Energy, and 22 server changelog anchor claims
- `mechanics/combat/tick-and-cooldowns.md` - Claim-verified KB page for combat tick loop, 12-slot hotbar, trigger condition builders, default rules, seeded class hotbars, and cooldown rules
- `mechanics/combat/damage-and-defense.md` - Claim-verified KB page for client heal/physical/spell estimators, server level scaling, combat postures, and attribute/resistance caps
- `mechanics/combat/status-effects.md` - Claim-verified KB page for status effects, DoTs, CC, buffs/debuffs, summons, and the 6 ability dispatch kinds in `abilities-catalog.json`
- `mechanics/INDEX.md` - Generated KB index listing the 4 combat pages

## Decisions Made

- Anchored 22 canonical `[doc-stated]` server changelog claims (`C1..C22`) in `mechanics/combat/resources.md` so all combat, progression, equipment, and capability-matrix pages can cite server rules via `[[resources]] C<n>` while keeping their own `sources[0]` bound to primary bundle slices.
- Documented the 12 pre-existing Samurai and Ninja entries already present in `abilities-catalog.json` and `gh` starter hotbars to ground Phase 2 Plan 02's Engine Capability Matrix (`INDEX-02`) and Phase 5 class design.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `kb.py` treats any markdown line starting with `- **C` (`CLAIM_PREFIX`) as a claim line; renamed two prose bullet headings (`- **Catalog Fetch...` -> `- **Remote Catalog Fetch...` and `- **Casters...` -> `- **Spellcasters...`) so prose bullets do not collide with `CLAIM_PREFIX`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Ready for Plan `02-02-PLAN.md` (`mechanics/systems/progression-unlocks.md`, `mechanics/systems/equipment-affixes.md`, and `mechanics/topics/engine-capability-matrix.md`), which cross-links directly to `[[resources]] C1..C22`, `[[tick-and-cooldowns]]`, `[[damage-and-defense]]`, and `[[status-effects]]`.

## Self-Check: PASSED

- Verified `mechanics/combat/resources.md`, `mechanics/combat/tick-and-cooldowns.md`, `mechanics/combat/damage-and-defense.md`, `mechanics/combat/status-effects.md`, and `mechanics/INDEX.md` exist on disk.
- Verified `python3 mechanics/tools/kb.py --self-test`, `python3 mechanics/tools/kb.py build --root mechanics`, and `python3 mechanics/tools/kb.py check --root mechanics` exit `0` with `"ok": true`, `"pages": 4`, and `"errors": []`.
- Verified task commits `8e33341` and `a858a01` in git history.

---
*Phase: 02-core-uo-idle-engine-systems-knowledgebase*
*Completed: 2026-11-07*
