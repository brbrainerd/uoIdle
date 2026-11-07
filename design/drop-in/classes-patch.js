/**
 * UO Idle v0.99.0 — Samurai (Bushido, id: 114) & Ninja (Ninjitsu, id: 115) Drop-in Client/Server Patch
 *
 * Wires the complete L1-60 progression trees, normalized ability catalog entries,
 * combat estimators, starter skills/equipment, seeded hotbars, and bilingual i18n strings
 * into the live v0.99.0 client/server bundle tables (_E/dx, WE/hE, yE/mx, FE, mE/gh, gE, b, qC/Cq/Eq).
 */

export const CLASS_METADATA_PATCH = {
  samurai: {
    id: 114,
    key: 'samurai',
    badge: 'SM',
    role: 'melee',
    robeHue: 1884,
    baseStats: { str: 50, dex: 30, int: 10 },
    resourceProfile: {
      primaryResource: 'mana',
      startingManaMax: 25,
      meditationCap: 100,
      consumesReagents: false,
      consumesAmmo: false,
      chivalryGoldTithe: false,
    },
  },
  ninja: {
    id: 115,
    key: 'ninja',
    badge: 'NJ',
    role: 'melee',
    robeHue: 1175,
    baseStats: { str: 30, dex: 50, int: 10 },
    resourceProfile: {
      primaryResource: 'mana',
      startingManaMax: 25,
      meditationCap: 100,
      consumesReagents: false,
      consumesAmmo: false,
      chivalryGoldTithe: false,
    },
  },
};

export const STARTER_SKILLS_PATCH = {
  samurai: [
    { skillId: 52, skillKey: 'bushido', initialValue: 50 },
    { skillId: 40, skillKey: 'swords', initialValue: 50 },
    { skillId: 27, skillKey: 'tactics', initialValue: 50 },
    { skillId: 5, skillKey: 'parry', initialValue: 50 },
    { skillId: 1, skillKey: 'anatomy', initialValue: 50 },
    { skillId: 17, skillKey: 'healing', initialValue: 50 },
    { skillId: 26, skillKey: 'magicResist', initialValue: 30 },
    { skillId: 50, skillKey: 'focus', initialValue: 50 },
  ],
  ninja: [
    { skillId: 53, skillKey: 'ninjitsu', initialValue: 50 },
    { skillId: 42, skillKey: 'fencing', initialValue: 50 },
    { skillId: 27, skillKey: 'tactics', initialValue: 50 },
    { skillId: 21, skillKey: 'hiding', initialValue: 50 },
    { skillId: 47, skillKey: 'stealth', initialValue: 50 },
    { skillId: 1, skillKey: 'anatomy', initialValue: 50 },
    { skillId: 26, skillKey: 'magicResist', initialValue: 30 },
    { skillId: 50, skillKey: 'focus', initialValue: 50 },
  ],
};

export const STARTER_EQUIPMENT_PATCH = {
  samurai: {
    kitTokens: ['samuraiSet', 'katana', 'bandages', 'potionsMelee', 'robeCloak'],
    paperdollLayers: [
      { layer: 'Helm', graphic: 10102 },
      { layer: 'InnerTorso', graphic: 10182 },
      { layer: 'Arms', graphic: 10110 },
      { layer: 'Pants', graphic: 5067 },
      { layer: 'Shoes', graphic: 10134 },
      { layer: 'OneHanded', graphic: 5119 },
      { layer: 'OuterTorso', graphic: 7939, softFlag: 'softRobe' },
      { layer: 'Cloak', graphic: 5397, softFlag: 'softCloak' },
    ],
  },
  ninja: {
    kitTokens: ['ninjaSet', 'kryss', 'bandages', 'potionsMelee', 'robeCloak'],
    paperdollLayers: [
      { layer: 'Helm', graphic: 10128 },
      { layer: 'InnerTorso', graphic: 10131 },
      { layer: 'Arms', graphic: 10132 },
      { layer: 'Gloves', graphic: 10130 },
      { layer: 'Pants', graphic: 10129 },
      { layer: 'Shoes', graphic: 10133 },
      { layer: 'OneHanded', graphic: 5121 },
      { layer: 'OuterTorso', graphic: 7939, softFlag: 'softRobe' },
      { layer: 'Cloak', graphic: 5397, softFlag: 'softCloak' },
    ],
  },
};

export const LEGACY_TEMPLATES_PATCH = {
  samurai: [
    { skillId: 40, skillKey: 'swords', weight: 30 },
    { skillId: 52, skillKey: 'bushido', weight: 30 },
    { skillId: 27, skillKey: 'tactics', weight: 20 },
    { skillId: 1, skillKey: 'anatomy', weight: 20 },
  ],
  ninja: [
    { skillId: 42, skillKey: 'fencing', weight: 30 },
    { skillId: 53, skillKey: 'ninjitsu', weight: 30 },
    { skillId: 21, skillKey: 'hiding', weight: 20 },
    { skillId: 47, skillKey: 'stealth', weight: 20 },
  ],
};

export const SEEDED_HOTBAR_PATCH = {
  samurai: [
    {
      slotIndex: 0,
      kind: 'ability',
      abilityId: 'lesser_heal_potion',
      label: 'Lesser Heal',
      enabled: true,
      graphic: 3852,
      conditions: [{ target: 'self', attr: 'hp', op: '<=', value: 50, percent: true }],
    },
    {
      slotIndex: 1,
      kind: 'ability',
      abilityId: 'bandage',
      label: 'Bandage',
      enabled: true,
      graphic: 3617,
      conditions: [
        { target: 'self', attr: 'hp', op: '<=', value: 80, percent: true },
        { target: 'self', attr: 'poisoned', op: '==', value: 1, join: 'or' },
      ],
    },
    {
      slotIndex: 2,
      kind: 'ability',
      abilityId: 'lesser_cure_potion',
      label: 'Lesser Cure',
      enabled: true,
      graphic: 3847,
      conditions: [{ target: 'self', attr: 'poisoned', op: '==', value: 1 }],
    },
    {
      slotIndex: 3,
      kind: 'ability',
      abilityId: 'lesser_mana_potion',
      label: 'Lesser Mana',
      enabled: true,
      graphic: 3846,
      conditions: [{ target: 'self', attr: 'mana', op: '<=', value: 30, percent: true }],
    },
    {
      slotIndex: 4,
      kind: 'ability',
      abilityId: 'samurai_lightning',
      label: 'Bolt',
      enabled: true,
      conditions: [],
    },
  ],
  ninja: [
    {
      slotIndex: 0,
      kind: 'ability',
      abilityId: 'lesser_heal_potion',
      label: 'Lesser Heal',
      enabled: true,
      graphic: 3852,
      conditions: [{ target: 'self', attr: 'hp', op: '<=', value: 50, percent: true }],
    },
    {
      slotIndex: 1,
      kind: 'ability',
      abilityId: 'bandage',
      label: 'Bandage',
      enabled: true,
      graphic: 3617,
      conditions: [
        { target: 'self', attr: 'hp', op: '<=', value: 80, percent: true },
        { target: 'self', attr: 'poisoned', op: '==', value: 1, join: 'or' },
      ],
    },
    {
      slotIndex: 2,
      kind: 'ability',
      abilityId: 'lesser_cure_potion',
      label: 'Lesser Cure',
      enabled: true,
      graphic: 3847,
      conditions: [{ target: 'self', attr: 'poisoned', op: '==', value: 1 }],
    },
    {
      slotIndex: 3,
      kind: 'ability',
      abilityId: 'lesser_mana_potion',
      label: 'Lesser Mana',
      enabled: true,
      graphic: 3846,
      conditions: [{ target: 'self', attr: 'mana', op: '<=', value: 30, percent: true }],
    },
    {
      slotIndex: 4,
      kind: 'ability',
      abilityId: 'ninja_focus',
      label: 'Bolt',
      enabled: true,
      conditions: [],
    },
  ],
};

export const PROGRESSION_TREE_PATCH = {
  samurai: [
    ['samurai_way', 1],
    ['samurai_lightning', 5],
    ['samurai_perfection', 10],
    ['samurai_honorable', 15],
    ['samurai_confidence', 20],
    ['samurai_counter', 25],
    ['samurai_double_strike', 30],
    ['samurai_evasion', 35],
    ['samurai_momentum_strike', 40],
    ['samurai_armor_ignore', 45],
    ['samurai_lightning_r2', 50],
    ['samurai_honorable_r2', 60],
  ],
  ninja: [
    ['ninja_shadowjump', 1],
    ['ninja_focus', 5],
    ['ninja_mirror', 10],
    ['ninja_backstab', 15],
    ['ninja_death', 20],
    ['ninja_animal_form', 25],
    ['ninja_infectious_strike', 30],
    ['ninja_smoke_bomb', 35],
    ['ninja_ki_attack', 40],
    ['ninja_surprise_attack', 45],
    ['ninja_mirror_r2', 50],
    ['ninja_death_r2', 60],
  ],
};

export const ABILITIES_CATALOG_PATCH = {
  samurai: [
    {
      id: 'samurai_way',
      class: 'samurai',
      kind: 'Passive',
      name: 'Way of the Blade',
      unlock: 1,
      legacyUnlock: 75,
      mana: 0,
      blurb: 'Unlocks at level 1.',
      tab: 'ability',
      map: 'New',
      gumpIcon: 21536,
      iconKey: 'idle_samurai_way',
    },
    {
      id: 'samurai_lightning',
      class: 'samurai',
      kind: 'SpecialMove',
      name: 'Lightning Strike',
      unlock: 5,
      legacyUnlock: 1,
      mana: 10,
      blurb: 'Unlocks at level 5.',
      tab: 'ability',
      ref: 404,
      map: 'UO',
      gumpIcon: 21540,
      iconKey: 'gump_21540',
    },
    {
      id: 'samurai_perfection',
      class: 'samurai',
      kind: 'Custom',
      name: 'Honor & Perfection',
      unlock: 10,
      legacyUnlock: 10,
      mana: 8,
      blurb: 'Unlocks at level 10.',
      tab: 'ability',
      map: 'Idle',
      gumpIcon: 21536,
      iconKey: 'idle_samurai_perfection',
    },
    {
      id: 'samurai_honorable',
      class: 'samurai',
      kind: 'SpecialMove',
      name: 'Honorable Execution',
      unlock: 15,
      legacyUnlock: 10,
      mana: 0,
      stamina: 10,
      blurb: 'Unlocks at level 15.',
      tab: 'ability',
      ref: 400,
      map: 'UO',
      gumpIcon: 21536,
      iconKey: 'gump_21536',
    },
    {
      id: 'samurai_confidence',
      class: 'samurai',
      kind: 'Spell',
      name: 'Confidence',
      unlock: 20,
      legacyUnlock: 20,
      mana: 8,
      blurb: 'Unlocks at level 20.',
      tab: 'spell',
      ref: 401,
      map: 'UO',
      gumpIcon: 21537,
      iconKey: 'gump_21537',
    },
    {
      id: 'samurai_counter',
      class: 'samurai',
      kind: 'Spell',
      name: 'Counter Attack',
      unlock: 25,
      legacyUnlock: 5,
      mana: 10,
      blurb: 'Unlocks at level 25.',
      tab: 'spell',
      ref: 403,
      map: 'UO',
      gumpIcon: 21539,
      iconKey: 'gump_21539',
    },
    {
      id: 'samurai_double_strike',
      class: 'samurai',
      kind: 'WeaponAbility',
      name: 'Double Strike',
      unlock: 30,
      legacyUnlock: 30,
      mana: 12,
      blurb: 'Unlocks at level 30.',
      tab: 'ability',
      ref: 7,
      map: 'UO',
      gumpIcon: 20998,
      iconKey: 'gump_20998',
    },
    {
      id: 'samurai_evasion',
      class: 'samurai',
      kind: 'Spell',
      name: 'Evasion',
      unlock: 35,
      legacyUnlock: 35,
      mana: 10,
      blurb: 'Unlocks at level 35.',
      tab: 'spell',
      ref: 402,
      map: 'UO',
      gumpIcon: 21538,
      iconKey: 'gump_21538',
    },
    {
      id: 'samurai_momentum_strike',
      class: 'samurai',
      kind: 'Spell',
      name: 'Momentum Strike',
      unlock: 40,
      legacyUnlock: 40,
      mana: 12,
      blurb: 'Unlocks at level 40.',
      tab: 'spell',
      ref: 405,
      map: 'UO',
      gumpIcon: 21541,
      iconKey: 'gump_21541',
    },
    {
      id: 'samurai_armor_ignore',
      class: 'samurai',
      kind: 'WeaponAbility',
      name: 'Armor Ignore',
      unlock: 45,
      legacyUnlock: 45,
      mana: 14,
      blurb: 'Unlocks at level 45.',
      tab: 'ability',
      ref: 1,
      map: 'UO',
      gumpIcon: 20992,
      iconKey: 'gump_20992',
    },
    {
      id: 'samurai_lightning_r2',
      class: 'samurai',
      kind: 'SpecialMove',
      name: 'Lightning Strike II',
      unlock: 50,
      legacyUnlock: 300,
      mana: 10,
      blurb: 'Unlocks at level 50.',
      tab: 'ability',
      ref: 404,
      map: 'UO',
      gumpIcon: 21540,
      iconKey: 'gump_21540',
    },
    {
      id: 'samurai_honorable_r2',
      class: 'samurai',
      kind: 'SpecialMove',
      name: 'Honorable Execution II',
      unlock: 60,
      legacyUnlock: 200,
      mana: 0,
      stamina: 15,
      blurb: 'Unlocks at level 60.',
      tab: 'ability',
      ref: 400,
      map: 'UO',
      gumpIcon: 21536,
      iconKey: 'gump_21536',
    },
  ],
  ninja: [
    {
      id: 'ninja_shadowjump',
      class: 'ninja',
      kind: 'Passive',
      name: 'Shadowjump',
      unlock: 1,
      legacyUnlock: 75,
      mana: 0,
      blurb: 'Unlocks at level 1.',
      tab: 'ability',
      ref: 506,
      map: 'UO',
      gumpIcon: 21286,
      iconKey: 'gump_21286',
    },
    {
      id: 'ninja_focus',
      class: 'ninja',
      kind: 'SpecialMove',
      name: 'Focus Attack',
      unlock: 5,
      legacyUnlock: 1,
      mana: 8,
      blurb: 'Unlocks at level 5.',
      tab: 'ability',
      ref: 500,
      map: 'UO',
      gumpIcon: 21280,
      iconKey: 'gump_21280',
    },
    {
      id: 'ninja_mirror',
      class: 'ninja',
      kind: 'Spell',
      name: 'Mirror Image',
      unlock: 10,
      legacyUnlock: 10,
      mana: 10,
      blurb: 'Unlocks at level 10.',
      tab: 'spell',
      ref: 507,
      map: 'UO',
      gumpIcon: 21287,
      iconKey: 'gump_21287',
    },
    {
      id: 'ninja_backstab',
      class: 'ninja',
      kind: 'SpecialMove',
      name: 'Backstab',
      unlock: 15,
      legacyUnlock: 15,
      mana: 0,
      stamina: 10,
      blurb: 'Unlocks at level 15.',
      tab: 'ability',
      ref: 504,
      map: 'UO',
      gumpIcon: 21284,
      iconKey: 'gump_21284',
    },
    {
      id: 'ninja_death',
      class: 'ninja',
      kind: 'SpecialMove',
      name: 'Death Strike',
      unlock: 20,
      legacyUnlock: 5,
      mana: 0,
      stamina: 12,
      blurb: 'Unlocks at level 20.',
      tab: 'ability',
      ref: 501,
      map: 'UO',
      gumpIcon: 21281,
      iconKey: 'gump_21281',
    },
    {
      id: 'ninja_animal_form',
      class: 'ninja',
      kind: 'Spell',
      name: 'Animal Form',
      unlock: 25,
      legacyUnlock: 25,
      mana: 10,
      blurb: 'Unlocks at level 25.',
      tab: 'spell',
      ref: 502,
      map: 'UO',
      gumpIcon: 21282,
      iconKey: 'gump_21282',
    },
    {
      id: 'ninja_infectious_strike',
      class: 'ninja',
      kind: 'WeaponAbility',
      name: 'Infectious Strike',
      unlock: 30,
      legacyUnlock: 30,
      mana: 10,
      blurb: 'Unlocks at level 30.',
      tab: 'ability',
      ref: 11,
      map: 'UO',
      gumpIcon: 20999,
      iconKey: 'gump_20999',
    },
    {
      id: 'ninja_smoke_bomb',
      class: 'ninja',
      kind: 'Custom',
      name: 'Smoke Bomb',
      unlock: 35,
      legacyUnlock: 35,
      mana: 10,
      blurb: 'Unlocks at level 35.',
      tab: 'ability',
      map: 'Idle',
      gumpIcon: 10248,
      iconKey: 'idle_ninja_smoke_bomb',
    },
    {
      id: 'ninja_shuriken',
      class: 'ninja',
      kind: 'Custom',
      name: 'Shuriken & Fukiya Volley',
      unlock: 35,
      legacyUnlock: 20,
      mana: 8,
      blurb: 'Unlocks at level 35.',
      tab: 'ability',
      map: 'Idle',
      gumpIcon: 10156,
      iconKey: 'idle_ninja_shuriken',
    },
    {
      id: 'ninja_ki_attack',
      class: 'ninja',
      kind: 'SpecialMove',
      name: 'Ki Attack',
      unlock: 40,
      legacyUnlock: 40,
      mana: 12,
      blurb: 'Unlocks at level 40.',
      tab: 'ability',
      ref: 503,
      map: 'UO',
      gumpIcon: 21283,
      iconKey: 'gump_21283',
    },
    {
      id: 'ninja_surprise_attack',
      class: 'ninja',
      kind: 'SpecialMove',
      name: 'Surprise Attack',
      unlock: 45,
      legacyUnlock: 45,
      mana: 12,
      blurb: 'Unlocks at level 45.',
      tab: 'ability',
      ref: 505,
      map: 'UO',
      gumpIcon: 21285,
      iconKey: 'gump_21285',
    },
    {
      id: 'ninja_mirror_r2',
      class: 'ninja',
      kind: 'Spell',
      name: 'Mirror Image II',
      unlock: 50,
      legacyUnlock: 300,
      mana: 14,
      blurb: 'Unlocks at level 50.',
      tab: 'spell',
      ref: 507,
      map: 'UO',
      gumpIcon: 21287,
      iconKey: 'gump_21287',
    },
    {
      id: 'ninja_death_r2',
      class: 'ninja',
      kind: 'SpecialMove',
      name: 'Death Strike II',
      unlock: 60,
      legacyUnlock: 200,
      mana: 0,
      stamina: 18,
      blurb: 'Unlocks at level 60.',
      tab: 'ability',
      ref: 501,
      map: 'UO',
      gumpIcon: 21281,
      iconKey: 'gump_21281',
    },
  ],
};

export const COMBAT_ESTIMATOR_PATCH = {
  estimateBushidoNinjitsuAbility(abilityId, tacticsOrSkill = 50, rank = 1) {
    const id = String(abilityId || '').toLowerCase();
    const mkRange = (kind, minVal, maxVal) => {
      const s = Math.max(1, Math.floor(minVal));
      const o = Math.max(s, Math.ceil(maxVal));
      return { kind, min: s, max: o, avg: Math.round((s + o) / 2), variant: 'range' };
    };

    switch (id) {
      case 'samurai_lightning':
      case 'samurai_lightning_r2': {
        const base = 14 + Math.floor(tacticsOrSkill * 0.22) + 6 * rank;
        return mkRange('damage', base - 2, base + 6);
      }
      case 'samurai_honorable':
      case 'samurai_honorable_r2': {
        const base = Math.floor(tacticsOrSkill * 0.55) + 18 * rank;
        return mkRange('damage', base, base + 8);
      }
      case 'samurai_confidence': {
        const healBase = 15 + Math.floor((tacticsOrSkill * tacticsOrSkill) / 576);
        return mkRange('heal', healBase, healBase + 6);
      }
      case 'samurai_counter': {
        const base = 16 + Math.floor(tacticsOrSkill * 0.3);
        return mkRange('damage', base - 2, base + 6);
      }
      case 'samurai_double_strike': {
        const hitDmg = 10 + Math.floor(tacticsOrSkill * 0.18);
        return { kind: 'damage', min: hitDmg, max: hitDmg, avg: hitDmg * 2, variant: 'multihit', hits: 2 };
      }
      case 'samurai_momentum_strike': {
        const main = 15 + Math.floor(tacticsOrSkill * 0.25);
        const splash = Math.floor(main * 1.15);
        return { kind: 'damage', min: main, max: main + 4, avg: main + 2, variant: 'cleave', splash };
      }
      case 'samurai_armor_ignore': {
        const base = 14 + Math.floor(tacticsOrSkill * 0.24);
        return mkRange('damage', base, base + 6);
      }
      case 'ninja_focus': {
        const base = 13 + Math.floor(tacticsOrSkill * 0.24);
        return mkRange('damage', base - 2, base + 5);
      }
      case 'ninja_backstab': {
        const base = 15 + Math.floor(tacticsOrSkill * 0.26);
        return mkRange('damage', base - 2, base + 6);
      }
      case 'ninja_death':
      case 'ninja_death_r2': {
        const base = 18 + Math.floor(tacticsOrSkill * 0.35) + 14 * rank;
        return mkRange('damage', base, base + 10);
      }
      case 'ninja_infectious_strike': {
        const base = 12 + Math.floor(tacticsOrSkill * 0.22);
        return mkRange('damage', base, base + 8);
      }
      case 'ninja_shuriken': {
        const main = 11 + Math.floor(tacticsOrSkill * 0.18);
        const splash = Math.floor(main * 0.75);
        return { kind: 'damage', min: main, max: main + 4, avg: main + 2, variant: 'cleave', splash };
      }
      case 'ninja_ki_attack': {
        const main = 15 + Math.floor(tacticsOrSkill * 0.25);
        const splash = Math.floor(main * 0.85);
        return { kind: 'damage', min: main, max: main + 5, avg: main + 2, variant: 'cleave', splash };
      }
      case 'ninja_surprise_attack': {
        const base = 13 + Math.floor(tacticsOrSkill * 0.2);
        return mkRange('damage', base, base + 4);
      }
      default:
        return null;
    }
  },
};

export const I18N_LOCALE_PATCH = {
  en: {
    classes: {
      samurai: {
        name: 'Samurai',
        subtitle: 'Master of Bushido, Weapon Parry, and Perfection Duels',
      },
      ninja: {
        name: 'Ninja',
        subtitle: 'Master of Ninjitsu, Mirror Clones, and Shadow Assassination',
      },
    },
    abilities: {
      samurai_way: {
        name: 'Way of the Blade',
        desc: 'Automatic weapon swing and shieldless Bushido Weapon Parry mastery with Katana, Wakizashi, No-Dachi, and Daisho.',
      },
      samurai_lightning: {
        name: 'Lightning Strike',
        desc: 'High-accuracy Bushido precision strike (+50 Accuracy) with a critical IgnoreArmor roll and brief stagger.',
      },
      samurai_perfection: {
        name: 'Honor & Perfection',
        desc: 'Focuses Bushido honor on the target, building Perfection consecutive-hit damage stacks and restoring vitals on kill.',
      },
      samurai_honorable: {
        name: 'Honorable Execution',
        desc: 'Bushido threshold finisher that deals massive execute damage below 35% HP and grants +15% attack speed.',
      },
      samurai_confidence: {
        name: 'Confidence',
        desc: 'Defensive Bushido stance that restores health on cast and recovers HP and Stamina on every successful weapon parry.',
      },
      samurai_counter: {
        name: 'Counter Attack',
        desc: 'Reactive Bushido stance that empowers weapon damage (+18%) and unleashes an instant counter-swing upon parrying.',
      },
      samurai_double_strike: {
        name: 'Double Strike',
        desc: 'Signature Katana and Daisho technique: delivers two rapid consecutive weapon strikes at 90% damage each.',
      },
      samurai_evasion: {
        name: 'Evasion',
        desc: 'Short burst Bushido posture that amplifies weapon parry chance and intercepts incoming direct-damage spells.',
      },
      samurai_momentum_strike: {
        name: 'Momentum Strike',
        desc: 'Two-target Bushido cleave that channels weapon momentum through the primary enemy into a second adjacent foe.',
      },
      samurai_armor_ignore: {
        name: 'Armor Ignore',
        desc: 'Katana secondary mastery: pierces target defenses (-18% defense for 7s) and staggers heavily armored bosses.',
      },
      samurai_lightning_r2: {
        name: 'Lightning Strike II',
        desc: 'Master Bushido precision strike with enhanced multiplier, critical armor bypass, and secondary arc splash.',
      },
      samurai_honorable_r2: {
        name: 'Honorable Execution II',
        desc: 'Grandmaster Bushido capstone finisher: 1.95x execute multiplier below 35% HP plus +12% attack speed and +8% damage.',
      },
      ninja_shadowjump: {
        name: 'Shadowjump',
        desc: 'Innate Ninjitsu shadow-step footwork and high-speed Fencing auto-attack mastery with Kryss, Tekagi, Kama, and Sai.',
      },
      ninja_focus: {
        name: 'Focus Attack',
        desc: 'Shieldless Ninjitsu precision strike that concentrates ki into a single blow (1.15x-1.25x) and staggers the target.',
      },
      ninja_mirror: {
        name: 'Mirror Image',
        desc: 'Summons an illusory Ninjitsu clone that diverts incoming melee attacks and reduces damage taken by 8%.',
      },
      ninja_backstab: {
        name: 'Backstab',
        desc: 'Ambush strike from the shadows that deals 1.15x-1.25x Ninjitsu damage and grants a 5s stealth damage window (+6%).',
      },
      ninja_death: {
        name: 'Death Strike',
        desc: 'Strikes vital pressure points and plants a lethal Ninjitsu mark that detonates after 5 combat swings or 4s of internal trauma.',
      },
      ninja_animal_form: {
        name: 'Animal Form',
        desc: 'Channels the Grey Wolf and Bake Kitsune Ninjitsu aspect, increasing weapon attack speed by 10% for 8s.',
      },
      ninja_infectious_strike: {
        name: 'Infectious Strike',
        desc: 'Kryss primary mastery: coats the blade in virulent assassin venom, inflicting 3 poison ticks over 6s.',
      },
      ninja_smoke_bomb: {
        name: 'Smoke Bomb',
        desc: 'Detonates a Tokuno smoke bomb to enter mid-combat stealth (-8% damage taken for 6s) and unlocks Shuriken & Fukiya volleys.',
      },
      ninja_shuriken: {
        name: 'Shuriken & Fukiya Volley',
        desc: 'Launches poison-tipped Shuriken and Fukiya blowgun darts at range with 75% splash onto a secondary target.',
      },
      ninja_ki_attack: {
        name: 'Ki Attack',
        desc: 'High-velocity Ninjitsu dash strike that closes the gap and splashes 85% kinetic ki damage onto a second target.',
      },
      ninja_surprise_attack: {
        name: 'Surprise Attack',
        desc: 'Blindsides the enemy from stealth, shredding target physical defense by 8% for 6s to expose them to Death Strike.',
      },
      ninja_mirror_r2: {
        name: 'Mirror Image II',
        desc: 'Master Ninjitsu clone technique: deploys coordinated shadow decoys (-10% damage taken and +8% damage dealt for 7s).',
      },
      ninja_death_r2: {
        name: 'Death Strike II',
        desc: 'Grandmaster Ninjitsu capstone assassination: 1.25x-1.35x strike (1.95x execute below 35% HP) plus a 4-tick lethal detonation mark.',
      },
    },
  },
  'pt-BR': {
    classes: {
      samurai: {
        name: 'Samurai',
        subtitle: 'Mestre do Bushido, Aparar com Arma e Duelos de Perfeição',
      },
      ninja: {
        name: 'Ninja',
        subtitle: 'Mestre do Ninjitsu, Clones de Sombra e Assassinato Furtivo',
      },
    },
    abilities: {
      samurai_way: {
        name: 'Caminho da Lâmina',
        desc: 'Ataque automático da arma e maestria em Aparar de Arma Bushido sem escudo com Katana, Wakizashi, No-Dachi e Daisho.',
      },
      samurai_lightning: {
        name: 'Golpe Relâmpago',
        desc: 'Golpe de precisão Bushido (+50 de Precisão) com chance crítica de ignorar armadura e breve desequilíbrio.',
      },
      samurai_perfection: {
        name: 'Honra e Perfeição',
        desc: 'Foca a honra Bushido no alvo, acumulando bônus de dano de Perfeição em golpes consecutivos e restaurando vitais ao abater.',
      },
      samurai_honorable: {
        name: 'Execução Honrosa',
        desc: 'Finalizador Bushido que causa alto dano de execução abaixo de 35% de vida e concede +15% de velocidade de ataque.',
      },
      samurai_confidence: {
        name: 'Confiança',
        desc: 'Postura defensiva Bushido que restaura vida ao conjurar e recupera Vida e Estamina a cada aparar de arma bem-sucedido.',
      },
      samurai_counter: {
        name: 'Contra-Ataque',
        desc: 'Postura reativa Bushido que amplia o dano da arma (+18%) e desfere um contra-golpe imediato ao aparar.',
      },
      samurai_double_strike: {
        name: 'Golpe Duplo',
        desc: 'Técnica clássica de Katana e Daisho: executa dois golpes rápidos consecutivos causando 90% de dano cada.',
      },
      samurai_evasion: {
        name: 'Evasão',
        desc: 'Postura curta de Bushido que multiplica a chance de aparar com a arma e intercepta magias de dano direto.',
      },
      samurai_momentum_strike: {
        name: 'Golpe de Ímpeto',
        desc: 'Corte Bushido para dois alvos que transfere o ímpeto da lâmina do alvo principal para um segundo inimigo adjacente.',
      },
      samurai_armor_ignore: {
        name: 'Ignorar Armadura',
        desc: 'Maestria secundária de Katana: perfura as defesas do alvo (-18% de defesa por 7s) e desequilibra chefes blindados.',
      },
      samurai_lightning_r2: {
        name: 'Golpe Relâmpago II',
        desc: 'Golpe de precisão Bushido aprimorado com multiplicador superior, perfuração crítica e arco secundário.',
      },
      samurai_honorable_r2: {
        name: 'Execução Honrosa II',
        desc: 'Finalizador supremo de Grão-Mestre Bushido: multiplicador 1.95x abaixo de 35% de vida com +12% de velocidade e +8% de dano.',
      },
      ninja_shadowjump: {
        name: 'Salto das Sombras',
        desc: 'Movimentação inata de passo das sombras Ninjitsu e maestria de ataque automático rápido de Esgrima com Kryss, Tekagi, Kama e Sai.',
      },
      ninja_focus: {
        name: 'Ataque Focado',
        desc: 'Golpe de precisão Ninjitsu sem escudo que concentra ki em um único ataque (1.15x-1.25x) e paralisa os nervos do alvo.',
      },
      ninja_mirror: {
        name: 'Imagem Espelhada',
        desc: 'Conjura um clone ilusório de Ninjitsu que desvia ataques corpo a corpo recebidos e reduz o dano sofrido em 8%.',
      },
      ninja_backstab: {
        name: 'Punhalada pelas Costas',
        desc: 'Ataque de emboscada das sombras que causa 1.15x-1.25x de dano Ninjitsu e concede 5s de janela furtiva (+6% de dano).',
      },
      ninja_death: {
        name: 'Golpe Mortal',
        desc: 'Atinge pontos vitais de pressão e planta uma marca letal de Ninjitsu que detona após 5 golpes de combate ou 4s de trauma interno.',
      },
      ninja_animal_form: {
        name: 'Forma Animal',
        desc: 'Canaliza o aspecto Ninjitsu de Lobo Cinzento e Bake Kitsune, aumentando a velocidade de ataque em 10% por 8s.',
      },
      ninja_infectious_strike: {
        name: 'Golpe Infeccioso',
        desc: 'Maestria primária de Kryss: reveste a lâmina com veneno virulento de assassino, aplicando 3 pulsos de veneno em 6s.',
      },
      ninja_smoke_bomb: {
        name: 'Bomba de Fumaça',
        desc: 'Detona uma bomba de fumaça de Tokuno para entrar em furtividade de combate (-8% de dano recebido por 6s) e libera Shuriken e Fukiya.',
      },
      ninja_shuriken: {
        name: 'Saraivada de Shuriken e Fukiya',
        desc: 'Dispara Shuriken e dardos de zarabatana Fukiya à distância com 75% de dano secundário.',
      },
      ninja_ki_attack: {
        name: 'Ataque de Ki',
        desc: 'Investida veloz de Ninjitsu que fecha a distância e espalha 85% de dano cinético de ki em um segundo alvo.',
      },
      ninja_surprise_attack: {
        name: 'Ataque Surpresa',
        desc: 'Surpreende o inimigo a partir da furtividade, reduzindo a defesa física do alvo em 8% por 6s para expô-lo ao Golpe Mortal.',
      },
      ninja_mirror_r2: {
        name: 'Imagem Espelhada II',
        desc: 'Técnica mestre de clones Ninjitsu: invoca chamarizes sombrios coordenados (-10% de dano recebido e +8% de dano causado por 7s).',
      },
      ninja_death_r2: {
        name: 'Golpe Mortal II',
        desc: 'Assassinato supremo de Grão-Mestre Ninjitsu: golpe de 1.25x-1.35x (execução de 1.95x abaixo de 35% de vida) e marca letal de 4 pulsos.',
      },
    },
  },
};

export function applyDropInClassPatch(bundleTables = {}) {
  const target = bundleTables;
  target._E = { ...(target._E || {}), ...CLASS_METADATA_PATCH };
  target.WE = { ...(target.WE || {}), ...STARTER_SKILLS_PATCH };
  target.yE = { ...(target.yE || {}), ...STARTER_EQUIPMENT_PATCH };
  target.FE = { ...(target.FE || {}), ...LEGACY_TEMPLATES_PATCH };
  target.mE = { ...(target.mE || {}), ...SEEDED_HOTBAR_PATCH };
  target.gE = { ...(target.gE || {}), ...PROGRESSION_TREE_PATCH };

  if (Array.isArray(target.b)) {
    const byId = new Map(target.b.map((entry) => [entry.id, entry]));
    for (const entry of [
      ...ABILITIES_CATALOG_PATCH.samurai,
      ...ABILITIES_CATALOG_PATCH.ninja,
    ]) {
      byId.set(entry.id, entry);
    }
    target.b = Array.from(byId.values());
  } else {
    target.b = [
      ...ABILITIES_CATALOG_PATCH.samurai,
      ...ABILITIES_CATALOG_PATCH.ninja,
    ];
  }

  const prevEstimator = typeof target.qC === 'function' ? target.qC : null;
  target.qC = function patchedCombatEstimator(abilityId, tacticsOrSkill, rank) {
    const res = COMBAT_ESTIMATOR_PATCH.estimateBushidoNinjitsuAbility(
      abilityId,
      tacticsOrSkill,
      rank
    );
    return res !== null ? res : prevEstimator ? prevEstimator(abilityId, tacticsOrSkill, rank) : null;
  };

  const prevI18n = target.i18n || {};
  target.i18n = {
    ...prevI18n,
    en: {
      ...(prevI18n.en || {}),
      classes: { ...(prevI18n.en?.classes || {}), ...I18N_LOCALE_PATCH.en.classes },
      abilities: { ...(prevI18n.en?.abilities || {}), ...I18N_LOCALE_PATCH.en.abilities },
    },
    'pt-BR': {
      ...(prevI18n['pt-BR'] || {}),
      classes: { ...(prevI18n['pt-BR']?.classes || {}), ...I18N_LOCALE_PATCH['pt-BR'].classes },
      abilities: {
        ...(prevI18n['pt-BR']?.abilities || {}),
        ...I18N_LOCALE_PATCH['pt-BR'].abilities,
      },
    },
  };
  return target;
}

export default {
  CLASS_METADATA_PATCH,
  STARTER_SKILLS_PATCH,
  STARTER_EQUIPMENT_PATCH,
  LEGACY_TEMPLATES_PATCH,
  SEEDED_HOTBAR_PATCH,
  PROGRESSION_TREE_PATCH,
  ABILITIES_CATALOG_PATCH,
  COMBAT_ESTIMATOR_PATCH,
  I18N_LOCALE_PATCH,
  applyDropInClassPatch,
};
