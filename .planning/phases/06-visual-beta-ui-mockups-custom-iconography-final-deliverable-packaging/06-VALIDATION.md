---
phase: 6
slug: visual-beta-ui-mockups-custom-iconography-final-deliverable-packaging
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-11-07
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Python 3 CLI (`tools/generate_icons.py --verify`, `mechanics/tools/kb.py`) + TypeScript CLI (`npx tsx tools/build_mockups.ts --verify`, `npx tsx tools/validate_skills.ts --verify`, `npx tsx tools/sim_balance.ts --verify`) |
| **Config file** | `package.json` / `tsconfig.json` |
| **Quick run command** | `python3 tools/generate_icons.py --verify && npx tsx tools/build_mockups.ts --verify` |
| **Full suite command** | `python3 mechanics/tools/kb.py --self-test && python3 mechanics/tools/kb.py check --root mechanics && npx tsx tools/validate_skills.ts --verify && npx tsx tools/sim_balance.ts --verify && python3 tools/generate_icons.py --verify && npx tsx tools/build_mockups.ts --verify` |
| **Estimated runtime** | ~4 seconds |

---

## Sampling Rate

- **After every task commit:** Run `python3 tools/generate_icons.py --verify` (Plan 06-01) or `npx tsx tools/build_mockups.ts --verify` (Plan 06-02)
- **After every plan wave:** Run `python3 tools/generate_icons.py --verify && npx tsx tools/build_mockups.ts --verify && npx tsx tools/validate_skills.ts --verify && npx tsx tools/sim_balance.ts --verify && python3 mechanics/tools/kb.py check --root mechanics`
- **Before `/gsd-verify-work`:** Full 6-command Milestone v1.0 verification suite must be green (`exit 0`)
- **Max feedback latency:** 4 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | `VISUAL-01` | V5, V6 (Asset & SHA-256 Integrity) | Generates Samurai & Ninja hero portraits ($256\times 256$ & $64\times 64$) and all Samurai (`12` canonical + `11` alias/badge) and Ninja (`13` canonical + `9` alias/badge) icons at $64\times 64$ and $48\times 48$, `contact-sheet.png`, and `manifest.json` | image dimensions + pixel variance + SHA-256 | `python3 tools/generate_icons.py --verify` | ❌ W1 (`tools/generate_icons.py`) | ⬜ pending |
| 06-02-01 | 02 | 2 | `VISUAL-02` | V5 (Schema & HTML Escaping) | `tools/build_mockups.ts` compiles self-contained `mockups/{samurai-skill-tree,ninja-skill-tree,class-comparison}.html` and captures `mockups/screenshots/{samurai-skill-tree,ninja-skill-tree,class-comparison}.png` | schema + DOM/asset parity + screenshot check | `npx tsx tools/build_mockups.ts --verify` | ❌ W2 (`tools/build_mockups.ts`) | ⬜ pending |
| 06-02-02 | 02 | 2 | `VISUAL-01`, `VISUAL-02` | V4, V5 (Secret Scan & E2E Gate) | Root `README.md` indexes all deliverables and the full 6-command Milestone v1.0 verification suite exits `0` with zero secret leaks | e2e verification + secret scan | `python3 mechanics/tools/kb.py --self-test && python3 mechanics/tools/kb.py check --root mechanics && npx tsx tools/validate_skills.ts --verify && npx tsx tools/sim_balance.ts --verify && python3 tools/generate_icons.py --verify && npx tsx tools/build_mockups.ts --verify` | ✅ `mechanics/tools/kb.py` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure (`src/schemas/skill.schema.ts`, `tools/validate_skills.ts`, `tools/sim_balance.ts`, `mechanics/tools/kb.py`, Python `PIL 13.0.0`, and headless Google Chrome) is already installed and ready; `tools/generate_icons.py` and `tools/build_mockups.ts` are created as the primary deliverables of Plans 06-01 and 06-02.

---

## Manual-Only Verifications

*All phase behaviors have automated verification.*

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** ready
