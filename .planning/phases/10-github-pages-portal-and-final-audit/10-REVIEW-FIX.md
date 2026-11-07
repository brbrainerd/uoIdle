---
phase: 10-github-pages-portal-and-final-audit
fixed_at: 2026-11-07T15:47:15Z
review_path: .planning/phases/10-github-pages-portal-and-final-audit/10-REVIEW.md
iteration: 1
findings_in_scope: 7
fixed: 7
skipped: 0
status: all_fixed
---

# Phase 10: Code Review Fix Report

**Fixed at:** 2026-11-07T15:47:15Z
**Source review:** `.planning/phases/10-github-pages-portal-and-final-audit/10-REVIEW.md`
**Iteration:** 1

**Summary:**
- Findings in scope: 7
- Fixed: 7
- Skipped: 0
- Verification environment: main checkout (`npm run verify:all` — 7/7 verification gates PASS)

## Fixed Issues

### WR-01: Whole-Repository Artifact Upload in GitHub Pages Workflow Exposes Internal Planning & Raw Directories

**Files modified:** `.github/workflows/deploy-pages.yml`
**Commit:** `b4028cd`
**Applied fix:** Added a staging step before `actions/upload-pages-artifact@v3` that copies only the static portal deliverables (`index.html`, `.nojekyll`, `README.md`, `mockups/`, `design/`, `data/`, `schemas/`, and `mechanics/` excluding `mechanics/_raw` and `mechanics/_crawl`) into `_site/` and uploads `path: '_site'`.

### WR-02: Unescaped Dynamic Strings in Client-Side `innerHTML` Assignments

**Files modified:** `tools/build_mockups.ts`, `mockups/class-comparison.html`, `mockups/ninja-skill-tree.html`, `mockups/samurai-skill-tree.html`
**Commit:** `e0fe09c`
**Applied fix:** Added `escHtml(str)` inside both client-side IIFEs in `tools/build_mockups.ts` and wrapped dynamic string fields (`affs`, combat ticker log properties, `s.classId`, `ks.classId`, `dStr`, `mLbl`, `db.classId`, and color values) before `.innerHTML` assignment, then regenerated the HTML mockups.

### WR-03: Initial Server-Rendered SVG Progression Curve and Breakdown Bars in `class-comparison.html` Mismatch Default `mode_a` Filter

**Files modified:** `tools/build_mockups.ts`, `mockups/class-comparison.html`
**Commit:** `ec85b15`
**Applied fix:** Updated `buildProgressionSvg` in `tools/build_mockups.ts` to read from `parity.mode_a?.scenarios ?? parity.mode_b.scenarios` with matching `420` DPS / `350` EHP/s chart ceilings, and updated `breakdownL60` to prefer `(!d.mode || d.mode === 'mode_a')` with a fallback to the L60 `low_def_boss` dataset (matching the client-side `updateSimFilter` logic).

### WR-04: Incomplete Integrity Verification for Extracted Item & Paperdoll Sprites in `generate_icons.py --verify`

**Files modified:** `tools/generate_icons.py`
**Commit:** `1e3c9d6`
**Applied fix:** Extended `verify_all_icons()` in `tools/generate_icons.py` to iterate over all 37 entries in `mockups/assets/items/manifest.json` (`item_files`) and verify on-disk existence, `stdDev >= MIN_STD_DEV` (`12.0`), and exact `sha256` digest parity via `compute_image_metadata(fp)`.

### IN-01: Documentation vs Simulator Drift on Ninja Death Strike Detonation Swing Count (3 vs 5 Swings)

**Files modified:** `src/sim/engine.ts`, `tools/build_mockups.ts`, `design/NINJA_SPEC.md`, `mockups/class-comparison.html`, `mockups/ninja-skill-tree.html`, `mockups/samurai-skill-tree.html`
**Commit:** `27edc83`
**Applied fix:** Documented in `src/sim/engine.ts`, `tools/build_mockups.ts` (`MODE_DESCRIPTIONS.ninja_death` and C# snippet comment), and `design/NINJA_SPEC.md` that ModernUO's canonical 5-step `DeathStrike.AddStep(defender)` timer is compressed to 3 subsequent auto-attack swings in single-boss Mode B simulation (`5` in multi-wave) to account for interwoven SpecialMove casts while preserving 100% deterministic simulation baseline hashes.

### IN-02: Duplicate CSS Selector Definitions Between `build_mockups.ts` and `ui_components.ts`

**Files modified:** `tools/build_mockups.ts`, `tools/ui_components.ts`, `index.html`, `mockups/index.html`, `mockups/class-comparison.html`, `mockups/ninja-skill-tree.html`, `mockups/samurai-skill-tree.html`
**Commit:** `3edec0e`
**Applied fix:** Removed duplicate `.arvore-cobra-wrap` and `.paperdoll-figure-box` selector definitions from `buildSharedStyles` in `tools/build_mockups.ts` and consolidated all `.paperdoll-figure-box` layout and torchlight background properties into `tools/ui_components.ts` without `!important`.

### IN-03: Quick Command Bar Shortcut Label (`1–9 Select Tier`) Actually Selects Progression Milestones

**Files modified:** `tools/ui_components.ts`, `mockups/ninja-skill-tree.html`, `mockups/samurai-skill-tree.html`
**Commit:** `6cb080b`
**Applied fix:** Updated the keyboard shortcut chip in `renderQuickCommandBar` (`tools/ui_components.ts`) from `<kbd>1–9</kbd> Select Tier` to `<kbd>1–9</kbd> Select Milestone` to match the `keydown` handler in `tools/build_mockups.ts` and regenerated the skill-tree mockups.

---

_Fixed: 2026-11-07T15:47:15Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
