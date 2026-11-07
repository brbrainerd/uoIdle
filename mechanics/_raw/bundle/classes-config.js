// SOURCE: https://uoidle.com/assets/Jogo-D5xEfvfV.js
// BUNDLE_VERSION: 0.99.0
// BUNDLE_SHA256: 4770a0fcb06e7222f285f6f3b1fdd0da2ea3952a94d0f493a69f527016e73b0d
// AST_SPAN: L2538-L2779
const Wj = ['warrior', 'ranger', 'mage'],
  Kj = {
    warrior: 101,
    ranger: 102,
    mage: 103,
    worker: 104,
    berserker: 105,
    duelist: 106,
    necromancer: 107,
    mystic: 108,
    spellweaver: 109,
    paladin: 110,
    assassin: 111,
    ninja: 112,
    monk: 113,
    samurai: 114,
    bard: 115,
    tamer: 116,
  },
  QC = {
    1: 'warrior',
    2: 'ranger',
    3: 'mage',
    4: 'worker',
    5: 'berserker',
    6: 'duelist',
    7: 'necromancer',
    8: 'mystic',
    9: 'spellweaver',
    10: 'paladin',
    11: 'assassin',
    12: 'ninja',
    13: 'monk',
    14: 'samurai',
    15: 'bard',
    16: 'tamer',
  };
function Dg(e) {
  return QC[e] ?? null;
}
const ZC = {
  warrior: {
    str: 60,
    dex: 20,
    int: 10,
    skills: [
      [40, 40],
      [27, 30],
      [1, 20],
      [5, 10],
    ],
  },
  berserker: {
    str: 55,
    dex: 25,
    int: 10,
    skills: [
      [40, 40],
      [27, 30],
      [1, 20],
      [17, 10],
    ],
  },
  duelist: {
    str: 40,
    dex: 40,
    int: 10,
    skills: [
      [42, 40],
      [27, 30],
      [1, 20],
      [5, 10],
    ],
  },
  ranger: {
    str: 40,
    dex: 40,
    int: 10,
    skills: [
      [31, 40],
      [27, 30],
      [1, 20],
      [21, 10],
    ],
  },
  mage: {
    str: 20,
    dex: 20,
    int: 50,
    skills: [
      [25, 40],
      [16, 30],
      [46, 20],
      [26, 10],
    ],
  },
  necromancer: {
    str: 20,
    dex: 20,
    int: 50,
    skills: [
      [49, 40],
      [32, 30],
      [25, 20],
      [46, 10],
    ],
  },
  mystic: {
    str: 20,
    dex: 20,
    int: 50,
    skills: [
      [55, 40],
      [50, 30],
      [25, 20],
      [46, 10],
    ],
  },
  spellweaver: {
    str: 20,
    dex: 20,
    int: 50,
    skills: [
      [54, 40],
      [46, 30],
      [16, 20],
      [25, 10],
    ],
  },
  paladin: {
    str: 50,
    dex: 25,
    int: 15,
    skills: [
      [40, 30],
      [51, 30],
      [27, 20],
      [5, 20],
    ],
  },
  assassin: {
    str: 35,
    dex: 45,
    int: 10,
    skills: [
      [42, 40],
      [30, 30],
      [27, 20],
      [21, 10],
    ],
  },
  ninja: {
    str: 35,
    dex: 45,
    int: 10,
    skills: [
      [42, 30],
      [53, 30],
      [21, 20],
      [47, 20],
    ],
  },
  monk: {
    str: 45,
    dex: 35,
    int: 10,
    skills: [
      [43, 40],
      [50, 30],
      [27, 20],
      [1, 10],
    ],
  },
  samurai: {
    str: 50,
    dex: 30,
    int: 10,
    skills: [
      [40, 30],
      [52, 30],
      [27, 20],
      [1, 20],
    ],
  },
  bard: {
    str: 30,
    dex: 35,
    int: 25,
    skills: [
      [29, 40],
      [15, 30],
      [9, 20],
      [22, 10],
    ],
  },
  tamer: {
    str: 40,
    dex: 30,
    int: 20,
    skills: [
      [35, 40],
      [2, 30],
      [39, 20],
      [42, 10],
    ],
  },
  worker: {
    str: 50,
    dex: 30,
    int: 10,
    skills: [
      [45, 40],
      [44, 30],
      [7, 20],
      [37, 10],
    ],
  },
};
function Yj(e) {
  return Object.keys(Kj).includes(e);
}
const e2 = {
  warrior: 'WR',
  ranger: 'RG',
  mage: 'MG',
  worker: 'WK',
  berserker: 'BK',
  duelist: 'DL',
  necromancer: 'NC',
  mystic: 'MS',
  spellweaver: 'SW',
  paladin: 'PL',
  assassin: 'AS',
  ninja: 'NJ',
  monk: 'MK',
  samurai: 'SM',
  bard: 'BD',
  tamer: 'TM',
};
function Dc(e) {
  return !e || !Yj(e) ? '' : e2[e];
}
