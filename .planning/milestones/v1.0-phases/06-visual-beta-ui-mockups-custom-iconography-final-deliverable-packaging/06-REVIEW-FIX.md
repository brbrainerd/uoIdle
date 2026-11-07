---
phase: 06-visual-beta-ui-mockups-custom-iconography-final-deliverable-packaging
fixed_at: 2026-11-07T12:39:20Z
review_path: .planning/phases/06-visual-beta-ui-mockups-custom-iconography-final-deliverable-packaging/06-REVIEW.md
iteration: 1
findings_in_scope: 10
fixed: 10
skipped: 0
status: all_fixed
---

# Phase 06: Code Review Fix Report

**Fixed at:** 2026-11-07T12:39:20Z
**Source review:** `.planning/phases/06-visual-beta-ui-mockups-custom-iconography-final-deliverable-packaging/06-REVIEW.md`
**Iteration:** 1
**Verification environment:** Main checkout (`wt="."`, `npm run verify:all` exit code 0)

**Summary:**
- Findings in scope: 10 (`WR-01..WR-06`, `IN-01..IN-04`)
- Fixed: 10
- Skipped: 0

## Fixed Issues

### WR-01: `applyDropInClassPatch` clobbers existing `qC` estimator and `i18n` locale dictionaries

**Files modified:** `design/drop-in/classes-patch.js`
**Commit:** `6384069`
**Status:** fixed
**Applied fix:** Wrapped `target.qC` so non-Bushido/Ninjitsu abilities fall back to the pre-existing `qC` estimator function, and deep-merged `en` and `'pt-BR'` `classes` and `abilities` dictionaries in `target.i18n`.

### WR-02: Language toggle (`setLocale`) in skill-tree mockups does not update the pinned `.arvore-dica` tooltip inspector

**Files modified:** `tools/build_mockups.ts`, `mockups/samurai-skill-tree.html`, `mockups/ninja-skill-tree.html`
**Commit:** `1698ba7`
**Status:** fixed
**Applied fix:** Added `data-en` and `data-pt` attributes to `#insp-desc`, tracked `selectedAbilityId` across `selectAbility` and `setLocale`, added a `pt-BR` fallback description for `ninja_shuriken` when `ms` is `null`, and regenerated the skill-tree mockups.

### WR-03: Mode B Mirror Image clone interception does not reduce incoming hit damage and double-counts mitigated damage

**Files modified:** `src/sim/engine.ts`, `data/sim-baselines/parity-5class-v0.99.0.json`, `mockups/class-comparison.html`
**Commit:** `9b11717`
**Status:** fixed: requires human verification
**Applied fix:** Reduced `effectiveEnemyHit` by the 35% absorbed damage when a Mode B clone intercepts an attack, used `effectiveEnemyHit` in downstream parry and armor mitigation calculations, set `state.cloneStacks = 2` for `ninja_mirror_r2` in Mode B, and refreshed the 5-class parity baseline and comparison mockup.

### WR-04: `samurai_double_strike` specifies `"hits": 1` at `0.9x` multiplier instead of 2 hits

**Files modified:** `design/drop-in/samurai.json`, `src/sim/engine.ts`, `data/sim-baselines/parity-5class-v0.99.0.json`, `mockups/samurai-skill-tree.html`, `mockups/class-comparison.html`
**Commit:** `860151c`
**Status:** fixed: requires human verification
**Applied fix:** Updated `samurai_double_strike.scalingFormula.hits` from `1` to `2` in `design/drop-in/samurai.json`, scaled per-hit `double_strike` damage in `src/sim/engine.ts` so both hits execute and advance Perfection twice while satisfying all 5-class parity gates, and regenerated the parity baseline and mockups.

### WR-05: `crossCheckDropInClassWithCatalog` omits field checks and assumes `ref` is always `spellId`

**Files modified:** `tools/validate_skills.ts`
**Commit:** `5c7c518`
**Status:** fixed
**Applied fix:** Branched on `rawEntry.kind === 'WeaponAbility'` vs `'Spell' | 'SpecialMove'` in `crossCheckDropInClassWithCatalog` so `weaponAbilityRef` and `spellId` are validated against `rawEntry.ref` according to ability kind.

### WR-06: Hardcoded macOS Chrome binary path in `tools/build_mockups.ts` and developer-specific paths in `tools/generate_icons.py`

**Files modified:** `tools/build_mockups.ts`, `tools/generate_icons.py`
**Commit:** `f2fd220`
**Status:** fixed
**Applied fix:** Added `process.env.CHROME_BIN` override and existence check in `tools/build_mockups.ts`, and replaced hardcoded developer paths in `tools/generate_icons.py` with `AI_PORTRAIT_SAMURAI` / `AI_PORTRAIT_NINJA` environment variable lookups with committed-artifact preservation fallback.

### IN-01: `README.md` references outdated symbol and directory names for `kb.py`

**Files modified:** `README.md`
**Commit:** `7504ffa`
**Status:** fixed
**Applied fix:** Updated `README.md` to reference `check_credentials`, `CREDENTIAL_PATTERNS`, `mechanics/_raw/bundle/`, and `28 mutation & 4 unit self-tests`.

### IN-02: Hotbar condition formatter in `tools/build_mockups.ts` hardcodes `OR` instead of reading `c.join`

**Files modified:** `tools/build_mockups.ts`
**Commit:** `2179687`
**Status:** fixed
**Applied fix:** Updated the seeded hotbar condition formatter in `tools/build_mockups.ts` to join multiple conditions using each condition's `(c.join ?? 'or').toUpperCase()` operator.

### IN-03: Dead code branch for `counter` inside `effectType === 'self_buff'` in `src/sim/engine.ts`

**Files modified:** `src/sim/engine.ts`
**Commit:** `6e7644a`
**Status:** fixed
**Applied fix:** Removed the unreachable `skill.id.includes('counter')` branch from the `effectType === 'self_buff'` handler in `src/sim/engine.ts`.

### IN-04: `redactText` in `tools/bundle_extract.mjs` is case-sensitive on JSON secret keys

**Files modified:** `tools/bundle_extract.mjs`
**Commit:** `96e4ef5`
**Status:** fixed
**Applied fix:** Added the `i` flag and escaped-quote handling `(?:\\.|[^"\\])*` to the JSON secret key regex in `redactText`.

---

_Fixed: 2026-11-07T12:39:20Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
