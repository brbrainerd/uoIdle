---
phase: 02-core-uo-idle-engine-systems-knowledgebase
verified: 2026-11-08T00:00:00Z
status: passed
score: 9/9 must-haves verified
covered_files:
  - ".planning/phases/02-core-uo-idle-engine-systems-knowledgebase/02-01-PLAN.md"
  - ".planning/phases/02-core-uo-idle-engine-systems-knowledgebase/02-01-SUMMARY.md"
  - ".planning/phases/02-core-uo-idle-engine-systems-knowledgebase/02-02-PLAN.md"
  - ".planning/phases/02-core-uo-idle-engine-systems-knowledgebase/02-02-SUMMARY.md"
  - "mechanics/INDEX.md"
  - "mechanics/combat/damage-and-defense.md"
  - "mechanics/combat/resources.md"
  - "mechanics/combat/status-effects.md"
  - "mechanics/combat/tick-and-cooldowns.md"
  - "mechanics/systems/equipment-affixes.md"
  - "mechanics/systems/progression-unlocks.md"
  - "mechanics/topics/engine-capability-matrix.md"
covered_digest: "v1:sha256:5a92050ccb00562604a042f679d27f4022f57ce9dd0e315528745408d280a244"
behavior_unverified: 2026-11-08T00:00:00Z
overrides_applied: 0
decision_coverage:
  honored: 0
  total: 0
  not_honored: []
---

# Phase 2: Core UO Idle Engine & Systems Knowledgebase Verification Report

**Phase Goal:** Reverse-engineer and document UO Idle's core combat tick loop, cooldown/haste resolution, hit/crit/mitigation math, resource economy, status effect opcodes, progression/equipment systems, and client-vs-server execution authority in claim-verified KB pages.
**Verified:** 2026-11-07T04:32:00Z
**Status:** passed
**Re-verification:** No — initial verification

## User Flow Coverage (MVP Mode)

| # | User Story Step | Expected Outcome | Codebase Evidence | Status |
|---|-----------------|------------------|-------------------|--------|
| 1 | Look up claim-verified combat resources, potions, class resource overrides, and Hunting Energy math | Developer can audit vital formulas, percentage potion/spell heals (`15%/25%/35%`), Warrior 0-mana/0-Meditation caps, Paladin `1 gp/pt` Chivalry tithe, and 22 server changelog anchor claims (`C1..C22`) | `mechanics/combat/resources.md` (`L1-L117`, 22 verbatim `[doc-stated]` claims against `_raw/wiki/changelog-server-dev.md`) | ✓ VERIFIED |
| 2 | Look up combat tick loop, 12-slot hotbar, trigger condition builders, and cooldown floors | Developer can audit passive auto-attacks (`Sg`), 12-slot hotbar (`Gn = 12, Mo = 0`), catalog filter (`Fc, Uw, OE`), condition builders (`jo, hu, hh, Td, HE, fu, fh, zE`), default triggers (`ro`), seeded class hotbars (`gh`), 2s `Custom` CD floor, and 5s-stepped dungeon respawn timers | `mechanics/combat/tick-and-cooldowns.md` (`L1-L131`, 12 verbatim `[bundle-stated]` claims against `_raw/bundle/abilities-loader-and-hotbar.js` + `[[resources]] C6, C7, C8, C14` cross-links) | ✓ VERIFIED |
| 3 | Look up damage, healing, defense mitigation, postures, and status effect / ability dispatch catalog | Developer can audit client estimators (`Eq, Aq, Mq, Cq, jq, wq, Nq, Sq, kq`), server level-power multipliers (`casters x80, physical x60`), postures, attribute/resist caps, and all 6 ability dispatch kinds (`ItemUse, Passive, WeaponAbility, Spell, SpecialMove, Custom`) across 134 catalog entries | `mechanics/combat/damage-and-defense.md` (`L1-L119`, 12 verbatim claims) and `mechanics/combat/status-effects.md` (`L1-L115`, 16 verbatim claims including pre-wired `samurai_*` and `ninja_*` entries) | ✓ VERIFIED |
| 4 | Look up progression/unlock trees (`jc, dx, hE, gE, mx, [Arvore`) and equipment/affixes/bestiary scaling | Developer can audit the 58 UO skills (`jc`), 16 class roles (`dx`), starter skills (`hE`), L1–60 unlock tables (`gE`, noting missing `gE.samurai` and `gE.ninja`), starter kits (`mx`), `[Arvore` point rules, `[personagembonus` polling (`eI, vh`), 21 item affixes, 13 tree bonus keys, 5 rarity hues (`$A`), material tiers, and 14 Bestiary families (`sk`) | `mechanics/systems/progression-unlocks.md` (`L1-L117`, 14 verbatim claims) and `mechanics/systems/equipment-affixes.md` (`L1-L124`, 10 verbatim claims) | ✓ VERIFIED |
| 5 | Audit the 3-tier Client/Shared/Server Engine Capability Matrix and Mode A vs Mode B boundary for Samurai and Ninja | Developer can verify which combat primitives execute on Client, Shared Config, or Authoritative Server, inspect the live Samurai/Ninja bundle footprint, and distinguish Mode A (zero server code changes) from Mode B (`<20 LOC` native C# hooks) | `mechanics/topics/engine-capability-matrix.md` (`L1-L104`, `status: "verified"`, 17 `[verified]` claims citing `live: _evidence/live-bundle-probe.txt L1-L20` and `_raw/api/protocol-commands-index.json`) | ✓ VERIFIED |

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Developer can look up claim-verified KB pages under `mechanics/combat/` (`tick-and-cooldowns.md`, `damage-and-defense.md`, `resources.md`, `status-effects.md`) and `mechanics/systems/` (`progression-unlocks.md`, `equipment-affixes.md`) where every formula and rule cites exact line spans from `mechanics/_raw/`. (Roadmap SC 1) | ✓ VERIFIED | All 6 pages exist on disk with 86 combined verbatim `(raw L<a>-L<b>)` claims verified by `kb.py check --root mechanics` (`errors: []`). |
| 2 | Developer can audit an explicit **Engine Capability Matrix** classifying every live UO Idle combat hook, trigger, and status effect opcode as Client-Evaluated, Shared-Config, or Server-Authoritative based on bundle and live WebSocket/network verification. (Roadmap SC 2) | ✓ VERIFIED | `mechanics/topics/engine-capability-matrix.md` (`status: "verified"`, `L40-L54`) provides an 8-row, 3-tier architectural matrix cross-linking all 6 sibling KB pages and citing `live: _evidence/live-bundle-probe.txt L1-L20` + `_raw/api/protocol-commands-index.json`. |
| 3 | `python3 mechanics/tools/kb.py check --root mechanics` passes with zero errors across all core engine and system KB pages and regenerates `mechanics/INDEX.md`. (Roadmap SC 3 / Plan 02-01 T4 / Plan 02-02 T4) | ✓ VERIFIED | Executed `kb.py --self-test` (`28/28` mutations caught), `kb.py build --root mechanics` (`pages: 7`), and `kb.py check --root mechanics` (`{"ok": true, "pages": 7, "errors": []}`). |
| 4 | Developer can consult `mechanics/combat/resources.md` for claim-verified rules on HP/Mana/Stamina pools, percentage-based potion and heal spell scaling (`15%/25%/35%`), Warrior 0-mana and 0-Meditation caps, Paladin Chivalry gold tithe, Hunting Energy drain/recovery/refill formulas, and all 18+ canonical server changelog anchor claims (`C1..C18`). (Plan 02-01 T1) | ✓ VERIFIED | `mechanics/combat/resources.md` defines `C1..C22` quoting `_raw/wiki/changelog-server-dev.md` verbatim and documents vital pool math (`L45-L60`), percentage potions/heals (`L62-L72`), Warrior/Paladin rules (`L74-L80`), 17-reagent table `ok` (`L81-L106`), and Hunting Energy refill formula (`L108-L116`). |
| 5 | Developer can consult `mechanics/combat/tick-and-cooldowns.md` for claim-verified rules on the 12-slot hotbar (`Gn = 12, Mo = 0`), ability catalog filtering (`Fc, Uw, OE`), auto-trigger condition builders (`jo, hu, hh, Td, HE, fu, fh, zE`), default trigger assignments (`ro`), seeded class hotbars (`gh`), 2s Custom cooldown floor, and dungeon respawn cooldown steps. (Plan 02-01 T2) | ✓ VERIFIED | `mechanics/combat/tick-and-cooldowns.md` defines `C1..C12` quoting `_raw/bundle/abilities-loader-and-hotbar.js` verbatim and documents `Sg`, `Gn=12`, `Fc/Uw/OE`, `ro(e)`, `rk(e)`, `gh` (including `ninja` and `samurai`), `#HABINFO` 2s floor, and 50s–20s respawn steps (`L35-L130`). |
| 6 | Developer can consult `mechanics/combat/damage-and-defense.md` and `mechanics/combat/status-effects.md` for claim-verified client combat estimators (`Zo, vq, Gs, yq, pj, jq, wq, Nq, Sq, kq, Cq, Mq, Aq, Eq`), server level-power scaling (`casters x80, physical x60`), combat postures, attribute/resistance caps, and the 134-entry ability dispatch catalog across `ItemUse, Passive, WeaponAbility, Spell, SpecialMove, and Custom`. (Plan 02-01 T3) | ✓ VERIFIED | `mechanics/combat/damage-and-defense.md` (`C1..C12`) documents all estimator formulas, `×80`/`×60` scaling, postures, and caps; `mechanics/combat/status-effects.md` (`C1..C16`) documents all 6 dispatch kinds (`134` entries), `WeaponAbility` `ref: 1..22`, status taxonomy, and 12 pre-wired Samurai/Ninja entries. |
| 7 | Developer can consult `mechanics/systems/progression-unlocks.md` for claim-verified rules on the 58 UO skills array (`jc`), 16 class role mappings (`dx`), starter skill grants (`uE = 50, dE = 30, mE = 26, hE`), linear L1–60 class ability unlock tables (`gE`, including the absence of `gE.samurai` and `gE.ninja`), starter equipment kits (`mx`), and `[Arvore` progression tree point grants and reset costs. (Plan 02-02 T1) | ✓ VERIFIED | `mechanics/systems/progression-unlocks.md` (`C1..C14`) documents `jc` (`0..57`), `dx` (`16` classes), `hE` (`uE=50, dE=30`), `gE` (`7` classes, noting missing `gE.samurai`/`gE.ninja` at `L93-L95`), `mx`, and `[Arvore` (`+5/+5/+1` points, `1/2/3/5+` skill bracket costs, `300` UOCoin reset). |
| 8 | Developer can consult `mechanics/systems/equipment-affixes.md` for claim-verified rules on `[personagembonus` attribute tuple parsing (`vh`), 5,000ms status polling (`eI`), the 4 skill groups (`Bx`), 5 item rarity hues (`$A`), ClassicUO paperdoll layers, 21 item affix bonuses, 13 tree bonus attributes, material tier scaling (`+12%` armor resist/durability, `+8%` weapon damage), and Paragon/Bestiary monster scaling. (Plan 02-02 T2) | ✓ VERIFIED | `mechanics/systems/equipment-affixes.md` (`C1..C10`) documents `eI` (`5e3` ms polling), `vh` tuple unpacking, `Bx` (`combat/magic/craft/misc`), 21 `bonusItem` + 13 `arvoreBonus` keys, paperdoll layers `O`/`TE`, `$A` rarity hues, material ladder (`[[resources]] C2, C3`), and 14 Bestiary families `sk` (`[[resources]] C9, C18`). |
| 9 | Developer can audit `mechanics/topics/engine-capability-matrix.md` (with `status: verified` backed by `live: _evidence/live-bundle-probe.txt L1-L20`) classifying every UO Idle combat primitive across Client-Evaluated, Shared-Config, and Server-Authoritative tiers and explicitly defining Mode A (`100%` existing engine opcodes) vs Mode B (`<20 LOC` native C# hooks) for Phase 5 Samurai and Ninja design. (Plan 02-02 T3) | ✓ VERIFIED | `mechanics/topics/engine-capability-matrix.md` has `status: "verified"`, `C1..C17` `[verified]` claims, the 3-tier capability matrix (`L40-L54`), the v0.99.0 Samurai/Ninja bundle footprint audit (`L55-L76`), and the Mode A vs Mode B specification (`L77-L103`). |

**Score:** 9/9 truths verified (0 present, behavior-unverified)

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `mechanics/combat/resources.md` | Claim-verified KB page for HP/Mana/Stamina, potions, Hunting Energy, and 18+ server changelog anchor claims (`C1..C22`) | ✓ VERIFIED | 117 lines, `status: "doc-stated"`, 22 verbatim claims, digit-free `## Summary` |
| `mechanics/combat/tick-and-cooldowns.md` | Claim-verified KB page for combat tick loop, 12-slot hotbar, trigger condition builders, and cooldown rules | ✓ VERIFIED | 131 lines, `status: "bundle-stated"`, 12 verbatim claims, digit-free `## Summary` |
| `mechanics/combat/damage-and-defense.md` | Claim-verified KB page for client heal/physical/spell estimators, server level scaling, postures, and resistance/attribute caps | ✓ VERIFIED | 119 lines, `status: "bundle-stated"`, 12 verbatim claims, digit-free `## Summary` |
| `mechanics/combat/status-effects.md` | Claim-verified KB page for status effects, DoTs, CC, buffs/debuffs, summons, and the 6 ability dispatch kinds in `abilities-catalog.json` | ✓ VERIFIED | 115 lines, `status: "bundle-stated"`, 16 verbatim claims, digit-free `## Summary` |
| `mechanics/systems/progression-unlocks.md` | Claim-verified KB page for 58 skills (`jc`), class roles (`dx`), starter skills (`hE`), L1–60 unlock tables (`gE`), starter kits (`mx`), and `[Arvore` progression tree | ✓ VERIFIED | 117 lines, `status: "bundle-stated"`, 14 verbatim claims, digit-free `## Summary` |
| `mechanics/systems/equipment-affixes.md` | Claim-verified KB page for `[personagembonus` polling (`eI`), skill groups (`Bx`), item rarity hues (`$A`), 21 item affixes, material ladder, and Bestiary/Paragon monster scaling | ✓ VERIFIED | 124 lines, `status: "bundle-stated"`, 10 verbatim claims, digit-free `## Summary` |
| `mechanics/topics/engine-capability-matrix.md` | Verified 3-tier Client/Shared/Server Engine Capability Matrix and Mode A vs Mode B boundary specification for Samurai and Ninja | ✓ VERIFIED | 104 lines, `status: "verified"`, 17 `[verified]` claims, digit-free `## Summary` |
| `mechanics/INDEX.md` | Generated KB index listing all 7 Phase 2 pages across `combat/`, `systems/`, and `topics/` | ✓ VERIFIED | 38 lines, `Pages: 7 (combat 4, systems 2, topics 1)`, `verified 1, bundle-stated 5, doc-stated 1` |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| `mechanics/combat/tick-and-cooldowns.md` | `mechanics/combat/resources.md` | Cross-page claim citations `[[resources]] C6`, `[[resources]] C7`, `[[resources]] C8`, `[[resources]] C14` | ✓ WIRED | Verified by `gsd-tools query verify.key-links` and `kb.py check` (`check_links`) |
| `mechanics/combat/damage-and-defense.md` | `mechanics/combat/resources.md` | Cross-page claim citations `[[resources]] C1`, `[[resources]] C10`, `[[resources]] C11`, `[[resources]] C12` | ✓ WIRED | Verified by `gsd-tools query verify.key-links` and `kb.py check` (`check_links`) |
| `mechanics/combat/status-effects.md` | `mechanics/combat/resources.md` | Cross-page claim citations `[[resources]] C8`, `[[resources]] C14`, `[[resources]] C17`, `[[resources]] C19` | ✓ WIRED | Verified by `gsd-tools query verify.key-links` and `kb.py check` (`check_links`) |
| `mechanics/systems/equipment-affixes.md` | `mechanics/combat/resources.md` | Cross-page claim citations `[[resources]] C2`, `[[resources]] C3`, `[[resources]] C9`, `[[resources]] C18` | ✓ WIRED | Verified by `gsd-tools query verify.key-links` and `kb.py check` (`check_links`) |
| `mechanics/topics/engine-capability-matrix.md` | `mechanics/_evidence/live-bundle-probe.txt` | Frontmatter `evidence[0]` `"live: _evidence/live-bundle-probe.txt L1-L20"` cited by `[verified]` `(evidence 1)` claims `C1` and `C2` | ✓ WIRED | Verified by `gsd-tools query verify.key-links` and `kb.py check` (`check_live`, `check_cites`) |
| `mechanics/topics/engine-capability-matrix.md` | `mechanics/combat/*.md` and `mechanics/systems/*.md` | Cross-page `[[slug]] C<n>` citations to `tick-and-cooldowns`, `damage-and-defense`, `resources`, `status-effects`, `progression-unlocks`, and `equipment-affixes` | ✓ WIRED | Verified by `gsd-tools query verify.key-links` and `kb.py check` (`check_links`) |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable / Claim Set | Source | Produces Real Data | Status |
| -------- | ------------------------- | ------ | ------------------ | ------ |
| `mechanics/combat/resources.md` | `C1..C22` `[doc-stated]` claims | `mechanics/_raw/wiki/changelog-server-dev.md` (`L12-L1051`) | Yes — verified verbatim against SHA-256 locked `_raw/` file | ✓ FLOWING |
| `mechanics/combat/tick-and-cooldowns.md` | `C1..C12` `[bundle-stated]` claims | `mechanics/_raw/bundle/abilities-loader-and-hotbar.js` (`L12-L1144`) | Yes — verified verbatim against SHA-256 locked `_raw/` file | ✓ FLOWING |
| `mechanics/combat/damage-and-defense.md` | `C1..C12` `[bundle-stated]` claims | `mechanics/_raw/bundle/combat-estimators-and-hotbar.js` (`L61-L541`) | Yes — verified verbatim against SHA-256 locked `_raw/` file | ✓ FLOWING |
| `mechanics/combat/status-effects.md` | `C1..C16` `[bundle-stated]` claims | `mechanics/_raw/bundle/abilities-catalog.json` (`L214-L1613`) | Yes — verified verbatim against SHA-256 locked `_raw/` file | ✓ FLOWING |
| `mechanics/systems/progression-unlocks.md` | `C1..C14` `[bundle-stated]` claims | `mechanics/_raw/bundle/skills-and-progression.js` (`L5-L241`) | Yes — verified verbatim against SHA-256 locked `_raw/` file | ✓ FLOWING |
| `mechanics/systems/equipment-affixes.md` | `C1..C10` `[bundle-stated]` claims | `mechanics/_raw/bundle/character-bonus-and-status.js` (`L5-L139`) | Yes — verified verbatim against SHA-256 locked `_raw/` file | ✓ FLOWING |
| `mechanics/topics/engine-capability-matrix.md` | `C1..C17` `[verified]` claims | `mechanics/_evidence/live-bundle-probe.txt` (`L1-L20`) & `mechanics/_raw/api/protocol-commands-index.json` (`L2-L406`) | Yes — verified against live runtime probe and SHA-256 locked `_raw/` file | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| `kb.py` mutation self-test (28 mutations + 4 edge cases) | `python3 mechanics/tools/kb.py --self-test` | `{"ok": true, "mutations": 28, "caught": 28, "missed": [], "cases": 4, "failedCases": []}` | ✓ PASS |
| `kb.py build` regenerates `mechanics/INDEX.md` for all 7 pages | `python3 mechanics/tools/kb.py build --root mechanics` | `{"ok": true, "pages": 7, "wrote": "INDEX.md"}` | ✓ PASS |
| `kb.py check` validates frontmatter, quotes, digit-free summaries, links, manifest hashes, and credential scan across all 7 pages | `python3 mechanics/tools/kb.py check --root mechanics` | `{"ok": true, "pages": 7, "errors": []}` | ✓ PASS |
| Task commits exist in git history | `node ~/.cursor/gsd-core/bin/gsd-tools.cjs query verify.commits 8e33341 a858a01 d293ef0 5b03f01` | `{"all_valid": true, "total": 4}` | ✓ PASS |

### Test Quality Audit

| Test File | Linked Req | Active | Skipped | Circular | Assertion Level | Verdict |
|-----------|-----------|--------|---------|----------|-----------------|---------|
| `mechanics/tools/kb.py` (`--self-test` & `check`) | `INDEX-01`, `INDEX-02` | 32 (`28` mutations + `4` cases + `7` live KB page checks) | 0 | No (validates KB markdown against immutable SHA-256 `_raw/manifest.json`) | Value & Behavioral (exact line-range quote verification, rank hierarchy, link resolution, credential scan) | ✓ PASS |

**Disabled tests on requirements:** 0
**Circular patterns detected:** 0
**Insufficient assertions:** 0

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ---------- | ----------- | ------ | -------- |
| `INDEX-01` | `02-01-PLAN.md`, `02-02-PLAN.md` | Developer can look up claim-verified KB pages under `mechanics/combat/` and `mechanics/systems/` documenting UO Idle's combat tick loop, cooldown/haste resolution, hit/crit/armor/resistance mitigation formulas, resource regeneration, status effect opcodes, and progression/equipment systems | ✓ SATISFIED | `mechanics/combat/{resources,tick-and-cooldowns,damage-and-defense,status-effects}.md` and `mechanics/systems/{progression-unlocks,equipment-affixes}.md` (86 verbatim claims, 0 errors in `kb.py check`) |
| `INDEX-02` | `02-02-PLAN.md` | Developer can audit an explicit **Engine Capability Matrix** classifying every live UO Idle combat hook, trigger, and status effect as Client-Evaluated, Shared-Config, or Server-Authoritative | ✓ SATISFIED | `mechanics/topics/engine-capability-matrix.md` (`status: "verified"`, 17 `[verified]` claims, 3-tier Client/Shared/Server table + Mode A vs Mode B boundary) |

**Orphaned Requirements mapped to Phase 2 in `REQUIREMENTS.md`:** None (`INDEX-01` and `INDEX-02` are both claimed and satisfied).

### Decision Coverage

No trackable `<decisions>` block in `02-CONTEXT.md` (`gsd-tools query check.decision-coverage-verify` returned `{"skipped": true, "reason": "no trackable decisions"}`). All qualitative design choices in `02-CONTEXT.md` (single-source `sources[0]` per page, `[[resources]] C1..C22` server changelog anchors, `status: "verified"` on `engine-capability-matrix.md`, and Mode A vs Mode B boundary definitions) were verified directly in the shipped KB pages.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| None | — | Zero `TBD`, `FIXME`, `XXX`, `TODO`, `HACK`, or `PLACEHOLDER` markers across all 8 Phase 2 files | — | Clean |

## Human Verification

N/A — Documentation/knowledgebase foundation phase with no interactive UI or user-facing runtime elements. All acceptance criteria (verbatim `(raw L<a>-L<b>)` quote matching, digit-free `## Summary` enforcement, `[[slug]] C<n>` cross-link resolution, evidence rank calculation, `_raw/manifest.json` SHA-256 integrity, and credential sanitization) are deterministically verified by `python3 mechanics/tools/kb.py check --root mechanics`.
