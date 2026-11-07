---
phase: 10-github-pages-portal-and-final-audit
reviewed: 2026-11-07T15:36:00Z
depth: standard
files_reviewed: 13
files_reviewed_list:
  - tools/build_mockups.ts
  - tools/ui_components.ts
  - tools/generate_icons.py
  - tools/sim_balance.ts
  - tools/test_sim.ts
  - src/sim/engine.ts
  - src/schemas/skill.schema.ts
  - .github/workflows/deploy-pages.yml
  - README.md
  - index.html
  - design/BALANCE_REPORT.md
  - design/SAMURAI_SPEC.md
  - design/NINJA_SPEC.md
critical: 0
warning: 4
info: 3
total: 7
findings:
  critical: 0
  warning: 4
  info: 3
  total: 7
status: issues_found
---

# Phase 10: Code Review Report

**Reviewed:** 2026-11-07T15:36:00Z
**Depth:** standard
**Files Reviewed:** 13 (`src/sim/engine.ts` reviewed in place of non-existent `src/sim/combat_sim.ts`; `tools/generate_icons.py` covers `tools/extract_uo_assets.py`)
**Status:** issues_found

## Summary

Reviewed 13 source, tooling, specification, and CI/CD files for Phase 10 (`10-github-pages-portal-and-final-audit`). Overall architecture, deterministic combat simulation (`src/sim/engine.ts`, `tools/sim_balance.ts`, `tools/test_sim.ts`), Zod schema validation (`src/schemas/skill.schema.ts`), and the static documentation portal (`index.html`, `tools/build_mockups.ts`, `tools/ui_components.ts`) are well-structured and cohesive.

No critical bugs or security vulnerabilities were found. Four warnings and three informational findings were identified:
- **Warnings:** Whole-repository artifact packaging in GitHub Pages deployment, unescaped string interpolation in client-side `innerHTML` updates, an initial-render `mode_b` vs `mode_a` filter mismatch in `class-comparison.html`, and incomplete per-file integrity checks for `items/manifest.json` in `generate_icons.py --verify`.
- **Info:** Minor documentation vs simulator drift on Ninja's Death Strike swing countdown (`3` vs `5` swings), duplicate CSS rule declarations across `build_mockups.ts` and `ui_components.ts`, and a misleading keyboard shortcut label (`1–9 Select Tier` vs progression milestones).

## Narrative Findings (AI reviewer)

## Warnings

### WR-01: Whole-Repository Artifact Upload in GitHub Pages Workflow Exposes Internal Planning & Raw Directories

**File:** `.github/workflows/deploy-pages.yml:30-33`
**Issue:** `actions/upload-pages-artifact@v3` is configured with `path: '.'`, which packages and deploys the entire repository workspace to GitHub Pages—including `.planning/`, `mechanics/_raw/`, `mechanics/_crawl/`, `src/`, and `tools/`. Aside from bloating the deployment artifact, publishing `.planning/` and raw crawl scrapes exposes internal workflow state publicly on GitHub Pages.
**Fix:** Stage only the required static portal assets into a clean `_site/` directory before uploading the Pages artifact:
```yaml
      - name: Stage static portal assets
        run: |
          mkdir -p _site
          cp index.html .nojekyll README.md _site/
          cp -R mockups design data schemas mechanics _site/
          rm -rf _site/mechanics/_raw _site/mechanics/_crawl

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '_site'
```

### WR-02: Unescaped Dynamic Strings in Client-Side `innerHTML` Assignments

**File:** `tools/build_mockups.ts:2548-2550` (also lines `2757-2759`, `3749-3763`, `3785-3800`, `3837-3854`)
**Issue:** While server-side HTML generation consistently sanitizes strings with `escapeHtml(...)`, the embedded client-side JavaScript in `build_mockups.ts` builds HTML strings via raw concatenation and assigns them directly to `.innerHTML` (for `gear-tt-affixes`, `ticker-log-feed`, `sim-telemetry-tbody`, `sim-exec-kpi-strip`, and `breakdown-bars-wrap`). If any affix description, combat log message, or ability label contains `<` or `&` (e.g., `<20 LOC`), the browser parses it as raw HTML, corrupting the DOM or enabling DOM XSS if external JSON data is ever loaded.
**Fix:** Add a lightweight client-side HTML escaper inside the client IIFE in `tools/build_mockups.ts` and wrap interpolated text fields before assigning to `innerHTML`:
```javascript
function escHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```
Then apply `escHtml(...)` in client-side templates (e.g., `affixHtml += '<div class="gear-tt-affix"><span>' + escHtml(parts[0]) + '</span>...';`).

### WR-03: Initial Server-Rendered SVG Progression Curve and Breakdown Bars in `class-comparison.html` Mismatch Default `mode_a` Filter

**File:** `tools/build_mockups.ts:2863-2865` and `tools/build_mockups.ts:2893-2895`
**Issue:** In `buildClassComparisonHtml`:
1. The page's initial active filter button and client state default to `mode: 'mode_a'` (line 3640), and the chart header explicitly reads `Multi-Bracket Sustained DPS Curve (L10 → L60 · Mode A · low_def_boss)` (line 3447). However, `buildProgressionSvg` on line 2863 reads from `parity.mode_b.scenarios` instead of `parity.mode_a.scenarios`. Until a user clicks a filter button in the browser, the initial SVG chart displays Mode B curves under a Mode A label.
2. Similarly, `breakdownL60` on lines 2893–2895 filters only by `d.level === 60 && d.scenario === 'low_def_boss'` without filtering `(!d.mode || d.mode === 'mode_a')`, whereas the client-side `updateSimFilter` (line 3832) filters by mode.
**Fix:** Update the server-side initial render in `tools/build_mockups.ts` to use `mode_a`:
```typescript
      const scenarios = parity.mode_a?.scenarios ?? parity.scenarios ?? [];
```
and constrain `breakdownL60` at line 2893:
```typescript
    const breakdownL60 = damageBreakdowns.filter(
      (d: any) => d.level === 60 && d.scenario === 'low_def_boss' && (!d.mode || d.mode === 'mode_a')
    );
```

### WR-04: Incomplete Integrity Verification for Extracted Item & Paperdoll Sprites in `generate_icons.py --verify`

**File:** `tools/generate_icons.py:928-931`
**Issue:** `verify_all_icons()` validates every entry in `mockups/assets/icons/manifest.json` for file existence, `stdDev >= 12.0`, and matching `sha256` digest (lines 903–926). However, for `mockups/assets/items/manifest.json` (lines 928–931), it only checks that the manifest file exists and has `len(item_files) >= 35`, without verifying that the referenced item/paperdoll PNGs exist on disk, meet `MIN_STD_DEV`, or match their recorded `sha256` hashes.
**Fix:** Extend `verify_all_icons()` to iterate over `item_files` and verify each PNG on disk:
```python
    for fname, rec_meta in item_files.items():
        fp = ITEMS_DIR / fname
        if not fp.exists():
            errors.append(f"Missing item/paperdoll file on disk: items/{fname}")
            continue
        live_meta = verify_image(fp)
        if live_meta["stdDev"] < MIN_STD_DEV:
            errors.append(f"Low stdDev ({live_meta['stdDev']}) on items/{fname}")
        if live_meta["sha256"] != rec_meta.get("sha256"):
            errors.append(f"SHA-256 mismatch on items/{fname}")
```

## Info

### IN-01: Documentation vs Simulator Drift on Ninja Death Strike Detonation Swing Count (3 vs 5 Swings)

**File:** `src/sim/engine.ts:1122`, `tools/build_mockups.ts:743, 3212`, `design/NINJA_SPEC.md:207, 360`
**Issue:** In `src/sim/engine.ts:1122`, `state.deathStrikeSwingsRemaining` is initialized to `3` (`tools/build_mockups.ts:3212` also notes `// Detonates on 3rd connected swing!`). However, `tools/build_mockups.ts:743` (`MODE_DESCRIPTIONS.ninja_death`) and `design/NINJA_SPEC.md:207, 360` state `state.deathStrikeSwingsRemaining = 5` / `5th connected swing`.
**Fix:** Update `design/NINJA_SPEC.md` and `MODE_DESCRIPTIONS.ninja_death` in `tools/build_mockups.ts` so both consistently document the 3-swing detonation countdown used by the v1.1 combat engine (noting that ModernUO's 5-step timer was compressed to 3 connected swings for idle pacing).

### IN-02: Duplicate CSS Selector Definitions Between `build_mockups.ts` and `ui_components.ts`

**File:** `tools/build_mockups.ts:1284-1288, 1760-1770` and `tools/ui_components.ts:203-210, 387-392`
**Issue:** `buildSharedStyles` in `tools/build_mockups.ts` defines `.arvore-cobra-wrap` and `.paperdoll-figure-box`, and immediately appends `${buildComponentStyles()}` from `tools/ui_components.ts`, which redeclares both selectors (requiring `!important` overrides on `.paperdoll-figure-box`).
**Fix:** Remove the duplicate base definitions of `.arvore-cobra-wrap` and `.paperdoll-figure-box` from `tools/build_mockups.ts` so `tools/ui_components.ts` serves as the single source of truth.

### IN-03: Quick Command Bar Shortcut Label (`1–9 Select Tier`) Actually Selects Progression Milestones

**File:** `tools/ui_components.ts:473` and `tools/build_mockups.ts:2796-2801`
**Issue:** `renderQuickCommandBar` in `tools/ui_components.ts:473` labels the keyboard shortcut `<kbd>1–9</kbd> Select Tier`, whereas the `keydown` listener in `tools/build_mockups.ts:2796-2801` maps keys `1–9` to `window.selectAbility(cls.progression[idx].id)` (selecting progression milestones 1–9 rather than material tiers 1–9).
**Fix:** Change the label in `tools/ui_components.ts:473` to `<kbd>1–9</kbd> Select Milestone` (or bind keys `1–9` to `selectMaterialTier` when the paperdoll view is focused).

---

_Reviewed: 2026-11-07T15:36:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
