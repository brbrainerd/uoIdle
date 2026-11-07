---
phase: 03-existing-classes-deep-dive-canonical-data-schemas
plan: 02
subsystem: schemas-and-live-data
tags: [json-schema, zod, typescript, warrior, mage, ranger, abilities-catalog, validation]
requires:
  - phase: 03-existing-classes-deep-dive-canonical-data-schemas
    provides: "Claim-verified KB pages for Warrior, Mage, Ranger, Cross-Class Structural Parity, and Combat Niches (`03-01`)"
provides:
  - "Canonical JSON Schema Draft 2020-12 definitions (`schemas/effect.schema.json`, `schemas/skill.schema.json`, `schemas/class.schema.json`)"
  - "Canonical TypeScript + Zod contracts (`src/schemas/skill.schema.ts`: `EffectSchema`, `SkillSchema`, `ProgressionMilestoneSchema`, `ClassSchema`, `RawCatalogAbilitySchema`)"
  - "Extracted live class JSON payloads (`data/live-classes/warrior.json`, `data/live-classes/mage.json`, `data/live-classes/ranger.json`)"
  - "Executable CLI validator (`tools/validate_skills.ts`) verifying 100% parity across JSON Schemas, Zod contracts, 3 live class payloads, and all 134 catalog abilities"
affects:
  - 04-01
  - 04-02
  - 05-01
  - 05-02
  - 05-03
actuals:
  tokens: 21500
  tasks: 2
  commits: 2
tech-stack:
  added: []
  patterns:
    - "JSON Schema Draft 2020-12 + TypeScript Zod dual-schema key parity assertion (`validateJsonSchemaParity`)"
    - "Dual-field unlock provenance (`unlockLevel` from `abilities-catalog.json` + `progressionTreeLevel` from `gE.<class>` + `inCatalog` boolean + `aliasOf`) preserving client-vs-catalog drift without lossy normalization"
key-files:
  created:
    - schemas/effect.schema.json
    - schemas/skill.schema.json
    - schemas/class.schema.json
    - src/schemas/skill.schema.ts
    - data/live-classes/warrior.json
    - data/live-classes/mage.json
    - data/live-classes/ranger.json
    - tools/validate_skills.ts
  modified: []
key-decisions:
  - "Enforced strict 1-to-1 property key parity between JSON Schema Draft 2020-12 (`schemas/{effect,skill,class}.schema.json`) and Zod object shapes (`EffectSchema`, `SkillBaseObjectSchema`, `ClassBaseObjectSchema`) inside `tools/validate_skills.ts --verify`"
  - "Modeled both `unlockLevel` (catalog) and `progressionTreeLevel` (`gE` progression tree) plus `inCatalog` and `aliasOf` so all live class drifts (`warrior_shield_bash`, 5 Mage spells + `mage_nature_fury`, 4 `gE.ranger`-only arrow nodes + `ranger_charged_shot_r2` alias + `ranger_deadeye` L55/L100) validate with zero data loss"
patterns-established:
  - "Four-gate CLI verification (`tools/validate_skills.ts --verify`): (1) JSON Schema vs Zod shape parity, (2) 134-entry raw catalog completeness, (3) live class payload validation (`ClassSchema`), and (4) cross-artifact field-level fidelity against `abilities-catalog.json`"
requirements-completed:
  - INDEX-04
coverage:
  - id: D1
    description: "Canonical JSON Schemas (`schemas/effect.schema.json`, `schemas/skill.schema.json`, `schemas/class.schema.json`) and TypeScript Zod contracts (`src/schemas/skill.schema.ts`)"
    requirement: INDEX-04
    verification:
      - kind: unit
        ref: "npx tsc --noEmit src/schemas/skill.schema.ts tools/validate_skills.ts"
        status: pass
      - kind: integration
        ref: "npx tsx tools/validate_skills.ts --verify"
        status: pass
    human_judgment: false
  - id: D2
    description: "Extracted live Warrior, Mage, and Ranger JSON payloads (`data/live-classes/{warrior,mage,ranger}.json`) and 4-gate CLI validator (`tools/validate_skills.ts`)"
    requirement: INDEX-04
    verification:
      - kind: integration
        ref: "npx tsx tools/validate_skills.ts --verify"
        status: pass
      - kind: integration
        ref: "python3 mechanics/tools/kb.py check --root mechanics"
        status: pass
    human_judgment: false
duration: 9min
completed: 2026-11-07
status: complete
---

# Phase 3 Plan 02: Canonical JSON Schemas, Zod Validator & Live Class Payloads Summary

**Authored JSON Schema Draft 2020-12 and TypeScript `zod` contracts (`schemas/{effect,skill,class}.schema.json`, `src/schemas/skill.schema.ts`), extracted canonical live class JSON definitions (`data/live-classes/{warrior,mage,ranger}.json`), and verified 100% validation pass across all `3` live classes and `134` catalog entries via `tools/validate_skills.ts --verify`.**

## Performance

- **Duration:** 9 min
- **Started:** 2026-11-07T05:07:40Z
- **Completed:** 2026-11-07T05:16:55Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Authored [effect.schema.json](file:///Users/brbrainerd/dev/uoIdle/schemas/effect.schema.json), [skill.schema.json](file:///Users/brbrainerd/dev/uoIdle/schemas/skill.schema.json), and [class.schema.json](file:///Users/brbrainerd/dev/uoIdle/schemas/class.schema.json) (`JSON Schema Draft 2020-12`, `"additionalProperties": false`) codifying the exact structural contracts for UO Idle status effects, abilities/spells, progression milestones, and full 4-layer class definitions.
- Authored [skill.schema.ts](file:///Users/brbrainerd/dev/uoIdle/src/schemas/skill.schema.ts) exporting `EffectSchema`, `SkillSchema`, `ProgressionMilestoneSchema`, `ClassSchema`, and `RawCatalogAbilitySchema` with `.strict()` and `.superRefine()` invariants enforcing the `2,000ms` server `Custom` cooldown floor, positive `weaponAbilityRef`/`spellId` dispatch references, non-decreasing L1–60 progression milestones, and mandatory `magicResist` (`30`) + `focus` (`50`) starter skill grants.
- Authored [warrior.json](file:///Users/brbrainerd/dev/uoIdle/data/live-classes/warrior.json) (`10` milestones, `10` abilities), [mage.json](file:///Users/brbrainerd/dev/uoIdle/data/live-classes/mage.json) (`14` milestones, `15` abilities), and [ranger.json](file:///Users/brbrainerd/dev/uoIdle/data/live-classes/ranger.json) (`13` milestones, `13` abilities: `9` catalog + `4` `gE.ranger`-only arrow nodes) with full starter kits, paperdoll layers, seeded hotbar conditions, scaling formulas, status effects, and dual `unlockLevel` / `progressionTreeLevel` provenance.
- Authored [validate_skills.ts](file:///Users/brbrainerd/dev/uoIdle/tools/validate_skills.ts) implementing 4 verification gates (JSON Schema vs Zod key parity, all `134` raw catalog abilities, all `3` live class payloads, and cross-artifact field fidelity against `abilities-catalog.json`), outputting `{"ok":true,"classes":3,"catalogAbilities":134}` with exit code `0`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author `schemas/{effect,skill,class}.schema.json` and `src/schemas/skill.schema.ts`** - `06821f6` (`feat`)
2. **Task 2: Author `data/live-classes/{warrior,mage,ranger}.json` and `tools/validate_skills.ts` and verify 100% validation pass** - `50ad97b` (`feat`)

## Files Created/Modified

- `schemas/effect.schema.json` - JSON Schema Draft 2020-12 contract for buffs, debuffs, DoTs, summons, postures, and stealth states
- `schemas/skill.schema.json` - JSON Schema Draft 2020-12 contract for class abilities, spells, weapon abilities, special moves, passives, and item uses
- `schemas/class.schema.json` - JSON Schema Draft 2020-12 contract for complete UO Idle class definitions
- `src/schemas/skill.schema.ts` - Canonical TypeScript + `zod` schemas and inferred types
- `data/live-classes/warrior.json` - Extracted canonical Warrior class definition (`10` progression milestones, `10` catalog abilities)
- `data/live-classes/mage.json` - Extracted canonical Mage class definition (`14` progression milestones, `15` catalog abilities)
- `data/live-classes/ranger.json` - Extracted canonical Ranger class definition (`13` progression milestones, `9` catalog abilities + `4` `gE.ranger`-only arrow abilities)
- `tools/validate_skills.ts` - CLI validator (`--verify`) enforcing schema parity, catalog completeness (`134`), and live class fidelity (`3`)

## Decisions Made

- Used `SkillBaseObjectSchema` and `ClassBaseObjectSchema` in `src/schemas/skill.schema.ts` as the base `.strict()` `z.object(...)` definitions before wrapping with `.superRefine(...)` into `SkillSchema` and `ClassSchema`, allowing `tools/validate_skills.ts` to inspect `.shape` directly and assert 100% key parity with `schemas/{skill,class}.schema.json`.
- Used namespace imports (`import * as fs from 'node:fs'`, `import * as path from 'node:path'`) and `process.cwd()` in `tools/validate_skills.ts` so `npx tsc --noEmit src/schemas/skill.schema.ts tools/validate_skills.ts` compiles cleanly without requiring custom `tsconfig.json` flags.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Replaced default `node:fs`/`node:path` imports and `import.meta.url` in `tools/validate_skills.ts` for bare `tsc --noEmit` compatibility**
- **Found during:** Task 2 verification (`npx tsc --noEmit src/schemas/skill.schema.ts tools/validate_skills.ts`)
- **Issue:** Invoking `tsc --noEmit` with explicit file arguments bypasses `tsconfig.json` defaults (`esModuleInterop: false`, `module: commonjs`), causing `TS1192`, `TS1259`, and `TS1343` on default imports and `import.meta.url`.
- **Fix:** Switched to `import * as fs from 'node:fs'`, `import * as path from 'node:path'`, and `process.cwd()`.
- **Files modified:** `tools/validate_skills.ts`
- **Verification:** Both `npx tsc --noEmit src/schemas/skill.schema.ts tools/validate_skills.ts` and `npx tsx tools/validate_skills.ts --verify` exited `0`.
- **Committed in:** `50ad97b`

---

**Total deviations:** 1 auto-fixed (1 TypeScript compiler flag compatibility fix)
**Impact on plan:** Zero scope change; guaranteed clean compilation under bare `npx tsc --noEmit`.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 3 is 100% complete (`03-01` and `03-02`).
- Ready for Phase 4 (`04-modernuo-reference-kb-baseline-combat-simulator`): claim-verified ModernUO Bushido & Ninjitsu KB pages (`modernuo-bushido.md`, `modernuo-ninjitsu.md`), `design/MODERNUO_MAPPING.md`, and deterministic baseline combat simulator (`tools/sim_balance.ts`).

---
*Phase: 03-existing-classes-deep-dive-canonical-data-schemas*
*Completed: 2026-11-07*
