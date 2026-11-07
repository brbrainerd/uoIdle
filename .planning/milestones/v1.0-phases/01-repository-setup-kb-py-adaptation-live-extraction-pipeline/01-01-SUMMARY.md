---
phase: 01-repository-setup-kb-py-adaptation-live-extraction-pipeline
plan: 01
subsystem: infra
tags: [python3, kb-linter, claim-verification, credential-scanning, gitignore, manifest]

requires: []
provides:
  - "Private repository verification and .gitignore blocking mechanics/_crawl/, node_modules/, and .env* secrets"
  - "mechanics/CONTRIBUTING.md defining the 9-key frontmatter contract, 12 UO Idle categories, 6-tier evidence rank hierarchy, and citation rules"
  - "Adapted zero-dependency mechanics/tools/kb.py with build, check, multi-source _raw/manifest.json validation, credential scanning, and self-contained 28-mutation --self-test suite"
  - "Seed mechanics/_raw/manifest.json and generated mechanics/INDEX.md"
affects:
  - 01-02
  - 01-03
  - phase-2
  - phase-3
  - phase-4

actuals:
  tokens: 8200
  tasks: 2
  commits: 2

tech-stack:
  added: [python3-stdlib]
  patterns:
    - "9-key JSON-per-line YAML frontmatter (id, title, category, aliases, status, sources, evidence, code_refs, updated)"
    - "6-tier evidence rank hierarchy (contradicted < unverified < modernuo-stated < doc-stated < bundle-stated < verified)"
    - "Multi-source _raw/{bundle,api,wiki,modernuo}/ provenance verification via mechanics/_raw/manifest.json"
    - "Automated credential and session-token sanitizer gate in kb.py check"

key-files:
  created:
    - .gitignore
    - mechanics/CONTRIBUTING.md
    - mechanics/tools/kb.py
    - mechanics/_raw/manifest.json
    - mechanics/INDEX.md
  modified: []

key-decisions:
  - "Embedded self-test raw fixtures directly inside mechanics/tools/kb.py so --self-test runs in a temporary directory with zero external fixture dependencies"
  - "Designed check_raw_manifest(root) to validate 1:1 SHA-256 and line counts between mechanics/_raw/manifest.json and _raw/{bundle,api,wiki,modernuo}/ while only requiring markdown pages when requiredPage is explicitly set on an entry"
  - "Configured check_credentials(root) to detect live Bearer tokens, JWTs (eyJ...), cookies, and non-redacted secret JSON fields (uo-idle-token, idToken, password) without false-positiving on JS template literals or <REDACTED> placeholders"

patterns-established:
  - "Verbatim substring claim verification: - **C<n>** [<tag>] \"<quote>\" (raw L<a>-L<b>) verified against whitespace-collapsed sources[0] lines a..b"
  - "Digit-free ## Summary enforcement: all numbers must reside in line-cited ## Claims"

requirements-completed:
  - KB-01
  - KB-02

coverage:
  - id: D1
    description: "Private GitHub repository verified and .gitignore configured to block mechanics/_crawl/, node_modules/, and .env* files"
    requirement: KB-01
    verification:
      - kind: integration
        ref: "gh repo view brbrainerd/uoIdle --json isPrivate --jq '.isPrivate' && git check-ignore mechanics/_crawl/raw.js .env node_modules/foo"
        status: pass
    human_judgment: false
  - id: D2
    description: "mechanics/tools/kb.py adapted for UO Idle 12 categories, 6 evidence ranks, multi-source manifest.json verification, credential scanning, and 28-mutation self-contained --self-test"
    requirement: KB-02
    verification:
      - kind: unit
        ref: "python3 mechanics/tools/kb.py --self-test && python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics"
        status: pass
    human_judgment: false

duration: 6min
completed: 2026-11-06
status: complete
---

# Phase 1 Plan 01: Repository Setup & `kb.py` Adaptation Summary

**Private repository boundary, `mechanics/CONTRIBUTING.md` contributor contract, and zero-dependency `mechanics/tools/kb.py` verifier adapted for UO Idle's 12 categories, 6-tier evidence ranks, multi-source `_raw/manifest.json` SHA-256 checks, credential scanning, and 28-mutation `--self-test` harness**

## Performance

- **Duration:** 6 min
- **Started:** 2026-11-07T03:26:35Z
- **Completed:** 2026-11-07T03:32:10Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Verified `brbrainerd/uoIdle` remote privacy (`isPrivate: true`, `visibility: "PRIVATE"`), scaffolded the `mechanics/` and `tools/` directory hierarchy, and authored `.gitignore` to block `mechanics/_crawl/`, `node_modules/`, `.env*`, and session dumps (`KB-01`).
- Authored `mechanics/CONTRIBUTING.md` documenting the 9-key frontmatter contract (`code_refs`), 12 UO Idle categories, 6 evidence rank tags (`contradicted < unverified < modernuo-stated < doc-stated < bundle-stated < verified`), verbatim `(raw L<a>-L<b>)` and `(evidence N)` citation rules, and credential sanitization policy.
- Adapted `mechanics/tools/kb.py` (Python 3 stdlib only) with multi-source `mechanics/_raw/manifest.json` verification (`manifest-invalid`, `raw-missing`, `raw-hash-mismatch`, `raw-orphan`, `page-missing`), `check_credentials(root)` (`credential-leak`), and a self-contained 28-mutation `--self-test` suite (`KB-01`, `KB-02`).
- Initialized `mechanics/_raw/manifest.json` and generated `mechanics/INDEX.md`, passing `--self-test`, `build`, and `check` with `"ok": true`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Verify private GitHub repository, scaffold directory tree & .gitignore, and author mechanics/CONTRIBUTING.md** - `094dbec` (chore)
2. **Task 2: Adapt mechanics/tools/kb.py for UO Idle categories, 6-tier ranks, multi-source manifest checks, credential scanning, and self-contained --self-test** - `cd51d09` (feat)

## Files Created/Modified

- `.gitignore` - Git exclusion rules blocking `mechanics/_crawl/`, `node_modules/`, `.env*`, `*cookies*.json`, and `*session*.json`
- `mechanics/CONTRIBUTING.md` - UO Idle 9-key frontmatter contract, 12 categories, 6 evidence ranks, citation rules, and extraction workflow
- `mechanics/tools/kb.py` - Zero-dependency Python 3 KB index builder, claim verifier, multi-source `_raw/manifest.json` validator, credential scanner, and 28-mutation `--self-test` harness
- `mechanics/_raw/manifest.json` - Seed multi-source provenance manifest initialized for `v0.99.0` and ModernUO commit `b0e6b17c5cba3a6944ca25a9676dcdec0022ac38`
- `mechanics/INDEX.md` - Generated mechanics KB index file

## Decisions Made

- Embedded self-test raw fixtures (`SELFTEST_RAW_FILES`, `SELFTEST_PAGES`, `SELFTEST_TOPIC`) directly inside `mechanics/tools/kb.py` so `--self-test` executes in a temporary directory with zero external fixture file dependencies.
- Decoupled 1:1 raw-file-to-markdown-page enforcement in `check_raw_manifest(root)` so Phase 1 can populate all 68 `_raw/` files in Plans 01-02 and 01-03 before markdown pages are authored in Phases 2–4, while still enforcing `page-missing` whenever `"requiredPage"` is specified on a manifest entry.
- Designed `check_credentials(root)` to catch real Bearer tokens, JWTs (`eyJ...`), cookie headers, and secret JSON fields (`uo-idle-token`, `idToken`, `password`, `access_token`, `refresh_token`, `client_secret`) while ignoring `<REDACTED>` placeholders and JS template literals in `_raw/bundle/`.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `git check-ignore -q` only accepts a single path argument in Git; verified multi-path ignore rules using `git check-ignore mechanics/_crawl/raw.js .env node_modules/foo` without `-q`, which confirmed all three paths are ignored and exited `0`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `mechanics/tools/kb.py` and `mechanics/_raw/manifest.json` are ready for Plan `01-02-PLAN.md` (`tools/bundle_extract.mjs` live UO Idle `v0.99.0` bundle formatting and AST slicing) and Plan `01-03-PLAN.md` (`tools/fetch_modernuo.py` canonical ModernUO C# archival).

## Self-Check: PASSED

- Verified all created files (`.gitignore`, `mechanics/CONTRIBUTING.md`, `mechanics/tools/kb.py`, `mechanics/_raw/manifest.json`, `mechanics/INDEX.md`) exist on disk.
- Verified task commits `094dbec` and `cd51d09` in `git log`.
- Verified `python3 mechanics/tools/kb.py --self-test`, `build`, and `check` all pass with `"ok": true`.

---
*Phase: 01-repository-setup-kb-py-adaptation-live-extraction-pipeline*
*Completed: 2026-11-06*
