---
id: "ninjitsu-death-strike"
title: "Ninjitsu Death Strike Delayed Five-Step Detonation"
category: "modernuo-ninjitsu"
aliases: ["death-strike", "ninja-death", "delayed-detonation"]
status: "modernuo-stated"
sources: ["_raw/modernuo/DeathStrike.cs"]
evidence: ["modernuo: _raw/modernuo/BaseWeapon.cs:1779-1782", "modernuo: _raw/modernuo/BaseWeapon.cs:2209-2209"]
code_refs: ["ModernUO:Spells.Ninjitsu.DeathStrike"]
updated: "2026-11-07"
---
# Ninjitsu Death Strike Delayed Five-Step Detonation

Source: [raw](../_raw/modernuo/DeathStrike.cs)

## Summary

Death Strike is the capstone Ninjitsu weapon special move, inflicting a reduced-damage initial strike that plants a delayed lethal mark on the defender. Once the mark is applied, the target detonates either when they take five movement steps or when the five-second countdown timer expires, whichever comes first. In the Mondain's Legacy ruleset, the detonation deals unmitigated direct damage scaled by the attacker's Ninjitsu, Hiding, Stealth, and Tracking skills, with a doubled damage cap if the five-step threshold was reached and a halved damage penalty if applied with a ranged weapon. See [[modernuo-ninjitsu]] for how Death Strike adapts into a five-swing delayed detonation in automated combat.

## Claims

- **C1** [modernuo-stated] "public override int BaseMana => 30; public override double RequiredSkill => 85.0; // You prepare to hit your opponent with a Death Strike. public override TextDefinition AbilityMessage { get; } = 1063091; public override double GetDamageScalar(Mobile attacker, Mobile defender) => 0.5;" (raw L13-L19)
- **C2** [modernuo-stated] "var chance = ninjitsu switch { // This formula is an approximation from OSI data. TODO: find correct formula < 100 => 30 + (ninjitsu - 85) * 2.2, _ => 63 + (ninjitsu - 100) * 1.1 }; if (chance / 100 < Utility.RandomDouble()) { attacker.SendLocalizedMessage(1070779); // You missed your opponent with a Death Strike. return; }" (raw L35-L46)
- **C3** [modernuo-stated] "public static void AddStep(Mobile m) { if (_table.TryGetValue(m, out var timer) && ++timer.Steps >= 5) { timer.ProcessDeathStrike(); } }" (raw L80-L86)
- **C4** [modernuo-stated] "internal DeathStrikeTimer(Mobile target, Mobile attacker, int damageBonus, bool isRanged) : base(TimeSpan.FromSeconds(5.0)) { _target = target; _attacker = attacker; _damageBonus = damageBonus; _isRanged = isRanged; }" (raw L104-L111)
- **C5** [modernuo-stated] "if (Core.ML) { var scalar = Math.Min(1, (_attacker.Skills.Hiding.Value + _attacker.Skills.Stealth.Value) / 220); // New formula doesn't apply DamageBonus anymore, caps must be, directly, 60/30. if (Steps >= 5) { damage = (int)Math.Floor(Math.Min(60, ninjitsu / 3 * (0.3 + 0.7 * scalar) + stalkingBonus)); } else { damage = (int)Math.Floor(Math.Min(30, ninjitsu / 9 * (0.3 + 0.7 * scalar) + stalkingBonus)); } if (_isRanged) { damage /= 2; } _target.Damage(damage, _attacker); // Damage is direct." (raw L126-L145)

## Death Strike Detonation Formulas

| Parameter | Canonical ModernUO Rule | Formula / Value | Claim Citation |
|---|---|---|---|
| **Base Mana, Skill & Initial Hit Scalar** | Costs `30` base mana (`ninja_death` in `abilities-catalog.json` uses `ref: 501` and `20` mana per `[[status-effects]] C10`), requires `85.0` Ninjitsu, and scales the initial weapon swing by `0.5x` | `BaseMana = 30`, `RequiredSkill = 85.0`, `GetDamageScalar = 0.5` | **C1**, `[[status-effects]] C10` |
| **Application Success Roll (`OnHit`)** | Rolls `chance / 100` (`63%` at `100.0` Ninjitsu; `85%` at `120.0` Ninjitsu) after the weapon swing connects | `< 100: 30 + (Ninjitsu - 85) * 2.2`; `>= 100: 63 + (Ninjitsu - 100) * 1.1` | **C2** |
| **Trigger Condition (`AddStep` vs `DeathStrikeTimer`)** | Detonates immediately at `++timer.Steps >= 5` or after `5.0` seconds (`TimeSpan.FromSeconds(5.0)`) | `Steps >= 5` or `5.0s` timer expiry | **C3**, **C4** |
| **Core.ML Direct Detonation Damage** | Uses `scalar = Math.Min(1, (Hiding + Stealth) / 220)`. At `Steps >= 5`: `Math.Min(60, Ninjitsu / 3 * (0.3 + 0.7 * scalar) + stalkingBonus)`; at `Steps < 5`: `Math.Min(30, Ninjitsu / 9 * (0.3 + 0.7 * scalar) + stalkingBonus)`; halved if `_isRanged` | Direct unmitigated damage capped at `60` (`Steps >= 5`) or `30` (`Steps < 5`) | **C5** |
