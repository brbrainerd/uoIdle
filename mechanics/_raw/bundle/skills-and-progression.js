// SOURCE: https://uoidle.com/assets/Jogo-D5xEfvfV.js
// BUNDLE_VERSION: 0.99.0
// BUNDLE_SHA256: 4770a0fcb06e7222f285f6f3b1fdd0da2ea3952a94d0f493a69f527016e73b0d
// AST_SPAN: L7604-L8087
const jc = [
  'alchemy',
  'anatomy',
  'animalLore',
  'itemId',
  'armsLore',
  'parry',
  'begging',
  'blacksmith',
  'fletching',
  'peacemaking',
  'camping',
  'carpentry',
  'cartography',
  'cooking',
  'detectHidden',
  'discordance',
  'evalInt',
  'healing',
  'fishing',
  'forensics',
  'herding',
  'hiding',
  'provocation',
  'inscribe',
  'lockpicking',
  'magery',
  'magicResist',
  'tactics',
  'snooping',
  'musicianship',
  'poisoning',
  'archery',
  'spiritSpeak',
  'stealing',
  'tailoring',
  'animalTaming',
  'tasteId',
  'tinkering',
  'tracking',
  'veterinary',
  'swords',
  'macing',
  'fencing',
  'wrestling',
  'lumberjacking',
  'mining',
  'meditation',
  'stealth',
  'removeTrap',
  'necromancy',
  'focus',
  'chivalry',
  'bushido',
  'ninjitsu',
  'spellweaving',
  'mysticism',
  'imbuing',
  'throwing',
];
function Tw(e) {
  return e < 0 || e >= jc.length ? null : jc[e];
}
const dx = {
    warrior: 'melee',
    berserker: 'melee',
    duelist: 'melee',
    assassin: 'melee',
    ninja: 'melee',
    monk: 'melee',
    samurai: 'melee',
    paladin: 'melee',
    ranger: 'ranged',
    mage: 'magic',
    necromancer: 'magic',
    mystic: 'magic',
    spellweaver: 'magic',
    bard: 'support',
    tamer: 'support',
    worker: 'support',
  },
  uE = 50,
  dE = 30,
  mE = 26,
  hE = {
    warrior: [40, 41, 42, 27, 1, 5, 17, 26, 50],
    berserker: [40, 41, 42, 27, 1, 17, 26, 50],
    duelist: [40, 41, 42, 27, 1, 5, 17, 26, 50],
    ranger: [31, 27, 1, 4, 17, 26, 50],
    mage: [25, 16, 46, 41, 27, 1, 26, 50],
    necromancer: [49, 32, 46, 41, 27, 1, 26, 50],
    mystic: [55, 25, 46, 41, 27, 1, 26, 50],
    spellweaver: [54, 46, 41, 27, 1, 26, 50],
    paladin: [51, 40, 41, 42, 27, 1, 5, 17, 26, 50],
    assassin: [42, 27, 30, 21, 17, 26, 50],
    ninja: [53, 42, 21, 47, 17, 26, 50],
    monk: [43, 27, 1, 17, 26, 50],
    samurai: [52, 40, 27, 1, 17, 26, 50],
    bard: [29, 15, 9, 22, 17, 26, 50],
    tamer: [35, 2, 39, 42, 17, 26, 50],
    worker: [45, 44, 7, 37, 26, 50],
  };
function fE(e) {
  return hE[e].map((a) => Tw(a) ?? `skill${a}`);
}
function pE(e) {
  return e === mE || e === 'magicResist' ? dE : uE;
}
const gE = {
    warrior: [
      ['warrior_slash', 1],
      ['warrior_provoke', 5],
      ['warrior_shield_bash', 10],
      ['warrior_armor_break', 15],
      ['warrior_heavy_strike', 20],
      ['warrior_whirlwind', 25],
      ['warrior_brace', 30],
      ['warrior_disarm', 40],
      ['warrior_bulwark', 50],
      ['warrior_execution', 60],
    ],
    berserker: [
      ['berserker_cleave', 1],
      ['warrior_heavy_strike', 5],
      ['warrior_double_strike', 10],
      ['warrior_whirlwind', 15],
      ['warrior_bleed', 20],
      ['warrior_armor_break', 25],
      ['berserker_frenzy', 30],
      ['berserker_bloodrage', 35],
      ['duelist_mortal', 40],
      ['warrior_crushing_blow', 45],
      ['duelist_armor_ignore', 50],
      ['warrior_execution', 55],
      ['berserker_berserk', 60],
    ],
    paladin: [
      ['paladin_close_wounds', 1],
      ['warrior_heavy_strike', 5],
      ['paladin_consecrate', 10],
      ['warrior_shield_bash', 15],
      ['paladin_divine_fury', 20],
      ['warrior_brace', 25],
      ['paladin_holy_light', 30],
      ['warrior_disarm', 35],
      ['warrior_bulwark', 40],
      ['paladin_noble', 45],
      ['warrior_whirlwind', 50],
      ['warrior_crushing_blow', 55],
      ['warrior_execution', 60],
    ],
    ranger: [
      ['ranger_arrow', 1],
      ['ranger_rapid_shot', 5],
      ['ranger_aimed_shot', 10],
      ['ranger_force_arrow', 15],
      ['ranger_piercing', 20],
      ['ranger_serpent_arrow', 25],
      ['ranger_moving_shot', 30],
      ['ranger_lightning_arrow', 35],
      ['ranger_multishot', 40],
      ['ranger_armor_pierce', 45],
      ['ranger_charged_shot', 50],
      ['ranger_deadeye', 55],
      ['ranger_bolt_volley', 60],
    ],
    mage: [
      ['mage_heal', 1],
      ['mage_cure', 1],
      ['mage_magic_arrow', 1],
      ['mage_harm', 5],
      ['mage_fireball', 10],
      ['mage_lightning', 15],
      ['mage_magic_reflect', 25],
      ['mage_energy_bolt', 30],
      ['mage_explosion', 35],
      ['mage_chain_lightning', 40],
      ['mage_flamestrike', 45],
      ['mage_fire_elemental', 50],
      ['mage_air_elemental', 55],
      ['mage_meteor', 60],
    ],
    necromancer: [
      ['necro_magery_heal', 1],
      ['necro_magery_cure', 1],
      ['mage_magic_arrow', 1],
      ['mage_magic_reflect', 25],
      ['necro_pain_spike', 30],
      ['necro_blood_oath', 35],
      ['necro_wither', 40],
      ['necro_lich_form', 45],
      ['necro_animate_dead', 50],
      ['necro_strangle', 55],
      ['necro_poison_strike', 60],
    ],
    spellweaver: [
      ['sw_magery_heal', 1],
      ['mage_cure', 1],
      ['mage_magic_arrow', 1],
      ['mage_magic_reflect', 25],
      ['sw_magery_gh', 30],
      ['cleric_bless', 35],
      ['cleric_arch_protection', 40],
      ['sw_renewal', 45],
      ['mage_nature_fury', 50],
      ['sw_thunderstorm', 55],
      ['sw_wildfire', 60],
    ],
  },
  mx = {
    warrior: ['malha', 'longswordShield', 'bandages', 'potionsMelee', 'robeCloak'],
    berserker: ['malha', 'executionersAxe', 'bandages', 'potionsMelee', 'robeCloak'],
    duelist: ['malha', 'kryssBuckler', 'bandages', 'potionsMelee', 'robeCloak'],
    ranger: ['studded', 'bowArrows', 'crossbowBolts', 'bandages', 'potionsMelee', 'robeCloak'],
    mage: ['leather', 'casterStaff', 'reagents300', 'potionsCaster', 'robeCloak'],
    necromancer: [
      'leather',
      'casterStaff',
      'necroPathReagents',
      'healArrowReagents',
      'potionsCaster',
      'robeCloak',
    ],
    mystic: ['leather', 'casterStaff', 'reagents300', 'potionsCaster', 'robeCloak'],
    spellweaver: ['leather', 'casterStaff', 'spellweaverReagents', 'potionsCaster', 'robeCloak'],
    paladin: ['malha', 'maceShield', 'bandages', 'potionsMelee', 'robeCloak'],
    assassin: ['leather', 'kryss', 'poison', 'bandages', 'potionsMelee', 'robeCloak'],
    ninja: ['ninjaSet', 'kryss', 'bandages', 'potionsMelee', 'robeCloak'],
    monk: ['cloth', 'quarterStaff', 'bandages', 'potionsMelee', 'robeCloak'],
    samurai: ['samuraiSet', 'katana', 'bandages', 'potionsMelee', 'robeCloak'],
    bard: ['leather', 'kryss', 'harp', 'bandages', 'potionsMelee', 'robeCloak'],
    tamer: ['leather', 'crook', 'bandages', 'potionsMelee', 'robeCloak'],
    worker: ['cloth', 'pickaxeHatchet', 'smithHammer', 'potionsMelee', 'robeCloak'],
  };
function bE(e) {
  return [...(mx[e] ?? mx.warrior)];
}
const Vo = (e = !0) => {
    const a = [
      { layer: se.Helm, graphic: 7609 },
      { layer: se.Necklace, graphic: 5063 },
      { layer: se.InnerTorso, graphic: 5068 },
      { layer: se.Arms, graphic: 5069 },
      { layer: se.Gloves, graphic: 5062 },
    ];
    return (e && a.push({ layer: se.Pants, graphic: 5067 }), a);
  },
  xE = () => [
    { layer: se.OuterTorso, graphic: 7939, softRobe: !0 },
    { layer: se.Cloak, graphic: 5397, softCloak: !0 },
  ];
function Nn(e) {
  return [...e.filter((a) => a.layer !== se.Cloak && a.layer !== se.OuterTorso), ...xE()];
}
const mu = () => [
    { layer: se.Helm, graphic: 5051 },
    { layer: se.InnerTorso, graphic: 5055 },
    { layer: se.Pants, graphic: 5054 },
  ],
  vE = () => [
    { layer: se.Helm, graphic: 7609 },
    { layer: se.Necklace, graphic: 5078 },
    { layer: se.InnerTorso, graphic: 5083 },
    { layer: se.Arms, graphic: 5084 },
    { layer: se.Gloves, graphic: 5077 },
    { layer: se.Pants, graphic: 5082 },
  ],
  hx = {
    warrior: Nn([
      ...mu(),
      { layer: se.Shoes, graphic: 5899 },
      { layer: se.Shirt, graphic: 7933, softShirt: !0 },
      { layer: se.OneHanded, graphic: 3937 },
      { layer: se.TwoHanded, graphic: 7035 },
    ]),
    berserker: Nn([
      ...mu(),
      { layer: se.Shoes, graphic: 5899 },
      { layer: se.Shirt, graphic: 7933, softShirt: !0 },
      { layer: se.TwoHanded, graphic: 3909 },
    ]),
    duelist: Nn([
      ...mu(),
      { layer: se.Shoes, graphic: 5899 },
      { layer: se.Shirt, graphic: 7933, softShirt: !0 },
      { layer: se.OneHanded, graphic: 5121 },
      { layer: se.TwoHanded, graphic: 7027 },
    ]),
    ranger: Nn([
      ...vE().filter((e) => e.layer !== se.Helm),
      { layer: se.Helm, graphic: 5914, softHat: !0 },
      { layer: se.Shoes, graphic: 5899 },
      { layer: se.Shirt, graphic: 7933, softShirt: !0 },
      { layer: se.TwoHanded, graphic: 5042 },
    ]),
    mage: Nn([
      ...Vo().filter((e) => e.layer !== se.Helm),
      { layer: se.Helm, graphic: 5912, softHat: !0 },
      { layer: se.Shirt, graphic: 7933, softShirt: !0 },
      { layer: se.Shoes, graphic: 5901 },
      { layer: se.TwoHanded, graphic: 5112 },
    ]),
    necromancer: Nn([
      ...Vo(),
      { layer: se.Shirt, graphic: 7933, softShirt: !0 },
      { layer: se.Shoes, graphic: 5901 },
      { layer: se.TwoHanded, graphic: 5112 },
    ]),
    mystic: Nn([
      ...Vo(),
      { layer: se.Shirt, graphic: 7933, softShirt: !0 },
      { layer: se.Shoes, graphic: 5901 },
      { layer: se.TwoHanded, graphic: 5112 },
    ]),
    spellweaver: Nn([
      ...Vo(),
      { layer: se.Shirt, graphic: 7933, softShirt: !0 },
      { layer: se.Shoes, graphic: 5901 },
      { layer: se.TwoHanded, graphic: 5112 },
    ]),
    paladin: Nn([
      ...mu(),
      { layer: se.Shoes, graphic: 5899 },
      { layer: se.Shirt, graphic: 7933, softShirt: !0 },
      { layer: se.OneHanded, graphic: 3932 },
      { layer: se.TwoHanded, graphic: 7035 },
    ]),
    assassin: Nn([
      ...Vo(),
      { layer: se.Shoes, graphic: 5899 },
      { layer: se.Shirt, graphic: 7933, softShirt: !0 },
      { layer: se.OneHanded, graphic: 5121 },
    ]),
    ninja: Nn([
      { layer: se.Helm, graphic: 10126 },
      { layer: se.InnerTorso, graphic: 10131 },
      { layer: se.Pants, graphic: 10129 },
      { layer: se.Gloves, graphic: 10130 },
      { layer: se.Shoes, graphic: 10135 },
      { layer: se.OneHanded, graphic: 5121 },
    ]),
    monk: Nn([
      { layer: se.Shirt, graphic: 7933, softShirt: !0 },
      { layer: se.Shoes, graphic: 5901 },
    ]),
    samurai: Nn([
      { layer: se.Helm, graphic: 10102 },
      { layer: se.InnerTorso, graphic: 10182 },
      { layer: se.Arms, graphic: 10110 },
      { layer: se.Pants, graphic: 5067 },
      { layer: se.Shoes, graphic: 10134 },
      { layer: se.OneHanded, graphic: 5119 },
    ]),
    bard: Nn([
      ...Vo(),
      { layer: se.Shoes, graphic: 5899 },
      { layer: se.Shirt, graphic: 7933, softShirt: !0 },
      { layer: se.OneHanded, graphic: 5121 },
    ]),
    tamer: Nn([
      ...Vo(),
      { layer: se.Shoes, graphic: 5899 },
      { layer: se.Shirt, graphic: 7933, softShirt: !0 },
      { layer: se.OneHanded, graphic: 3713 },
    ]),
    worker: Nn([
      { layer: se.Shoes, graphic: 5899 },
      { layer: se.Shirt, graphic: 7933, softShirt: !0 },
    ]),
  };
function Pw(e) {
  return !!(e.softShirt || e.softRobe || e.softCloak || e.softHat || e.softLower || e.softTop);
}
const eb = new Set([
  se.Helm,
  se.Necklace,
  se.InnerTorso,
  se.MiddleTorso,
  se.Arms,
  se.Gloves,
  se.Pants,
  se.OuterLegs,
  se.Waist,
]);
function Ow(e) {
  return hx[e] ?? hx.warrior;
}
function yE(e) {
  const a = Ow(e),
    n = a.some((l) => l.softShirt || (l.softTop && l.layer === se.Shirt)),
    s = a.some((l) => l.softRobe || (l.softTop && l.layer === se.OuterTorso)),
    o = a.some((l) => l.softCloak || (l.softTop && l.layer === se.Cloak)),
    r = a.some((l) => l.softHat),
    i = a.some((l) => l.layer === se.Pants && !l.softLower),
    c = a.some((l) => eb.has(l.layer) && !Pw(l));
  return {
    hasShirt: n,
    hasRobe: s,
    hasCloak: o,
    hasHat: r,
    hasArmorPants: i,
    hasUnderPants: !i || n || s,
    hasArmorSet: c,
  };
}
function jE(e) {
  return eb.has(e.layer) && !Pw(e);
}
const Rw = [
    { hue: 2960, css: '#bbaf9b' },
    { hue: 2955, css: '#b6b1a3' },
    { hue: 2958, css: '#b2a699' },
    { hue: 2959, css: '#a79984' },
    { hue: 1023, css: '#826f68' },
    { hue: 1002, css: '#866964' },
    { hue: 1038, css: '#786459' },
    { hue: 1010, css: '#7c6059' },
    { hue: 1018, css: '#6f5652' },
    { hue: 1020, css: '#644941' },
    { hue: 1014, css: '#5b3f37' },
    { hue: 1044, css: '#49352a' },
    { hue: 1058, css: '#493520' },
    { hue: 1022, css: '#4c2f2a' },
  ],
  $w = Rw.map((e) => e.hue);
function wE(e) {
  var a;
  return ((a = Rw.find((n) => n.hue === e)) == null ? void 0 : a.css) ?? '#c8a882';
}
const _w = [
    { hue: 1110, css: '#bda483' },
    { hue: 1122, css: '#a48331' },
    { hue: 1130, css: '#946a00' },
    { hue: 1116, css: '#836a41' },
    { hue: 1137, css: '#9c6239' },
    { hue: 1142, css: '#946a52' },
    { hue: 1144, css: '#835a41' },
    { hue: 1145, css: '#7b4a39' },
    { hue: 1146, css: '#734131' },
    { hue: 1147, css: '#6a3929' },
    { hue: 1148, css: '#623118' },
    { hue: 1149, css: '#4a2010' },
    { hue: 1104, css: '#838394' },
    { hue: 1106, css: '#737383' },
    { hue: 1107, css: '#6a6a7b' },
    { hue: 1108, css: '#5a5a6a' },
    { hue: 1109, css: '#313139' },
    { hue: 2052, css: '#282828' },
  ],
  tm = _w.map((e) => e.hue);
function fx(e) {
  var a;
  return ((a = _w.find((n) => n.hue === e)) == null ? void 0 : a.css) ?? '#888';
}
const zn = [
    1816, 1905, 1122, 1253, 1819, 1880, 1837, 1864, 1826, 1822, 1848, 1866, 1871, 1884, 1892, 1843,
    1814, 1815,
  ],
  NE = zn,
  SE = {
    warrior: 1816,
    ranger: 1837,
    mage: 1253,
    berserker: 1905,
    paladin: 1819,
    necromancer: 1880,
    spellweaver: 1864,
    duelist: 1826,
    mystic: 1848,
    assassin: 1866,
    ninja: 1871,
    monk: 1122,
    samurai: 1884,
    bard: 1892,
    tamer: 1843,
    worker: 1814,
  };
function kE(e) {
  return SE[e] ?? Ls.robeHue;
}
function CE(e, a) {
  const n = kE(e);
  return Op({ ...a, robeHue: n, cloakHue: n });
}
