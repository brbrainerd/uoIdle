---
id: "equipment-affixes"
title: "Equipment Slots, Item Affixes, Material Tiers, and Monster Scaling"
category: "items-equipment"
aliases: ["affixes", "paperdoll", "rarities", "materials", "personagembonus", "bestiary", "paragon"]
status: "bundle-stated"
sources: ["_raw/bundle/character-bonus-and-status.js", "_raw/bundle/paperdoll-and-items.js", "_raw/bundle/bestiary-and-wiki.js", "_raw/bundle/i18n-en-abilities.js", "_raw/wiki/changelog-server-dev.md"]
evidence: ["bundle: _raw/bundle/paperdoll-and-items.js:316-322", "bundle: _raw/bundle/paperdoll-and-items.js:1190-1245", "bundle: _raw/bundle/bestiary-and-wiki.js:91-103", "bundle: _raw/bundle/bestiary-and-wiki.js:809-847", "bundle: _raw/bundle/i18n-en-abilities.js:2616", "wiki: _raw/wiki/changelog-server-dev.md:58-60"]
code_refs: ["character-bonus-and-status.js:vh", "character-bonus-and-status.js:eI", "character-bonus-and-status.js:Bx", "paperdoll-and-items.js:$A", "paperdoll-and-items.js:TE", "bestiary-and-wiki.js:kO", "bestiary-and-wiki.js:MO", "bestiary-and-wiki.js:sk"]
updated: "2026-11-07"
---
# Equipment Slots, Item Affixes, Material Tiers, and Monster Scaling

Source: [raw](../_raw/bundle/character-bonus-and-status.js)

## Summary

UO Idle aggregates character attributes, elemental resistances, item affixes, progression tree bonuses, and skill values through a periodic speech-protocol status poller. Primary attributes unpack into base, equipment, and external bonus tuples, while the fifty-eight Ultima Online skills are partitioned into combat, magic, crafting, and miscellaneous UI groups. Items equip across ClassicUO paperdoll layers, display one of five rarity tiers encoded by Ultima Online item hues, and roll from twenty-one item affix keys that stack with thirteen progression tree bonus keys. On the authoritative server, weapons and armor progress through level-gated metal, wood, and leather material tiers with per-tier durability, resistance, and weapon damage multipliers and a max-durability repair penalty, while dungeon monsters span fourteen bestiary families with Paragon spawn variants and permanent account-wide experience bonuses.

## Claims

- **C1** [bundle-stated] "const wo = (e) => (typeof e == 'number' ? e : Number(e) || 0), vh = (e) => { const a = Array.isArray(e) ? e.map(wo) : []; return { base: a[0] ?? 0, itens: a[1] ?? 0, outros: a[2] ?? 0 }; };" (raw L5-L9)
- **C2** [bundle-stated] "return e.subscribeSpeech((r) => { const i = it(r); if (!i || i.assunto !== 'PERSONAGEMBONUS') return; const c = i.dado, l = c.atrib ?? {}; o({ atrib: { str: vh(l.str), dex: vh(l.dex), int: vh(l.int) }," (raw L18-L25)
- **C3** [bundle-stated] "resist: Array.isArray(c.resist) ? c.resist.map((m) => ({ t: String(m.t ?? ''), v: wo(m.v), itens: wo(m.itens), max: wo(m.max), })) : []," (raw L25-L32)
- **C4** [bundle-stated] "bonus: Array.isArray(c.bonus) ? c.bonus.map((m) => ({ id: String(m.id ?? ''), v: wo(m.v) })) : [], arvore: Array.isArray(c.arvore) ? c.arvore.map((m) => ({ id: String(m.id ?? ''), v: wo(m.v) })) : [], skills: Array.isArray(c.skills) ? c.skills.map((m) => ({ id: wo(m.id), v: wo(m.v) })) : [], });" (raw L33-L42)
- **C5** [bundle-stated] "d.useEffect(() => { if (!a || !n) return; e.say('[personagembonus'); const r = setInterval(() => e.say('[personagembonus'), 5e3); return () => clearInterval(r); }, [e, a, n])," (raw L45-L50)
- **C6** [bundle-stated] "const Bx = { combat: { icon: 'swords', keys: [ 'swords', 'macing', 'fencing', 'archery', 'wrestling', 'tactics', 'parry', 'anatomy', 'healing', 'focus', 'bushido', 'ninjitsu', 'chivalry', 'throwing', ], }," (raw L54-L73)
- **C7** [bundle-stated] "magic: { icon: 'mana', keys: [ 'magery', 'evalInt', 'meditation', 'magicResist', 'necromancy', 'spiritSpeak', 'spellweaving', 'mysticism', 'imbuing', ], }," (raw L74-L87)
- **C8** [bundle-stated] "craft: { icon: 'wrench', keys: [ 'mining', 'lumberjacking', 'blacksmith', 'carpentry', 'tailoring', 'tinkering', 'fletching', 'alchemy', 'cooking', 'cartography', 'inscribe', 'fishing', ], }," (raw L88-L104)
- **C9** [bundle-stated] "misc: { icon: 'paw', keys: [ 'animalTaming', 'animalLore', 'veterinary', 'herding', 'tracking', 'hiding', 'stealth', 'stealing', 'snooping', 'lockpicking', 'removeTrap', 'poisoning', 'detectHidden', 'camping', 'begging', 'forensics', 'itemId', 'armsLore', 'tasteId', 'musicianship', 'peacemaking', 'discordance', 'provocation', ], }, };" (raw L105-L133)
- **C10** [bundle-stated] "function cb(e, a) { return a <= 0 ? 0 : Math.min(100, Math.max(0, Math.round((e / a) * 1e3) / 10)); } function uN(e, a) { return a <= 0 && e <= 0 ? '—' : `${e} / ${a}`; }" (raw L134-L139)

## Character Bonus Polling (`[personagembonus` / `eI`, **C1–C5**)

When the character status sheet is open (`a && n`), `eI(e, a, n)` issues `e.say('[personagembonus')` immediately and polls every `5000 ms` (`5e3`, **C5**), listening for `#PERSONAGEMBONUS` speech packets (**C2–C4**):

- **`atrib` (`str`, `dex`, `int`):** Each primary stat arrives as a 3-element array unpacked by `vh(e)` (**C1**) into `{ base, itens, outros }`.
- **`resist` (`fisica`, `fogo`, `frio`, `veneno`, `energia`):** Array of `{ t, v, itens, max }` (**C3**), where `v` is the effective resistance, `itens` is the total contributed by equipped gear, and `max` is the resistance cap.
- **`bonus` (Item Affixes):** Array of `{ id, v }` (**C4**) rendered against the twenty-one `bonusItem` definitions.
- **`arvore` (Progression Tree Bonuses):** Array of `{ id, v }` (**C4**) rendered against the thirteen `arvoreBonus` definitions.
- **`skills` (Trained Skills):** Array of `{ id, v }` (**C4**) indexed by 0–57 skill ID (`[[progression-unlocks]] C1`) and grouped into `Bx.combat` (14 skills, **C6**), `Bx.magic` (9 skills, **C7**), `Bx.craft` (12 skills, **C8**), and `Bx.misc` (23 skills, **C9**).

## Complete Item Affix (`bonusItem`) & Tree Bonus (`arvoreBonus`) Catalog

Defined in `_raw/bundle/i18n-en-abilities.js:2616`, the twenty-one `bonusItem` affix keys and thirteen `arvoreBonus` keys map as follows:

| Item Affix Key (`bonusItem`) | UI Format Template | Corresponding Tree Key (`arvoreBonus`) | Hard Cap / Notes (`[[damage-and-defense]]`) |
|---|---|---|---|
| `RegenHits` | `Hit point regeneration +{{v}}` | — | Passive HP regen tick bonus |
| `RegenStam` | `Stamina regeneration +{{v}}` | — | Passive Stamina regen tick bonus |
| `RegenMana` | `Mana regeneration +{{v}}` | — | Passive Mana regen tick bonus |
| `DefendChance` | `Defense chance +{{v}}%` | `Defense` (`Defense +{{v}}%`) | Cap **`+45%`** |
| `AttackChance` | `Hit chance +{{v}}%` | `HitChance` (`Hit chance +{{v}}%`) | Cap **`+45%`** |
| `BonusHits` | `Hit points +{{v}}` | `Hits` (`Hits +{{v}}`) | Tree cap **`+100`** (`+5` per purchase) |
| `BonusStam` | `Stamina +{{v}}` | — (`stam` in tree entries) | Tree cap **`+100`** (`+5` per purchase) |
| `BonusMana` | `Mana +{{v}}` | `Mana` (`Mana +{{v}}`) | Tree cap **`+100`** (`+5` per purchase) |
| `WeaponDamage` | `Damage +{{v}}%` | `Damage` (`Damage +{{v}}%`) | Cap **`+100%`** |
| `WeaponSpeed` | `Swing speed +{{v}}%` | `Speed` (`Speed +{{v}}%`) | Gear cap **`60%`**; tree `Speed` exceeds gear cap |
| `SpellDamage` | `Spell damage +{{v}}%` | `SpellDamage` (`Spell damage +{{v}}%`) | Cap **`+50%`** |
| `CastRecovery` | `Faster cast recovery +{{v}}` | `Recovery` (`Recovery +{{v}}`) | Cap **`+6`** |
| `CastSpeed` | `Faster casting +{{v}}` | `Cast` (`Cast +{{v}}`) | Cap **`+2`** |
| `LowerManaCost` | `Lower mana cost {{v}}%` | `LowerMana` (`Lower mana cost +{{v}}%`) | Cap **`+40%`** (`[[resources]]`) |
| `LowerRegCost` | `Lower reagent cost {{v}}%` | — | Reduces spell reagent consumption |
| `ReflectPhysical` | `Reflect physical damage {{v}}%` | — | Reflects physical damage back to attacker |
| `EnhancePotions` | `Enhance potions {{v}}%` | — | Increases potion effectiveness |
| `Luck` | `Luck +{{v}}` | — | Improves loot roll quality |
| `SpellChanneling` | `Spell channeling` | — | Cast spells without unequipping weapon/shield |
| `NightSight` | `Night sight` | — | Permanent light level bonus |
| `IncreasedKarmaLoss` | `Increased karma loss {{v}}%` | — | Legacy UO affix |
| — | — | `Str`, `Dex`, `Int` | Primary status points from `[Arvore` |

## Paperdoll Equipment Layers (`O`, `TE`) & Item Rarity Hues (`$A`)

In `_raw/bundle/paperdoll-and-items.js:1190-1245`, ClassicUO equipment layers `O` map to slot identifiers `TE`:
- **Weapons & Offhand:** `OneHanded (1)` (`oneHanded`), `TwoHanded (2)` (`twoHanded`), `Talisman (9)` (`talisman`)
- **Armor & Apparel:** `Shoes (3)`, `Pants (4)`, `Shirt (5)`, `Helm (6)`, `Gloves (7)`, `Waist (12)`, `InnerTorso (13)`, `MiddleTorso (17)`, `Arms (19)`, `Cloak (20)`, `OuterTorso (22)`, `OuterLegs (23)`, `InnerLegs (24)`
- **Jewelry:** `Ring (8)`, `Necklace (10)`, `Bracelet (14)`, `Earrings (18)`
- **Storage & Character Layers:** `Hair (11)`, `Face (15)`, `Beard (16)`, `Backpack (21)`, `Mount (25)`, `Bank (29)`

### Five Item & Chest Rarity Hues (`$A`, `_raw/bundle/paperdoll-and-items.js:316-322`)

Both dropped equipment and boss/dungeon reward chests (`graphic: 3709`) encode their five rarity tiers via Ultima Online 14-bit hue (`hue & 16383`):

| UO Hue (`$A` Key) | Internal Rarity Key | English Tier | Chest Icon Asset |
|---|---|---|---|
| `1153` | `'comum'` | Common | `/ui/baus/bau-comum.png` |
| `1272` | `'incomum'` | Uncommon | `/ui/baus/bau-incomum.png` |
| `1266` | `'raro'` | Rare | `/ui/baus/bau-raro.png` |
| `1289` | `'epico'` | Epic | `/ui/baus/bau-epico.png` |
| `1281` | `'lendario'` | Legendary | `/ui/baus/bau-lendario.png` |

## Material Tier Ladder & Repair Economy

Server equipment progression rules are anchored in `[[resources]] C2` and `[[resources]] C3` (`_raw/wiki/changelog-server-dev.md:58-60`):
- **Material Level Gates (`[[resources]] C2`):**
  - **Metals (Blacksmithing / Mining):** Unlocked at even tens—Levels **`1`, `20`, `40`, `60`, `80`**, and **Avarite at Level `100`**.
  - **Leathers (Tailoring):** Unlocked at Levels **`1`, `20`, `40`, and `80`**.
  - **Base Material Purchase:** Tier 1 base material gear can be purchased from town NPCs for gold alone.
- **Per-Tier Scaling Multipliers (`[[resources]] C2`):**
  - **Armor:** **`+12%` durability and `+12%` resistance** per material step.
  - **Weapons:** **`+8%` weapon damage** per material step.
- **Repair Cost & Max Durability Penalty (`[[resources]] C3`):** Repairing weapons and armor at the Blacksmith (`Ferreiro`), Carpenter/Tinker (`Artesão`), or Tailor (`Alfaiate`) via `[IdleShopRepair` costs **`40%` of the item's price**, and **each repair permanently reduces the item's maximum durability by `10%`**.

## Bestiary Families (`sk`), Paragon Spawns & Account XP Scaling

In `_raw/bundle/bestiary-and-wiki.js:808-847`, monsters are categorized into two variants (`uq = ['comum', 'paragon']`) and fourteen monster families (`sk`):
1. `ratos` (`rat`, `giantrat`, `alligator`)
2. `ratmen` (`ratman`, `ratmanarcher`, `ratmanmage`)
3. `mortosVivos` (`skeleton`, `zombie`, `boneknight`, `ghoul`, `bonemagi`, `mummy`, `wraith`, `spectre`, `lich`, `lichlord`)
4. `orcs` (`orc`, `orccaptain`, `orcishmage`, `orcbrute`)
5. `aracnideos` (`giantspider`, `scorpion`, `frostspider`, `dreadspider`)
6. `terathans` (`terathandrone`, `terathanwarrior`, `terathanavenger`)
7. `gigantes` (`troll`, `ogre`, `frosttroll`, `cyclops`)
8. `gargulas` (`gargoyle`, `stonegargoyle`, `firegargoyle`)
9. `reptilianos` (`lizardman`, `ophidianwarrior`, `ophidianmage`, `ophidianmatriarch`)
10. `elementais` (`airelemental`, `earthelemental`, `fireelemental`, `waterelemental`, `sandvortex`)
11. `minotauros` (`minotaur`, `minotaurscout`, `minotaurcaptain`)
12. `yomotsu` (`yomotsuwarrior`, `yomotsupriest`, `yomotsuelder`)
13. `dragoes` (`wyvern`, `drake`, `dragon`, `skeletaldragon`, `serpentinedragon`, `ancientwyrm`)
14. `demonios` (`daemon`, `icefiend`, `chaosdaemon`, `balron`)

- **Paragon Spawn Rate (`[[resources]] C9`):** Paragon variants spawn with a **`0.1%` chance** across all difficulty levels (increased from `0.01%`), with golden hue and elevated HP, damage, gold, and XP rewards.
- **Bestiary Kill Milestones (`[[resources]] C18`):** Every common monster tracks **5 kill milestones (`500` to `10,000` kills)** via `[bestiario` / `#BESTANIVEL`, granting **`+0.2%` permanent account-wide XP bonus per milestone** (up to `+1.0%` per monster species).
