---
id: "bushido-perfection-honor"
title: "Bushido Perfection and Honor Virtue Mechanics"
category: "modernuo-bushido"
aliases: ["perfection", "honor", "honor-context", "samurai-perfection"]
status: "modernuo-stated"
sources: ["_raw/modernuo/HonorContext.cs"]
evidence: ["modernuo: _raw/modernuo/BaseWeapon.cs:1843-1854", "modernuo: _raw/modernuo/BaseWeapon.cs:2213-2216", "modernuo: _raw/modernuo/BaseWeapon.cs:2422-2425"]
code_refs: ["ModernUO:Engines.Virtues.HonorContext", "ModernUO:Items.BaseWeapon.OnHit", "ModernUO:Items.BaseWeapon.OnMiss"]
updated: "2026-11-07"
---
# Bushido Perfection and Honor Virtue Mechanics

Source: [raw](../_raw/modernuo/HonorContext.cs)

## Summary

In canonical ModernUO, the Honor virtue context links a Samurai attacker to a single honored opponent and tracks consecutive melee hits through the Perfection streak accumulator. Landing consecutive strikes while meeting the minimum Bushido skill threshold increases the Perfection damage bonus up to a hard cap and derives a quadratic Luck bonus, whereas missing the honored opponent subtracts a fixed penalty or resets the streak. Defeating an opponent while holding a positive Perfection bonus restores health, stamina, and mana proportional to the target fame and accumulated streak, while stepping outside the maximum engagement range cancels the active Honor session. See [[modernuo-bushido]] for the weapon damage and hit-dispatch hooks.

## Claims

- **C1** [modernuo-stated] "public int PerfectionDamageBonus { get; private set; } public int PerfectionLuckBonus => PerfectionDamageBonus * PerfectionDamageBonus / 10;" (raw L53-L55)
- **C2** [modernuo-stated] "public void OnTargetHit(Mobile from) { if (from != Source || PerfectionDamageBonus == 100) { return; } var bushido = (int)from.Skills.Bushido.Value; if (bushido < 50) { return; } PerfectionDamageBonus += bushido / 10; if (PerfectionDamageBonus >= 100) { PerfectionDamageBonus = 100;" (raw L110-L128)
- **C3** [modernuo-stated] "public void OnTargetMissed(Mobile from) { if (from != Source || PerfectionDamageBonus == 0) { return; } PerfectionDamageBonus -= 25; if (PerfectionDamageBonus <= 0) { PerfectionDamageBonus = 0;" (raw L136-L148)
- **C4** [modernuo-stated] "if (PerfectionDamageBonus > 0) { var restore = Math.Min(PerfectionDamageBonus * (targetFame + 5000) / 25000, 10); Source.Hits += restore; Source.Stam += restore; Source.Mana += restore; }" (raw L180-L187)
- **C5** [modernuo-stated] "public bool CheckDistance() => Utility.InRange(Source.Location, Target.Location, 18);" (raw L229-L229)

## Perfection Streak Formulas and Honor Context Rules

| Mechanic Component | Canonical ModernUO Rule | Formula / Threshold | Claim Citation |
|---|---|---|---|
| **Damage & Luck Bonus Properties** | `PerfectionDamageBonus` scales additive weapon damage percentage; `PerfectionLuckBonus` scales quadratically up to `1000` Luck at `100%` Perfection | `PerfectionLuckBonus = PerfectionDamageBonus^2 / 10` | **C1**, `[[modernuo-bushido]] C7` |
| **Per-Hit Streak Gain (`OnTargetHit`)** | Requires `Bushido >= 50`; each connected hit adds `Bushido / 10` (e.g., `+10%` at `100.0` Bushido, `+12%` at `120.0` Bushido) up to a hard cap of `100` | `PerfectionDamageBonus = Math.Min(100, PerfectionDamageBonus + (int)Bushido / 10)` | **C2**, `[[modernuo-bushido]] C8` |
| **Per-Miss Penalty (`OnTargetMissed`)** | Every missed swing against the honored opponent subtracts `25` from `PerfectionDamageBonus`, floored at `0` | `PerfectionDamageBonus = Math.Max(0, PerfectionDamageBonus - 25)` | **C3**, `[[modernuo-bushido]] C8` |
| **On-Kill Vital Recovery (`OnTargetKilled`)** | Killing the honored opponent while `PerfectionDamageBonus > 0` restores equal `Hits`, `Stam`, and `Mana` up to `10` points | `restore = Math.Min(PerfectionDamageBonus * (targetFame + 5000) / 25000, 10)` | **C4** |
| **Engagement Range (`CheckDistance`)** | A `1.0s` `InternalTimer` cancels the `HonorContext` if the distance between `Source` and `Target` exceeds `18` tiles | `Utility.InRange(Source.Location, Target.Location, 18)` | **C5** |
