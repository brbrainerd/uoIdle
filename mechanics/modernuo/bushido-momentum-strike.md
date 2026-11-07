---
id: "bushido-momentum-strike"
title: "Bushido Momentum Strike Two-Target Cleave Transfer"
category: "modernuo-bushido"
aliases: ["momentum-strike", "samurai-momentum"]
status: "modernuo-stated"
sources: ["_raw/modernuo/MomentumStrike.cs"]
evidence: ["modernuo: _raw/modernuo/BaseWeapon.cs:1732-1865"]
code_refs: ["ModernUO:Spells.Bushido.MomentumStrike"]
updated: "2026-11-07"
---
# Bushido Momentum Strike Two-Target Cleave Transfer

Source: [raw](../_raw/modernuo/MomentumStrike.cs)

## Summary

Momentum Strike is the highest-skill Bushido weapon special move, allowing a Samurai to transfer the momentum of a connected weapon strike into a second hostile target within weapon range. If no secondary combatant is within range, no mana is consumed and the move aborts with a warning message. When a valid secondary target is found, the transferred swing scales with the attacker's Bushido skill and receives a multiplicative bonus if the primary target was killed by the initial hit. See [[modernuo-bushido]] for how the damage bonus factor integrates into the weapon damage pipeline.

## Claims

- **C1** [modernuo-stated] "public override int BaseMana => 10; public override double RequiredSkill => 70.0;" (raw L7-L8)
- **C2** [modernuo-stated] "using var queue = PooledRefQueue<Mobile>.Create(); foreach (var m in attacker.GetMobilesInRange(weapon.MaxRange)) { if (m != defender && m.Combatant == attacker) { queue.Enqueue(m); } } if (queue.Count <= 0) { attacker.SendLocalizedMessage(1063123); // There are no valid targets to attack! return; }" (raw L24-L37)
- **C3** [modernuo-stated] "var target = queue.PeekRandom(); var damageBonus = attacker.Skills.Bushido.Value / 100.0; if (!defender.Alive) { damageBonus *= 1.5; } attacker.SendLocalizedMessage(1063171); // You transfer the momentum of your weapon into another enemy! target!.SendLocalizedMessage(1063172); // You were hit by the momentum of a Samurai's weapon! target.FixedParticles(0x37B9, 1, 4, 0x251D, 0, 0, EffectLayer.Waist); attacker.PlaySound(0x510); weapon.OnSwing(attacker, target, damageBonus);" (raw L44-L60)

## Momentum Strike Mechanics

| Parameter | Canonical ModernUO Rule | Formula / Value | Claim Citation |
|---|---|---|---|
| **Base Mana & Required Skill** | Costs `10` base mana and requires `70.0` Bushido (`CheckGain` rolls `RequiredSkill` to `120.0`) | `BaseMana = 10`, `RequiredSkill = 70.0` | **C1** |
| **Secondary Target Selection** | Scans `attacker.GetMobilesInRange(weapon.MaxRange)` for any `m != defender && m.Combatant == attacker` and picks one at random (`queue.PeekRandom()`) | Requires `>= 1` additional enemy attacking the Samurai within weapon range | **C2** |
| **Transferred Swing Damage Bonus** | Calls `weapon.OnSwing(attacker, target, damageBonus)` where `damageBonus = Bushido / 100.0` (`1.0x` at `100.0` Bushido), multiplied by `1.5` if the primary `defender` died (`!defender.Alive`) | `damageBonus = (Bushido / 100.0) * (!defender.Alive ? 1.5 : 1.0)` | **C3** |
