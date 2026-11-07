---
id: "simulator-fidelity-audit"
title: "Simulator Mathematical Fidelity Audit: Live Codebase Caps, Postures, Material Steps, and Hotbar Triggers"
category: "combat"
aliases: ["simulator-audit", "math-fidelity", "sim-caps", "posture-math", "splash-ratio"]
status: "verified"
sources: ["_raw/bundle/i18n-en-abilities.js", "_raw/bundle/combat-estimators-and-hotbar.js", "_raw/bundle/abilities-loader-and-hotbar.js", "_raw/wiki/changelog-server-dev.md", "_raw/modernuo/BaseWeapon.cs"]
evidence: ["live: _evidence/live-bundle-probe.txt L1-L20", "bundle: _raw/bundle/combat-estimators-and-hotbar.js:358-519", "bundle: _raw/bundle/abilities-loader-and-hotbar.js:609-695", "wiki: _raw/wiki/changelog-server-dev.md:17-654", "modernuo: _raw/modernuo/BaseWeapon.cs:1505-1570"]
code_refs: ["src/sim/engine.ts:computeSwingIntervalMs", "src/sim/engine.ts:computeHitChance", "src/sim/engine.ts:computeAutoAttackRawDamage", "src/sim/engine.ts:computeSkillDamage", "src/sim/engine.ts:resolveSkillResourceCost", "src/sim/archetypes.ts:POSTURE_PROFILES", "src/sim/archetypes.ts:buildMaterialTierBudget", "src/sim/archetypes.ts:buildWeaponArchetypeBudget"]
updated: "2026-11-07"
---
# Simulator Mathematical Fidelity Audit: Live Codebase Caps, Postures, Material Steps, and Hotbar Triggers

Source: [raw](../_raw/bundle/i18n-en-abilities.js)

## Summary

To guarantee that the deterministic combat simulator evaluates Warrior, Mage, Ranger, Samurai, and Ninja under the exact rules of the live UO Idle shard and ModernUO engine, every combat formula in the simulator is audited against verbatim bundle, server changelog, and ModernUO C# extracts. This audit establishes mathematical laws governing attribute and affix hard caps, hunting bot attack postures, material-tier weapon and armor step multipliers, secondary-target cleave splash ratios, hotbar auto-trigger thresholds, shieldless versus shielded Bushido parry divisors, unified single-wave and multi-wave tick execution, and weapon swing speed family trade-offs.

## Claims

- **C1** [verified] "Live surface probe of https://uoidle.com/beta confirms bundle_version 0.99.0 with entry bundle index-CCYN0Dy6.js, game chunk Jogo-D5xEfvfV.js, and paperdoll chunk bonecoVivo-DY66RLNm.js" (evidence 1)
- **C2** [verified] "attackOption: { agressivo: 'Aggressive', equilibrado: 'Balanced', defensivo: 'Defensive' }, attackHint: { agressivo: 'Deals 20% more damage and takes 40% more.', equilibrado: 'Normal damage, both ways.', defensivo: 'Deals 40% less damage and takes 20% less.', }," (raw L1574-L1579)
- **C3** [verified] ""damage":"Percent more damage on every weapon swing. It stacks with Strength, Tactics, and Anatomy. Cap of +100%. It does not affect spells — that is Spell Damage.","defense":"Lowers the physical damage you take. Cap of +45%. It does not raise the damage you deal.","hitchance":"Extra chance for a weapon swing to hit, on top of the weapon skill. Cap of +45%. It does not raise the damage of a hit that already landed.","speed":"Faster weapon attacks: less wait between swings. It stacks with stamina. Gear alone stops at 60%; this attribute goes past that cap. It does not raise the damage of each hit.","spelldamage":"Percent more spell damage. It stacks with Intelligence and Evaluating Intelligence. Cap of +50%. It does not affect weapon swings.","cast":"The spell finishes sooner. Low cap: +2. It does not raise damage.","recovery":"Shortens the pause after a cast so the next spell can start sooner. Cap of +6. It does not raise damage.","lowermana":"Each spell spends less mana. Cap of +40%. It does not raise damage; it lets you cast more often with the same mana."" (raw L2616-L2616)
- **C4** [verified] ""int":"Intelligence raises max mana. Every 10 Intelligence also feeds spell damage, together with Evaluating Intelligence and the Spell Damage attribute."" (raw L2616-L2616)

## Seven Mathematical Fidelity Laws (`v1.2` Simulator Contract)

### Law 1: Hard Attribute & Affix Caps (**C3**, **C4**, `[[damage-and-defense]]`, `[[equipment-affixes]]`)

| Parameter | Simulator Field | Live Hard Cap / Formula | Source Citation |
|---|---|---|---|
| **Spell Damage Increase (`SDI`)** | `spellDamageIncreasePct` | `Math.min(50, spellDamageIncreasePct)` + `Math.floor(int / 10)` (`+1%` per `10 INT`) | **C3**, **C4** (`raw L2616`) |
| **Weapon Damage Increase (`DI`)** | `damageIncreasePct` | Gear `DI` clamped at `Math.min(100, damageIncreasePct)`; weapon skill scaling flattens at `Math.min(100, primarySkill)` | **C3** (`raw L2616`), `changelog-server-dev.md:338` |
| **Swing Speed Increase (`SSI`) vs Tree `Speed`** | `swingSpeedIncreasePct`, `treeSpeedPct` | Gear `SSI` clamped at `Math.min(60, swingSpeedIncreasePct)`, then `treeSpeedPct` stacks beyond the `60%` gear cap (`effectiveSsi = Math.min(60, gearSsi) + treeSpeedPct`) | **C3** (`raw L2616`) |
| **Hit Chance / Defense Chance (`HCI` / `DCI`)** | `hitChanceIncreasePct`, `defenseChanceIncreasePct` | Both clamped at `Math.min(45, pct)` (`- surpriseAttackMalus` on defender); `CheckHit` denominator uses `2 * (100 + effectiveDci)` | **C3** (`raw L2616`), `[[modernuo-bushido]] C12` |
| **Lower Mana Cost (`LMC`)** | `lowerManaCostPct` | Clamped at `Math.min(40, lowerManaCostPct)` and applied in `resolveSkillResourceCost()` | **C3** (`raw L2616`), `[[resources]]` |
| **Enhance Potions & Reflect Physical** | `enhancePotionsPct`, `reflectPhysicalPct` | `enhancePotionsPct` (cap `50%`) multiplies potion heal amount; `reflectPhysicalPct` reflects incoming physical auto-attack damage back to the attacker | `[[equipment-affixes]]` (`raw L2616`) |

### Law 2: Authoritative Hunting Bot Postures (**C2**, `[[hunting-bot-and-dungeons]] C4`)

| Posture ID | Outgoing Damage Multiplier (`outgoingDamageMultiplier`) | Incoming Damage Taken Multiplier (`incomingDamageMultiplier`) |
|---|---|---|
| `'agressivo'` (alias `'Attack'`) | `1.20` (`+20%` damage dealt) | `1.40` (`+40%` damage taken) |
| `'equilibrado'` (alias `'Precision'` / `'Balanced'`) | `1.00` (`0%`) | `1.00` (`0%`) |
| `'defensivo'` (alias `'Defensive'`) | `0.60` (`-40%` damage dealt) | `0.80` (`-20%` damage taken) |

### Law 3: Material Tier Step Multipliers (`[[resources]] C2`)

Per `_raw/wiki/changelog-server-dev.md:58` (`[[resources]] C2`), each material step above `Iron` (`step = 0..8` across `Iron`, `Dull Copper`, `Shadow Iron`, `Copper`, `Bronze`, `Gold`, `Agapite`, `Verite`, `Valorite`) grants:
- **Weapon Damage Multiplier:** `+8%` per material step (`1 + 0.08 * step`, or proportional step scaling aligned with tier progression).
- **Armor Resistance & Durability Multiplier:** `+12%` per material step (`1 + 0.12 * step`).

### Law 4: Secondary Target `splashRatio` on Cleave/Splash Abilities (`[[damage-and-defense]] C8`)

In `Cq(e, a, n)` (`[[damage-and-defense]] C8`) and `scalingFormula.splashRatio`:
- Primary target (`targetIdx === 0`) receives `100%` of `rawDamagePerHit`.
- Secondary targets (`targetIdx > 0`) on cleave/splash skills (`splashRatio > 0 && splashRatio < 1`) receive `rawDamagePerHit * splashRatio` (e.g., `50%` on `warrior_cleave` / `chain_lightning`, `85%` on `samurai_frenzied_whirlwind`), whereas full-AoE skills without `splashRatio` hit all targets within `maxTargets` at `100%`.

### Law 5: Canonical `ro(e)` Hotbar Auto-Trigger Thresholds (`[[tick-and-cooldowns]] C6–C7`)

| Consumable / Ability Category | Live `ro(e)` Trigger Condition | Server Effect (`[[resources]] C10–C11`) |
|---|---|---|
| `lesser_heal_potion` / `heal_potion` / `greater_heal_potion` | `hpPct <= 50%` / `<= 32%` / `<= 18%` (default heal potion tier by level: `<= 50%`) | Restores `15%` / `25%` / `35%` Max HP (scaled by `1 + enhancePotionsPct / 100`) |
| `lesser_mana_potion` / `mana_potion` | `manaPct <= 40%` / `<= 28%` | Restores `15%` / `25%` Max Mana |
| `bandage` | `hpPct <= 80%` OR `poisoned == 1` | Restores `wq(healing, anatomy)` HP |
| `mage_heal` / `paladin_close_wounds` / `samurai_confidence` | `hpPct <= 50%` (`mage_heal`) / `<= 55%` (standard `am` heal) / `<= 40%` (`greater_heal`) | Restores `15%` / `35%` Max HP or skill-scaled heal |
| `GE` AoE Abilities (`whirlwind`, `meteor`, `frenzied_whirlwind`) | `aliveEnemies >= 3` (`zE(3)`) in `>=3`-target scenarios (or `>= 2` in 2-target cleave scenarios) | Multi-target strike |

### Law 6: Complete 1H (`48,000`), 2H (`41,140`), and Shield (`400`) `CheckParry` Math (`[[modernuo-bushido]] C2–C4`)

From `BaseWeapon.CheckParry` (`_raw/modernuo/BaseWeapon.cs:1505-1570`):
- **With Shield (`hasShield === true`):** `chance = Math.max(0, (parry - bushido) / 400.0) + (parry >= 100 || bushido >= 100 ? 0.05 : 0)`.
- **No Shield (1H / 2H Weapon):** `divisor = isTwoHanded ? 41140.0 : 48000.0`; `bushidoChance = (parry * bushido) / divisor + (parry >= 100 || bushido >= 100 ? 0.05 : 0)`; `aosChance = parry / 800.0 + (parry >= 100 ? 0.05 : 0)`; `chance = Math.max(bushidoChance, aosChance)`.
- **Modifiers:** Multiplied by `evasionParryScalar` (`1.16..1.50` when Evasion active) and by `(20 + dex) / 100` when `dex < 80`.

### Law 7: Unified Single-Wave & Multi-Wave Tick Kernel (`src/sim/engine.ts`)

`simulateScenarioDetailed` and `simulateMultiWavePull` must execute through the same combat tick resolution kernel so that every cap, posture multiplier, `splashRatio`, parry/clone check, and status effect behaves identically across single-wave and multi-wave simulations.

### Law 8: Weapon Swing Speed Archetypes (`2.25s` Fast 1H vs `2.50s` Balanced 1H vs `3.25s` Heavy 2H), `1,000ms` Floor Clipping & Handedness Coupling (`src/sim/archetypes.ts:buildWeaponArchetypeBudget`)

Even when two weapon families have identical normalized raw weapon DPS (`0.90 / 2.25s = 0.400/s` for `fast_1h`, `1.00 / 2.50s = 0.400/s` for `balanced_1h`, and `1.30 / 3.25s = 0.400/s` for `heavy_2h`), weapon swing speed variation creates four non-linear simulation and balance effects:

1. **Discrete `100ms` Tick Quantization & `1,000ms` Floor Clipping (`computeSwingIntervalMs`):**
   - At `L60` (`55%` Gear `SSI` + `20%` progression tree `Speed` + `150–175` Stamina), `fast_1h` (`2,250ms`) reaches `1,000ms–1,020ms` (`10` ticks), hitting the hard **`1,000ms` minimum swing floor**. Additional haste from `Honorable Execution` (`+15%`), `Kensei Stance` (`+12%`), or `Animal Form` (`+10%`) is clipped on `fast_1h`, whereas `heavy_2h` (`3,250ms` -> `1,380ms–1,473ms` base) absorbs every point of haste without clipping.
2. **Weapon-Scaled Special Moves (`Cq`) on Fixed Wall-Clock Cooldowns:**
   - Physical and hybrid Special Moves (`Lightning Strike`, `Honorable Execution`, `Momentum Strike`, `Backstab`, `Focus Attack`, `Mortal Strike`, `Whirlwind`) scale off `weaponAvgDmg` (`1.30x` on `heavy_2h` vs `0.90x` on `fast_1h`) while their cooldowns (`7s–14s`) are fixed in wall-clock time (`resolveEffectiveCooldownMs`). Consequently, `heavy_2h` amplifies cooldown-gated burst and execute DPS by `+30%`, while `fast_1h` maximizes swing cadence (`54–60` swings/min vs `39–44` swings/min).
3. **Class-Specific Proc & Streak Cadence:**
   - **Ninja (`Ninjitsu`):** `fast_1h` (`Kryss / Tekagi`, `60` swings in `60s`) triggers `Kitsune & Wolf Spirit Claw` (every 3rd connected swing) and detonates `Death Strike` / `Twin Shadow Mark` (on the 3rd/5th connected swing) `~40%` faster than `heavy_2h` (`43` swings).
   - **Samurai (`Bushido`):** `fast_1h` (`Wakizashi`, `57` swings) ramps `Perfection` streak stacks (`+2%` to `+4%` per hit) faster after any miss, whereas `heavy_2h` (`No-Dachi / Lajatang`, `44` swings) switches `CheckParry` from the `1H` divisor (`48,000`) to the **`2H` divisor (`41,140`)**, boosting Bushido parry rate (`12` -> `13` parries, `EHP/sec` `328.52` -> `335.62`) and scaling `Counter Attack` / `Iaido Flash Riposte` / `Kensei's Judgment` per-hit damage by `1.30x`.
   - **Warrior (`Shield` vs `2H`):** Switching from `fast_1h` / `balanced_1h` (`hasShield: true`, `400` shield parry divisor) to `heavy_2h` (`Halberd`, `hasShield: false`) forfeits shield parry (`12` -> `9` parries, `EHP/sec` `331.99` -> `322.66`) in exchange for `+18.2%` Boss DPS (`345.15` -> `408.03`).

| Class (`L60` Mode B) | Weapon Archetype | Base Speed (`ms`) | Effective Swing (`ms`) | Swings (`60s`) | Auto-Attack DPS | Low-Def Boss DPS | High-Def Boss DPS | Multi-Target DPS | Parries | EHP/sec |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `warrior` | `fast_1h` (`Broadsword + Shield`) | `2250` | `1020` | `54` | `191.86` | `331.19` | `147.94` | `372.56` | `12` | `331.99` |
| `warrior` | `balanced_1h` (`Scepter + Shield`) | `2500` | `1133` | `49` | `203.98` | `345.15` | `154.99` | `383.58` | `12` | `331.99` |
| `warrior` | `heavy_2h` (`Halberd 2H`, no shield) | `3250` | `1473` | `39` | `199.67` | `408.03` | `173.58` | `435.60` | `9` | `322.66` |
| `mage` | `fast_1h` (`Spellweaver Wand`) | `2250` | `1020` | `60` | `244.33` | `357.11` | `185.87` | `713.95` | `3` | `370.67` |
| `mage` | `balanced_1h` (`Gnarled Staff`) | `2500` | `1133` | `55` | `236.32` | `374.52` | `191.26` | `713.23` | `3` | `370.67` |
| `mage` | `heavy_2h` (`Black Staff`) | `3250` | `1473` | `43` | `238.66` | `379.40` | `193.11` | `714.12` | `3` | `370.67` |
| `ranger` | `fast_1h` (`Yumi / Repeating Bow`) | `2250` | `1000` (floor) | `59` | `230.47` | `375.25` | `209.16` | `687.47` | `3` | `327.00` |
| `ranger` | `balanced_1h` (`Composite Bow`) | `2500` | `1061` | `53` | `223.85` | `403.59` | `226.54` | `731.67` | `3` | `327.00` |
| `ranger` | `heavy_2h` (`Heavy Crossbow`) | `3250` | `1380` | `41` | `221.16` | `437.66` | `262.06` | `875.30` | `3` | `327.00` |
| `samurai` | `fast_1h` (`Wakizashi / Kama 1H`) | `2250` | `1020` | `57` | `236.79` | `361.85` | `185.84` | `419.72` | `12` | `328.52` |
| `samurai` | `balanced_1h` (`Katana / Bokuto 1H`) | `2500` | `1133` | `52` | `243.01` | `367.22` | `193.60` | `460.99` | `12` | `328.52` |
| `samurai` | `heavy_2h` (`No-Dachi / Lajatang 2H`) | `3250` | `1473` | `44` | `256.83` | `416.80` | `238.75` | `503.72` | `13` | `335.62` |
| `ninja` | `fast_1h` (`Kryss / Tekagi 1H`) | `2250` | `1000` (floor) | `60` | `237.44` | `349.00` | `174.29` | `391.73` | `3` | `336.54` |
| `ninja` | `balanced_1h` (`Sai / Kama Pair 1H`) | `2500` | `1061` | `55` | `238.67` | `364.22` | `183.57` | `408.59` | `3` | `336.54` |
| `ninja` | `heavy_2h` (`Fukiya & Heavy Kama 2H`) | `3250` | `1380` | `43` | `244.83` | `408.29` | `198.84` | `475.83` | `3` | `336.54` |

