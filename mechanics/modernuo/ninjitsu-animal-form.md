---
id: "ninjitsu-animal-form"
title: "Ninjitsu Animal Form Transformations, Skill Thresholds, and Aspect Bonuses"
category: "modernuo-ninjitsu"
aliases: ["animal-form", "ninja-animal-form"]
status: "modernuo-stated"
sources: ["_raw/modernuo/AnimalForm.cs", "_raw/modernuo/AnimalFormTests.cs"]
evidence: ["modernuo: _raw/modernuo/AnimalFormTests.cs:23-61", "modernuo: _raw/modernuo/BaseWeapon.cs:1241-1245", "modernuo: _raw/modernuo/BaseWeapon.cs:2220-2228"]
code_refs: ["ModernUO:Spells.Ninjitsu.AnimalForm", "ModernUO:Tests.Spells.Ninjitsu.AnimalFormTests"]
updated: "2026-11-07"
---
# Ninjitsu Animal Form Transformations, Skill Thresholds, and Aspect Bonuses

Source: [raw](../_raw/modernuo/AnimalForm.cs)

## Summary

Animal Form is a Ninjitsu transformation spell that morphs the Ninja into one of sixteen animal bodies gated by Ninjitsu skill thresholds and optional form talismans. Depending on the selected creature, Animal Form grants mount-equivalent movement speed, passive Stealth or Stealing skill bonuses, melee hit-chance bonuses, on-hit or reactive poison application, periodic bandage self-healing, or breath attacks, while blocking standard weapon special moves during transformation. See [[modernuo-bushido]] and [[modernuo-ninjitsu]] for the weapon combat hooks associated with Wolf, Bake-Kitsune, Giant Serpent, and Bull Frog forms.

## Claims

- **C1** [modernuo-stated] "public override TimeSpan CastDelayBase => TimeSpan.FromSeconds(1.0); public override double RequiredSkill => 0.0; public override int RequiredMana => Core.ML ? 10 : 0; public override int CastRecoveryBase => Core.ML ? 10 : base.CastRecoveryBase; public override bool BlockedByAnimalForm => false;" (raw L39-L45)
- **C2** [modernuo-stated] "public static AnimalFormEntry[] Entries { get; } = { new(typeof(Kirin), 1029632, 9632, 0, 1070811, 100.0, 0x84, 0, 0), new(typeof(Unicorn), 1018214, 9678, 0, 1070812, 100.0, 0x7A, 0, 0), new(typeof(BakeKitsune), 1030083, 10083, 0, 1070810, 82.5, 0xF6, 0, 0), new(typeof(GreyWolf), 1028482, 9681, 2309, 1070810, 82.5, 0x19, 0x8FD, 0x90E), new(typeof(Llama), 1028438, 8438, 0, 1070809, 70.0, 0xDC, 0, 0), new(typeof(ForestOstard), 1018273, 8503, 2212, 1070809, 70.0, 0xDB, 0x899, 0x8B0), new(typeof(BullFrog), 1028496, 8496, 2003, 1070807, 50.0, 0x51, 0x7D1, 0x7D6, false, false), new(typeof(GiantSerpent), 1018114, 9663, 2009, 1070808, 50.0, 0x15, 0x7D1, 0x7E2, false, false), new(typeof(Dog), 1018280, 8476, 2309, 1070806, 40.0, 0xD9, 0x8FD, 0x90E, false, false), new(typeof(Cat), 1018264, 8475, 2309, 1070806, 40.0, 0xC9, 0x8FD, 0x90E, false, false), new(typeof(Rat), 1018294, 8483, 2309, 1070805, 20.0, 0xEE, 0x8FD, 0x90E, true, false), new(typeof(Rabbit), 1028485, 8485, 2309, 1070805, 20.0, 0xCD, 0x8FD, 0x90E, true, false), new(typeof(Squirrel), 1031671, 11671, 0, 0, 20.0, 0x116, 0, 0, false, false), new(typeof(Ferret), 1031672, 11672, 0, 1075220, 40.0, 0x117, 0, 0, false, false, true), new(typeof(CuSidhe), 1031670, 11670, 0, 1075221, 60.0, 0x115, 0, 0, false, false), new(typeof(Reptalon), 1075202, 11669, 0, 1075222, 90.0, 0x114, 0, 0, false, false) };" (raw L47-L65)
- **C3** [modernuo-stated] "if (entry.StealthBonus) { mod = new DefaultSkillMod(SkillName.Stealth, "StealthAnimalForm", true, 20.0) { ObeyCap = true }; m.AddSkillMod(mod); } SkillMod stealingMod = null; if (entry.StealingBonus) { stealingMod = new DefaultSkillMod(SkillName.Stealing, "StealingAnimalForm", true, 10.0) { ObeyCap = true }; m.AddSkillMod(stealingMod); }" (raw L235-L247)
- **C4** [modernuo-stated] "if (_body == 0x115) // Cu Sidhe { // Once every 8 seconds if (_counter++ < 8) { return; } if (_mobile.Hits < _mobile.HitsMax) { var b = _mobile.Backpack?.FindItemByType<Bandage>(); if (b != null) { _mobile.Hits += Utility.RandomMinMax(20, 50); b.Consume(); }" (raw L539-L555)

## Animal Form Entries and Combat Effects

| Form(s) | Required Ninjitsu (`ReqSkill`) | `SpeedBoost` | Combat / Skill Bonus in ModernUO | Claim Citation |
|---|---|---|---|---|
| **Rat, Rabbit** (`0xEE`, `0xCD`) | `20.0` (`AnimalFormTests.cs:40-41`) | `false` | `StealthBonus = true` (`+20.0` `Stealth` skill mod obeying cap) | **C2**, **C3** |
| **Squirrel** (`0x116`) | `20.0` | `false` | Talisman form | **C2** |
| **Dog, Cat** (`0xD9`, `0xC9`) | `40.0` (`AnimalFormTests.cs:28-39`) | `false` | Base regeneration / low-tier morph | **C2** |
| **Ferret** (`0x117`) | `40.0` | `false` | `StealingBonus = true` (`+10.0` `Stealing` skill mod obeying cap) | **C2**, **C3** |
| **Bull Frog, Giant Serpent** (`0x51`, `0x15`) | `50.0` | `false` | `GiantSerpent` applies `Poison.Lesser` on melee hit; `BullFrog` applies `Poison.Regular` to melee attackers (`BaseWeapon.cs:2220-2228`) | **C2**, `[[modernuo-bushido]] C9` |
| **Cu Sidhe** (`0x115`) | `60.0` | `false` | Consumes `1` `Bandage` every `8` seconds when damaged to heal `20..50` Hits | **C2**, **C4** |
| **Llama, Forest Ostard** (`0xDC`, `0xDB`) | `70.0` | `true` | Mount movement speed (`SpeedControlSetting.Mount`) | **C2** |
| **Bake-Kitsune, Grey Wolf** (`0xF6`, `0x19`) | `82.5` | `true` | Mount speed + `+20%` Hit Chance Increase (`bonus += 20` in `BaseWeapon.cs:1241-1245` and `NinjaWeapons.cs:221-225`) | **C2**, `[[modernuo-bushido]] C9` |
| **Reptalon** (`0x114`) | `90.0` | `false` | Periodic `20` fire breath damage (`AOS.Damage(target, _mobile, 20, !target.Player, 0, 100, 0, 0, 0)` at `L616`) | **C2** |
| **Kirin, Unicorn** (`0x84`, `0x7A`) | `100.0` | `true` | Grandmaster mount speed and regeneration | **C2** |
