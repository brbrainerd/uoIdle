---
phase: 16-ui-deduplication-progressive-disclosure-cv-flywheel
reviewed: 2026-11-07T23:39:00Z
findings_fixed: 4
findings_total: 4
status: all_fixed
---

# Phase 16: Code Review Fix Summary (`--fix`)

All 4 findings in `16-REVIEW.md` (`WR-01`, `WR-02`, `WR-03`, `IN-01`) have been resolved in `tools/build_mockups.ts`:

1. **`WR-01` Fixed**: Embedded `passiveBadges` into `embeddedPayload` and added dynamic updates to `#hotbar-active-readout` inside `selectHotbarSlot` and `#seal-active-readout` inside `selectPassiveSeal`.
2. **`WR-02` Fixed**: Updated `handleQuickDock('ticker')` to call `window.switchInspectorTab('ticker')` so activating `Space Combat Sim` opens the `100ms Sim` tab and steps the live loop.
3. **`WR-03` Fixed**: Replaced `slot.label.split(' ')[0]` with `slot.label.replace(/^Lesser\s+/i, '').split(' ')[0]` so the 5 hotbar sockets render distinct short names (`Heal`, `Bandage`, `Cure`, `Refresh`, `Bolt`/`Arrow`).
4. **`IN-01` Fixed**: Updated `setLocale(lang)` to invoke `updateSealReadout(selectedSealIdx)` so `#seal-active-readout` updates when switching between `EN` and `PT-BR`.
