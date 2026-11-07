---
phase: 03-existing-classes-deep-dive-canonical-data-schemas
plan: 01
subsystem: mechanics-kb
tags: [warrior, mage, ranger, class-structural-parity, combat-niches, kb-check]
requires:
  - phase: 02-core-uo-idle-engine-systems-knowledgebase
    provides: "Core combat, progression, equipment, and engine capability KB pages (`resources`, `tick-and-cooldowns`, `damage-and-defense`, `status-effects`, `progression-unlocks`, `equipment-affixes`, `engine-capability-matrix`)"
provides:
  - "Claim-verified class deep-dive KB pages (`mechanics/classes/warrior.md`, `mechanics/classes/mage.md`, `mechanics/classes/ranger.md`)"
  - "Cross-class structural parity specification across all 16 classes and 7 `gE` progression curves (`mechanics/topics/class-structural-parity.md`)"
  - "Combat niche and protected Samurai/Ninja design space matrix (`mechanics/topics/combat-niches.md`)"
  - "Updated `mechanics/INDEX.md` with 12 pages and 0 linter errors"
affects:
  - 03-02
  - 04-01
  - 04-02
  - 05-01
  - 05-02
tech-stack:
  added: []
  patterns:
    - "Single-primary-source (`sources[0]`) verbatim `(raw L<a>-L<b>)` claim anchoring paired with `[[slug]] C<n>` cross-claim graph citations"
    - "Explicit modeling of client progression (`gE`) vs shared catalog (`abilities-catalog.json`) unlock drift and hotbar ID aliases (`ranger_charged_shot_r2`)"
key-files:
  created:
    - mechanics/classes/warrior.md
    - mechanics/classes/mage.md
    - mechanics/classes/ranger.md
    - mechanics/topics/class-structural-parity.md
    - mechanics/topics/combat-niches.md
  modified:
    - mechanics/INDEX.md
key-decisions:
  - "Anchored `warrior.md`, `mage.md`, and `ranger.md` to `_raw/bundle/abilities-catalog.json` as `sources[0]` with verbatim claims covering all 34 starter-trio catalog abilities (`10` Warrior + `15` Mage + `9` Ranger) plus universal `ItemUse` consumables (`bandage`, `lesser_heal_potion`)"
  - "Documented all client-vs-catalog structural drifts in `warrior.md`, `mage.md`, `ranger.md`, and `class-structural-parity.md` (`warrior_shield_bash` L5 vs L10; 5 Mage spell unlock shifts and `mage_nature_fury` migration to `gE.spellweaver`; 4 `gE.ranger`-only arrow nodes, `ranger_charged_shot_r2` alias, and `ranger_deadeye` L55 vs L100)"
  - "Codified the 4-layer class template (`dx`/`Kj`/`ZC`/`e2`/`SE`, `hE`/`mx`/`hx`, `gE` L1-60 curve, and `abilities-catalog.json` + `gh` hotbar contract) and protected Samurai (`Bushido`) and Ninja (`Ninjitsu`) combat niches"
patterns-established:
  - "Avoid starting non-claim markdown bullet lines with `- **C` so `kb.py`'s `CLAIM_PREFIX = '- **C'` parser only matches actual claim lines"
requirements-completed:
  - INDEX-03
  - INDEX-04
duration: 8min
completed: 2026-11-07
---

# Phase 3 Plan 01: Core Classes Deep-Dive & Structural Parity KB Summary

**Authored claim-verified KB pages for Warrior, Mage, and Ranger alongside the 16-class structural parity specification and protected Samurai/Ninja combat niche matrix (`12` total KB pages, `0` errors).**

## Performance

- **Duration:** 8 min
- **Started:** 2026-11-07T04:58:40Z
- **Completed:** 2026-11-07T05:06:30Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Authored [warrior.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/classes/warrior.md) with `12` verbatim `[bundle-stated]` claims (`C1..C12`) covering all `10` Warrior catalog abilities (`warrior_slash` through `warrior_execution`) and universal `ItemUse` consumables, the `warrior_shield_bash` catalog (`L5`) vs `gE.warrior` (`L10`) unlock shift, `Cq` physical estimators, single-application `Brace`/`Armor Break` in `AOS.Damage`, and the server `0`-mana and `0`-Meditation rules.
- Authored [mage.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/classes/mage.md) with `15` verbatim `[bundle-stated]` claims (`C1..C15`) covering all `15` Mage catalog abilities, the `5` unlock-level shifts between `abilities-catalog.json` and `gE.mage`, `mage_nature_fury` migration to `gE.spellweaver` at `L50`, `Mq`/`Aq` school multipliers, server `×80` caster level scaling, `15% / 35%` Max HP heal overrides, `90s` elemental summons, and reagent `#SUPPLY` tracking.
- Authored [ranger.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/classes/ranger.md) with `9` verbatim `[bundle-stated]` claims (`C1..C9`) covering all `9` Ranger catalog abilities, the `4` `gE.ranger`-only arrow nodes (`ranger_force_arrow`, `ranger_serpent_arrow`, `ranger_lightning_arrow`, `ranger_armor_pierce`), the `ranger_charged_shot_r2` $\rightarrow$ `ranger_charged_shot` hotbar alias in `cr(e)`, the `ranger_deadeye` `L55` vs `unlock: 100` mismatch, `WeaponAbility` (`ref: 1, 10, 11, 22`) dispatch, and `Cq` multi-hit volley math.
- Authored [class-structural-parity.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/topics/class-structural-parity.md) (`C1..C12` against `_raw/bundle/skills-and-progression.js`) codifying the 4-layer UO Idle class template across all `16` classes, comparing all `7` populated `gE` progression curves (`warrior`, `berserker`, `paladin`, `ranger`, `mage`, `necromancer`, `spellweaver`), and auditing the `12` pre-existing `samurai_*` and `ninja_*` catalog entries.
- Authored [combat-niches.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/topics/combat-niches.md) (`C1..C12` against `_raw/bundle/classes-config.js`) mapping offensive, AoE, mitigation, sustain, and resource niches across live combat classes and defining the protected combat niches for **Samurai** (*Perfection Ramp / Weapon Parry-Counter / Threshold Execute*) and **Ninja** (*Ablative Clone Mitigation / Stealth-Window Openers / 5-Swing Delayed Detonation*).
- Regenerated [INDEX.md](file:///Users/brbrainerd/dev/uoIdle/mechanics/INDEX.md) (`12` pages: `classes 5, combat 4, systems 2, topics 3`) and verified `python3 mechanics/tools/kb.py --self-test` and `python3 mechanics/tools/kb.py check --root mechanics` pass with `0` errors.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author `mechanics/classes/warrior.md`, `mechanics/classes/mage.md`, and `mechanics/classes/ranger.md`** - `4e8b951` (`feat`)
2. **Task 2: Author `mechanics/topics/class-structural-parity.md` and `mechanics/topics/combat-niches.md` and finalize Phase 3 KB index** - `4161b26` (`feat`)

## Files Created/Modified

- `mechanics/classes/warrior.md` - Complete Warrior class reference (`C1..C12` against `_raw/bundle/abilities-catalog.json`)
- `mechanics/classes/mage.md` - Complete Mage class reference (`C1..C15` against `_raw/bundle/abilities-catalog.json`)
- `mechanics/classes/ranger.md` - Complete Ranger class reference (`C1..C9` against `_raw/bundle/abilities-catalog.json`)
- `mechanics/topics/class-structural-parity.md` - Cross-class 4-layer structural parity specification (`C1..C12` against `_raw/bundle/skills-and-progression.js`)
- `mechanics/topics/combat-niches.md` - Live class combat niche matrix and protected Samurai/Ninja design space (`C1..C12` against `_raw/bundle/classes-config.js`)
- `mechanics/INDEX.md` - Rebuilt KB index (`12` pages: `verified 1, bundle-stated 10, doc-stated 1`)

## Decisions Made

- Used `_raw/bundle/abilities-catalog.json` as `sources[0]` on all three class pages (`warrior.md`, `mage.md`, `ranger.md`), `_raw/bundle/skills-and-progression.js` as `sources[0]` on `class-structural-parity.md`, and `_raw/bundle/classes-config.js` as `sources[0]` on `combat-niches.md` so every single claim (`60` new claims across the 5 pages) is verified against verbatim raw lines.
- Documented both `gE` progression tree levels and `abilities-catalog.json` `unlock` levels side-by-side so Plan `03-02`'s canonical `zod` and JSON schemas can preserve both values without lossy normalization.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Avoided `- **C` prefix on non-claim markdown bullet in `mechanics/classes/mage.md`**
- **Found during:** Task 1 verification (`kb.py check --root mechanics`)
- **Issue:** A prose bullet in `mage.md` began with `- **Caster Level Power Multiplier...`, which matched `CLAIM_PREFIX = "- **C"` in `kb.py` and triggered `claim-malformed`.
- **Fix:** Renamed the prose bullet prefix to `- **Spellcaster Level Power Multiplier...`.
- **Files modified:** `mechanics/classes/mage.md`
- **Verification:** `python3 mechanics/tools/kb.py check --root mechanics` returned `{"ok": true, "pages": 10, "errors": []}`.
- **Committed in:** `4e8b951`

---

**Total deviations:** 1 auto-fixed (1 minor markdown bullet prefix clash with `CLAIM_PREFIX`)
**Impact on plan:** Zero scope change; ensured clean `kb.py check` pass.

## Issues Encountered

None.

## Next Phase Readiness

- Ready for Plan `03-02-PLAN.md`: Canonical JSON Schemas (`schemas/{effect,skill,class}.schema.json`), TypeScript `zod` validator (`src/schemas/skill.schema.ts`), extracted live class JSON definitions (`data/live-classes/{warrior,mage,ranger}.json`), and CLI verification (`tools/validate_skills.ts`).

---
*Phase: 03-existing-classes-deep-dive-canonical-data-schemas*
*Completed: 2026-11-07*
