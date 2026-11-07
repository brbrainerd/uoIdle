# UO Idle — Ninja & Samurai Class Skill Lines & Mechanics Knowledgebase

## What This Is

A comprehensive reverse-engineering knowledgebase of **UO Idle** (`https://uoidle.com/beta`) and a complete, drop-in class design package for two hypothetical classes—**Ninja** (based on Ultima Online's *Ninjitsu*) and **Samurai** (based on Ultima Online's *Bushido*)—commissioned for the lead developer of UO Idle. It combines a claim-verified local mechanics knowledgebase (modeled after `mudlet-dragonball-evolution/mechanics/`) scraped from the live game client, network surfaces, documentation, and wiki with mechanically and numerically balanced skill lines, drop-in code/JSON definitions, formal design specifications, and UI/icon visual mockups.

## Core Value

Deliver mechanically authentic (grounded in ModernUO Bushido/Ninjitsu), numerically balanced (parity-tested against live Warrior, Mage, and Ranger formulae), and implementation-ready Ninja and Samurai skill lines backed by a 100% source-verified UO Idle mechanics knowledgebase.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Private GitHub repository (`brbrainerd/uoIdle`) synced and maintained throughout all phases
- [ ] Claim-verified UO Idle mechanics knowledgebase (`mechanics/`) with adapted `kb.py` tooling, `_raw/` live client bundle/API/wiki extracts, cited claims, and generated `INDEX.md`
- [ ] Complete reverse-engineered index of all live UO Idle systems, with deep focus on Warrior, Mage, and Ranger skills, stats, formulae, unlock levels, cooldowns, status effects, and code structures
- [ ] ModernUO Bushido and Ninjitsu reference analysis mapping canonical Ultima Online abilities, formulae, and mechanics to UO Idle's engine capabilities
- [ ] Numerically balanced Samurai (Bushido) and Ninja (Ninjitsu) skill lines matching existing UO Idle class structure (unlock level tiers, active/passive counts) while establishing distinct, protected combat niches
- [ ] Drop-in code/JSON skill definitions matching UO Idle's live client/server schema alongside a formal design specification
- [ ] Visual UI mockups and generated skill/class iconography demonstrating Ninja and Samurai integration in UO Idle's beta interface

### Out of Scope

- Modifying or attacking live production servers — all scraping and auditing is strictly read-only inspection of the authenticated beta client, bundle, and public docs/wiki
- Inventing arbitrary class progression structures that break Warrior/Mage/Ranger structural parity — Ninja and Samurai must slot cleanly into UO Idle's existing level tiers and active/passive architecture

## Context

- **Live Environment**: `https://uoidle.com/beta` is currently logged in and auditable via Chrome DevTools MCP (`chrome-devtools`), allowing direct inspection of the client JS bundle, DOM state, network payloads, WebSocket/API traffic, and linked documentation/wiki surfaces.
- **Knowledgebase Inspiration**: Modeled on `~/dev/mudlet-dragonball-evolution/mechanics/`, which enforces strict separation between `_raw/` verbatim extracts, frontmatter-tagged markdown pages with line-referenced claims (`C1`, `C2`, ...), cross-cutting `topics/`, and an automated `kb.py` builder/checker producing `INDEX.md`.
- **Canonical Lore & Mechanics Source**: ModernUO online documentation and source definitions for *Bushido* (Honorable Execution, Confidence, Evasion, Counter Attack, Lightning Strike, Momentum Strike, Perfection, Bushido mastery/stances) and *Ninjitsu* (Focus Attack, Death Strike, Animal Form, Ki Attack, Surprise Attack, Backstab, Shadowjump, Mirror Image, Ninjitsu stealth/evasion).

## Constraints

- **Verification Integrity**: Every UO Idle mechanic, formula, and skill stat in the knowledgebase must cite verbatim `_raw/` extracts from the live game bundle, network state, or official wiki/docs — never guessed.
- **Structural Parity**: Ninja and Samurai skill lines must use the exact unlock level tiers and active/passive slot progression used by Warrior, Mage, and Ranger in live UO Idle.
- **Numerical Balance**: Damage output, survivability, resource economy, and utility across level brackets must be mathematically balanced against the live Warrior, Mage, and Ranger formulae.
- **Repository Privacy**: GitHub repository (`https://github.com/brbrainerd/uoIdle`) must remain private and synced.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Full claim-verified KB (`kb.py` + `_raw/` + `INDEX.md`) | Prevents hallucinated game mechanics and gives both agents and the lead developer traceable citations to live code/docs | — Pending |
| Match existing Warrior/Mage/Ranger unlock tiers & active/passive structure | Ensures the lead developer can drop Ninja and Samurai directly into the existing class progression engine | — Pending |
| Include drop-in code/JSON + formal spec + UI mockups & generated art | Provides a complete, pitch-ready and implementation-ready package for the UO Idle lead developer | — Pending |
| Ground ability concepts in ModernUO Bushido & Ninjitsu | Preserves authentic Ultima Online flavor while adapting mechanics to idle/auto-battler combat loops | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-11-06 after initialization*
