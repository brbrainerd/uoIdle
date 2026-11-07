---
phase: 06-visual-beta-ui-mockups-custom-iconography-final-deliverable-packaging
reviewed: 2026-11-07T12:27:00Z
depth: standard
files_reviewed: 20
files_reviewed_list:
  - mechanics/tools/kb.py
  - tools/bundle_extract.mjs
  - tools/fetch_modernuo.py
  - tools/validate_skills.ts
  - tools/sim_balance.ts
  - tools/generate_icons.py
  - tools/build_mockups.ts
  - src/schemas/skill.schema.ts
  - src/sim/types.ts
  - src/sim/archetypes.ts
  - src/sim/engine.ts
  - design/drop-in/classes-patch.js
  - design/drop-in/samurai.json
  - design/drop-in/ninja.json
  - design/drop-in/items-bushido-ninjitsu.json
  - schemas/class.schema.json
  - schemas/skill.schema.json
  - schemas/effect.schema.json
  - package.json
  - README.md
findings:
  critical: 0
  warning: 6
  info: 4
  total: 10
status: issues_found
---

# Phase 06: Code Review Report

**Reviewed:** 2026-11-07T12:27:00Z
**Depth:** standard
**Files Reviewed:** 20
**Status:** issues_found

## Summary

Reviewed 20 files spanning the Phase 6 visual mockup and iconography pipeline (`tools/generate_icons.py`, `tools/build_mockups.ts`, `README.md`, `package.json`), the drop-in Samurai and Ninja class/item packages (`design/drop-in/*`, `schemas/*`, `src/schemas/skill.schema.ts`, `tools/validate_skills.ts`), the deterministic combat simulator (`src/sim/*`, `tools/sim_balance.ts`), and the knowledgebase extraction/verification tools (`mechanics/tools/kb.py`, `tools/bundle_extract.mjs`, `tools/fetch_modernuo.py`).

No critical security vulnerabilities or data-loss blockers were found. Six warnings were identified covering shallow bundle table overwrites in `applyDropInClassPatch`, locale/selection state desynchronization in the generated HTML mockup inspector, Mode B clone mitigation accounting in the combat simulator, and `samurai_double_strike` hit-count mismatch between the drop-in JSON and UI/estimator specifications.

## Narrative Findings (AI reviewer)

## Warnings

### WR-01: [WARNING] `applyDropInClassPatch` clobbers existing `qC` estimator and `i18n` locale dictionaries

**File:** `design/drop-in/classes-patch.js:961-962`
**Classification:** **WARNING**
**Issue:** `applyDropInClassPatch(bundleTables)` overwrites `target.qC` directly with `COMBAT_ESTIMATOR_PATCH.estimateBushidoNinjitsuAbility` (which returns `null` for all non-Samurai/Ninja skills at line 700) and performs a shallow spread `{ ...(target.i18n || {}), ...I18N_LOCALE_PATCH }` on `target.i18n`. Because `I18N_LOCALE_PATCH` defines top-level `en` and `'pt-BR'` objects, shallow spreading replaces the entire `en` and `pt-BR` locale objects in `target.i18n`, wiping out existing translations and combat estimates for live classes (`warrior`, `mage`, `ranger`).
**Fix:**
```javascript
  const prevEstimator = typeof target.qC === 'function' ? target.qC : null;
  target.qC = function patchedCombatEstimator(abilityId, tacticsOrSkill, rank) {
    const res = COMBAT_ESTIMATOR_PATCH.estimateBushidoNinjitsuAbility(
      abilityId,
      tacticsOrSkill,
      rank
    );
    return res !== null ? res : prevEstimator ? prevEstimator(abilityId, tacticsOrSkill, rank) : null;
  };

  const prevI18n = target.i18n || {};
  target.i18n = {
    ...prevI18n,
    en: {
      ...(prevI18n.en || {}),
      classes: { ...(prevI18n.en?.classes || {}), ...I18N_LOCALE_PATCH.en.classes },
      abilities: { ...(prevI18n.en?.abilities || {}), ...I18N_LOCALE_PATCH.en.abilities },
    },
    'pt-BR': {
      ...(prevI18n['pt-BR'] || {}),
      classes: { ...(prevI18n['pt-BR']?.classes || {}), ...I18N_LOCALE_PATCH['pt-BR'].classes },
      abilities: {
        ...(prevI18n['pt-BR']?.abilities || {}),
        ...I18N_LOCALE_PATCH['pt-BR'].abilities,
      },
    },
  };
```

### WR-02: [WARNING] Language toggle (`setLocale`) in skill-tree mockups does not update the pinned `.arvore-dica` tooltip inspector

**File:** `tools/build_mockups.ts:1407,1458-1466`
**Classification:** **WARNING**
**Issue:** Clicking the `EN` / `PT-BR` buttons invokes `window.setLocale(lang)`, which updates elements matching `[data-en][data-pt]`. However, `#insp-desc` (line 1407) in the pinned `.arvore-dica` inspector does not carry `data-en` / `data-pt` attributes, and `setLocale` does not re-render the currently selected ability in the inspector. Additionally, when `ninja_shuriken` (the dual L35 unlock, which is in `cls.abilities` but not in `cls.progression`) is selected via `selectAbility('ninja_shuriken')`, `ms` is `null` at line 1508 so `#insp-desc` falls back to English-only `ab.scalingFormula.summary` even in `PT-BR` mode.
**Fix:**
Track `selectedAbilityId` in the mockup script and call `selectAbility(selectedAbilityId)` inside `setLocale(lang)`:
```javascript
      var currentLocale = 'en';
      var currentMode = 'mode_a';
      var selectedAbilityId = cls.abilities[0].id;

      window.setLocale = function(lang) {
        currentLocale = lang;
        document.getElementById('btn-lang-en').classList.toggle('is-active', lang === 'en');
        document.getElementById('btn-lang-pt').classList.toggle('is-active', lang === 'pt');
        var nodes = document.querySelectorAll('[data-en][data-pt]');
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].textContent = lang === 'pt' ? nodes[i].getAttribute('data-pt') : nodes[i].getAttribute('data-en');
        }
        window.selectAbility(selectedAbilityId);
      };
```

### WR-03: [WARNING] Mode B Mirror Image clone interception does not reduce incoming hit damage and double-counts mitigated damage

**File:** `src/sim/engine.ts:1101-1126`
**Classification:** **WARNING**
**Issue:** When `didIntercept` is `true` in `mode === 'mode_b'`, line 1117 adds `rawEnemyHit * 0.35` to `totalIncomingDamageMitigated`, but leaves `interceptedByClone = false` and does not reduce `rawEnemyHit`. Execution then enters `if (!interceptedByClone)` at line 1125 with the full unmitigated `rawEnemyHit`. If the hit is parried, `totalIncomingDamageMitigated` adds `rawEnemyHit` a second time (totalling `1.35 * rawEnemyHit`); if not parried, the player takes full damage from `rawEnemyHit` as if no clone intercepted the attack. Furthermore, at line 841 (`if (mode === 'mode_b' && skill.id.includes('mirror')) state.cloneStacks = 1;`), `ninja_mirror_r2` (Mirror Image II) is hardcoded to `1` clone stack instead of `2`.
**Fix:**
Scale `rawEnemyHit` when a Mode B clone partially absorbs the hit, and set `cloneStacks` to `2` for `ninja_mirror_r2`:
```typescript
        if (mode === 'mode_b' && skill.id.includes('mirror')) {
          state.cloneStacks = skill.id.endsWith('_r2') ? 2 : 1;
        }
```
```typescript
      let effectiveEnemyHit = rawEnemyHit;
      if (state.cloneStacks > 0 && state.cloneIcdMs <= 0) {
        const cloneInterceptChance =
          mode === 'mode_b'
            ? clamp(bracket.skillLevel / 300, 0.1, 0.25)
            : clamp(bracket.skillLevel / 150, 0.25, 0.75);
        const [didIntercept, nextProcAcc] = resolveDeterministicRoll(
          state.procAcc,
          cloneInterceptChance
        );
        state.procAcc = nextProcAcc;
        if (didIntercept) {
          state.cloneStacks--;
          state.cloneIcdMs = mode === 'mode_b' ? 10000 : 1500;
          cloneInterceptions++;
          if (mode === 'mode_b') {
            const absorbed = effectiveEnemyHit * 0.35;
            totalIncomingDamageMitigated += absorbed;
            effectiveEnemyHit -= absorbed;
          } else {
            interceptedByClone = true;
            totalIncomingDamageMitigated += effectiveEnemyHit;
          }
        }
      }
```

### WR-04: [WARNING] `samurai_double_strike` specifies `"hits": 1` at `0.9x` multiplier instead of 2 hits

**File:** `design/drop-in/samurai.json:501-507`
**Classification:** **WARNING**
**Issue:** `samurai_double_strike` (L30 `Double Strike`) describes its effect as `"delivers two rapid consecutive weapon strikes at 90% damage each"` (`design/drop-in/samurai.json:176`), `design/drop-in/classes-patch.js:657` sets `hits: 2`, and `tools/build_mockups.ts:188-190` states `"2 Hits x 0.90x (1.80x Total Weapon Damage)"` and `"advancing Perfection streak twice in a single swing"`. However, `design/drop-in/samurai.json:506` sets `"hits": 1` with `"minMultiplier": 0.9, "maxMultiplier": 0.9`, causing the combat simulator (`src/sim/engine.ts:333,915`) to execute only a single `0.9x` hit (weaker than a `1.0x` auto-attack) and advance Perfection only once.
**Fix:**
Update `hits` in `design/drop-in/samurai.json:506` (and re-verify simulation baselines if intended to hit twice):
```json
      "scalingFormula": {
        "summary": "UO DoubleStrike (ref 7, Katana/Daisho/Wakizashi): rapid twin-blade strike at 0.90x weapon multiplier",
        "stat": "weapon",
        "minMultiplier": 0.9,
        "maxMultiplier": 0.9,
        "hits": 2
      },
```

### WR-05: [WARNING] `crossCheckDropInClassWithCatalog` omits field checks and assumes `ref` is always `spellId`

**File:** `tools/validate_skills.ts:159-199`
**Classification:** **WARNING**
**Issue:** Unlike `crossCheckLiveClassWithCatalog` (lines 98-155), `crossCheckDropInClassWithCatalog` does not validate `kind`, `tab`, `manaCost`, `mapScope`, `gumpIcon`, or `iconKey` against `abilities-catalog.json`, and lines 192-197 unconditionally compare `skill.spellId !== expectedRef` without branching on `rawEntry.kind === 'WeaponAbility'` vs `'Spell' | 'SpecialMove'`. If a drop-in catalog entry has `kind: 'WeaponAbility'`, comparing `skill.spellId` (`null`) against `rawEntry.ref` will falsely fail validation.
**Fix:**
Branch on `rawEntry.kind` in `crossCheckDropInClassWithCatalog` just as in `crossCheckLiveClassWithCatalog`:
```typescript
    if (rawEntry.kind === 'WeaponAbility') {
      const expectedRef = rawEntry.ref ?? null;
      if (skill.weaponAbilityRef !== expectedRef) {
        errors.push(
          `${cls.id}.json [${rawEntry.id}]: weaponAbilityRef ${String(skill.weaponAbilityRef)} !== catalog ref ${String(expectedRef)}`
        );
      }
    } else if (rawEntry.kind === 'Spell' || rawEntry.kind === 'SpecialMove') {
      const expectedRef = rawEntry.ref ?? null;
      if (skill.spellId !== expectedRef) {
        errors.push(
          `${cls.id}.json [${rawEntry.id}]: spellId ${String(skill.spellId)} !== catalog ref ${String(expectedRef)}`
        );
      }
    }
```

### WR-06: [WARNING] Hardcoded macOS Chrome binary path in `tools/build_mockups.ts` and developer-specific paths in `tools/generate_icons.py`

**File:** `tools/build_mockups.ts:11,2082`
**Classification:** **WARNING**
**Issue:** `tools/build_mockups.ts:11` hardcodes `const CHROME_BIN = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';` and invokes `execFileSync(CHROME_BIN, ...)` without checking `process.env.CHROME_BIN` or verifying binary existence before spawning. Similarly, `tools/generate_icons.py:40-45` hardcodes `/Users/brbrainerd/.gemini/antigravity/brain/2086db53-463a-4907-9d06-57f5fa8496e9/...` for `AI_PORTRAIT_SAMURAI` and `AI_PORTRAIT_NINJA`.
**Fix:**
Allow environment variable overrides and check existence gracefully:
```typescript
const CHROME_BIN =
  process.env.CHROME_BIN ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
```

## Info

### IN-01: [INFO] `README.md` references outdated symbol and directory names for `kb.py`

**File:** `README.md:64,66,89`
**Classification:** **WARNING** (Info tier)
**Issue:** `README.md:64` cites `(`scan_secrets`, `SECRET_PATTERNS`)` in `mechanics/tools/kb.py`, whereas the actual identifiers in `mechanics/tools/kb.py:83,514` are `check_credentials` and `CREDENTIAL_PATTERNS`. Line 66 references `mechanics/_raw/slices/` instead of `mechanics/_raw/bundle/`, and line 89 states `(10 unit & secret-scanner tests)` whereas `kb.py --self-test` executes 28 mutations and 4 unit test cases.
**Fix:** Update `README.md:64,66,89` to reference `check_credentials`, `CREDENTIAL_PATTERNS`, `mechanics/_raw/bundle/`, and `28 mutation & 4 unit self-tests`.

### IN-02: [INFO] Hotbar condition formatter in `tools/build_mockups.ts` hardcodes `OR` instead of reading `c.join`

**File:** `tools/build_mockups.ts:1168-1170`
**Classification:** **WARNING** (Info tier)
**Issue:** When rendering seeded hotbar conditions, `slot.conditions.map(...).join(' OR ')` always joins conditions with `' OR '` instead of inspecting each condition's `join` property (`'and' | 'or'`).
**Fix:** Use each condition's `join?.toUpperCase() ?? 'AND'` when joining multiple hotbar conditions.

### IN-03: [INFO] Dead code branch for `counter` inside `effectType === 'self_buff'` in `src/sim/engine.ts`

**File:** `src/sim/engine.ts:838-840`
**Classification:** **WARNING** (Info tier)
**Issue:** `if (mode === 'mode_b' && skill.id.includes('counter')) { state.counterStanceRemainingMs = 8000; }` inside the `skill.effectType === 'self_buff'` branch is unreachable because `samurai_counter` has `effectType: 'direct_damage'` (and is handled at line 972 with `7000`).
**Fix:** Remove the unreachable `skill.id.includes('counter')` check at lines 838-840.

### IN-04: [INFO] `redactText` in `tools/bundle_extract.mjs` is case-sensitive on JSON secret keys

**File:** `tools/bundle_extract.mjs:245-248`
**Classification:** **WARNING** (Info tier)
**Issue:** `redactText` matches `"uo-idle-token|idToken|password|access_token|refresh_token|client_secret"` case-sensitively and without escaped-quote handling, whereas `redactJsonObject` (line 260) matches `SENSITIVE_KEYS` case-insensitively.
**Fix:** Add the `i` flag to the JSON secret key regex in `redactText`.

---

_Reviewed: 2026-11-07T12:27:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
