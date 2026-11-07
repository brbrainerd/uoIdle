---
phase: 16-ui-deduplication-progressive-disclosure-cv-flywheel
reviewed: 2026-11-07T23:38:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - tools/ui_components.ts
  - tools/build_mockups.ts
  - tools/audit_buttons_cv.ts
findings:
  critical: 0
  warning: 3
  info: 1
  total: 4
status: issues_found
---

# Phase 16: Code Review Report (`--fix`)

**Reviewed:** 2026-11-07
**Depth:** Standard (`npx tsc --noEmit --strict` + multi-surface behavioral & DOM reactivity review)
**Scope:** `tools/ui_components.ts`, `tools/build_mockups.ts`, `tools/audit_buttons_cv.ts`
**Status:** 4 findings identified (`0` Critical, `3` Warning, `1` Info) — all 4 auto-fixed via `--fix`.

---

## Findings

### Warning Findings

#### `WR-01` — `#hotbar-active-readout` and `#seal-active-readout` Do Not Update Dynamically on Slot/Medallion Click
- **File:** `tools/build_mockups.ts` (`L2936–L2961`)
- **Problem:** Iteration 2 introduced the 5-icon horizontal hotbar strip (`.hotbar-icon-strip`) with `#hotbar-active-readout` and the 4-medallion seal strip (`.seal-medallion-strip`) with `#seal-active-readout`. However, `selectHotbarSlot(slotIdx, targetAbilityId)` and `selectPassiveSeal(sealIdx, targetAbilityId)` only toggled `.is-selected-seal` and triggered `selectAbility(...)`, leaving the readout text static on `Slot 1` and `Tier I`.
- **Fix:** Include `passiveBadges` in `embeddedPayload` and update `#hotbar-active-readout` and `#seal-active-readout` dynamically inside `selectHotbarSlot` and `selectPassiveSeal`.

#### `WR-02` — Quick-Dock `Space Combat Sim` (`handleQuickDock('ticker')`) Does Not Activate the `100ms Sim` Tab
- **File:** `tools/build_mockups.ts` (`L3007–L3010`)
- **Problem:** After making `[data-insp-pane="ticker"]` a progressive-disclosure tab (`100ms Sim`), clicking the Quick Command Bar's `Space Combat Sim` chip called `window.stepCombatTicker()` and scrolled to `#sec-ability-inspector` without switching the inspector tab to `'ticker'`.
- **Fix:** Call `window.switchInspectorTab('ticker')` inside `handleQuickDock('ticker')` before stepping the combat ticker.

#### `WR-03` — Hotbar Socket Short Labels Repeat `"Lesser"` Three Times (`Slot 1`, `Slot 3`, `Slot 4`)
- **File:** `tools/build_mockups.ts` (`L2086`)
- **Problem:** `const shortLbl = slot.label.split(' ')[0]` truncated `"Lesser Heal"`, `"Lesser Cure"`, and `"Lesser Refresh"` to `"Lesser"`, producing three identically labeled sockets (`Lesser`, `Bandage`, `Lesser`, `Lesser`, `Bolt`).
- **Fix:** Strip the `"Lesser "` prefix first (`slot.label.replace(/^Lesser\s+/i, '').split(' ')[0]`) so the 5 sockets display distinct, readable labels (`Heal`, `Bandage`, `Cure`, `Refresh`, `Bolt`/`Arrow`).

### Info Findings

#### `IN-01` — Locale Toggle (`setLocale`) Does Not Localize `#seal-active-readout`
- **File:** `tools/build_mockups.ts` (`L2743–L2752`)
- **Problem:** Switching between `EN` and `PT-BR` updates `[data-en][data-pt]` elements and the paperdoll tooltip, but does not re-render `#seal-active-readout` in the active language.
- **Fix:** Track `selectedSealIdx` and call `updateSealReadout(selectedSealIdx)` inside `setLocale(lang)`.
