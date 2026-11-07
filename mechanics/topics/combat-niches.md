---
id: "combat-niches"
title: "Combat Roles, Resource Economies, and Protected Samurai and Ninja Niches"
category: "classes"
aliases: ["combat-niches", "class-roles", "samurai-niche", "ninja-niche", "design-space"]
status: "bundle-stated"
sources: ["_raw/bundle/classes-config.js", "_raw/bundle/skills-and-progression.js", "_raw/bundle/abilities-catalog.json", "_raw/bundle/combat-estimators-and-hotbar.js"]
evidence: ["bundle: _raw/bundle/skills-and-progression.js:68-238", "bundle: _raw/bundle/abilities-catalog.json:213-1760", "bundle: _raw/bundle/combat-estimators-and-hotbar.js:358-519", "wiki: _raw/wiki/changelog-server-dev.md:17,499-502,653-654"]
code_refs: ["classes-config.js:Wj", "classes-config.js:Kj", "classes-config.js:ZC", "classes-config.js:e2"]
updated: "2026-11-07"
---
# Combat Roles, Resource Economies, and Protected Samurai and Ninja Niches

Source: [raw](../_raw/bundle/classes-config.js)

## Summary

UO Idle partitions its combat roster across distinct offensive, defensive, sustain, crowd-control, and resource-economy profiles so that no two classes play identically inside the automated hunting loop. While existing melee, ranged, and spellcasting classes occupy flat damage-reduction tanking, low-health self-risk berserking, gold-tithed holy sustain, multi-arrow ranged volleys, reagent-fueled elemental bombardment, and corpse-free undead summoning, Samurai and Ninja claim two orthogonal, uncrowded combat niches derived from canonical Ultima Online Bushido and Ninjitsu mechanics. Samurai operates as a Perfection-ramping, weapon-parry counter-attacker and threshold finisher, whereas Ninja operates as an ablative clone-evasion, stealth-opener, and five-swing delayed-detonation trickster.

## Claims

- **C1** [bundle-stated] "const Wj = ['warrior', 'ranger', 'mage'], Kj = { warrior: 101, ranger: 102, mage: 103, worker: 104, berserker: 105, duelist: 106, necromancer: 107, mystic: 108, spellweaver: 109, paladin: 110, assassin: 111, ninja: 112, monk: 113, samurai: 114, bard: 115, tamer: 116, }," (raw L5-L23)
- **C2** [bundle-stated] "QC = { 1: 'warrior', 2: 'ranger', 3: 'mage', 4: 'worker', 5: 'berserker', 6: 'duelist', 7: 'necromancer', 8: 'mystic', 9: 'spellweaver', 10: 'paladin', 11: 'assassin', 12: 'ninja', 13: 'monk', 14: 'samurai', 15: 'bard', 16: 'tamer', }; function Dg(e) { return QC[e] ?? null; }" (raw L24-L44)
- **C3** [bundle-stated] "const ZC = { warrior: { str: 60, dex: 20, int: 10, skills: [ [40, 40], [27, 30], [1, 20], [5, 10], ], }," (raw L45-L56)
- **C4** [bundle-stated] "berserker: { str: 55, dex: 25, int: 10, skills: [ [40, 40], [27, 30], [1, 20], [17, 10], ], }, duelist: { str: 40, dex: 40, int: 10, skills: [ [42, 40], [27, 30], [1, 20], [5, 10], ], }," (raw L57-L78)
- **C5** [bundle-stated] "ranger: { str: 40, dex: 40, int: 10, skills: [ [31, 40], [27, 30], [1, 20], [21, 10], ], }," (raw L79-L89)
- **C6** [bundle-stated] "mage: { str: 20, dex: 20, int: 50, skills: [ [25, 40], [16, 30], [46, 20], [26, 10], ], }," (raw L90-L100)
- **C7** [bundle-stated] "necromancer: { str: 20, dex: 20, int: 50, skills: [ [49, 40], [32, 30], [25, 20], [46, 10], ], }, mystic: { str: 20, dex: 20, int: 50, skills: [ [55, 40], [50, 30], [25, 20], [46, 10], ], }, spellweaver: { str: 20, dex: 20, int: 50, skills: [ [54, 40], [46, 30], [16, 20], [25, 10], ], }," (raw L101-L133)
- **C8** [bundle-stated] "paladin: { str: 50, dex: 25, int: 15, skills: [ [40, 30], [51, 30], [27, 20], [5, 20], ], }," (raw L134-L144)
- **C9** [bundle-stated] "assassin: { str: 35, dex: 45, int: 10, skills: [ [42, 40], [30, 30], [27, 20], [21, 10], ], }," (raw L145-L155)
- **C10** [bundle-stated] "ninja: { str: 35, dex: 45, int: 10, skills: [ [42, 30], [53, 30], [21, 20], [47, 20], ], }," (raw L156-L166)
- **C11** [bundle-stated] "monk: { str: 45, dex: 35, int: 10, skills: [ [43, 40], [50, 30], [27, 20], [1, 10], ], }, samurai: { str: 50, dex: 30, int: 10, skills: [ [40, 30], [52, 30], [27, 20], [1, 20], ], }," (raw L167-L188)
- **C12** [bundle-stated] "const e2 = { warrior: 'WR', ranger: 'RG', mage: 'MG', worker: 'WK', berserker: 'BK', duelist: 'DL', necromancer: 'NC', mystic: 'MS', spellweaver: 'SW', paladin: 'PL', assassin: 'AS', ninja: 'NJ', monk: 'MK', samurai: 'SM', bard: 'BD', tamer: 'TM', }; function Dc(e) { return !e || !Yj(e) ? '' : e2[e]; }" (raw L226-L246)

## Live Class Combat Niche Matrix

Across the active combat classes in `Kj` (**C1**) and `gE` (`[[class-structural-parity]] C3`..`[[class-structural-parity]] C9`), each class occupies a distinct combination of primary damage delivery, AoE clear, mitigation, sustain, and resource economy:

| Class (`e2` Badge, **C12**) | Base Stats (`STR/DEX/INT`, **C3–C11**) | Primary Single-Target Profile | AoE / Multi-Target Mechanism | Defensive / Mitigation Layer | Self-Sustain Mechanism | Resource Economy & Server Rules |
|---|---|---|---|---|---|---|
| **Warrior (`WR`)** (`[[warrior]]`) | `60 / 20 / 10` (**C3**) | `Heavy Strike` (`CrushingBlow`), `Armor Break` shred, `Execution` low-HP finisher (`[[warrior]] C4`..`[[warrior]] C10`) | `Whirlwind` (`ref: 13`, triggers at `enemies >= 3`, `[[warrior]] C6`) | Shield Parry (`skill 5`) + flat damage-reduction stances `Brace` and `Bulwark` (`[[warrior]] C7`, `[[warrior]] C9`) + `Shield Bash` stun / `Disarm` | Bandages (`wq(healing, anatomy)`) + Heal Potions (`15%/25%/35%` Max HP) | **Zero-Mana & Zero-Meditation** on server (`[[resources]] C15`, `[[resources]] C16`); physical level scaling `×60` (`[[resources]] C1`) |
| **Berserker (`BK`)** | `55 / 25 / 10` (**C4**) | `Double Strike`, `Bleed`, `Mortal Strike`, `Armor Ignore`, `Crushing Blow`, `Execution` (`[[class-structural-parity]] C4`) | `Cleave` (`L1` splash) + `Whirlwind` (`L15`) | High `STR` HP pool; sacrifices safety for low-HP damage buffs (`Frenzy`, `Bloodrage`, `Berserk`) | Bandages + Heal Potions (no shield `Parry` in `hE.berserker`, `[[class-structural-parity]] C2`) | Two-handed `executionersAxe` kit (`[[class-structural-parity]] C10`); physical level scaling `×60` |
| **Paladin (`PL`)** | `50 / 25 / 15` (**C8**) | `Consecrate Weapon` (`ref: 202`), `Divine Fury` (`ref: 204`), `Heavy Strike`, `Crushing Blow`, `Execution` (`[[class-structural-parity]] C5`) | `Holy Light` (`ref: 206`) + `Whirlwind` (`L50`) | Shield Parry + `Brace` (`L25`) + `Bulwark` (`L40`) + `Shield Bash` (`L15`) + `Disarm` (`L35`) | `Close Wounds` (`kq(chivalry)`, `[[damage-and-defense]] C7`) + `Noble Sacrifice` (`ref: 207`) + Bandages + Potions | **Mana + Gold Tithe** (`1 gp` per Chivalry point spent, `[[resources]] C12`); physical level scaling `×60` |
| **Ranger (`RG`)** (`[[ranger]]`) | `40 / 40 / 10` (**C5**) | `Rapid Shot` (`FrenziedWhirlwind`), `Aimed Shot` (`ParalyzingBlow`), `Piercing Arrow` / `Charged Shot` (`ArmorIgnore`), `Deadeye` finisher (`[[ranger]] C2`..`[[ranger]] C9`) | `Multishot` (`L40`, `2 + rank` hits) + `Bolt Volley` (`L60`, `2 + rank` hits, `[[damage-and-defense]] C8`) | Ranged kiting (`Moving Shot`, `ref: 10`) + `Aimed Shot` paralyze (`ref: 11`) + Studded Leather | Bandages + Heal Potions (`[[tick-and-cooldowns]] C11`) | **Mana + Arrows/Bolts (`#SUPPLY`)** (`[[resources]] C21`); physical level scaling `×60` (`[[resources]] C1`) |
| **Mage (`MG`)** (`[[mage]]`) | `20 / 20 / 50` (**C6**) | `Magic Arrow`, `Harm`, `Fireball`, `Lightning`, `Energy Bolt`, `Explosion`, `Flame Strike` (`Aq`/`Mq` scaling, `[[mage]] C1`..`[[mage]] C11`) | `Chain Lightning` (`L40` cleave), `Meteor Swarm` (`L60` AoE), plus `90s` `Fire Elemental` / `Air Elemental` summons (`[[mage]] C10`..`[[mage]] C15`) | `Magic Reflect` (`L25` spell reflect) + `Magic Resist` (`skill 26`) | `Heal` (`15%` Max HP on server, `[[resources]] C11`), `Cure` (`L1`), Mana/Heal Potions | **Mana + Meditation + Magery Reagents (`#SUPPLY`)** (`[[resources]] C21`); spellcaster level scaling `×80` (`[[resources]] C1`) |
| **Necromancer (`NC`)** | `20 / 20 / 50` (**C7**) | `Pain Spike` (`ref: 108`), `Strangle` stamina-scaling poison DoT (`ref: 110`), `Poison Strike` (`ref: 109`) (`[[class-structural-parity]] C8`) | `Wither` (`ref: 114` cold AoE) + corpse-free `Animate Dead` skeleton summon (`[[resources]] C19`) | `Blood Oath` damage reflection link (`ref: 101`) + `Magic Reflect` (`L25`) | `necro_magery_heal` (`15%` Max HP), `necro_magery_cure`, `Lich Form` (`90s`, `ref: 106`) | **Mana + Meditation + Necro/Magery Reagents** (`[[class-structural-parity]] C10`); spellcaster level scaling `×80` |
| **Spellweaver (`SW`)** | `20 / 20 / 50` (**C7**) | `mage_magic_arrow`, `mage_nature_fury` (`L50` DoT), `sw_wildfire` / `Word of Death` (`L60`, `ref: 613`) (`[[class-structural-parity]] C9`) | `sw_thunderstorm` (`L55`, `ref: 604`) | `cleric_bless` (`L35`, `+STR/DEX/INT`), `cleric_arch_protection` (`L40`, physical resist), `mage_magic_reflect` (`L25`) | `sw_magery_heal` (`15%` Max HP), `sw_magery_gh` (`35%` Max HP, `[[resources]] C11`), `sw_renewal` (`L45` HoT) | **Mana + Meditation + Spellweaving Reagents** (`[[resources]] C20`); spellcaster level scaling `×80` |
| **Duelist (`DL`) / Assassin (`AS`) / Monk (`MK`)** | `40/40/10` (**C4**), `35/45/10` (**C9**), `45/35/10` (**C11**) | Duelist: `ArmorIgnore` + `Disarm`; Assassin: `Poison Blade` (`ref: 8`) + `Backstab` (`ref: 12`) + `Eviscerate`; Monk: `Flurry` (`2 + rank` hits, `[[damage-and-defense]] C8`) | Duelist: `Champion's Roar`; Monk: `Flurry` multi-hit | Duelist: `Net Throw` root + Buckler Parry; Assassin: `Shadow Mastery`; Monk: `Stunning Palm` (`75`) | Monk: `Ki Recovery` (`Focus`-scaled self-heal, `[[damage-and-defense]] C11`) + Bandages/Potions | Legacy pre-V3 catalog tiers (`1, 5, 10, 40/75, 150/200, 300`); no `gE` table yet |

## Protected Combat Niche for Samurai (`Bushido` — `Kj.samurai = 114`, Badge `SM`)

### 1. Attribute, Skill & Equipment Foundation (**C11**, `[[class-structural-parity]] C2`, `[[class-structural-parity]] C10`)
- **Base Stats (`ZC.samurai`, **C11**):** `STR: 50`, `DEX: 30`, `INT: 10` (high-Strength, medium-Dexterity melee duelist).
- **Starter Skills (`hE.samurai`, `[[class-structural-parity]] C2`):** `bushido` (`50`), `swords` (`50`), `tactics` (`50`), `anatomy` (`50`), `healing` (`50`), `magicResist` (`30`), `focus` (`50`), plus `parry` (`5`) in Bushido weapon parry formulas.
- **Starter Loadout (`mx.samurai` / `hx.samurai`, `[[class-structural-parity]] C10`, `[[class-structural-parity]] C11`):** Tokuno Samurai armor set (`samuraiSet`), `katana` (`OneHanded 5119` — no shield), `bandages`, `potionsMelee`, and `robeCloak` (`SE.samurai = 1884`, `[[class-structural-parity]] C12`).

### 2. Core Mechanical Niche: *Perfection Single-Target Ramp, Weapon Parry-Counter & Threshold Execute*
To prevent overlap with Warrior, Berserker, and Paladin, Samurai's combat loop is defined by four orthogonal Bushido pillars (`[[engine-capability-matrix]]`, `[[status-effects]] C13`..`[[status-effects]] C16`):

| Niche Dimension | Samurai (`Bushido`) Mechanism | Contrast vs Warrior (`WR`), Berserker (`BK`), and Paladin (`PL`) |
|---|---|---|
| **Offensive Scaling (Perfection Ramp)** | Builds consecutive-hit **Perfection** damage stacks against the current target (`+10%` physical damage per consecutive hit up to cap, resetting on miss or target switch) + high-crit **Lightning Strike** (`samurai_lightning`, `ref: 404`, `[[status-effects]] C13`). | Warrior (`[[warrior]]`) uses flat `CrushingBlow` and `Armor Break`; Berserker scales off **low self HP** (`Bloodrage`/`Berserk`); Paladin scales off flat Chivalry buffs (`Consecrate`/`Divine Fury`). |
| **Multi-Target Cleave (`Momentum Strike`)** | **Two-target cleave** (`Momentum Strike`, `ref: 405` / `samurai_way` `[[status-effects]] C16`) that transfers a Bushido-scaled hit to a second adjacent enemy when `enemies >= 2`. | Warrior and Paladin use 360-degree `Whirlwind` (`enemies >= 3`); Samurai excels in **1–2 target elite/boss duels** rather than 5+ mob trash swarms. |
| **Active Mitigation & Reactive Counter (`Evasion` + `Counter Attack`)** | Two-handed/one-handed **Katana Weapon Parry** (no shield required; scales with `Bushido` + `Parry`), **Evasion** (`ref: 402`) burst parry/spell-block window, and **Counter Attack** (`samurai_counter`, `ref: 403`, `[[status-effects]] C14`) which turns a parried blow into an immediate counter-swing. | Warrior and Paladin require a physical shield (`TwoHanded 7035`) and use passive `% DEF` stances (`Brace`/`Bulwark`); Berserker has zero active mitigation. |
| **Sustain & Finisher (`Confidence` + `Honorable Execution`)** | **Confidence** (`ref: 401`) regenerates HP and Stamina on cast and on successful Bushido weapon parries; **Honorable Execution** (`samurai_honorable`, `ref: 400`, `[[status-effects]] C15`) delivers a high-multiplier finisher that grants a positive swing-speed/heal buff on kill without penalizing resistances in the idle loop. | Paladin spends **character gold (`1 gp/pt`)** for `Close Wounds`; Warrior relies purely on Bandages and Heal Potions with `0` Mana (`[[resources]] C15`). |

## Protected Combat Niche for Ninja (`Ninjitsu` — `Kj.ninja = 112`, Badge `NJ`)

### 1. Attribute, Skill & Equipment Foundation (**C10**, `[[class-structural-parity]] C2`, `[[class-structural-parity]] C10`)
- **Base Stats (`ZC.ninja`, **C10**):** `STR: 35`, `DEX: 45`, `INT: 10` (high-Dexterity, fast-swinging precision striker).
- **Starter Skills (`hE.ninja`, `[[class-structural-parity]] C2`):** `ninjitsu` (`50`), `fencing` (`50`), `hiding` (`50`), `stealth` (`50`), `healing` (`50`), `magicResist` (`30`), `focus` (`50`).
- **Starter Loadout (`mx.ninja` / `hx.ninja`, `[[class-structural-parity]] C10`, `[[class-structural-parity]] C11`):** Leather Ninja set (`ninjaSet`), `kryss` (`OneHanded 5121`), `bandages`, `potionsMelee`, and `robeCloak` (`SE.ninja = 1871`, `[[class-structural-parity]] C12`).

### 2. Core Mechanical Niche: *Ablative Clone Evasion, Stealth-Window Openers & 5-Swing Delayed Detonation*
To prevent overlap with Assassin, Duelist, Monk, and Ranger, Ninja's combat loop is defined by four Ninjitsu pillars (`[[engine-capability-matrix]]`, `[[status-effects]] C9`..`[[status-effects]] C12`):

| Niche Dimension | Ninja (`Ninjitsu`) Mechanism | Contrast vs Assassin (`AS`), Duelist (`DL`), Monk (`MK`), and Ranger (`RG`) |
|---|---|---|
| **Mitigation Layer (`Mirror Image` Ablative Clones)** | Summons illusory **Mirror Image** clones (`ninja_mirror`, `ref: 507`, `[[status-effects]] C11`) that intercept incoming hits one clone at a time, gated by an internal cooldown floor so clones act as an ablative buffer rather than permanent avoidance immortality (`[[engine-capability-matrix]]`). | Warrior/Paladin use `% DEF` armor stances; Samurai uses reactive weapon parries; Assassin and Ranger have no clone absorption layer. |
| **Delayed Burst Finisher (`Death Strike` 5-Swing Detonation)** | Marks the target with **Death Strike** (`ninja_death`, `ref: 501`, `[[status-effects]] C10`), which detonates for massive Ninjitsu-scaled burst damage after **5 subsequent weapon swings or combat ticks** in the stationary idle loop (`[[engine-capability-matrix]]`). | Warrior `Execution`, Ranger `Deadeye`, and Assassin `Eviscerate` are instant low-HP threshold strikes; Ninja builds a **setup-and-detonate combo window**. |
| **Stealth-State Openers & Precision Strikes (`Shadowjump`, `Backstab`, `Surprise Attack`, `Focus Attack`)** | Uses **Smoke Bomb / Shadowjump** (`ninja_shadowjump`, `ref: 506`, `[[status-effects]] C12`) to enter an automated combat-stealth state that empowers **Backstab** (`ref: 502`) and **Surprise Attack** (`ref: 503` defense shred), woven between **Focus Attack** (`ninja_focus`, `ref: 500`, `[[status-effects]] C9`) high-accuracy strikes. | Assassin focuses on continuous weapon poison (`Poison Blade` `ref: 8`); Duelist focuses on `ArmorIgnore` + `Net Throw`; Monk focuses on unarmed `Flurry` + `Ki Recovery`. |
| **Hybrid Ranged Tools & Aspect Passives (`Ki Attack`, `Fukiya` / `Shuriken`, `Animal Form`)** | Supplements melee Fencing combos with gap-closing **Ki Attack** (`ref: 505`), **Shuriken / Fukiya** poison-dart utility, and passive **Animal Form** (`ref: 504`) combat aspect bonuses (`Wolf` speed/hit, `Ki-Rin` / `Unicorn` sustain, `Bake-Kitsune` defense). | Ranger (`[[ranger]]`) is a pure ranged bow/crossbow class (`dx.ranger = 'ranged'`), whereas Ninja is a fast `'melee'` (`dx.ninja = 'melee'`) trickster with hybrid throwing/stealth tools. |
