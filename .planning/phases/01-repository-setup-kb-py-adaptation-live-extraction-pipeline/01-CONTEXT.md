# Phase 1: Repository Setup, `kb.py` Adaptation & Live Extraction Pipeline - Context

**Gathered:** 2026-11-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the private repository workflow, adapt `mechanics/tools/kb.py` for UO Idle categories, evidence rankings, and credential sanitization, and populate `mechanics/_raw/` with deterministically formatted client bundle modules, redacted live runtime captures, wiki extracts, and canonical ModernUO C# source files.

</domain>

<decisions>
## Implementation Decisions

### the agent's Discretion
All implementation choices are at the agent's discretion — pure infrastructure phase:
- Adapt `/Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/tools/kb.py` into `mechanics/tools/kb.py` (zero-dependency Python 3 stdlib) with UO Idle categories (`classes`, `skills`, `combat`, `status-effects`, `progression`, `items-equipment`, `dungeons-monsters`, `crafting-gathering`, `companions-mounts`, `engine-ui`, `modernuo-bushido`, `modernuo-ninjitsu`), evidence rank hierarchy (`contradicted < unverified < modernuo-stated < doc-stated < bundle-stated < verified`), multi-source `_raw/{bundle,api,wiki,modernuo}/` manifest loader, automated credential/session-token scanner, and updated `--self-test` mutation suite.
- Use `tools/bundle_extract.mjs` (`prettier` with `printWidth: 100` + `acorn` AST slicing) to deterministically format and slice the live `https://uoidle.com/beta` bundle (`/assets/index-CCYN0Dy6.js`) into `mechanics/_raw/bundle/` and capture redacted live state/wiki snapshots.
- Use `tools/fetch_modernuo.py` (`gh api`) to pull all canonical ModernUO Bushido, Ninjitsu, Perfection (`HonorContext.cs`), and Parry (`BaseWeapon.cs`) C# files into `mechanics/_raw/modernuo/` with SHA-256 provenance in `mechanics/_raw/manifest.json`.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `/Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/tools/kb.py` (1,617 lines) — reference claim-verification engine and `--self-test` suite.
- `/Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/CONTRIBUTING.md` — 9-key frontmatter contract and claim formatting rules.

### Established Patterns
- Verbatim substring + line-range claim verification (`(raw L<a>-L<b>)`), digit-free `## Summary` sections, and weakest-claim page status derivation.

### Integration Points
- `mechanics/_raw/manifest.json` connects `tools/bundle_extract.mjs` and `tools/fetch_modernuo.py` to `mechanics/tools/kb.py check`.

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase.

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
