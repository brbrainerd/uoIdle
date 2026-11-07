# UO Idle — Ninja (`Ninjitsu`) L1–60 Class Design & Dual-Mode Specification (`CLASS-02`, `CLASS-03`)

**Phase:** `05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code` (`Plan 05-02`)  
**Requirements Covered:** `CLASS-02`, `CLASS-03`  
**Drop-In Payload:** [`design/drop-in/ninja.json`](file:///Users/brbrainerd/dev/uoIdle/design/drop-in/ninja.json)  
**Schema Contract:** [`src/schemas/skill.schema.ts`](file:///Users/brbrainerd/dev/uoIdle/src/schemas/skill.schema.ts) (`ClassSchema`) / [`schemas/class.schema.json`](file:///Users/brbrainerd/dev/uoIdle/schemas/class.schema.json)  
**Knowledge Base Provenance:** `[[modernuo-ninjitsu]]`, `[[ninjitsu-mirror-image]]`, `[[ninjitsu-focus-attack]]`, `[[ninjitsu-backstab]]`, `[[ninjitsu-stealth-hiding]]`, `[[ninjitsu-shadowjump]]`, `[[ninjitsu-surprise-attack]]`, `[[ninjitsu-ki-attack]]`, `[[ninjitsu-death-strike]]`, `[[ninjitsu-animal-form]]`, `[[ninjitsu-items]]`, `[[class-structural-parity]]`, `[[combat-niches]]`, `[[engine-capability-matrix]]`

---

## Section 1 — Class Identity, Protected Combat Niche & Structural Parity (`CLASS-02`)

### 1.1 Four-Layer Client Bundle Identity (`_E`, `Kj`, `ZC`, `dx`, `SE`)

Per `[[class-structural-parity]] C1`..`[[class-structural-parity]] C12` and `[[combat-niches]] C1`..`[[combat-niches]] C12`, the Ninja (`ninja`) class is registered in the live `v0.99.0` client bundle with full structural parity across all identity, attribute, starter skill, equipment, paperdoll, and hotbar tables:

| Property | Bundle Symbol | Value in `design/drop-in/ninja.json` | Governing Invariant / KB Citation |
|---|---|---|---|
| **Class Key (`id`)** | `Kj.ninja` / `_E.ninja` | `"ninja"` | `ClassIdEnum` in `src/schemas/skill.schema.ts:82-99` |
| **Numeric ID (`classNumericId`)** | `Kj.ninja` | `115` (`QC[15] = 'ninja'`) | `[[combat-niches]] C1`, `[[combat-niches]] C2` |
| **UI Badge (`badge`)** | `e2.ninja` | `"NJ"` | `[[combat-niches]] C12` |
| **Combat Role (`role`)** | `dx.ninja` | `"melee"` | `[[class-structural-parity]] C1` |
| **Robe & Cloak Hue (`robeHue`)** | `SE.ninja` | `1175` | `[[class-structural-parity]] C12` |
| **Base Attributes (`baseStats`)** | `ZC.ninja` | `STR: 30`, `DEX: 50`, `INT: 10` (`Sum = 90`) | `[[combat-niches]] C11` (`str + dex + int === 90`) |
| **Resource Profile (`resourceProfile`)** | Server `AOS` / `Mana` | `primaryResource: "mana"`, `startingManaMax: 25`, `meditationCap: 100`, `consumesReagents: false`, `consumesAmmo: false`, `chivalryGoldTithe: false` | `[[resources]] C1`, `[[combat-niches]]` (`All`-meditation Leather Ninja armor, mana/stamina hybrid assassin cadence, zero reagent/ammo depletion) |

### 1.2 Protected Combat Niche: *Ablative Clone Mitigation / Stealth-State Opener / 5-Hit Delayed Detonation Assassin*

Per `[[combat-niches]]`, Ninja occupies an orthogonal high-DEX assassin niche that explicitly preserves Mage's elemental spellbook AoE niche, Samurai's consecutive-hit `Perfection` duelist niche, and Duelist/Assassin's pure Poisoning/Bleed windows:

| Combat Dimension | Ninja (`NJ` — `Ninjitsu`) | Samurai (`SM` — `Bushido`) | Duelist (`DL` — Fencing/Parry) | Assassin (`AS` — Poison/Bleed) | Mage (`MG` — Elemental Magery) |
|---|---|---|---|---|---|
| **Primary Single-Target Loop** | **Stealth-State Openers** (`SmokeBomb` $\rightarrow$ `Backstab` / `SurpriseAttack`) + **5-Swing Delayed Detonation** (`DeathStrike` / `DeathStrike II`) + `FocusAttack` precision | Consecutive-hit `Perfection` ramp + `+50` Accuracy `LightningStrike` + `HonorableExecution` finisher | Direct `Armor Ignore` + `Whirlwind` + `Bleed Attack` | Out-of-combat `Ambush` + `Shadowstrike` + `Venom Coating` + `Execute` | `8`-circle reagent-free spellbook nukes (`Energy Bolt`, `Flamestrike`, `Meteor Swarm`) |
| **Posture & Speed Synergy** | **High-DEX (`50`) Fencing Speed** + `Precision` (`+20%` hit chance) posture + `AnimalForm` (`+10%` attack speed aspect) | Balanced `STR 50 / DEX 30` Swordsmanship + `Defensive` / `Attack` posture | `STR 35 / DEX 45` Fencing + Shield/Weapon parry | `STR 35 / DEX 45` Fencing + `Poisoning` (`30`) | `INT 60` Magery + `Meditation` (`100`) |
| **Mitigation Architecture** | **Ablative Clone Interception** (`MirrorImage` / `MirrorImage II`, `Ninjitsu / 150.0` hit diversion with bounded clone stacks + ICD) + mid-combat `SmokeBomb` stealth veil (`-8%` damage taken) | Shieldless `Bushido` Weapon Parry (`Parry * Bushido / divisor`) + `Evasion` + `CounterAttack` | `Evasive Stance` + `Parry` (`50`) | `Cloak of Shadows` + `Evasion` (`L40`) | `Reactive Armor` + `Protection` + `Magic Reflection` |
| **Ranged & Venom Pressure** | **Cooldown-Gated Tokuno Projectiles & Venom** (`Shuriken` / `Fukiya` volley + `InfectiousStrike` Kryss venom DoT) with zero physical ammo depletion | `MomentumStrike` 2-target blade transfer (`splashRatio: 1.15`) | Melee-only Fencing strikes | Melee-only Poisoning/Bleed strikes | Full multi-target elemental AoE (`Chain Lightning`, `Meteor Swarm`) |

### 1.3 Starter Skills (`WE.ninja` / `hE.ninja`) & Legacy Template Weights (`FE.ninja` / `ZC.ninja.skills`)

Per `[[class-structural-parity]] C2` and `src/schemas/skill.schema.ts:372-392`, Ninja receives 8 starter skills (`initialValue: 50`, except `magicResist: 30`) and 4 legacy template weights summing to `100`:

| Skill ID (`jc`) | `skillKey` | `starterSkills` (`initialValue`) | `legacyTemplateSkills` (`weight`) | Functional Role in UO Idle Combat |
|---:|---|---:|---:|---|
| `53` | `ninjitsu` | `50` | `30` | Governs all 8 `BookOfNinjitsu` (`500–507`) scalings, `MirrorImage` clone interception (`Ninjitsu / 150.0`), `DeathStrike` detonation, and `Shuriken`/`Fukiya` accuracy (`[[modernuo-ninjitsu]]`). |
| `42` | `fencing` | `50` | `30` | Primary weapon skill for `Kryss`, `Tekagi`, `Kama`, `Sai`, and `Lajatang`; governs base melee hit chance and `InfectiousStrike` (`ref: 11`). |
| `27` | `tactics` | `50` | — | Scales base physical melee damage across all Fencing and Ninjitsu weapon strikes. |
| `21` | `hiding` | `50` | `20` | Combines with `stealth` to scale `StalkingBonus` and `DeathStrike` scalar `(Hiding + Stealth) / 220` (`[[ninjitsu-death-strike]] C5`); triggered mid-combat via `SmokeBomb` (`Hiding.CombatOverride = true`). |
| `47` | `stealth` | `50` | `20` | Enables stealth-opener empowerment (`Backstab`, `SurpriseAttack`, `Shadowjump`) and `DeathStrike` pressure-point scaling (`[[ninjitsu-backstab]] C2`). |
| `1` | `anatomy` | `50` | — | Scales physical melee damage bonus and `bandage` recovery in `slotIndex: 1`. |
| `26` | `magicResist` | `30` | — | Mandatory `ClassSchema` starter invariant (`dE = 30`); mitigates incoming boss spell/elemental damage. |
| `50` | `focus` | `50` | — | Mandatory `ClassSchema` starter invariant (`uE = 50`); sustains passive Mana & Stamina regeneration in `All`-meditation Leather Ninja armor. |

### 1.4 Starter Equipment (`yE.ninja` / `mx.ninja` / `hx.ninja`) & Seeded Hotbar (`mE.ninja` / `gh.ninja`)

- **Starter Kit Tokens (`kitTokens` — `[[class-structural-parity]] C10`):**
  `["ninjaSet", "kryss", "bandages", "potionsMelee", "robeCloak"]`
- **Paperdoll Layers (`paperdollLayers` — `[[class-structural-parity]] C11`):**
  1. `Helm`: graphic `10128` (`LeatherNinjaHood` / `0x2790`)
  2. `InnerTorso`: graphic `10131` (`LeatherNinjaJacket` / `0x2793`)
  3. `Arms`: graphic `10132` (Ninja Sleeves / `0x2794`)
  4. `Gloves`: graphic `10130` (`LeatherNinjaMitts` / `0x2792`)
  5. `Pants`: graphic `10129` (`LeatherNinjaPants` / `0x2791`)
  6. `Shoes`: graphic `10133` (Ninja Tabi Boots / `0x2795`)
  7. `OneHanded`: graphic `5121` (`Kryss` — fast 1H Fencing blade with no shield in `TwoHanded`, satisfying `FocusAttack` and `NinjaWeapon` free-hand requirements)
  8. `OuterTorso`: graphic `7939` (`softFlag: "softRobe"`, dyed `robeHue: 1175`)
  9. `Cloak`: graphic `5397` (`softFlag: "softCloak"`, dyed `robeHue: 1175`)

- **Seeded 5-Slot Starter Hotbar (`seededHotbar` — `[[engine-capability-matrix]]`):**

| `slotIndex` | `kind` | `abilityId` | `label` | `graphic` | Default Trigger Conditions (`conditions`) |
|---:|---|---|---|---:|---|
| `0` | `"ability"` | `lesser_heal_potion` | `"Lesser Heal"` | `3852` | `self.hp <= 50%` |
| `1` | `"ability"` | `bandage` | `"Bandage"` | `3617` | `self.hp <= 80%` `or` `self.poisoned == 1` |
| `2` | `"ability"` | `lesser_cure_potion` | `"Lesser Cure"` | `3847` | `self.poisoned == 1` |
| `3` | `"ability"` | `lesser_mana_potion` | `"Lesser Mana"` | `3846` | `self.mana <= 30%` |
| `4` | `"ability"` | `ninja_focus` | `"Bolt"` | — | `[]` (unconditional active combat strike) |

---

## Section 2 — Normalized 12-Milestone L1–60 Progression Table & 13-Ability Kit Reconciliation (`gE.ninja`)

In `mechanics/_raw/bundle/abilities-catalog.json:1399-1481`, the live `v0.99.0` bundle contains **6 pre-existing `ninja_*` entries** (`ninja_focus`, `ninja_death`, `ninja_mirror`, `ninja_shadowjump`, `ninja_death_r2`, `ninja_mirror_r2`) with legacy pre-V3 `unlock` values (`1, 5, 10, 75, 200, 300`), while `gE.ninja` in `abilities-loader-and-hotbar.js:1165` only had a 1-entry stub (`ninja_shadowjump` at `L1`).

To satisfy both **raw catalog provenance** (`unlockLevel` preserved at `75, 1, 10, 5, 300, 200` on the 6 pre-existing IDs) and **normalized L1–60 progression** (`progressionTreeLevel` set to `1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60`), `design/drop-in/ninja.json` maps the **12 progression milestones** and **13 ability entries** (with `ninja_shuriken` unlocking alongside `ninja_smoke_bomb` at `progressionTreeLevel: 35`) as follows:

| Milestone (`progressionTreeLevel`) | Ability ID (`id` / `catalogId`) | In `progression[12]`? | Progression `type` | Raw Catalog Status & `unlockLevel` | `kind` / `tab` | `spellId` / `weaponAbilityRef` / `itemId` | `cooldownMs` / `customCooldownMs` | Cost (`mana` / `stam`) | `effectType` & `statusEffect` Summary |
|---:|---|---:|---|---|---|---:|---:|---:|---|
| **`L1`** | `ninja_shadowjump` | Yes (`L1`) | `"passive"` | Pre-existing (`unlockLevel: 75`) | `Passive` / `ability` | `506` / `null` / `null` | `0` / `0` | `0` / `0` | `direct_damage`, `statusEffect: null` (Innate shadow-step positioning + 100% Fencing/Ninjitsu auto-attack loop) |
| **`L5`** | `ninja_focus` | Yes (`L5`) | `"skill"` | Pre-existing (`unlockLevel: 1`) | `SpecialMove` / `ability` | `500` / `null` / `null` | `7000` / `0` | `8` / `0` | `direct_damage` (`1.15x–1.25x`), `ninja_focus_nerve` (`3000ms`, `disarm: 1`) |
| **`L10`** | `ninja_mirror` | Yes (`L10`) | `"spell"` | Pre-existing (`unlockLevel: 10`) | `Spell` / `spell` | `507` / `null` / `null` | `18000` / `0` | `10` / `0` | `self_buff`, `ninja_mirror_clone` (`posture`, `6000ms`, `damage_taken_pct: -8%`, `exclusive_posture`) |
| **`L15`** | `ninja_backstab` | Yes (`L15`) | `"skill"` | New (`unlockLevel: 15`) | `SpecialMove` / `ability` | `504` / `null` / `null` | `10000` / `0` | `0` / `10` | `direct_damage` (`1.15x–1.25x`), `ninja_backstab_stealth` (`stealth`, `5000ms`, `damage_dealt_pct: +6%`) |
| **`L20`** | `ninja_death` | Yes (`L20`) | `"skill"` | Pre-existing (`unlockLevel: 5`) | `SpecialMove` / `ability` | `501` / `null` / `null` | `12000` / `0` | `0` / `12` | `direct_damage` (`1.05x–1.15x`), `ninja_death_mark` (`dot`, `4000ms`, `4x1000ms` ticks; Mode B 5-swing detonation) |
| **`L25`** | `ninja_animal_form` | Yes (`L25`) | `"spell"` | New (`unlockLevel: 25`) | `Spell` / `spell` | `502` / `null` / `null` | `18000` / `0` | `10` / `0` | `self_buff`, `ninja_animal_aspect` (`self_buff`, `8000ms`, `attack_speed_pct: +10%`) |
| **`L30`** | `ninja_infectious_strike` | Yes (`L30`) | `"skill"` | Shared alias (`duelist_infectious_strike`, `unlockLevel: 30`) | `WeaponAbility` / `ability` | `null` / `11` / `null` | `12000` / `0` | `10` / `0` | `direct_damage` (`0.90x–1.00x`), `ninja_infectious_venom` (`dot`, `6000ms`, `3x2000ms` ticks) |
| **`L35`** | `ninja_smoke_bomb` | Yes (`L35`) | `"mechanic"` | New (`unlockLevel: 35`) | `Custom` / `ability` | `null` / `null` / `10248` | `20000` / `20000` | `10` / `0` | `self_buff`, `ninja_smoke_veil` (`stealth`, `6000ms`, `damage_taken_pct: -8%`) |
| **`L35`** | `ninja_shuriken` | Bonus (`abilities[]`) | — | New (`unlockLevel: 20`) | `Custom` / `ability` | `null` / `null` / `10248` | `11000` / `11000` | `8` / `0` | `direct_damage` (`0.75x–0.85x`, `hits: 1`, `splashRatio: 0.75`), `statusEffect: null` |
| **`L40`** | `ninja_ki_attack` | Yes (`L40`) | `"skill"` | New (`unlockLevel: 40`) | `SpecialMove` / `ability` | `503` / `null` / `null` | `10000` / `0` | `12` / `0` | `direct_damage` (`0.95x–1.05x`, `hits: 1`, `splashRatio: 0.85`), `statusEffect: null` |
| **`L45`** | `ninja_surprise_attack` | Yes (`L45`) | `"skill"` | New (`unlockLevel: 45`) | `SpecialMove` / `ability` | `505` / `null` / `null` | `16000` / `0` | `12` / `0` | `debuff` (`1.00x`), `ninja_surprise_malus` (`debuff`, `6000ms`, `defense_pct: -8%`) |
| **`L50`** | `ninja_mirror_r2` | Yes (`L50`) | `"spell"` | Pre-existing (`unlockLevel: 300`) | `Spell` / `spell` | `507` / `null` / `null` | `18000` / `0` | `14` / `0` | `self_buff`, `ninja_mirror_r2_clone` (`posture`, `7000ms`, `damage_taken_pct: -10%`, `damage_dealt_pct: +8%`) |
| **`L60`** | `ninja_death_r2` | Yes (`L60`) | `"feature"` | Pre-existing (`unlockLevel: 200`) | `SpecialMove` / `ability` | `501` / `null` / `null` | `11000` / `0` | `0` / `18` | `direct_damage` (`1.25x–1.35x`, `1.95x` at `hp <= 35%`), `ninja_death_r2_mark` (`dot`, `4000ms`, `4x1000ms` ticks) |

---

## Section 3 — Complete Ability-by-Ability Specification: Mode A vs Mode B (`CLASS-02`, `CLASS-03`)

Every Ninja ability is specified in two complementary execution modes:
- **Mode A (Engine-Strict Specification — Zero Engine Code Changes):** Uses only existing `StatusEffectType`, `EffectModifierStatEnum`, and `SkillEffectTypeEnum` primitives verified in `[[engine-capability-matrix]]` and `src/schemas/skill.schema.ts`.
- **Mode B (Authentic Extension Specification — `<20 LOC` Server C# Hooks):** Binds directly to ModernUO's `MirrorImage`, `DeathStrike`, `Backstab`, `SurpriseAttack`, `SmokeBomb`, and `NinjaWeapon` state machines (`[[modernuo-ninjitsu]]`, `[[ninjitsu-items]]`).

> [!IMPORTANT]
> **Engine Dispatch Invariant for Delayed Detonation & Poison Strikes (`05-RESEARCH.md` Pitfall 2):**  
> In `src/sim/engine.ts:866-973`, setting top-level `skill.effectType: "dot"` skips initial melee weapon hit damage, splash evaluation, and the Mode B `deathStrikeSwingsRemaining = 5` trigger (which resides inside the `direct_damage` branch at `src/sim/engine.ts:969-972`). Conversely, setting `skill.effectType: "direct_damage"` with `skill.statusEffect.effectType: "dot"` executes the initial weapon hit, applies the 3-tick or 4-tick periodic damage over time (`25%` of hit damage per tick at `src/sim/engine.ts:953-965`), **and** arms the Mode B 5-swing delayed detonation! Therefore, `ninja_death`, `ninja_death_r2`, and `ninja_infectious_strike` all use `effectType: "direct_damage"` paired with `statusEffect.effectType: "dot"`.

---

### 3.1 `ninja_shadowjump` — *Shadowjump* / *Salto das Sombras* (`L1` Passive, Raw `unlockLevel: 75`)

- **Canonical ModernUO Formula & C# Provenance (`Shadowjump.cs` — `[[ninjitsu-shadowjump]] C1`..`C3`, `[[modernuo-ninjitsu]] C1`):**
  - Source: `Projects/UOContent/Spells/Ninjitsu/ShadowJump.cs:24-95` (`BookOffset 506`, `RequiredSkill = 50.0`, `RequiredMana = 15`, `TargetRange => 11`).
  - Requires `IsStealthing == true` (`[[ninjitsu-shadowjump]] C2`), teleports the Ninja up to `11` tiles without revealing (`RevealOnCast => false`), and immediately re-invokes `Stealth.OnUse(m)` upon arrival (`[[ninjitsu-shadowjump]] C3`).
- **Idle Adaptation Rationale:**
  - In `mechanics/_raw/bundle/abilities-loader-and-hotbar.js:1165` (`gE.ninja`), `ninja_shadowjump` is already seeded as Ninja's `L1` starter milestone (`unlockLevel: 75` in raw `abilities-catalog.json:1439-1452`). Because 1D automated combat has no ground tile cursor (`REQUIREMENTS.md` Out of Scope), `ninja_shadowjump` serves at `L1` as Ninja's innate shadow-step engagement passive and `100%` weapon auto-attack loop (`progressionTreeLevel: 1`), while preserving `spellId: 506`, `gumpIcon: 21286`, and `unlockLevel: 75`.
- **Mode A (Engine-Strict) Payload:**
  - `id: "ninja_shadowjump"`, `kind: "Passive"`, `tab: "ability"`, `spellId: 506`, `mapScope: "UO"`, `gumpIcon: 21286`, `iconKey: "gump_21286"`.
  - `cooldownMs: 0`, `customCooldownMs: 0`, `manaCost: 0`, `staminaCost: 0`, `effectType: "direct_damage"`, `statusEffect: null`.
  - `scalingFormula`: `{ "stat": "ninjitsu", "minMultiplier": 1.0, "maxMultiplier": 1.0 }`.
- **Mode B (Authentic Extension) Behavior:**
  - Passively maintains shadow-step engagement range on each newly spawned hunt target and refreshes `CombatStealthUntil` when entering combat.

---

### 3.2 `ninja_focus` — *Focus Attack* / *Ataque Focado* (`L5` Skill, Raw `unlockLevel: 1`)

- **Canonical ModernUO Formula & C# Provenance (`FocusAttack.cs` — `[[ninjitsu-focus-attack]] C1`..`C4`):**
  - Source: `Projects/UOContent/Spells/Ninjitsu/FocusAttack.cs:7-49` (`BookOffset 500`, `RequiredSkill = 30.0` in `Core.ML`, `BaseMana = 10` in `Core.ML`).
  - Requires a hand-equipped melee weapon (`Kryss`, `Tekagi`, `Kama`, `Sai`, `Lajatang`, `Tessen`, `Bokuto`) with **no shield** (`from.FindItemOnLayer(Layer.TwoHanded) as BaseShield != null` blocks execution, `[[ninjitsu-focus-attack]] C2`).
  - Multiplies swing damage and weapon property procs by:
    $$\text{DamageScalar} = 1.0 + \frac{\text{Ninjitsu}^2}{43636.0} \quad (1.229\times \text{ at } 100\text{ Ninjitsu},\; 1.330\times \text{ at } 120\text{ Ninjitsu})$$
    $$\text{PropertyBonus} = 1.0 + \left(\frac{\text{Ninjitsu}^2}{43636.0} \times 3 + 0.01\right)$$
- **Idle Adaptation Rationale:**
  - Seeded in `mE.ninja` (`slotIndex: 4`) as Ninja's signature low-cooldown precision strike (`cooldownMs: 7000`, `manaCost: 8`). Applies a `3,000ms` nerve-pinch stagger (`ninja_focus_nerve`, `disarm: 1`) representing the amplified `PropertyBonus` nerve strike, which keeps Ninja's `ehpPerSec` inside the physical baseline band (`15.55` at `L10`, `45.90` at `L25`, `149.46` at `L45`, `325.83` at `L60`).
- **Mode A (Engine-Strict) Payload:**
  - `id: "ninja_focus"`, `kind: "SpecialMove"`, `tab: "ability"`, `spellId: 500`, `mapScope: "UO"`, `gumpIcon: 21280`, `iconKey: "gump_21280"`.
  - `cooldownMs: 7000`, `customCooldownMs: 0`, `manaCost: 8`, `staminaCost: 0`, `effectType: "direct_damage"`.
  - `scalingFormula`: `{ "stat": "ninjitsu", "minMultiplier": 1.15, "maxMultiplier": 1.25 }`.
  - `statusEffect`: `{ "id": "ninja_focus_nerve", "name": "Focus Nerve", "effectType": "debuff", "durationMs": 3000, "tickIntervalMs": 0, "tickCount": 0, "modifiers": [{ "stat": "disarm", "value": 1 }], "stackingRule": "refresh", "authorityTier": "design-proposal" }`.
- **Mode B (Authentic Extension) Behavior:**
  - Executes native `FocusAttack.OnHit` (`spellId: 500`) with `1.0 + Ninjitsu^2 / 43636` damage scaling and `GetPropertyBonus` weapon proc amplification.

---

### 3.3 `ninja_mirror` — *Mirror Image* / *Imagem Espelhada* (`L10` Spell, Raw `unlockLevel: 10`)

- **Canonical ModernUO Formula & C# Provenance (`MirrorImage.cs` — `[[ninjitsu-mirror-image]] C1`..`C4`, `[[modernuo-bushido]] C9`):**
  - Source: `Projects/UOContent/Spells/Ninjitsu/MirrorImage.cs:27-200` (`BookOffset 507`, `RequiredSkill = 20.0` in `Core.ML`, `RequiredMana = 10`, `1.5s` cast).
  - Summons a `Clone` (`1` follower slot, `[[ninjitsu-mirror-image]] C2`) lasting `30.0 + Ninjitsu / 4.0` seconds (`[[ninjitsu-mirror-image]] C3`).
  - In `BaseWeapon.OnHit` (`[[modernuo-bushido]] C9`), if the defender has an active clone within `4` tiles, each incoming melee hit is diverted to the clone with probability:
    $$P(\text{Intercept}) = \frac{\text{Ninjitsu}}{150.0} \quad (66.7\% \text{ at } 100\text{ Ninjitsu},\; 80.0\% \text{ at } 120\text{ Ninjitsu})$$
    The clone is immediately destroyed (`Delete()`) upon absorbing `1` hit (`[[ninjitsu-mirror-image]] C4`).
- **Idle Adaptation Rationale:**
  - As proven in `design/MODERNUO_MAPPING.md §1.2`, an unthrottled `1.5s` recast of `MirrorImage` in an automated tick loop would create permanent avoidance immortality against slow-swinging bosses (`T-05-04`). Setting `cooldownMs: 18000` with `durationMs: 6000` and `damage_taken_pct: -8` (`exclusive_posture`) in Mode A—and capping Mode B to `1` ablative clone per cast with a `1,500ms` interception ICD—delivers bounded, deterministic clone mitigation.
- **Mode A (Engine-Strict) Payload:**
  - `id: "ninja_mirror"`, `kind: "Spell"`, `tab: "spell"`, `spellId: 507`, `mapScope: "UO"`, `gumpIcon: 21287`, `iconKey: "gump_21287"`.
  - `cooldownMs: 18000`, `customCooldownMs: 0`, `manaCost: 10`, `staminaCost: 0`, `effectType: "self_buff"`.
  - `scalingFormula`: `{ "stat": "ninjitsu" }`.
  - `statusEffect`: `{ "id": "ninja_mirror_clone", "name": "Mirror Image", "effectType": "posture", "durationMs": 6000, "tickIntervalMs": 0, "tickCount": 0, "modifiers": [{ "stat": "damage_taken_pct", "value": -8 }], "stackingRule": "exclusive_posture", "authorityTier": "design-proposal" }`.
- **Mode B (Authentic Extension) Behavior:**
  - Grants `1` ablative `cloneStacks` charge (`src/sim/engine.ts:893-895, 1152-1161`). On an incoming boss or mob swing (`1,500ms` ICD), rolls `Ninjitsu / 150.0` to intercept the hit, consuming `1` clone stack and reducing the intercepted blow (`0.70x` effective hit mitigation in `src/sim/engine.ts:1160`, or `1` absorbed hit on the server).

---

### 3.4 `ninja_backstab` — *Backstab* / *Punhalada pelas Costas* (`L15` Skill, `unlockLevel: 15`)

- **Canonical ModernUO Formula & C# Provenance (`Backstab.cs` — `[[ninjitsu-backstab]] C1`..`C4`):**
  - Source: `Projects/UOContent/Spells/Ninjitsu/Backstab.cs:8-42` (`BookOffset 504` / `505`, `RequiredSkill = 40.0` in `Core.ML`, `BaseMana = 30`).
  - Requires `from.Hidden && from.AllowedStealthSteps > 0` (`[[ninjitsu-backstab]] C3`), locks `Stealth` for `5.0s` (`[[ninjitsu-backstab]] C4`), reveals the attacker, and scales damage by:
    $$\text{DamageScalar} = 1.0 + \frac{\text{Ninjitsu}}{360.0} + \frac{\text{StalkingBonus}}{100.0} \quad (\approx 1.28\times\text{–}1.45\times)$$
- **Idle Adaptation Rationale:**
  - In 24/7 automated combat, the Ninja is continuously engaged in combat and cannot manually walk out of combat to hide (`design/MODERNUO_MAPPING.md §1.1`). At `L15`, `ninja_backstab` executes an ambush strike (`1.15x–1.25x`, `staminaCost: 10`, `cooldownMs: 10000`) and applies a `5,000ms` `stealth` status effect (`ninja_backstab_stealth`, `damage_dealt_pct: +6%`) that chains with `DeathStrike` and `SurpriseAttack`.
- **Mode A (Engine-Strict) Payload:**
  - `id: "ninja_backstab"`, `kind: "SpecialMove"`, `tab: "ability"`, `spellId: 504`, `mapScope: "UO"`, `gumpIcon: 21284`, `iconKey: "gump_21284"`.
  - `cooldownMs: 10000`, `customCooldownMs: 0`, `manaCost: 0`, `staminaCost: 10`, `effectType: "direct_damage"`.
  - `scalingFormula`: `{ "stat": "ninjitsu", "minMultiplier": 1.15, "maxMultiplier": 1.25 }`.
  - `statusEffect`: `{ "id": "ninja_backstab_stealth", "name": "Backstab Stealth", "effectType": "stealth", "durationMs": 5000, "tickIntervalMs": 0, "tickCount": 0, "modifiers": [{ "stat": "damage_dealt_pct", "value": 6 }], "stackingRule": "refresh", "authorityTier": "design-proposal" }`.
- **Mode B (Authentic Extension) Behavior:**
  - Consumes active combat stealth (`CombatStealthUntil > Core.TickCount` from `SmokeBomb` or `Shadowjump`) to deliver the full `1.0 + Ninjitsu / 360.0 + StalkingBonus / 100.0` ambush scalar.

---

### 3.5 `ninja_death` — *Death Strike* / *Golpe Mortal* (`L20` Skill, Raw `unlockLevel: 5`)

- **Canonical ModernUO Formula & C# Provenance (`DeathStrike.cs` — `[[ninjitsu-death-strike]] C1`..`C5`):**
  - Source: `Projects/UOContent/Spells/Ninjitsu/DeathStrike.cs:13-145` (`BookOffset 501`, `RequiredSkill = 85.0`, `BaseMana = 30`).
  - Initial strike deals `0.5x` weapon damage (`GetDamageScalar => 0.5`, `[[ninjitsu-death-strike]] C1`) and plants a `5.0s` `DeathStrikeTimer` on the defender (`[[ninjitsu-death-strike]] C4`).
  - **5-Step Detonation Condition (`DeathStrike.AddStep` — `[[ninjitsu-death-strike]] C3`, `C5`):** When `++timer.Steps >= 5` or `5.0s` elapses, deals direct unmitigated damage (`AOS.Damage(m_Target, m_Attacker, damage, 100, 0, 0, 0, 0)`):
    $$\text{scalar} = \min\!\left(1.0,\; \frac{\text{Hiding} + \text{Stealth}}{220.0}\right)$$
    $$\text{Damage}_{\text{Steps} \ge 5} = \min\!\left(60,\; \left\lfloor\frac{\text{Ninjitsu}}{3.0} \times (0.3 + 0.7 \times \text{scalar})\right\rfloor + \text{StalkingBonus}\right)$$
    $$\text{Damage}_{\text{Steps} < 5} = \min\!\left(30,\; \left\lfloor\frac{\text{Ninjitsu}}{9.0} \times (0.3 + 0.7 \times \text{scalar})\right\rfloor + \text{StalkingBonus}\right)$$
- **Idle Adaptation Rationale:**
  - Normalized from raw catalog `unlock: 5` to `progressionTreeLevel: 20`. Because 1D automated combat has no 2D tile coordinates, a literal check of `Steps >= 5` tiles walked by the defender would always evaluate to `Steps = 0`, permanently halving `DeathStrike` to its stationary `Ninjitsu / 9` cap (`design/MODERNUO_MAPPING.md §1.2`). Translating `DeathStrike` into a **4-tick internal trauma DoT in Mode A** and a **5-swing weapon hit counter (`state.deathStrikeSwingsRemaining = 5`) in Mode B** preserves the exact 5-step delayed detonation fantasy in 1D combat.
- **Mode A (Engine-Strict) Payload:**
  - `id: "ninja_death"`, `kind: "SpecialMove"`, `tab: "ability"`, `spellId: 501`, `mapScope: "UO"`, `gumpIcon: 21281`, `iconKey: "gump_21281"`.
  - `cooldownMs: 12000`, `customCooldownMs: 0`, `manaCost: 0`, `staminaCost: 12`, `effectType: "direct_damage"`.
  - `scalingFormula`: `{ "stat": "ninjitsu", "minMultiplier": 1.05, "maxMultiplier": 1.15 }`.
  - `statusEffect`: `{ "id": "ninja_death_mark", "name": "Death Mark", "effectType": "dot", "durationMs": 4000, "tickIntervalMs": 1000, "tickCount": 4, "modifiers": [], "stackingRule": "refresh", "authorityTier": "design-proposal" }`.
- **Mode B (Authentic Extension) Behavior:**
  - Initial strike arms `state.deathStrikeSwingsRemaining = 5` and stores `state.deathStrikePendingDamage` (`1.05x` of hit damage). Each subsequent Ninja weapon swing decrements `deathStrikeSwingsRemaining` (`DeathStrike.AddStep(defender)` on the server); on the 5th connected swing, the mark detonates for instant unmitigated pressure-point damage.

---

### 3.6 `ninja_animal_form` — *Animal Form* / *Forma Animal* (`L25` Spell, `unlockLevel: 25`)

- **Canonical ModernUO Formula & C# Provenance (`AnimalForm.cs` — `[[ninjitsu-animal-form]] C1`..`C4`, `[[modernuo-bushido]] C11`, `C13`):**
  - Source: `Projects/UOContent/Spells/Ninjitsu/AnimalForm.cs:39-555` (`BookOffset 502`, `RequiredSkill = 0.0..100.0`, `RequiredMana = 10` in `Core.ML`).
  - Offers `16` Ninjitsu forms (`Rat`/`Rabbit` `+20` Stealth at `20.0`; `GiantSerpent`/`BullFrog` poison procs at `50.0`; `CuSidhe` `20..50` HP bandage heal/`8s` at `60.0`; `GreyWolf`/`BakeKitsune` `+20%` Hit Chance Increase at `82.5`; `Reptalon` `20` fire breath at `90.0`; `Kirin`/`Unicorn` at `100.0`).
- **Idle Adaptation Rationale:**
  - In canonical ModernUO (`SpecialMove.cs:150`), morphing into an animal body via a modal gump blocks weapon `SpecialMove` execution (`AnimalForm.UnderTransformation(from)` returns `false` in `SpecialMove.Validate`). In 24/7 automated combat, locking out `FocusAttack`, `Backstab`, `KiAttack`, `SurpriseAttack`, and `DeathStrike` would cripple the Ninja's rotation (`REQUIREMENTS.md` Out of Scope: modal gump menus). Therefore, `ninja_animal_form` is adapted as an **8.0s Grey Wolf / Bake Kitsune combat aspect buff** (`+10%` `attack_speed_pct` on an `18,000ms` cooldown) that enhances melee weapon cadence without locking out `SpecialMove` skills.
- **Mode A (Engine-Strict) Payload:**
  - `id: "ninja_animal_form"`, `kind: "Spell"`, `tab: "spell"`, `spellId: 502`, `mapScope: "UO"`, `gumpIcon: 21282`, `iconKey: "gump_21282"`.
  - `cooldownMs: 18000`, `customCooldownMs: 0`, `manaCost: 10`, `staminaCost: 0`, `effectType: "self_buff"`.
  - `scalingFormula`: `{ "stat": "ninjitsu" }`.
  - `statusEffect`: `{ "id": "ninja_animal_aspect", "name": "Animal Aspect", "effectType": "self_buff", "durationMs": 8000, "tickIntervalMs": 0, "tickCount": 0, "modifiers": [{ "stat": "attack_speed_pct", "value": 10 }], "stackingRule": "refresh", "authorityTier": "design-proposal" }`.
- **Mode B (Authentic Extension) Behavior:**
  - Applies the Grey Wolf / Bake Kitsune combat aspect (`+10%` swing speed + `+20%` HCI in `BaseWeapon.CheckHit` per `[[modernuo-bushido]] C11`) while bypassing the `AnimalForm.UnderTransformation` check in `SpecialMove.Validate` when `from.IsIdleHunting`.

---

### 3.7 `ninja_infectious_strike` — *Infectious Strike* / *Golpe Infeccioso* (`L30` WeaponAbility, `unlockLevel: 30`)

- **Canonical ModernUO Formula & C# Provenance (`InfectiousStrike.cs` — `WeaponAbility` ID `11`):**
  - Source: `Projects/UOContent/Items/Weapons/Abilities/InfectiousStrike.cs` (`WeaponAbility.InfectiousStrike`, `ref: 11`).
  - Canonical `PrimaryAbility` of the Ninja's starter `Kryss` (`5121`). Coats the blade in poison and inflicts a virulent poison DoT on the target.
- **Idle Adaptation Rationale:**
  - Unlocked at `L30` (`aliasOf: "duelist_infectious_strike"`, `weaponAbilityRef: 11`) to pair Ninja's starter `Kryss` with a 3-tick poison DoT (`6,000ms`, `3x2000ms` ticks) without requiring consumable poison potions in the player's backpack.
- **Mode A (Engine-Strict) Payload:**
  - `id: "ninja_infectious_strike"`, `aliasOf: "duelist_infectious_strike"`, `kind: "WeaponAbility"`, `tab: "ability"`, `weaponAbilityRef: 11`, `mapScope: "UO"`, `gumpIcon: 20999`, `iconKey: "gump_20999"`.
  - `cooldownMs: 12000`, `customCooldownMs: 0`, `manaCost: 10`, `staminaCost: 0`, `effectType: "direct_damage"`.
  - `scalingFormula`: `{ "stat": "weapon", "minMultiplier": 0.90, "maxMultiplier": 1.00 }`.
  - `statusEffect`: `{ "id": "ninja_infectious_venom", "name": "Infectious Venom", "effectType": "dot", "durationMs": 6000, "tickIntervalMs": 2000, "tickCount": 3, "modifiers": [], "stackingRule": "refresh", "authorityTier": "server-authoritative" }`.
- **Mode B (Authentic Extension) Behavior:**
  - Executes `WeaponAbility.InfectiousStrike` (`ref: 11`) on the equipped `Kryss`, applying Ninjitsu-scaled poison ticks without decrementing item `PoisonCharges`.

---

### 3.8 `ninja_smoke_bomb` — *Smoke Bomb* / *Bomba de Fumaça* (`L35` Mechanic, `unlockLevel: 35`)

- **Canonical ModernUO Formula & C# Provenance (`SmokeBomb.cs` & `EggBomb.cs` — `[[ninjitsu-stealth-hiding]] C1`..`C4`):**
  - Source: `Projects/UOContent/Items/Skill Items/Ninjitsu/SmokeBomb.cs:9-50` & `EggBomb.cs:9-50` (`itemId: 10248` / `0x2808` and `10249` / `0x2809`).
  - Requires `Ninjitsu >= 50.0` (`[[ninjitsu-stealth-hiding]] C1`) and `Mana >= 10` (`[[ninjitsu-stealth-hiding]] C2`).
  - Deducts `10` Mana, sets `Hiding.CombatOverride = true`, invokes `from.UseSkill(SkillName.Hiding)` while in active combat, clears target warmode/combatants, and consumes `1` bomb (`[[ninjitsu-stealth-hiding]] C3`, `C4`).
- **Idle Adaptation Rationale:**
  - Per `REQUIREMENTS.md` Out of Scope, 24/7 AFK hunting cannot rely on depletable backpack stacks of `SmokeBomb` or `EggBomb`. Implementing `ninja_smoke_bomb` (`itemId: 10248`) as a `Custom` cooldown mechanic (`cooldownMs: 20000`, `customCooldownMs: 20000`, `manaCost: 10`) grants a `6,000ms` mid-combat `stealth` veil (`ninja_smoke_veil`, `damage_taken_pct: -8%`) that powers stealth openers and boss survival indefinitely.
- **Mode A (Engine-Strict) Payload:**
  - `id: "ninja_smoke_bomb"`, `kind: "Custom"`, `tab: "ability"`, `itemId: 10248`, `mapScope: "Idle"`, `gumpIcon: 10248`, `iconKey: "idle_ninja_smoke_bomb"`.
  - `cooldownMs: 20000`, `customCooldownMs: 20000`, `manaCost: 10`, `staminaCost: 0`, `effectType: "self_buff"`.
  - `scalingFormula`: `{ "stat": "ninjitsu" }`.
  - `statusEffect`: `{ "id": "ninja_smoke_veil", "name": "Smoke Veil", "effectType": "stealth", "durationMs": 6000, "tickIntervalMs": 0, "tickCount": 0, "modifiers": [{ "stat": "damage_taken_pct", "value": -8 }], "stackingRule": "refresh", "authorityTier": "design-proposal" }`.
- **Mode B (Authentic Extension) Behavior:**
  - Sets `ninja.CombatStealthUntil = Core.TickCount + 6000` (`Hiding.CombatOverride = true`) on a `20.0s` cooldown without consuming a physical `SmokeBomb` / `EggBomb` stack, arming the next `Backstab` or `SurpriseAttack` opener.

---

### 3.9 `ninja_shuriken` — *Shuriken & Fukiya Volley* / *Saraivada de Shuriken e Fukiya* (`L35` Bonus Ability, Raw `unlockLevel: 20`)

- **Canonical ModernUO Formula & C# Provenance (`NinjaWeapons.cs`, `LeatherNinjaBelt.cs`, `Shuriken.cs`, `Fukiya.cs`, `FukiyaDarts.cs` — `[[ninjitsu-items]] C1`..`C4`):**
  - Source: `Projects/UOContent/Items/Weapons/SE Weapons/NinjaWeapons.cs:41-300`, `LeatherNinjaBelt.cs` (`0x2790`), `Shuriken.cs` (`10156` / `0x27AC`), `Fukiya.cs` (`10154` / `0x27AA`), `FukiyaDarts.cs` (`0x2806`).
  - Shared `NinjaWeapon` controller: `MaxUses = 10` (`[[ninjitsu-items]] C1`), requires `BasePotion.HasFreeHand(from)` (`[[ninjitsu-items]] C3`), rolls `Ninjitsu` hit chance against defender weapon skill, lands after `1.0s` with a `2.5s` `NinjaWepCooldown` (`[[ninjitsu-items]] C2`), deals `3..5` (`Shuriken`, range `2..10`) or `4..6` (`Fukiya`, range `0..6`) physical damage, and transfers loaded `Poison` charges (`[[ninjitsu-items]] C4`).
- **Idle Adaptation Rationale:**
  - Unlocked alongside `ninja_smoke_bomb` at `progressionTreeLevel: 35` (`unlockLevel: 20`) as a cooldown-gated `Custom` ability (`cooldownMs: 11000`, `customCooldownMs: 11000`, `manaCost: 8`) with `splashRatio: 0.75` (`0.75x–0.85x` Ninjitsu scaling), giving Ninja a reliable multi-target projectile/dart volley without manual belt/blowgun reloading.
- **Mode A (Engine-Strict) Payload:**
  - `id: "ninja_shuriken"`, `kind: "Custom"`, `tab: "ability"`, `itemId: 10248`, `mapScope: "Idle"`, `gumpIcon: 10156`, `iconKey: "idle_ninja_shuriken"`.
  - `cooldownMs: 11000`, `customCooldownMs: 11000`, `manaCost: 8`, `staminaCost: 0`, `effectType: "direct_damage"`, `statusEffect: null`.
  - `scalingFormula`: `{ "stat": "ninjitsu", "minMultiplier": 0.75, "maxMultiplier": 0.85, "hits": 1, "splashRatio": 0.75 }`.
- **Mode B (Authentic Extension) Behavior:**
  - Invokes `NinjaWeapon.Shoot` (`Shuriken` `10156` / `Fukiya` `10154`) using `Ninjitsu` hit accuracy and secondary target splash without decrementing `UsesRemaining`.

---

### 3.10 `ninja_ki_attack` — *Ki Attack* / *Ataque de Ki* (`L40` Skill, `unlockLevel: 40`)

- **Canonical ModernUO Formula & C# Provenance (`KiAttack.cs` — `[[ninjitsu-ki-attack]] C1`..`C4`):**
  - Source: `Projects/UOContent/Spells/Ninjitsu/KiAttack.cs:11-115` (`BookOffset 503`, `RequiredSkill = 80.0`, `BaseMana = 25`).
  - Disallows stealth and ranged weapons (`[[ninjitsu-ki-attack]] C2`), starts a `2.0s` timer (`[[ninjitsu-ki-attack]] C4`), and scales melee damage by Euclidean distance traveled (`\sqrt{\Delta x^2 + \Delta y^2}`, capped at `20.0` tiles):
    $$\text{DamageScalar}_{\text{PvM}} = 1.0 + \frac{\min(20.0,\; \text{distance})}{10.0} \quad (1.0\times \text{ to } 3.0\times)$$
- **Idle Adaptation Rationale:**
  - In a stationary 1D combat loop, literal Euclidean tile distance `\sqrt{\Delta x^2 + \Delta y^2}` is `0`, which would yield `0` bonus (`design/MODERNUO_MAPPING.md §1.2`). Modeling `ninja_ki_attack` at `L40` as a high-velocity gap-closing dash strike (`0.95x–1.05x` primary hit + `splashRatio: 0.85` kinetic shockwave onto a second target, `cooldownMs: 10000`, `manaCost: 12`) gives Ninja strong L40–L60 `multi_target_pack` throughput (`208.70` DPS at `L45`, `426.76` DPS at `L60`).
- **Mode A (Engine-Strict) Payload:**
  - `id: "ninja_ki_attack"`, `kind: "SpecialMove"`, `tab: "ability"`, `spellId: 503`, `mapScope: "UO"`, `gumpIcon: 21283`, `iconKey: "gump_21283"`.
  - `cooldownMs: 10000`, `customCooldownMs: 0`, `manaCost: 12`, `staminaCost: 0`, `effectType: "direct_damage"`, `statusEffect: null`.
  - `scalingFormula`: `{ "stat": "ninjitsu", "minMultiplier": 0.95, "maxMultiplier": 1.05, "hits": 1, "splashRatio": 0.85 }`.
- **Mode B (Authentic Extension) Behavior:**
  - Evaluates `KiAttack.GetBonus` using a virtual gap-close dash distance in 1D idle combat and splashes `85%` kinetic ki damage to an adjacent enemy.

---

### 3.11 `ninja_surprise_attack` — *Surprise Attack* / *Ataque Surpresa* (`L45` Skill, `unlockLevel: 45`)

- **Canonical ModernUO Formula & C# Provenance (`SurpriseAttack.cs` — `[[ninjitsu-surprise-attack]] C1`..`C4`, `[[modernuo-bushido]] C12`):**
  - Source: `Projects/UOContent/Spells/Ninjitsu/SurpriseAttack.cs:11-112` (`BookOffset 505` / `504`, `RequiredSkill = 60.0` in `Core.ML`, `BaseMana = 20`).
  - Requires stealth (`[[ninjitsu-surprise-attack]] C2`), reveals on swing, and applies an `8.0s` defense-chance malus (`[[ninjitsu-surprise-attack]] C3`, `C4`) subtracted from the defender's DCI in `BaseWeapon.CheckHit` (`[[modernuo-bushido]] C12`):
    $$\text{Malus}_{\text{DCI}} = \left\lfloor\frac{\text{Ninjitsu}_{\text{Fixed}}}{60}\right\rfloor + \lfloor\text{StalkingBonus}\rfloor \quad (-16 \text{ to } -25\text{ DCI})$$
- **Idle Adaptation Rationale:**
  - Unlocked at `L45` (`cooldownMs: 16000`, `manaCost: 12`, `effectType: "debuff"`) to provide Ninja's boss defense shred (`defense_pct: -8%` for `6,000ms`), boosting `high_def_boss` throughput (`92.90` DPS at `L45`, `183.56` DPS at `L60`).
- **Mode A (Engine-Strict) Payload:**
  - `id: "ninja_surprise_attack"`, `kind: "SpecialMove"`, `tab: "ability"`, `spellId: 505`, `mapScope: "UO"`, `gumpIcon: 21285`, `iconKey: "gump_21285"`.
  - `cooldownMs: 16000`, `customCooldownMs: 0`, `manaCost: 12`, `staminaCost: 0`, `effectType: "debuff"`.
  - `scalingFormula`: `{ "stat": "ninjitsu", "minMultiplier": 1.0, "maxMultiplier": 1.0 }`.
  - `statusEffect`: `{ "id": "ninja_surprise_malus", "name": "Surprise Malus", "effectType": "debuff", "durationMs": 6000, "tickIntervalMs": 0, "tickCount": 0, "modifiers": [{ "stat": "defense_pct", "value": -8 }], "stackingRule": "refresh", "authorityTier": "design-proposal" }`.
- **Mode B (Authentic Extension) Behavior:**
  - Consumes active combat stealth (`CombatStealthUntil > Core.TickCount`) and applies `SurpriseAttackTimer(defender, malus)` (`-8%` physical defense & `-16..-25` DCI for `6.0s`).

---

### 3.12 `ninja_mirror_r2` — *Mirror Image II* / *Imagem Espelhada II* (`L50` Spell, Raw `unlockLevel: 300`)

- **Canonical ModernUO Formula & C# Provenance (`MirrorImage.cs` Rank II Mastery — `[[ninjitsu-mirror-image]] C1`..`C4`):**
  - Pre-existing catalog entry (`abilities-catalog.json:1467-1480`, `ref: 507`, raw `unlock: 300`, `mana: 10`).
  - Represents Master (`L50`) shadow-clone coordination: deploys offensive/defensive shadow decoys that both divert incoming blows (`damage_taken_pct: -10%`) and flank the target (`damage_dealt_pct: +8%`) for `7,000ms`.
- **Idle Adaptation Rationale:**
  - Normalized from legacy `unlock: 300` to `progressionTreeLevel: 50`. Replaces Rank I `Mirror Image` in the `exclusive_posture` slot during endgame encounters.
- **Mode A (Engine-Strict) Payload:**
  - `id: "ninja_mirror_r2"`, `kind: "Spell"`, `tab: "spell"`, `spellId: 507`, `mapScope: "UO"`, `gumpIcon: 21287`, `iconKey: "gump_21287"`.
  - `cooldownMs: 18000`, `customCooldownMs: 0`, `manaCost: 14`, `staminaCost: 0`, `effectType: "self_buff"`.
  - `scalingFormula`: `{ "stat": "ninjitsu" }`.
  - `statusEffect`: `{ "id": "ninja_mirror_r2_clone", "name": "Mirror Image II", "effectType": "posture", "durationMs": 7000, "tickIntervalMs": 0, "tickCount": 0, "modifiers": [{ "stat": "damage_taken_pct", "value": -10 }, { "stat": "damage_dealt_pct", "value": 8 }], "stackingRule": "exclusive_posture", "authorityTier": "design-proposal" }`.
- **Mode B (Authentic Extension) Behavior:**
  - Summons a Rank II shadow clone (`cloneStacks = 1`, `Ninjitsu / 150.0` interception with `1,500ms` ICD) while granting `+8%` coordinated clone flanking damage for `7.0s`.

---

### 3.13 `ninja_death_r2` — *Death Strike II* / *Golpe Mortal II* (`L60` Capstone Feature, Raw `unlockLevel: 200`)

- **Canonical ModernUO Formula & C# Provenance (`DeathStrike.cs` Rank II Capstone — `[[ninjitsu-death-strike]] C1`..`C5`):**
  - Pre-existing catalog entry (`abilities-catalog.json:1453-1466`, `ref: 501`, raw `unlock: 200`, `mana: 30`).
  - Represents Grandmaster (`100.0–120.0` Ninjitsu + `Hiding` + `Stealth`) mastery of `DeathStrike`, combining a `1.25x–1.35x` vital strike (`1.95x` execute amplification when `enemy.hp <= 35%`) with a 4-tick pressure-point bleed in Mode A or a 5-swing delayed detonation in Mode B.
- **Idle Adaptation Rationale:**
  - Normalized from legacy `unlock: 200` to `progressionTreeLevel: 60` as Ninja's capstone feature (`type: "feature"`). Consumes `18` Stamina (`manaCost: 0`) to balance Ninja's Mana/Stamina economy at `L60` (`+26.0` net mana/min, `+426.0` net stamina/min), producing `374.50` sustained boss DPS (squarely inside the `351.58–387.85` live L60 envelope).
- **Mode A (Engine-Strict) Payload:**
  - `id: "ninja_death_r2"`, `kind: "SpecialMove"`, `tab: "ability"`, `spellId: 501`, `mapScope: "UO"`, `gumpIcon: 21281`, `iconKey: "gump_21281"`.
  - `cooldownMs: 11000`, `customCooldownMs: 0`, `manaCost: 0`, `staminaCost: 18`, `effectType: "direct_damage"`.
  - `scalingFormula`: `{ "stat": "ninjitsu", "minMultiplier": 1.25, "maxMultiplier": 1.35, "executeThresholdHpPct": 35, "executeMultiplier": 1.95 }`.
  - `statusEffect`: `{ "id": "ninja_death_r2_mark", "name": "Death Mark II", "effectType": "dot", "durationMs": 4000, "tickIntervalMs": 1000, "tickCount": 4, "modifiers": [], "stackingRule": "refresh", "authorityTier": "design-proposal" }`.
- **Mode B (Authentic Extension) Behavior:**
  - Delivers the `1.25x–1.35x` (`1.95x` below `35%` HP) initial strike and arms the 5-swing delayed detonation (`state.deathStrikeSwingsRemaining = 5`, detonating on the 5th connected weapon swing via `DeathStrike.AddStep(defender)`).

---

## Section 4 — Mode B Native Server Hook Specification (`<20 LOC` C# Snippet, `CLASS-03`)

To run Mode B on the ModernUO shard with bounded `MirrorImage` clone interception, 5-swing `DeathStrike` detonation in stationary 1D combat, and mid-combat `SmokeBomb` stealth openers, only **16 lines of executable C#** are required inside `BaseWeapon.OnHit`:

```csharp
// Mode B Server Hook (16 LOC total in Projects/UOContent/Items/Weapons/BaseWeapon.cs)
// 1. OnIncomingHit: Ablative Mirror Image Clone Interception with 1.5s ICD (8 LOC)
if (MirrorImage.HasClone(defender) && Core.TickCount - defender.NextCloneIntercept >= 1500
    && defender.Skills.Ninjitsu.Value / 150.0 > Utility.RandomDouble()) {
    defender.NextCloneIntercept = Core.TickCount;
    MirrorImage.ConsumeOneClone(defender); // Destroys 1 clone & decrements cloneStacks
    damage = (int)(damage * 0.30); // Bounded ablative clone mitigation (prevents immortality)
}
// 2. OnWeaponSwingHit: 5-Swing DeathStrike Detonation & Stealth Opener Consumption (8 LOC)
if (attacker is PlayerMobile nj && nj.ClassId == 115) {
    DeathStrike.AddStep(defender); // Every connected Ninja swing advances ++Steps toward 5!
    if (nj.CombatStealthUntil > Core.TickCount && (move is Backstab || move is SurpriseAttack)) {
        nj.CombatStealthUntil = 0; // Consumes SmokeBomb / Shadowjump stealth window
        damage = (int)(damage * 1.15);
    }
}
```

### Verification of `<20 LOC` Hook Guarantees
1. **Zero Avoidance-Immortality Loops (`T-05-04`):** `defender.NextCloneIntercept` enforces a `1,500ms` internal cooldown and `MirrorImage.ConsumeOneClone(defender)` destroys the active clone on interception, ensuring `MirrorImage` cannot lock bosses into 0-damage loops.
2. **Stationary 5-Swing `DeathStrike` Detonation:** Calling `DeathStrike.AddStep(defender)` on each connected Ninja melee swing allows a high-DEX Fencing Ninja (`Kryss` / `Tekagi` / `Kama` / `Sai`) to reach `++Steps >= 5` inside the `5.0s` `DeathStrikeTimer` window without moving across 2D map tiles.
3. **Backpack-Free Combat Stealth Openers:** `nj.CombatStealthUntil` (set by `SmokeBomb` / `Shadowjump`) satisfies `Backstab` and `SurpriseAttack` stealth prerequisites in mid-combat and is cleanly consumed on hit.

---

## Section 5 — Tokuno Ninja Weapon & Item Synergies & Bilingual Localization Table (`en` / `pt-BR`)

### 5.1 Tokuno Weapons, Ninja Armor & Ninjitsu Projectiles (`[[ninjitsu-items]]`)

Per `[[ninjitsu-items]] C1`..`[[ninjitsu-items]] C4` and `design/MODERNUO_MAPPING.md §5.1–§5.2`, Ninja's equipment kit combines high-speed Fencing/Macing weapons with cooldown-gated Tokuno tools:

| Item / Weapon Name | Item ID (`graphic`) | Governing Skill & Layer | Speed & Base Damage | Primary `WeaponAbility` / Effect | Secondary `WeaponAbility` / Rule | Ninja (`Ninjitsu`) Synergy Role |
|---|---:|---|---|---|---|---|
| **Kryss** (Starter) | `5121` (`0x1401`) | `fencing` (`42`), `OneHanded` | Speed `53`, Dmg `10–12` | `ArmorIgnore` (`ref: 1`) | `InfectiousStrike` (`ref: 11`, **`L30`**) | Fast 1H starter blade (`Speed 53`); leaves off-hand free for `FocusAttack`, `Shuriken`, and `Fukiya`, and unlocks `L30` `InfectiousStrike` natively. |
| **Tekagi** | `10244` (`0x2804`) | `fencing` (`42`), `TwoHanded` | Speed `55`, Dmg `10–12` | `DualWield` (`ref: 23`) | `TalonStrike` (`ref: 21`) | Signature Tokuno hand claws (`Speed 55`); `DualWield` attack speed proc accelerates 5-swing `DeathStrike` detonation. |
| **Kama** | `10246` (`0x2806` / `0x27AD`) | `fencing` (`42`), `TwoHanded` | Speed `55`, Dmg `9–11` | `WhirlwindAttack` (`ref: 13`) | `DefenseMastery` (`ref: 18`) | Ultra-fast twin sickles (`Speed 55`) for multi-target pack clearing and defensive evasion. |
| **Sai** | `10239` (`0x27FF`) | `fencing` (`42`), `TwoHanded` | Speed `55`, Dmg `9–11` | `Block` (`ref: 16`) | `ArmorPierce` (`ref: 19`) | High-speed pair of daggers (`Speed 55`); combines `ArmorPierce` with `SurpriseAttack` defense shred against `high_def_boss`. |
| **Lajatang** | `10247` (`0x2807`) | `fencing` (`42`), `TwoHanded` | Speed `45`, Dmg `16–18` | `DefenseMastery` (`ref: 18`) | `FrenziedWhirlwind` (`ref: 6`) | Heavy 2H Fencing polearm (`16–18` base damage) for maximum single-hit `Backstab` and `KiAttack` burst. |
| **Tessen** | `10243` (`0x2803`) | `macing` (`41`), `TwoHanded` | Speed `50`, Dmg `10–12` | `Feint` (`ref: 8`) | `DualWield` (`ref: 23`) | Iron war fan supporting hybrid `Feint` damage reduction and `DualWield` swing speed. |
| **Bokuto** | `10232` (`0x27F8`) | `fencing` / `swords`, `OneHanded` | Speed `53`, Dmg `9–11` | `Feint` (`ref: 8`) | `NerveStrike` (`ref: 20`) | Fast 1H wooden blade pairing `NerveStrike` with `FocusAttack`. |
| **SmokeBomb** & **EggBomb** | `10248` (`0x2808`), `10249` (`0x2809`) | `ninjitsu` (`50.0`), `Custom` (`L35`) | `20,000ms` CD, `10` Mana | `Hiding.CombatOverride = true` | `6,000ms` `stealth` veil (`-8%` dmg taken) | Triggers mid-combat stealth without depleting physical item stacks (`ninja_smoke_bomb`). |
| **Shuriken** (`LeatherNinjaBelt`) | `10156` (`0x27AC`), Belt `0x2790` | `ninjitsu` (`30.0`), `Custom` (`L35`) | `11,000ms` CD, `8` Mana, Dmg `3–5` | Ranged Ninjitsu star (`range 2..10`) | `75%` secondary splash (`ninja_shuriken`) | Cooldown-based ranged Ninjitsu projectile volley; never stalls on `MaxUses = 10` belt charges. |
| **Fukiya** (`FukiyaDarts`) | `10154` (`0x27AA`), Ammo `0x2806` | `ninjitsu` (`60.0`), `Custom` (`L35`) | Shared `NinjaWeapon` controller, Dmg `4–6` | Blowgun poison dart (`range 0..6`) | Applies Ninjitsu poison charges | Paired with `Shuriken` in the `L35` Ninjitsu projectile volley (`ninja_shuriken`) and `InfectiousStrike` venom loop. |

---

### 5.2 Complete Bilingual Localization Table (`en` / `pt-BR`)

All 12 progression milestones and all 13 ability entries in `design/drop-in/ninja.json` carry complete English (`en`) and Brazilian Portuguese (`pt-BR`) strings:

| Level | Ability ID | `name` / `nameEn` (`en`) | `namePtBr` (`pt-BR`) | `descEn` (`en`) | `descPtBr` (`pt-BR`) |
|---:|---|---|---|---|---|
| **L1** | `ninja_shadowjump` | Shadowjump | Salto das Sombras | Innate Ninjitsu shadow-step footwork and high-speed Fencing auto-attack mastery with Kryss, Tekagi, Kama, and Sai. | Movimentação inata de passo das sombras Ninjitsu e maestria de ataque automático rápido de Esgrima com Kryss, Tekagi, Kama e Sai. |
| **L5** | `ninja_focus` | Focus Attack | Ataque Focado | Shieldless Ninjitsu precision strike that concentrates ki into a single blow (1.15x-1.25x) and staggers the target's nerves. | Golpe de precisão Ninjitsu sem escudo que concentra ki em um único ataque (1.15x-1.25x) e paralisa os nervos do alvo. |
| **L10** | `ninja_mirror` | Mirror Image | Imagem Espelhada | Summons an illusory Ninjitsu clone that diverts incoming melee attacks and reduces damage taken by 8%. | Conjura um clone ilusório de Ninjitsu que desvia ataques corpo a corpo recebidos e reduz o dano sofrido em 8%. |
| **L15** | `ninja_backstab` | Backstab | Punhalada pelas Costas | Ambush strike from the shadows that deals 1.15x-1.25x Ninjitsu damage and grants a 5s stealth damage window (+6%). | Ataque de emboscada das sombras que causa 1.15x-1.25x de dano Ninjitsu e concede 5s de janela furtiva (+6% de dano). |
| **L20** | `ninja_death` | Death Strike | Golpe Mortal | Strikes vital pressure points and plants a lethal Ninjitsu mark that detonates after 5 combat swings or 4s of internal trauma. | Atinge pontos vitais de pressão e planta uma marca letal de Ninjitsu que detona após 5 golpes de combate ou 4s de trauma interno. |
| **L25** | `ninja_animal_form` | Animal Form | Forma Animal | Channels the Grey Wolf and Bake Kitsune Ninjitsu aspect, increasing weapon attack speed by 10% for 8s. | Canaliza o aspecto Ninjitsu de Lobo Cinzento e Bake Kitsune, aumentando a velocidade de ataque em 10% por 8s. |
| **L30** | `ninja_infectious_strike` | Infectious Strike | Golpe Infeccioso | Kryss primary mastery: coats the blade in virulent assassin venom, inflicting 3 poison ticks over 6s. | Maestria primária de Kryss: reveste a lâmina com veneno virulento de assassino, aplicando 3 pulsos de veneno em 6s. |
| **L35** | `ninja_smoke_bomb` | Smoke Bomb | Bomba de Fumaça | Detonates a Tokuno smoke bomb to enter mid-combat stealth (-8% damage taken for 6s) and unlocks Shuriken & Fukiya volleys. | Detona uma bomba de fumaça de Tokuno para entrar em furtividade de combate (-8% de dano recebido por 6s) e libera Shuriken e Fukiya. |
| **L35** *(Bonus)* | `ninja_shuriken` | Shuriken & Fukiya Volley | Saraivada de Shuriken e Fukiya | Cooldown-gated Ninjitsu throwing star and blowgun dart volley dealing 0.75x-0.85x damage with 75% secondary splash. | Saraivada de estrelas ninja e dardos de zarabatana com recarga, causando 0.75x-0.85x de dano com 75% de alcance secundário. |
| **L40** | `ninja_ki_attack` | Ki Attack | Ataque de Ki | High-velocity Ninjitsu dash strike that closes the gap and splashes 85% kinetic ki damage onto a second target. | Investida veloz de Ninjitsu que fecha a distância e espalha 85% de dano cinético de ki em um segundo alvo. |
| **L45** | `ninja_surprise_attack` | Surprise Attack | Ataque Surpresa | Blindsides the enemy from stealth, shredding target physical defense by 8% for 6s to expose them to Death Strike. | Surpreende o inimigo a partir da furtividade, reduzindo a defesa física do alvo em 8% por 6s para expô-lo ao Golpe Mortal. |
| **L50** | `ninja_mirror_r2` | Mirror Image II | Imagem Espelhada II | Master Ninjitsu clone technique: deploys coordinated shadow decoys (-10% damage taken and +8% damage dealt for 7s). | Técnica mestre de clones Ninjitsu: invoca chamarizes sombrios coordenados (-10% de dano recebido e +8% de dano causado por 7s). |
| **L60** | `ninja_death_r2` | Death Strike II | Golpe Mortal II | Grandmaster Ninjitsu capstone assassination: 1.25x-1.35x strike (1.95x execute below 35% HP) plus a 4-tick lethal detonation mark. | Assassinato supremo de Grão-Mestre Ninjitsu: golpe de 1.25x-1.35x (execução de 1.95x abaixo de 35% de vida) e marca letal de 4 pulsos. |

---

## Section 6 — Deterministic Mode A Parity Verification Summary (`tools/sim_balance.ts`)

Running `npx tsx tools/sim_balance.ts --extra-class design/drop-in/ninja.json` confirms that `design/drop-in/ninja.json` reproduces the exact pre-verified Mode A parity curve across all four progression brackets (`L10`, `L25`, `L45`, `L60`):

| Bracket | `sustainedBossDps` (`low_def_boss`) | `highDefBossDps` (`high_def_boss`) | `multiTargetDps` (`multi_target_pack`) | `trashTtkSec` (`fast_trash`) | `netManaDeltaPerMin` | `netStaminaDeltaPerMin` | `ehpPerSec` | Baseline Envelope Status |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| **L10** | **7.28** (Warrior `7.32`, `-0.5%`) | **2.99** (Warrior `3.04`, `-1.6%`) | **6.63** (`-7.9%` vs W) | **8.57s** (`0.0%` vs W) | `-11.50` | `+188.40` | **15.55** (Warrior `15.48`, `+0.5%`) | **PASS** |
| **L25** | **53.81** (Warrior `52.39`, `+2.7%`) | **21.77** (in `[21.49, 25.52]`) | **48.79** (in `[42.18, 65.20]`) | **4.03s** (Warrior `4.07s`, `-1.0%`) | `-2.00` | `+146.40` | **45.90** (Ranger `46.88`, `-2.1%`) | **PASS** |
| **L45** | **190.26** (Mage `179.72`, `+5.8%`) | **92.90** (Warrior `91.52`, `+1.5%`) | **208.70** (in `[176.44, 258.60]`) | **3.16s** (Mage `3.23s`, `-2.2%`) | `-30.50` | `+302.40` | **149.46** (in `[143.43, 151.90]`) | **PASS** |
| **L60** | **374.50** (in `[351.58, 387.85]`) | **183.56** (in `[173.45, 213.73]`) | **426.76** (in `[384.42, 710.32]`) | **2.93s** (in `[2.43s, 2.98s]`) | `+26.00` | `+426.00` | **325.83** (in `[317.63, 366.26]`) | **PASS** |
