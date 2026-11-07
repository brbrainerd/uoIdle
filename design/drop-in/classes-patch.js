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
    ['samurai_frenzied_whirlwind', 50],
    ['samurai_kensei_judgment', 60],
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
    ['ninja_fukiya_barrage', 50],
    ['ninja_twin_shadow', 60],
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
      blurb: 'Innate shieldless Bushido Weapon Parry (1H 48,000 / 2H 41,140) and continuous auto-swing mastery.',
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
      blurb: 'Thunderbolt draw cut (+50 Accuracy, 1.15x-1.25x) with Bushido^2/72,000 IgnoreArmor critical roll.',
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
      blurb: 'Pledges Bushido Honor to build consecutive-hit Perfection damage stacks (+14% Mode A / +15% Mode B) and restore vitals on kill.',
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
      blurb: 'Merciful Bushido threshold stroke (1.85x execute below 35% HP) granting +15% attack speed for 9s.',
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
      blurb: 'Restores health on cast and awakens Inner Calm (+3% parry/evasion & on-parry HP/Stam/Mana restore).',
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
      blurb: 'Reactive Bushido stance (+18% damage for 7s) that unleashes an instant retaliation swing upon parrying.',
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
      blurb: 'Signature Katana & Daisho twin-cut: lands two rapid strikes at 90% weapon damage each.',
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
      blurb: 'Amplifies Weapon Parry (1.16x-1.50x), intercepts spells, and triggers an Iaido Flash Riposte on parry.',
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
      blurb: 'Two-target Bushido cleave transferring 115% blade momentum into an adjacent enemy.',
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
      blurb: 'Katana secondary mastery: bypasses armor and shreds enemy physical defense (-18% for 7s).',
      tab: 'ability',
      ref: 1,
      map: 'UO',
      gumpIcon: 20992,
      iconKey: 'gump_20992',
    },
    {
      id: 'samurai_frenzied_whirlwind',
      class: 'samurai',
      kind: 'WeaponAbility',
      name: 'Frenzied Whirlwind',
      unlock: 50,
      legacyUnlock: 300,
      mana: 10,
      blurb: 'Tokuno Wakizashi & Lajatang cyclone (ref: 6): 1.15x-1.25x blade tempest with 50% cleave and 25% armor bypass.',
      tab: 'ability',
      ref: 6,
      map: 'UO',
      gumpIcon: 20997,
      iconKey: 'gump_20997',
    },
    {
      id: 'samurai_kensei_judgment',
      class: 'samurai',
      kind: 'SpecialMove',
      name: "Kensei: Amakura's Judgment",
      unlock: 60,
      legacyUnlock: 200,
      mana: 0,
      stamina: 15,
      blurb: 'Grandmaster Iaijutsu capstone: 1.95x execute below 35% HP and 10s Kensei Stance (+12% Speed, +8% Damage).',
      tab: 'ability',
      ref: 400,
      map: 'UO',
      gumpIcon: 21536,
      iconKey: 'idle_samurai_kensei_judgment',
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
      blurb: 'Innate shadow-step engagement passive and high-speed Fencing auto-attack mastery.',
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
      blurb: 'Shieldless Ninjitsu ki thrust (1 + Ninjitsu^2/43,636) that amplifies weapon procs and staggers nerves.',
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
      blurb: 'Summons an ablative shadow clone (-8% damage taken in Mode A; Ninjitsu/150 hit interception in Mode B).',
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
      blurb: 'Blind-spot Ninjitsu ambush (1.15x-1.25x) that opens a 5s Shadow Ambush window (+6% damage dealt).',
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
      blurb: 'Dim-mak meridian strike planting a Death Mark that detonates after 5 connected swings or 4s of trauma.',
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
      blurb: 'Kitsune & Grey Wolf Predator Aspect (+10% Attack Speed, +3% Evasion, and 3rd-swing Spirit Claw proc).',
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
      blurb: 'Kryss primary mastery (ref: 11): coats the blade in virulent assassin venom (3 poison ticks over 6s).',
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
      blurb: 'Vanish & Volley flash-sphere (-8% damage taken for 6s) that refreshes Stealth openers and Shuriken volleys.',
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
      blurb: 'Launches poison-tipped Shuriken (10156) and Fukiya darts (10154) with 75% splash onto a second foe.',
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
      blurb: 'High-velocity Ninjitsu dash strike (0.95x-1.05x) releasing an 85% kinetic shockwave onto a second target.',
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
      blurb: 'Ambush from the smoke veil that shreds target physical defense (-8% for 6s) to expose them to Death Strike.',
      tab: 'ability',
      ref: 505,
      map: 'UO',
      gumpIcon: 21285,
      iconKey: 'gump_21285',
    },
    {
      id: 'ninja_fukiya_barrage',
      class: 'ninja',
      kind: 'Spell',
      name: 'Fukiya & Egg Bomb Barrage',
      unlock: 50,
      legacyUnlock: 300,
      mana: 14,
      blurb: 'Tokuno Egg Bomb (10249) flash-cloud and Fukiya (10154) dart ambush (-10% dmg taken, +8% dmg dealt for 7s).',
      tab: 'spell',
      ref: 507,
      map: 'UO',
      gumpIcon: 10154,
      iconKey: 'idle_ninja_fukiya_barrage',
    },
    {
      id: 'ninja_twin_shadow',
      class: 'ninja',
      kind: 'SpecialMove',
      name: 'Kage Bunshin: Twin Shadow Execution',
      unlock: 60,
      legacyUnlock: 200,
      mana: 0,
      stamina: 18,
      blurb: 'Grandmaster Kage Bunshin capstone: 1.85x twin-clone execute below 35% HP with 4-tick / 5-swing detonation.',
      tab: 'ability',
      ref: 501,
      map: 'UO',
      gumpIcon: 21281,
      iconKey: 'idle_ninja_twin_shadow',
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
      case 'samurai_frenzied_whirlwind': {
        const isCapstone = id === 'samurai_frenzied_whirlwind';
        const base = 14 + Math.floor(tacticsOrSkill * 0.22) + (isCapstone ? 12 : 6 * rank);
        return mkRange('damage', base - 2, base + 6);
      }
      case 'samurai_honorable':
      case 'samurai_kensei_judgment': {
        const isCapstone = id === 'samurai_kensei_judgment';
        const base = Math.floor(tacticsOrSkill * 0.55) + (isCapstone ? 36 : 18 * rank);
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
      case 'ninja_twin_shadow': {
        const isCapstone = id === 'ninja_twin_shadow';
        const base = 18 + Math.floor(tacticsOrSkill * 0.35) + (isCapstone ? 28 : 14 * rank);
        return mkRange('damage', base, base + 10);
      }
      case 'ninja_infectious_strike': {
        const base = 12 + Math.floor(tacticsOrSkill * 0.22);
        return mkRange('damage', base, base + 8);
      }
      case 'ninja_shuriken':
      case 'ninja_fukiya_barrage': {
        const main = 11 + Math.floor(tacticsOrSkill * 0.18) + (id === 'ninja_fukiya_barrage' ? 8 : 0);
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
        subtitle: 'Bushido Blade-Master of Tokuno — Shieldless Parry, Perfection Streaks & Iaijutsu Executes',
      },
      ninja: {
        name: 'Ninja',
        subtitle: 'Shadow Shinobi of Tokuno — Mirror Clones, Dim-Mak Detonations & Venom Ambush',
      },
    },
    abilities: {
      samurai_way: {
        name: 'Way of the Blade',
        desc: 'Walk the Bushido code of Tokuno: your weapon and mind become a single shieldless ward. Grants continuous auto-swing mastery and authentic Bushido Weapon Parry (Parry * Bushido / 48,000 1H or 41,140 2H) with Katana, Wakizashi, No-Dachi, and Daisho.',
      },
      samurai_lightning: {
        name: 'Lightning Strike',
        desc: 'Draw your blade at the speed of a thunderbolt, striking before the foe can raise their guard. Delivers a +50 Accuracy precision slash (1.15x-1.25x) with a Bushido^2/72,000 critical IgnoreArmor roll and 3s nerve stagger.',
      },
      samurai_perfection: {
        name: 'Honor & Perfection',
        desc: 'Pledge solemn Bushido Honor to your quarry, turning every unanswered blow into rising martial Perfection. Automatically builds consecutive-hit damage stacks (+14% Mode A window / up to +15% Mode B streak) and restores HP, Mana, and Stamina on kill.',
      },
      samurai_honorable: {
        name: 'Honorable Execution',
        desc: 'Deliver the merciful final stroke of the Samurai code when your foe wavers near death. Unleashes a decisive Bushido cut (1.35x-1.45x base, surging to 1.85x execute below 35% HP) and ignites +15% attack speed for 9s with zero failure penalty.',
      },
      samurai_confidence: {
        name: 'Confidence',
        desc: 'Exhale doubt and center your spirit in unshakable Bushido composure. Restores health on cast (15 + Bushido^2/576) and awakens Inner Calm for 6s: every parried blow restores bonus Stamina and Mana while empowering your next counter-cut.',
      },
      samurai_counter: {
        name: 'Counter Attack',
        desc: "Read the rhythm of the enemy's steel and turn their aggression into their undoing. Strikes for 1.55x-1.65x Bushido damage, grants +18% Counter Stance damage for 7s, and unleashes an instant free retaliation swing whenever you parry.",
      },
      samurai_double_strike: {
        name: 'Double Strike',
        desc: 'Flow from an overhead Katana cut directly into a rising reverse slash before the enemy can recover. Signature Katana, Daisho, and Wakizashi technique that lands two rapid consecutive blows at 90% weapon damage each, accelerating Perfection.',
      },
      samurai_evasion: {
        name: 'Evasion',
        desc: 'Enter a transcendent state of sixth-sense awareness where even arcane bolts part before your blade. Amplifies Weapon Parry (1.16x-1.50x) and intercepts direct-damage spells for 5s; deflecting an attack triggers an instant 0.85x Iaido Flash Riposte.',
      },
      samurai_momentum_strike: {
        name: 'Momentum Strike',
        desc: "Channel the full kinetic weight of your blade through the first enemy's ribs directly into a second foe beside them. Cleaves two targets with 115% transferred momentum (150% if the primary target falls) and staggers their footing for 3s.",
      },
      samurai_armor_ignore: {
        name: 'Armor Ignore',
        desc: 'Slide the razor tip of your Katana through the narrow seams of plate and dragon-scale alike. Bypasses target physical resistance, shreds enemy defense by -18% for 7s, and staggers heavily armored bosses.',
      },
      samurai_frenzied_whirlwind: {
        name: 'Frenzied Whirlwind',
        desc: 'Become the eye of a howling Tokuno steel tempest. Signature Wakizashi and Lajatang mastery (ref: 6) that lashes primary and adjacent enemies for 1.15x-1.25x Bushido damage with 50% cyclone cleave, 25% armor bypass, and kinetic stagger.',
      },
      samurai_kensei_judgment: {
        name: "Kensei: Amakura's Judgment",
        desc: 'The forbidden Grandmaster Iaijutsu stroke of Sword-Saint Amakura. Unsheathes a blinding horizon cut (1.15x-1.25x base, surging to 1.95x execute below 35% HP) and awakens Kensei Stance for 10s (+12% Attack Speed and +8% Damage).',
      },
      ninja_shadowjump: {
        name: 'Shadowjump',
        desc: 'Melt into the seams of twilight and reappear behind your prey between heartbeats. Innate Ninjitsu shadow-step footwork and high-speed Fencing auto-attack mastery with Kryss, Tekagi, Kama, and Sai that primes stealth openers on each new target.',
      },
      ninja_focus: {
        name: 'Focus Attack',
        desc: "Condense all of your Ninjitsu ki into the needle-point of a shieldless blade. Strikes for 1.15x-1.25x Ninjitsu damage (1 + Ninjitsu^2/43,636), amplifies weapon proc properties, and staggers the target's radial nerves for 3s.",
      },
      ninja_mirror: {
        name: 'Mirror Image',
        desc: 'Weave a living illusion of smoke and moonlight that mimics your every stance. Summons an ablative shadow clone reducing damage taken by 8% for 6s in Mode A and intercepting incoming melee blows (Ninjitsu / 150 chance) in Mode B.',
      },
      ninja_backstab: {
        name: 'Backstab',
        desc: 'Lunge from the blind spot where armor plates meet, driving steel deep into vital arteries. Delivers a 1.15x-1.25x Ninjitsu ambush strike (scaled by Hiding and Stealth) and opens a 5s Shadow Ambush window (+6% all damage dealt).',
      },
      ninja_death: {
        name: 'Death Strike',
        desc: 'Strike the forbidden dim-mak meridian—the victim feels only a chill until their heart falters five beats later. Plants a lethal Ninjitsu Death Mark that ticks over 4s of internal trauma in Mode A or detonates for massive unmitigated damage on your 5th swing in Mode B.',
      },
      ninja_animal_form: {
        name: 'Animal Form',
        desc: "Invoke the primal totems of Tokuno's mist-shrouded forests without sheathing your blades. Channels the Kitsune & Grey Wolf Predator Aspect for 8s: grants +10% Attack Speed, +3% Evasion instinct, and unleashes a Fox-Fire Spirit Claw on every 3rd Fencing swing.",
      },
      ninja_infectious_strike: {
        name: 'Infectious Strike',
        desc: 'Draw the wavy serpentine edge of your Kryss across a hidden reservoir of nightshade and sea-serpent bile. Inflicts 0.90x-1.00x Fencing damage and injects a virulent 3-tick assassin venom over 6s with zero potion consumption.',
      },
      ninja_smoke_bomb: {
        name: 'Smoke Bomb',
        desc: 'Shatter a lacquered Tokuno flash-sphere at your feet, vanishing in a choking cloud of sulfur and ash. Triggers a 6s Vanish & Volley stealth veil (-8% damage taken), refreshes Stealth opener empowerment, and unlocks Shuriken & Fukiya volleys.',
      },
      ninja_shuriken: {
        name: 'Shuriken & Fukiya Volley',
        desc: 'Whip star-shaped Tokuno Shuriken from your ninja belt while firing poison-tipped Fukiya darts in the same breath. Deals 0.75x-0.85x Ninjitsu projectile damage and splashes 75% onto a secondary target.',
      },
      ninja_ki_attack: {
        name: 'Ki Attack',
        desc: 'Compress wind and shadow beneath your Tabi boots, vaulting across the battlefield in a single blurred flash. Closes the gap for 0.95x-1.05x Ninjitsu damage and releases an 85% kinetic ki shockwave onto an adjacent enemy.',
      },
      ninja_surprise_attack: {
        name: 'Surprise Attack',
        desc: 'Strike from the smoke veil at the exact instant the enemy turns their head, shattering their defensive posture. Shreds target physical defense by -8% (and -16 to -25 Defense Chance) for 6s, leaving bosses wide open to Death Strike.',
      },
      ninja_fukiya_barrage: {
        name: 'Fukiya & Egg Bomb Barrage',
        desc: 'Unleash the full Tokuno shinobi arsenal: a blinding Egg Bomb (itemId: 10249) flash-cloud paired with a rapid Fukiya blowgun (itemId: 10154) poison-dart barrage. Grants -10% damage taken, +8% damage dealt, and an ablative decoy clone for 7s.',
      },
      ninja_twin_shadow: {
        name: 'Kage Bunshin: Twin Shadow Execution',
        desc: "Forbidden Grandmaster Kage Bunshin assassination art: two living shadow clones converge from opposite blind spots to sever the target's lifeline. Deals 1.15x-1.25x damage (1.85x execute below 35% HP) and plants a 4-tick / 5-swing Twin Shadow Mark.",
      },
    },
  },
  'pt-BR': {
    classes: {
      samurai: {
        name: 'Samurai',
        subtitle: 'Mestre da Espada Bushido de Tokuno — Aparar sem Escudo, Perfeição e Execuções Iaijutsu',
      },
      ninja: {
        name: 'Ninja',
        subtitle: 'Shinobi das Sombras de Tokuno — Clones Espelhados, Detonação Dim-Mak e Emboscada Venenosa',
      },
    },
    abilities: {
      samurai_way: {
        name: 'Caminho da Lâmina',
        desc: 'Trilhe o código Bushido de Tokuno: sua lâmina e mente tornam-se uma guarda sem escudo. Concede maestria contínua de ataque automático e Aparar de Arma Bushido autêntico (Parry * Bushido / 48.000 1M ou 41.140 2M) com Katana, Wakizashi, No-Dachi e Daisho.',
      },
      samurai_lightning: {
        name: 'Golpe Relâmpago',
        desc: 'Desembainhe sua espada na velocidade de um trovão antes que o inimigo erga a guarda. Desfere um corte de precisão (+50 de Acerto, 1.15x-1.25x) com chance crítica Bushido^2/72.000 de ignorar armadura e 3s de desequilíbrio.',
      },
      samurai_perfection: {
        name: 'Honra e Perfeição',
        desc: 'Jure Honra solene de Bushido ao adversário, convertendo cada golpe certeiro em Perfeição marcial crescente. Acumula bônus de dano em acertos consecutivos (+14% Modo A / até +15% Modo B) e restaura Vida, Mana e Estamina ao abater.',
      },
      samurai_honorable: {
        name: 'Execução Honrosa',
        desc: 'Desfira o golpe final misericordioso do código Samurai quando o inimigo vacilar. Executa um corte decisivo de Bushido (1.35x-1.45x base, subindo para 1.85x abaixo de 35% de Vida) e concede +15% de velocidade de ataque por 9s sem penalidade.',
      },
      samurai_confidence: {
        name: 'Confiança',
        desc: 'Afaste a dúvida e concentre seu espírito na serenidade inabalável do Bushido. Restaura vida ao conjurar (15 + Bushido^2/576) e desperta Calma Interior por 6s: cada golpe aparado recupera Estamina e Mana extras e fortalece seu próximo corte.',
      },
      samurai_counter: {
        name: 'Contra-Ataque',
        desc: 'Leia o ritmo do aço inimigo e transforme a agressão deles em ruína. Golpeia com 1.55x-1.65x de dano Bushido, concede +18% de dano na Postura de Contra-Ataque por 7s e desfere uma retaliação imediata gratuita ao aparar.',
      },
      samurai_double_strike: {
        name: 'Golpe Duplo',
        desc: 'Flua de um corte descendente de Katana diretamente para um corte reverso ascendente num único fôlego. Técnica clássica de Katana, Daisho e Wakizashi que aplica dois golpes rápidos consecutivos com 90% de dano cada, acelerando a Perfeição.',
      },
      samurai_evasion: {
        name: 'Evasão',
        desc: 'Entre em um estado transcendente de sexto sentido onde até projéteis arcanos são cortados no ar. Multiplica o Aparar de Arma (1.16x-1.50x) e intercepta magias por 5s; defletir um ataque dispara um Lampejo Iaido imediato de 0.85x.',
      },
      samurai_momentum_strike: {
        name: 'Golpe de Ímpeto',
        desc: 'Canalize todo o peso cinético da lâmina através do primeiro inimigo diretamente contra um segundo adversário ao lado. Corta dois alvos transferindo 115% de ímpeto (150% se o alvo principal cair) e desequilibra a guarda por 3s.',
      },
      samurai_armor_ignore: {
        name: 'Ignorar Armadura',
        desc: 'Deslize a ponta afiada da Katana pelas frestas mais estreitas de placas e escamas dracônicas. Ignora a resistência física, reduz a defesa inimiga em -18% por 7s e desequilibra chefes pesadamente blindados.',
      },
      samurai_frenzied_whirlwind: {
        name: 'Turbilhão Frenético',
        desc: 'Torne-se o olho de uma tempestade uivante de aço de Tokuno. Maestria clássica de Wakizashi e Lajatang (ref: 6) que açoita o alvo e inimigos adjacentes com 1.15x-1.25x de dano Bushido, 50% de corte ciclônico e 25% de penetração.',
      },
      samurai_kensei_judgment: {
        name: 'Kensei: Julgamento de Amakura',
        desc: 'O golpe proibido de Iaijutsu do Grão-Mestre e Santo da Espada Amakura. Desembainha um corte cegante no horizonte (1.15x-1.25x base, 1.95x de execução abaixo de 35% de Vida) e desperta a Postura Kensei por 10s (+12% Velocidade e +8% Dano).',
      },
      ninja_shadowjump: {
        name: 'Salto das Sombras',
        desc: 'Dissolva-se nas frestas do crepúsculo e ressurja atrás da presa entre um batimento e outro. Passo das sombras inato de Ninjitsu e maestria de ataque automático veloz de Esgrima com Kryss, Tekagi, Kama e Sai que prepara aberturas furtivas.',
      },
      ninja_focus: {
        name: 'Ataque Focado',
        desc: 'Condense todo o seu ki Ninjitsu na ponta de agulha de uma lâmina sem escudo. Golpeia causando 1.15x-1.25x de dano Ninjitsu (1 + Ninjitsu^2/43.636), amplifica propriedades da arma e paralisa os nervos do alvo por 3s.',
      },
      ninja_mirror: {
        name: 'Imagem Espelhada',
        desc: 'Teça uma ilusão viva de fumaça e luar que espelha cada postura sua. Conjura um clone sombrio ablativo reduzindo o dano sofrido em 8% por 6s no Modo A e desviando golpes corpo a corpo (chance Ninjitsu / 150) no Modo B.',
      },
      ninja_backstab: {
        name: 'Punhalada pelas Costas',
        desc: 'Avance pelo ponto cego onde as placas de armadura se encontram, cravando o aço em artérias vitais. Desfere uma emboscada de 1.15x-1.25x de dano Ninjitsu e abre uma janela de Emboscada Sombria de 5s (+6% de dano causado).',
      },
      ninja_death: {
        name: 'Golpe Mortal',
        desc: 'Atinja o meridiano proibido dim-mak—a vítima sente apenas um calafrio até o coração falhar cinco golpes depois. Planta a Marca da Morte Ninjitsu que pulsa por 4s no Modo A ou detona em dano puro devastador no 5º ataque conectado no Modo B.',
      },
      ninja_animal_form: {
        name: 'Forma Animal',
        desc: 'Invoque os totens primordiais das florestas nebulosas de Tokuno sem embainhar suas armas. Canaliza o Aspecto Predador de Kitsune e Lobo Cinzento por 8s: concede +10% de Velocidade de Ataque, +3% de Evasão e dispara Garra Espiritual a cada 3º ataque.',
      },
      ninja_infectious_strike: {
        name: 'Golpe Infeccioso',
        desc: 'Deslize a lâmina sinuosa do Kryss por um reservatório oculto de beladona e bile de serpente marinha. Causa 0.90x-1.00x de dano de Esgrima e injeta um veneno virulento de 3 pulsos ao longo de 6s sem consumir poções.',
      },
      ninja_smoke_bomb: {
        name: 'Bomba de Fumaça',
        desc: 'Estilhace uma esfera de fumaça de Tokuno aos seus pés, desaparecendo numa nuvem densa de enxofre e cinzas. Ativa um véu furtivo de 6s (-8% de dano recebido), renova aberturas furtivas e libera saraivadas de Shuriken e Fukiya.',
      },
      ninja_shuriken: {
        name: 'Saraivada de Shuriken e Fukiya',
        desc: 'Dispare estrelas Shuriken de Tokuno do cinto ninja enquanto sopra dardos envenenados de zarabatana Fukiya no mesmo instante. Causa 0.75x-0.85x de dano Ninjitsu à distância com 75% de espalhamento em um segundo alvo.',
      },
      ninja_ki_attack: {
        name: 'Ataque de Ki',
        desc: 'Comprima vento e sombra sob suas botas Tabi, cruzando o campo de batalha num único clarão. Fecha a distância causando 0.95x-1.05x de dano Ninjitsu e libera uma onda de choque cinética de 85% em um inimigo adjacente.',
      },
      ninja_surprise_attack: {
        name: 'Ataque Surpresa',
        desc: 'Golpeie a partir do véu de fumaça no exato instante em que o inimigo desvia o olhar, quebrando sua postura defensiva. Reduz a defesa física do alvo em -8% por 6s, deixando chefes vulneráveis ao Golpe Mortal.',
      },
      ninja_fukiya_barrage: {
        name: 'Barragem de Fukiya e Bomba de Ovo',
        desc: 'Libere todo o arsenal shinobi de Tokuno: uma Bomba de Ovo (10249) cegante combinada com uma barragem de dardos envenenados de Zarabatana Fukiya (10154). Concede -10% de dano recebido, +8% de dano causado e um clone de fumaça por 7s.',
      },
      ninja_twin_shadow: {
        name: 'Kage Bunshin: Execução das Sombras Gêmeas',
        desc: 'Arte proibida de Grão-Mestre Kage Bunshin: dois clones de sombra vivos convergem de ângulos opostos para ceifar a vida do alvo. Causa 1.15x-1.25x de dano (execução de 1.85x abaixo de 35% de Vida) e planta a Marca das Sombras Gêmeas.',
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
