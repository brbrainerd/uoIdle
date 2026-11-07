---
phase: 1
slug: repository-setup-kb-py-adaptation-live-extraction-pipeline
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-11-07
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `python3 mechanics/tools/kb.py --self-test` + `python3 mechanics/tools/kb.py check --root mechanics` (stdlib Python 3) |
| **Config file** | `mechanics/_raw/manifest.json` |
| **Quick run command** | `python3 mechanics/tools/kb.py --self-test` |
| **Full suite command** | `python3 mechanics/tools/kb.py --self-test && python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `python3 mechanics/tools/kb.py --self-test`
- **After every plan wave:** Run `python3 mechanics/tools/kb.py --self-test && python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics`
- **Before `/gsd-verify-work`:** Full suite must be green (`"ok": true` with zero errors)
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | KB-01 | T-01-01 | `.gitignore` blocks `_crawl/` & `.env*`; directory tree initialized | smoke | `git check-ignore mechanics/_crawl/test.txt .env` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | KB-02 | T-01-02 | `kb.py` validates quotes, links, manifest SHA-256, and rejects credentials (`credential-leak`) | unit / mutation | `python3 mechanics/tools/kb.py --self-test` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 2 | KB-03 | T-01-03 | `bundle_extract.mjs` slices live `v0.99.0` chunks (`index-CCYN0Dy6.js`, `Jogo-D5xEfvfV.js`, `abilities.json`) & writes redacted `_evidence/` | integration | `node tools/bundle_extract.mjs --verify && python3 mechanics/tools/kb.py check --root mechanics` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 2 | KB-04 | — | `fetch_modernuo.py` pulls 48 `.cs` files with SHA-256 provenance into `_raw/modernuo/` & updates `_raw/manifest.json` | integration | `python3 tools/fetch_modernuo.py --verify && python3 mechanics/tools/kb.py check --root mechanics` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `mechanics/tools/kb.py` — adapted from `/Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/tools/kb.py` with `--self-test` covering all error codes including `credential-leak` and `manifest-sha256-mismatch`
- [ ] `mechanics/CONTRIBUTING.md` — 9-key frontmatter contract, claim syntax, and evidence hierarchy
- [ ] `package.json` — devDependencies (`prettier`, `acorn`, `acorn-walk`, `zod`, `tsx`) installed via `npm install`

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

**Approval:** approved 2026-11-07
