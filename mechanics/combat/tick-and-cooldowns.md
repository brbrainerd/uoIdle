---
id: "tick-and-cooldowns"
title: "Combat Tick Loop, Cooldowns, and Hotbar Auto-Trigger Engine"
category: "combat"
aliases: ["hotbar", "cooldowns", "combat-loop", "auto-attack", "triggers", "habinfo"]
status: "verified"
sources: ["_raw/bundle/abilities-loader-and-hotbar.js", "_raw/bundle/combat-estimators-and-hotbar.js", "_raw/bundle/hunt-and-bot-config.js", "_raw/wiki/changelog-server-dev.md"]
evidence: ["live: _evidence/live-bundle-probe.txt L1-L20", "bundle: _raw/bundle/combat-estimators-and-hotbar.js:5-40", "bundle: _raw/bundle/combat-estimators-and-hotbar.js:85-93", "bundle: _raw/bundle/combat-estimators-and-hotbar.js:520-541", "wiki: _raw/wiki/changelog-server-dev.md:209-217", "wiki: _raw/wiki/changelog-server-dev.md:603"]
code_refs: ["abilities-loader-and-hotbar.js:Fc", "abilities-loader-and-hotbar.js:Uw", "abilities-loader-and-hotbar.js:ro", "abilities-loader-and-hotbar.js:gh", "combat-estimators-and-hotbar.js:Sg", "combat-estimators-and-hotbar.js:rk"]
updated: "2026-11-07"
---
# Combat Tick Loop, Cooldowns, and Hotbar Auto-Trigger Engine

Source: [raw](../_raw/bundle/abilities-loader-and-hotbar.js)

## Summary

UO Idle separates passive weapon auto-attacks from active ability and consumable execution across a fixed-capacity hotbar. Basic weapon swings run continuously on the server swing timer without occupying a hotbar slot, while active abilities, spells, meditation, bandages, and potions are evaluated in slot order by the hunting bot whenever their conjunctive or disjunctive trigger conditions hold. The browser client loads the remote ability catalog, filters out passive and deferred entries, seeds class-specific default hotbars with automatic threshold rules, and synchronizes the slot array to the shard. On the server, every custom ability without an explicit cooldown receives a minimum cooldown floor, potions obey their true cooldown duration rather than a fixed millisecond gap, slots lacking supplies or mana are skipped without stalling combat, and dungeon spawn points respawn on difficulty-stepped timers.

## Claims

- **C1** [verified] "const OE = new Set([ 'lesser_poison_potion', 'poison_potion', 'greater_poison_potion', 'deadly_poison_potion', 'lesser_explosion_potion', 'explosion_potion', 'greater_explosion_potion', 'nightsight_potion', 'night_sight_potion', 'nightshade', ]);" (raw L12-L23)
- **C2** [verified] "async function Fc() { if (Fr) return Fr; try { const a = await ( await fetch(vt(`/packs/idle/abilities.json?v=${encodeURIComponent(wc)}`)) ).json(); ((Fr = Array.isArray(a.abilities) ? a.abilities : []), PE(Fr)); } catch { ((Fr = []), (tb = new Map())); } return Fr; }" (raw L25-L36)
- **C3** [verified] "function Uw(e, a) { const n = a.includeLocked !== !1; return e.filter((s) => s.tab !== a.tab || OE.has(s.id) || (a.tab !== 'item' && s.kind === 'ItemUse') || s.kind === 'Passive' || (!n && s.unlock > a.level) ? !1 : a.tab === 'item' || s.class === '*' ? !0 : a.idleClass ? s.class === a.idleClass : !1 ); }" (raw L37-L52)
- **C4** [verified] "const jo = (e) => ({ target: 'self', attr: 'hp', op: '<=', value: e, percent: !0 }), hu = (e) => ({ target: 'self', attr: 'mana', op: '<=', value: e, percent: !0 }), hh = (e) => ({ target: 'self', attr: 'stam', op: '<=', value: e, percent: !0 }), Td = { target: 'self', attr: 'poisoned', op: '==', value: 1 }, HE = [jo(80), { ...Td, join: 'or' }], fu = { target: 'self', attr: 'in_combat', op: '==', value: 1 }, fh = (e) => ({ target: 'self', attr: e, op: '==', value: 0 }), zE = (e) => ({ target: 'self', attr: 'enemies', op: '>=', value: e })," (raw L609-L616)
- **C5** [verified] "GE = /whirl|storm|thunder|explosion|meteor|chain|nova|cleave|quake|blizzard|fire.?field|mass_|blade_storm|flurry|aoe|area/i, am = /heal|bandage|close_wounds|ki_recovery|_gh$|greater_heal|cure_wound/i, Kw = /cure/i, VE = /mana_potion|meditat/i, WE = /refresh/i, KE = /agility/i, YE = /strength/i, XE = /intelligence/i, JE = /bless|protection|reactive|cunning|night_sight|invis/i;" (raw L617-L626)
- **C6** [verified] "function ro(e) { const a = e.toLowerCase(); return a === 'bandage' ? [...HE] : a === 'lesser_heal_potion' ? [jo(50)] : a === 'heal_potion' ? [jo(32)] : a === 'greater_heal_potion' ? [jo(18)] : a.includes('heal') && a.includes('potion') ? [jo(35)] : a === 'lesser_mana_potion' ? [hu(40)] : a.includes('mana_potion') ? [hu(28)] : a.includes('meditat') ? [hu(35)] : a === 'lesser_cure_potion' || a === 'cure_potion' || a === 'greater_cure_potion' ? [Td] : a === 'mage_cure' || a === 'necro_magery_cure' ? [Td, { target: 'ally', attr: 'poisoned', op: '==', value: 1, join: 'or' }] : Kw.test(a) && !am.test(a) ? [Td] : a === 'refresh_potion' ? [hh(45)] : a === 'total_refresh_potion' ? [hh(22)] : WE.test(a) ? [hh(40)]" (raw L627-L657)
- **C7** [verified] ": KE.test(a) ? [fu, fh('dex_buff')] : YE.test(a) ? [fu, fh('str_buff')] : XE.test(a) ? [fu, fh('int_buff')] : JE.test(a) ? [fu] : a === 'mage_heal' || a === 'necro_magery_heal' ? [ jo(50), { target: 'ally', attr: 'hp', op: '<=', value: 50, percent: !0, join: 'or', }, ] : am.test(a) ? a.includes('greater') || a.includes('_gh') ? [jo(40)] : [jo(55)] : GE.test(a) ? [zE(3)] : a === 'warrior_provoke' || a.endsWith('_provoke') ? [ { target: 'self', attr: 'ally_agro', op: '==', value: 1, }, ] : VE.test(a) ? [hu(40)] : []; }" (raw L657-L695)
- **C8** [verified] "function Yw(e) { return e.kind !== 'Passive'; } function ib(e) { const a = e.tab === 'item' ? 'ability' : e.tab === 'spell' ? 'spell' : 'ability', n = e.id === 'meditate' || e.kind === 'Meditate'; return { kind: n ? 'meditate' : a, enabled: !0, conditions: ro(e.id), context: 'hunt', abilityId: n ? 'meditate' : e.id, label: e.name, graphic: rb(e.id, kc[e.id], e), hue: e.hue ?? ki[e.id] ?? 0, }; }" (raw L696-L712)
- **C9** [verified] "const Mo = 0; function e5(e, a) { return null; } const Gn = 12, _p = 'idle-hotbar-bind'; function t5(e, a = 0) { return a > 0 ? `s${a >>> 0}` : e ? `n:${e}` : ''; } function Jw(e) { return `uo-idle-hotbar-v6:${e}`; }" (raw L760-L771)
- **C10** [verified] "const c = String(a.abilityId || ''), l = { warrior_double_strike_2_r2: 'warrior_double_strike_2', ranger_charged_shot_r2: 'ranger_charged_shot', }[c] ?? c, m = a.context === 'hunt' || a.context === 'gather' || a.context === 'always' ? a.context : 'always';" (raw L864-L873)
- **C11** [verified] "const gh = { warrior: [vs(), ys(), Bn(), wx()], mage: [ { kind: 'ability', abilityId: 'lesser_heal_potion', label: 'Lesser Heal', enabled: !0, graphic: 3852, conditions: [...Gl], }, { kind: 'spell', abilityId: 'mage_heal', label: 'Heal', enabled: !0, context: 'always', conditions: [...tN], }, { kind: 'spell', abilityId: 'mage_cure', label: 'Cure', enabled: !0, context: 'always', conditions: [...Dp], }, { kind: 'spell', abilityId: 'mage_magic_arrow', label: 'Arrow', enabled: !0, context: 'hunt', conditions: [], }, { kind: 'ability', abilityId: 'lesser_mana_potion', label: 'Lesser Mana', enabled: !0, graphic: 3846, hue: 20, conditions: [...aN], }, ], ranger: [vs(), ys(), Bn(), wx()]," (raw L1026-L1071)
- **C12** [verified] "ninja: [ vs(), ys(), Bn(), { kind: 'ability', abilityId: 'ninja_focus', label: 'Focus', enabled: !0, conditions: [] }, ], monk: [vs(), ys(), Bn()], samurai: [ vs(), ys(), Bn(), { kind: 'ability', abilityId: 'samurai_lightning', label: 'Bolt', enabled: !0, conditions: [] }, ]," (raw L1132-L1144)

## Auto-Attack vs Active Hotbar Architecture

UO Idle divides combat execution into two parallel tracks:

1. **Passive Auto-Attack Loop (`Sg` in `_raw/bundle/combat-estimators-and-hotbar.js:85-93`):**
   - Class basic attacks (`warrior_slash`, `ranger_arrow`, and `monk_palm`) are marked `"kind": "Passive"` in the catalog and filtered out of hotbar selection by `Uw(e, a)` (**C3**) and `Yw(e)` (**C8**).
   - Tooltip formatter `Sg(e, a)` renders `hotbar.autoAttackCd` (`"Automatic weapon swing — not for the hotbar; you already attack on your own."`) for these three IDs.
   - Weapon swing speed scales with Stamina (`DEX + Stamina`), item `WeaponSpeed` (capped at `60%` from gear), and progression tree `Speed` (which stacks beyond the gear cap; see `[[resources]]`).
2. **Active 12-Slot Hotbar Loop (`Gn = 12`, `Mo = 0` in **C9**):**
   - Each character has `Gn = 12` hotbar slots persisted in `localStorage` under `uo-idle-hotbar-v6:<charKey>` (**C9**) and synchronized to the shard via `[IdleHotbar <json>`.
   - Slot index `Mo = 0` is the pinned primary slot (`fixar` handler at `L1394-L1413`).
   - During a hunt, the server bot evaluates enabled hotbar slots whose `context` matches (`'hunt'`, `'gather'`, or `'always'`, normalized in `cr(e)` per **C10**).
   - Per `[[resources]] C8`, if a slot lacks its required potion, bandage, reagents, or mana, the bot skips that slot immediately without blocking downstream slots or stalling the farm; if a slot has no custom condition array, the server applies the catalog's base rule (e.g., in-combat or heal threshold).

## Ability Catalog Loader & Filtering (`Fc`, `Uw`, `OE`)

- **Remote Catalog Fetch (`Fc`, **C2**):** Fetches `/packs/idle/abilities.json?v=0.99.0` once and indexes all entries into `tb` (`Map<id, entry>`).
- **Deferred Set (`OE`, **C1**):** Explicitly hides ten poison, explosion, and night-sight potion/reagent entries (`lesser_poison_potion`, `poison_potion`, `greater_poison_potion`, `deadly_poison_potion`, `lesser_explosion_potion`, `explosion_potion`, `greater_explosion_potion`, `nightsight_potion`, `night_sight_potion`, `nightshade`) from hotbar binding.
- **Eligibility Filter (`Uw`, **C3**):** Filters the catalog by `tab`, excludes `OE` members, excludes `"Passive"` entries, enforces `s.unlock <= a.level` when `includeLocked === false`, and matches either universal items (`s.class === '*'`) or the character's `idleClass`.

## Hotbar Trigger Condition Engine (`ro`, `rk`)

Each hotbar slot holds a `conditions` array of predicates `{ target, attr, op, value, percent, who, join }` normalized by `cr(e)` (`L824-L836`). Predicates combine left-to-right using `join: 'and'` (default when `join` is omitted) or `join: 'or'`.

### Condition Builder Primitives (**C4**) & Target Matrix (`rk`)

| Helper / Symbol | Generated Predicate | Valid `target` Values (`rk` in `combat-estimators-and-hotbar.js:520-541`) |
|---|---|---|
| `jo(e)` | `{ target: 'self', attr: 'hp', op: '<=', value: e, percent: true }` | `['self', 'ally', 'party:leader', 'enemy']` |
| `hu(e)` | `{ target: 'self', attr: 'mana', op: '<=', value: e, percent: true }` | `['self', 'ally', 'party:leader']` |
| `hh(e)` | `{ target: 'self', attr: 'stam', op: '<=', value: e, percent: true }` | `['self', 'ally', 'party:leader']` |
| `Td` | `{ target: 'self', attr: 'poisoned', op: '==', value: 1 }` | `['self', 'ally', 'party:leader']` |
| `HE` | `[jo(80), { ...Td, join: 'or' }]` | Self HP `<= 80%` OR Self `poisoned == 1` |
| `fu` | `{ target: 'self', attr: 'in_combat', op: '==', value: 1 }` | `['self', 'enemy']` |
| `fh(attr)` | `{ target: 'self', attr, op: '==', value: 0 }` (`str_buff`, `dex_buff`, `int_buff`) | `['self']` |
| `zE(e)` | `{ target: 'self', attr: 'enemies', op: '>=', value: e }` | `['self']` |
| `ally_agro` | `{ target: 'self', attr: 'ally_agro', op: '==', value: 1 }` | `['self']` |

### Default Auto-Trigger Assignments (`ro(e)`, **C5**, **C6**, **C7**)

When an ability or consumable is bound to the hotbar without user-supplied conditions, `ro(e)` assigns default rules based on its ID:

| Ability / Consumable Pattern | Default Condition Array | Semantic Rule |
|---|---|---|
| `bandage` | `[jo(80), { ...Td, join: 'or' }]` (`HE`) | Self HP `<= 80%` OR Self poisoned |
| `lesser_heal_potion` / `heal_potion` / `greater_heal_potion` | `[jo(50)]` / `[jo(32)]` / `[jo(18)]` | Self HP `<= 50%` / `<= 32%` / `<= 18%` (other heal potions: `<= 35%`) |
| `lesser_mana_potion` / `*mana_potion*` / `*meditat*` | `[hu(40)]` / `[hu(28)]` / `[hu(35)]` | Self Mana `<= 40%` / `<= 28%` / `<= 35%` |
| `lesser_cure_potion`, `cure_potion`, `greater_cure_potion`, `Kw` | `[Td]` | Self `poisoned == 1` |
| `mage_cure`, `necro_magery_cure` | `[Td, { target: 'ally', attr: 'poisoned', op: '==', value: 1, join: 'or' }]` | Self OR Ally `poisoned == 1` |
| `refresh_potion` / `total_refresh_potion` / `WE` | `[hh(45)]` / `[hh(22)]` / `[hh(40)]` | Self Stamina `<= 45%` / `<= 22%` / `<= 40%` |
| `KE` (`agility`) / `YE` (`strength`) / `XE` (`intelligence`) | `[fu, fh('dex_buff')]` / `[fu, fh('str_buff')]` / `[fu, fh('int_buff')]` | In combat AND corresponding stat buff is inactive (`== 0`) |
| `JE` (`bless`, `protection`, `reactive`, `cunning`, `night_sight`, `invis`) | `[fu]` | In combat (`in_combat == 1`) |
| `mage_heal`, `necro_magery_heal` | `[jo(50), { target: 'ally', attr: 'hp', op: '<=', value: 50, percent: true, join: 'or' }]` | Self HP `<= 50%` OR Ally HP `<= 50%` |
| Other `am` heals (`*greater*` or `*_gh` vs standard) | `[jo(40)]` vs `[jo(55)]` | Self HP `<= 40%` (greater) or `<= 55%` (standard, e.g., `paladin_close_wounds`) |
| `GE` AoE pattern (`whirl`, `storm`, `thunder`, `explosion`, `meteor`, `chain`, `nova`, `cleave`, `quake`, `blizzard`, `fire.?field`, `mass_`, `blade_storm`, `flurry`, `aoe`, `area`) | `[zE(3)]` | Nearby hostile enemies `>= 3` (ignores pets, summons, and blessed creatures per `changelog-server-dev.md:228-232`) |
| `warrior_provoke` / `*_provoke` | `[{ target: 'self', attr: 'ally_agro', op: '==', value: 1 }]` | Fires only when an ally has aggro (`ally_agro == 1`) |

## Seeded Class Hotbars (`gh`, **C11**, **C12**)

`gh` (`L1026-L1173`) defines the seeded starter hotbars for all fifteen class keys in the client bundle (including pre-wired starter bars for `ninja` and `samurai`):

| Class Key | Slot 1 (`0`) | Slot 2 (`1`) | Slot 3 (`2`) | Slot 4 (`3`) | Slot 5 (`4`) |
|---|---|---|---|---|---|
| `warrior`, `ranger` | `lesser_heal_potion` (`hp<=50%`) | `bandage` (`HE`) | `lesser_cure_potion` (`Td`) | `lesser_mana_potion` (`mana<=30%`) | — |
| `mage` | `lesser_heal_potion` (`hp<=50%`) | `mage_heal` (`tN`) | `mage_cure` (`Dp`) | `mage_magic_arrow` (`[]`) | `lesser_mana_potion` (`mana<=30%`) |
| `necromancer` | `necro_magery_heal` (`hp<=50%`) | `necro_magery_cure` (`Td`) | `necro_pain_spike` (`[]`) | — | — |
| `paladin` | `lesser_heal_potion` (`hp<=50%`) | `bandage` (`HE`) | `lesser_cure_potion` (`Td`) | `paladin_close_wounds` (`hp<=55%`) | — |
| `berserker` | `lesser_heal_potion` (`hp<=50%`) | `bandage` (`HE`) | `lesser_cure_potion` (`Td`) | `berserker_cleave` (`[]`) | — |
| `duelist` | `lesser_heal_potion` (`hp<=50%`) | `bandage` (`HE`) | `lesser_cure_potion` (`Td`) | `duelist_piercing` (`[]`) | — |
| `assassin` | `lesser_heal_potion` (`hp<=50%`) | `bandage` (`HE`) | `lesser_cure_potion` (`Td`) | `assassin_poison` (`[]`) | — |
| `ninja` (**C12**) | `lesser_heal_potion` (`hp<=50%`) | `bandage` (`HE`) | `lesser_cure_potion` (`Td`) | `ninja_focus` (`[]`) | — |
| `monk` (**C12**) | `lesser_heal_potion` (`hp<=50%`) | `bandage` (`HE`) | `lesser_cure_potion` (`Td`) | — | — |
| `samurai` (**C12**) | `lesser_heal_potion` (`hp<=50%`) | `bandage` (`HE`) | `lesser_cure_potion` (`Td`) | `samurai_lightning` (`[]`) | — |
| `mystic` | `mystic_magery_heal` (`hp<=50%`) | `lesser_cure_potion` (`Td`) | `mystic_eagle` (`[]`) | — | — |
| `spellweaver` | `sw_magery_heal` (`hp<=50%`) | `lesser_cure_potion` (`Td`) | `sw_thunderstorm` (`[]`) | — | — |
| `bard` | `lesser_heal_potion` (`hp<=50%`) | `bandage` (`HE`) | `lesser_cure_potion` (`Td`) | `bard_discord` (`[]`) | — |
| `tamer` | `lesser_heal_potion` (`hp<=50%`) | `bandage` (`HE`) | `lesser_cure_potion` (`Td`) | `tamer_call` (`[]`) | — |

## Cooldown Floors, `#HABINFO` Telemetry & Dungeon Respawn Pacing

- **`#HABINFO` & `#SUPPLY` Polling (`pq` in `combat-estimators-and-hotbar.js:5-40`):** The client issues `[habinfo` (`2500 ms` initial timeout, then interval `hq`) and `[supply` (`1200 ms` initial timeout, then interval `fq`) and maps `#HABINFO` payloads `{ id, dmin, dmax, cmin, cmax, golpes, area, cd, mana, reags }` onto hotbar slots.
- **2-Second Custom Cooldown Floor (`[[resources]] C14`):** Passive abilities are excluded from `#HABINFO`, and any `"Custom"` ability without an explicit cooldown uses a **2-second minimum floor** (`Custom sem CD declarado usa piso de 2 s`).
- **Real Potion Cooldown Gap (`[[resources]] C8`):** Potion slots on the bot hotbar respect the potion's real cooldown rather than a `400 ms` global gap.
- **Hotbar Slot Cooldown UI (`xq` in `combat-estimators-and-hotbar.js:242-253`):** Renders the radial cooldown overlay (`--cd: o.coolRatio`) and remaining seconds (`o.coolSec`) whenever `o.coolRatio > 0.01`.
- **Hunt Tick Termination (`[[resources]] C7`):** Depleting Hunting Energy to zero stops the hunt on the same server tick.
- **Per-Point Dungeon Respawn Cooldowns (`[[resources]] C6`):** Each spawn point in a dungeon tracks its own independent respawn timer stepped by `5s` per difficulty tier:

| Difficulty Tier | Respawn Cooldown per Spawn Point |
|---|---|
| **Trivial** | `50s` |
| **Fácil** (Easy) | `45s` |
| **Médio** (Medium) | `40s` |
| **Desafiador** (Challenging) | `35s` |
| **Difícil** (Hard) | `30s` |
| **Pesadelo** (Nightmare) | `25s` |
| **Inferno** (Hell) | `20s` |
