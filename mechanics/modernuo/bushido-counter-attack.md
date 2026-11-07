---
id: "bushido-counter-attack"
title: "Bushido Counter Attack Reactive Parry Stance"
category: "modernuo-bushido"
aliases: ["counter-attack", "samurai-counter"]
status: "modernuo-stated"
sources: ["_raw/modernuo/CounterAttack.cs"]
evidence: ["modernuo: _raw/modernuo/BaseWeapon.cs:1592-1601", "modernuo: _raw/modernuo/SamuraiSpell.cs:99-104"]
code_refs: ["ModernUO:Spells.Bushido.CounterAttack", "ModernUO:Items.BaseWeapon.AbsorbDamageAOS"]
updated: "2026-11-07"
---
# Bushido Counter Attack Reactive Parry Stance

Source: [raw](../_raw/modernuo/CounterAttack.cs)

## Summary

Counter Attack is a Bushido defensive stance spell that prepares the Samurai to retaliate immediately upon parrying an opponent's melee blow. Casting the spell requires an equipped melee weapon or shield and places the caster into a countering state until either a parried blow triggers an immediate free weapon swing or the stance timer expires. Like Confidence and Evasion, casting Counter Attack cancels any other active Bushido stance. See [[modernuo-bushido]] for the parry-retaliation swing execution in the combat engine.

## Claims

- **C1** [modernuo-stated] "public override TimeSpan CastDelayBase => TimeSpan.FromSeconds(0.25); public override double RequiredSkill => 40.0; public override int RequiredMana => 5;" (raw L22-L25)
- **C2** [modernuo-stated] "if (Caster.FindItemOnLayer(Layer.OneHanded) is BaseWeapon) { return true; } if (Caster.FindItemOnLayer(Layer.TwoHanded) is BaseShield or BaseWeapon) { return true; }" (raw L34-L42)
- **C3** [modernuo-stated] "Timer.StartTimer(TimeSpan.FromSeconds(30.0), () => { StopCountering(m); m.SendLocalizedMessage(1063119); // You return to your normal stance. }, out var timerToken );" (raw L86-L93)

## Counter Attack Stance Specifications

| Parameter | Canonical ModernUO Rule | Value / Condition | Claim Citation |
|---|---|---|---|
| **Cast Delay, Skill & Mana** | Fast `0.25s` cast time requiring `40.0` Bushido and `5` Mana (`abilities-catalog.json` `samurai_counter` uses `ref: 403` and `10` mana per `[[status-effects]] C14`) | `CastDelayBase = 0.25s`, `RequiredSkill = 40.0`, `RequiredMana = 5` | **C1**, `[[status-effects]] C14` |
| **Equipment Requirement (`CheckCast`)** | Requires a `BaseWeapon` on `Layer.OneHanded` or a `BaseShield` / `BaseWeapon` on `Layer.TwoHanded` | Weapon or shield equipped | **C2** |
| **Stance Window (`StartCountering`)** | Remains active for up to `30.0` seconds or until consumed by the first parried attack | `30.0s` duration | **C3** |
| **Retaliation Trigger (`BaseWeapon.AbsorbDamageAOS`)** | On a successful `CheckParry(defender)` roll, executes `weapon.OnSwing(defender, attacker)` and calls `CounterAttack.StopCountering(defender)` | Immediate free weapon swing on parry | `[[modernuo-bushido]] C5` |
