# Phase 15 Summary: Interactive Button, Smooth-Scroll Navigation & Simulator Reactivity Overhaul

**Phase:** 15 (`15-interactive-button-smooth-scroll-navigation-overhaul-sim-vie`)  
**Status:** Complete (`38/38` Playwright + Computer Vision button checks passing)  
**Date:** 2026-11-07

## 1. Root Causes Identified via Playwright + CV Baseline (`--phase=before`)

1. **Fatal JS `SyntaxError` on `mockups/class-comparison.html`**:
   - An unescaped single-quoted `'Cinzel'` inside a dynamically built HTML string in [`tools/build_mockups.ts`](file:///Users/brbrainerd/dev/uoIdle/tools/build_mockups.ts) caused `SyntaxError: Unexpected identifier 'Cinzel'` on page load, preventing `window.switchCompTab` and `window.updateSimFilter` from registering and rendering all Simulator buttons non-functional (`16/38` passed, `22/38` failed in the BEFORE baseline).
2. **Show/Hide (`display: none`) Instead of Smooth-Scroll & Spotlighting**:
   - `window.switchCompTab` on [`mockups/class-comparison.html`](file:///Users/brbrainerd/dev/uoIdle/mockups/class-comparison.html) and `window.filterAbilityKind` on [`mockups/samurai-skill-tree.html`](file:///Users/brbrainerd/dev/uoIdle/mockups/samurai-skill-tree.html) / [`mockups/ninja-skill-tree.html`](file:///Users/brbrainerd/dev/uoIdle/mockups/ninja-skill-tree.html) hid sections and milestone cards via `style.display = 'none'` instead of keeping all content visible and scrolling/spotlighting.
3. **Missing Visual Reactivity on Simulator & Skill Tree Controls**:
   - `damageBreakdowns` in [`src/sim/engine.ts`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts) only generated `mode_b` entries (`80` total), so toggling `Mode A` vs `Mode B` did not update the 5-Channel Breakdown bars.
   - `renderProgressionSvg` drew static SVG charts across `L10`/`L25`/`L45`/`L60` bracket selections (`0%` SVG region diff).
   - `.exec-kpi-card`, `.uo-quick-dock .kbd-chip`, `.arvore-head .arvore-saldo`, `.passive-badge-item`, and utility `.hotbar-slot` items lacked interactive scroll/spotlight handlers.

## 2. Changes Implemented

- **[`src/sim/engine.ts`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts) & [`data/sim-baselines/gear-and-waves-v1.1.json`](file:///Users/brbrainerd/dev/uoIdle/data/sim-baselines/gear-and-waves-v1.1.json)**:
  - Expanded `runGearAndWaveSuite` to generate `160` 5-channel damage breakdown records covering both `mode_a` and `mode_b` across all 5 classes, 4 brackets (`L10`, `L25`, `L45`, `L60`), and 4 archetypes.
- **[`tools/ui_components.ts`](file:///Users/brbrainerd/dev/uoIdle/tools/ui_components.ts)**:
  - Added smooth-scroll and spotlight CSS classes (`.is-focused-section`, `.milestone-card.is-kind-match`, `.milestone-card.is-kind-dimmed`, `.exec-kpi-card.is-spotlight-class`, `tr.is-class-spotlight td`, `.passive-badge-item.is-selected-seal`, `.hotbar-slot.is-selected-seal`).
  - Wired `renderQuickCommandBar()` and `renderExecutiveClassKpiStrip()` with interactive `onclick` handlers.
- **[`tools/build_mockups.ts`](file:///Users/brbrainerd/dev/uoIdle/tools/build_mockups.ts)**:
  - Fixed JS string escaping in `buildClassComparisonHtml` so the Simulator `<script>` executes with zero console/page errors.
  - Replaced `display: none` in `switchCompTab` and `filterAbilityKind` with smooth scrolling (`window.scrollTo({ top, behavior: 'smooth' })`) and visual spotlighting (`.is-focused-section`, `.is-kind-match` / `.is-kind-dimmed`).
  - Added 6 section jump buttons (`all`, `sim`, `charts`, `endurance`, `matrix`, `armaments`), active bracket spotlight bands in `renderProgressionSvg`, Mode A/B 5-Channel Breakdown updates (`38.74%` CV change in the breakdown region), archetype theme callouts, and interactive handlers for KPI cards, cobra nodes, mastery seals, hotbar slots, quick-dock chips, and header summary pills.
- **[`tools/audit_buttons_cv.ts`](file:///Users/brbrainerd/dev/uoIdle/tools/audit_buttons_cv.ts)**:
  - Built automated Playwright + Python Pillow (`ImageChops` / `ImageStat`) Computer Vision harness capturing `before`, `after`, and amplified pixel `diff` screenshots across 38 button interactions and generating [`mockups/screenshots/cv-audit/COMPARISON_REPORT.md`](file:///Users/brbrainerd/dev/uoIdle/mockups/screenshots/cv-audit/COMPARISON_REPORT.md).

## 3. Verification Results

- `npx tsx tools/audit_buttons_cv.ts --phase=after`: **`38/38` passed (`0` failed)** vs `16/38` passed in `--phase=before`.
- `npx tsx tools/build_mockups.ts --verify`: **`ok: true`** (`5` mockups, `4` screenshots, `139` resolved assets).
- `npx tsx tools/sim_balance.ts --verify`: **`ok: true`** (`80` scenarios pass).
- `npx tsx tools/test_sim.ts`: **`16/16` passed**.
- `python3 mechanics/tools/kb.py check`: **`0` errors (`56` pages, `649` verified claims)**.
