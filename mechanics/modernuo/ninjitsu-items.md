---
id: "ninjitsu-items"
title: "Tokuno Ninjitsu Weapons, Shuriken Belt, Fukiya Darts, Ninja Armor, and SE Weapons"
category: "modernuo-ninjitsu"
aliases: ["ninja-weapons", "shuriken", "fukiya", "fukiya-darts", "leather-ninja-belt", "tokuno-weapons"]
status: "modernuo-stated"
sources: ["_raw/modernuo/NinjaWeapons.cs", "_raw/modernuo/Fukiya.cs", "_raw/modernuo/FukiyaDarts.cs", "_raw/modernuo/LeatherNinjaBelt.cs", "_raw/modernuo/Shuriken.cs", "_raw/modernuo/Kama.cs", "_raw/modernuo/Tekagi.cs", "_raw/modernuo/Sai.cs", "_raw/modernuo/Nunchaku.cs", "_raw/modernuo/Tessen.cs", "_raw/modernuo/NoDachi.cs", "_raw/modernuo/Katana.cs", "_raw/modernuo/Wakizashi.cs", "_raw/modernuo/Lajatang.cs", "_raw/modernuo/Daisho.cs", "_raw/modernuo/Bokuto.cs", "_raw/modernuo/Tetsubo.cs", "_raw/modernuo/Yumi.cs", "_raw/modernuo/LeatherNinjaHood.cs", "_raw/modernuo/LeatherNinjaJacket.cs", "_raw/modernuo/LeatherNinjaMitts.cs", "_raw/modernuo/LeatherNinjaPants.cs"]
evidence: ["modernuo: _raw/modernuo/Fukiya.cs:29-45", "modernuo: _raw/modernuo/FukiyaDarts.cs:25-41", "modernuo: _raw/modernuo/LeatherNinjaBelt.cs:29-46", "modernuo: _raw/modernuo/Shuriken.cs:26-42", "modernuo: _raw/modernuo/Kama.cs:9-36", "modernuo: _raw/modernuo/Tekagi.cs:9-36", "modernuo: _raw/modernuo/Sai.cs:9-37", "modernuo: _raw/modernuo/Nunchaku.cs:9-35", "modernuo: _raw/modernuo/Tessen.cs:9-35", "modernuo: _raw/modernuo/NoDachi.cs:9-32", "modernuo: _raw/modernuo/Katana.cs:9-35", "modernuo: _raw/modernuo/Wakizashi.cs:9-32", "modernuo: _raw/modernuo/Lajatang.cs:9-36", "modernuo: _raw/modernuo/Daisho.cs:9-32", "modernuo: _raw/modernuo/Bokuto.cs:9-35", "modernuo: _raw/modernuo/Tetsubo.cs:9-34", "modernuo: _raw/modernuo/Yumi.cs:10-42", "modernuo: _raw/modernuo/LeatherNinjaHood.cs:8-33", "modernuo: _raw/modernuo/LeatherNinjaJacket.cs:8-33", "modernuo: _raw/modernuo/LeatherNinjaMitts.cs:8-33", "modernuo: _raw/modernuo/LeatherNinjaPants.cs:8-33"]
code_refs: ["ModernUO:Items.NinjaWeapon", "ModernUO:Items.Fukiya", "ModernUO:Items.LeatherNinjaBelt", "ModernUO:Items.Shuriken", "ModernUO:Items.FukiyaDarts"]
updated: "2026-11-07"
---
# Tokuno Ninjitsu Weapons, Shuriken Belt, Fukiya Darts, Ninja Armor, and SE Weapons

Source: [raw](../_raw/modernuo/NinjaWeapons.cs)

## Summary

ModernUO implements specialized Tokuno Ninjitsu throwing and blowgun equipment alongside Samurai Empire melee and ranged weapons and the Leather Ninja armor set. The shared NinjaWeapon controller governs both the waist-layered Leather Ninja Belt loaded with Shuriken and the one-handed Fukiya blowgun loaded with Fukiya Darts, enforcing a ten-charge capacity, a free-hand requirement, a Ninjitsu-based accuracy check against the defender's weapon skill, a delayed projectile impact timer, an internal weapon cooldown, and optional poison charge delivery. See [[modernuo-ninjitsu]] and [[modernuo-bushido]] for how these weapons and items map into class progression and equipment slots.

## Claims

- **C1** [modernuo-stated] "public static class NinjaWeapon { private const int MaxUses = 10;" (raw L41-L43)
- **C2** [modernuo-stated] "if (CombatCheck(from, target)) { Timer.StartTimer(TimeSpan.FromSeconds(1.0), () => OnHit(from, target, weapon)); } Timer.StartTimer(TimeSpan.FromSeconds(2.5), () => from.NinjaWepCooldown = false);" (raw L72-L77)
- **C3** [modernuo-stated] "if (weapon.UsesRemaining > 0) { if (!from.NinjaWepCooldown) { if (BasePotion.HasFreeHand(from)) { return true; } from.SendLocalizedMessage(weapon.NoFreeHandMessage);" (raw L177-L186)
- **C4** [modernuo-stated] "AOS.Damage(target, from, weapon.WeaponDamage, 100, 0, 0, 0, 0); if (weapon.Poison != null && weapon.PoisonCharges > 0) { if (EvilOmenSpell.EndEffect(target)) { target.ApplyPoison(from, Poison.IncreaseLevel(weapon.Poison)); } else { target.ApplyPoison(from, weapon.Poison); } weapon.PoisonCharges--;" (raw L286-L300)

## Ninjitsu Projectiles (`NinjaWeapons.cs`, `LeatherNinjaBelt.cs`, `Shuriken.cs`, `Fukiya.cs`, `FukiyaDarts.cs`)

| Item | Layer / Graphic | Range (`Min..Max`) | Base Damage | Capacity & Craft Rule | Shared `NinjaWeapon` Execution Rules |
|---|---|---|---|---|---|
| **`LeatherNinjaBelt` + `Shuriken`** (`LeatherNinjaBelt.cs:29-46`, `Shuriken.cs:26-39`) | `Layer.Waist` (`0x2790`), ammo `0x27AC` | `2..10` tiles | `3..5` (`100%` Physical) | `MaxUses = 10` (**C1**); exceptional craft (`quality == 2`) doubles `UsesRemaining *= 2` | Requires `BasePotion.HasFreeHand(from)` (**C3**), checks `Ninjitsu` vs defender weapon skill, hits after `1.0s` with `2.5s` `NinjaWepCooldown` (**C2**), and applies loaded `Poison` (**C4**). |
| **`Fukiya` + `FukiyaDarts`** (`Fukiya.cs:29-45`, `FukiyaDarts.cs:25-39`) | `Layer.OneHanded` (`0x27AA`), ammo `0x2806` | `0..6` tiles | `4..6` (`100%` Physical) | `MaxUses = 10` (**C1**); exceptional craft (`quality == 2`) doubles `UsesRemaining *= 2` | Same `NinjaWeapon` controller: requires a free hand (**C3**), `1.0s` impact delay, `2.5s` cooldown (**C2**), and transfers poison charges (**C4**). |

## Leather Ninja Armor Set (`LeatherNinja*.cs`)

All four Leather Ninja armor pieces (`LeatherNinjaHood.cs`, `LeatherNinjaJacket.cs`, `LeatherNinjaMitts.cs`, `LeatherNinjaPants.cs`) require `AosStrReq => 10`, grant `ArmorMeditationAllowance.All`, and use `ArmorMaterialType.Leather` (**C1**):
- **`LeatherNinjaHood` (`0x278E`):** Base resistances `2 / 3 / 3 / 3 / 4` (Phys/Fire/Cold/Pois/Nrgy), durability `25..45`.
- **`LeatherNinjaJacket` (`0x2793`):** Base resistances `2 / 4 / 3 / 3 / 3`, durability `55..65`.
- **`LeatherNinjaMitts` (`0x2792`):** Base resistances `2 / 4 / 3 / 3 / 3`, durability `25..25`.
- **`LeatherNinjaPants` (`0x2791`):** Base resistances `2 / 4 / 3 / 3 / 3`, durability `40..50`.

## Tokuno Samurai Empire (`SE`) Weapons Reference

| Weapon (`_raw/modernuo/*.cs`) | Skill (`DefSkill`) & Layer | `AosMinDamage..MaxDamage` | `AosSpeed` / `MlSpeed` | `PrimaryAbility` | `SecondaryAbility` |
|---|---|---|---|---|---|
| **`Katana`** (`Katana.cs:9-35`) | `Swords` (`OneHanded` `0x13FF`) | `11..13` (`StrReq 25`) | `46` / `2.50s` | `DoubleStrike` | `ArmorIgnore` |
| **`NoDachi`** (`NoDachi.cs:9-32`) | `Swords` (`TwoHanded` `0x27A2`) | `16..18` (`StrReq 40`) | `35` / `3.50s` | `CrushingBlow` | `RidingSwipe` |
| **`Wakizashi`** (`Wakizashi.cs:9-32`) | `Swords` (`OneHanded` `0x27A4`) | `11..13` (`StrReq 20`) | `44` / `2.50s` | `FrenziedWhirlwind` | `DoubleStrike` |
| **`Daisho`** (`Daisho.cs:9-32`) | `Swords` (`TwoHanded` `0x27A9`) | `13..15` (`StrReq 40`) | `40` / `2.75s` | `Feint` | `DoubleStrike` |
| **`Bokuto`** (`Bokuto.cs:9-35`) | `Swords` (`OneHanded` `0x27A8`) | `9..11` (`StrReq 20`) | `53` / `2.00s` | `Feint` | `NerveStrike` |
| **`Tekagi`** (`Tekagi.cs:9-36`) | `Fencing` (`TwoHanded` `0x27AB`) | `10..12` (`StrReq 10`) | `53` / `2.00s` | `DualWield` | `TalonStrike` |
| **`Kama`** (`Kama.cs:9-36`) | `Fencing` (`TwoHanded` `0x27AD`) | `9..11` (`StrReq 15`) | `55` / `2.00s` | `WhirlwindAttack` | `DefenseMastery` |
| **`Sai`** (`Sai.cs:9-37`) | `Fencing` (`TwoHanded` `0x27AF`) | `9..11` (`StrReq 15`) | `55` / `2.00s` | `Block` | `ArmorPierce` |
| **`Lajatang`** (`Lajatang.cs:9-36`) | `Fencing` (`TwoHanded` `0x27A7`) | `16..18` (`StrReq 65`) | `32` / `3.50s` | `DefenseMastery` | `FrenziedWhirlwind` |
| **`Nunchaku`** (`Nunchaku.cs:9-35`) | `Macing` (`OneHanded` `0x27AE`) | `11..13` (`StrReq 15`) | `47` / `2.50s` | `Block` | `Feint` |
| **`Tessen`** (`Tessen.cs:9-35`) | `Macing` (`TwoHanded` `0x27A3`) | `10..12` (`StrReq 10`) | `50` / `2.00s` | `Feint` | `Block` |
| **`Tetsubo`** (`Tetsubo.cs:9-34`) | `Macing` (`TwoHanded` `0x27A6`) | `12..14` (`StrReq 35`) | `45` / `2.50s` | `FrenziedWhirlwind` | `CrushingBlow` |
| **`Yumi`** (`Yumi.cs:10-42`) | `Archery` (`TwoHanded` `0x27A5`) | `16..20` (`StrReq 35`, `Range 10`) | `25` / `4.50s` | `ArmorPierce` | `DoubleShot` |
