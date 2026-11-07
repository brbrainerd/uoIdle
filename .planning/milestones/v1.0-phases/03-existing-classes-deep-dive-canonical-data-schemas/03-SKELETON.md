# Phase 3 MVP Slice Plan — Existing Classes Deep-Dive (`Warrior`, `Mage`, `Ranger`) & Canonical Data Schemas

**Phase:** 3 — Existing Classes Deep-Dive (`Warrior`, `Mage`, `Ranger`) & Canonical Data Schemas
**Generated:** 2026-11-07

## User Story

> **As a** UO Idle Lead Developer, **I want to** consult complete, claim-verified knowledgebase pages for live Warrior, Mage, and Ranger skill lines alongside cross-class structural parity rules, combat niche boundaries, and canonical JSON Schema / TypeScript (`zod`) contracts validated against 100% of live class and catalog payloads, **so that** Phase 4's baseline combat simulator and Phase 5's drop-in Samurai and Ninja skill lines conform 1:1 to live UO Idle data structures, progression milestones, and combat roles without guesswork.

## Capability Proven End-to-End

> A developer or agent can read five new claim-verified KB pages across `mechanics/classes/` (`warrior.md`, `mage.md`, `ranger.md`) and `mechanics/topics/` (`class-structural-parity.md`, `combat-niches.md`) passing `python3 mechanics/tools/kb.py check --root mechanics` (`"ok": true`, `"pages": 12`, `"errors": []`), and can run `npx tsx tools/validate_skills.ts --verify` to validate `data/live-classes/{warrior,mage,ranger}.json` and all 134 entries in `mechanics/_raw/bundle/abilities-catalog.json` against `schemas/{effect,skill,class}.schema.json` and `src/schemas/skill.schema.ts` (`{"ok":true,"classes":3,"catalogAbilities":134}`).

## SPIDR Split Decisions & Wave Ordering

| SPIDR Dimension | Slice / Plan | Wave & Dependencies | Rationale |
|---|---|---|---|
| **Knowledgebase & Parity Slice 1 (`03-01-PLAN.md`)** | Deep-dive class KB pages (`mechanics/classes/warrior.md`, `mechanics/classes/mage.md`, `mechanics/classes/ranger.md`) + synthesis topic pages (`mechanics/topics/class-structural-parity.md`, `mechanics/topics/combat-niches.md`) + regenerated `mechanics/INDEX.md` (`INDEX-03`, `INDEX-04`). | **Wave 1** (`depends_on: []`) | Tasks 1 and 2 author all 5 Phase 3 KB pages and rebuild `mechanics/INDEX.md` in a single wave so `class-structural-parity.md` and `combat-niches.md` can cross-link `[[warrior]] C<n>`, `[[mage]] C<n>`, and `[[ranger]] C<n>` and verify `"pages": 12` with zero file ownership conflicts. |
| **Canonical Schemas & Live Data Validator Slice 2 (`03-02-PLAN.md`)** | Canonical JSON Schemas (`schemas/effect.schema.json`, `schemas/skill.schema.json`, `schemas/class.schema.json`), TypeScript `zod` schemas (`src/schemas/skill.schema.ts`), extracted live class definitions (`data/live-classes/{warrior,mage,ranger}.json`), and CLI validator (`tools/validate_skills.ts`) (`INDEX-04`). | **Wave 2** (`depends_on: ["03-01"]`) | Codifies the structural rules, progression-vs-catalog drift (`unlockLevel` vs `progressionTreeLevel`), and `tC` `_r2` alias rules documented in `03-01` into machine-enforced JSON Schema Draft 2020-12 and `zod` contracts, proving 100% pass across the 3 core live classes and all 134 catalog entries. |

## Key Technical Invariants Enforced Across Both Slices

1. **`kb.py` Frontmatter, Category & Tag Contract (`fm-bad-json`, `fm-bad-category`, `claim-unknown-tag`):** Every KB page uses the 9 single-line JSON frontmatter keys (`id`, `title`, `category`, `aliases`, `status`, `sources`, `evidence`, `code_refs`, `updated`), sets `category: "classes"` (from the 12 fixed `CATEGORIES` in `kb.py` — never `"topics"`), and uses only valid `kb.py` claim tags (`bundle-stated`, `doc-stated`, `modernuo-stated`, `verified`, `unverified`, `contradicted`).
2. **Primary `sources[0]` Verbatim Alignment (`quote-not-in-raw`, `quote-line-mismatch`):** `warrior.md`, `mage.md`, and `ranger.md` set `sources[0]: "_raw/bundle/abilities-catalog.json"`; `class-structural-parity.md` sets `sources[0]: "_raw/bundle/skills-and-progression.js"`; `combat-niches.md` sets `sources[0]: "_raw/bundle/classes-config.js"`. Secondary raw files are cited via `[[progression-unlocks]] C<n>`, `[[resources]] C<n>`, `[[damage-and-defense]] C<n>`, `[[tick-and-cooldowns]] C<n>`, and `[[status-effects]] C<n>`.
3. **Digit-Free `## Summary` (`summary-number`):** Every KB page's `## Summary` section spells out numbers in words and contains zero ASCII digits (`0-9`).
4. **Dual-Provenance Unlock Modeling in Schemas (`unlockLevel` + `progressionTreeLevel`):** Because `gE` in `skills-and-progression.js` and `abilities-catalog.json` exhibit intentional drift (e.g., `warrior_shield_bash` catalog `5` vs `gE` `10`, four `gE.ranger`-only arrow skills, `ranger_charged_shot` vs `ranger_charged_shot_r2`, `ranger_deadeye` catalog `100` vs `gE` `55`, `mage_nature_fury` in `gE.spellweaver`), `SkillSchema` and `ProgressionMilestoneSchema` explicitly track both `unlockLevel` and `progressionTreeLevel` plus `inCatalog` and `aliasOf`.
