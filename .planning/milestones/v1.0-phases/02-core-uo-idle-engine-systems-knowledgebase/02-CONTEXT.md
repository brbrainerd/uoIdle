# Phase 2: Core UO Idle Engine & Systems Knowledgebase - Context

**Gathered:** 2026-11-06
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous — pure documentation/knowledgebase authoring phase)

<domain>
## Phase Boundary

Every core UO Idle combat, resource, status-effect, progression, equipment, and engine architecture mechanic is documented in claim-verified KB pages under `mechanics/combat/`, `mechanics/systems/`, and `mechanics/topics/`, including a complete Client/Shared/Server **Engine Capability Matrix** and rebuilt `mechanics/INDEX.md` passing `kb.py check --root mechanics`.

</domain>

<decisions>
## Implementation Decisions

### Locked Decisions
- **Verification Integrity (`KB-02`, `INDEX-01`, `INDEX-02`):** Every claim (`C1..Cn`) in every KB page MUST quote verbatim from `sources[0]` (`(raw L<a>-L<b>)`) or cite an indexed `evidence` entry (`(evidence <k>)`), and every `## Summary` section MUST contain zero ASCII digits (`0-9`).
- **Required KB Coverage (`INDEX-01`, `INDEX-02`):**
  1. `mechanics/combat/tick-and-cooldowns.md` — Swing timer, tick rate, global cooldown (`gcd`), ability cooldown (`cooldownMs`), cast/channel timing, and hotbar/queue auto-trigger (`IdleBot` / `[habinfo`) rules.
  2. `mechanics/combat/damage-and-defense.md` — Physical and elemental damage scaling, weapon damage, attribute scaling (`STR`, `DEX`, `INT`), critical hit chance & damage multiplier, armor/resist mitigation, block/parry/dodge/evasion formulas, and client-side damage/heal estimators (`jq`, `wq`, `Nq`, `Sq`, `kq`, `Cq`, `Mq`, `Aq`, `Eq` in `_raw/bundle/combat-estimators-and-hotbar.js` and server changelog notes in `_raw/wiki/changelog-server-dev.md`).
  3. `mechanics/combat/resources.md` — Health (`HP`), Mana, and Stamina pools, regeneration ticks, leech (`lifeLeech`, `manaLeech`, `staminaLeech`), potion/sustain economy, and resource costs (`manaCost`, `staminaCost`).
  4. `mechanics/combat/status-effects.md` — Complete catalog of buffs, debuffs, DoTs (Bleed, Poison, Burn), CC (Stun, Freeze, Slow, Silence, Root), shields, barriers, summons/totems, and stacking/refresh rules drawn from `abilities-catalog.json`, `character-bonus-and-status.js`, and server changelogs.
  5. `mechanics/systems/progression-unlocks.md` — Character level progression (L1–60+), skill mastery caps (`58` UO skills in `jc`), class unlock levels (`gE`), `[Arvore` progression tree (`_raw/bundle/progression-tree-ui.js`), active/passive slot counts, and class switching/advancement rules.
  6. `mechanics/systems/equipment-affixes.md` — Weapon speed/damage, armor slots, item rarities (`$A` in `paperdoll-and-items.js`), affix pools (`[personagembonus` in `character-bonus-and-status.js`), companion/mount bonuses, and dungeon/monster scaling (`_raw/bundle/bestiary-and-wiki.js` & `hunt-and-bot-config.js`).
  7. `mechanics/topics/engine-capability-matrix.md` — The formal **Engine Capability Matrix** classifying every ability trigger, targeting mode, resource cost, status effect opcode, and combat event across Client (`index-CCYN0Dy6.js`, `Jogo-D5xEfvfV.js`), Shared (`abilities-catalog.json`, `protocol-commands-index.json`), and Server (`changelog-server-dev.md`, `changelog-server-en.md`), explicitly identifying what is natively supported in **Mode A** (pure data/config drop-in) vs what requires a **Mode B** (`<20 LOC` native engine hook) for Samurai & Ninja.

### the agent's Discretion
- Additional entity/system pages under `mechanics/systems/` or `mechanics/entities/` if needed to keep `sources[0]` single-source verbatim citations clean (remember `kb.py` validates `(raw L<a>-L<b>)` against `sources[0]`, while secondary raw files can be cited via `evidence` entries `bundle: _raw/bundle/<file> L<a>-L<b>` or `live: _evidence/<file> L<a>-L<b>`!).
- Grouping of pages into parallel/sequential plans so `mechanics/INDEX.md` rebuilds cleanly at the end of Phase 2.

</decisions>

<specifics>
## Specific Ideas

- **Important `kb.py` Citation Rule:** In `kb.py`, `(raw L<a>-L<b>)` checks lines `a..b` of `sources[0]` only. When a page synthesizes facts from multiple `_raw/` files, either:
  1. Cite the primary `_raw/` file in `sources[0]` using `(raw L<a>-L<b>)` and cite additional `_raw/` files via `evidence` entries (`"bundle: _raw/bundle/other.js L10-L20: ..."`) referenced by `(evidence <k>)`, OR
  2. Split distinct `_raw/` source files into their own dedicated KB pages and cross-link them with `[[slug]] C<n>`.
  Combining both patterns produces a richly cross-linked, 100% verbatim-verified knowledgebase.

</specifics>

<canonical_refs>
## Canonical References

### Project & Planning Specs
- `.planning/PROJECT.md` — Core value and constraints
- `.planning/REQUIREMENTS.md` — Phase 2 requirements (`INDEX-01`, `INDEX-02`)
- `.planning/ROADMAP.md` — Phase 2 goal and success criteria

### Phase 1 Infrastructure & Extracted Raw Sources
- `mechanics/CONTRIBUTING.md` — 9-key frontmatter contract, claim syntax, digit-free Summary rule, and 6-tier evidence hierarchy
- `mechanics/tools/kb.py` — Linter and `INDEX.md` builder
- `mechanics/_raw/manifest.json` — 68 verified raw files across `_raw/bundle/`, `_raw/wiki/`, `_raw/api/`, and `_raw/modernuo/`
- `mechanics/_evidence/live-bundle-probe.txt` — Live runtime & bundle probe evidence

</canonical_refs>

<deferred>
## Deferred Ideas

- Per-ability exhaustively indexed pages for Warrior, Mage, Ranger, Berserker, Paladin, Necromancer, and Spellweaver (`Phase 3` — `INDEX-03`, `INDEX-04`).
- Canonical JSON/Zod schemas (`Phase 3` — `INDEX-04`).
- ModernUO Bushido/Ninjitsu KB pages and baseline simulator (`Phase 4` — `SIM-01`, `SIM-02`).

</deferred>

---

*Phase: 02-core-uo-idle-engine-systems-knowledgebase*
*Context gathered: 2026-11-06 via smart discuss*
