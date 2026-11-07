---
phase: 2
slug: core-uo-idle-engine-systems-knowledgebase
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-11-06
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `python3 mechanics/tools/kb.py` (`--self-test`, `build`, `check`) |
| **Config file** | `mechanics/_raw/manifest.json` |
| **Quick run command** | `python3 mechanics/tools/kb.py check --root mechanics` |
| **Full suite command** | `python3 mechanics/tools/kb.py --self-test && python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics`
- **After every plan wave:** Run `python3 mechanics/tools/kb.py --self-test && python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics`
- **Before `/gsd-verify-work`:** Full suite must be green (`"ok": true`, `"pages": 7` or more, `"errors": []`)
- **Max feedback latency:** 3 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | INDEX-01 | — | `resources.md` and `tick-and-cooldowns.md` pass verbatim quote, link, and digit-free Summary checks | integration | `python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics` | ✅ | ⬜ pending |
| 02-01-02 | 01 | 1 | INDEX-01 | — | `damage-and-defense.md` and `status-effects.md` pass verbatim quote, cross-link (`[[resources]] C<n>`), and digit-free Summary checks | integration | `python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 2 | INDEX-01, INDEX-02 | — | `progression-unlocks.md`, `equipment-affixes.md`, and `engine-capability-matrix.md` pass `kb.py check` with 7+ pages and rebuilt `INDEX.md` | integration | `python3 mechanics/tools/kb.py --self-test && python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure (`mechanics/tools/kb.py` and `mechanics/_raw/manifest.json` from Phase 1) covers all phase requirements.*

---

## Manual-Only Verifications

*All phase behaviors have automated verification.*

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 3s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-11-06
