# Phase 5: Samurai (Bushido) & Ninja (Ninjitsu) Skill Line Design, Parity Tuning & Drop-In Code — Context

**Gathered:** 2026-11-06
**Status:** Ready for planning
**Mode:** Autonomous Smart Discuss

<domain>
## Phase Boundary

Phase 5 delivers the complete, drop-in class design package for **Samurai** (based on Ultima Online's *Bushido*) and **Ninja** (based on Ultima Online's *Ninjitsu*):
1. Complete drop-in JSON class definitions (`design/drop-in/samurai.json`, `design/drop-in/ninja.json`) validated against `schemas/class.schema.json` (`src/schemas/skill.schema.ts`), supporting both **Mode A** (100% existing UO Idle engine opcodes) and **Mode B** (`<20 LOC` native C# server hooks).
2. Formal class design specifications (`design/SAMURAI_SPEC.md`, `design/NINJA_SPEC.md`) detailing starter skills (`uE`/`dE`/`mE`/`hE`), starter equipment (`mx`), L1–60 progression milestones (`gE.samurai`, `gE.ninja`), all active/passive abilities, bilingual (`pt-BR` + `en`) i18n strings, and ModernUO formula derivations.
3. Class-themed Tokuno weapon and equipment affix definitions (`design/drop-in/items-bushido-ninjitsu.json`) covering *Katana*, *No-Dachi*, *Wakizashi*, *Lajatang*, *Tekagi*, *Kama*, *Fukiya*, and *Tessen* across rarity/material brackets.
4. Client/server integration patch (`design/drop-in/classes-patch.js`) wiring `gE.samurai`, `gE.ninja`, `dx`, `hE`, `mx`, `abilities-catalog`, and i18n locales directly into UO Idle's `v0.99.0` architecture.
5. Automated 5-class multi-bracket parity simulation and balance report (`design/BALANCE_REPORT.md` + `tools/sim_balance.ts --parity` / `--verify`) proving that Samurai and Ninja stay within $\pm 5\text{–}8\%$ of Warrior, Mage, and Ranger across Sustained Boss DPS, Trash TTK (including overkill), Net Resource Sustainability/min, and Effective HP (`EHP/sec`) across all 4 level brackets (`L10`, `L25`, `L45`, `L60`) in both Mode A and Mode B.

</domain>

<decisions>
## Implementation Decisions

### Samurai (`Bushido`) Class Architecture (`CLASS-01`, `CLASS-03`)
- **Combat Niche:** **Perfection Ramp / Weapon Parry-Counter / Execute Duelist**.
  - Excels at sustained single-target boss duels (ramping `Perfection` bonus up to $+100\%$ damage on consecutive hits) and 2-target cleave (`Momentum Strike`), with reactive mitigation and sustain via `Confidence` (regen + heal on parry) and `Evasion` / `Counter Attack`.
  - Protected from Warrior's raw passive tanking/3-target `Whirlwind` AoE and Ranger's zero-ramp ranged openers.
- **Structural Parity (`gE.samurai` & Catalog):**
  - Preserves and integrates all 6 pre-existing `samurai_*` entries in `abilities-catalog.json` (`samurai_confidence`, `samurai_evasion`, `samurai_counter_attack`, `samurai_lightning_strike`, `samurai_momentum_strike`, `samurai_honorable_execution`) while providing a complete 12-milestone L1–60 `gE.samurai` progression curve (`L1, L5, L10, L15, L20, L25, L30, L35, L40, L45, L50, L60`) + weapon specials (`Whirlwind Attack`, `Double Strike`, `Armor Ignore`, `Bladeweave`, `Crushing Blow`) and passives (`Bushido Mastery`, `Honor / Perfection`, `Weapon Parry`).
  - Starter skills (`hE.samurai`): `bushido: 50, swordsmanship: 50, tactics: 50, parrying: 50, anatomy: 50, healing: 50, focus: 50, magicResist: 30`.

### Ninja (`Ninjitsu`) Class Architecture (`CLASS-02`, `CLASS-03`)
- **Combat Niche:** **Ablative Clone Mitigation / Stealth-State Opener / 5-Hit Delayed Detonation Assassin**.
  - Excels at high-burst stealth/opener cycles (`Smoke Bomb` / `Shadowjump` -> `Backstab` / `Surprise Attack` -> `Ki Attack`) and delayed true/poison execution (`Death Strike` 5-swing detonation + `Fukiya` / `Shuriken` ranged poison pressure), surviving heavy hits via ablative `Mirror Image` clones rather than raw plate armor.
  - Protected from Mage's elemental AoE/spellbook versatility and Samurai's sustained ramping `Perfection`.
- **Structural Parity (`gE.ninja` & Catalog):**
  - Preserves and integrates all 6 pre-existing `ninja_*` entries in `abilities-catalog.json` (`ninja_mirror_image`, `ninja_focus_attack`, `ninja_backstab`, `ninja_shadowjump`, `ninja_ki_attack`, `ninja_death_strike`) while providing a complete 12-milestone L1–60 `gE.ninja` progression curve (`L1, L5, L10, L15, L20, L25, L30, L35, L40, L45, L50, L60`) + stealth/opener mechanics (`Surprise Attack`, `Animal Form`, `Smoke Bomb`) and weapon specials (`Infectious Strike`, `Shadow Strike`, `Double Strike`, `Armor Ignore`, `Fukiya Dart` / `Shuriken Throw`).
  - Starter skills (`hE.ninja`): `ninjitsu: 50, fencing: 50, hiding: 50, stealth: 50, tactics: 50, poisoning: 50, focus: 50, magicResist: 30`.

### Tokuno Weapons & Equipment Affixes (`CLASS-04`)
- **`design/drop-in/items-bushido-ninjitsu.json`:**
  - Defines all 8 iconic Tokuno weapons (*Katana*, *No-Dachi*, *Wakizashi*, *Lajatang* for Samurai; *Tekagi*, *Kama*, *Fukiya*, *Tessen* for Ninja) with ClassicUO item graphic IDs (`0x13FF`, `0x27A2`, `0x27A4`, `0x27A7`, `0x27AB`, `0x27AD`, `0x27AA`, `0x27A3`), weapon speeds, base damage ranges across material tiers (`Iron` through `Valorite`), primary/secondary `WeaponAbility` refs (`MO`), and class-themed `bonusItem` / `arvoreBonus` affix pools (`bushido`, `ninjitsu`, `parrying`, `stealth`, `poisoning`, `critChance`, `attackSpeed`, `physicalDamage`, `poisonDamage`, `energyDamage`).

### 5-Class Multi-Bracket Numerical Parity (`SIM-03`)
- **Automated Parity Verification (`tools/sim_balance.ts --parity` / `--verify` & `design/BALANCE_REPORT.md`):**
  - Extends `tools/sim_balance.ts` and `tools/validate_skills.ts` so `design/drop-in/samurai.json` and `design/drop-in/ninja.json` are validated against `schemas/class.schema.json` and simulated alongside `warrior`, `mage`, and `ranger` across `L10`, `L25`, `L45`, `L60` and all 4 enemy archetypes (`fast_trash`, `low_def_boss`, `high_def_boss`, `multi_target_pack`) in both **Mode A** and **Mode B**.
  - Enforces strict numerical parity gates: Samurai and Ninja bracket composite scores and role-matched benchmarks (`low_def_boss` & `high_def_boss` Sustained DPS, `fast_trash` TTK, `EHP/sec`, and positive/sustainable Resource Economy) stay within $\pm 5\text{–}8\%$ of the live Warrior/Mage/Ranger envelope, with zero avoidance-immortality loops (`Mirror Image` / `Evasion` capped) and zero mana/stamina starvation.

</decisions>

<specifics>
## Specific Ideas & Citations

- Also add claim-verified KB pages or update `mechanics/` if needed, and ensure `python3 mechanics/tools/kb.py check --root mechanics`, `npx tsx tools/validate_skills.ts --verify`, and `npx tsx tools/sim_balance.ts --verify` all pass with 0 errors.

</specifics>

<deferred>
## Deferred Ideas

- Custom generated dark-fantasy UO skill/class iconography and pixel-accurate `uoidle.com/beta` HTML/CSS UI mockups are Phase 6 deliverables (`VISUAL-01`, `VISUAL-02`).
</deferred>
