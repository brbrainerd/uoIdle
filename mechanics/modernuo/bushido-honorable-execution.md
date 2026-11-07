---
id: "bushido-honorable-execution"
title: "Bushido Honorable Execution Finisher and Penalty Mechanics"
category: "modernuo-bushido"
aliases: ["honorable-execution", "samurai-honorable", "samurai-move"]
status: "modernuo-stated"
sources: ["_raw/modernuo/HonorableExecution.cs", "_raw/modernuo/SamuraiMove.cs", "_raw/modernuo/SpecialMove.cs"]
evidence: ["modernuo: _raw/modernuo/SamuraiMove.cs:3-11", "modernuo: _raw/modernuo/SpecialMove.cs:75-97", "modernuo: _raw/modernuo/SpecialMove.cs:144-148", "modernuo: _raw/modernuo/BaseWeapon.cs:1380-1381", "modernuo: _raw/modernuo/BaseWeapon.cs:1590-1591"]
code_refs: ["ModernUO:Spells.Bushido.HonorableExecution", "ModernUO:Spells.SamuraiMove", "ModernUO:Spells.SpecialMove"]
updated: "2026-11-07"
---
# Bushido Honorable Execution Finisher and Penalty Mechanics

Source: [raw](../_raw/modernuo/HonorableExecution.cs)

## Summary

Honorable Execution is a Bushido weapon special move that empowers the next melee swing as a high-risk, high-reward finisher. If the empowered blow kills the defender, the Samurai immediately recovers health and receives a temporary weapon swing speed bonus scaled quadratically by Bushido skill. Conversely, if the target survives the hit in canonical ModernUO, the attacker suffers a severe temporary resistance and Magic Resist penalty and cannot queue special moves until the penalty expires or is cleared by a successful weapon parry. See [[modernuo-bushido]] for the weapon swing-delay and parry-clear hooks.

## Claims

- **C1** [modernuo-stated] "public override int BaseMana => 0; public override double RequiredSkill => 25.0; // You better kill your enemy with your next hit or you'll be rather sorry... public override TextDefinition AbilityMessage { get; } = 1063122; public override double GetDamageScalar(Mobile attacker, Mobile defender) => // TODO: 20 -> Perfection 1.0 + attacker.Skills.Bushido.Value * 20 / 10000;" (raw L12-L20)
- **C2** [modernuo-stated] "var bushido = attacker.Skills.Bushido.Value; bushido *= bushido; attacker.Hits += 20 + (int)(bushido / 480.0); var swingBonus = Math.Max(1, (int)(bushido / 720.0)); timer = new HonorableExecutionTimer(TimeSpan.FromSeconds(20.0), attacker, swingBonus: swingBonus);" (raw L38-L45)
- **C3** [modernuo-stated] "attacker.AddResistanceMod(new ResistanceMod(ResistanceType.Physical, "PhysicalResistHonorableExecution", -40)); attacker.AddResistanceMod(new ResistanceMod(ResistanceType.Fire, "FireResistHonorableExecution", -40)); attacker.AddResistanceMod(new ResistanceMod(ResistanceType.Cold, "ColdResistHonorableExecution", -40)); attacker.AddResistanceMod(new ResistanceMod(ResistanceType.Poison, "PoisonResistHonorableExecution", -40)); attacker.AddResistanceMod(new ResistanceMod(ResistanceType.Energy, "EnergyResistHonorableExecution", -40)); var resSpells = attacker.Skills.MagicResist.Value; if (resSpells > 0.0) { attacker.AddSkillMod(new DefaultSkillMod(SkillName.MagicResist, "MagicResistHonorableExecution", true, -resSpells)); } timer = new HonorableExecutionTimer(TimeSpan.FromSeconds(7.0), attacker, penalty: true);" (raw L59-L73)
- **C4** [modernuo-stated] "public static int GetSwingBonus(Mobile target) => _table.TryGetValue(target, out var info) ? info._swingBonus : 0; public static bool IsUnderPenalty(Mobile target) => _table.TryGetValue(target, out var info) && info._penalty; public static void RemovePenalty(Mobile target) { if (_table.Remove(target, out var timer)) { timer.Clear(); } }" (raw L101-L111)

## Honorable Execution Resolution and SpecialMove Base Rules

| Parameter / Outcome | Canonical ModernUO Implementation | Formula / Value | Claim Citation |
|---|---|---|---|
| **Base Mana & Skill Gate** | `BaseMana => 0` (`abilities-catalog.json` overrides `samurai_honorable` to `20` mana in UO Idle per `[[status-effects]] C15`), `RequiredSkill => 25.0` | `0` mana, `25.0` Bushido (`SamuraiMove` checks `RequiredSkill - 12.5` to `RequiredSkill + 37.5` in `SamuraiMove.cs:9`) | **C1**, `[[status-effects]] C15` |
| **Damage Scalar (`GetDamageScalar`)** | Scales weapon hit damage linearly with `Bushido.Value` | `1.0 + Bushido * 20 / 10000` (`1.20x` at `100.0` Bushido, `1.24x` at `120.0` Bushido) | **C1** |
| **Successful Kill Reward (`!defender.Alive`)** | Instant heal plus a `20.0s` `WeaponSpeed` bonus applied in `BaseWeapon.GetDelay` | `Heal = 20 + (int)(Bushido^2 / 480.0)` (`40` HP at `100` Bushido); `swingBonus = Math.Max(1, (int)(Bushido^2 / 720.0))` (`+13%` SSI at `100` Bushido) | **C2**, **C4**, `[[modernuo-bushido]] C1` |
| **Failed Kill Penalty (`defender.Alive`)** | `7.0s` debuff reducing all five elemental resistances by `-40`, zeroing `MagicResist`, and blocking `SpecialMove.Validate` (`SpecialMove.cs:144-148`) until `7.0s` elapses or `RemovePenalty` is triggered on parry | `-40` Physical/Fire/Cold/Poison/Energy resist, `-MagicResist`, `7.0s` duration | **C3**, **C4**, `[[modernuo-bushido]] C5` |
| **`SpecialMove.ScaleMana` Rule (`SpecialMove.cs:75-97`)** | Caps `LowerManaCost` at `40%` and doubles mana cost (`total *= 2`) if `MoveSkill < 50.0` and a `3.0s` `SpecialMoveContext` is active | `total = (int)(mana * (1.0 - Math.Min(LMC, 40) / 100.0))` | **C1** |
