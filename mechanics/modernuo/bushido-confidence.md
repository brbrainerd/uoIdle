---
id: "bushido-confidence"
title: "Bushido Confidence Defensive Stance and Regeneration"
category: "modernuo-bushido"
aliases: ["confidence", "samurai-confidence"]
status: "modernuo-stated"
sources: ["_raw/modernuo/Confidence.cs"]
evidence: ["modernuo: _raw/modernuo/BaseWeapon.cs:1603-1612", "modernuo: _raw/modernuo/SamuraiSpell.cs:99-104"]
code_refs: ["ModernUO:Spells.Bushido.Confidence", "ModernUO:Items.BaseWeapon.AbsorbDamageAOS"]
updated: "2026-11-07"
---
# Bushido Confidence Defensive Stance and Regeneration

Source: [raw](../_raw/modernuo/Confidence.cs)

## Summary

Confidence is a Bushido defensive stance spell that provides both an immediate short-duration health regeneration over time effect on cast and a longer-duration reactive stance that restores health and stamina whenever the Samurai successfully parries an incoming blow. Casting Confidence automatically terminates any active Evasion or Counter Attack stance via the shared Samurai spell base handler. See [[modernuo-bushido]] for the on-parry health and stamina restoration formula.

## Claims

- **C1** [modernuo-stated] "public override TimeSpan CastDelayBase => TimeSpan.FromSeconds(0.25); public override double RequiredSkill => 25.0; public override int RequiredMana => 10;" (raw L24-L27)
- **C2** [modernuo-stated] "Timer.StartTimer(TimeSpan.FromSeconds(30.0), () => { EndConfidence(m); m.SendLocalizedMessage(1063116); // Your confidence wanes. }, out var timerToken );" (raw L60-L67)
- **C3** [modernuo-stated] "Timer.StartTimer(TimeSpan.FromSeconds(1.0), TimeSpan.FromSeconds(1.0), 4, () => { // ReSharper disable once AccessToModifiedClosure if (timerToken.RemainingCount == 0) { StopRegenerating(m); } // RunUO says this goes for 5 seconds, but UOGuide says 4 seconds during normal regeneration // Divide by 4 because this is per second. var hits = (int)((15 + m.Skills.Bushido.Value * m.Skills.Bushido.Value / 576) / 4); m.Hits += hits; }," (raw L120-L135)

## Confidence Stance and HoT Parameters

| Mechanic Parameter | Canonical ModernUO Implementation | Formula / Value | Claim Citation |
|---|---|---|---|
| **Cast Delay, Skill & Mana** | Fast `0.25s` cast time requiring `25.0` Bushido and `10` Mana | `CastDelayBase = 0.25s`, `RequiredSkill = 25.0`, `RequiredMana = 10` | **C1** |
| **Active Stance Duration (`BeginConfidence`)** | Maintains `IsConfident(m)` for `30.0` seconds unless replaced by another `SamuraiSpell` | `30.0s` stance duration | **C2**, `[[bushido-evasion]]` |
| **On-Cast Health Regeneration (`BeginRegenerating`)** | Ticks once per second for `4` seconds, restoring a quarter of the total quadratic Bushido heal each second | `hitsPerTick = (int)((15 + Bushido^2 / 576) / 4)` (`8` HP/tick = `32` HP total at `100.0` Bushido; `10` HP/tick = `40` HP total at `120.0` Bushido) | **C3** |
| **On-Parry Vital Restore (`BaseWeapon.AbsorbDamageAOS`)** | Every successful parry while `IsConfident(defender)` restores `1..(int)(Bushido / 12)` Hits and `1..(int)(Bushido / 5)` Stamina | `Hits += RandomMinMax(1, Bushido / 12)`, `Stam += RandomMinMax(1, Bushido / 5)` | `[[modernuo-bushido]] C6` |
