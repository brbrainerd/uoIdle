# Phase 3: Existing Classes Deep-Dive (`Warrior`, `Mage`, `Ranger`) & Canonical Data Schemas — Context

**Gathered:** 2026-11-06
**Status:** Ready for planning
**Mode:** Autonomous Smart Discuss

<domain>
## Phase Boundary

Phase 3 reverse-engineers and documents the complete class definitions, L1–60 progression trees, skill kits, and combat formulas for live UO Idle classes (`warrior`, `mage`, `ranger`, plus the 4 advanced combat classes `berserker`, `paladin`, `necromancer`, `spellweaver` discovered in `gE`), synthesizes the cross-class structural parity and combat niche boundaries (`class-structural-parity.md` and `combat-niches.md`), and codifies canonical JSON Schema (`schemas/{class,skill,effect}.schema.json`) and TypeScript (`zod`) validators (`src/schemas/skill.schema.ts`, `tools/validate_skills.ts`) proven against 100% of extracted live class definitions.

</domain>

<decisions>
## Implementation Decisions

### Class KB Page Structure & Scope (`INDEX-03`)
- **Primary Core Trio (`warrior.md`, `mage.md`, `ranger.md`):**
  - Author dedicated, exhaustive KB pages under `mechanics/classes/` for `warrior.md`, `mage.md`, and `ranger.md`.
  - Each page documents:
    1. Role classification (`dx` entry), starter skills (`uE`, `dE`, `mE`, `hE`), and starter equipment kit (`mx`).
    2. Complete L1–60 unlock progression table (`gE.<class>.levels`) with exact level brackets (`L1, L5, L10, L15, L20, L25, L30, L35, L40, L45, L50, L60`), unlock type (`skill`, `spell`, `passive`, `mechanic`, `feature`), resource costs, and `pt-BR` descriptions + English translations.
    3. Every active and passive ability available to the class in `abilities-catalog.json` (`Custom` class skills, `WeaponAbility` entries, `Spell` entries, `SpecialMove` entries, `Passive` entries, `ItemUse` entries), including cooldowns (`cooldownMs`, `customCooldownMs`), mana/stamina/tithe/reagent requirements, `effectType` (`self_buff`, `direct_damage`, `dot`, `debuff`, `heal`), and server/client damage/sustain formulas (`damage-and-defense.md` / `resources.md` cross-references).
    4. Class-specific resource & skill cap rules from server changelog (`[[resources]] C1..C22`, e.g., Warrior zero mana and Meditation cap 0, Mage Spellbook + Scroll auto-inscription and reagent economy, Ranger bow/crossbow ammunition and stealth/tracking kit).
- **Advanced/Hybrid Class Coverage (`advanced-classes.md` or within `class-structural-parity.md`):**
  - Document the 4 additional active combat classes present in `gE` (`berserker`, `paladin`, `necromancer`, `spellweaver`) either in a companion `mechanics/classes/advanced-classes.md` page or directly in `mechanics/topics/class-structural-parity.md` so that Samurai and Ninja design in Phase 5 accounts for all 7 existing `gE` progression curves and all 12 pre-existing `samurai_*` / `ninja_*` entries in `abilities-catalog.json`.

### Structural Parity & Combat Niche Topics (`INDEX-04`)
- **`mechanics/topics/class-structural-parity.md`:**
  - Codifies the exact structural template that anyUO Idle combat class must satisfy across 4 orthogonal layers:
    1. `dx` role & primary skill mapping (`skills-and-progression.js`).
    2. `uE`/`dE`/`mE`/`hE` starter skill grants and `mx` starter equipment loadout (`skills-and-progression.js`).
    3. `gE.<class>` L1–60 12-milestone progression curve (`L1, L5, L10, L15, L20, L25, L30, L35, L40, L45, L50, L60`) with exact distribution of `skill`, `spell`/`mechanic`, `passive`, and `feature` (Capstone) nodes.
    4. `abilities-catalog.json` 6-ability `Custom` class kit (`effectType` distribution: `self_buff`, `direct_damage`, `dot`, `debuff`, `heal`, cooldown brackets `6,000ms`–`30,000ms`, and `customCooldownMs: 2000` global floor).
- **`mechanics/topics/combat-niches.md`:**
  - Maps the offensive, defensive, sustain, and resource economy niches of Warrior, Mage, Ranger (and Berserker, Paladin, Necromancer, Spellweaver) and defines the protected design space for **Samurai** (Bushido counter/parry/Perfection ramping single-target & 2-target cleave duelist) and **Ninja** (Ninjitsu stealth/Focus/Death Strike delayed burst, Mirror Image ablative evasion, and Fukiya/Shuriken ranged utility).

### Canonical JSON Schemas & TypeScript (`zod`) Validation (`INDEX-04`)
- **Schema Files (`schemas/` & `src/schemas/`):**
  - `schemas/class.schema.json`: JSON Schema (Draft 2020-12 / Draft-07) validating a complete UO Idle class definition (`id`, `role`, `starterSkills`, `starterEquipment`, `progression` L1–60 milestones, `abilities` array).
  - `schemas/skill.schema.json`: JSON Schema validating individual ability/skill definitions matching `abilities-catalog.json` + progression metadata (`id`, `name`, `category`, `kind`, `cooldownMs`, `customCooldownMs`, `manaCost`, `staminaCost`, `goldCost`, `effectType`, `statusEffect`, `weaponAbilityRef`, `spellId`, `scalingFormula`, `unlockLevel`).
  - `schemas/effect.schema.json`: JSON Schema validating status effects, buffs, debuffs, DoTs, and postures (`id`, `effectType`, `durationMs`, `tickIntervalMs`, `modifiers`, `stackingRule`, `authorityTier`).
  - `src/schemas/skill.schema.ts`: Canonical TypeScript + `zod` schema definitions (`ClassSchema`, `SkillSchema`, `EffectSchema`, `ProgressionMilestoneSchema`) that both generate/match `schemas/*.schema.json` and validate extracted live class data (`data/live-classes/{warrior,mage,ranger}.json` + full catalog) via `npx tsx tools/validate_skills.ts --verify`.

</decisions>

<specifics>
## Specific Ideas & Citations

- Because `kb.py` verifies `(raw L<a>-L<b>)` claims exclusively against `sources[0]`, each KB page must choose its primary `_raw/` file as `sources[0]` (e.g., `_raw/bundle/skills-and-progression.js` for progression-heavy class pages or `_raw/bundle/abilities-catalog.json` for ability-heavy pages) and cite secondary `_raw/` files via cross-claim links `[[slug]] C<n>`.
- Keep `## Summary` 100% digit-free on every KB page.

</specifics>

<deferred>
## Deferred Ideas

- ModernUO C# Bushido/Ninjitsu KB pages and baseline simulator execution are handled in Phase 4 (`SIM-01`, `SIM-02`).
- Samurai and Ninja drop-in JSON definitions (`design/drop-in/{samurai,ninja}.json`) are authored in Phase 5 (`CLASS-01..04`).
</deferred>
