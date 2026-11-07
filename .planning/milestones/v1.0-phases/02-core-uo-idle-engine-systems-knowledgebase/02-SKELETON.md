# Phase 2 MVP Slice Plan — Core UO Idle Engine & Systems Knowledgebase

**Phase:** 2 — Core UO Idle Engine & Systems Knowledgebase
**Generated:** 2026-11-07

## User Story

> **As a** UO Idle Lead Developer, **I want to** look up claim-verified KB pages for UO Idle's combat tick loop, cooldown/haste resolution, hit/crit/mitigation math, resource regeneration, status effect opcodes, progression/equipment systems, and the Client/Shared/Server Engine Capability Matrix, **so that** every formula, server rule, and Mode A vs Mode B capability boundary used to design and simulate Samurai and Ninja in Phases 3–5 is backed by verbatim `(raw L<a>-L<b>)` citations and verified live evidence.

## Capability Proven End-to-End

> A developer or agent can read seven cross-linked KB pages across `mechanics/combat/` (`resources.md`, `tick-and-cooldowns.md`, `damage-and-defense.md`, `status-effects.md`), `mechanics/systems/` (`progression-unlocks.md`, `equipment-affixes.md`), and `mechanics/topics/` (`engine-capability-matrix.md`), trace every formula and opcode back to `mechanics/_raw/` and `mechanics/_evidence/live-bundle-probe.txt`, and run `python3 mechanics/tools/kb.py --self-test && python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics` to get `"ok": true`, `"pages": 7`, and `"errors": []`.

## SPIDR Split Decisions & Wave Ordering

| SPIDR Dimension | Slice / Plan | Wave & Dependencies | Rationale |
|---|---|---|---|
| **Data / Rules Slice 1 (`02-01-PLAN.md`)** | Core combat & resource KB pages (`mechanics/combat/resources.md`, `mechanics/combat/tick-and-cooldowns.md`, `mechanics/combat/damage-and-defense.md`, `mechanics/combat/status-effects.md`) + `mechanics/INDEX.md` (`INDEX-01`). | **Wave 1** (`depends_on: []`) | `mechanics/combat/resources.md` (`sources[0]: "_raw/wiki/changelog-server-dev.md"`) is authored first in Task 1 to establish the 18 canonical server changelog anchor claims (`[[resources]] C1..C18`) that all downstream combat, systems, and capability matrix pages cite via `[[resources]] C<n>`. |
| **System / Capability Slice 2 (`02-02-PLAN.md`)** | Progression & equipment system KB pages (`mechanics/systems/progression-unlocks.md`, `mechanics/systems/equipment-affixes.md`) + the 3-tier Client/Shared/Server **Engine Capability Matrix** (`mechanics/topics/engine-capability-matrix.md`) + `mechanics/INDEX.md` (`INDEX-01`, `INDEX-02`). | **Wave 2** (`depends_on: ["02-01"]`) | Runs sequentially in Wave 2 after `02-01` because both plans rebuild `mechanics/INDEX.md` and `02-02` resolves cross-page claim references (`[[resources]] C<n>`, `[[tick-and-cooldowns]] C<n>`, `[[damage-and-defense]] C<n>`, `[[status-effects]] C<n>`) during `kb.py check --root mechanics`. |

## Key Technical Invariants Enforced Across Both Slices

1. **Single-Line JSON Frontmatter Values (`fm-bad-json`):** Every KB page frontmatter uses the exact 9 keys (`id`, `title`, `category`, `aliases`, `status`, `sources`, `evidence`, `code_refs`, `updated`) formatted as single-line `key: <JSON literal>` entries between `---` fences.
2. **Primary `sources[0]` Verbatim Alignment (`quote-not-in-raw`, `quote-line-mismatch`):** Every `(raw L<a>-L<b>)` claim quotes `sources[0]` verbatim; secondary `_raw/` files are listed in `sources[1..]` and `evidence` (`bundle: ...`, `wiki: ...`) and cross-referenced via `[[slug]] C<n>`.
3. **Digit-Free `## Summary` (`summary-number`):** Every `## Summary` section spells out numbers in words and contains zero ASCII digits (`0-9`).
4. **Weakest-Claim Status & Verified Topic Synthesis (`status-mismatch`, `claim-bad-cite`):** On `mechanics/topics/engine-capability-matrix.md`, all claims (`(raw L<a>-L<b>)` against `_raw/api/protocol-commands-index.json` and `(evidence 1)` against `"live: _evidence/live-bundle-probe.txt L1-L20"`) use the `[verified]` tag so `min(tags, key=lambda t: RANK[t]) == "verified"` and the page achieves `status: "verified"`.
