---
phase: 03
slug: existing-classes-deep-dive-canonical-data-schemas
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-11-06
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `mechanics/tools/kb.py` (Python 3.9+ stdlib) + `tools/validate_skills.ts` (`tsx` + `zod`) |
| **Config file** | `schemas/{class,skill,effect}.schema.json` + `src/schemas/skill.schema.ts` |
| **Quick run command** | `python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics` |
| **Full suite command** | `python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics && npx tsx tools/validate_skills.ts --verify` |
| **Estimated runtime** | ~1 second |

---

## Sampling Rate

- **After every task commit:** Run `python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics` (plus `npx tsx tools/validate_skills.ts --verify` in Wave 2)
- **After every plan wave:** Run `python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics && npx tsx tools/validate_skills.ts --verify` (once Wave 2 is complete)
- **Before `/gsd-verify-work`:** Full suite must be green (`12` KB pages indexed, `0 errors` from `kb.py check`, `0 errors` from `npx tsx tools/validate_skills.ts --verify`)
- **Max feedback latency:** 1 second

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | INDEX-03 | T-03-01, T-03-02 | `warrior.md`, `mage.md`, & `ranger.md` cite verbatim `sources[0]` lines, document `gE` vs catalog drift, & pass `kb.py check` | cli | `python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics` | ✅ | ⬜ pending |
| 03-01-02 | 01 | 1 | INDEX-04 | T-03-01, T-03-02 | `class-structural-parity.md` & `combat-niches.md` document 4-layer class template, 7 `gE` curves, 12 `samurai_*`/`ninja_*` catalog stubs, and Samurai/Ninja protected niches & pass `kb.py check` (`pages == 12`) | cli | `python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics` | ✅ | ⬜ pending |
| 03-02-01 | 02 | 2 | INDEX-04 | T-03-03 | `schemas/{effect,skill,class}.schema.json` and `src/schemas/skill.schema.ts` compile cleanly under TypeScript/Zod | cli | `npx tsc --noEmit src/schemas/skill.schema.ts` | ✅ | ⬜ pending |
| 03-02-02 | 02 | 2 | INDEX-04 | T-03-03, T-03-04 | `data/live-classes/{warrior,mage,ranger}.json` & `mechanics/_raw/bundle/abilities-catalog.json` (134 entries) pass `tools/validate_skills.ts --verify` with 0 errors | cli | `npx tsx tools/validate_skills.ts --verify` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure (`mechanics/tools/kb.py`, `mechanics/_raw/manifest.json`, and `zod`/`tsx`/`typescript` in `package.json`) covers all Phase 03 wave prerequisites before task execution begins.

---

## Manual-Only Verifications

*All phase behaviors have automated verification.*

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 2s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** ready
