# Phase 12-01 Summary: Live-Codebase Combat Math, Affix Caps, Postures & Hotbar `ro(e)` Parity

## Completed Deliverables

1. **Hard Attribute & Affix Caps (`SIM-06`, `i18n-en-abilities.js:2616`)**
   - Updated [`computeSkillBaseOutput`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts#L455-L624) to clamp gear `SDI` at `50%` (`clamp(bracket.spellDamageIncreasePct, 0, 50)`) while adding `+1% SDI per 10 INT` (`Math.floor(stats.int / 10)`).
   - Updated [`computeAutoAttackRawDamage`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts#L381-L401) to clamp gear `DI` at `100%` and flatten weapon skill scaling above `100` (`Math.min(100, bracket.skillLevel)`).
   - Updated [`computeSwingIntervalMs`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts#L326-L337) to clamp gear `SSI` at `60%` while allowing progression tree `Speed` (`bracket.treeSpeedPct`) and active haste buffs (`buffAttackSpeedPct`) to stack above the `60%` gear cap down to the `1,000ms` swing floor.
   - Updated [`resolveSkillResourceCost`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts#L303-L320) to enforce the `40%` `LMC` cap (`clamp(bracket?.lowerManaCostPct ?? 0, 0, 40)`).
   - Implemented `EnhancePotions` (capped at `50%`) on heal/mana potions and `ReflectPhysical` (capped at `50%`) on incoming physical hits inside [`src/sim/engine.ts`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts).

2. **Canonical `[huntpostura` Postures, Material Ladder (`+8%` / `+12%`) & Secondary `splashRatio` (`SIM-06`)**
   - Defined `POSTURE_PROFILES` (`agressivo`: `1.2x` dmg dealt / `1.4x` dmg taken; `equilibrado`: `1.0x` / `1.0x`; `defensivo`: `0.6x` / `0.8x`) and [`resolvePostureProfile`](file:///Users/brbrainerd/dev/uoIdle/src/sim/archetypes.ts#L70-L88) in [`src/sim/archetypes.ts`](file:///Users/brbrainerd/dev/uoIdle/src/sim/archetypes.ts).
   - Updated [`MATERIAL_TIER_SPECS`](file:///Users/brbrainerd/dev/uoIdle/src/sim/archetypes.ts#L27-L37) and [`buildMaterialTierBudget`](file:///Users/brbrainerd/dev/uoIdle/src/sim/archetypes.ts#L94-L127) with canonical `+8%` weapon damage per material step and `+12%` armor resistance/durability per step (`Iron` through `Valorite`).
   - Updated multi-target damage resolution in [`src/sim/engine.ts`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts) so the primary target (`targetOffset === 0`) receives `100%` of `rawDamagePerHit` and secondary targets (`targetOffset > 0`) receive `rawDamagePerHit * splashRatio`.

3. **Complete 1H (`48,000`), 2H (`41,140`), and Shield (`400`) `CheckParry` + `ro(e)` Hotbar Auto-Triggers (`SIM-07`)**
   - Implemented [`computeParryAndAvoidanceChance`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts#L409-L448) supporting 1H Bushido parry (`48,000`), 2H Bushido parry (`41,140`), pure Shield parry (`400`), Bushido shield inversion (`(parry - bushido) / 400`), and the `<80 DEX` ModernUO penalty.
   - Implemented [`resolveHotbarHealTriggerPct`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts#L96-L104) and [`evaluateHotbarAutoTrigger`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts#L109-L163) matching UO Idle's `ro(e)` hotbar priority predicates (`lesser_heal_potion` `<=50%`, `heal_potion` `<=32%`, `greater_heal_potion` `<=18%`, `mage_heal` `<=50%`, `greater_heal` `<=40%`, `samurai_confidence` `<=55%`).
