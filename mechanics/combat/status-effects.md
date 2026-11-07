---
id: "status-effects"
title: "Status Effects, Ability Dispatch Kinds, and Crowd Control Catalog"
category: "status-effects"
aliases: ["buffs", "debuffs", "dots", "crowd-control", "weapon-abilities", "special-moves"]
status: "bundle-stated"
sources: ["_raw/bundle/abilities-catalog.json", "_raw/bundle/i18n-en-abilities.js", "_raw/bundle/bestiary-and-wiki.js", "_raw/wiki/changelog-server-dev.md"]
evidence: ["bundle: _raw/bundle/bestiary-and-wiki.js:91-103", "bundle: _raw/bundle/i18n-en-abilities.js:1780-1792", "bundle: _raw/bundle/i18n-en-abilities.js:2495-2497", "wiki: _raw/wiki/changelog-server-dev.md:109", "wiki: _raw/wiki/changelog-server-dev.md:833"]
code_refs: ["abilities-catalog.json:abilities", "bestiary-and-wiki.js:CO", "bestiary-and-wiki.js:MO"]
updated: "2026-11-07"
---
# Status Effects, Ability Dispatch Kinds, and Crowd Control Catalog

Source: [raw](../_raw/bundle/abilities-catalog.json)

## Summary

Every combat action, buff, debuff, damage-over-time effect, crowd-control strike, summon, and consumable in UO Idle is registered in the shared ability catalog under one of six dispatch kinds: ItemUse, Passive, WeaponAbility, Spell, SpecialMove, or Custom. Standard Ultima Online weapon abilities, spells, and Bushido or Ninjitsu special moves bind to their native server handlers through numeric reference identifiers, whereas custom UO Idle abilities execute bespoke shard handlers tagged by origin map. Status effects span temporary attribute buffs, armor and resistance debuffs, bleed and poison damage-over-time ticks, paralyze and stun crowd control, defensive damage-reduction stances, spell and damage reflection links, transformation forms, temporary elemental and undead summons, and reactive parry or illusion counters. Notably, the live catalog already ships pre-wired Bushido and Ninjitsu entries for Samurai and Ninja.

## Claims

- **C1** [bundle-stated] ""id": "warrior_slash", "class": "warrior", "kind": "Passive", "name": "Slash", "unlock": 1, "mana": 0, "blurb": "Unlocks at level 1.", "tab": "ability", "map": "UO", "gumpIcon": 20992, "iconKey": "gump_20992"" (raw L214-L224)
- **C2** [bundle-stated] ""id": "warrior_provoke", "class": "warrior", "kind": "Custom", "name": "Provocar", "unlock": 5, "mana": 10, "blurb": "Unlocks at level 5.", "tab": "ability", "map": "New", "iconKey": "idle_warrior_provoke"" (raw L227-L236)
- **C3** [bundle-stated] ""id": "warrior_shield_bash", "class": "warrior", "kind": "Custom", "name": "Shield Bash", "unlock": 5, "mana": 10, "blurb": "Unlocks at level 5.", "tab": "ability", "map": "New", "gumpIcon": 21007, "iconKey": "idle_warrior_shield_bash"" (raw L239-L249)
- **C4** [bundle-stated] ""id": "warrior_armor_break", "class": "warrior", "kind": "Custom", "name": "Armor Break", "unlock": 15, "mana": 15, "blurb": "Unlocks at level 15.", "tab": "ability", "map": "New", "gumpIcon": 21014, "iconKey": "idle_warrior_armor_break"" (raw L252-L262)
- **C5** [bundle-stated] ""id": "warrior_heavy_strike", "class": "warrior", "kind": "WeaponAbility", "name": "Heavy Strike", "unlock": 20, "mana": 12, "blurb": "Unlocks at level 20.", "tab": "ability", "ref": 4, "map": "UO", "gumpIcon": 20995, "iconKey": "gump_20995"" (raw L265-L276)
- **C6** [bundle-stated] ""id": "warrior_whirlwind", "class": "warrior", "kind": "WeaponAbility", "name": "Whirlwind", "unlock": 25, "mana": 10, "blurb": "Unlocks at level 25.", "tab": "ability", "ref": 13, "map": "UO", "gumpIcon": 21004, "iconKey": "gump_21004"" (raw L279-L290)
- **C7** [bundle-stated] ""id": "warrior_brace", "class": "warrior", "kind": "Custom", "name": "Brace", "unlock": 30, "mana": 10, "blurb": "Unlocks at level 30.", "tab": "ability", "map": "New/Eth", "gumpIcon": 21008, "iconKey": "idle_warrior_brace"" (raw L293-L303)
- **C8** [bundle-stated] ""id": "warrior_execution", "class": "warrior", "kind": "Custom", "name": "Execution", "unlock": 60, "mana": 25, "blurb": "Unlocks at level 60.", "tab": "ability", "map": "New", "gumpIcon": 21000, "iconKey": "idle_warrior_execution"" (raw L333-L343)
- **C9** [bundle-stated] ""id": "ninja_focus", "class": "ninja", "kind": "SpecialMove", "name": "Focus Attack", "unlock": 1, "mana": 20, "blurb": "Unlocks at level 1.", "tab": "ability", "ref": 500, "map": "UO", "gumpIcon": 21280, "iconKey": "gump_21280"" (raw L1399-L1410)
- **C10** [bundle-stated] ""id": "ninja_death", "class": "ninja", "kind": "SpecialMove", "name": "Death Strike", "unlock": 5, "mana": 30, "blurb": "Unlocks at level 5.", "tab": "ability", "ref": 501, "map": "UO", "gumpIcon": 21281, "iconKey": "gump_21281"" (raw L1413-L1424)
- **C11** [bundle-stated] ""id": "ninja_mirror", "class": "ninja", "kind": "SpecialMove", "name": "Mirror Image", "unlock": 10, "mana": 10, "blurb": "Unlocks at level 10.", "tab": "ability", "ref": 507, "map": "UO", "gumpIcon": 21287, "iconKey": "gump_21287"" (raw L1427-L1438)
- **C12** [bundle-stated] ""id": "ninja_shadowjump", "class": "ninja", "kind": "SpecialMove", "name": "Shadowjump", "unlock": 75, "mana": 15, "blurb": "Unlocks at level 75.", "tab": "ability", "ref": 506, "map": "UO", "gumpIcon": 21286, "iconKey": "gump_21286"" (raw L1441-L1452)
- **C13** [bundle-stated] ""id": "samurai_lightning", "class": "samurai", "kind": "SpecialMove", "name": "Lightning Strike", "unlock": 1, "mana": 10, "blurb": "Unlocks at level 1.", "tab": "ability", "ref": 404, "map": "UO", "gumpIcon": 21540, "iconKey": "gump_21540"" (raw L1561-L1572)
- **C14** [bundle-stated] ""id": "samurai_counter", "class": "samurai", "kind": "Spell", "name": "Counter Attack", "unlock": 5, "mana": 10, "blurb": "Unlocks at level 5.", "tab": "spell", "ref": 403, "map": "UO", "gumpIcon": 21539, "iconKey": "gump_21539"" (raw L1575-L1586)
- **C15** [bundle-stated] ""id": "samurai_honorable", "class": "samurai", "kind": "SpecialMove", "name": "Honorable Execution", "unlock": 10, "mana": 0, "blurb": "Unlocks at level 10.", "tab": "ability", "ref": 400, "map": "UO", "gumpIcon": 21536, "iconKey": "gump_21536"" (raw L1589-L1600)
- **C16** [bundle-stated] ""id": "samurai_way", "class": "samurai", "kind": "Passive", "name": "Way of the Blade", "unlock": 75, "mana": 0, "blurb": "Unlocks at level 75.", "tab": "ability", "map": "New", "gumpIcon": 21536, "iconKey": "idle_samurai_way"" (raw L1603-L1613)

## Ability Dispatch Kinds (`abilities-catalog.json`, 134 Entries)

The shared ability catalog (`version: 6`, `134` total entries) partitions every action into six `kind` values:

| `kind` | Count | `ref` / `map` Convention | Engine Dispatch Mechanism |
|---|---|---|---|
| `ItemUse` | `18` | `class: "*"`, `tab: "item"`, `icon: 3617..3852` | Consumes bandage or potion from backpack; enforces real potion CD (`[[resources]] C8`) |
| `Passive` | `6` (4 unique IDs) | `warrior_slash` (warrior/berserker/paladin, **C1**), `ranger_arrow`, `monk_palm`, `samurai_way` (**C16**) | Excluded from hotbar (`[[tick-and-cooldowns]] C3`) and `#HABINFO` (`[[resources]] C14`) |
| `WeaponAbility` | `19` | `ref: 1..22`, `map: "UO"` (**C5**, **C6**) | Dispatches to ModernUO `WeaponAbility` ID (`1` ArmorIgnore through `22` FrenziedWhirlwind) |
| `Spell` | `48` | `ref: 3..690`, `tab: "spell"` (**C14**) | Dispatches to ModernUO `SpellRegistry` ID across Magery, Necromancy, Chivalry, Bushido, Spellweaving, and Mysticism |
| `SpecialMove` | `10` | `ref: 400, 404, 500, 501, 506, 507` (**C9–C13**, **C15**) | Dispatches to ModernUO Bushido (`400`, `404`) and Ninjitsu (`500`, `501`, `506`, `507`) `SpecialMove` handlers |
| `Custom` | `33` | `map: "New" \| "New/Eth" \| "Eth/New" \| "Idle" \| "UO"` (**C2–C4**, **C7**, **C8**) | Executes custom UO Idle C# server ability handler with a 2-second minimum cooldown floor (`[[resources]] C14`) |

## WeaponAbility & Monster Special Blow Reference (`ref` & `MO`)

Weapon abilities in `abilities-catalog.json` map via `ref` to standard Ultima Online `WeaponAbility` indices, which also correspond to monster special blow flags in `MO` (`_raw/bundle/bestiary-and-wiki.js:92-103`):

| `ref` ID | UO `WeaponAbility` / `MO` Key | Catalog Ability IDs | Status Effect / Combat Behavior |
|---|---|---|---|
| `1` | `ArmorIgnore` (`armorIgnore`) | `duelist_piercing`, `ranger_piercing`, `ranger_charged_shot_r2` | Bypasses target physical armor/resistance |
| `2` | `BleedAttack` (`bleedAttack`) | `warrior_bleed` (`berserker`) | Applies **Bleed DoT** over time |
| `4` | `CrushingBlow` (`crushingBlow`) | `warrior_heavy_strike` (**C5**), `warrior_crushing_blow` (`paladin`) | High single-target physical strike (`[[damage-and-defense]] C8`) |
| `5` | `Disarm` (`disarm`) | `warrior_disarm` | Disarms target for several seconds |
| `7` | `DoubleStrike` (`doubleStrike`) | `warrior_double_strike`, `warrior_double_strike_2`, `warrior_double_strike_2_r2`, `ranger_double_shot_r2` | Rapid two-hit weapon strike |
| `8` | `InfectiousStrike` | `assassin_poison` | Applies weapon **Poison DoT** to target |
| `9` | `MortalStrike` (`mortalStrike`) | `duelist_mortal` | **Anti-heal debuff** preventing target healing |
| `10` | `MovingShot` | `ranger_moving_shot` | Ranged shot usable while kiting/moving |
| `11` | `ParalyzingBlow` (`paralyzingBlow`) | `ranger_aimed_shot`, `ranger_aimed_shot_r2` | **Paralyze crowd control** on hit |
| `12` | `ShadowStrike` | `assassin_backstab` | High-damage strike + stealth/aggro drop |
| `13` | `WhirlwindAttack` (`whirlwindAttack`) | `warrior_whirlwind` (**C6**), `warrior_whirlwind_r2` | Melee AoE attack around caster (`enemies >= 3` trigger) |
| `22` | `FrenziedWhirlwind` | `ranger_rapid_shot`, `ranger_rapid_shot_r2` | Multi-target / rapid volley |
| — | `ConcussionBlow`, `Dismount` | Monster-only in `MO` (`bestiary-and-wiki.js:99,101`) | Monster special strikes in bestiary |

## Status Effect Taxonomy in UO Idle

| Status Category | Catalog Abilities & Spells | Mechanical Effect & Server Rules |
|---|---|---|
| **Attribute Buffs** (`str_buff`, `dex_buff`, `int_buff`) | `strength_potion`, `greater_strength_potion`, `agility_potion`, `greater_agility_potion`, `intelligence_potion`, `greater_intelligence_potion`, `cleric_bless` (`ref: 16`) | Raises `STR`, `DEX`, and/or `INT`; hotbar condition `fh(attr)` checks `*_buff == 0` so potions are only drunk when unbuffed (`[[tick-and-cooldowns]] C4`) |
| **Offensive / Speed / Arcane Buffs** | `berserker_frenzy`, `berserker_bloodrage`, `berserker_berserk`, `paladin_divine_fury` (`ref: 204`), `paladin_consecrate` (`ref: 202`), `paladin_enemy_of_one` (`ref: 205`), `sw_circle` (`ref: 600`), `sw_arcane_empowerment` (`ref: 613`) | Increases attack speed, low-HP damage scaling, weapon elemental damage, or spell power |
| **Defensive Stances & Mitigation Buffs** | `warrior_brace` (**C7**), `warrior_bulwark`, `warrior_shield_wall`, `warrior_sidestep`, `cleric_arch_protection` (`ref: 25`), `sw_attune_weapon` (`ref: 602`), `mystic_stone_form` (`ref: 683`) | Reduces incoming damage; per `[[resources]] C17`, `Brace` and `Armor Break` apply once inside `AOS.Damage` (fixing a prior double-application bug) |
| **Armor, Resistance & Stat Debuffs** | `warrior_armor_break` (**C4**), `warrior_shatter`, `bard_discord`, `mage_weaken` (`ref: 7`), `mage_curse` (`ref: 26`), `necro_corpse_skin` (`ref: 102`), `necro_evil_omen` (`ref: 104`), `necro_mind_rot` (`ref: 107`), `sw_essence_of_wind` (`ref: 606`) | Lowers target physical armor (`Armor Break` in `AOS.Damage` per `[[resources]] C17`), elemental resistances, or casting/combat stats |
| **Damage over Time (DoTs)** | `warrior_bleed` (`ref: 2`), `assassin_poison` (`ref: 8`), `necro_poison_strike` (`ref: 109`), `necro_strangle` (`ref: 110`), `sw_wildfire` (`ref: 609`), `mystic_plague` (`ref: 688`) | Periodic bleed, poison, or fire damage ticks; `necro_strangle` scales harder against low-stamina targets (`_raw/bundle/i18n-en-abilities.js:2496`) |
| **Heal over Time (HoTs)** | `sw_renewal` (`Custom`), `cleric_gift` (`ref: 601`) | Periodic health regeneration over time |
| **Crowd Control (Stun, Paralyze, Root, Disarm, Calm)** | `warrior_shield_bash` (**C3**), `warrior_earthshaker`, `monk_stun`, `ranger_aimed_shot` (`ref: 11`), `mage_paralyze` (`ref: 37`), `duelist_net`, `warrior_disarm` (`ref: 5`), `bard_peace`, `bard_provoke` | Stuns, paralyzes, roots/slows, disarms, calms, or forces enemy-vs-enemy combat |
| **Taunt & Aggro Control** | `warrior_provoke` (**C2**), `warrior_guard_captain`, `duelist_roar` | Pulls monster aggro onto the tank; default hotbar trigger fires when `ally_agro == 1` (`[[tick-and-cooldowns]] C7`) |
| **Reflects & Damage Links** | `mage_magic_reflect` (`Custom`, `map: "New/Eth"`), `necro_blood_oath` (`ref: 101`), `warrior_riposte` | Reflects spell damage, links damage between caster and target, or parries and counter-attacks when hit |
| **Summons & Transformation Forms** | `mage_fire_elemental`, `mage_air_elemental`, `necro_animate_dead`, `necro_lich_form` (`ref: 106`), `necro_vampiric_embrace` (`ref: 112`), `sw_nature_fury` (`ref: 604`) | Fire/Air elementals and `Lich Form` last **90 seconds**; `Animate Dead` summons a skeleton without requiring a corpse; all summons despawn upon exiting a hunt (`[[resources]] C19`) |
| **Threshold Finishers (Executes)** | `warrior_execution` (**C8**), `ranger_deadeye`, `assassin_eviscerate`, `sw_word_of_death` (`ref: 611`) | High-damage finishers against wounded/low-HP targets |

## Existing Bushido & Ninjitsu Entries in `abilities-catalog.json`

The live `v0.99.0` catalog (`abilities-catalog.json`) already contains twelve entries across `samurai` and `ninja` (**C9–C16**), providing direct shared-config hooks for Phase 5 class design:

| Ability ID | Class | `kind` | `ref` | `unlock` | `mana` | `map` | `gumpIcon` | Canonical UO Mapping |
|---|---|---|---|---|---|---|---|---|
| `samurai_lightning` (**C13**) | `samurai` | `SpecialMove` | `404` | `1` | `10` | `"UO"` | `21540` | Bushido `LightningStrike` (`404`) |
| `samurai_counter` (**C14**) | `samurai` | `Spell` | `403` | `5` | `10` | `"UO"` | `21539` | Bushido `CounterAttack` (`403`) |
| `samurai_honorable` (**C15**) | `samurai` | `SpecialMove` | `400` | `10` | `0` | `"UO"` | `21536` | Bushido `HonorableExecution` (`400`) |
| `samurai_way` (**C16**) | `samurai` | `Passive` | — | `75` | `0` | `"New"` | `21536` | Passive (`OE` deferred in `[[tick-and-cooldowns]] C1`) |
| `samurai_honorable_r2` | `samurai` | `SpecialMove` | `400` | `200` | `0` | `"UO"` | `21536` | Rank II `HonorableExecution` |
| `samurai_lightning_r2` | `samurai` | `SpecialMove` | `404` | `300` | `10` | `"UO"` | `21540` | Rank II `LightningStrike` |
| `ninja_focus` (**C9**) | `ninja` | `SpecialMove` | `500` | `1` | `20` | `"UO"` | `21280` | Ninjitsu `FocusAttack` (`500`) |
| `ninja_death` (**C10**) | `ninja` | `SpecialMove` | `501` | `5` | `30` | `"UO"` | `21281` | Ninjitsu `DeathStrike` (`501`) |
| `ninja_mirror` (**C11**) | `ninja` | `SpecialMove` | `507` | `10` | `10` | `"UO"` | `21287` | Ninjitsu `MirrorImage` (`507`) |
| `ninja_shadowjump` (**C12**) | `ninja` | `SpecialMove` | `506` | `75` | `15` | `"UO"` | `21286` | Ninjitsu `Shadowjump` (`506`) |
| `ninja_death_r2` | `ninja` | `SpecialMove` | `501` | `200` | `30` | `"UO"` | `21281` | Rank II `DeathStrike` |
| `ninja_mirror_r2` | `ninja` | `SpecialMove` | `507` | `300` | `10` | `"UO"` | `21287` | Rank II `MirrorImage` |

## Elemental & Physical Resistance Keys (`CO`)

Both player equipment (`character-bonus-and-status.js`) and monster bestiary sheets (`CO` in `_raw/bundle/bestiary-and-wiki.js:91`) use the same five resistance channels:
1. `fisico` (`fisica` on player sheet) — Physical resistance
2. `fogo` — Fire resistance
3. `frio` — Cold resistance
4. `veneno` — Poison resistance
5. `energia` — Energy resistance
