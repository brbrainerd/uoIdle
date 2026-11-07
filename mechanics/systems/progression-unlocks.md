---
id: "progression-unlocks"
title: "Character Progression, Skill Mastery Caps, and Class Unlock Trees"
category: "progression"
aliases: ["skills", "unlocks", "arvore", "progression-tree", "starter-kits", "level-curve"]
status: "verified"
sources: ["_raw/bundle/skills-and-progression.js", "_raw/bundle/progression-tree-ui.js", "_raw/bundle/classes-config.js", "_raw/bundle/i18n-en-abilities.js", "_raw/wiki/changelog-server-dev.md"]
evidence: ["live: _evidence/live-bundle-probe.txt L1-L20", "bundle: _raw/bundle/progression-tree-ui.js:5-97", "bundle: _raw/bundle/progression-tree-ui.js:369-389", "bundle: _raw/bundle/classes-config.js:5-72", "bundle: _raw/bundle/i18n-en-abilities.js:2616", "wiki: _raw/wiki/changelog-server-dev.md:29-43"]
code_refs: ["skills-and-progression.js:jc", "skills-and-progression.js:dx", "skills-and-progression.js:hE", "skills-and-progression.js:gE", "skills-and-progression.js:mx", "progression-tree-ui.js:Rm"]
updated: "2026-11-07"
---
# Character Progression, Skill Mastery Caps, and Class Unlock Trees

Source: [raw](../_raw/bundle/skills-and-progression.js)

## Summary

UO Idle structures character advancement around an indexed Ultima Online skill registry, a combat role taxonomy across sixteen class keys, deterministic starter skill and equipment grants, linear level-gated ability unlock tables, and a server-synchronized progression tree. Upon character creation, each class receives fixed starting skill levels in its primary combat or crafting disciplines alongside a universal baseline in Magic Resist and a curated starter kit of armor, weapons, bandages, potions, or spell reagents. As a character levels up, class abilities unlock automatically along linear milestone tables without consuming progression currencies, while each level awards dedicated Skill Points, Status Points, and Attribute Points spent through the progression tree protocol. While Bushido, Ninjitsu, Samurai, and Ninja are already registered in the skill array, role map, starter skill table, and starter kit table, their linear ability unlock tables are not yet populated in the client progression map.

## Claims

- **C1** [verified] "const jc = [ 'alchemy', 'anatomy', 'animalLore', 'itemId', 'armsLore', 'parry', 'begging', 'blacksmith', 'fletching', 'peacemaking', 'camping', 'carpentry', 'cartography', 'cooking', 'detectHidden', 'discordance', 'evalInt', 'healing', 'fishing', 'forensics', 'herding', 'hiding', 'provocation', 'inscribe', 'lockpicking', 'magery', 'magicResist', 'tactics', 'snooping', 'musicianship', 'poisoning', 'archery', 'spiritSpeak', 'stealing', 'tailoring', 'animalTaming', 'tasteId', 'tinkering', 'tracking', 'veterinary', 'swords', 'macing', 'fencing', 'wrestling', 'lumberjacking', 'mining', 'meditation', 'stealth', 'removeTrap', 'necromancy', 'focus', 'chivalry', 'bushido', 'ninjitsu', 'spellweaving', 'mysticism', 'imbuing', 'throwing', ];" (raw L5-L64)
- **C2** [verified] "function Tw(e) { return e < 0 || e >= jc.length ? null : jc[e]; }" (raw L65-L67)
- **C3** [verified] "const dx = { warrior: 'melee', berserker: 'melee', duelist: 'melee', assassin: 'melee', ninja: 'melee', monk: 'melee', samurai: 'melee', paladin: 'melee', ranger: 'ranged', mage: 'magic', necromancer: 'magic', mystic: 'magic', spellweaver: 'magic', bard: 'support', tamer: 'support', worker: 'support', }," (raw L68-L85)
- **C4** [verified] "uE = 50, dE = 30, mE = 26, hE = { warrior: [40, 41, 42, 27, 1, 5, 17, 26, 50], berserker: [40, 41, 42, 27, 1, 17, 26, 50], duelist: [40, 41, 42, 27, 1, 5, 17, 26, 50], ranger: [31, 27, 1, 4, 17, 26, 50], mage: [25, 16, 46, 41, 27, 1, 26, 50], necromancer: [49, 32, 46, 41, 27, 1, 26, 50], mystic: [55, 25, 46, 41, 27, 1, 26, 50], spellweaver: [54, 46, 41, 27, 1, 26, 50], paladin: [51, 40, 41, 42, 27, 1, 5, 17, 26, 50], assassin: [42, 27, 30, 21, 17, 26, 50], ninja: [53, 42, 21, 47, 17, 26, 50], monk: [43, 27, 1, 17, 26, 50], samurai: [52, 40, 27, 1, 17, 26, 50], bard: [29, 15, 9, 22, 17, 26, 50], tamer: [35, 2, 39, 42, 17, 26, 50], worker: [45, 44, 7, 37, 26, 50], };" (raw L86-L106)
- **C5** [verified] "function fE(e) { return hE[e].map((a) => Tw(a) ?? `skill${a}`); } function pE(e) { return e === mE || e === 'magicResist' ? dE : uE; }" (raw L107-L112)
- **C6** [verified] "const gE = { warrior: [ ['warrior_slash', 1], ['warrior_provoke', 5], ['warrior_shield_bash', 10], ['warrior_armor_break', 15], ['warrior_heavy_strike', 20], ['warrior_whirlwind', 25], ['warrior_brace', 30], ['warrior_disarm', 40], ['warrior_bulwark', 50], ['warrior_execution', 60], ]," (raw L113-L125)
- **C7** [verified] "berserker: [ ['berserker_cleave', 1], ['warrior_heavy_strike', 5], ['warrior_double_strike', 10], ['warrior_whirlwind', 15], ['warrior_bleed', 20], ['warrior_armor_break', 25], ['berserker_frenzy', 30], ['berserker_bloodrage', 35], ['duelist_mortal', 40], ['warrior_crushing_blow', 45], ['duelist_armor_ignore', 50], ['warrior_execution', 55], ['berserker_berserk', 60], ]," (raw L126-L140)
- **C8** [verified] "paladin: [ ['paladin_close_wounds', 1], ['warrior_heavy_strike', 5], ['paladin_consecrate', 10], ['warrior_shield_bash', 15], ['paladin_divine_fury', 20], ['warrior_brace', 25], ['paladin_holy_light', 30], ['warrior_disarm', 35], ['warrior_bulwark', 40], ['paladin_noble', 45], ['warrior_whirlwind', 50], ['warrior_crushing_blow', 55], ['warrior_execution', 60], ]," (raw L141-L155)
- **C9** [verified] "ranger: [ ['ranger_arrow', 1], ['ranger_rapid_shot', 5], ['ranger_aimed_shot', 10], ['ranger_force_arrow', 15], ['ranger_piercing', 20], ['ranger_serpent_arrow', 25], ['ranger_moving_shot', 30], ['ranger_lightning_arrow', 35], ['ranger_multishot', 40], ['ranger_armor_pierce', 45], ['ranger_charged_shot', 50], ['ranger_deadeye', 55], ['ranger_bolt_volley', 60], ]," (raw L156-L170)
- **C10** [verified] "mage: [ ['mage_heal', 1], ['mage_cure', 1], ['mage_magic_arrow', 1], ['mage_harm', 5], ['mage_fireball', 10], ['mage_lightning', 15], ['mage_magic_reflect', 25], ['mage_energy_bolt', 30], ['mage_explosion', 35], ['mage_chain_lightning', 40], ['mage_flamestrike', 45], ['mage_fire_elemental', 50], ['mage_air_elemental', 55], ['mage_meteor', 60], ]," (raw L171-L186)
- **C11** [verified] "necromancer: [ ['necro_magery_heal', 1], ['necro_magery_cure', 1], ['mage_magic_arrow', 1], ['mage_magic_reflect', 25], ['necro_pain_spike', 30], ['necro_blood_oath', 35], ['necro_wither', 40], ['necro_lich_form', 45], ['necro_animate_dead', 50], ['necro_strangle', 55], ['necro_poison_strike', 60], ]," (raw L187-L199)
- **C12** [verified] "spellweaver: [ ['sw_magery_heal', 1], ['mage_cure', 1], ['mage_magic_arrow', 1], ['mage_magic_reflect', 25], ['sw_magery_gh', 30], ['cleric_bless', 35], ['cleric_arch_protection', 40], ['sw_renewal', 45], ['mage_nature_fury', 50], ['sw_thunderstorm', 55], ['sw_wildfire', 60], ], }," (raw L200-L213)
- **C13** [verified] "mx = { warrior: ['malha', 'longswordShield', 'bandages', 'potionsMelee', 'robeCloak'], berserker: ['malha', 'executionersAxe', 'bandages', 'potionsMelee', 'robeCloak'], duelist: ['malha', 'kryssBuckler', 'bandages', 'potionsMelee', 'robeCloak'], ranger: ['studded', 'bowArrows', 'crossbowBolts', 'bandages', 'potionsMelee', 'robeCloak'], mage: ['leather', 'casterStaff', 'reagents300', 'potionsCaster', 'robeCloak'], necromancer: [ 'leather', 'casterStaff', 'necroPathReagents', 'healArrowReagents', 'potionsCaster', 'robeCloak', ], mystic: ['leather', 'casterStaff', 'reagents300', 'potionsCaster', 'robeCloak'], spellweaver: ['leather', 'casterStaff', 'spellweaverReagents', 'potionsCaster', 'robeCloak'], paladin: ['malha', 'maceShield', 'bandages', 'potionsMelee', 'robeCloak'], assassin: ['leather', 'kryss', 'poison', 'bandages', 'potionsMelee', 'robeCloak'], ninja: ['ninjaSet', 'kryss', 'bandages', 'potionsMelee', 'robeCloak'], monk: ['cloth', 'quarterStaff', 'bandages', 'potionsMelee', 'robeCloak'], samurai: ['samuraiSet', 'katana', 'bandages', 'potionsMelee', 'robeCloak'], bard: ['leather', 'kryss', 'harp', 'bandages', 'potionsMelee', 'robeCloak'], tamer: ['leather', 'crook', 'bandages', 'potionsMelee', 'robeCloak'], worker: ['cloth', 'pickaxeHatchet', 'smithHammer', 'potionsMelee', 'robeCloak'], };" (raw L214-L238)
- **C14** [verified] "function bE(e) { return [...(mx[e] ?? mx.warrior)]; }" (raw L239-L241)

## Complete 58-Skill Registry (`jc`, **C1**, **C2**)

`jc` (**C1**) maps standard Ultima Online 0-based skill IDs (`0..57`) to canonical UO Idle skill keys resolved by `Tw(e)` (**C2**):

| ID Range | Index : Skill Key Mapping |
|---|---|
| **0–9** | `0: alchemy`, `1: anatomy`, `2: animalLore`, `3: itemId`, `4: armsLore`, `5: parry`, `6: begging`, `7: blacksmith`, `8: fletching`, `9: peacemaking` |
| **10–19** | `10: camping`, `11: carpentry`, `12: cartography`, `13: cooking`, `14: detectHidden`, `15: discordance`, `16: evalInt`, `17: healing`, `18: fishing`, `19: forensics` |
| **20–29** | `20: herding`, `21: hiding`, `22: provocation`, `23: inscribe`, `24: lockpicking`, `25: magery`, `26: magicResist`, `27: tactics`, `28: snooping`, `29: musicianship` |
| **30–39** | `30: poisoning`, `31: archery`, `32: spiritSpeak`, `33: stealing`, `34: tailoring`, `35: animalTaming`, `36: tasteId`, `37: tinkering`, `38: tracking`, `39: veterinary` |
| **40–49** | `40: swords`, `41: macing`, `42: fencing`, `43: wrestling`, `44: lumberjacking`, `45: mining`, `46: meditation`, `47: stealth`, `48: removeTrap`, `49: necromancy` |
| **50–57** | `50: focus`, `51: chivalry`, `52: bushido`, `53: ninjitsu`, `54: spellweaving`, `55: mysticism`, `56: imbuing`, `57: throwing` |

## Class Role Taxonomy (`dx`), Starter Skills (`hE`), and Starter Kits (`mx`)

Every starter skill in `hE[class]` (**C4**) starts at `uE = 50` except `magicResist` (`mE = 26`), which starts at `dE = 30` via `pE(e)` (**C5**). Notice that all sixteen classes receive `magicResist` (`26`, starting at `30`) and `focus` (`50`, starting at `50`).

| Class Key | Role (`dx`, **C3**) | Starter Skill IDs (`hE`, **C4**) | Resolved Starter Skills (`50` each, `magicResist` `30`) | Starter Equipment Kit (`mx`, **C13**) |
|---|---|---|---|---|
| `warrior` | `'melee'` | `[40, 41, 42, 27, 1, 5, 17, 26, 50]` | `swords`, `macing`, `fencing`, `tactics`, `anatomy`, `parry`, `healing`, `magicResist` (`30`), `focus` | `malha`, `longswordShield`, `bandages`, `potionsMelee`, `robeCloak` |
| `berserker` | `'melee'` | `[40, 41, 42, 27, 1, 17, 26, 50]` | `swords`, `macing`, `fencing`, `tactics`, `anatomy`, `healing`, `magicResist` (`30`), `focus` | `malha`, `executionersAxe`, `bandages`, `potionsMelee`, `robeCloak` |
| `duelist` | `'melee'` | `[40, 41, 42, 27, 1, 5, 17, 26, 50]` | `swords`, `macing`, `fencing`, `tactics`, `anatomy`, `parry`, `healing`, `magicResist` (`30`), `focus` | `malha`, `kryssBuckler`, `bandages`, `potionsMelee`, `robeCloak` |
| `paladin` | `'melee'` | `[51, 40, 41, 42, 27, 1, 5, 17, 26, 50]` | `chivalry`, `swords`, `macing`, `fencing`, `tactics`, `anatomy`, `parry`, `healing`, `magicResist` (`30`), `focus` | `malha`, `maceShield`, `bandages`, `potionsMelee`, `robeCloak` |
| `assassin` | `'melee'` | `[42, 27, 30, 21, 17, 26, 50]` | `fencing`, `tactics`, `poisoning`, `hiding`, `healing`, `magicResist` (`30`), `focus` | `leather`, `kryss`, `poison`, `bandages`, `potionsMelee`, `robeCloak` |
| `ninja` | `'melee'` | `[53, 42, 21, 47, 17, 26, 50]` | `ninjitsu` (`53`), `fencing` (`42`), `hiding` (`21`), `stealth` (`47`), `healing` (`17`), `magicResist` (`26`, `30`), `focus` (`50`) | `ninjaSet`, `kryss`, `bandages`, `potionsMelee`, `robeCloak` |
| `monk` | `'melee'` | `[43, 27, 1, 17, 26, 50]` | `wrestling`, `tactics`, `anatomy`, `healing`, `magicResist` (`30`), `focus` | `cloth`, `quarterStaff`, `bandages`, `potionsMelee`, `robeCloak` |
| `samurai` | `'melee'` | `[52, 40, 27, 1, 17, 26, 50]` | `bushido` (`52`), `swords` (`40`), `tactics` (`27`), `anatomy` (`1`), `healing` (`17`), `magicResist` (`26`, `30`), `focus` (`50`) | `samuraiSet`, `katana`, `bandages`, `potionsMelee`, `robeCloak` |
| `ranger` | `'ranged'` | `[31, 27, 1, 4, 17, 26, 50]` | `archery`, `tactics`, `anatomy`, `armsLore`, `healing`, `magicResist` (`30`), `focus` | `studded`, `bowArrows`, `crossbowBolts`, `bandages`, `potionsMelee`, `robeCloak` |
| `mage` | `'magic'` | `[25, 16, 46, 41, 27, 1, 26, 50]` | `magery`, `evalInt`, `meditation`, `macing`, `tactics`, `anatomy`, `magicResist` (`30`), `focus` | `leather`, `casterStaff`, `reagents300`, `potionsCaster`, `robeCloak` |
| `necromancer` | `'magic'` | `[49, 32, 46, 41, 27, 1, 26, 50]` | `necromancy`, `spiritSpeak`, `meditation`, `macing`, `tactics`, `anatomy`, `magicResist` (`30`), `focus` | `leather`, `casterStaff`, `necroPathReagents`, `healArrowReagents`, `potionsCaster`, `robeCloak` |
| `mystic` | `'magic'` | `[55, 25, 46, 41, 27, 1, 26, 50]` | `mysticism`, `magery`, `meditation`, `macing`, `tactics`, `anatomy`, `magicResist` (`30`), `focus` | `leather`, `casterStaff`, `reagents300`, `potionsCaster`, `robeCloak` |
| `spellweaver` | `'magic'` | `[54, 46, 41, 27, 1, 26, 50]` | `spellweaving`, `meditation`, `macing`, `tactics`, `anatomy`, `magicResist` (`30`), `focus` | `leather`, `casterStaff`, `spellweaverReagents`, `potionsCaster`, `robeCloak` |
| `bard` | `'support'` | `[29, 15, 9, 22, 17, 26, 50]` | `musicianship`, `discordance`, `peacemaking`, `provocation`, `healing`, `magicResist` (`30`), `focus` | `leather`, `kryss`, `harp`, `bandages`, `potionsMelee`, `robeCloak` |
| `tamer` | `'support'` | `[35, 2, 39, 42, 17, 26, 50]` | `animalTaming`, `animalLore`, `veterinary`, `fencing`, `healing`, `magicResist` (`30`), `focus` | `leather`, `crook`, `bandages`, `potionsMelee`, `robeCloak` |
| `worker` | `'support'` | `[45, 44, 7, 37, 26, 50]` | `mining`, `lumberjacking`, `blacksmith`, `tinkering`, `magicResist` (`30`), `focus` | `cloth`, `pickaxeHatchet`, `smithHammer`, `potionsMelee`, `robeCloak` |

## Linear Class Ability Unlock Tables (`gE`, L1–60, **C6–C12**)

In Progression V3 (`_raw/wiki/changelog-server-dev.md:35-43`), abilities unlock automatically by character level from `gE` without spending Skill, Status, or Attribute points:

| Level | `warrior` (10) | `berserker` (13) | `paladin` (13) | `ranger` (13) | `mage` (14) | `necromancer` (11) | `spellweaver` (11) |
|---|---|---|---|---|---|---|---|
| **L1** | `warrior_slash` | `berserker_cleave` | `paladin_close_wounds` | `ranger_arrow` | `mage_heal`, `mage_cure`, `mage_magic_arrow` | `necro_magery_heal`, `necro_magery_cure`, `mage_magic_arrow` | `sw_magery_heal`, `mage_cure`, `mage_magic_arrow` |
| **L5** | `warrior_provoke` | `warrior_heavy_strike` | `warrior_heavy_strike` | `ranger_rapid_shot` | `mage_harm` | — | — |
| **L10** | `warrior_shield_bash` | `warrior_double_strike` | `paladin_consecrate` | `ranger_aimed_shot` | `mage_fireball` | — | — |
| **L15** | `warrior_armor_break` | `warrior_whirlwind` | `warrior_shield_bash` | `ranger_force_arrow` | `mage_lightning` | — | — |
| **L20** | `warrior_heavy_strike` | `warrior_bleed` | `paladin_divine_fury` | `ranger_piercing` | — | — | — |
| **L25** | `warrior_whirlwind` | `warrior_armor_break` | `warrior_brace` | `ranger_serpent_arrow` | `mage_magic_reflect` | `mage_magic_reflect` | `mage_magic_reflect` |
| **L30** | `warrior_brace` | `berserker_frenzy` | `paladin_holy_light` | `ranger_moving_shot` | `mage_energy_bolt` | `necro_pain_spike` | `sw_magery_gh` |
| **L35** | — | `berserker_bloodrage` | `warrior_disarm` | `ranger_lightning_arrow` | `mage_explosion` | `necro_blood_oath` | `cleric_bless` |
| **L40** | `warrior_disarm` | `duelist_mortal` | `warrior_bulwark` | `ranger_multishot` | `mage_chain_lightning` | `necro_wither` | `cleric_arch_protection` |
| **L45** | — | `warrior_crushing_blow` | `paladin_noble` | `ranger_armor_pierce` | `mage_flamestrike` | `necro_lich_form` | `sw_renewal` |
| **L50** | `warrior_bulwark` | `duelist_armor_ignore` | `warrior_whirlwind` | `ranger_charged_shot` | `mage_fire_elemental` | `necro_animate_dead` | `mage_nature_fury` |
| **L55** | — | `warrior_execution` | `warrior_crushing_blow` | `ranger_deadeye` | `mage_air_elemental` | `necro_strangle` | `sw_thunderstorm` |
| **L60** | `warrior_execution` | `berserker_berserk` | `warrior_execution` | `ranger_bolt_volley` | `mage_meteor` | `necro_poison_strike` | `sw_wildfire` |

### Missing `gE.samurai` and `gE.ninja` Unlock Tables

Although `samurai` and `ninja` are fully defined in `classes-config.js:5-72` (`ninja: 112`, `samurai: 114`), `dx` (**C3**), `hE` (**C4**), `mx` (**C13**), `gh` starter hotbars (`[[tick-and-cooldowns]] C12`), and `abilities-catalog.json` (`[[status-effects]] C9`..`[[status-effects]] C16`), **`gE` (`raw L113-L213`) currently contains only the seven classes above and omits `gE.samurai` and `gE.ninja`**. Adding `gE.samurai` and `gE.ninja` L1–60 milestone arrays is a primary client-side requirement for Phase 5.

## The `[Arvore` Progression Tree (`Rm`, `Rs`, `FI`, `HI`)

In `_raw/bundle/progression-tree-ui.js:5-97, 369-389` and `_raw/bundle/i18n-en-abilities.js:2616`:

- **Protocol Synchronization (`Rm(e, a)`):** Sends `[Arvore` on mount and listens for `#ARVORE` speech packets containing `{ c, s, l, pts, resetPrice, resetCredits, canReset, own, nodes, balances, skills, status, attributes }`.
- **Per-Level Point Grants (`progression-tree-ui.js:369-389`):** Every character level grants three independent point balances:
  1. **Skill Points (`+5` per level):** Purchased via `[Arvore skill <id>`. Each purchase raises the target skill by `+1`. Point cost scales by skill bracket (`i18n-en-abilities.js:2616`):
     - Below `70`: **`1` point** per `+1` skill
     - `70–79`: **`2` points** per `+1` skill
     - `80–89`: **`3` points** per `+1` skill
     - `90+`: **`5` or more points** per `+1` skill
  2. **Status Points (`+5` per level):** Purchased via `[Arvore status <id>`, shared across Strength (`str`), Dexterity (`dex`), and Intelligence (`int`).
  3. **Attribute Points (`+1` per level):** Purchased via `[Arvore attribute <id>` for direct combat bonuses (`HI = { hits: 5, mana: 5, stam: 5 }` per purchase up to `+100`; other attributes gain `+1` per purchase up to their respective caps in `[[damage-and-defense]]`).
- **Legacy 9 Subclass Columns (`Rs` & `FI`, `progression-tree-ui.js:5-26`):** Maps column IDs `1..9` to `paladin` (`paladin_close_wounds`), `berserker` (`berserker_frenzy`), `duelist` (`duelist_armor_ignore`), `bow` (`ranger_moving_shot`), `crossbow` (`ranger_bolt_volley`), `pyromancer` (`mage_flamestrike`), `stormcaller` (`mage_chain_lightning`), `necromancer` (`necro_strangle`), and `cleric` (`cleric_arch_protection`).
- **Tree Reset Cost (`resetPrice`):** Default reset price is **`300` UOCoin** (`Number(c.resetPrice) || 300` at `progression-tree-ui.js:78`), executed via `[Arvore buyreset` and `[Arvore reset`.

## Experience Curve & Level Scaling Cross-Links

- **Level 1 Start & XP Curve (`_raw/wiki/changelog-server-dev.md:29-43`):** Characters start at Level `1` with initial abilities and lesser potions unlocked; the first XP step is `200` XP, remaining smooth up to Level `40`, multiplying by `~×1.5` per `10` levels from `40` to `100`, and growing by `+0.6%` per level past Level `100` (with `XpPorDegrau = 0.05` on Inferno difficulty).
- **Level Power Scaling & Class Resource Caps:** See `[[resources]] C1` (`casters ×80`, `physical ×60`), `[[resources]] C15` (Warrior 0-mana abilities), and `[[resources]] C16` (Warrior 0 Meditation cap).
