---
id: "engine-capability-matrix"
title: "Engine Capability Matrix: Client, Shared Config, and Server Authority"
category: "engine-ui"
aliases: ["capability-matrix", "mode-a", "mode-b", "protocol", "client-server-authority"]
status: "verified"
sources: ["_raw/api/protocol-commands-index.json", "_raw/bundle/abilities-catalog.json", "_raw/bundle/classes-config.js", "_raw/wiki/changelog-server-dev.md"]
evidence: ["live: _evidence/live-bundle-probe.txt L1-L20", "bundle: _raw/bundle/abilities-catalog.json:1-1761", "bundle: _raw/bundle/classes-config.js:1-246", "wiki: _raw/wiki/changelog-server-dev.md:1-1201"]
code_refs: ["protocol-commands-index.json:serverAssuntos", "protocol-commands-index.json:clientSpeechCommands", "Jogo-D5xEfvfV.js:Fc", "Jogo-D5xEfvfV.js:Eq", "Jogo-D5xEfvfV.js:gE"]
updated: "2026-11-07"
---
# Engine Capability Matrix: Client, Shared Config, and Server Authority

Source: [raw](../_raw/api/protocol-commands-index.json)

## Summary

UO Idle operates across a three-tier runtime architecture consisting of Client-Evaluated React and ClassicUO bundle logic, Shared-Config JSON catalogs and an ASCII bracket speech protocol, and Server-Authoritative ModernUO combat and progression resolution. The browser client loads the ability catalog, evaluates fallback damage and healing tooltips, enforces local hotbar trigger condition editors, and renders progression unlock tables, while communicating with the shard through bracketed speech commands and JSON-framed server subjects. All actual hit rolls, damage and healing math, cooldown floors, status effect ticks, aggro transitions, and progression point ledgers execute authoritatively on the ModernUO shard. This separation defines the Phase Five implementation boundary for Samurai and Ninja between Mode A—which requires zero server code changes by composing existing ability dispatch kinds, opcodes, and client unlock tables—and Mode B, which isolates stateful Bushido Perfection/Parry counters and Ninjitsu Mirror Image/Death Strike mechanics into minimal native shard hooks.

## Claims

- **C1** [verified] "Live surface probe of https://uoidle.com/beta confirms bundle_version 0.99.0 with entry bundle index-CCYN0Dy6.js, game chunk Jogo-D5xEfvfV.js, and paperdoll chunk bonecoVivo-DY66RLNm.js" (evidence 1)
- **C2** [verified] "Live runtime probe confirms remote catalog https://cdn.uoidle.com/packs/idle/abilities.json?v=0.99.0 (sha256 17f9ce60a11b29d0a75ffc6738503a54b67f18f40a6522c42d2e14bbe14f8a36) and closed-beta API https://api.uoidle.com/closed-beta" (evidence 1)
- **C3** [verified] ""bundleVersion": "0.99.0", "sources": [ "https://uoidle.com/assets/Jogo-D5xEfvfV.js", "https://uoidle.com/assets/index-CCYN0Dy6.js" ], "serverAssuntoCount": 126, "clientCommandCount": 197," (raw L2-L8)
- **C4** [verified] ""BESTA": ["Jogo-D5xEfvfV.js:L29335"], "BESTAINFO": ["Jogo-D5xEfvfV.js:L29328"], "BESTANIVEL": ["Jogo-D5xEfvfV.js:L29351"]," (raw L15-L17)
- **C5** [verified] ""BOT": ["Jogo-D5xEfvfV.js:L31588"]," (raw L24-L24)
- **C6** [verified] ""ENERGIA": ["Jogo-D5xEfvfV.js:L50826"], "ENERGIAAVISO": ["Jogo-D5xEfvfV.js:L50848"]," (raw L48-L49)
- **C7** [verified] ""HABINFO": ["Jogo-D5xEfvfV.js:L55450"], "HEAD": ["index-CCYN0Dy6.js:L7061", "index-CCYN0Dy6.js:L10302"], "HTML": ["index-CCYN0Dy6.js:L7062", "index-CCYN0Dy6.js:L10301"], "HUNTASK": ["Jogo-D5xEfvfV.js:L31592"]," (raw L93-L96)
- **C8** [verified] ""MONSTRO": ["Jogo-D5xEfvfV.js:L31591", "Jogo-D5xEfvfV.js:L31650"]," (raw L123-L123)
- **C9** [verified] ""NIVEL": ["Jogo-D5xEfvfV.js:L31590", "Jogo-D5xEfvfV.js:L31647"]," (raw L142-L142)
- **C10** [verified] ""PERSONAGEMBONUS": ["Jogo-D5xEfvfV.js:L13309"], "PLACAR": ["Jogo-D5xEfvfV.js:L31589"]," (raw L153-L154)
- **C11** [verified] ""SLOTBLOCK": ["Jogo-D5xEfvfV.js:L57312"]," (raw L166-L166)
- **C12** [verified] ""SUPPLY": ["Jogo-D5xEfvfV.js:L55446"]," (raw L172-L172)
- **C13** [verified] ""[Arvore": [ "Jogo-D5xEfvfV.js:L17315", "Jogo-D5xEfvfV.js:L17333", "Jogo-D5xEfvfV.js:L17390", "Jogo-D5xEfvfV.js:L17395", "Jogo-D5xEfvfV.js:L17402", "Jogo-D5xEfvfV.js:L17406" ]," (raw L193-L200)
- **C14** [verified] ""[IdleAbility": ["Jogo-D5xEfvfV.js:L61956"], "[IdleBot": ["Jogo-D5xEfvfV.js:L32117"], "[IdleClassAdmin": ["Jogo-D5xEfvfV.js:L58004"], "[IdleComercio": ["Jogo-D5xEfvfV.js:L60678"], "[IdleHotbar": ["Jogo-D5xEfvfV.js:L61957"], "[IdleLvl": ["Jogo-D5xEfvfV.js:L58068", "Jogo-D5xEfvfV.js:L58075"]," (raw L207-L212)
- **C15** [verified] ""[habinfo": ["Jogo-D5xEfvfV.js:L55457"], "[horsebag": ["Jogo-D5xEfvfV.js:L60493"], "[hunback": ["Jogo-D5xEfvfV.js:L28547", "Jogo-D5xEfvfV.js:L28548"], "[hunt": ["Jogo-D5xEfvfV.js:L28544"], "[huntalvo": ["Jogo-D5xEfvfV.js:L32108"], "[huntbot": ["Jogo-D5xEfvfV.js:L32125", "Jogo-D5xEfvfV.js:L32148"], "[huntcheck": ["Jogo-D5xEfvfV.js:L28557", "Jogo-D5xEfvfV.js:L28558"], "[huntdiff": ["Jogo-D5xEfvfV.js:L31667"], "[huntdist": ["Jogo-D5xEfvfV.js:L32114"], "[huntinfo": ["Jogo-D5xEfvfV.js:L31636"], "[huntloot": ["Jogo-D5xEfvfV.js:L31692"], "[huntpostura": ["Jogo-D5xEfvfV.js:L32111"]," (raw L309-L320)
- **C16** [verified] ""[personagembonus": ["Jogo-D5xEfvfV.js:L13336", "Jogo-D5xEfvfV.js:L13337"]," (raw L390-L390)
- **C17** [verified] ""[supply": ["Jogo-D5xEfvfV.js:L55458"]," (raw L406-L406)

## Three-Tier Architectural Capability Matrix

The live `v0.99.0` protocol registry (**C1**, **C2**, **C3**) spans `197` client bracket commands (`[cmd`) and `126` server speech subjects (`#ASSUNTO`). Every core combat, resource, progression, and equipment primitive is partitioned across three tiers:

| Subsystem / Primitive | Tier 1: Client-Evaluated (`index-CCYN0Dy6.js` / `Jogo-D5xEfvfV.js`) | Tier 2: Shared-Config (`abilities-catalog.json` / `[cmd` $\rightarrow$ `#ASSUNTO`) | Tier 3: Server-Authoritative (ModernUO Shard + Custom Idle C# Loop) | Cross-Page KB Verification |
|---|---|---|---|---|
| **Auto-Attack & Passive Slot** | `Uw` and `Yw` filter out `kind === 'Passive'`; `Sg` displays `hotbar.autoAttackCd` for `warrior_slash`, `ranger_arrow`, and `monk_palm` | `kind: "Passive"`, `unlock: 1`, `mana: 0` in `abilities-catalog.json`; excluded from `#HABINFO` | Executes continuous weapon swings on the server swing timer scaled by `DEX`, `Stamina`, gear `WeaponSpeed` (cap `60%`), and tree `Speed` | `[[tick-and-cooldowns]] C3`, `[[tick-and-cooldowns]] C8`, `[[damage-and-defense]] C2`, `[[status-effects]] C1`, `[[status-effects]] C16`, `[[resources]] C14` |
| **12-Slot Hotbar & Trigger Condition Engine** | `Gn = 12` slots (`Mo = 0` pinned) stored in `uo-idle-hotbar-v6:<key>`; `ro(e)` seeds default predicates (`jo`, `hu`, `hh`, `Td`, `HE`, `fu`, `fh`, `zE`); `rk(e)` validates target selectors | Synchronized via `[IdleHotbar <json>` (**C14**) and manual trigger `[IdleAbility <id>` (**C14**); server broadcasts `#BOT` (**C5**) and `#SLOTBLOCK` (**C11**) | Server bot evaluates slots `1..12` in order; skips slots missing potions, bandages, reagents, or mana without stalling combat; falls back to catalog base rule when conditions are empty | `[[tick-and-cooldowns]] C4`, `[[tick-and-cooldowns]] C6`, `[[tick-and-cooldowns]] C7`, `[[tick-and-cooldowns]] C9`, `[[damage-and-defense]] C12`, `[[resources]] C8` |
| **Cooldown Enforcement & `#HABINFO` Override** | `pq` polls `[habinfo` (**C15**) and renders radial cooldown overlay (`coolRatio > 0.01`); `fj` computes per-hit, multi-hit (`golpes`), AoE (`area`), and DPS (`i / e.cd`) | Client sends `[habinfo` (**C15**); server replies with `#HABINFO` (**C7**) containing `{ id, dmin, dmax, cmin, cmax, golpes, area, cd, mana, reags }` | Server enforces real potion cooldowns (not `400 ms`), enforces a **2-second minimum cooldown floor** on `Custom` abilities without declared CD, and runs difficulty-stepped spawn timers (`50s` down to `20s`) | `[[tick-and-cooldowns]] C2`, `[[damage-and-defense]] C1`, `[[resources]] C6`, `[[resources]] C8`, `[[resources]] C14` |
| **Physical & Elemental Damage / Healing Resolution** | `Eq` dispatches fallback estimators `jq` (potions), `wq` (bandage), `Nq`/`Sq` (Magery heals), `kq` (`close_wounds`), `Cq` (Tactics physical), and `Aq`/`Mq` (Magery + EvalInt spells) | Bot attack postures set via `[huntpostura` (**C15**); live combat telemetry broadcast via `#HABINFO` (**C7**) and `#PLACAR` (**C10**) | Server scales level power (`casters ×80`, `physical ×60`, heals exempt), resolves heal/mana potions (`15%/25%/35%`) and Magery heals (`15%/35%`) as % of max pool, applies posture multipliers (`+20%/+40%` or `-40%/-20%`), and enforces attribute/resistance caps in `AOS.Damage` | `[[damage-and-defense]] C3`, `[[damage-and-defense]] C8`, `[[damage-and-defense]] C10`, `[[damage-and-defense]] C11`, `[[resources]] C1`, `[[resources]] C10`, `[[resources]] C11` |
| **Resource Pools, Costs, Reagents & Hunting Energy** | `ok` maps `17` reagent graphics and `bj` checks local reagent counts; HUD displays energy warnings | Client polls `[supply` (**C17**) $\rightarrow$ `#SUPPLY` (**C12**) and `[energia` / `[energiacomprar` $\rightarrow$ `#ENERGIA` / `#ENERGIAAVISO` (**C6**) | Server enforces Warrior `0`-mana abilities and `0` Meditation cap, Paladin `1 gp/pt` Chivalry tithe, Spellweaving reagent consumption, full vital refill on dungeon exit, `12 h` passive energy recovery, same-tick zero-energy hunt termination, and `10 gp × level × missingMin × refillIndex` gold refills | `[[resources]] C4`, `[[resources]] C5`, `[[resources]] C7`, `[[resources]] C12`, `[[resources]] C13`, `[[resources]] C15`, `[[resources]] C16`, `[[resources]] C20`, `[[resources]] C21`, `[[resources]] C22` |
| **Status Effects & Ability Dispatch Kinds** | `Uw` filters `OE` deferred items and locked abilities; Bestiary UI maps `CO` resistances and `MO` special blows | `134` catalog entries across `ItemUse`, `Passive`, `WeaponAbility` (`ref: 1..22`), `Spell` (`ref: 3..690`), `SpecialMove` (`ref: 400..507`), and `Custom` (`map: "New" \| "Idle" \| "New/Eth"`) | ModernUO executes native `WeaponAbility`, `Spell`, and `SpecialMove` handlers plus custom C# handlers; applies `Brace` and `Armor Break` once inside `AOS.Damage`; despawns `90s` summons on hunt exit | `[[status-effects]] C2`, `[[status-effects]] C5`, `[[status-effects]] C9`, `[[status-effects]] C13`, `[[resources]] C17`, `[[resources]] C19` |
| **Character Progression, `jc` 58 Skills, `gE` Unlock Tables & `[Arvore` Tree** | `jc` (`58` skills), `dx` (`16` class roles), `hE` (`uE=50`, `dE=30` starter skills), `gE` (`7` linear L1–60 unlock tables), `mx` starter kits, and `Rm` tree UI | Client sends `[Arvore` / `[Arvore buy` / `[Arvore skill\|status\|attribute` / `[Arvore reset` (**C13**) and receives `#ARVORE` and `#NIVEL` (**C9**) | Server credits `5` Skill Points + `5` Status Points + `1` Attribute Point per level, enforces skill bracket costs (`1/2/3/5+` pts at `<70 / 70-79 / 80-89 / 90+`), and charges `300` UOCoin per tree reset | `[[progression-unlocks]] C1`, `[[progression-unlocks]] C3`, `[[progression-unlocks]] C5`, `[[progression-unlocks]] C6`, `[[progression-unlocks]] C13` |
| **Equipment Layers, `$A` Rarities, 21 Item Affixes & Bestiary/Paragon Scaling** | `eI` polls `[personagembonus` every `5000 ms`; `Bx` groups `58` skills into `4` tabs; `$A` maps `5` rarity hues; `O`/`TE` map paperdoll layers; `sk` groups `14` monster families | Client sends `[personagembonus` (**C16**) $\rightarrow$ `#PERSONAGEMBONUS` (**C10**), `[IdleShopRepair`, and `[bestiario` / `[bestiariobicho` $\rightarrow$ `#BESTA` / `#BESTAINFO` / `#BESTANIVEL` (**C4**) | Server scales material tiers (`+12%` armor durability/resist, `+8%` weapon damage per tier; metals `1/20/40/60/80/Avarite 100`), applies `40%` repair cost and `-10%` max durability penalty, rolls `0.1%` Paragon spawns, and grants `+0.2%` permanent XP per bestiary kill tier (`500..10,000`) | `[[equipment-affixes]] C1`, `[[equipment-affixes]] C5`, `[[equipment-affixes]] C6`, `[[resources]] C2`, `[[resources]] C3`, `[[resources]] C9`, `[[resources]] C18` |

## Existing Samurai & Ninja Footprint in Live Bundle (`v0.99.0`)

Auditing the live `v0.99.0` client bundle slices and shared JSON catalog reveals that Samurai (`samurai`) and Ninja (`ninja`) are already partially wired across four subsystems, with two specific client gaps:

1. **Class Registry (`_raw/bundle/classes-config.js:5-72`):**
   - `ninja: 112` (badge `'NJ'`, category `'melee'`, starter weapon `'Kryss'`)
   - `samurai: 114` (badge `'SM'`, category `'melee'`, starter weapon `'Katana'`)
2. **Skills, Roles, Starter Skills & Starter Kits (`[[progression-unlocks]]`):**
   - `jc[52] = 'bushido'` and `jc[53] = 'ninjitsu'` (`[[progression-unlocks]] C1`)
   - `dx.samurai = 'melee'` and `dx.ninja = 'melee'` (`[[progression-unlocks]] C3`)
   - `hE.samurai = [52, 40, 27, 1, 17, 26, 50]` (`bushido`, `swords`, `tactics`, `anatomy`, `healing`, `magicResist`, `focus`) and `hE.ninja = [53, 42, 21, 47, 17, 26, 50]` (`ninjitsu`, `fencing`, `hiding`, `stealth`, `healing`, `magicResist`, `focus`) (`[[progression-unlocks]] C4`)
   - `mx.samurai = ['samuraiSet', 'katana', 'bandages', 'potionsMelee', 'robeCloak']` and `mx.ninja = ['ninjaSet', 'kryss', 'bandages', 'potionsMelee', 'robeCloak']` (`[[progression-unlocks]] C13`)
3. **Seeded Starter Hotbars (`[[tick-and-cooldowns]] C12`):**
   - `gh.samurai` seeds `lesser_heal_potion`, `bandage`, `lesser_cure_potion`, and `samurai_lightning`.
   - `gh.ninja` seeds `lesser_heal_potion`, `bandage`, `lesser_cure_potion`, and `ninja_focus`.
4. **Shared Catalog Entries (`[[status-effects]] C9`..`[[status-effects]] C16`):**
   - **Samurai (6 entries):** `samurai_lightning` (`SpecialMove`, `ref: 404`, L1), `samurai_counter` (`Spell`, `ref: 403`, L5), `samurai_honorable` (`SpecialMove`, `ref: 400`, L10), `samurai_way` (`Passive`, L75), `samurai_honorable_r2` (L200), `samurai_lightning_r2` (L300).
   - **Ninja (6 entries):** `ninja_focus` (`SpecialMove`, `ref: 500`, L1), `ninja_death` (`SpecialMove`, `ref: 501`, L5), `ninja_mirror` (`SpecialMove`, `ref: 507`, L10), `ninja_shadowjump` (`SpecialMove`, `ref: 506`, L75), `ninja_death_r2` (L200), `ninja_mirror_r2` (L300).
5. **Missing Client Wiring (Target for Phase 5 `classes-patch.js`):**
   - **`gE.samurai` and `gE.ninja` Unlock Tables:** `gE` in `skills-and-progression.js` (`[[progression-unlocks]] C6`..`[[progression-unlocks]] C12`) defines L1–60 milestone arrays for only the 7 active classes (`warrior`, `berserker`, `paladin`, `ranger`, `mage`, `necromancer`, `spellweaver`).
   - **Client Estimator Branches (`Cq`/`Eq`):** `Eq` and `Cq` in `combat-estimators-and-hotbar.js` (`[[damage-and-defense]] C8`, `[[damage-and-defense]] C11`) lack fallback client estimator branches for Bushido and Ninjitsu abilities when `#HABINFO` is not yet populated.

## Phase 5 Implementation Boundary: Mode A vs Mode B

To prevent unimplementable class designs in Phase 5 (`SAM-01`..`NIN-04`), every proposed Samurai and Ninja mechanic is strictly classified into **Mode A** (100% existing engine opcodes and configuration) or **Mode B** (`<20 LOC` native ModernUO C# server hooks):

### Mode A: Zero Server Code Changes (100% Existing Engine Opcodes & Config)

Mode A mechanics require **zero C# server modifications** and operate purely by populating `gE.samurai` and `gE.ninja`, extending client estimators `Cq`/`Eq` in `classes-patch.js`, and binding L1–60 Samurai and Ninja ability slots in `abilities-catalog.json` to dispatch primitives already running in the shard:

| Mode A Dispatch Primitive | Existing Engine Opcode / `ref` | Samurai (Bushido) Mode A Usage | Ninja (Ninjitsu) Mode A Usage |
|---|---|---|---|
| **Auto-Attack Passive** | `kind: "Passive"` (`samurai_way`, `warrior_slash`) | Basic Katana / No-Dachi weapon swing loop + `samurai_way` (`[[status-effects]] C16`) | Basic Kryss / Tekagi / Kama weapon swing loop |
| **Native Bushido / Ninjitsu `SpecialMove`** | `kind: "SpecialMove"`, `ref: 400, 404, 500, 501, 506, 507` | `samurai_honorable` (`400` `HonorableExecution`), `samurai_lightning` (`404` `LightningStrike`), plus Rank II upgrades (`[[status-effects]] C13`, `[[status-effects]] C15`) | `ninja_focus` (`500` `FocusAttack`), `ninja_death` (`501` `DeathStrike`), `ninja_shadowjump` (`506` `Shadowjump`), `ninja_mirror` (`507` `MirrorImage`), plus Rank II upgrades (`[[status-effects]] C9`..`[[status-effects]] C12`) |
| **Native Bushido `Spell`** | `kind: "Spell"`, `ref: 401, 402, 403, 405` | `Confidence` (`401`), `Evasion` (`402`), `samurai_counter` (`403` `CounterAttack`, `[[status-effects]] C14`), `MomentumStrike` (`405`) | — |
| **Native UO `WeaponAbility`** | `kind: "WeaponAbility"`, `ref: 1..22` | `ArmorIgnore` (`1`), `CrushingBlow` (`4`), `DoubleStrike` (`7`), `WhirlwindAttack` (`13`), `FrenziedWhirlwind` (`22`) (`[[status-effects]] C5`, `[[status-effects]] C6`) | `ArmorIgnore` (`1`), `BleedAttack` (`2`), `InfectiousStrike` (`8`), `MortalStrike` (`9`), `ParalyzingBlow` (`11`), `ShadowStrike` (`12`) |
| **Existing `Custom` Server Opcodes** | `kind: "Custom"` (`Brace`, `Bulwark`, `ArmorBreak`, `Execution`, `Cleave`, `Flurry`, `KiRecovery`) | Defensive stances (`Brace`/`Bulwark`), armor shred (`ArmorBreak`), low-HP finisher (`Execution` triggered at `enemy hp <= X%`), 2-target cleave (`Cleave`) | Multi-hit combo (`Flurry` `2 + rank` hits), poison/bleed finishers, `Focus`-scaled self sustain (`KiRecovery`) |
| **Hotbar Auto-Trigger Predicates** | `jo`, `hu`, `hh`, `Td`, `fu`, `fh`, `zE`, `ally_agro` (`[[tick-and-cooldowns]] C4`) | Auto-cast stances in combat (`fu`), AoE sweeps at `enemies >= 3` (`zE(3)`), execute at `enemy hp <= 30%`, heal at `self hp <= 55%` | Auto-cast `MirrorImage` / buffs in combat, `FocusAttack` / `Shadowjump` burst rotation, `DeathStrike` finisher |

### Mode B: Minimal (`<20 LOC`) Native ModernUO C# Server Hooks

Where canonical ModernUO Bushido and Ninjitsu mechanics rely on active tile movement, manual targeting (`HonorTarget`), or unthrottled single-hit avoidance that would break an automated idle loop, Mode B isolates the server adaptation to **two self-contained `<20 LOC` C# hooks**:

1. **Samurai `Perfection` Streak & Reactive Parry-Counter Hook (`<20 LOC` in `BaseWeapon.OnHit` / `BaseWeapon.CheckParry`):**
   - **Why Mode B is needed:** In canonical ModernUO (`HonorContext.cs`), `Perfection` requires manually targeting a monster with the Honor virtue before combat. In UO Idle's automated hunt loop, manual pre-combat targeting does not exist.
   - **Minimal C# Hook:** Automatically track consecutive hits against the current hunt target on the Samurai player mobile (`m_PerfectionStreak`), adding **`+10%` physical damage per consecutive hit** up to a hard cap (e.g., `+50%` to `+100%`) and resetting on miss or target switch; inside `BaseWeapon.CheckParry`, when `CounterAttack` (`ref: 403`) or `Confidence` (`ref: 401`) is active, trigger an immediate resource-free counter-swing or `Confidence` HP/Stamina heal tick with an internal cooldown floor (`>= 2s`).
2. **Ninja Ablative `Mirror Image` Clone & 5-Swing `Death Strike` Detonation Hook (`<20 LOC` in `AOS.Damage` / `DeathStrike.cs`):**
   - **Why Mode B is needed:** In canonical ModernUO (`DeathStrike.cs`), `DeathStrike` (`ref: 501`) calculates bonus damage based on the target walking `5` tiles—which never triggers in a stationary idle duel—while unthrottled `MirrorImage` (`ref: 507`) clone spam could grant near-100% hit avoidance against slow-swinging bosses.
   - **Minimal C# Hook:** In `DeathStrike`, replace the 5-step tile movement check with a **5-swing/tick combo counter** so the delayed detonation fires at full Ninjitsu scaling after five subsequent weapon swings or ticks in the idle loop; in `AOS.Damage`, consume one `MirrorImage` clone stack to intercept an incoming hit while enforcing a per-clone cooldown floor so clone absorption remains an ablative mitigation layer rather than permanent invulnerability.
