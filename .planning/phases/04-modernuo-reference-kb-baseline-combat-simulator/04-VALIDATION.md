---
phase: 4
slug: modernuo-reference-kb-baseline-combat-simulator
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-11-06
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `kb.py` (Python 3 KB validator) + `tools/sim_balance.ts --verify` (`tsx` + `zod`) |
| **Config file** | `package.json` |
| **Quick run command** | `python3 mechanics/tools/kb.py check --root mechanics && npx tsx tools/sim_balance.ts --verify` |
| **Full suite command** | `python3 mechanics/tools/kb.py check --root mechanics && npm run validate:skills && npx tsx tools/sim_balance.ts --baseline --verify` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `python3 mechanics/tools/kb.py check --root mechanics` (for Wave 1/2 tasks) and `npx tsx tools/sim_balance.ts --verify` (once Wave 3 creates `tools/sim_balance.ts`).
- **After every plan wave:** Run full suite (`python3 mechanics/tools/kb.py check --root mechanics && npm run validate:skills && npx tsx tools/sim_balance.ts --baseline --verify`).
- **Before `/gsd-verify-work`:** Full suite must be green with 0 errors.
- **Max feedback latency:** 2 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | SIM-01 | — | Verbatim C# quotes match `_raw/modernuo/*.cs` and `manifest.json` SHA256 | KB linter | `python3 mechanics/tools/kb.py check --root mechanics` | ✅ | ⬜ pending |
| 04-01-02 | 01 | 1 | SIM-01 | — | `modernuo-bushido.md` & `modernuo-ninjitsu.md` pass `kb.py` with 0 errors | KB linter | `python3 mechanics/tools/kb.py check --root mechanics` | ✅ | ⬜ pending |
| 04-02-01 | 02 | 2 | SIM-01 | — | `design/MODERNUO_MAPPING.md` covers all 8 Bushido + 9 Ninjitsu mechanics + Mode A/B | Content & KB check | `test -f design/MODERNUO_MAPPING.md && python3 mechanics/tools/kb.py check --root mechanics` | ❌ W2 | ⬜ pending |
| 04-03-01 | 03 | 3 | SIM-02 | — | `src/sim/` deterministic combat math & 4 brackets × 4 archetypes compile and run | TypeScript & Sim check | `npx tsx tools/sim_balance.ts --verify` | ❌ W3 | ⬜ pending |
| 04-03-02 | 03 | 3 | SIM-02 | — | `tools/sim_balance.ts --baseline --json` outputs Warrior/Mage/Ranger baseline telemetry | CLI integration check | `npx tsx tools/sim_balance.ts --baseline --verify` | ❌ W3 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure (`python3 mechanics/tools/kb.py`, `npx tsx`, `zod`, and `tools/validate_skills.ts`) covers all pre-execution dependencies; no external Wave 0 test framework installation is needed.

---

## Manual-Only Verifications

All Phase 4 behaviors have automated verification (`kb.py check --root mechanics` for `SIM-01` KB integrity, structural assertions for `design/MODERNUO_MAPPING.md`, and `npx tsx tools/sim_balance.ts --baseline --verify` for `SIM-02`).

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 2s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** ready
