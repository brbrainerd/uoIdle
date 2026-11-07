import { z } from 'zod';

export const EffectTypeEnum = z.enum([
  'self_buff',
  'direct_damage',
  'dot',
  'debuff',
  'heal',
  'posture',
  'summon',
  'stealth',
]);

export const SkillEffectTypeEnum = z.enum([
  'self_buff',
  'direct_damage',
  'dot',
  'debuff',
  'heal',
]);

export const AuthorityTierEnum = z.enum([
  'server-authoritative',
  'client-estimator',
  'modernuo-reference',
  'design-proposal',
]);

export const EffectModifierStatEnum = z.enum([
  'damage_dealt_pct',
  'damage_taken_pct',
  'defense_pct',
  'attack_speed_pct',
  'crit_chance_pct',
  'evasion_pct',
  'reflect_magic',
  'stun',
  'paralyze',
  'disarm',
  'bleed_dot',
  'poison_dot',
  'burn_dot',
  'execute_bonus_pct',
  'armor_ignore_pct',
  'multi_hit_count',
  'taunt',
  'clone_stacks',
  'perfection_streak_pct',
]);

export const EffectModifierSchema = z
  .object({
    stat: EffectModifierStatEnum,
    value: z.number(),
    condition: z.string().min(1).optional(),
  })
  .strict();

export const EffectSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9_]+$/),
    name: z.string().min(1),
    effectType: EffectTypeEnum,
    durationMs: z.number().int().min(0),
    tickIntervalMs: z.number().int().min(0),
    tickCount: z.number().int().min(0),
    modifiers: z.array(EffectModifierSchema),
    stackingRule: z.enum(['replace', 'refresh', 'stack', 'independent', 'exclusive_posture']),
    authorityTier: AuthorityTierEnum,
  })
  .strict();

export const SkillKindEnum = z.enum([
  'Passive',
  'Custom',
  'WeaponAbility',
  'Spell',
  'SpecialMove',
  'ItemUse',
]);

export const ClassIdEnum = z.enum([
  'warrior',
  'ranger',
  'mage',
  'worker',
  'berserker',
  'duelist',
  'necromancer',
  'mystic',
  'spellweaver',
  'paladin',
  'assassin',
  'ninja',
  'monk',
  'samurai',
  'bard',
  'tamer',
]);

export const SkillCategoryEnum = z.enum([
  'warrior',
  'ranger',
  'mage',
  'worker',
  'berserker',
  'duelist',
  'necromancer',
  'mystic',
  'spellweaver',
  'paladin',
  'assassin',
  'ninja',
  'monk',
  'samurai',
  'bard',
  'tamer',
  '*',
]);

export const MapScopeEnum = z.enum(['UO', 'New', 'Idle', 'New/Eth', 'Eth/New']);

export const ScalingStatEnum = z.enum([
  'str',
  'dex',
  'int',
  'weapon',
  'tactics',
  'magery',
  'chivalry',
  'necromancy',
  'spellweaving',
  'bushido',
  'ninjitsu',
  'focus',
  'alchemy',
  'healing',
  'none',
]);

export const ScalingFormulaSchema = z
  .object({
    summary: z.string().min(1),
    stat: ScalingStatEnum,
    minMultiplier: z.number().optional(),
    maxMultiplier: z.number().optional(),
    schoolMultiplier: z.number().optional(),
    hits: z.number().int().min(1).optional(),
    splashRatio: z.number().optional(),
    executeThresholdHpPct: z.number().optional(),
    executeMultiplier: z.number().optional(),
  })
  .strict();

export const SkillBaseObjectSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9_]+$/),
    aliasOf: z.string().regex(/^[a-z0-9_]+$/).nullable(),
    name: z.string().min(1),
    namePtBr: z.string().min(1),
    category: SkillCategoryEnum,
    kind: SkillKindEnum,
    tab: z.enum(['ability', 'spell', 'item']),
    cooldownMs: z.number().int().min(0),
    customCooldownMs: z
      .number()
      .int()
      .refine((v) => v === 0 || v >= 2000, {
        message: 'customCooldownMs must be 0 or >= 2000ms server floor',
      }),
    manaCost: z.number().int().min(0),
    staminaCost: z.number().int().min(0),
    goldCost: z.number().int().min(0),
    reagentsRequired: z.boolean(),
    effectType: SkillEffectTypeEnum,
    statusEffect: EffectSchema.nullable(),
    weaponAbilityRef: z.number().int().min(1).nullable(),
    spellId: z.number().int().min(1).nullable(),
    itemId: z.number().int().min(1).nullable(),
    mapScope: MapScopeEnum.nullable(),
    gumpIcon: z.number().int().nullable(),
    iconKey: z.string().min(1).nullable(),
    scalingFormula: ScalingFormulaSchema,
    unlockLevel: z.number().int().min(1).max(300).nullable(),
    progressionTreeLevel: z.number().int().min(1).max(60).nullable(),
    inCatalog: z.boolean(),
  })
  .strict();

export const SkillSchema = SkillBaseObjectSchema.superRefine((skill, ctx) => {
  if (skill.inCatalog && (skill.unlockLevel === null || skill.unlockLevel < 1 || skill.unlockLevel > 300)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Catalog skill ${skill.id} must have unlockLevel in 1..300`,
      path: ['unlockLevel'],
    });
  }
  if (!skill.inCatalog && skill.unlockLevel !== null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Non-catalog skill ${skill.id} must have unlockLevel === null`,
      path: ['unlockLevel'],
    });
  }
  if (skill.inCatalog && skill.kind === 'Custom' && skill.customCooldownMs < 2000) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Catalog Custom skill ${skill.id} must have customCooldownMs >= 2000`,
      path: ['customCooldownMs'],
    });
  }
  if (skill.kind === 'WeaponAbility' && (skill.weaponAbilityRef === null || skill.weaponAbilityRef < 1)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `WeaponAbility skill ${skill.id} must have a positive weaponAbilityRef`,
      path: ['weaponAbilityRef'],
    });
  }
  if (
    (skill.kind === 'Spell' || skill.kind === 'SpecialMove') &&
    (skill.spellId === null || skill.spellId < 1)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${skill.kind} skill ${skill.id} must have a positive spellId`,
      path: ['spellId'],
    });
  }
});

export const ProgressionLevelEnum = z.union([
  z.literal(1),
  z.literal(5),
  z.literal(10),
  z.literal(15),
  z.literal(20),
  z.literal(25),
  z.literal(30),
  z.literal(35),
  z.literal(40),
  z.literal(45),
  z.literal(50),
  z.literal(55),
  z.literal(60),
]);

export const ProgressionMilestoneSchema = z
  .object({
    level: ProgressionLevelEnum,
    id: z.string().regex(/^[a-z0-9_]+$/),
    nameEn: z.string().min(1),
    namePtBr: z.string().min(1),
    type: z.enum(['passive', 'skill', 'spell', 'mechanic', 'feature']),
    descEn: z.string().min(1),
    descPtBr: z.string().min(1),
    inCatalog: z.boolean(),
    catalogId: z.string().regex(/^[a-z0-9_]+$/).nullable(),
  })
  .strict();

export const StarterSkillGrantSchema = z
  .object({
    skillId: z.number().int().min(0).max(57),
    skillKey: z.string().min(1),
    initialValue: z.union([z.literal(50), z.literal(30)]),
  })
  .strict();

export const LegacySkillWeightSchema = z
  .object({
    skillId: z.number().int().min(0).max(57),
    skillKey: z.string().min(1),
    weight: z.union([z.literal(40), z.literal(30), z.literal(20), z.literal(10)]),
  })
  .strict();

export const HotbarConditionSchema = z
  .object({
    target: z.enum(['self', 'ally', 'party:leader', 'enemy']),
    attr: z.string().min(1),
    op: z.enum(['<=', '>=', '==', '<', '>', '!=']),
    value: z.number(),
    percent: z.boolean().optional(),
    join: z.enum(['and', 'or']).optional(),
  })
  .strict();

export const SeededHotbarSlotSchema = z
  .object({
    slotIndex: z.number().int().min(0).max(11),
    kind: z.enum(['ability', 'spell', 'item', 'meditate']),
    abilityId: z.string().min(1),
    label: z.string().min(1),
    enabled: z.boolean(),
    graphic: z.number().int().min(0).optional(),
    hue: z.number().int().min(0).optional(),
    context: z.enum(['always', 'hunt', 'gather']).optional(),
    conditions: z.array(HotbarConditionSchema),
  })
  .strict();

export const PaperdollLayerSchema = z
  .object({
    layer: z.string().min(1),
    graphic: z.number().int().min(1),
    softFlag: z
      .enum(['softShirt', 'softRobe', 'softCloak', 'softHat', 'softLower', 'softTop'])
      .optional(),
  })
  .strict();

export const ClassBaseObjectSchema = z
  .object({
    id: ClassIdEnum,
    classNumericId: z.number().int().min(101).max(116),
    badge: z.string().regex(/^[A-Z]{2}$/),
    role: z.enum(['melee', 'ranged', 'magic', 'support']),
    baseStats: z
      .object({
        str: z.number().int().min(10).max(100),
        dex: z.number().int().min(10).max(100),
        int: z.number().int().min(10).max(100),
      })
      .strict(),
    resourceProfile: z
      .object({
        primaryResource: z.enum(['stamina', 'mana', 'zero-mana-physical']),
        startingManaMax: z.number().int().min(0),
        meditationCap: z.number().int().min(0).max(120),
        consumesReagents: z.boolean(),
        consumesAmmo: z.boolean(),
        chivalryGoldTithe: z.boolean(),
      })
      .strict(),
    starterSkills: z.array(StarterSkillGrantSchema).min(6).max(10),
    legacyTemplateSkills: z.array(LegacySkillWeightSchema).length(4),
    starterEquipment: z
      .object({
        kitTokens: z.array(z.string().min(1)).min(1),
        paperdollLayers: z.array(PaperdollLayerSchema).min(1),
      })
      .strict(),
    robeHue: z.number().int().min(0),
    seededHotbar: z.array(SeededHotbarSlotSchema).min(1),
    progression: z.array(ProgressionMilestoneSchema).min(1),
    abilities: z.array(SkillSchema).min(1),
  })
  .strict();

export const ClassSchema = ClassBaseObjectSchema.superRefine((cls, ctx) => {
  const abilityIds = new Set(cls.abilities.map((a) => a.id));

  for (let i = 0; i < cls.progression.length; i++) {
    const milestone = cls.progression[i];
    if (i > 0 && milestone.level < cls.progression[i - 1].level) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Progression milestone ${milestone.id} at level ${milestone.level} is out of non-decreasing order`,
        path: ['progression', i, 'level'],
      });
    }
    const targetAbilityId = milestone.catalogId ?? milestone.id;
    if (!abilityIds.has(targetAbilityId) && !abilityIds.has(milestone.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Progression milestone ${milestone.id} (catalogId=${milestone.catalogId}) is missing from class abilities`,
        path: ['progression', i, 'id'],
      });
    }
  }

  const hasMagicResist = cls.starterSkills.some(
    (s) => s.skillId === 26 && s.skillKey === 'magicResist' && s.initialValue === 30
  );
  if (!hasMagicResist) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Class ${cls.id} starterSkills must include magicResist (skillId: 26, initialValue: 30)`,
      path: ['starterSkills'],
    });
  }

  const hasFocus = cls.starterSkills.some(
    (s) => s.skillId === 50 && s.skillKey === 'focus' && s.initialValue === 50
  );
  if (!hasFocus) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Class ${cls.id} starterSkills must include focus (skillId: 50, initialValue: 50)`,
      path: ['starterSkills'],
    });
  }
});

export const RawCatalogAbilitySchema = z
  .object({
    id: z.string().regex(/^[a-z0-9_]+$/),
    class: SkillCategoryEnum,
    kind: SkillKindEnum,
    name: z.string().min(1),
    unlock: z.number().int().min(1).max(300),
    mana: z.number().int().min(0),
    blurb: z.string().min(1),
    tab: z.enum(['ability', 'spell', 'item']),
    map: MapScopeEnum.optional(),
    ref: z.number().int().min(1).optional(),
    icon: z.number().int().min(1).optional(),
    hue: z.number().int().min(0).optional(),
    gumpIcon: z.number().int().min(1).optional(),
    iconKey: z.string().min(1).optional(),
  })
  .strict();

export type EffectDefinition = z.infer<typeof EffectSchema>;
export type SkillDefinition = z.infer<typeof SkillSchema>;
export type ProgressionMilestone = z.infer<typeof ProgressionMilestoneSchema>;
export type StarterSkillGrant = z.infer<typeof StarterSkillGrantSchema>;
export type LegacySkillWeight = z.infer<typeof LegacySkillWeightSchema>;
export type SeededHotbarSlot = z.infer<typeof SeededHotbarSlotSchema>;
export type ClassDefinition = z.infer<typeof ClassSchema>;
export type RawCatalogAbility = z.infer<typeof RawCatalogAbilitySchema>;
