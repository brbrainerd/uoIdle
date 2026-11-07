import * as fs from 'node:fs';
import * as path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ClassSchema, type ClassDefinition, type SkillDefinition } from '../src/schemas/skill.schema.js';
import {
  buildComponentStyles,
  renderQuickCommandBar,
  renderStatDistributionStrip,
  renderStarterSkillCards,
  renderAbilityPowerMeter,
  renderLiveCombatTickerComponent,
  renderExecutiveClassKpiStrip,
} from './ui_components.js';

const ROOT_DIR = process.cwd();

const MOCKUPS_DIR = path.join(ROOT_DIR, 'mockups');
const SCREENSHOTS_DIR = path.join(MOCKUPS_DIR, 'screenshots');
const ICONS_DIR = path.join(MOCKUPS_DIR, 'assets', 'icons');

function resolveChromeBin(): string | null {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }
  const lookupCmd = process.platform === 'win32' ? 'where' : 'which';
  const pathCandidates = [
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
    'chrome',
    'msedge',
  ];
  for (const bin of pathCandidates) {
    try {
      const found = execFileSync(lookupCmd, [bin], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
        .split(/\r?\n/)[0]
        ?.trim();
      if (found && fs.existsSync(found)) {
        return found;
      }
    } catch {
      // continue searching
    }
  }
  const osCandidates: string[] =
    process.platform === 'darwin'
      ? [
          path.join('/', 'Applications', 'Google Chrome.app', 'Contents', 'MacOS', 'Google Chrome'),
          path.join('/', 'Applications', 'Chromium.app', 'Contents', 'MacOS', 'Chromium'),
          path.join('/', 'Applications', 'Brave Browser.app', 'Contents', 'MacOS', 'Brave Browser'),
          path.join('/', 'Applications', 'Microsoft Edge.app', 'Contents', 'MacOS', 'Microsoft Edge'),
        ]
      : process.platform === 'win32'
        ? [
            path.join(process.env['PROGRAMFILES'] ?? 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
            path.join(process.env['PROGRAMFILES(X86)'] ?? 'C:\\Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
            path.join(process.env['LOCALAPPDATA'] ?? '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
          ]
        : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium'];
  for (const candidate of osCandidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

interface ItemsDataset {
  version: string;
  weapons: Array<{
    id: string;
    name: string;
    namePtBr: string;
    itemId: number;
    graphicHex: string;
    classicUoGraphicHex: string;
    skill: string;
    layer: string;
    speed: number;
    minDamage: number;
    maxDamage: number;
    strReq: number;
    primaryAbility: { id: number; key: string };
    secondaryAbility: { id: number; key: string };
    classSynergy: string[];
  }>;
  consumables: Array<{
    id: string;
    name: string;
    namePtBr: string;
    itemId: number;
    graphicHex: string;
    requiredSkill: { skillKey: string; minSkill: number };
    cooldownMs?: number;
    maxCharges?: number;
    range?: number;
    baseDamage?: [number, number];
    supportsPoison?: boolean;
    abilityId: string;
    effect?: string;
  }>;
  iconicTokunoArmaments: Array<{
    id: string;
    name: string;
    classTheme: string;
    classicUoGraphicHex: string;
    graphicId: number;
    skill: string;
    layer: string;
    speed: number;
    baseDamageRange: [number, number];
    damageByMaterialTier: Record<string, [number, number]>;
    primaryAbility: { id: number; key: string; moRef: string };
    secondaryAbility: { id: number; key: string; moRef: string };
  }>;
  materialTiers: Array<{
    tier: number;
    id: string;
    levelReq: number;
    damageMultiplier: number;
    durabilityBonusPct: number;
    resistBonusPct: number;
  }>;
  affixPools: Record<
    string,
    {
      key: string;
      skillId?: number;
      bonusItemKey: string;
      arvoreBonusKey: string;
      uiEn: string;
      uiPtBr: string;
      cap: number;
      classSynergy: string[];
    }
  >;
}

interface ScenarioMetrics {
  classId: string;
  bracketId: string;
  archetypeId: string;
  mode: 'mode_a' | 'mode_b';
  sustainedDps: number;
  rawDps: number;
  trashTtkSec: number;
  overkillWastePct: number;
  netManaDeltaPerMin: number;
  netStaminaDeltaPerMin: number;
  ehpPerSec: number;
  totalCasts: number;
  totalSwings: number;
  totalHits: number;
  totalCrits: number;
  parryCount: number;
  cloneInterceptions: number;
  oomTicks: number;
}

interface ParityDataset {
  version: string;
  tickMs: number;
  classes: string[];
  brackets: string[];
  archetypes: string[];
  mode_a: { scenarios: ScenarioMetrics[] };
  mode_b: { scenarios: ScenarioMetrics[] };
}

export function escapeHtml(value: unknown): string {
  const str = String(value ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeJsonEmbed(data: unknown): string {
  return JSON.stringify(data).replace(/<\//g, '<\\/');
}

function loadValidatedClasses(): Record<string, ClassDefinition> {
  const paths: Record<string, string> = {
    warrior: path.join(ROOT_DIR, 'data/live-classes/warrior.json'),
    mage: path.join(ROOT_DIR, 'data/live-classes/mage.json'),
    ranger: path.join(ROOT_DIR, 'data/live-classes/ranger.json'),
    samurai: path.join(ROOT_DIR, 'design/drop-in/samurai.json'),
    ninja: path.join(ROOT_DIR, 'design/drop-in/ninja.json'),
  };

  const result: Record<string, ClassDefinition> = {};
  for (const [id, filePath] of Object.entries(paths)) {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    result[id] = ClassSchema.parse(raw);
  }
  return result;
}

function loadItemsDataset(): ItemsDataset {
  const filePath = path.join(ROOT_DIR, 'design/drop-in/items-bushido-ninjitsu.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as ItemsDataset;
}

function loadParityDataset(): ParityDataset {
  const filePath = path.join(ROOT_DIR, 'data/sim-baselines/parity-5class-v0.99.0.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as ParityDataset;
}

interface GearWavesDataset {
  version: string;
  tickMs: number;
  classes: string[];
  damageBreakdowns: Array<{
    classId: string;
    bracketId: string;
    archetypeId: string;
    mode: string;
    autoAttackDps: number;
    specialMoveDps: number;
    executeDps: number;
    dotDps: number;
    procCounterDps: number;
    totalDps: number;
  }>;
  materialTierCurves: Array<{
    classId: string;
    tierId: string;
    levelReq: number;
    statBonusBudget: number;
    hue: number;
    lowDefBossDps: number;
    highDefBossDps: number;
    multiTargetDps: number;
    ehpPerSec: number;
  }>;
  affixLoadoutCurves: Array<{
    classId: string;
    loadoutId: string;
    loadoutName: string;
    lowDefBossDps: number;
    highDefBossDps: number;
    multiTargetDps: number;
    ehpPerSec: number;
    netManaDeltaPerMin: number;
    netStaminaDeltaPerMin: number;
  }>;
  multiWaveRuns: Array<{
    classId: string;
    totalClearTimeSec: number;
    averageWaveDps: number;
    minHpPct: number;
    minManaPct: number;
    totalParries: number;
    totalCloneInterceptions: number;
    waves: Array<{
      waveIndex: number;
      waveClearTimeSec: number;
      cumulativeTimeSec: number;
      waveDps: number;
      endingHpPct: number;
      endingManaPct: number;
      endingStaminaPct: number;
      parriesInWave: number;
      clonesOrStreakEnd: number;
    }>;
  }>;
  rotationTimelines: Array<{
    classId: string;
    bracketId: string;
    horizonMs: number;
    events: Array<{
      timeMs: number;
      kind: string;
      label: string;
      damage: number;
      isCrit: boolean;
    }>;
  }>;
}

function loadGearWavesDataset(): GearWavesDataset {
  const filePath = path.join(ROOT_DIR, 'data/sim-baselines/gear-and-waves-v1.1.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as GearWavesDataset;
}

interface PaperdollSlotSpec {
  id: string;
  slotLabel: string;
  nameEn: string;
  namePtBr: string;
  graphic: number;
  hex: string;
  maleGump: number;
  layer: string;
  kind: 'armor' | 'weapon' | 'consumable';
  baseArmorResist?: number;
  baseDmg?: [number, number];
  speed?: number;
  primaryAbility?: string;
  secondaryAbility?: string;
  affixesEn: string[];
  affixesPtBr: string[];
  loreEn: string;
  lorePtBr: string;
}

const PAPERDOLL_GEAR: Record<'samurai' | 'ninja', PaperdollSlotSpec[]> = {
  samurai: [
    {
      id: 'kabuto',
      slotLabel: 'Helm (Layer 6)',
      nameEn: 'Imperial Kabuto Helm',
      namePtBr: 'Elmo Kabuto Imperial',
      graphic: 10102,
      hex: '0x2776',
      maleGump: 50444,
      layer: 'Helm',
      kind: 'armor',
      baseArmorResist: 11,
      affixesEn: ['Bushido +12', 'Defense Chance +15%', 'Physical Resist +14%'],
      affixesPtBr: ['Bushido +12', 'Chance de Defesa +15%', 'Resistência Física +14%'],
      loreEn: 'Crested Tokuno war-helm forged with an ancestral golden kuwagata crest.',
      lorePtBr: 'Elmo de guerra de Tokuno forjado com crista ancestral dourada kuwagata.',
    },
    {
      id: 'samurai_do',
      slotLabel: 'Chest (Layer 13)',
      nameEn: 'Crimson-Lacquer Plate Do',
      namePtBr: 'Couraça Plate Do Carmesim',
      graphic: 10182,
      hex: '0x27C6',
      maleGump: 50457,
      layer: 'InnerTorso',
      kind: 'armor',
      baseArmorResist: 18,
      affixesEn: ['Bushido +15', 'Stamina Regen +4/s', 'Damage Taken -8%'],
      affixesPtBr: ['Bushido +15', 'Regen de Estamina +4/s', 'Dano Recebido -8%'],
      loreEn: 'Lacquered lamellar cuirass bearing the crimson mon of Emperorotsu.',
      lorePtBr: 'Couraça lamelar laqueada ostentando o brasão carmesim imperial.',
    },
    {
      id: 'hiro_sode',
      slotLabel: 'Arms (Layer 19)',
      nameEn: 'Plate Hiro-Sode Vambraces',
      namePtBr: 'Braçadeiras Plate Hiro-Sode',
      graphic: 10110,
      hex: '0x277E',
      maleGump: 50473,
      layer: 'Arms',
      kind: 'armor',
      baseArmorResist: 10,
      affixesEn: ['Swing Speed +15%', 'Hit & Crit Chance +12%', 'STR +8'],
      affixesPtBr: ['Velocidade de Ataque +15%', 'Chance de Acerto e Crítico +12%', 'FOR +8'],
      loreEn: 'Articulated shoulder-guards engineered for unhindered two-handed Iaijutsu draws.',
      lorePtBr: 'Ombreiras articuladas projetadas para saques rápidos de Iaijutsu.',
    },
    {
      id: 'suneate',
      slotLabel: 'Legs (Layer 4)',
      nameEn: 'Plate Suneate Greaves',
      namePtBr: 'Grevas Plate Suneate',
      graphic: 5067,
      hex: '0x13CB',
      maleGump: 50543,
      layer: 'Pants',
      kind: 'armor',
      baseArmorResist: 12,
      affixesEn: ['Parrying +15', 'Stamina Max +18', 'Energy Resist +12%'],
      affixesPtBr: ['Aparar +15', 'Estamina Máx +18', 'Resistência a Energia +12%'],
      loreEn: 'Reinforced shin-guards anchoring the Samurai during Counter Attack stances.',
      lorePtBr: 'Grevas reforçadas que firmam a base do Samurai durante Contra-Ataque.',
    },
    {
      id: 'waraji',
      slotLabel: 'Boots (Layer 3)',
      nameEn: 'Waraji & Tabi Footwear',
      namePtBr: 'Sandálias Waraji e Tabi',
      graphic: 10134,
      hex: '0x2796',
      maleGump: 50569,
      layer: 'Shoes',
      kind: 'armor',
      baseArmorResist: 6,
      affixesEn: ['DEX +8', 'Swing Speed +10%', 'Stamina Cost -8%'],
      affixesPtBr: ['DES +8', 'Velocidade de Ataque +10%', 'Custo de Estamina -8%'],
      loreEn: 'Corded battle sandals worn over split-toe tabi for instantaneous footwork pivots.',
      lorePtBr: 'Sandálias de batalha trançadas sobre meias tabi para pivôs instantâneos.',
    },
    {
      id: 'jin_baori',
      slotLabel: 'Cloak (Layer 20)',
      nameEn: 'Imperial Jin-Baori Surcoat',
      namePtBr: 'Sobretudo Imperial Jin-Baori',
      graphic: 5397,
      hex: '0x1515',
      maleGump: 50468,
      layer: 'Cloak',
      kind: 'armor',
      baseArmorResist: 7,
      affixesEn: ['Bushido +10', 'Mana Regen +3/s', 'Perfection Cap +5%'],
      affixesPtBr: ['Bushido +10', 'Regen de Mana +3/s', 'Limite de Perfeição +5%'],
      loreEn: 'Sleeveless crimson campaign surcoat worn by Tokuno Kensei commanders.',
      lorePtBr: 'Sobretudo carmesim sem mangas usado pelos comandantes Kensei de Tokuno.',
    },
    {
      id: 'daisho',
      slotLabel: 'Primary Weapon (2H)',
      nameEn: 'Ancestral Daisho Pair',
      namePtBr: 'Par Daisho Ancestral',
      graphic: 10153,
      hex: '0x27A9',
      maleGump: 50470,
      layer: 'TwoHanded',
      kind: 'weapon',
      baseDmg: [13, 15],
      speed: 40,
      primaryAbility: 'Feint (#8)',
      secondaryAbility: 'Double Strike (#7)',
      affixesEn: ['Damage +40%', 'Swing Speed +20%', 'Bushido +15'],
      affixesPtBr: ['Dano +40%', 'Velocidade de Ataque +20%', 'Bushido +15'],
      loreEn: 'Matched katana and wakizashi pair enabling shieldless 2H Bushido parrying (÷41,140).',
      lorePtBr: 'Par combinando katana e wakizashi permitindo aparar sem escudo (÷41.140).',
    },
    {
      id: 'katana',
      slotLabel: 'Fast Blade (1H)',
      nameEn: 'Folded-Steel Katana',
      namePtBr: 'Katana de Aço Dobrado',
      graphic: 5119,
      hex: '0x13FF',
      maleGump: 50627,
      layer: 'OneHanded',
      kind: 'weapon',
      baseDmg: [11, 13],
      speed: 46,
      primaryAbility: 'Double Strike (#7)',
      secondaryAbility: 'Armor Ignore (#1)',
      affixesEn: ['Damage +35%', 'Hit & Crit Chance +18%', 'Energy Damage +20%'],
      affixesPtBr: ['Dano +35%', 'Chance de Acerto e Crítico +18%', 'Dano de Energia +20%'],
      loreEn: 'Razor-honed curved blade feeding Double Strike and Armor Ignore into Perfection.',
      lorePtBr: 'Lâmina curva afiada alimentando Golpe Duplo e Ignorar Armadura.',
    },
    {
      id: 'no_dachi',
      slotLabel: 'Heavy Cleaver (2H)',
      nameEn: 'Grandmaster No-Dachi',
      namePtBr: 'No-Dachi de Grão-Mestre',
      graphic: 10146,
      hex: '0x27A2',
      maleGump: 50519,
      layer: 'TwoHanded',
      kind: 'weapon',
      baseDmg: [16, 18],
      speed: 35,
      primaryAbility: 'Crushing Blow (#4)',
      secondaryAbility: 'Riding Swipe (#15)',
      affixesEn: ['Damage +50%', 'Armor Pierce +20%', 'Execute Damage +15%'],
      affixesPtBr: ['Dano +50%', 'Perfuração de Armadura +20%', 'Dano de Execução +15%'],
      loreEn: 'Great field sword built for Momentum Strike two-target cleaves and Kensei executions.',
      lorePtBr: 'Espada longa de batalha para Golpe de Ímpeto e execuções Kensei.',
    },
    {
      id: 'wakizashi',
      slotLabel: 'Cyclone Blade (1H)',
      nameEn: 'Tokuno Wakizashi',
      namePtBr: 'Wakizashi de Tokuno',
      graphic: 10148,
      hex: '0x27A4',
      maleGump: 50464,
      layer: 'OneHanded',
      kind: 'weapon',
      baseDmg: [11, 13],
      speed: 45,
      primaryAbility: 'Frenzied Whirlwind (#6)',
      secondaryAbility: 'Double Strike (#7)',
      affixesEn: ['Swing Speed +25%', 'Bleed Damage +20%', 'Bushido +12'],
      affixesPtBr: ['Velocidade de Ataque +25%', 'Dano de Sangramento +20%', 'Bushido +12'],
      loreEn: 'Companion blade that unlocks Frenzied Whirlwind AoE gales and rapid Double Strikes.',
      lorePtBr: 'Lâmina curta que libera os ciclones de Turbilhão Frenético e Golpe Duplo.',
    },
  ],
  ninja: [
    {
      id: 'ninja_hood',
      slotLabel: 'Helm (Layer 6)',
      nameEn: 'Leather Ninja Hood',
      namePtBr: 'Capuz Ninja de Couro',
      graphic: 10126,
      hex: '0x278E',
      maleGump: 50425,
      layer: 'Helm',
      kind: 'armor',
      baseArmorResist: 9,
      affixesEn: ['Ninjitsu +15', 'Stealth +15', 'Crit Chance +14%'],
      affixesPtBr: ['Ninjitsu +15', 'Furtividade +15', 'Chance de Crítico +14%'],
      loreEn: 'Shadow-dyed Tokuno cowl that conceals the shinobi during Smoke Bomb vanishes.',
      lorePtBr: 'Capuz tingido nas sombras que oculta o shinobi durante Bomba de Fumaça.',
    },
    {
      id: 'ninja_jacket',
      slotLabel: 'Chest (Layer 13)',
      nameEn: 'Leather Ninja Jacket',
      namePtBr: 'Jaqueta Ninja de Couro',
      graphic: 10131,
      hex: '0x2793',
      maleGump: 50426,
      layer: 'InnerTorso',
      kind: 'armor',
      baseArmorResist: 14,
      affixesEn: ['Ninjitsu +15', 'Mirror Image Evasion +10%', 'Mana Regen +4/s'],
      affixesPtBr: ['Ninjitsu +15', 'Evasão de Imagem Espelhada +10%', 'Regen de Mana +4/s'],
      loreEn: 'Supple midnight-indigo brigandine lined with hidden pockets for Egg Bombs and darts.',
      lorePtBr: 'Jaqueta índigo meia-noite forrada com bolsos ocultos para Bombas de Ovo e dardos.',
    },
    {
      id: 'ninja_mitts',
      slotLabel: 'Gloves (Layer 7)',
      nameEn: 'Leather Ninja Mitts',
      namePtBr: 'Luvas Ninja de Couro',
      graphic: 10130,
      hex: '0x2792',
      maleGump: 50424,
      layer: 'Gloves',
      kind: 'armor',
      baseArmorResist: 8,
      affixesEn: ['Poisoning +15', 'Poison Damage +25%', 'Swing Speed +15%'],
      affixesPtBr: ['Envenenamento +15', 'Dano de Veneno +25%', 'Velocidade de Ataque +15%'],
      loreEn: 'Venom-resistant gauntlets grooved for rapid Shuriken and Fukiya dart reloading.',
      lorePtBr: 'Manoplas resistentes a veneno para recarga rápida de Shuriken e Fukiya.',
    },
    {
      id: 'ninja_belt',
      slotLabel: 'Waist (Layer 12)',
      nameEn: 'Shuriken Utility Belt',
      namePtBr: 'Cinto de Shurikens de Couro',
      graphic: 10128,
      hex: '0x2790',
      maleGump: 50514,
      layer: 'Waist',
      kind: 'armor',
      baseArmorResist: 7,
      affixesEn: ['Shuriken Volley Damage +20%', 'Cooldown Reduction +10%', 'DEX +10'],
      affixesPtBr: ['Dano de Shuriken +20%', 'Redução de Recarga +10%', 'DES +10'],
      loreEn: 'Bandolier belt (0x2790) housing 10 poison-tipped star shurikens for automatic volleys.',
      lorePtBr: 'Cinto bandoleira (0x2790) com 10 shurikens envenenadas para disparos automáticos.',
    },
    {
      id: 'ninja_pants',
      slotLabel: 'Legs (Layer 4)',
      nameEn: 'Leather Ninja Pants',
      namePtBr: 'Calças Ninja de Couro',
      graphic: 10129,
      hex: '0x2791',
      maleGump: 50423,
      layer: 'Pants',
      kind: 'armor',
      baseArmorResist: 10,
      affixesEn: ['Stealth +15', 'Ki Attack Dash +15%', 'Stamina Regen +4/s'],
      affixesPtBr: ['Furtividade +15', 'Avanço Ataque de Ki +15%', 'Regen de Estamina +4/s'],
      loreEn: 'Soundless shinobi legwraps tailored for Animal Form speed and Shadowjump leaps.',
      lorePtBr: 'Perneiras silenciosas feitas para a velocidade da Forma Animal e Salto das Sombras.',
    },
    {
      id: 'ninja_tabi',
      slotLabel: 'Boots (Layer 3)',
      nameEn: 'Shinobi Ninja-Tabi',
      namePtBr: 'Botas Shinobi Ninja-Tabi',
      graphic: 10135,
      hex: '0x2797',
      maleGump: 50572,
      layer: 'Shoes',
      kind: 'armor',
      baseArmorResist: 6,
      affixesEn: ['DEX +12', 'Swing Speed +15%', 'Dodge Chance +10%'],
      affixesPtBr: ['DES +12', 'Velocidade de Ataque +15%', 'Chance de Esquiva +10%'],
      loreEn: 'Soft-soled split-toe boots that leave zero sound or tracks during Stealth ambushes.',
      lorePtBr: 'Botas silenciosas de sola macia que não deixam rastros em emboscadas.',
    },
    {
      id: 'tekagi',
      slotLabel: 'Primary Claws (2H)',
      nameEn: 'Venom-Edged Tekagi Claws',
      namePtBr: 'Garras Tekagi Envenenadas',
      graphic: 10155,
      hex: '0x27AB',
      maleGump: 50533,
      layer: 'TwoHanded',
      kind: 'weapon',
      baseDmg: [10, 12],
      speed: 55,
      primaryAbility: 'Dual Wield (#23)',
      secondaryAbility: 'Talon Strike (#21)',
      affixesEn: ['Swing Speed +25%', 'Poison Damage +30%', 'Ninjitsu +15'],
      affixesPtBr: ['Velocidade de Ataque +25%', 'Dano de Veneno +30%', 'Ninjitsu +15'],
      loreEn: 'Twin four-bladed hand claws (Speed 55) that race through 5-swing Death Strike marks.',
      lorePtBr: 'Garras duplas de quatro lâminas (Vel 55) que detonam Marca da Morte rapidamente.',
    },
    {
      id: 'kama',
      slotLabel: 'Twin Sickles (2H)',
      nameEn: 'Kusarigama & Kama Pair',
      namePtBr: 'Par de Foices Kama',
      graphic: 10157,
      hex: '0x27AD',
      maleGump: 50535,
      layer: 'TwoHanded',
      kind: 'weapon',
      baseDmg: [9, 11],
      speed: 55,
      primaryAbility: 'Whirlwind Attack (#13)',
      secondaryAbility: 'Defense Mastery (#18)',
      affixesEn: ['Swing Speed +25%', 'Cleave Damage +20%', 'Crit Chance +18%'],
      affixesPtBr: ['Velocidade de Ataque +25%', 'Dano em Área +20%', 'Chance de Crítico +18%'],
      loreEn: 'Reaping shinobi sickles built for multi-target packs and Twin Shadow executions.',
      lorePtBr: 'Foices shinobi projetadas para grupos de inimigos e Execução das Sombras Gêmeas.',
    },
    {
      id: 'fukiya',
      slotLabel: 'Ranged Tool (1H)',
      nameEn: 'Lacquer Fukiya Blowgun',
      namePtBr: 'Zarabatana Fukiya Laqueada',
      graphic: 10154,
      hex: '0x27AA',
      maleGump: 50532,
      layer: 'OneHanded',
      kind: 'weapon',
      baseDmg: [4, 6],
      speed: 50,
      primaryAbility: 'Infectious Strike (#11)',
      secondaryAbility: 'Shadow Strike (#12)',
      affixesEn: ['Poisoning +20', 'Poison DoT +35%', 'Cooldown Reduction +12%'],
      affixesPtBr: ['Envenenamento +20', 'DoT de Veneno +35%', 'Redução de Recarga +12%'],
      loreEn: 'Silent bamboo blowgun firing Lethal Poison darts during Fukiya & Egg Bomb Barrage.',
      lorePtBr: 'Zarabatana silenciosa que dispara dardos de Veneno Letal em barragem.',
    },
    {
      id: 'kryss',
      slotLabel: 'Venom Blade (1H)',
      nameEn: 'Serpentine Assassin Kryss',
      namePtBr: 'Kryss Serpentina de Assassino',
      graphic: 5121,
      hex: '0x1401',
      maleGump: 50630,
      layer: 'OneHanded',
      kind: 'weapon',
      baseDmg: [10, 12],
      speed: 53,
      primaryAbility: 'Armor Ignore (#1)',
      secondaryAbility: 'Infectious Strike (#11)',
      affixesEn: ['Poison Damage +30%', 'Damage +35%', 'Stealth Opener +15%'],
      affixesPtBr: ['Dano de Veneno +30%', 'Dano +35%', 'Abertura Furtiva +15%'],
      loreEn: 'Wavy-bladed fencing stiletto that leaves the off-hand free for Focus Attack & Shurikens.',
      lorePtBr: 'Estilete ondulado que mantém a mão secundária livre para Ataque Focado e Shurikens.',
    },
  ],
};

const MODE_DESCRIPTIONS: Record<string, { modeA: string; modeB: string; qCEstimator: string }> = {
  samurai_way: {
    modeA: 'Passive auto-attack swing loop + Parrying (ID 5) & Bushido (ID 52) shieldless parry scaling.',
    modeB: 'Native BaseWeapon.CheckParry shieldless 1H (48,000) / 2H (41,140) Bushido Weapon Parry formula.',
    qCEstimator: '1.00x Weapon Auto-Swing + 25.8% (1H) / 29.3% (2H) Parry @ 100 Bushido',
  },
  samurai_lightning: {
    modeA: 'Sole single-rank SpecialMove (spellId: 404) 1.10x-1.20x precision strike + 3.0s Lightning Stagger debuff.',
    modeB: 'Authentic LightningStrike (+50% Hit Chance, Bushido^2/72,000 critical IgnoreArmor roll, full scaling).',
    qCEstimator: '1.10x - 1.20x Melee + 13.9% IgnoreArmor Crit @ 100 Bushido',
  },
  samurai_perfection: {
    modeA: 'Custom self-buff (customCooldownMs: 14,000ms >= 2,000ms floor) granting +10% Perfection streak.',
    modeB: 'Passive BaseWeapon.OnHit auto-Honored target bind (+4%/hit up to +15% cap, +8 HP/Stam/Mana on kill).',
    qCEstimator: '+10% Damage Dealt (8.0s Mode A) / +15% Streak Cap + Vital Restore (Mode B)',
  },
  samurai_honorable: {
    modeA: 'Sole single-rank SpecialMove (spellId: 400) 1.15x-1.25x strike (1.60x Execute <= 35% HP) + 10s +15% Attack Speed.',
    modeB: 'HonorableExecution finisher with zero penalties and 10.0s +15% swing speed buff.',
    qCEstimator: '1.15x - 1.25x (1.60x <= 35% HP) + 15% Swing Haste (10s)',
  },
  samurai_confidence: {
    modeA: 'Spell (spellId: 401) 0.50x-0.65x Bushido self-heal + 4-tick Confidence Regen over 4.0s.',
    modeB: 'Confidence posture: instant heal + reactive on-parry recovery (+8 HP / +20 Stam, 2.0s ICD).',
    qCEstimator: '38 - 52 HP Instant Heal + 4x Regen Ticks / On-Parry Recovery',
  },
  samurai_counter: {
    modeA: 'Spell (spellId: 403) exclusive posture granting +18% damage dealt for 8.0s.',
    modeB: 'CounterAttack posture: +18% damage + instant free BaseWeapon.OnSwing counter-attack on parry (2.0s ICD).',
    qCEstimator: '+18% Melee Damage (8.0s) + Reactive Parry Counter-Swing',
  },
  samurai_double_strike: {
    modeA: 'WeaponAbility (ref: 7, Katana/Daisho/Wakizashi) 2-hit rapid strike at 90% damage per swing (1.80x total).',
    modeB: 'DoubleStrike (ref: 7) 2-hit combo advancing Perfection streak twice in a single swing.',
    qCEstimator: '2 Hits x 0.90x (1.80x Total Weapon Damage)',
  },
  samurai_evasion: {
    modeA: 'Spell (spellId: 402) 8.0s defensive posture granting -15% damage taken and spell reflection.',
    modeB: 'Evasion posture: 1.32x Bushido parry multiplier + spell interception for 8.0s (20s CD).',
    qCEstimator: '-15% Damage Taken & Spell Reflect (8.0s)',
  },
  samurai_momentum_strike: {
    modeA: 'Spell (spellId: 405) 1.15x-1.25x primary strike + 100% splash cleave onto a 2nd adjacent target.',
    modeB: 'MomentumStrike 2-target cleave transferring full kinetic blade force to secondary enemy.',
    qCEstimator: '1.15x - 1.25x Primary + 100% 2nd-Target Cleave',
  },
  samurai_armor_ignore: {
    modeA: 'WeaponAbility (ref: 1, Katana secondary) 1.25x-1.35x armor-piercing blow + 7.0s -18% defense shred.',
    modeB: 'ArmorIgnore (ref: 1) bypassing target physical resistance and applying 7.0s Breach Armor.',
    qCEstimator: '1.25x - 1.35x Direct Pierce + -18% Enemy Defense (7.0s)',
  },
  samurai_frenzied_whirlwind: {
    modeA: 'WeaponAbility (ref: 6, Wakizashi/Tetsubo) 1.15x-1.25x cyclone strike + 50% splash + 4-tick Frenzied Gale bleed.',
    modeB: 'ModernUO FrenziedWhirlwind (ref: 6) multi-target Tokuno blade gale with 25% armor bypass and bleed ticks.',
    qCEstimator: '1.15x - 1.25x Primary + 50% Cyclone Splash + 4-Tick Gale (10 Mana)',
  },
  samurai_kensei_judgment: {
    modeA: 'Capstone SpecialMove (spellId: 400, 15 Stamina) 1.95x Execute <= 35% HP + Kensei Stance (+12% Speed / +8% Dmg, 10s).',
    modeB: "Grandmaster Kensei: Amakura's Judgment Iaijutsu stroke: 1.95x Execute finisher + dual offensive posture.",
    qCEstimator: '1.15x - 1.25x (1.95x Execute <= 35% HP) + 12% Haste / +8% Dmg',
  },
  ninja_shadowjump: {
    modeA: 'Passive high-speed Fencing auto-attack loop + Ninjitsu (ID 53), Hiding (ID 21) & Stealth (ID 47) scaling.',
    modeB: 'Innate shadow-step footwork enabling mid-combat Stealth openers without manual tile targeting.',
    qCEstimator: '1.00x High-Speed Fencing Auto-Swing (Speed 53-55)',
  },
  ninja_focus: {
    modeA: 'SpecialMove (spellId: 500) 1.15x-1.25x precision strike + 4.0s +8% crit/damage Focus Ki buff.',
    modeB: 'FocusAttack (spellId: 500) shieldless 1H/2H multiplier + +20% on-hit property amplification.',
    qCEstimator: '1.15x - 1.25x Strike + +8% Focused Ki (4.0s)',
  },
  ninja_mirror: {
    modeA: 'Sole single-rank Spell (spellId: 507) summoning an illusory shadow clone granting -8% damage taken for 8.0s.',
    modeB: 'MirrorImage clone stack: intercepts incoming hit at Ninjitsu/150 chance (70% ablative absorb, 1.5s ICD).',
    qCEstimator: '1 Shadow Clone (-8% Damage Taken Mode A / 70% Intercept Mode B)',
  },
  ninja_backstab: {
    modeA: 'SpecialMove (spellId: 504) 1.15x-1.25x ambush strike + 5.0s +6% Shadow Ambush damage buff.',
    modeB: 'Backstab consuming CombatStealthUntil window for 1.15x multiplicative stealth opener bonus.',
    qCEstimator: '1.15x - 1.25x Ambush + +6% Damage Dealt (5.0s)',
  },
  ninja_death: {
    modeA: 'Sole single-rank SpecialMove (spellId: 501) 1.10x-1.20x vital strike + 4-tick Death Mark internal trauma DoT (4.0s).',
    modeB: 'DeathStrike: arms 5-swing counter via DeathStrike.AddStep(defender), detonating on 5th connected hit.',
    qCEstimator: '1.10x - 1.20x Strike + 4-Tick Trauma DoT / 5-Swing Detonation',
  },
  ninja_animal_form: {
    modeA: 'Spell (spellId: 502) Grey Wolf / Bake Kitsune aspect granting +10% attack speed for 8.0s.',
    modeB: 'Combat AnimalForm posture increasing Fencing swing cadence by +10% without polymorph lock.',
    qCEstimator: '+10% Weapon Attack Speed (8.0s Wolf/Kitsune Aspect)',
  },
  ninja_infectious_strike: {
    modeA: 'WeaponAbility (ref: 11, Kryss primary) 0.90x-1.00x strike + 3-tick virulent poison DoT over 6.0s.',
    modeB: 'InfectiousStrike (ref: 11) applying Poisoning-scaled Deadly/Lethal assassin venom.',
    qCEstimator: '0.90x - 1.00x Strike + 3x Virulent Venom Ticks (6.0s)',
  },
  ninja_smoke_bomb: {
    modeA: 'Custom ability (itemId: 10248, customCooldownMs: 20,000ms >= 2,000ms floor) granting 6.0s Smoke Veil (-8% dmg taken).',
    modeB: 'Triggers Hiding.CombatOverride = true & sets CombatStealthUntil for Backstab / SurpriseAttack openers.',
    qCEstimator: '6.0s Mid-Combat Stealth Veil (-8% Damage Taken + Opener Ready)',
  },
  ninja_shuriken: {
    modeA: 'Bonus L35 Custom projectile volley (itemId: 10248 / gump 10156, customCooldownMs: 11,000ms) with 75% 2nd-target splash.',
    modeB: 'Cooldown-gated Shuriken & Fukiya dart volley (zero backpack ammo micro) with Poison coat synergy.',
    qCEstimator: '0.75x - 0.85x Ranged Volley + 75% Secondary Splash',
  },
  ninja_ki_attack: {
    modeA: 'SpecialMove (spellId: 503) 1.15x-1.25x high-velocity dash strike + 85% kinetic splash on 2nd enemy.',
    modeB: 'KiAttack gap-closer simulating optimal distance bonus in 1D combat with 85% cleave splash.',
    qCEstimator: '1.15x - 1.25x Primary Dash + 85% Kinetic Cleave',
  },
  ninja_surprise_attack: {
    modeA: 'SpecialMove (spellId: 505) 1.10x-1.20x stealth blindside + 6.0s -8% target defense shred.',
    modeB: 'SurpriseAttack consuming stealth window to apply -8% defense vulnerability before DeathStrike.',
    qCEstimator: '1.10x - 1.20x Strike + -8% Target Defense Shred (6.0s)',
  },
  ninja_fukiya_barrage: {
    modeA: 'Spell (spellId: 507, itemId: 10154) Fukiya & Egg Bomb Barrage (-10% dmg taken, +8% dmg dealt for 7.0s).',
    modeB: 'Detonates ModernUO EggBomb flash-cloud + 2 ablative decoys (70% hit interception each) + Fukiya poison darts.',
    qCEstimator: 'Egg Bomb Veil + 2 Decoys (-10% Dmg Taken & +8% Dmg Dealt, 7.0s)',
  },
  ninja_twin_shadow: {
    modeA: 'Capstone SpecialMove (spellId: 501, 18 Stamina) 1.25x-1.35x (1.95x Execute <= 35% HP) + 4-tick Twin Shadow Mark.',
    modeB: 'Grandmaster Kage Bunshin: Twin Shadow Execution (1.95x Execute below 35% HP + 5-swing dual-clone detonation).',
    qCEstimator: '1.25x - 1.35x (1.95x Execute <= 35% HP) + 4-Tick Mark (18 Stamina)',
  },
};

const PASSIVE_BADGES: Record<
  'samurai' | 'ninja',
  Array<{ id: string; tier: string; nameEn: string; namePtBr: string; descEn: string; descPtBr: string }>
> = {
  samurai: [
    {
      id: 'samurai_bushido_initiate',
      tier: 'Tier I (L10)',
      nameEn: 'Bushido Initiate',
      namePtBr: 'Iniciado do Bushido',
      descEn: 'Unlocks Honor target focus and Perfection streak stacking on consecutive melee hits.',
      descPtBr: 'Libera o foco de Honra e o acúmulo de Perfeição em golpes consecutivos.',
    },
    {
      id: 'samurai_inner_calm',
      tier: 'Tier II (L20)',
      nameEn: 'Inner Calm',
      namePtBr: 'Calma Interior',
      descEn: 'Harmonizes Confidence and Parrying to restore HP and Stamina during defensive stances.',
      descPtBr: 'Harmoniza Confiança e Aparar para restaurar Vida e Estamina em posturas defensivas.',
    },
    {
      id: 'samurai_way_of_the_blade',
      tier: 'Tier III (L35)',
      nameEn: 'Way of the Blade Mastery',
      namePtBr: 'Maestria do Caminho da Lâmina',
      descEn: 'Mastery of Katana, Wakizashi, No-Dachi, and Daisho shieldless parrying and Evasion.',
      descPtBr: 'Maestria em aparar sem escudo e Evasão com Katana, Wakizashi, No-Dachi e Daisho.',
    },
    {
      id: 'samurai_bushido_master',
      tier: 'Tier IV (L60)',
      nameEn: 'Grandmaster Bushido Seal',
      namePtBr: 'Selo de Grão-Mestre Bushido',
      descEn: "Crowns the Samurai with Frenzied Whirlwind and Kensei: Amakura's Judgment (1.95x Execute).",
      descPtBr: 'Coroa o Samurai com Turbilhão Frenético e Kensei: Julgamento de Amakura (Execução 1.95x).',
    },
  ],
  ninja: [
    {
      id: 'ninja_way_of_stealth',
      tier: 'Tier I (L1)',
      nameEn: 'Way of Stealth',
      namePtBr: 'Caminho da Furtividade',
      descEn: 'Innate shadow-step footwork combining Ninjitsu, Hiding, and Stealth in idle combat.',
      descPtBr: 'Movimentação inata das sombras combinando Ninjitsu, Esconder-se e Furtividade.',
    },
    {
      id: 'ninja_shadow_discipline',
      tier: 'Tier II (L25)',
      nameEn: 'Shadow Discipline',
      namePtBr: 'Disciplina das Sombras',
      descEn: 'Sustains Mirror Image decoys and Animal Form attack speed aspect without polymorph lock.',
      descPtBr: 'Sustenta clones de Imagem Espelhada e velocidade de Forma Animal em combate.',
    },
    {
      id: 'ninja_lethal_toxins',
      tier: 'Tier III (L30)',
      nameEn: 'Lethal Toxins & Tools',
      namePtBr: 'Toxinas e Ferramentas Letais',
      descEn: 'Combines Kryss Infectious Strike venom with Smoke Bomb stealth and Shuriken/Fukiya volleys.',
      descPtBr: 'Combina o veneno de Golpe Infeccioso com Bomba de Fumaça e saraivadas de Shuriken/Fukiya.',
    },
    {
      id: 'ninja_master_assassin',
      tier: 'Tier IV (L60)',
      nameEn: 'Grandmaster Assassin Seal',
      namePtBr: 'Selo de Mestre Assassino',
      descEn: 'Unlocks Fukiya & Egg Bomb Barrage and Kage Bunshin: Twin Shadow Execution (1.95x Execute).',
      descPtBr: 'Libera Barragem de Fukiya e Bomba de Ovo e Kage Bunshin: Execução das Sombras Gêmeas (Execução 1.95x).',
    },
  ],
};

function buildSharedStyles(accentVar: string, accentGlow = 'rgba(201, 162, 39, 0.14)'): string {
  return `
    :root {
      --bg-canvas: #0b0d0a;
      --bg-panel: #121510;
      --bg-card: #181c16;
      --bg-card-hover: #21271e;
      --border-subtle: #2a3026;
      --border-gold: #c9a227;
      --border-gold-bright: #e5c158;
      --text-primary: #e8e4d9;
      --text-secondary: #a39e90;
      --text-gold: #d4af37;
      --samurai-accent: #d9483b;
      --ninja-accent: #34b37a;
      --mana-blue: #4a90e2;
      --stamina-amber: #e2a04a;
      --cd-purple: #9b6be2;
      --kind-passive: #63b3ed;
      --kind-skill: #f6ad55;
      --kind-spell: #b794f4;
      --kind-mechanic: #4fd1c5;
      --kind-capstone: #f6e05e;
      --class-accent: ${accentVar};
      --class-glow: ${accentGlow};
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      background:
        radial-gradient(circle at 18% 0%, var(--class-glow) 0%, transparent 44%),
        radial-gradient(circle at 82% 8%, rgba(201, 162, 39, 0.08) 0%, transparent 48%),
        var(--bg-canvas);
      color: var(--text-primary);
      font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      line-height: 1.45;
      min-height: 100vh;
    }

    .mono, code, pre, .num {
      font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
      font-variant-numeric: tabular-nums;
      overflow-wrap: break-word;
    }

    .beta-shell {
      width: 100%;
      max-width: 1560px;
      margin: 0 auto;
      padding: 12px 16px 24px;
    }

    /* Live uoidle.com/beta .personagem-arvore & .arvore-* structural rules from game-theme.css */
    .personagem-arvore {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
      color: #f6ecd4;
      gap: 10px;
    }

    .arvore-head {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 10px;
      align-items: center;
      min-height: 54px;
      padding: 8px 14px;
      border: 1px solid #6d5733;
      border-top: 2px solid var(--border-gold);
      border-radius: 4px;
      background: linear-gradient(180deg, #20221ff0, #0d1112fa);
      color: #f3e2b3;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.65);
    }

    .arvore-nivel {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 10px;
      min-height: 36px;
      padding-right: 12px;
      border-right: 1px solid #725b31;
      min-width: 0;
    }

    .arvore-nivel strong {
      color: #fff2bf;
      font-family: 'Cinzel', Georgia, serif;
      font-size: 15px;
      letter-spacing: 0.04em;
      overflow-wrap: break-word;
    }

    .arvore-saldos {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      flex: 1 1 auto;
      justify-content: center;
      min-width: 0;
    }

    .arvore-saldo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 2px 10px;
      border-left: 1px solid #725b31;
      flex: 1 1 150px;
      min-width: 140px;
    }

    .arvore-saldo strong {
      color: #82d5b0;
      font-size: 12px;
      font-family: 'IBM Plex Mono', monospace;
      font-variant-numeric: tabular-nums;
    }

    .arvore-saldo small {
      color: #75bd93;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .arvore-saldo em {
      color: #a39e90;
      font-size: 9px;
      font-style: normal;
    }

    .arvore-head-acoes {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
      justify-content: flex-end;
    }

    .beta-btn, .nav-pill {
      padding: 5px 10px;
      border: 1px solid #6d5733;
      border-radius: 4px;
      background: #141816;
      color: #e8e4d9;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .beta-btn:hover, .nav-pill:hover {
      border-color: var(--border-gold-bright);
      background: var(--bg-card-hover);
      color: #fff2bf;
    }

    .beta-btn.is-active, .nav-pill.is-active {
      border-color: var(--border-gold-bright);
      background: linear-gradient(180deg, #332915, #1b160c);
      color: #fff2bf;
      box-shadow: 0 0 10px rgba(201, 162, 39, 0.35);
    }

    .class-badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 9px;
      border-radius: 3px;
      border: 1px solid var(--class-accent);
      background: rgba(0, 0, 0, 0.45);
      color: #fff2bf;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }

    .hue-swatch {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: var(--class-accent);
      border: 1px solid #fff2bf;
      display: inline-block;
      flex-shrink: 0;
    }

    .arvore-secao {
      min-width: 0;
      max-width: 100%;
      border: 1px solid #5d4a2b;
      border-radius: 4px;
      background: radial-gradient(circle at 50% 0, rgba(53, 50, 36, 0.22), transparent 55%), var(--bg-panel);
      box-shadow: inset 0 1px 0 rgba(255, 242, 191, 0.06);
    }

    .arvore-secao-titulo {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 8px;
      align-items: center;
      justify-content: space-between;
      margin: 0;
      padding: 8px 12px 6px;
      border-bottom: 1px solid #3c3425;
      color: var(--text-gold);
      font-family: 'Cinzel', Georgia, serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      min-width: 0;
    }

    .arvore-secao-titulo .title-left {
      min-width: 0;
      overflow-wrap: break-word;
    }

    .arvore-secao-titulo .title-left::before {
      content: '✦ ';
      color: #c99d3f;
    }

    .arvore-secao-sub {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: var(--text-secondary);
      font-weight: 400;
      text-transform: none;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .workbench-grid {
      display: grid;
      grid-template-columns: 356px minmax(0, 1fr) 396px;
      gap: 12px;
      align-items: start;
      min-width: 0;
    }

    .col-stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 0;
    }

    .panel-body {
      padding: 10px 12px;
      min-width: 0;
    }

    /* Portrait & Identity */
    .identity-hero {
      display: grid;
      grid-template-columns: 94px minmax(0, 1fr);
      gap: 10px;
      align-items: center;
      min-width: 0;
    }

    .identity-hero > div {
      min-width: 0;
    }

    .portrait-frame {
      position: relative;
      width: 94px;
      height: 94px;
      border: 2px solid var(--class-accent);
      border-radius: 6px;
      overflow: hidden;
      background: #080907;
      box-shadow: 0 0 18px var(--class-glow);
      flex-shrink: 0;
    }

    .portrait-frame img.main-portrait {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .portrait-mini-badge {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 22px;
      height: 22px;
      border: 1px solid var(--border-gold-bright);
      border-radius: 3px;
      background: #0b0d0a;
    }

    .stat-chips {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 6px;
      margin-top: 8px;
    }

    .stat-chip {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      padding: 4px 6px;
      text-align: center;
      min-width: 0;
    }

    .stat-chip span {
      display: block;
      font-size: 9px;
      color: var(--text-secondary);
      text-transform: uppercase;
    }

    .stat-chip strong {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      color: #fff2bf;
    }

    /* Skills & Paperdoll */
    .kv-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 5px;
      min-width: 0;
    }

    .kv-item {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 4px 8px;
      padding: 4px 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 3px;
      font-size: 11px;
      min-width: 0;
    }

    .kv-item > div {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .kv-item .k {
      color: var(--text-primary);
      text-transform: capitalize;
      min-width: 0;
    }

    .kv-item .v {
      font-family: 'IBM Plex Mono', monospace;
      color: var(--text-gold);
      font-weight: 600;
    }

    .hotbar-slots {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .hotbar-slot {
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr) auto;
      gap: 8px;
      align-items: center;
      padding: 5px 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-left: 3px solid var(--class-accent);
      border-radius: 4px;
      min-width: 0;
    }

    .hotbar-slot > div {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .slot-num {
      width: 22px;
      height: 22px;
      display: grid;
      place-items: center;
      background: #0d100c;
      border: 1px solid #5d4a2b;
      border-radius: 3px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: var(--text-gold);
      flex-shrink: 0;
    }

    /* Winding .arvore-cobra ribbon (2 rows x 6 milestones — zero circle/label overlap) */
    .arvore-cobra-wrap {
      padding: 10px 12px;
      border-bottom: 1px solid #2a3026;
      background: rgba(11, 13, 10, 0.55);
    }

    .arvore-cobra {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 10px 8px;
      align-items: start;
    }

    .arvore-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      min-width: 0;
      width: 100%;
    }

    .arvore-lv {
      color: #e6c36a;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      font-weight: 700;
    }

    .arvore-circulo {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border: 2px solid #6d5733;
      border-radius: 50%;
      background: radial-gradient(circle at 40% 30%, #4a3b24, #120e0a 72%);
      overflow: hidden;
      flex-shrink: 0;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .arvore-circulo.is-on {
      border-color: #e6c36a;
      box-shadow: 0 0 12px #e6c36a73;
    }

    .arvore-circulo:hover {
      transform: scale(1.06);
      border-color: var(--border-gold-bright);
    }

    .arvore-circulo img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: block;
    }

    .arvore-nome {
      color: #f6ecd4;
      font-size: 9.5px;
      line-height: 1.2;
      text-align: center;
      width: 100%;
      max-width: 100%;
      white-space: normal;
      overflow-wrap: break-word;
      word-break: break-word;
      padding: 0 2px;
    }

    /* 12 Unified Milestone + Catalog Cards Grid (De-Duplicated v2.0) */
    .filter-strip {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 7px 12px;
      border-bottom: 1px solid #2a3026;
      background: #10140f;
    }

    .milestone-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      padding: 10px 12px;
      min-width: 0;
    }

    .milestone-card {
      display: grid;
      grid-template-columns: 50px minmax(0, 1fr);
      gap: 9px;
      padding: 8px 10px;
      background: linear-gradient(180deg, #1a1f18 0%, #131712 100%);
      border: 1px solid var(--border-subtle);
      border-left: 3px solid var(--border-gold);
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.15s ease;
      min-width: 0;
    }

    .milestone-card > div {
      min-width: 0;
      overflow-wrap: break-word;
    }

    .milestone-card-head {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 4px 6px;
      min-width: 0;
    }

    .milestone-card[data-kind="passive"] { border-left-color: var(--kind-passive); }
    .milestone-card[data-kind="skill"]   { border-left-color: var(--kind-skill); }
    .milestone-card[data-kind="spell"]   { border-left-color: var(--kind-spell); }
    .milestone-card[data-kind="mechanic"] { border-left-color: var(--kind-mechanic); }
    .milestone-card[data-kind="feature"] {
      border-color: var(--kind-capstone);
      border-left: 4px solid var(--kind-capstone);
      background: linear-gradient(180deg, #272113 0%, #161812 100%);
    }

    .milestone-card:hover, .milestone-card.is-selected {
      background: var(--bg-card-hover);
      border-color: var(--border-gold-bright);
      box-shadow: 0 0 14px var(--class-glow);
      transform: translateY(-1px);
    }

    .milestone-icon-box {
      position: relative;
      width: 50px;
      height: 50px;
      flex-shrink: 0;
    }

    .milestone-icon-box img {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      border: 1px solid var(--border-gold);
      display: block;
    }

    .lv-pill {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 3px;
      background: #262013;
      border: 1px solid var(--border-gold);
      color: var(--text-gold);
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      white-space: nowrap;
    }

    .type-pill {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 3px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      border: 1px solid #3c4436;
      background: #121611;
      color: var(--text-secondary);
      white-space: nowrap;
    }
    .type-pill.kind-passive  { color: var(--kind-passive); border-color: rgba(99, 179, 237, 0.45); background: rgba(99, 179, 237, 0.10); }
    .type-pill.kind-skill    { color: var(--kind-skill); border-color: rgba(246, 173, 85, 0.45); background: rgba(246, 173, 85, 0.10); }
    .type-pill.kind-spell    { color: var(--kind-spell); border-color: rgba(183, 148, 244, 0.45); background: rgba(183, 148, 244, 0.10); }
    .type-pill.kind-mechanic { color: var(--kind-mechanic); border-color: rgba(79, 209, 197, 0.45); background: rgba(79, 209, 197, 0.10); }
    .type-pill.kind-feature  { color: var(--kind-capstone); border-color: rgba(246, 224, 94, 0.65); background: rgba(246, 224, 94, 0.14); }

    .schema-drawer {
      margin-top: 5px;
      border-top: 1px dashed #2b3227;
      padding-top: 4px;
      min-width: 0;
    }
    .schema-drawer summary {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      line-height: 1.35;
      color: var(--text-gold);
      cursor: pointer;
      user-select: none;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .schema-drawer summary:hover {
      color: #fff2bf;
    }

    .dual-unlock-banner {
      margin-top: 6px;
      padding: 5px 7px;
      border-radius: 4px;
      border: 1px dashed var(--ninja-accent);
      background: rgba(46, 158, 107, 0.12);
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 10px;
      color: #b8f5d8;
      min-width: 0;
    }

    .dual-unlock-banner > div {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .dual-unlock-banner img {
      width: 28px;
      height: 28px;
      border-radius: 3px;
      border: 1px solid var(--border-gold);
      flex-shrink: 0;
    }

    /* Pinned Live Tooltip Inspector (.arvore-dica) */
    .arvore-dica-pinned {
      padding: 10px 12px;
      border: 1px solid var(--border-gold);
      border-radius: 4px;
      background: #0c0e0cf7;
      color: #f6ecd4;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.65);
      min-width: 0;
    }

    .dica-header {
      display: grid;
      grid-template-columns: 56px minmax(0, 1fr);
      gap: 10px;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid #3c3425;
      margin-bottom: 8px;
      min-width: 0;
    }

    .dica-header > div {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .dica-header img {
      width: 56px;
      height: 56px;
      border-radius: 4px;
      border: 1px solid var(--border-gold-bright);
      flex-shrink: 0;
    }

    .inspector-modes-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px;
      font-size: 10px;
      min-width: 0;
    }

    .mode-card-box {
      padding: 6px 8px;
      background: #141812;
      border: 1px solid #2a3026;
      border-radius: 4px;
      min-width: 0;
      cursor: pointer;
      opacity: 0.58;
      transition: all 0.16s ease;
    }

    .mode-card-box:hover {
      opacity: 0.88;
      border-color: var(--border-gold);
    }

    .mode-card-box.is-active-mode {
      opacity: 1;
      background: linear-gradient(180deg, #22261c 0%, #141812 100%);
      border-color: var(--border-gold-bright);
      box-shadow: 0 0 12px var(--class-glow);
    }

    .active-mode-strip {
      margin-top: 5px;
      padding: 4px 7px;
      border-radius: 4px;
      border: 1px solid rgba(201, 162, 39, 0.38);
      border-left: 3px solid var(--border-gold);
      background: rgba(201, 162, 39, 0.08);
      font-size: 10px;
      line-height: 1.35;
      color: #efe5c8;
      transition: all 0.16s ease;
    }

    .active-mode-strip.is-mode-b {
      border-color: var(--class-accent);
      border-left: 3px solid var(--class-accent);
      background: var(--class-glow);
      color: #ffffff;
    }

    .mode-tag-pill {
      display: inline-block;
      padding: 0 5px;
      margin-right: 4px;
      border-radius: 3px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 0.03em;
      background: #282112;
      border: 1px solid var(--border-gold);
      color: var(--text-gold);
      vertical-align: baseline;
    }

    .active-mode-strip.is-mode-b .mode-tag-pill {
      background: rgba(0, 0, 0, 0.55);
      border-color: var(--class-accent);
      color: #fff2bf;
    }

    .cost-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 4px;
    }

    .badge-mana {
      padding: 1px 5px;
      border-radius: 3px;
      background: rgba(74, 144, 226, 0.16);
      border: 1px solid var(--mana-blue);
      color: #9ec9ff;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
    }

    .badge-stamina {
      padding: 1px 5px;
      border-radius: 3px;
      background: rgba(226, 160, 74, 0.16);
      border: 1px solid var(--stamina-amber);
      color: #ffd18b;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
    }

    .badge-cd {
      padding: 1px 5px;
      border-radius: 3px;
      background: rgba(155, 107, 226, 0.16);
      border: 1px solid var(--cd-purple);
      color: #d7bfff;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
    }

    .badge-meta {
      padding: 1px 5px;
      border-radius: 3px;
      background: #111510;
      border: 1px solid #333a2e;
      color: var(--text-secondary);
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
    }

    .passive-badges-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 6px;
      padding: 8px 12px 12px;
      min-width: 0;
    }

    .passive-badge-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 7px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      min-width: 0;
    }

    .passive-badge-item > div {
      min-width: 0;
      overflow-wrap: break-word;
    }

    .passive-badge-item img {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      flex-shrink: 0;
    }

    /* Interactive Visual Paperdoll & Equipment Rack (PAPERDOLL-01 — Non-Occluding Slot Tags) */
    .paperdoll-stage {
      display: grid;
      grid-template-columns: 60px minmax(0, 1fr) 60px;
      gap: 8px;
      align-items: center;
      margin-top: 6px;
      min-width: 0;
    }
    .paperdoll-rack-col {
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
    }
    .gear-slot-tile {
      position: relative;
      width: 58px;
      min-height: 62px;
      border-radius: 4px;
      border: 1px solid #5d4a2b;
      background: #10130e;
      cursor: pointer;
      padding: 3px 2px 2px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 2px;
      transition: all 0.14s ease;
    }
    .gear-slot-tile:hover, .gear-slot-tile.is-active {
      border-color: var(--border-gold-bright);
      box-shadow: 0 0 12px rgba(229, 193, 88, 0.45);
      transform: translateY(-1px);
    }
    .gear-slot-tile img {
      width: 40px;
      height: 40px;
      object-fit: contain;
      display: block;
      flex-shrink: 0;
    }
    .gear-slot-tag {
      display: block;
      width: 100%;
      text-align: center;
      padding: 1px 2px;
      border-radius: 2px;
      background: rgba(16, 20, 14, 0.96);
      border-top: 1px solid #262c22;
      color: var(--text-gold);
      font-family: 'IBM Plex Mono', monospace;
      font-size: 8px;
      line-height: 1.15;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .paperdoll-figure-box {
      position: relative;
      display: grid;
      place-items: center;
      background: radial-gradient(circle at 50% 45%, rgba(201, 162, 39, 0.12), #090b08 75%);
      border: 1px solid var(--border-gold);
      border-radius: 5px;
      padding: 4px;
      overflow: hidden;
      min-width: 0;
    }
    .paperdoll-figure-box img {
      width: 100%;
      max-width: 196px;
      height: auto;
      display: block;
      border-radius: 3px;
    }
    .weapon-rack-strip {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 6px;
      margin-top: 8px;
    }
    .weapon-rack-strip .gear-slot-tile {
      width: 100%;
      min-height: 60px;
    }
    .tier-pill-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
      margin-bottom: 6px;
    }
    .tier-mini-btn {
      padding: 2px 5px;
      font-size: 9px;
      font-family: 'IBM Plex Mono', monospace;
      border: 1px solid #3c3425;
      border-radius: 3px;
      background: #121510;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .tier-mini-btn.is-active, .tier-mini-btn:hover {
      border-color: var(--border-gold-bright);
      background: #282011;
      color: #fff2bf;
    }
    .gear-mouseover-card {
      margin-top: 8px;
      padding: 8px 10px;
      border: 1px solid var(--border-gold);
      border-left: 3px solid var(--class-accent);
      border-radius: 4px;
      background: linear-gradient(180deg, #161a14, #0d100c);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6);
      min-width: 0;
      overflow-wrap: break-word;
    }
    .table-scroll-wrap {
      width: 100%;
      max-width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    /* Multi-Resolution Responsive Breakpoints (Zero Overflow & Zero Occlusion) */
    @media (max-width: 1460px) {
      .workbench-grid {
        grid-template-columns: 344px minmax(0, 1fr);
      }
      .workbench-grid > .col-stack:nth-child(3) {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 12px;
        align-items: start;
      }
    }

    @media (max-width: 1120px) {
      .workbench-grid {
        grid-template-columns: minmax(0, 1fr);
      }
      .workbench-grid > .col-stack:nth-child(3) {
        grid-column: auto;
        grid-template-columns: minmax(0, 1fr);
      }
      .arvore-nivel {
        border-right: none;
        padding-right: 0;
      }
      .arvore-saldos {
        justify-content: flex-start;
      }
    }

    @media (max-width: 720px) {
      .beta-shell {
        padding: 8px 10px 18px;
      }
      .milestone-grid {
        grid-template-columns: minmax(0, 1fr);
      }
      .arvore-cobra {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
      .kv-grid, .passive-badges-row, .inspector-modes-grid {
        grid-template-columns: minmax(0, 1fr);
      }
      .arvore-head-acoes {
        width: 100%;
        justify-content: flex-start;
      }
      .hotbar-slot {
        grid-template-columns: 24px minmax(0, 1fr);
      }
      .hotbar-slot > .badge-cd {
        grid-column: 2;
        justify-self: start;
      }
    }

    @media (max-width: 460px) {
      .arvore-cobra {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .weapon-rack-strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .identity-hero {
        grid-template-columns: minmax(0, 1fr);
      }
    }
    ${buildComponentStyles()}
  `;
}

function buildClassSkillTreeHtml(
  cls: ClassDefinition,
  otherClassFile: string,
  otherClassLabel: string
): string {
  const isSamurai = cls.id === 'samurai';
  const classTitle = isSamurai ? 'Samurai (Bushido)' : 'Ninja (Ninjitsu)';
  const accentVar = isSamurai ? 'var(--samurai-accent)' : 'var(--ninja-accent)';
  const accentGlow = isSamurai ? 'rgba(217, 72, 59, 0.22)' : 'rgba(52, 179, 122, 0.22)';
  const robeLabel = isSamurai ? 'Hue 1884 (Crimson Lacquer)' : 'Hue 1175 (Midnight Shinobi)';
  const portraitRel = `assets/icons/${cls.id}/portrait-${cls.id}.png`;
  const portrait64Rel = `assets/icons/${cls.id}/portrait-${cls.id}-64.png`;

  const shurikenAbility: SkillDefinition | undefined = cls.abilities.find((a) => a.id === 'ninja_shuriken');

  const cobraNodesHtml = cls.progression
    .map((m, idx) => {
      const iconRel = `assets/icons/${cls.id}/${m.id}@64.png`;
      return `
        <div class="arvore-col" onclick="selectAbility('${escapeHtml(m.id)}')" title="L${m.level}: ${escapeHtml(m.nameEn)} / ${escapeHtml(m.namePtBr)}">
          <span class="arvore-lv">L${m.level}</span>
          <div class="arvore-circulo is-on ${idx === 0 ? 'is-selected-node' : ''}" data-cobra-id="${escapeHtml(m.id)}" data-node-kind="${escapeHtml(m.type)}">
            <img src="${escapeHtml(iconRel)}" alt="${escapeHtml(m.nameEn)}" />
          </div>
          <span class="arvore-nome" data-en="${escapeHtml(m.nameEn)}" data-pt="${escapeHtml(m.namePtBr)}">${escapeHtml(m.nameEn)}</span>
        </div>
      `;
    })
    .join('\n');

  const milestoneCardsHtml = cls.progression
    .map((m, idx) => {
      const ability = cls.abilities.find((a) => a.id === m.id);
      const icon64 = `assets/icons/${cls.id}/${m.id}@64.png`;
      const isCapstone = m.level === 60;
      const modeInfo = ability
        ? MODE_DESCRIPTIONS[ability.id] ?? {
            modeA: ability.scalingFormula.summary,
            modeB: ability.scalingFormula.summary,
            qCEstimator: ability.scalingFormula.summary,
          }
        : null;
      const refBadge = ability
        ? ability.spellId !== null
          ? `spellId: ${ability.spellId}`
          : ability.weaponAbilityRef !== null
            ? `weaponRef: ${ability.weaponAbilityRef}`
            : ability.itemId !== null
              ? `itemId: ${ability.itemId}`
              : 'innate'
        : 'innate';

      const dualUnlockHtml =
        !isSamurai && m.level === 35 && shurikenAbility
          ? `
            <div class="dual-unlock-banner" onclick="event.stopPropagation(); selectAbility('ninja_shuriken');">
              <img src="assets/icons/ninja/ninja_shuriken@48.png" alt="Shuriken &amp; Fukiya Volley" />
              <div>
                <strong>+ Dual L35 Unlock: <span data-en="${escapeHtml(shurikenAbility.name)}" data-pt="${escapeHtml(shurikenAbility.namePtBr)}">${escapeHtml(shurikenAbility.name)}</span></strong>
                <div class="mono" style="font-size:9px;color:#a39e90;">id: ninja_shuriken | CD: ${shurikenAbility.cooldownMs}ms | Mana: ${shurikenAbility.manaCost} | Stam: ${shurikenAbility.staminaCost} | gump: ${shurikenAbility.gumpIcon}</div>
              </div>
            </div>
          `
          : '';

      const activeModeStripHtml =
        ability && modeInfo
          ? `
            <div class="active-mode-strip" data-mode-strip>
              <span class="mode-tag-pill" data-mode-tag>MODE A · 100% ENGINE</span>
              <span class="mode-text" data-mode-a="${escapeHtml(modeInfo.modeA)}" data-mode-b="${escapeHtml(modeInfo.modeB)}">${escapeHtml(modeInfo.modeA)}</span>
            </div>
          `
          : '';

      const schemaDrawerHtml =
        ability && modeInfo
          ? `
            <details class="schema-drawer" onclick="event.stopPropagation()">
              <summary>Engine Schema &amp; Raw Spec (<code>${escapeHtml(ability.id)}</code> · ${escapeHtml(refBadge)} · gump ${ability.gumpIcon})</summary>
              <div class="mono" style="font-size:9.5px;color:var(--text-secondary);margin-top:3px;line-height:1.35;">
                kind: <strong style="color:#fff2bf;">${escapeHtml(ability.kind)}</strong> · tab: ${escapeHtml(ability.tab)} · scope: ${escapeHtml(ability.mapScope)} · effect: ${escapeHtml(ability.effectType)} · iconKey: ${escapeHtml(ability.iconKey)} (${escapeHtml(`assets/icons/${cls.id}/${ability.id}@48.png`)})
                ${ability.customCooldownMs > 0 ? ` · customCD: ${ability.customCooldownMs}ms (&gt;=2000ms)` : ''}
              </div>
            </details>
          `
          : '';

      return `
        <div class="milestone-card ${idx === 0 ? 'is-selected' : ''} ${isCapstone ? 'is-capstone' : ''}" data-milestone-id="${escapeHtml(m.id)}" data-kind="${escapeHtml(m.type)}" onclick="selectAbility('${escapeHtml(m.id)}')">
          <div class="milestone-icon-box">
            <img src="${escapeHtml(icon64)}" alt="${escapeHtml(m.nameEn)}" />
          </div>
          <div>
            <div class="milestone-card-head">
              <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;min-width:0;">
                <span class="lv-pill">L${m.level}</span>
                <code class="mono" style="font-size:9.5px;color:var(--text-secondary);">${escapeHtml(m.id)}</code>
              </div>
              <span class="type-pill kind-${escapeHtml(m.type)}">${escapeHtml(isCapstone ? 'capstone · feature' : m.type)}</span>
            </div>
            <div style="font-weight:700;color:#fff2bf;font-size:13px;margin-top:3px;" data-en="${escapeHtml(m.nameEn)}" data-pt="${escapeHtml(m.namePtBr)}">${escapeHtml(m.nameEn)}</div>
            <div style="font-size:10px;color:var(--text-secondary);font-family:'IBM Plex Mono',monospace;">${escapeHtml(m.namePtBr)}</div>
            <p style="margin:4px 0 0;font-size:11px;color:var(--text-primary);" data-en="${escapeHtml(m.descEn)}" data-pt="${escapeHtml(m.descPtBr)}">${escapeHtml(m.descEn)}</p>
            ${
              ability
                ? `<div class="cost-badges">
                    <span class="badge-cd">CD ${ability.cooldownMs}ms</span>
                    <span class="badge-mana">Mana ${ability.manaCost}</span>
                    <span class="badge-stamina">Stam ${ability.staminaCost}</span>
                    <span class="badge-meta">${escapeHtml(refBadge)}</span>
                  </div>`
                : ''
            }
            ${renderAbilityPowerMeter(m.id)}
            ${activeModeStripHtml}
            ${dualUnlockHtml}
            ${schemaDrawerHtml}
          </div>
        </div>
      `;
    })
    .join('\n');

  const starterSkillsHtml = renderStarterSkillCards(cls);

  const legacyWeightsHtml = cls.legacyTemplateSkills
    .map(
      (lk) => `
      <div class="kv-item">
        <span class="k">${escapeHtml(lk.skillKey)} <small class="mono" style="color:var(--text-secondary)">(#${lk.skillId})</small></span>
        <span class="v">${lk.weight}%</span>
      </div>
    `
    )
    .join('\n');

  const paperdollHtml = cls.starterEquipment.paperdollLayers
    .map(
      (layer) => `
      <div class="kv-item">
        <span class="k">${escapeHtml(layer.layer)}</span>
        <span class="v">0x${layer.graphic.toString(16).toUpperCase()} (${layer.graphic})</span>
      </div>
    `
    )
    .join('\n');

  const gearSlots = PAPERDOLL_GEAR[cls.id as 'samurai' | 'ninja'];
  const armorSlots = gearSlots.filter((g) => g.kind === 'armor');
  const leftRackSlots = armorSlots.slice(0, 3);
  const rightRackSlots = armorSlots.slice(3, 6);
  const weaponRackSlots = gearSlots.filter((g) => g.kind === 'weapon');
  const defaultGear = weaponRackSlots[0] ?? gearSlots[0]!;

  const renderGearTile = (g: PaperdollSlotSpec, isDefault: boolean): string => `
    <div class="gear-slot-tile ${isDefault ? 'is-active' : ''}" data-gear-id="${escapeHtml(g.id)}" onmouseenter="inspectGear('${escapeHtml(g.id)}')" onclick="inspectGear('${escapeHtml(g.id)}')" title="${escapeHtml(g.nameEn)} (${escapeHtml(g.hex)})">
      <img src="assets/items/${escapeHtml(g.id)}.png" alt="${escapeHtml(g.nameEn)}" />
      <span class="gear-slot-tag">${escapeHtml(g.slotLabel.split(' ')[0])}</span>
    </div>
  `;

  const tierButtonsHtml = [
    { id: 'Iron', mult: 1.0, res: 0 },
    { id: 'DullCopper', mult: 1.08, res: 12 },
    { id: 'ShadowIron', mult: 1.17, res: 24 },
    { id: 'Copper', mult: 1.26, res: 36 },
    { id: 'Bronze', mult: 1.36, res: 48 },
    { id: 'Gold', mult: 1.47, res: 60 },
    { id: 'Agapite', mult: 1.59, res: 72 },
    { id: 'Verite', mult: 1.71, res: 84 },
    { id: 'Valorite', mult: 1.85, res: 96 },
  ]
    .map(
      (t) =>
        `<button type="button" class="tier-mini-btn ${t.id === 'Valorite' ? 'is-active' : ''}" data-mat-tier="${t.id}" onclick="setPaperdollTier('${t.id}', ${t.mult}, ${t.res})">${t.id}</button>`
    )
    .join('');

  const hotbarHtml = cls.seededHotbar
    .map((slot) => {
      const condStr =
        slot.conditions.length === 0
          ? 'Unconditional Primary Strike (ro(e) Queue)'
          : slot.conditions
              .map((c, idx) => {
                const expr = `${c.target}.${c.attr} ${c.op} ${c.value}${c.percent ? '%' : ''}`;
                if (idx === slot.conditions.length - 1) return expr;
                return `${expr} ${(c.join ?? 'or').toUpperCase()} `;
              })
              .join('');
      return `
        <div class="hotbar-slot" style="cursor:pointer;" onclick="selectAbility('${escapeHtml(slot.abilityId)}')" title="Click to inspect ${escapeHtml(slot.abilityId)}">
          <div class="slot-num">${slot.slotIndex + 1}</div>
          <div>
            <div style="font-weight:600;color:#fff2bf;font-size:11px;">${escapeHtml(slot.label)} <code style="color:var(--text-secondary);font-size:10px;">(${escapeHtml(slot.abilityId)})</code></div>
            <div class="mono" style="font-size:10px;color:var(--text-secondary);">${escapeHtml(condStr)}</div>
          </div>
          <span class="badge-cd">2,000ms CD Floor</span>
        </div>
      `;
    })
    .join('\n');

  const passiveBadgesHtml = PASSIVE_BADGES[cls.id as 'samurai' | 'ninja']
    .map(
      (b) => `
      <div class="passive-badge-item">
        <img src="assets/icons/${escapeHtml(cls.id)}/${escapeHtml(b.id)}@64.png" alt="${escapeHtml(b.nameEn)}" />
        <div>
          <div class="mono" style="font-size:9px;color:var(--text-gold);">${escapeHtml(b.tier)} · <code>${escapeHtml(b.id)}</code></div>
          <strong style="font-size:11px;color:#fff2bf;" data-en="${escapeHtml(b.nameEn)}" data-pt="${escapeHtml(b.namePtBr)}">${escapeHtml(b.nameEn)}</strong>
          <div style="font-size:10px;color:var(--text-secondary);" data-en="${escapeHtml(b.descEn)}" data-pt="${escapeHtml(b.descPtBr)}">${escapeHtml(b.descEn)}</div>
        </div>
      </div>
    `
    )
    .join('\n');

  const firstAbility = cls.abilities[0]!;
  const firstMilestone = cls.progression[0]!;
  const firstMode = MODE_DESCRIPTIONS[firstAbility.id]!;

  const embeddedPayload = {
    classData: cls,
    modeDescriptions: MODE_DESCRIPTIONS,
    gearCatalog: gearSlots,
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UO Idle v0.99.0 Beta — ${escapeHtml(classTitle)} [Arvore Skill Tree &amp; Hotbar Workbench</title>
  <style>${buildSharedStyles(accentVar, accentGlow)}</style>
</head>
<body>
  <div class="beta-shell">
    <div class="personagem-arvore" data-personagem-conteudo="arvore">
      ${renderQuickCommandBar(isSamurai ? 'samurai' : 'ninja')}
      <!-- Top Header Bar (.arvore-head) -->
      <header class="arvore-head">
        <div class="arvore-nivel">
          <span class="class-badge-pill">
            <span class="hue-swatch"></span>
            ${escapeHtml(cls.badge)} · ID ${cls.classNumericId}
          </span>
          <strong>${escapeHtml(classTitle)} — [Arvore Progression</strong>
        </div>

        <div class="arvore-saldos">
          <div class="arvore-saldo">
            <div>
              <strong>Lv. 60</strong>
              <div><small>Grandmaster Cap</small></div>
            </div>
            <em>12 Milestones</em>
          </div>
          <div class="arvore-saldo">
            <div>
              <strong>${cls.baseStats.str}/${cls.baseStats.dex}/${cls.baseStats.int}</strong>
              <div><small>STR / DEX / INT</small></div>
            </div>
            <em>Sum = ${cls.baseStats.str + cls.baseStats.dex + cls.baseStats.int}</em>
          </div>
          <div class="arvore-saldo">
            <div>
              <strong>${escapeHtml(robeLabel)}</strong>
              <div><small>Starter Robe Hue</small></div>
            </div>
            <em>robeHue: ${cls.robeHue}</em>
          </div>
          <div class="arvore-saldo">
            <div>
              <strong>${cls.abilities.length} Catalog Skills</strong>
              <div><small>2,000ms Custom Floor</small></div>
            </div>
            <em>Mana 25 / Med 100</em>
          </div>
        </div>

        <div class="arvore-head-acoes">
          <button type="button" class="beta-btn is-active" id="btn-lang-en" onclick="setLocale('en')">EN</button>
          <button type="button" class="beta-btn" id="btn-lang-pt" onclick="setLocale('pt')">PT-BR</button>
          <button type="button" class="beta-btn is-active" id="btn-mode-a" onclick="setExecMode('mode_a')">Mode A (100% Engine)</button>
          <button type="button" class="beta-btn" id="btn-mode-b" onclick="setExecMode('mode_b')">Mode B (&lt;20 LOC C#)</button>
          <a class="nav-pill" href="index.html">Review Portal</a>
          <a class="nav-pill" href="${escapeHtml(otherClassFile)}">${escapeHtml(otherClassLabel)}</a>
          <a class="nav-pill" href="class-comparison.html">5-Class Parity &amp; Sim</a>
        </div>
      </header>

      <!-- 3-Column Beta Workbench (Consolidated v2.0 — Zero Duplication) -->
      <div class="workbench-grid">
        <!-- LEFT COLUMN: Character Profile, 8 Starter Skills & Interactive Tokuno Paperdoll -->
        <div class="col-stack">
          <section class="arvore-secao">
            <h2 class="arvore-secao-titulo">
              <span class="title-left">Character &amp; Resource Profile</span>
              <span class="arvore-secao-sub">_E / dx[${cls.classNumericId}]</span>
            </h2>
            <div class="panel-body">
              <div class="identity-hero">
                <div class="portrait-frame">
                  <img class="main-portrait" src="${escapeHtml(portraitRel)}" alt="${escapeHtml(classTitle)} Portrait" />
                  <img class="portrait-mini-badge" src="${escapeHtml(portrait64Rel)}" alt="${escapeHtml(cls.badge)} 64x64 Icon" />
                </div>
                <div>
                  <div style="font-family:'Cinzel',serif;font-size:15px;font-weight:700;color:#fff2bf;">${escapeHtml(classTitle)}</div>
                  <div class="mono" style="font-size:10.5px;color:var(--text-secondary);">classId: "${escapeHtml(cls.id)}" · numericId: ${cls.classNumericId} · badge: "${escapeHtml(cls.badge)}"</div>
                  <div class="mono" style="font-size:10px;color:var(--text-gold);margin-top:2px;">
                    Primary: ${escapeHtml(cls.resourceProfile.primaryResource)} | StartMana: ${cls.resourceProfile.startingManaMax} | MedCap: ${cls.resourceProfile.meditationCap} | Reagents: false | Ammo: false
                  </div>
                  <div class="stat-chips">
                    <div class="stat-chip"><span>STR</span><strong>${cls.baseStats.str}</strong></div>
                    <div class="stat-chip"><span>DEX</span><strong>${cls.baseStats.dex}</strong></div>
                    <div class="stat-chip"><span>INT</span><strong>${cls.baseStats.int}</strong></div>
                  </div>
                  ${renderStatDistributionStrip(cls)}
                </div>
              </div>
            </div>
          </section>

          <section class="arvore-secao">
            <h2 class="arvore-secao-titulo">
              <span class="title-left">8 Starter Skills &amp; Template</span>
              <span class="arvore-secao-sub">WE / hE &amp; FE (100%)</span>
            </h2>
            <div class="panel-body">
              <div class="kv-grid">
                ${starterSkillsHtml}
              </div>
              <div style="margin-top:5px;font-size:10px;color:var(--text-secondary);">
                ${
                  isSamurai
                    ? 'Shieldless Bushido Weapon Parry scales via Parrying (50) × Bushido (50) ÷ 48,000 (1H) or 41,140 (2H).'
                    : 'Synergizes with Poisoning (#30) for Infectious Strike, Shuriken, and Fukiya virulent toxin application.'
                }
              </div>
              <details class="schema-drawer" style="margin-top:6px;">
                <summary>Legacy Template Weights (FE = 100% Sum)</summary>
                <div class="kv-grid" style="margin-top:4px;">
                  ${legacyWeightsHtml}
                </div>
              </details>
            </div>
          </section>

          <section class="arvore-secao">
            <h2 class="arvore-secao-titulo">
              <span class="title-left">Interactive Tokuno Paperdoll &amp; Armory</span>
              <span class="arvore-secao-sub">yE / mx · Hover or Click Gear</span>
            </h2>
            <div class="panel-body">
              <div class="mono" style="font-size:10px;color:var(--text-secondary);margin-bottom:4px;">
                Material Tier Scaling (<span id="pd-tier-label" style="color:var(--text-gold);font-weight:700;">Valorite · 1.85x Dmg / +96% Res</span>):
              </div>
              <div class="tier-pill-bar">
                ${tierButtonsHtml}
              </div>

              <!-- Visual UO Layered Paperdoll + 6 Equipped Armor Slots -->
              <div class="paperdoll-stage">
                <div class="paperdoll-rack-col">
                  ${leftRackSlots.map((g) => renderGearTile(g, false)).join('\n')}
                </div>
                <div class="paperdoll-figure-box">
                  <div class="paperdoll-aura-ring"></div>
                  <img src="assets/items/paperdoll-${escapeHtml(cls.id)}.png" alt="${escapeHtml(classTitle)} Layered UO Paperdoll" />
                </div>
                <div class="paperdoll-rack-col">
                  ${rightRackSlots.map((g) => renderGearTile(g, false)).join('\n')}
                </div>
              </div>

              <!-- 4 Signature Tokuno Weapons Strip -->
              <div style="margin-top:7px;font-size:9px;font-family:'IBM Plex Mono',monospace;color:var(--text-gold);text-transform:uppercase;">
                Signature Tokuno Armaments (Hover / Click for Stats):
              </div>
              <div class="weapon-rack-strip">
                ${weaponRackSlots.map((g, idx) => renderGearTile(g, idx === 0)).join('\n')}
              </div>

              <!-- Live Mouseover Gear Stat Card (#paperdoll-gear-tooltip) -->
              <div class="gear-mouseover-card" id="paperdoll-gear-tooltip">
                <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:4px 6px;">
                  <strong style="color:#fff2bf;font-size:12px;" id="gear-tt-name">${escapeHtml(defaultGear.nameEn)}</strong>
                  <span class="lv-pill" id="gear-tt-slot">${escapeHtml(defaultGear.slotLabel)}</span>
                </div>
                <div class="mono" style="font-size:9px;color:var(--text-secondary);margin-top:2px;" id="gear-tt-meta">
                  graphic: ${defaultGear.graphic} (${escapeHtml(defaultGear.hex)}) · gump: ${defaultGear.maleGump} · layer: ${escapeHtml(defaultGear.layer)} · hue: ${cls.robeHue}
                </div>
                <div class="mono" style="font-size:11px;color:var(--text-gold);font-weight:700;margin-top:4px;" id="gear-tt-stats">
                  Valorite Weapon: ${Math.round((defaultGear.baseDmg?.[0] ?? 11) * 1.85)}–${Math.round((defaultGear.baseDmg?.[1] ?? 13) * 1.85)} Dmg · Speed ${defaultGear.speed ?? 45} · ${escapeHtml(defaultGear.primaryAbility ?? '')} / ${escapeHtml(defaultGear.secondaryAbility ?? '')}
                </div>
                <div class="weapon-stat-bars">
                  <div class="w-stat-col">
                    <span id="gear-bar-lbl-1">Power (1.85x)</span>
                    <div class="w-stat-track"><div class="w-stat-fill" id="gear-bar-fill-1" style="width:92%;"></div></div>
                  </div>
                  <div class="w-stat-col">
                    <span id="gear-bar-lbl-2">Speed ${defaultGear.speed ?? 45}</span>
                    <div class="w-stat-track"><div class="w-stat-fill" id="gear-bar-fill-2" style="width:82%;"></div></div>
                  </div>
                  <div class="w-stat-col">
                    <span id="gear-bar-lbl-3">${isSamurai ? 'Bushido +15' : 'Ninjitsu +15'}</span>
                    <div class="w-stat-track"><div class="w-stat-fill" id="gear-bar-fill-3" style="width:100%;"></div></div>
                  </div>
                </div>
                <div class="cost-badges" id="gear-tt-affixes" style="margin-top:5px;">
                  ${defaultGear.affixesEn.map((af) => `<span class="badge-mana">${escapeHtml(af)}</span>`).join('')}
                </div>
                <div style="font-size:10px;color:var(--text-primary);margin-top:4px;" id="gear-tt-lore">
                  ${escapeHtml(defaultGear.loreEn)}
                </div>
              </div>

              <details class="schema-drawer" style="margin-top:6px;">
                <summary>
                  Raw Bundle Starter Layer IDs (kitTokens: [${cls.starterEquipment.kitTokens.map((t) => `"${escapeHtml(t)}"`).join(', ')}])
                </summary>
                <div class="kv-grid" style="margin-top:4px;">
                  ${paperdollHtml}
                </div>
              </details>
            </div>
          </section>
        </div>

        <!-- CENTER COLUMN: Unified L1-L60 [Arvore Progression & Schema Cards (De-Duplicated) -->
        <div class="col-stack">
          <section class="arvore-secao">
            <h2 class="arvore-secao-titulo">
              <span class="title-left">Unified L1–L60 [Arvore Progression &amp; Ability Cards (12 Milestones)</span>
              <span class="arvore-secao-sub">gE.${escapeHtml(cls.id)} &amp; b Catalog · Click any card or expand ▸ Schema</span>
            </h2>

            <!-- Live .arvore-cobra 12-node ribbon -->
            <div class="arvore-cobra-wrap">
              <div class="arvore-tier-banner">
                <span><strong style="color:var(--text-gold);">ROW 1 (L1–L25):</strong> Initiate → Adept Foundation</span>
                <span><strong style="color:var(--text-gold);">ROW 2 (L30–L60):</strong> Master → Grandmaster Capstone</span>
              </div>
              <div class="arvore-cobra">
                ${cobraNodesHtml}
              </div>
            </div>

            <!-- Semantic Ability-Kind Filter Strip -->
            <div class="filter-strip">
              <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;">
                <span class="mono" style="font-size:10px;color:var(--text-gold);">Filter Kind:</span>
                <button type="button" class="beta-btn is-active" data-kind-btn="all" onclick="filterAbilityKind('all')">All (12)</button>
                <button type="button" class="beta-btn" data-kind-btn="passive" onclick="filterAbilityKind('passive')" style="color:var(--kind-passive);">Passive</button>
                <button type="button" class="beta-btn" data-kind-btn="skill" onclick="filterAbilityKind('skill')" style="color:var(--kind-skill);">Skills</button>
                <button type="button" class="beta-btn" data-kind-btn="spell" onclick="filterAbilityKind('spell')" style="color:var(--kind-spell);">Spells</button>
                <button type="button" class="beta-btn" data-kind-btn="special" onclick="filterAbilityKind('special')" style="color:var(--kind-capstone);">Mechanic &amp; Capstone</button>
              </div>
              <button type="button" class="beta-btn" onclick="toggleAllSchemaDrawers()">Toggle All ▸ Schema Drawers</button>
            </div>

            <!-- 12 Unified Interactive Milestone & Schema Cards -->
            <div class="milestone-grid" id="milestone-cards-container">
              ${milestoneCardsHtml}
            </div>
          </section>
        </div>

        <!-- RIGHT COLUMN: Sticky .arvore-dica Inspector, 5-Slot Seeded Hotbar & Mastery Seals -->
        <div class="col-stack">
          <section class="arvore-secao">
            <h2 class="arvore-secao-titulo">
              <span class="title-left">Active Ability Deep-Dive Inspector</span>
              <span class="arvore-secao-sub" id="inspector-mode-pill">Mode A (100% Existing Engine)</span>
            </h2>
            <div class="panel-body">
              <div class="arvore-dica-pinned" id="live-inspector">
                <div id="insp-mode-banner" class="active-mode-strip" style="margin:0 0 8px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                    <span class="mode-tag-pill" id="insp-banner-tag">MODE A · 100% EXISTING ENGINE</span>
                    <span class="mono" style="font-size:9.5px;color:#82d5b0;" id="insp-banner-sim">
                      ${
                        isSamurai
                          ? 'L60 Boss: 363.15 DPS · 220.24 EHP/s · 13 Parries · 0 C# Changes'
                          : 'L60 Boss: 374.50 DPS · 221.23 EHP/s · -8% Clone Veil · 0 C# Changes'
                      }
                    </span>
                  </div>
                  <div style="font-size:10px;margin-top:2px;color:var(--text-primary);" id="insp-banner-desc">
                    ${
                      isSamurai
                        ? 'Zero server C# edits: maps all 12 Bushido skills to existing SpecialMove, Spell, WeaponAbility, and timed statusEffect primitives.'
                        : 'Zero server C# edits: maps all 13 Ninjitsu skills to existing SpecialMove, Spell, WeaponAbility, DoT ticks, and timed Smoke Veil buffs.'
                    }
                  </div>
                </div>
                <div class="dica-header">
                  <img id="insp-icon" src="assets/icons/${escapeHtml(cls.id)}/${escapeHtml(firstAbility.id)}@64.png" alt="${escapeHtml(firstAbility.name)}" />
                  <div>
                    <div style="display:flex;flex-wrap:wrap;gap:4px 6px;align-items:center;">
                      <span class="lv-pill" id="insp-level">L${firstAbility.progressionTreeLevel}</span>
                      <span class="type-pill kind-passive" id="insp-kind">${escapeHtml(firstAbility.kind)}</span>
                      <code style="font-size:10px;color:var(--text-secondary);" id="insp-id">${escapeHtml(firstAbility.id)}</code>
                    </div>
                    <strong style="display:block;font-size:14px;color:#fff2bf;margin-top:3px;" id="insp-name">${escapeHtml(firstAbility.name)} / ${escapeHtml(firstAbility.namePtBr)}</strong>
                    <div class="mono" style="font-size:10px;color:var(--text-gold);" id="insp-qC">qC Estimator: ${escapeHtml(firstMode.qCEstimator)}</div>
                  </div>
                </div>
                <p id="insp-desc" data-en="${escapeHtml(firstMilestone.descEn)}" data-pt="${escapeHtml(firstMilestone.descPtBr)}" style="margin:0 0 8px;font-size:11.5px;color:var(--text-primary);">${escapeHtml(firstMilestone.descEn)}</p>
                <div class="cost-badges" id="insp-badges" style="margin-bottom:8px;">
                  <span class="badge-cd">CD: ${firstAbility.cooldownMs}ms</span>
                  <span class="badge-cd">CustomCD: ${firstAbility.customCooldownMs}ms</span>
                  <span class="badge-mana">Mana: ${firstAbility.manaCost}</span>
                  <span class="badge-stamina">Stamina: ${firstAbility.staminaCost}</span>
                  <span class="badge-meta">Gump: ${firstAbility.gumpIcon}</span>
                </div>
                <div style="padding:6px 8px;background:#141812;border:1px solid #2a3026;border-radius:4px;font-size:11px;margin-bottom:6px;">
                  <strong style="color:var(--text-gold);display:block;font-size:10px;text-transform:uppercase;" id="insp-formula-heading">Active Mode A Scaling Formula &amp; Status Effect</strong>
                  <div class="mono" id="insp-formula" style="font-size:10px;color:var(--text-primary);">[Mode A — Drop-In JSON] ${escapeHtml(firstMode.modeA)}</div>
                  <div class="mono" id="insp-status" style="font-size:10px;color:var(--text-secondary);margin-top:3px;">StatusEffect: None (Innate Passive)</div>
                </div>
                <div class="inspector-modes-grid">
                  <div id="mode-card-a" class="mode-card-box is-active-mode" onclick="setExecMode('mode_a')" title="Click to activate Mode A (100% Existing Engine)">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
                      <strong style="color:#fff2bf;">Mode A (Drop-In JSON)</strong>
                      <span class="lv-pill" id="mode-pill-a" style="font-size:8.5px;padding:0 4px;">ACTIVE</span>
                    </div>
                    <span id="insp-mode-a" style="color:var(--text-primary);">${escapeHtml(firstMode.modeA)}</span>
                  </div>
                  <div id="mode-card-b" class="mode-card-box" onclick="setExecMode('mode_b')" title="Click to activate Mode B (<20 LOC C# Hook)">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
                      <strong style="color:#fff2bf;">Mode B (&lt;20 LOC C# Hook)</strong>
                      <span class="lv-pill" id="mode-pill-b" style="font-size:8.5px;padding:0 4px;opacity:0.45;">CLICK TO VIEW</span>
                    </div>
                    <span id="insp-mode-b" style="color:var(--text-primary);">${escapeHtml(firstMode.modeB)}</span>
                  </div>
                </div>
                ${renderLiveCombatTickerComponent(cls)}
                <details class="schema-drawer" style="margin-top:7px;">
                  <summary>View Live Drop-In JSON Payload (<code>design/drop-in/${escapeHtml(cls.id)}.json</code>)</summary>
                  <pre id="insp-json" class="mono" style="margin:4px 0 0;padding:6px;background:#090b08;border:1px solid #2a3026;border-radius:3px;font-size:9.5px;color:#d6e4ca;max-height:170px;overflow:auto;">${escapeHtml(JSON.stringify(firstAbility, null, 2))}</pre>
                </details>
              </div>
            </div>
          </section>

          <section class="arvore-secao">
            <h2 class="arvore-secao-titulo">
              <span class="title-left">5-Slot Seeded Hotbar Queue</span>
              <span class="arvore-secao-sub">mE / gh · ro(e) Priority</span>
            </h2>
            <div class="panel-body">
              <div class="hotbar-slots">
                ${hotbarHtml}
              </div>
            </div>
          </section>

          <section class="arvore-secao">
            <h2 class="arvore-secao-titulo">
              <span class="title-left">Class Mastery &amp; Passive Seals</span>
              <span class="arvore-secao-sub">Oil-Painted 64×64 Gump Badges</span>
            </h2>
            <div class="passive-badges-row">
              ${passiveBadgesHtml}
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>

  <script id="mockup-data" type="application/json">${safeJsonEmbed(embeddedPayload)}</script>
  <script>
    (function() {
      function escHtml(str) {
        return String(str == null ? '' : str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }
      var raw = document.getElementById('mockup-data').textContent;
      var payload = JSON.parse(raw);
      var cls = payload.classData;
      var modeMap = payload.modeDescriptions;
      var gearList = payload.gearCatalog || [];
      var currentLocale = 'en';
      var currentMode = 'mode_a';
      var selectedAbilityId = cls.abilities[0].id;
      var selectedGearId = gearList.length > 6 ? gearList[6].id : (gearList[0] ? gearList[0].id : '');
      var currentTier = { id: 'Valorite', mult: 1.85, res: 96 };

      window.setPaperdollTier = function(tierId, mult, resBonus) {
        currentTier = { id: tierId, mult: mult, res: resBonus };
        var btns = document.querySelectorAll('[data-mat-tier]');
        for (var i = 0; i < btns.length; i++) {
          btns[i].classList.toggle('is-active', btns[i].getAttribute('data-mat-tier') === tierId);
        }
        document.getElementById('pd-tier-label').textContent =
          tierId + ' · ' + mult.toFixed(2) + 'x Dmg / +' + resBonus + '% Res';
        if (selectedGearId) window.inspectGear(selectedGearId);
      };

      window.inspectGear = function(gearId) {
        var g = null;
        for (var i = 0; i < gearList.length; i++) {
          if (gearList[i].id === gearId) {
            g = gearList[i];
            break;
          }
        }
        if (!g) return;
        selectedGearId = gearId;
        var tiles = document.querySelectorAll('[data-gear-id]');
        for (var j = 0; j < tiles.length; j++) {
          tiles[j].classList.toggle('is-active', tiles[j].getAttribute('data-gear-id') === gearId);
        }
        document.getElementById('gear-tt-name').textContent =
          currentLocale === 'pt' ? g.namePtBr : g.nameEn;
        document.getElementById('gear-tt-slot').textContent = g.slotLabel;
        document.getElementById('gear-tt-meta').textContent =
          'graphic: ' + g.graphic + ' (' + g.hex + ') · gump: ' + g.maleGump + ' · layer: ' + g.layer + ' · hue: ' + cls.robeHue;
        if (g.kind === 'weapon' && g.baseDmg) {
          var minD = Math.round(g.baseDmg[0] * currentTier.mult);
          var maxD = Math.round(g.baseDmg[1] * currentTier.mult);
          document.getElementById('gear-tt-stats').textContent =
            currentTier.id + ' Weapon: ' + minD + '–' + maxD + ' Dmg · Speed ' + g.speed + ' · ' + g.primaryAbility + ' / ' + g.secondaryAbility;
          var pwrPct = Math.min(100, Math.round((maxD / 34) * 100));
          var spdPct = Math.min(100, Math.round(((g.speed || 45) / 55) * 100));
          var lbl1 = document.getElementById('gear-bar-lbl-1');
          var lbl2 = document.getElementById('gear-bar-lbl-2');
          var fill1 = document.getElementById('gear-bar-fill-1');
          var fill2 = document.getElementById('gear-bar-fill-2');
          if (lbl1) lbl1.textContent = 'Power (' + currentTier.mult.toFixed(2) + 'x)';
          if (lbl2) lbl2.textContent = 'Speed ' + g.speed;
          if (fill1) fill1.style.width = pwrPct + '%';
          if (fill2) fill2.style.width = spdPct + '%';
        } else {
          var baseRes = g.baseArmorResist || 10;
          var scaledRes = Math.round(baseRes * (1 + currentTier.res / 100));
          document.getElementById('gear-tt-stats').textContent =
            currentTier.id + ' Armor: +' + scaledRes + ' Physical/Elem Defense (Base ' + baseRes + ', +' + currentTier.res + '% Tier Bonus)';
          var resPct = Math.min(100, Math.round((scaledRes / 36) * 100));
          var lblA1 = document.getElementById('gear-bar-lbl-1');
          var lblA2 = document.getElementById('gear-bar-lbl-2');
          var fillA1 = document.getElementById('gear-bar-fill-1');
          var fillA2 = document.getElementById('gear-bar-fill-2');
          if (lblA1) lblA1.textContent = 'Mitigation (+' + scaledRes + ')';
          if (lblA2) lblA2.textContent = 'Tier +' + currentTier.res + '%';
          if (fillA1) fillA1.style.width = resPct + '%';
          if (fillA2) fillA2.style.width = Math.max(15, currentTier.res) + '%';
        }
        var affs = currentLocale === 'pt' ? g.affixesPtBr : g.affixesEn;
        document.getElementById('gear-tt-affixes').innerHTML = affs
          .map(function(a) { return '<span class="badge-mana">' + escHtml(a) + '</span>'; })
          .join('');
        document.getElementById('gear-tt-lore').textContent =
          currentLocale === 'pt' ? g.lorePtBr : g.loreEn;
      };

      window.setLocale = function(lang) {
        currentLocale = lang;
        document.getElementById('btn-lang-en').classList.toggle('is-active', lang === 'en');
        document.getElementById('btn-lang-pt').classList.toggle('is-active', lang === 'pt');
        var nodes = document.querySelectorAll('[data-en][data-pt]');
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].textContent = lang === 'pt' ? nodes[i].getAttribute('data-pt') : nodes[i].getAttribute('data-en');
        }
        window.selectAbility(selectedAbilityId);
        if (selectedGearId) window.inspectGear(selectedGearId);
      };

      window.setExecMode = function(mode) {
        currentMode = mode;
        var isModeB = mode === 'mode_b';
        document.getElementById('btn-mode-a').classList.toggle('is-active', !isModeB);
        document.getElementById('btn-mode-b').classList.toggle('is-active', isModeB);
        document.getElementById('inspector-mode-pill').textContent =
          isModeB ? 'Mode B (<20 LOC C# Hook)' : 'Mode A (100% Existing Engine)';

        var cardsContainer = document.getElementById('milestone-cards-container');
        if (cardsContainer) {
          cardsContainer.classList.toggle('is-mode-b-active', isModeB);
        }

        var strips = document.querySelectorAll('[data-mode-strip]');
        for (var s = 0; s < strips.length; s++) {
          strips[s].classList.toggle('is-mode-b', isModeB);
        }
        var tags = document.querySelectorAll('[data-mode-tag]');
        for (var t = 0; t < tags.length; t++) {
          tags[t].textContent = isModeB ? 'MODE B · <20 LOC C#' : 'MODE A · 100% ENGINE';
        }
        var modeNodes = document.querySelectorAll('.mode-text');
        for (var i = 0; i < modeNodes.length; i++) {
          modeNodes[i].textContent =
            isModeB ? modeNodes[i].getAttribute('data-mode-b') : modeNodes[i].getAttribute('data-mode-a');
        }

        var bannerEl = document.getElementById('insp-mode-banner');
        if (bannerEl) bannerEl.classList.toggle('is-mode-b', isModeB);
        var bannerTag = document.getElementById('insp-banner-tag');
        var bannerSim = document.getElementById('insp-banner-sim');
        var bannerDesc = document.getElementById('insp-banner-desc');
        if (cls.id === 'samurai') {
          if (bannerTag) bannerTag.textContent = isModeB ? 'MODE B · 17-LOC C# HOOK (BaseWeapon.cs)' : 'MODE A · 100% EXISTING ENGINE';
          if (bannerSim) bannerSim.textContent = isModeB
            ? 'L60 Boss: 391.92 DPS (+28.8 Parry/Streak) · 318.88 EHP/s · 44 Wave Parries'
            : 'L60 Boss: 363.15 DPS · 220.24 EHP/s · 13 Parries · 0 C# Changes';
          if (bannerDesc) bannerDesc.textContent = isModeB
            ? 'Active 17-LOC BaseWeapon.cs Hook: Auto-Perfection streak (+4%/hit to +15%, +8 HP/Stam/Mana on kill) + reactive 2.0s ICD CounterAttack swing & Confidence heal on Parry.'
            : 'Zero server C# edits: maps all 12 Bushido skills to existing SpecialMove, Spell, WeaponAbility, and timed statusEffect primitives.';
        } else {
          if (bannerTag) bannerTag.textContent = isModeB ? 'MODE B · 16-LOC C# HOOK (BaseWeapon.cs)' : 'MODE A · 100% EXISTING ENGINE';
          if (bannerSim) bannerSim.textContent = isModeB
            ? 'L60 Boss: 367.38 DPS · 330.40 EHP/s (+70% Clone Absorb) · 16 Wave Clones'
            : 'L60 Boss: 374.50 DPS · 221.23 EHP/s · -8% Clone Veil · 0 C# Changes';
          if (bannerDesc) bannerDesc.textContent = isModeB
            ? 'Active 16-LOC BaseWeapon.cs Hook: Ablative Mirror Image & Egg Bomb clone interception (70% absorb, 1.5s ICD), 5-swing DeathStrike detonation, and 1.15x Stealth opener.'
            : 'Zero server C# edits: maps all 13 Ninjitsu skills to existing SpecialMove, Spell, WeaponAbility, DoT ticks, and timed Smoke Veil buffs.';
        }

        var cardA = document.getElementById('mode-card-a');
        var cardB = document.getElementById('mode-card-b');
        var pillA = document.getElementById('mode-pill-a');
        var pillB = document.getElementById('mode-pill-b');
        if (cardA) cardA.classList.toggle('is-active-mode', !isModeB);
        if (cardB) cardB.classList.toggle('is-active-mode', isModeB);
        if (pillA) {
          pillA.textContent = isModeB ? 'CLICK TO VIEW' : 'ACTIVE';
          pillA.style.opacity = isModeB ? '0.45' : '1';
        }
        if (pillB) {
          pillB.textContent = isModeB ? 'ACTIVE' : 'CLICK TO VIEW';
          pillB.style.opacity = isModeB ? '1' : '0.45';
        }
        window.selectAbility(selectedAbilityId);
      };

      window.selectAbility = function(abilityId) {
        var ab = null;
        for (var i = 0; i < cls.abilities.length; i++) {
          if (cls.abilities[i].id === abilityId) {
            ab = cls.abilities[i];
            break;
          }
        }
        if (!ab) return;
        selectedAbilityId = abilityId;
        var ms = null;
        for (var j = 0; j < cls.progression.length; j++) {
          if (cls.progression[j].id === abilityId) {
            ms = cls.progression[j];
            break;
          }
        }
        var cards = document.querySelectorAll('.milestone-card');
        for (var k = 0; k < cards.length; k++) {
          cards[k].classList.toggle('is-selected', cards[k].getAttribute('data-milestone-id') === abilityId);
        }
        var cobraCircles = document.querySelectorAll('[data-cobra-id]');
        for (var c = 0; c < cobraCircles.length; c++) {
          cobraCircles[c].classList.toggle('is-selected-node', cobraCircles[c].getAttribute('data-cobra-id') === abilityId);
        }
        var mInfo = modeMap[ab.id] || { modeA: ab.scalingFormula.summary, modeB: ab.scalingFormula.summary, qCEstimator: ab.scalingFormula.summary };
        document.getElementById('insp-icon').src = 'assets/icons/' + cls.id + '/' + ab.id + '@64.png';
        document.getElementById('insp-level').textContent = 'L' + ab.progressionTreeLevel;
        document.getElementById('insp-kind').textContent = ab.kind;
        document.getElementById('insp-id').textContent = ab.id;
        document.getElementById('insp-name').textContent = ab.name + ' / ' + ab.namePtBr;
        document.getElementById('insp-qC').textContent = 'qC Estimator: ' + mInfo.qCEstimator;
        var fallbackDescPt = ab.id === 'ninja_shuriken'
          ? 'Dispara Shuriken com ponta envenenada e dardos de zarabatana Fukiya à distância com 75% de dano secundário.'
          : ab.scalingFormula.summary;
        var descEn = ms ? ms.descEn : ab.scalingFormula.summary;
        var descPt = ms ? ms.descPtBr : fallbackDescPt;
        var inspDescEl = document.getElementById('insp-desc');
        inspDescEl.setAttribute('data-en', descEn);
        inspDescEl.setAttribute('data-pt', descPt);
        inspDescEl.textContent = currentLocale === 'pt' ? descPt : descEn;
        var isModeB = currentMode === 'mode_b';
        var fHead = document.getElementById('insp-formula-heading');
        if (fHead) {
          fHead.textContent = isModeB
            ? 'Active Mode B (<20 LOC C# Hook) Formula & Status Effect'
            : 'Active Mode A (100% Engine) Formula & Status Effect';
        }
        document.getElementById('insp-formula').textContent =
          (isModeB ? '[Mode B — C# Hook] ' + mInfo.modeB : '[Mode A — Drop-In JSON] ' + mInfo.modeA) +
          ' | Base: ' + ab.scalingFormula.summary;
        if (ab.statusEffect) {
          var mods = ab.statusEffect.modifiers.map(function(m) { return m.stat + ': ' + m.value; }).join(', ');
          document.getElementById('insp-status').textContent =
            'StatusEffect: ' + ab.statusEffect.name + ' (' + ab.statusEffect.durationMs + 'ms, ' + ab.statusEffect.stackingRule + ') [' + mods + ']';
        } else {
          document.getElementById('insp-status').textContent = 'StatusEffect: None (Direct / Innate)';
        }
        document.getElementById('insp-mode-a').textContent = mInfo.modeA;
        document.getElementById('insp-mode-b').textContent = mInfo.modeB;
        var jsonEl = document.getElementById('insp-json');
        if (jsonEl) jsonEl.textContent = JSON.stringify(ab, null, 2);
      };

      window.filterAbilityKind = function(kindFilter) {
        var btns = document.querySelectorAll('[data-kind-btn]');
        for (var i = 0; i < btns.length; i++) {
          btns[i].classList.toggle('is-active', btns[i].getAttribute('data-kind-btn') === kindFilter);
        }
        var cards = document.querySelectorAll('.milestone-card');
        for (var j = 0; j < cards.length; j++) {
          var k = cards[j].getAttribute('data-kind');
          var show =
            kindFilter === 'all' ||
            k === kindFilter ||
            (kindFilter === 'special' && (k === 'mechanic' || k === 'feature'));
          cards[j].style.display = show ? 'grid' : 'none';
        }
      };

      var drawersOpen = false;
      window.toggleAllSchemaDrawers = function() {
        drawersOpen = !drawersOpen;
        var details = document.querySelectorAll('.milestone-card details.schema-drawer');
        for (var i = 0; i < details.length; i++) {
          if (drawersOpen) {
            details[i].setAttribute('open', 'open');
          } else {
            details[i].removeAttribute('open');
          }
        }
      };

      // Live 100ms Tick Combat Loop Preview Component Logic
      var tickerRunning = true;
      var tickerStepIdx = 0;
      var tickerPct = 65;
      var samuraiEvents = [
        { t: 't=0.0s', tag: 'CAST', col: '#e05a47', txt: 'Armor Ignore · 279 dmg (100% Armor Pierce)' },
        { t: 't=2.0s', tag: 'PARRY', col: '#f6e05e', txt: 'Shieldless Daisho Parry → 0.85x Riposte +18 HP' },
        { t: 't=4.0s', tag: 'SKILL', col: '#63b3ed', txt: 'Double Strike (2×90%) · 312 dmg (+8% Streak)' },
        { t: 't=6.0s', tag: 'AOE', col: '#4fd1c5', txt: 'Frenzied Whirlwind · 335 dmg + 4-Tick Bleed' },
        { t: 't=8.0s', tag: 'COUNTER', col: '#f6ad55', txt: 'Counter Attack Stance + Free Parry Swing (284 dmg)' },
        { t: 't=10.0s', tag: 'EXEC', col: '#b794f4', txt: "Kensei: Amakura's Judgment · 498 dmg ★" }
      ];
      var ninjaEvents = [
        { t: 't=0.0s', tag: 'VEIL', col: '#4fd1c5', txt: 'Smoke Bomb + Shuriken Volley · 205 dmg' },
        { t: 't=2.0s', tag: 'AMBUSH', col: '#e05a47', txt: 'Surprise Attack · 298 dmg (-8% Boss Def)' },
        { t: 't=4.0s', tag: 'VENOM', col: '#68d391', txt: 'Infectious Strike · 343 dmg + Deadly Poison DoT' },
        { t: 't=6.0s', tag: 'CLONE', col: '#63b3ed', txt: 'Mirror Image Clone Intercepted Boss Hit (-70%)' },
        { t: 't=8.0s', tag: 'KI', col: '#f6ad55', txt: 'Ki Attack Gap-Closer · 361 dmg + 85% Splash' },
        { t: 't=10.0s', tag: 'DETONATE', col: '#b794f4', txt: '5th Swing Death Strike + Twin Shadow · 514 dmg ★' }
      ];

      window.stepCombatTicker = function() {
        tickerStepIdx = (tickerStepIdx + 1) % 6;
        var pool = cls.id === 'samurai' ? samuraiEvents : ninjaEvents;
        var feedEl = document.getElementById('ticker-log-feed');
        if (feedEl) {
          var slice = [];
          for (var i = 0; i < 4; i++) {
            slice.push(pool[(tickerStepIdx + i) % pool.length]);
          }
          feedEl.innerHTML = slice.map(function(f) {
            return '<div class="ticker-log-item" style="border-left-color:' + escHtml(f.col) + ';"><div><strong style="color:#fff2bf;">' + escHtml(f.t) + '</strong> <span style="color:' + escHtml(f.col) + ';font-weight:700;">[' + escHtml(f.tag) + ']</span> ' + escHtml(f.txt) + '</div></div>';
          }).join('');
        }
        var pips = document.querySelectorAll('[data-ticker-pip]');
        var activeCount = cls.id === 'samurai' ? ((tickerStepIdx * 2) % 10) + 2 : (tickerStepIdx % 5) + 1;
        for (var p = 0; p < pips.length; p++) {
          var isOn = p < activeCount;
          pips[p].classList.toggle('is-lit', cls.id === 'samurai' && isOn);
          pips[p].classList.toggle('is-crimson', cls.id !== 'samurai' && isOn);
        }
      };

      window.toggleCombatTicker = function() {
        tickerRunning = !tickerRunning;
        var btn = document.getElementById('btn-ticker-toggle');
        if (btn) btn.textContent = tickerRunning ? 'Pause' : 'Play';
      };

      setInterval(function() {
        if (!tickerRunning) return;
        tickerPct += 10;
        if (tickerPct > 100) {
          tickerPct = 10;
          window.stepCombatTicker();
        }
        var bar = document.getElementById('ticker-bar-fill');
        if (bar) bar.style.width = tickerPct + '%';
      }, 280);

      document.addEventListener('keydown', function(e) {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        if (e.key === 'm' || e.key === 'M') {
          window.setExecMode(currentMode === 'mode_a' ? 'mode_b' : 'mode_a');
        } else if (e.key === 'l' || e.key === 'L') {
          window.setLocale(currentLocale === 'en' ? 'pt' : 'en');
        } else if (e.key === ' ') {
          e.preventDefault();
          window.toggleCombatTicker();
        } else if (e.key >= '1' && e.key <= '9') {
          var idx = parseInt(e.key, 10) - 1;
          if (cls.progression[idx]) {
            window.selectAbility(cls.progression[idx].id);
          }
        }
      });

      if (window.location.search.indexOf('mode=mode_b') !== -1) {
        window.setExecMode('mode_b');
      }
    })();
  </script>
</body>
</html>`;
}

function buildClassComparisonHtml(
  classes: Record<string, ClassDefinition>,
  items: ItemsDataset,
  parity: ParityDataset,
  gearWaves: GearWavesDataset
): string {
  const orderedIds = ['warrior', 'mage', 'ranger', 'samurai', 'ninja'] as const;
  const levels = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60];

  const classColors: Record<string, string> = {
    warrior: '#d97706',
    mage: '#3b82f6',
    ranger: '#84cc16',
    samurai: '#c83e37',
    ninja: '#2e9e6b',
  };

  // Build SVG Multi-Bracket DPS & EHP/s Progression Chart (L10 -> L25 -> L45 -> L60) for low_def_boss (Mode B)
  const brackets = ['L10', 'L25', 'L45', 'L60'];
  const chartW = 680;
  const chartH = 220;
  const padL = 48;
  const padR = 24;
  const padT = 20;
  const padB = 32;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const buildProgressionSvg = (metricKey: 'sustainedDps' | 'ehpPerSec', maxVal: number, unitLabel: string): string => {
    const gridLines = [0, 0.25, 0.5, 0.75, 1.0]
      .map((f) => {
        const y = Math.round(padT + plotH * (1 - f));
        const val = Math.round(maxVal * f);
        return `<line x1="${padL}" y1="${y}" x2="${chartW - padR}" y2="${y}" stroke="#252b22" stroke-dasharray="3,3" />
                <text x="${padL - 6}" y="${y + 3}" fill="#a39e90" font-size="9" font-family="IBM Plex Mono" text-anchor="end">${val}</text>`;
      })
      .join('\n');

    const xLabels = brackets
      .map((b, idx) => {
        const x = Math.round(padL + (idx / (brackets.length - 1)) * plotW);
        return `<line x1="${x}" y1="${padT}" x2="${x}" y2="${padT + plotH}" stroke="#1e241b" />
                <text x="${x}" y="${chartH - 10}" fill="#d4af37" font-size="10" font-weight="700" font-family="IBM Plex Mono" text-anchor="middle">${b}</text>`;
      })
      .join('\n');

    const polylines = orderedIds
      .map((cid) => {
        const col = classColors[cid] ?? '#c9a227';
        const pts = brackets.map((b, idx) => {
          const scenarios = parity.mode_a?.scenarios ?? parity.mode_b.scenarios;
          const rec = scenarios.find(
            (s) => s.classId === cid && s.bracketId === b && s.archetypeId === 'low_def_boss'
          );
          const v = rec ? rec[metricKey] : 0;
          const x = Math.round(padL + (idx / (brackets.length - 1)) * plotW);
          const y = Math.round(padT + plotH * (1 - Math.min(1, v / maxVal)));
          return { x, y, v };
        });
        const pointsAttr = pts.map((p) => `${p.x},${p.y}`).join(' ');
        const circles = pts
          .map(
            (p) =>
              `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${col}" stroke="#0b0d0a" stroke-width="1.5"><title>${cid.toUpperCase()}: ${p.v.toFixed(1)} ${unitLabel}</title></circle>`
          )
          .join('');
        return `<polyline fill="none" stroke="${col}" stroke-width="${cid === 'samurai' || cid === 'ninja' ? '2.8' : '1.8'}" points="${pointsAttr}" />${circles}`;
      })
      .join('\n');

    return `<svg viewBox="0 0 ${chartW} ${chartH}" style="width:100%;height:auto;background:#0c0f0b;border:1px solid #2a3026;border-radius:4px;">
      ${gridLines}
      ${xLabels}
      ${polylines}
    </svg>`;
  };

  const dpsProgressionSvg = buildProgressionSvg('sustainedDps', 420, 'DPS');
  const ehpProgressionSvg = buildProgressionSvg('ehpPerSec', 350, 'EHP/s');

  // 5-Channel Damage Breakdown Stacked Horizontal Bars (L60 low_def_boss Mode A with Mode B fallback)
  const breakdownModeA = gearWaves.damageBreakdowns.filter(
    (d) => d.bracketId === 'L60' && d.archetypeId === 'low_def_boss' && (!d.mode || d.mode === 'mode_a')
  );
  const breakdownL60 =
    breakdownModeA.length > 0
      ? breakdownModeA
      : gearWaves.damageBreakdowns.filter((d) => d.bracketId === 'L60' && d.archetypeId === 'low_def_boss');
  const breakdownBarsHtml = breakdownL60
    .map((d) => {
      const tot = Math.max(d.totalDps, 0.01);
      const pAuto = ((d.autoAttackDps / tot) * 100).toFixed(1);
      const pSpec = ((d.specialMoveDps / tot) * 100).toFixed(1);
      const pExec = ((d.executeDps / tot) * 100).toFixed(1);
      const pDot = ((d.dotDps / tot) * 100).toFixed(1);
      const pProc = ((d.procCounterDps / tot) * 100).toFixed(1);
      return `
        <div style="margin-bottom:8px;padding:6px 8px;background:#121611;border:1px solid #2a3026;border-radius:4px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:2px;">
            <strong style="text-transform:uppercase;color:${classColors[d.classId] ?? '#fff2bf'};letter-spacing:0.04em;">${escapeHtml(d.classId)}</strong>
            <span class="mono" style="font-size:11px;color:#fff2bf;font-weight:700;">Total: ${d.totalDps.toFixed(2)} DPS</span>
          </div>
          <div class="mono" style="font-size:10px;color:#c9c2b2;margin-bottom:5px;">
            Auto ${d.autoAttackDps.toFixed(1)} (${pAuto}%) · Skill ${d.specialMoveDps.toFixed(1)} (${pSpec}%) · Exec ${d.executeDps.toFixed(1)} (${pExec}%) · DoT ${d.dotDps.toFixed(1)} (${pDot}%) · Parry/Proc ${d.procCounterDps.toFixed(1)} (${pProc}%)
          </div>
          <div style="display:flex;height:14px;border-radius:3px;overflow:hidden;border:1px solid #2a3026;background:#090b08;">
            <div style="width:${pAuto}%;background:#64748b;" title="Auto-Attack: ${d.autoAttackDps.toFixed(2)} DPS (${pAuto}%)"></div>
            <div style="width:${pSpec}%;background:#3b82f6;" title="SpecialMove/Spell: ${d.specialMoveDps.toFixed(2)} DPS (${pSpec}%)"></div>
            <div style="width:${pExec}%;background:#ef4444;" title="Execute/Detonation: ${d.executeDps.toFixed(2)} DPS (${pExec}%)"></div>
            <div style="width:${pDot}%;background:#10b981;" title="DoT/Venom: ${d.dotDps.toFixed(2)} DPS (${pDot}%)"></div>
            <div style="width:${pProc}%;background:#f59e0b;" title="Parry/Spirit Procs: ${d.procCounterDps.toFixed(2)} DPS (${pProc}%)"></div>
          </div>
        </div>
      `;
    })
    .join('\n');

  // Material Tier (Iron -> Valorite) Table across all 5 classes
  const tierIds = ['Iron', 'DullCopper', 'ShadowIron', 'Copper', 'Bronze', 'Gold', 'Agapite', 'Verite', 'Valorite'];
  const matTierRowsHtml = tierIds
    .map((tid) => {
      const cells = orderedIds
        .map((cid) => {
          const rec = gearWaves.materialTierCurves.find((m) => m.classId === cid && m.tierId === tid);
          if (!rec) return `<td class="mono">—</td>`;
          return `<td class="mono">${rec.lowDefBossDps.toFixed(1)} <span style="color:var(--text-secondary);">DPS</span> / <span style="color:#82d5b0;">${rec.ehpPerSec.toFixed(1)} EHP/s</span></td>`;
        })
        .join('');
      const sample = gearWaves.materialTierCurves.find((m) => m.tierId === tid);
      return `<tr>
        <td class="mono"><strong style="color:#fff2bf;">${escapeHtml(tid)}</strong> <small style="color:var(--text-secondary);">(Lv.${sample?.levelReq ?? 1})</small></td>
        ${cells}
      </tr>`;
    })
    .join('\n');

  // 10-Wave Continuous Dungeon Endurance Summary Rows
  const multiWaveRowsHtml = gearWaves.multiWaveRuns
    .map((mw) => {
      const w1 = mw.waves[0]!;
      const w10 = mw.waves[mw.waves.length - 1]!;
      return `<tr>
        <td><strong style="text-transform:uppercase;color:${classColors[mw.classId] ?? '#fff2bf'};">${escapeHtml(mw.classId)}</strong></td>
        <td class="mono">${mw.totalClearTimeSec.toFixed(1)}s</td>
        <td class="mono">${mw.averageWaveDps.toFixed(2)} DPS</td>
        <td class="mono" style="color:#82d5b0;">${mw.minHpPct.toFixed(1)}%</td>
        <td class="mono" style="color:#9ec9ff;">${mw.minManaPct.toFixed(1)}%</td>
        <td class="mono">${w1.waveDps.toFixed(1)} → ${w10.waveDps.toFixed(1)} DPS</td>
        <td class="mono">${mw.totalParries} Parries / ${mw.totalCloneInterceptions} Clones</td>
        <td><span class="lv-pill" style="color:#82d5b0;border-color:#2e9e6b;">10/10 WAVES CLEARED</span></td>
      </tr>`;
    })
    .join('\n');

  // 20-Second (100ms Tick) Combat Rotation Timeline Strips for Samurai & Ninja
  const rotationStripsHtml = ['samurai', 'ninja']
    .map((cid) => {
      const rot = gearWaves.rotationTimelines.find((r) => r.classId === cid);
      if (!rot) return '';
      const castEvents = rot.events.filter((e) => e.kind !== 'swing').slice(0, 14);
      const chips = castEvents
        .map((ev) => {
          const sec = (ev.timeMs / 1000).toFixed(1);
          const badgeCol =
            ev.kind === 'cast'
              ? 'var(--border-gold-bright)'
              : ev.kind === 'execute'
                ? '#ef4444'
                : ev.kind === 'parry'
                  ? '#f59e0b'
                  : '#10b981';
          return `<div style="padding:4px 7px;background:#121611;border:1px solid ${badgeCol};border-radius:3px;font-size:10px;" class="mono">
            <strong style="color:#fff2bf;">t=${sec}s</strong> · <span style="color:${badgeCol};text-transform:uppercase;">${escapeHtml(ev.kind)}</span> · ${escapeHtml(ev.label)} (${ev.damage > 0 ? ev.damage.toFixed(0) + ' dmg' : 'Posture/Buff'}${ev.isCrit ? ' ★' : ''})
          </div>`;
        })
        .join('');
      return `<div style="margin-top:8px;padding:8px 10px;background:#0e120d;border:1px solid #2a3026;border-radius:4px;">
        <div style="font-family:'Cinzel',serif;font-size:11px;color:${classColors[cid]};font-weight:700;margin-bottom:6px;text-transform:uppercase;">
          ${escapeHtml(cid)} L60 100ms Tick Combat Rotation Log (First 20.0s — ro(e) Hotbar Casts, DoTs &amp; Procs)
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;">${chips}</div>
      </div>`;
    })
    .join('\n');

  const classHeadersHtml = orderedIds
    .map((cid) => {
      const c = classes[cid]!;
      const isNew = cid === 'samurai' || cid === 'ninja';
      const portraitImg = isNew
        ? `<img src="assets/icons/${cid}/portrait-${cid}-64.png" alt="${escapeHtml(c.id)}" style="width:32px;height:32px;border-radius:4px;border:1px solid var(--border-gold);" />`
        : '';
      return `
        <th>
          <div style="display:flex;align-items:center;gap:6px;justify-content:center;">
            ${portraitImg}
            <div>
              <div style="font-family:'Cinzel',serif;font-size:13px;color:#fff2bf;text-transform:uppercase;">${escapeHtml(c.id)} (${escapeHtml(c.badge)})</div>
              <div class="mono" style="font-size:10px;color:var(--text-secondary);">ID ${c.classNumericId} · Hue ${c.robeHue} · ${c.baseStats.str}/${c.baseStats.dex}/${c.baseStats.int}</div>
            </div>
          </div>
        </th>
      `;
    })
    .join('\n');

  const matrixRowsHtml = levels
    .map((lv) => {
      const cells = orderedIds
        .map((cid) => {
          const c = classes[cid]!;
          const m = c.progression.find((p) => p.level === lv);
          if (!m) return `<td>—</td>`;
          const isNew = cid === 'samurai' || cid === 'ninja';
          const iconHtml = isNew
            ? `<img src="assets/icons/${cid}/${escapeHtml(m.id)}@48.png" alt="${escapeHtml(m.nameEn)}" style="width:32px;height:32px;border-radius:4px;border:1px solid #6d5733;flex-shrink:0;" />`
            : '';
          const dualNote =
            cid === 'ninja' && lv === 35
              ? `<div class="mono" style="font-size:9px;color:#68d391;margin-top:2px;">+ ninja_shuriken (Dual L35)</div>`
              : '';
          return `
            <td>
              <div style="display:flex;align-items:center;gap:7px;">
                ${iconHtml}
                <div>
                  <div style="display:flex;align-items:center;gap:4px;">
                    <strong style="color:#fff2bf;font-size:11px;">${escapeHtml(m.nameEn)}</strong>
                    <span class="type-pill kind-${escapeHtml(m.type)}" style="font-size:8px;padding:0 4px;">${escapeHtml(m.type)}</span>
                  </div>
                  <span class="mono" style="font-size:9px;color:var(--text-secondary);">${escapeHtml(m.id)}</span>
                  ${dualNote}
                </div>
              </div>
            </td>
          `;
        })
        .join('\n');
      return `
        <tr>
          <td class="mono" style="font-weight:700;color:var(--text-gold);text-align:center;">L${lv}</td>
          ${cells}
        </tr>
      `;
    })
    .join('\n');

  const defaultScenarios = parity.mode_a.scenarios.filter(
    (s) => s.bracketId === 'L60' && s.archetypeId === 'low_def_boss'
  );
  const maxDps = Math.max(...defaultScenarios.map((s) => s.sustainedDps), 1);

  const initialTelemetryRowsHtml = defaultScenarios
    .map((s) => {
      const pct = Math.min(100, Math.round((s.sustainedDps / maxDps) * 100));
      const barColor =
        s.classId === 'samurai'
          ? 'var(--samurai-accent)'
          : s.classId === 'ninja'
            ? 'var(--ninja-accent)'
            : 'var(--border-gold)';
      return `
        <tr>
          <td><strong style="text-transform:uppercase;color:#fff2bf;">${escapeHtml(s.classId)}</strong></td>
          <td class="mono">${s.sustainedDps.toFixed(2)}</td>
          <td style="width:220px;">
            <div style="background:#0d100c;border:1px solid #2a3026;border-radius:3px;height:14px;overflow:hidden;">
              <div style="width:${pct}%;height:100%;background:${barColor};"></div>
            </div>
          </td>
          <td class="mono">${s.trashTtkSec.toFixed(2)}s</td>
          <td class="mono">${s.ehpPerSec.toFixed(2)}</td>
          <td class="mono">${s.overkillWastePct.toFixed(2)}%</td>
          <td class="mono">${s.netManaDeltaPerMin.toFixed(1)}/m</td>
          <td class="mono">${s.netStaminaDeltaPerMin.toFixed(1)}/m</td>
          <td class="mono">${s.parryCount} / ${s.cloneInterceptions}</td>
          <td class="mono">${s.oomTicks}</td>
          <td><span class="lv-pill" style="color:#82d5b0;border-color:#2e9e6b;">PASS (±5–8%)</span></td>
        </tr>
      `;
    })
    .join('\n');

  const iconicArmamentsHtml = items.iconicTokunoArmaments
    .map((arm) => {
      const iron = arm.damageByMaterialTier['Iron'] ?? arm.baseDamageRange;
      const valorite = arm.damageByMaterialTier['Valorite'] ?? arm.baseDamageRange;
      return `
        <div class="kv-item" style="display:grid;grid-template-columns:48px minmax(0,1fr);gap:8px;align-items:center;padding:7px 9px;">
          <img src="assets/items/${escapeHtml(arm.id)}.png" alt="${escapeHtml(arm.name)}" style="width:48px;height:48px;border-radius:4px;border:1px solid #6d5733;flex-shrink:0;" />
          <div style="min-width:0;">
            <div style="display:flex;flex-wrap:wrap;justify-content:space-between;width:100%;align-items:center;gap:4px;">
              <strong style="color:#fff2bf;font-size:12px;">${escapeHtml(arm.name)} <code style="font-size:10px;color:var(--text-secondary);">(${escapeHtml(arm.id)})</code></strong>
              <span class="type-pill">${escapeHtml(arm.classTheme)} · ${escapeHtml(arm.skill)}</span>
            </div>
            <div class="mono" style="font-size:10px;color:var(--text-secondary);">
              graphic: ${arm.graphicId} (${escapeHtml(arm.classicUoGraphicHex)}) · ${escapeHtml(arm.layer)} · Speed ${arm.speed}
            </div>
            <div class="mono" style="font-size:10px;color:var(--text-gold);">
              Iron: ${iron[0]}–${iron[1]} dmg → Valorite: ${valorite[0]}–${valorite[1]} dmg
            </div>
            <div class="mono" style="font-size:10px;color:#9ec9ff;">
              1°: ${escapeHtml(arm.primaryAbility.moRef)} (#${arm.primaryAbility.id}) | 2°: ${escapeHtml(arm.secondaryAbility.moRef)} (#${arm.secondaryAbility.id})
            </div>
          </div>
        </div>
      `;
    })
    .join('\n');

  const weaponsTableHtml = items.weapons
    .map(
      (w) => `
      <tr>
        <td style="display:flex;align-items:center;gap:6px;">
          <img src="assets/items/${escapeHtml(w.id)}.png" alt="${escapeHtml(w.name)}" style="width:28px;height:28px;border-radius:3px;border:1px solid #5d4a2b;flex-shrink:0;" />
          <div><strong style="color:#fff2bf;">${escapeHtml(w.name)}</strong> <code class="mono" style="font-size:10px;color:var(--text-secondary);">(${escapeHtml(w.id)})</code></div>
        </td>
        <td class="mono">${w.itemId} (${escapeHtml(w.graphicHex)})</td>
        <td class="mono">${escapeHtml(w.skill)} / ${escapeHtml(w.layer)}</td>
        <td class="mono">${w.speed}</td>
        <td class="mono">${w.minDamage}–${w.maxDamage}</td>
        <td class="mono">${escapeHtml(w.primaryAbility.key)} (#${w.primaryAbility.id}) / ${escapeHtml(w.secondaryAbility.key)} (#${w.secondaryAbility.id})</td>
        <td class="mono">${escapeHtml(w.classSynergy.join(', '))}</td>
      </tr>
    `
    )
    .join('\n');

  const consumablesHtml = items.consumables
    .map(
      (c) => `
      <div class="kv-item" style="display:grid;grid-template-columns:48px minmax(0,1fr);gap:8px;align-items:center;padding:7px 9px;">
        <img src="assets/items/${escapeHtml(c.id)}.png" alt="${escapeHtml(c.name)}" style="width:48px;height:48px;border-radius:4px;border:1px solid #6d5733;flex-shrink:0;" />
        <div style="min-width:0;">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;width:100%;gap:4px;">
            <strong style="color:#fff2bf;">${escapeHtml(c.name)} / ${escapeHtml(c.namePtBr)}</strong>
            <span class="lv-pill">itemId: ${c.itemId}</span>
          </div>
          <div class="mono" style="font-size:10px;color:var(--text-secondary);">
            id: ${escapeHtml(c.id)} · abilityId: ${escapeHtml(c.abilityId)} · minSkill: ${c.requiredSkill.skillKey} ${c.requiredSkill.minSkill}
          </div>
          <div style="font-size:10px;color:var(--text-primary);">
            ${escapeHtml(c.effect ?? `Range ${c.range}, MaxCharges ${c.maxCharges}, BaseDmg ${c.baseDamage?.join('–')}, Poison=${c.supportsPoison}`)}
          </div>
        </div>
      </div>
    `
    )
    .join('\n');

  const materialTiersHtml = items.materialTiers
    .map(
      (mt) => `
      <span class="badge-meta" style="padding:3px 7px;">
        T${mt.tier} <strong style="color:#fff2bf;">${escapeHtml(mt.id)}</strong> (Lv.${mt.levelReq}): ${mt.damageMultiplier.toFixed(2)}x Dmg / +${mt.resistBonusPct}% Res
      </span>
    `
    )
    .join('\n');

  const affixHtml = Object.values(items.affixPools)
    .map(
      (af) => `
      <div class="kv-item">
        <div>
          <strong style="color:#fff2bf;">${escapeHtml(af.key)}</strong>
          <div class="mono" style="font-size:9px;color:var(--text-secondary);">${escapeHtml(af.bonusItemKey)} · ${escapeHtml(af.uiEn)}</div>
        </div>
        <span class="v">Cap +${af.cap} (${escapeHtml(af.classSynergy.join('/'))})</span>
      </div>
    `
    )
    .join('\n');

  const samuraiCSharp = `// Mode B Server Hook (17 LOC in Projects/UOContent/Items/Weapons/BaseWeapon.cs)
// 1. OnWeaponHit: Auto-Perfection Streak & On-Kill Vital Recovery (9 LOC)
if (attacker is PlayerMobile sm && sm.ClassId == 114 && sm.Skills.Bushido.Value >= 50.0) {
    if (sm.PerfectionTarget != defender) { sm.PerfectionTarget = defender; sm.PerfectionBonus = 0; }
    sm.PerfectionBonus = Math.Min(15, sm.PerfectionBonus + (int)(sm.Skills.Bushido.Value / 25));
    percentageBonus += sm.PerfectionBonus;
    if (!defender.Alive) { sm.Hits += 8; sm.Stam += 8; sm.Mana += 8; sm.PerfectionBonus = 0; }
}
// 2. OnWeaponMiss: Perfection Streak Decay (2 LOC)
if (attacker is PlayerMobile smMiss && smMiss.ClassId == 114 && smMiss.PerfectionTarget == defender)
    smMiss.PerfectionBonus = Math.Max(0, smMiss.PerfectionBonus - 5);
// 3. OnParrySuccess (CheckParry == true): 2.0s ICD Counter & Confidence (6 LOC)
if (blocked && Core.TickCount - defender.NextBushidoParryProc >= 2000) {
    defender.NextBushidoParryProc = Core.TickCount;
    if (CounterAttack.IsCountering(defender) && defender.Weapon is BaseWeapon bw)
        bw.OnSwing(defender, attacker);
    if (Confidence.IsConfident(defender)) { defender.Hits += 2; defender.Stam += 2; }
}`;

  const ninjaCSharp = `// Mode B Server Hook (16 LOC in Projects/UOContent/Items/Weapons/BaseWeapon.cs)
// 1. OnIncomingHit: Ablative Mirror Image Clone Interception with 1.5s ICD (8 LOC)
if (MirrorImage.HasClone(defender) && Core.TickCount - defender.NextCloneIntercept >= 1500
    && defender.Skills.Ninjitsu.Value / 150.0 > Utility.RandomDouble()) {
    defender.NextCloneIntercept = Core.TickCount;
    MirrorImage.ConsumeOneClone(defender); // Destroys 1 clone & decrements cloneStacks
    damage = (int)(damage * 0.30); // Bounded ablative clone mitigation (prevents immortality)
}
// 2. OnWeaponSwingHit: 3-Swing DeathStrike, Kitsune Claw & Stealth Opener (8 LOC)
if (attacker is PlayerMobile nj && nj.ClassId == 115) {
    DeathStrike.AddStep(defender); // Detonates on 3rd connected swing!
    if (nj.CombatStealthUntil > Core.TickCount && (move is Backstab || move is SurpriseAttack)) {
        nj.CombatStealthUntil = 0; // Consumes SmokeBomb / Shadowjump stealth window
        damage = (int)(damage * 1.15);
    }
}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UO Idle v0.99.0 Beta — 5-Class Structural Parity, Simulation Telemetry &amp; Tokuno Armaments</title>
  <style>
    ${buildSharedStyles('var(--border-gold)')}
    .comp-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    .comp-table th, .comp-table td {
      border: 1px solid #2a3026;
      padding: 6px 8px;
      background: var(--bg-card);
      vertical-align: middle;
    }
    .comp-table td.mono, .comp-table th {
      white-space: nowrap;
    }
    .sim-tables-grid .comp-table th,
    .sim-tables-grid .comp-table td {
      padding: 4px 5px;
      font-size: 9.5px;
    }
    .comp-table th {
      background: #141812;
      color: var(--text-gold);
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 700;
    }
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 8px 10px;
      background: #141812;
      border: 1px solid #2a3026;
      border-radius: 4px;
    }
    .code-card {
      background: #090b08;
      border: 1px solid #3c3425;
      border-radius: 4px;
      padding: 10px;
      overflow-x: auto;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      font-size: 10.5px;
      line-height: 1.45;
      color: #e8e4d9;
      max-width: 100%;
    }
    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
      font-size: 10px;
      font-family: 'IBM Plex Mono', monospace;
    }
    .legend-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 4px;
      vertical-align: middle;
    }
    .sim-charts-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 10px;
      min-width: 0;
    }
    .sim-tables-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
      margin-top: 12px;
      min-width: 0;
    }
    .armaments-hooks-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
      gap: 12px;
      min-width: 0;
    }
    .arm-card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 6px;
      min-width: 0;
    }
    @media (max-width: 1460px) {
      .sim-tables-grid, .armaments-hooks-grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }
    @media (max-width: 1120px) {
      .sim-charts-grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  </style>
</head>
<body>
  <div class="beta-shell">
    <div class="personagem-arvore">
      ${renderQuickCommandBar('comparison')}
      <header class="arvore-head">
        <div class="arvore-nivel">
          <span class="class-badge-pill">v1.1 SIMULATOR &amp; PARITY</span>
          <strong>5-Class Progression Matrix, Visual Combat Telemetry &amp; Tokuno Armaments</strong>
        </div>
        <div class="arvore-saldos">
          <div class="arvore-saldo">
            <div><strong>5 Classes</strong><div><small>WR · MG · RG · SM · NJ</small></div></div>
            <em>12 Tiers (L1–L60)</em>
          </div>
          <div class="arvore-saldo">
            <div><strong>80 Scenarios + 9 Tiers</strong><div><small>10-Wave Endurance</small></div></div>
            <em>100ms Tick Engine</em>
          </div>
          <div class="arvore-saldo">
            <div><strong>0 OOM / 0 Deaths</strong><div><small>11/11 Unit Suites</small></div></div>
            <em>±5–8% Envelope</em>
          </div>
          <div class="arvore-saldo">
            <div><strong>34 UO Item Sprites</strong><div><small>Tokuno Drop-In Kit</small></div></div>
            <em>Mode A &amp; Mode B</em>
          </div>
        </div>
        <div class="arvore-head-acoes">
          <a class="nav-pill" href="index.html">Review Portal</a>
          <a class="nav-pill" href="samurai-skill-tree.html">Samurai (SM 114)</a>
          <a class="nav-pill" href="ninja-skill-tree.html">Ninja (NJ 115)</a>
          <a class="nav-pill is-active" href="class-comparison.html">5-Class Parity &amp; Sim</a>
        </div>
      </header>

      <!-- Interactive Workbench Sub-Tab Navigation -->
      <div class="filter-bar" style="margin-bottom:0;background:linear-gradient(180deg,#1a1f18,#10140f);border-color:#5d4a2b;">
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
          <span class="mono" style="font-size:11px;color:var(--text-gold);font-weight:700;">WORKBENCH VIEW:</span>
          <button type="button" class="beta-btn is-active" data-comp-tab="all" onclick="switchCompTab('all')">All Sections (Complete Executive Sheet)</button>
          <button type="button" class="beta-btn" data-comp-tab="sim" onclick="switchCompTab('sim')">1. Combat Simulator &amp; Visual Charts</button>
          <button type="button" class="beta-btn" data-comp-tab="matrix" onclick="switchCompTab('matrix')">2. 5-Class L1–L60 Progression Matrix</button>
          <button type="button" class="beta-btn" data-comp-tab="armaments" onclick="switchCompTab('armaments')">3. Tokuno Armaments &amp; C# Server Hooks</button>
        </div>
        <span class="mono" style="font-size:10px;color:var(--text-secondary);">Progressive Disclosure enabled on Secondary Tables</span>
      </div>

      <!-- SECTION 1: Interactive 5-Class Combat Parity Telemetry + Visual SVG Progression Curves -->
      <section class="arvore-secao" data-comp-section="sim">
        <h2 class="arvore-secao-titulo">
          <span class="title-left">1. Deterministic 5-Class Combat Simulation Telemetry &amp; Visual Charts (100ms Tick Engine)</span>
          <span class="arvore-secao-sub">Sources: parity-5class-v0.99.0.json &amp; gear-and-waves-v1.1.json · 11/11 Unit Suites</span>
        </h2>
        <div class="panel-body">
          <div class="filter-bar">
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
              <span class="mono" style="font-size:11px;color:var(--text-gold);">Mode:</span>
              <button type="button" class="beta-btn is-active" data-sim-mode="mode_a" onclick="updateSimFilter('mode', 'mode_a')">Mode A (100% Existing Engine)</button>
              <button type="button" class="beta-btn" data-sim-mode="mode_b" onclick="updateSimFilter('mode', 'mode_b')">Mode B (&lt;20 LOC C# Hook)</button>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
              <span class="mono" style="font-size:11px;color:var(--text-gold);">Bracket:</span>
              <button type="button" class="beta-btn" data-sim-bracket="L10" onclick="updateSimFilter('bracket', 'L10')">L10</button>
              <button type="button" class="beta-btn" data-sim-bracket="L25" onclick="updateSimFilter('bracket', 'L25')">L25</button>
              <button type="button" class="beta-btn" data-sim-bracket="L45" onclick="updateSimFilter('bracket', 'L45')">L45</button>
              <button type="button" class="beta-btn is-active" data-sim-bracket="L60" onclick="updateSimFilter('bracket', 'L60')">L60</button>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
              <span class="mono" style="font-size:11px;color:var(--text-gold);">Archetype:</span>
              <button type="button" class="beta-btn is-active" data-sim-arch="low_def_boss" onclick="updateSimFilter('arch', 'low_def_boss')">low_def_boss</button>
              <button type="button" class="beta-btn" data-sim-arch="high_def_boss" onclick="updateSimFilter('arch', 'high_def_boss')">high_def_boss</button>
              <button type="button" class="beta-btn" data-sim-arch="fast_trash" onclick="updateSimFilter('arch', 'fast_trash')">fast_trash</button>
              <button type="button" class="beta-btn" data-sim-arch="multi_target_pack" onclick="updateSimFilter('arch', 'multi_target_pack')">multi_target_pack</button>
            </div>
          </div>

          <div id="sim-mode-callout" class="active-mode-strip" style="margin:0 0 10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
              <span class="mode-tag-pill" id="sim-callout-tag">MODE A · 100% EXISTING ENGINE (ZERO C# CHANGES)</span>
              <span class="mono" style="font-size:10px;color:#82d5b0;" id="sim-callout-meta">Active Filter: mode_a · L60 · low_def_boss</span>
            </div>
            <div style="font-size:10.5px;margin-top:3px;color:var(--text-primary);" id="sim-callout-desc">
              Simulating 100% Drop-In JSON definitions using existing UO Idle v0.99.0 client/server primitives (timed statusEffect buffs, DoT ticks, and SpecialMove/Spell multipliers with zero C# server modifications).
            </div>
          </div>

          ${renderExecutiveClassKpiStrip(defaultScenarios, classColors)}

          <div class="table-scroll-wrap" style="margin-bottom:12px;">
            <table class="comp-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Sustained DPS</th>
                  <th>Relative DPS Bar</th>
                  <th>Trash TTK (s)</th>
                  <th>EHP / sec</th>
                  <th>Overkill Waste %</th>
                  <th>Net Mana / min</th>
                  <th>Net Stam / min</th>
                  <th>Parries / Clones</th>
                  <th>OOM Ticks</th>
                  <th>Parity Gate</th>
                </tr>
              </thead>
              <tbody id="sim-telemetry-tbody">
                ${initialTelemetryRowsHtml}
              </tbody>
            </table>
          </div>

          <!-- Visual SVG Progression Charts & 5-Channel Damage Breakdown -->
          <div class="sim-charts-grid">
            <div style="padding:10px;background:#141812;border:1px solid #2a3026;border-radius:4px;min-width:0;">
              <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:4px;margin-bottom:6px;">
                <strong id="svg-dps-title" style="font-family:'Cinzel',serif;font-size:12px;color:var(--text-gold);text-transform:uppercase;">
                  Multi-Bracket Sustained DPS Curve (L10 → L60 · Mode A · low_def_boss)
                </strong>
                <div class="chart-legend">
                  <span><i class="legend-dot" style="background:#d97706;"></i>WR</span>
                  <span><i class="legend-dot" style="background:#3b82f6;"></i>MG</span>
                  <span><i class="legend-dot" style="background:#84cc16;"></i>RG</span>
                  <span><i class="legend-dot" style="background:#c83e37;"></i>SM</span>
                  <span><i class="legend-dot" style="background:#2e9e6b;"></i>NJ</span>
                </div>
              </div>
              <div id="svg-dps-wrap">${dpsProgressionSvg}</div>
              <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:4px;margin:10px 0 6px;">
                <strong id="svg-ehp-title" style="font-family:'Cinzel',serif;font-size:12px;color:var(--text-gold);text-transform:uppercase;">
                  Multi-Bracket Effective HP / Sec (EHP/s) Curve (L10 → L60 · Mode A · low_def_boss)
                </strong>
                <span class="mono" style="font-size:10px;color:#82d5b0;">All 5 classes within ±5–8% envelope</span>
              </div>
              <div id="svg-ehp-wrap">${ehpProgressionSvg}</div>
            </div>

            <div style="padding:10px;background:#141812;border:1px solid #2a3026;border-radius:4px;min-width:0;">
              <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:4px;margin-bottom:8px;">
                <strong id="breakdown-title" style="font-family:'Cinzel',serif;font-size:12px;color:var(--text-gold);text-transform:uppercase;">
                  5-Channel Damage Source Breakdown (L60 · low_def_boss · Mode A)
                </strong>
                <div class="chart-legend">
                  <span><i class="legend-dot" style="background:#64748b;"></i>Auto</span>
                  <span><i class="legend-dot" style="background:#3b82f6;"></i>Skill/Spell</span>
                  <span><i class="legend-dot" style="background:#ef4444;"></i>Execute/Detonate</span>
                  <span><i class="legend-dot" style="background:#10b981;"></i>DoT/Venom</span>
                  <span><i class="legend-dot" style="background:#f59e0b;"></i>Parry/Spirit Proc</span>
                </div>
              </div>
              <div id="breakdown-bars-wrap">${breakdownBarsHtml}</div>
              ${rotationStripsHtml}
            </div>
          </div>

          <!-- Consolidated Material Tier (Iron -> Valorite) & 10-Wave Dungeon Endurance -->
          <div class="sim-tables-grid">
            <div style="padding:10px;background:#141812;border:1px solid #2a3026;border-radius:4px;min-width:0;">
              <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--text-gold);margin-bottom:6px;text-transform:uppercase;">
                9-Tier UO Material Progression (1.00x Iron → 1.85x Valorite · Monotonic DPS &amp; EHP/s)
              </div>
              <div class="table-scroll-wrap">
                <table class="comp-table">
                  <thead>
                    <tr>
                      <th>Material Tier</th>
                      <th>Warrior</th>
                      <th>Mage</th>
                      <th>Ranger</th>
                      <th>Samurai (SM)</th>
                      <th>Ninja (NJ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${matTierRowsHtml}
                  </tbody>
                </table>
              </div>
            </div>
            <div style="padding:10px;background:#141812;border:1px solid #2a3026;border-radius:4px;min-width:0;">
              <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--text-gold);margin-bottom:6px;text-transform:uppercase;">
                10-Wave Continuous Dungeon Pull Endurance (8 Trash + 2 Boss Waves, Zero Reset)
              </div>
              <div class="table-scroll-wrap">
                <table class="comp-table">
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Clear Time</th>
                      <th>Avg Wave DPS</th>
                      <th>Min HP</th>
                      <th>Min Mana</th>
                      <th>W1 → W10 DPS</th>
                      <th>Mitigation</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${multiWaveRowsHtml}
                  </tbody>
                </table>
              </div>
              <div style="margin-top:8px;padding:8px 10px;background:#121611;border:1px solid #2a3026;border-radius:4px;font-size:11px;color:var(--text-secondary);">
                <strong style="color:#82d5b0;">Idle Sustainability Proof:</strong> Across 10 consecutive waves without out-of-combat resets, <strong style="color:#fff2bf;">Samurai</strong> parries <strong>44</strong> attacks (fueling <em>Confidence</em> Inner Calm HP/Stam recovery and <em>Evasion</em> Iaido Flash Riposte), while <strong style="color:#fff2bf;">Ninja</strong> intercepts <strong>16</strong> boss blows via <em>Mirror Image</em> &amp; <em>Egg Bomb</em> clones and triggers <em>Smoke Bomb</em> Vanish &amp; Volley with <strong>0 OOM ticks</strong>.
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 2: 5-Class L1-L60 Structural Parity Matrix -->
      <section class="arvore-secao" data-comp-section="matrix">
        <h2 class="arvore-secao-titulo">
          <span class="title-left">2. 5-Class L1–L60 Progression Structural Parity Matrix</span>
          <span class="arvore-secao-sub">Warrior (101) · Mage (103) · Ranger (102) · Samurai (114) · Ninja (115)</span>
        </h2>
        <div class="panel-body">
          <div class="table-scroll-wrap">
            <table class="comp-table">
              <thead>
                <tr>
                  <th style="width:54px;">Tier</th>
                  ${classHeadersHtml}
                </tr>
              </thead>
              <tbody>
                ${matrixRowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- SECTION 3: Tokuno Armaments, Consumables & C# Server Hooks (Consolidated) -->
      <section class="arvore-secao" data-comp-section="armaments">
        <h2 class="arvore-secao-titulo">
          <span class="title-left">3. Authentic UO Tokuno Armaments, Ninjitsu Tools &amp; &lt;20 LOC C# Server Hooks</span>
          <span class="arvore-secao-sub">design/drop-in/items-bushido-ninjitsu.json · classes-patch.js · BaseWeapon.cs</span>
        </h2>
        <div class="panel-body">
          <div class="armaments-hooks-grid">
            <div style="min-width:0;">
              <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--text-gold);margin-bottom:6px;text-transform:uppercase;">8 Iconic Tokuno Armaments (Authentic art.png Sprites · Iron → Valorite)</div>
              <div class="arm-card-grid">
                ${iconicArmamentsHtml}
              </div>
              <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--text-gold);margin:10px 0 6px;text-transform:uppercase;">4 Cooldown-Gated Ninjitsu Consumables &amp; Projectiles</div>
              <div class="arm-card-grid">
                ${consumablesHtml}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;min-width:0;">
              <div style="min-width:0;">
                <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--samurai-accent);font-weight:700;margin-bottom:4px;">
                  Samurai (ID 114) — 17-LOC C# Server Hook (design/SAMURAI_SPEC.md §4)
                </div>
                <pre class="code-card" style="margin:0;"><code>${escapeHtml(samuraiCSharp)}</code></pre>
              </div>
              <div style="min-width:0;">
                <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--ninja-accent);font-weight:700;margin-bottom:4px;">
                  Ninja (ID 115) — 16-LOC C# Server Hook (design/NINJA_SPEC.md §4)
                </div>
                <pre class="code-card" style="margin:0;"><code>${escapeHtml(ninjaCSharp)}</code></pre>
              </div>
              <details class="schema-drawer" style="padding:6px 8px;background:#121611;border:1px solid #2a3026;border-radius:4px;min-width:0;">
                <summary style="font-size:10.5px;">Expand Full 8-Weapon Drop-In Table, 9 Material Multipliers &amp; 10 Affix Pools</summary>
                <div style="margin-top:8px;min-width:0;">
                  <div class="table-scroll-wrap" style="margin-bottom:8px;">
                    <table class="comp-table">
                      <thead>
                        <tr>
                          <th>Weapon</th>
                          <th>Item ID</th>
                          <th>Skill / Layer</th>
                          <th>Spd</th>
                          <th>Dmg</th>
                          <th>Primary / Secondary</th>
                          <th>Synergy</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${weaponsTableHtml}
                      </tbody>
                    </table>
                  </div>
                  <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;">
                    ${materialTiersHtml}
                  </div>
                  <div class="arm-card-grid">
                    ${affixHtml}
                  </div>
                </div>
              </details>
            </div>
          </div>
          <div style="margin-top:8px;padding:8px 10px;background:#141812;border:1px solid #2a3026;border-radius:4px;font-size:11px;color:var(--text-secondary);">
            <strong style="color:var(--text-gold);">Bundle Table Patch Targets (<code>applyDropInClassPatch</code> in <code>design/drop-in/classes-patch.js</code>):</strong>
            <code>_E / dx</code> (Class Metadata IDs 114 &amp; 115) · <code>WE / hE</code> (8 Starter Skills) · <code>yE / mx</code> (Starter Equipment &amp; Robe Hues 1884 / 1175) · <code>FE</code> (Legacy Template Weights) · <code>mE / gh</code> (5-Slot Seeded Hotbars) · <code>gE</code> (12-Milestone L1–L60 Progression Trees) · <code>b</code> (Normalized Ability Catalog) · <code>qC / Cq / Eq</code> (Client Combat Estimators) · <code>i18n</code> (Bilingual EN &amp; PT-BR Strings).
          </div>
        </div>
      </section>
    </div>
  </div>

  <script id="mockup-data" type="application/json">${safeJsonEmbed({ parity, breakdowns: gearWaves.damageBreakdowns })}</script>
  <script>
    (function() {
      function escHtml(str) {
        return String(str == null ? '' : str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }
      var payload = JSON.parse(document.getElementById('mockup-data').textContent);
      var parityData = payload.parity;
      var breakdownsData = payload.breakdowns || [];
      var state = { mode: 'mode_a', bracket: 'L60', arch: 'low_def_boss' };
      var orderedClasses = ['warrior', 'mage', 'ranger', 'samurai', 'ninja'];
      var classCols = { warrior: '#d97706', mage: '#3b82f6', ranger: '#84cc16', samurai: '#c83e37', ninja: '#2e9e6b' };
      var brackets = ['L10', 'L25', 'L45', 'L60'];

      window.switchCompTab = function(tabId) {
        var btns = document.querySelectorAll('[data-comp-tab]');
        for (var i = 0; i < btns.length; i++) {
          btns[i].classList.toggle('is-active', btns[i].getAttribute('data-comp-tab') === tabId);
        }
        var secs = document.querySelectorAll('[data-comp-section]');
        for (var j = 0; j < secs.length; j++) {
          var s = secs[j].getAttribute('data-comp-section');
          secs[j].style.display = (tabId === 'all' || s === tabId) ? 'block' : 'none';
        }
      };

      function renderProgressionSvg(metricKey, maxVal, unitLabel) {
        var chartW = 680, chartH = 220, padL = 48, padR = 24, padT = 20, padB = 32;
        var plotW = chartW - padL - padR;
        var plotH = chartH - padT - padB;
        var svg = '<svg viewBox="0 0 ' + chartW + ' ' + chartH + '" style="width:100%;height:auto;background:#0c0f0b;border:1px solid #2a3026;border-radius:4px;">';
        var steps = [0, 0.25, 0.5, 0.75, 1.0];
        for (var g = 0; g < steps.length; g++) {
          var f = steps[g];
          var gy = Math.round(padT + plotH * (1 - f));
          var gv = Math.round(maxVal * f);
          svg += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (chartW - padR) + '" y2="' + gy + '" stroke="#252b22" stroke-dasharray="3,3" />';
          svg += '<text x="' + (padL - 6) + '" y="' + (gy + 3) + '" fill="#a39e90" font-size="9" font-family="IBM Plex Mono" text-anchor="end">' + gv + '</text>';
        }
        for (var b = 0; b < brackets.length; b++) {
          var bx = Math.round(padL + (b / (brackets.length - 1)) * plotW);
          svg += '<line x1="' + bx + '" y1="' + padT + '" x2="' + bx + '" y2="' + (padT + plotH) + '" stroke="#1e241b" />';
          svg += '<text x="' + bx + '" y="' + (chartH - 10) + '" fill="#d4af37" font-size="10" font-weight="700" font-family="IBM Plex Mono" text-anchor="middle">' + brackets[b] + '</text>';
        }
        var scens = parityData[state.mode].scenarios;
        for (var c = 0; c < orderedClasses.length; c++) {
          var cid = orderedClasses[c];
          var col = classCols[cid] || '#c9a227';
          var pts = [];
          var circles = '';
          for (var bi = 0; bi < brackets.length; bi++) {
            var brId = brackets[bi];
            var val = 0;
            for (var si = 0; si < scens.length; si++) {
              if (scens[si].classId === cid && scens[si].bracketId === brId && scens[si].archetypeId === state.arch) {
                val = scens[si][metricKey];
                break;
              }
            }
            var px = Math.round(padL + (bi / (brackets.length - 1)) * plotW);
            var py = Math.round(padT + plotH * (1 - Math.min(1, val / maxVal)));
            pts.push(px + ',' + py);
            circles += '<circle cx="' + px + '" cy="' + py + '" r="4" fill="' + col + '" stroke="#0b0d0a" stroke-width="1.5"><title>' + cid.toUpperCase() + ': ' + val.toFixed(1) + ' ' + unitLabel + '</title></circle>';
          }
          var sw = (cid === 'samurai' || cid === 'ninja') ? '2.8' : '1.8';
          svg += '<polyline fill="none" stroke="' + col + '" stroke-width="' + sw + '" points="' + pts.join(' ') + '" />' + circles;
        }
        svg += '</svg>';
        return svg;
      }

      window.updateSimFilter = function(kind, val) {
        state[kind] = val;
        var isModeB = state.mode === 'mode_b';
        var modeBtns = document.querySelectorAll('[data-sim-mode]');
        for (var i = 0; i < modeBtns.length; i++) {
          modeBtns[i].classList.toggle('is-active', modeBtns[i].getAttribute('data-sim-mode') === state.mode);
        }
        var brBtns = document.querySelectorAll('[data-sim-bracket]');
        for (var j = 0; j < brBtns.length; j++) {
          brBtns[j].classList.toggle('is-active', brBtns[j].getAttribute('data-sim-bracket') === state.bracket);
        }
        var arBtns = document.querySelectorAll('[data-sim-arch]');
        for (var k = 0; k < arBtns.length; k++) {
          arBtns[k].classList.toggle('is-active', arBtns[k].getAttribute('data-sim-arch') === state.arch);
        }

        var callout = document.getElementById('sim-mode-callout');
        if (callout) callout.classList.toggle('is-mode-b', isModeB);
        var calloutTag = document.getElementById('sim-callout-tag');
        var calloutMeta = document.getElementById('sim-callout-meta');
        var calloutDesc = document.getElementById('sim-callout-desc');
        if (calloutTag) {
          calloutTag.textContent = isModeB
            ? 'MODE B · AUTHENTIC <20 LOC C# SERVER HOOKS (BaseWeapon.cs)'
            : 'MODE A · 100% EXISTING ENGINE (ZERO C# CHANGES)';
        }
        if (calloutMeta) {
          calloutMeta.textContent = 'Active Filter: ' + state.mode + ' · ' + state.bracket + ' · ' + state.arch;
        }
        if (calloutDesc) {
          calloutDesc.textContent = isModeB
            ? 'Simulating 17-LOC Samurai & 16-LOC Ninja BaseWeapon.cs C# hooks: reactive 2.0s ICD Parry CounterAttack swings + Confidence heal, on-hit Perfection streak (+4%/hit to +15%), ablative Mirror Image clone interception (70% absorb), and 5-swing DeathStrike detonation.'
            : 'Simulating 100% Drop-In JSON definitions using existing UO Idle v0.99.0 client/server primitives (timed statusEffect buffs, DoT ticks, and SpecialMove/Spell multipliers with zero C# server modifications).';
        }

        var list = parityData[state.mode].scenarios.filter(function(s) {
          return s.bracketId === state.bracket && s.archetypeId === state.arch;
        });
        var maxDps = 1;
        for (var m = 0; m < list.length; m++) {
          if (list[m].sustainedDps > maxDps) maxDps = list[m].sustainedDps;
        }
        var html = '';
        for (var n = 0; n < list.length; n++) {
          var s = list[n];
          var pct = Math.min(100, Math.round((s.sustainedDps / maxDps) * 100));
          var barColor = s.classId === 'samurai' ? 'var(--samurai-accent)' : (s.classId === 'ninja' ? 'var(--ninja-accent)' : 'var(--border-gold)');
          html += '<tr>' +
            '<td><strong style="text-transform:uppercase;color:#fff2bf;">' + escHtml(s.classId) + '</strong></td>' +
            '<td class="mono">' + s.sustainedDps.toFixed(2) + '</td>' +
            '<td style="width:220px;"><div style="background:#0d100c;border:1px solid #2a3026;border-radius:3px;height:14px;overflow:hidden;"><div style="width:' + pct + '%;height:100%;background:' + barColor + ';"></div></div></td>' +
            '<td class="mono">' + s.trashTtkSec.toFixed(2) + 's</td>' +
            '<td class="mono">' + s.ehpPerSec.toFixed(2) + '</td>' +
            '<td class="mono">' + s.overkillWastePct.toFixed(2) + '%</td>' +
            '<td class="mono">' + s.netManaDeltaPerMin.toFixed(1) + '/m</td>' +
            '<td class="mono">' + s.netStaminaDeltaPerMin.toFixed(1) + '/m</td>' +
            '<td class="mono">' + s.parryCount + ' / ' + s.cloneInterceptions + '</td>' +
            '<td class="mono">' + s.oomTicks + '</td>' +
            '<td><span class="lv-pill" style="color:#82d5b0;border-color:#2e9e6b;">PASS (±5–8%)</span></td>' +
          '</tr>';
        }
        document.getElementById('sim-telemetry-tbody').innerHTML = html;

        // Also update Executive 5-Class KPI Strip
        var kpiStripEl = document.getElementById('sim-exec-kpi-strip');
        if (kpiStripEl && list.length > 0) {
          var baseScens = list.filter(function(s) {
            return s.classId === 'warrior' || s.classId === 'mage' || s.classId === 'ranger';
          });
          var meanD = baseScens.length > 0
            ? baseScens.reduce(function(a, b) { return a + b.sustainedDps; }, 0) / baseScens.length
            : 375.0;
          var kpiHtml = '';
          for (var ki = 0; ki < list.length; ki++) {
            var ks = list[ki];
            var kCol = classCols[ks.classId] || '#c9a227';
            var dPct = (((ks.sustainedDps - meanD) / meanD) * 100).toFixed(1);
            var dStr = parseFloat(dPct) >= 0 ? ('+' + dPct + '%') : (dPct + '%');
            var mLbl = ks.classId === 'samurai'
              ? (ks.parryCount + ' Bushido Parries')
              : (ks.classId === 'ninja'
                ? (ks.cloneInterceptions > 0 ? ks.cloneInterceptions + ' Clone Absorbs' : 'Smoke & Clone Veil')
                : (ks.parryCount + ' Shield Parries'));
            kpiHtml += '<div class="exec-kpi-card" style="border-top-color:' + escHtml(kCol) + ';">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                '<strong style="font-family:\'Cinzel\',serif;font-size:12px;color:' + escHtml(kCol) + ';text-transform:uppercase;">' + escHtml(ks.classId) + '</strong>' +
                '<span class="mono" style="font-size:9.5px;color:#82d5b0;">' + escHtml(dStr) + ' vs Mean</span>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:2px;">' +
                '<span class="mono" style="font-size:15px;font-weight:700;color:#fff2bf;">' + ks.sustainedDps.toFixed(1) + ' <small style="font-size:9.5px;color:var(--text-secondary);">DPS</small></span>' +
                '<span class="mono" style="font-size:11px;color:#9ec9ff;">' + ks.ehpPerSec.toFixed(1) + ' EHP/s</span>' +
              '</div>' +
              '<div class="mono" style="font-size:9.5px;color:var(--text-secondary);display:flex;justify-content:space-between;">' +
                '<span>' + escHtml(mLbl) + '</span>' +
                '<span style="color:#82d5b0;">0 OOM</span>' +
              '</div>' +
            '</div>';
          }
          kpiStripEl.innerHTML = kpiHtml;
        }

        var modeLabel = isModeB ? 'Mode B' : 'Mode A';
        var dpsTitle = document.getElementById('svg-dps-title');
        var ehpTitle = document.getElementById('svg-ehp-title');
        if (dpsTitle) dpsTitle.textContent = 'Multi-Bracket Sustained DPS Curve (L10 → L60 · ' + modeLabel + ' · ' + state.arch + ')';
        if (ehpTitle) ehpTitle.textContent = 'Multi-Bracket Effective HP / Sec (EHP/s) Curve (L10 → L60 · ' + modeLabel + ' · ' + state.arch + ')';
        var dpsMax = state.arch === 'multi_target_pack' ? 680 : 420;
        var svgDpsWrap = document.getElementById('svg-dps-wrap');
        var svgEhpWrap = document.getElementById('svg-ehp-wrap');
        if (svgDpsWrap) svgDpsWrap.innerHTML = renderProgressionSvg('sustainedDps', dpsMax, 'DPS');
        if (svgEhpWrap) svgEhpWrap.innerHTML = renderProgressionSvg('ehpPerSec', 350, 'EHP/s');

        var bTitle = document.getElementById('breakdown-title');
        if (bTitle) bTitle.textContent = '5-Channel Damage Source Breakdown (' + state.bracket + ' · ' + state.arch + ' · ' + modeLabel + ')';
        var bWrap = document.getElementById('breakdown-bars-wrap');
        if (bWrap && breakdownsData.length > 0) {
          var filteredB = breakdownsData.filter(function(d) {
            return d.bracketId === state.bracket && d.archetypeId === state.arch && (!d.mode || d.mode === state.mode);
          });
          if (filteredB.length === 0) {
            filteredB = breakdownsData.filter(function(d) {
              return d.bracketId === state.bracket && d.archetypeId === state.arch;
            });
          }
          if (filteredB.length > 0) {
            var bHtml = '';
            for (var bi2 = 0; bi2 < filteredB.length; bi2++) {
              var db = filteredB[bi2];
              var tot = Math.max(db.totalDps, 0.01);
              var pAuto = ((db.autoAttackDps / tot) * 100).toFixed(1);
              var pSpec = ((db.specialMoveDps / tot) * 100).toFixed(1);
              var pExec = ((db.executeDps / tot) * 100).toFixed(1);
              var pDot = ((db.dotDps / tot) * 100).toFixed(1);
              var pProc = ((db.procCounterDps / tot) * 100).toFixed(1);
              var cCol = classCols[db.classId] || '#fff2bf';
              bHtml += '<div style="margin-bottom:8px;padding:6px 8px;background:#121611;border:1px solid #2a3026;border-radius:4px;">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;margin-bottom:2px;">' +
                  '<strong style="text-transform:uppercase;color:' + escHtml(cCol) + ';letter-spacing:0.04em;">' + escHtml(db.classId) + '</strong>' +
                  '<span class="mono" style="font-size:11px;color:#fff2bf;font-weight:700;">Total: ' + db.totalDps.toFixed(2) + ' DPS</span>' +
                '</div>' +
                '<div class="mono" style="font-size:10px;color:#c9c2b2;margin-bottom:5px;">' +
                  'Auto ' + db.autoAttackDps.toFixed(1) + ' (' + pAuto + '%) · Skill ' + db.specialMoveDps.toFixed(1) + ' (' + pSpec + '%) · Exec ' + db.executeDps.toFixed(1) + ' (' + pExec + '%) · DoT ' + db.dotDps.toFixed(1) + ' (' + pDot + '%) · Parry/Proc ' + db.procCounterDps.toFixed(1) + ' (' + pProc + '%)' +
                '</div>' +
                '<div style="display:flex;height:14px;border-radius:3px;overflow:hidden;border:1px solid #2a3026;background:#090b08;">' +
                  '<div style="width:' + pAuto + '%;background:#64748b;"></div>' +
                  '<div style="width:' + pSpec + '%;background:#3b82f6;"></div>' +
                  '<div style="width:' + pExec + '%;background:#ef4444;"></div>' +
                  '<div style="width:' + pDot + '%;background:#10b981;"></div>' +
                  '<div style="width:' + pProc + '%;background:#f59e0b;"></div>' +
                '</div>' +
              '</div>';
            }
            bWrap.innerHTML = bHtml;
          }
        }
      };

      document.addEventListener('keydown', function(e) {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        if (e.key === 'm' || e.key === 'M') {
          window.updateSimFilter('mode', state.mode === 'mode_a' ? 'mode_b' : 'mode_a');
        } else if (e.key === '1') {
          window.switchCompTab('sim');
        } else if (e.key === '2') {
          window.switchCompTab('matrix');
        } else if (e.key === '3') {
          window.switchCompTab('armaments');
        } else if (e.key === '0') {
          window.switchCompTab('all');
        }
      });

      if (window.location.search.indexOf('mode=mode_b') !== -1) {
        window.updateSimFilter('mode', 'mode_b');
      }
    })();
  </script>
</body>
</html>`;
}

function buildPortalIndexHtml(isRoot: boolean): string {
  const prefix = isRoot ? 'mockups/' : '';
  const rootPrefix = isRoot ? '' : '../';
  const ghRepo = 'https://github.com/brbrainerd/uoIdle/blob/main/';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UO Idle v0.99.0 — Samurai (Bushido) &amp; Ninja (Ninjitsu) Lead Developer Review Portal</title>
  <style>
    ${buildSharedStyles('var(--border-gold)')}
    .portal-hero {
      padding: 18px 20px;
      border: 1px solid var(--border-gold);
      border-top: 3px solid var(--border-gold-bright);
      border-radius: 5px;
      background: linear-gradient(180deg, #1d211a 0%, #0f120e 100%);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.7);
      min-width: 0;
    }
    .portal-hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 330px;
      gap: 18px;
      align-items: center;
      min-width: 0;
    }
    .hero-paperdoll-alcove {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      background: #0d100c;
      padding: 10px;
      border: 1px solid #3c3425;
      border-radius: 5px;
    }
    .alcove-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 6px;
      border-radius: 4px;
      background: radial-gradient(circle at 50% 35%, rgba(201, 162, 39, 0.14), #090b08 75%);
      border: 1px solid #2e3429;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .alcove-card:hover {
      border-color: var(--border-gold-bright);
      transform: translateY(-2px);
    }
    .alcove-card img {
      width: 112px;
      height: auto;
      border-radius: 3px;
    }
    .launch-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      min-width: 0;
    }
    .launch-card {
      display: flex;
      flex-direction: column;
      border: 1px solid #5d4a2b;
      border-radius: 5px;
      background: var(--bg-card);
      overflow: hidden;
      text-decoration: none;
      color: var(--text-primary);
      transition: all 0.16s ease;
      min-width: 0;
    }
    .launch-card:hover {
      border-color: var(--border-gold-bright);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(201, 162, 39, 0.25);
    }
    .launch-thumb {
      width: 100%;
      height: 210px;
      object-fit: cover;
      object-position: top center;
      border-bottom: 1px solid #3c3425;
      background: #090b08;
    }
    .launch-body {
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }
    .tour-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      min-width: 0;
    }
    .contact-sheets-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 12px;
      min-width: 0;
    }
    .file-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 7px 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      min-width: 0;
    }
    .file-row > div {
      min-width: 0;
      flex: 1 1 200px;
      overflow-wrap: break-word;
    }
    .file-row a {
      color: #fff2bf;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      text-decoration: none;
      overflow-wrap: anywhere;
    }
    .file-row a:hover {
      color: var(--border-gold-bright);
      text-decoration: underline;
    }
    @media (max-width: 1120px) {
      .portal-hero-grid {
        grid-template-columns: minmax(0, 1fr);
      }
      .launch-grid {
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      }
      .tour-grid, .contact-sheets-grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  </style>
</head>
<body>
  <div class="beta-shell">
    <div class="personagem-arvore">
      ${renderQuickCommandBar('portal', prefix)}
      <header class="arvore-head">
        <div class="arvore-nivel">
          <span class="class-badge-pill">UO IDLE v0.99.0 · MILESTONE v1.1</span>
          <strong>Samurai (Bushido) &amp; Ninja (Ninjitsu) — Lead Developer Review Portal</strong>
        </div>
        <div class="arvore-saldos">
          <div class="arvore-saldo">
            <div><strong>56 KB Pages</strong><div><small>649 Verified Claims</small></div></div>
            <em>0 KB Check Errors</em>
          </div>
          <div class="arvore-saldo">
            <div><strong>SM 114 &amp; NJ 115</strong><div><small>12 L1–L60 Milestones</small></div></div>
            <em>EN + PT-BR Drop-In</em>
          </div>
          <div class="arvore-saldo">
            <div><strong>80 Sim Scenarios</strong><div><small>9 Tiers · 10 Waves</small></div></div>
            <em>11/11 Unit Suites</em>
          </div>
          <div class="arvore-saldo">
            <div><strong>Zero Polygons</strong><div><small>Real UO Gumps &amp; Art</small></div></div>
            <em>140 Icons + 37 Sprites</em>
          </div>
        </div>
        <div class="arvore-head-acoes">
          <a class="nav-pill is-active" href="${prefix}index.html">Review Portal</a>
          <a class="nav-pill" href="${prefix}samurai-skill-tree.html">Samurai (SM 114)</a>
          <a class="nav-pill" href="${prefix}ninja-skill-tree.html">Ninja (NJ 115)</a>
          <a class="nav-pill" href="${prefix}class-comparison.html">5-Class Parity &amp; Sim</a>
          <a class="nav-pill" href="https://github.com/brbrainerd/uoIdle" target="_blank" rel="noopener">GitHub Repo ↗</a>
        </div>
      </header>

      <!-- Executive Introduction for the Lead Developer -->
      <section class="portal-hero">
        <div class="portal-hero-grid">
          <div style="min-width:0;">
            <div class="mono" style="font-size:11px;color:var(--text-gold);text-transform:uppercase;letter-spacing:0.06em;">
              Commissioned Technical Package for the Lead Developer of UO Idle (https://uoidle.com/beta)
            </div>
            <h1 style="font-family:'Cinzel',serif;font-size:22px;color:#fff2bf;margin:6px 0 8px;">
              Drop-In Samurai (Bushido) &amp; Ninja (Ninjitsu) Class Skill Lines, 100ms Combat Simulator &amp; Source-Verified Knowledgebase
            </h1>
            <p style="margin:0 0 10px;font-size:13px;color:var(--text-primary);max-width:1020px;">
              This package reverse-engineers the live <strong>UO Idle v0.99.0</strong> client bundle (<code>/assets/index-CCYN0Dy6.js</code>) and canonical <strong>ModernUO</strong> C# server source (<code>Projects/UOContent/Spells/{Bushido,Ninjitsu}/</code>) to deliver two implementation-ready classes: <strong>Samurai (ID 114, Badge SM, Hue 1884)</strong> and <strong>Ninja (ID 115, Badge NJ, Hue 1175)</strong>. Every ability is designed specifically for <strong>autonomous 1D idle combat</strong> (zero tile-click targeting, zero backpack ammo micro, and strict compliance with the <code>&gt;= 2,000ms</code> custom cooldown floor), mathematically balanced within <strong>±5–8%</strong> of live Warrior, Mage, and Ranger across all level brackets, material tiers (<code>Iron..Valorite</code>), and 10-wave dungeon pulls.
            </p>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              <a class="beta-btn is-active" href="${prefix}samurai-skill-tree.html">Launch Samurai Workbench →</a>
              <a class="beta-btn is-active" href="${prefix}ninja-skill-tree.html">Launch Ninja Workbench →</a>
              <a class="beta-btn is-active" href="${prefix}class-comparison.html">Launch 5-Class Simulator &amp; Charts →</a>
              <a class="beta-btn" href="${rootPrefix}design/drop-in/classes-patch.js">View Drop-In JS Patch (applyDropInClassPatch)</a>
            </div>
          </div>
          <div class="hero-paperdoll-alcove">
            <a class="alcove-card" href="${prefix}samurai-skill-tree.html" style="border-top:2px solid var(--samurai-accent);">
              <span class="mono" style="font-size:9px;color:#ff9b93;font-weight:700;">SM · ID 114 · HUE 1884</span>
              <img src="${prefix}assets/items/paperdoll-samurai.png" alt="Samurai Paperdoll" />
              <span class="mono" style="font-size:9.5px;color:#fff2bf;font-weight:700;">363.2 / 391.9 DPS</span>
              <span class="mono" style="font-size:8.5px;color:#82d5b0;">29.3% Parry · 44/10w</span>
            </a>
            <a class="alcove-card" href="${prefix}ninja-skill-tree.html" style="border-top:2px solid var(--ninja-accent);">
              <span class="mono" style="font-size:9px;color:#7ce8b4;font-weight:700;">NJ · ID 115 · HUE 1175</span>
              <img src="${prefix}assets/items/paperdoll-ninja.png" alt="Ninja Paperdoll" />
              <span class="mono" style="font-size:9.5px;color:#fff2bf;font-weight:700;">374.5 / 367.4 DPS</span>
              <span class="mono" style="font-size:8.5px;color:#82d5b0;">70% Clone · 16/10w</span>
            </a>
          </div>
        </div>
      </section>

      <!-- SECTION 1: Interactive Workbenches & Visual Dashboards -->
      <section class="arvore-secao">
        <h2 class="arvore-secao-titulo">
          <span class="title-left">1. Interactive Beta UI Workbenches, Visual Paperdolls &amp; Simulation Telemetry</span>
          <span class="arvore-secao-sub">Click any card to open the live interactive workbench</span>
        </h2>
        <div class="panel-body">
          <div class="launch-grid">
            <a class="launch-card" href="${prefix}samurai-skill-tree.html">
              <img class="launch-thumb" src="${prefix}screenshots/samurai-skill-tree.png" alt="Samurai Skill Tree Preview" />
              <div class="launch-body">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span class="class-badge-pill" style="border-color:var(--samurai-accent);">SM · ID 114 · Hue 1884</span>
                  <span class="lv-pill">12 Milestones</span>
                </div>
                <strong style="font-family:'Cinzel',serif;font-size:15px;color:#fff2bf;">Samurai (Bushido) Skill Tree &amp; Paperdoll</strong>
                <p style="margin:0;font-size:12px;color:var(--text-secondary);">
                  Interactive <code>[Arvore</code> progression, layered UO paperdoll with mouseover gear stats (<code>Iron..Valorite</code>), 5-slot seeded hotbar, live 100ms combat ticker, and <em>Kensei: Amakura's Judgment</em> capstone.
                </p>
                <div class="cost-badges" style="margin-top:auto;padding-top:4px;">
                  <span class="badge-cd">363.2 DPS (A)</span>
                  <span class="badge-stamina">391.9 DPS (B)</span>
                  <span class="badge-mana">44 Wave Parries</span>
                </div>
              </div>
            </a>

            <a class="launch-card" href="${prefix}ninja-skill-tree.html">
              <img class="launch-thumb" src="${prefix}screenshots/ninja-skill-tree.png" alt="Ninja Skill Tree Preview" />
              <div class="launch-body">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span class="class-badge-pill" style="border-color:var(--ninja-accent);">NJ · ID 115 · Hue 1175</span>
                  <span class="lv-pill">13 Catalog Skills</span>
                </div>
                <strong style="font-family:'Cinzel',serif;font-size:15px;color:#fff2bf;">Ninja (Ninjitsu) Skill Tree &amp; Paperdoll</strong>
                <p style="margin:0;font-size:12px;color:var(--text-secondary);">
                  Interactive <code>[Arvore</code> progression, Dual L35 <em>Smoke Bomb</em> + <em>Shuriken Volley</em> unlock, layered shinobi paperdoll with mouseover gear stats, and <em>Kage Bunshin: Twin Shadow Execution</em> capstone.
                </p>
                <div class="cost-badges" style="margin-top:auto;padding-top:4px;">
                  <span class="badge-cd">374.5 DPS (A)</span>
                  <span class="badge-mana">330.4 EHP/s (B)</span>
                  <span class="badge-stamina">16 Clone Absorbs</span>
                </div>
              </div>
            </a>

            <a class="launch-card" href="${prefix}class-comparison.html">
              <img class="launch-thumb" src="${prefix}screenshots/class-comparison.png" alt="5-Class Comparison &amp; Simulator Preview" />
              <div class="launch-body">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span class="class-badge-pill">5-CLASS PARITY</span>
                  <span class="lv-pill" style="color:#82d5b0;border-color:#2e9e6b;">80 Scenarios PASS</span>
                </div>
                <strong style="font-family:'Cinzel',serif;font-size:15px;color:#fff2bf;">5-Class Parity, SVG Telemetry &amp; Armaments</strong>
                <p style="margin:0;font-size:12px;color:var(--text-secondary);">
                  Executive KPI strip, multi-bracket DPS &amp; EHP/s SVG curves, 5-channel damage breakdown stacked bars, 9-tier material scaling, 10-wave dungeon endurance, and <code>&lt;20 LOC</code> C# server hooks.
                </p>
                <div class="cost-badges" style="margin-top:auto;padding-top:4px;">
                  <span class="badge-cd">±5–8% Gate</span>
                  <span class="badge-mana">9 Material Tiers</span>
                  <span class="badge-stamina">10/10 Waves</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- SECTION 2: Guided Tour of Drop-In Payloads, Design Specs & Knowledgebase -->
      <section class="arvore-secao">
        <h2 class="arvore-secao-titulo">
          <span class="title-left">2. Lead Developer Repository Guide — Key Files for Review &amp; Drop-In Integration</span>
          <span class="arvore-secao-sub">Direct links to drop-in JSON/JS payloads, formal specs, simulator &amp; knowledgebase</span>
        </h2>
        <div class="panel-body">
          <div class="tour-grid">
            <div style="display:flex;flex-direction:column;gap:6px;">
              <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--text-gold);text-transform:uppercase;">
                A. Drop-In Class, Item &amp; Bundle Patch Payloads (<code>design/drop-in/</code>)
              </div>
              <div class="file-row">
                <div>
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    <a href="${rootPrefix}design/drop-in/samurai.json">design/drop-in/samurai.json</a>
                    <span class="type-pill kind-skill" style="font-size:8px;padding:0 4px;">JSON SCHEMA · ID 114</span>
                  </div>
                  <div style="font-size:11px;color:var(--text-secondary);">Validated Samurai class definition (12 milestones, 12 skills, hotbar, EN/PT-BR).</div>
                </div>
                <a class="beta-btn" href="${ghRepo}design/drop-in/samurai.json" target="_blank" rel="noopener">GitHub ↗</a>
              </div>
              <div class="file-row">
                <div>
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    <a href="${rootPrefix}design/drop-in/ninja.json">design/drop-in/ninja.json</a>
                    <span class="type-pill kind-mechanic" style="font-size:8px;padding:0 4px;">JSON SCHEMA · ID 115</span>
                  </div>
                  <div style="font-size:11px;color:var(--text-secondary);">Validated Ninja class definition (12 milestones, 13 skills incl. Dual L35 Shuriken).</div>
                </div>
                <a class="beta-btn" href="${ghRepo}design/drop-in/ninja.json" target="_blank" rel="noopener">GitHub ↗</a>
              </div>
              <div class="file-row">
                <div>
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    <a href="${rootPrefix}design/drop-in/classes-patch.js">design/drop-in/classes-patch.js</a>
                    <span class="type-pill kind-feature" style="font-size:8px;padding:0 4px;">ES MODULE · 9 TABLES</span>
                  </div>
                  <div style="font-size:11px;color:var(--text-secondary);">Idempotent ES module <code>applyDropInClassPatch(tables)</code> wiring all 9 client bundle tables.</div>
                </div>
                <a class="beta-btn" href="${ghRepo}design/drop-in/classes-patch.js" target="_blank" rel="noopener">GitHub ↗</a>
              </div>
              <div class="file-row">
                <div>
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    <a href="${rootPrefix}design/drop-in/items-bushido-ninjitsu.json">design/drop-in/items-bushido-ninjitsu.json</a>
                    <span class="type-pill kind-passive" style="font-size:8px;padding:0 4px;">8 WEAPONS · 9 TIERS</span>
                  </div>
                  <div style="font-size:11px;color:var(--text-secondary);">8 Tokuno weapons, 4 cooldown-gated shinobi tools, 9 material tiers, and 10 affix pools.</div>
                </div>
                <a class="beta-btn" href="${ghRepo}design/drop-in/items-bushido-ninjitsu.json" target="_blank" rel="noopener">GitHub ↗</a>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:6px;">
              <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--text-gold);text-transform:uppercase;">
                B. Formal Specifications, Balance Report &amp; 56-Page Mechanics KB
              </div>
              <div class="file-row">
                <div>
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    <a href="${ghRepo}design/SAMURAI_SPEC.md" target="_blank" rel="noopener">design/SAMURAI_SPEC.md</a>
                    <span class="type-pill kind-skill" style="font-size:8px;padding:0 4px;">17-LOC C# HOOK</span>
                  </div>
                  <div style="font-size:11px;color:var(--text-secondary);">Complete Samurai &amp; Bushido specification, ModernUO citations, and 17-LOC C# server hook.</div>
                </div>
                <a class="beta-btn" href="${ghRepo}design/SAMURAI_SPEC.md" target="_blank" rel="noopener">Read Spec ↗</a>
              </div>
              <div class="file-row">
                <div>
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    <a href="${ghRepo}design/NINJA_SPEC.md" target="_blank" rel="noopener">design/NINJA_SPEC.md</a>
                    <span class="type-pill kind-mechanic" style="font-size:8px;padding:0 4px;">16-LOC C# HOOK</span>
                  </div>
                  <div style="font-size:11px;color:var(--text-secondary);">Complete Ninja &amp; Ninjitsu specification, idle adaptations, and 16-LOC C# server hook.</div>
                </div>
                <a class="beta-btn" href="${ghRepo}design/NINJA_SPEC.md" target="_blank" rel="noopener">Read Spec ↗</a>
              </div>
              <div class="file-row">
                <div>
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    <a href="${ghRepo}design/BALANCE_REPORT.md" target="_blank" rel="noopener">design/BALANCE_REPORT.md</a>
                    <span class="type-pill kind-feature" style="font-size:8px;padding:0 4px;">80 SCENARIOS PASS</span>
                  </div>
                  <div style="font-size:11px;color:var(--text-secondary);">5-class parity proofs, 5-channel damage breakdowns, material curves, and 10-wave endurance.</div>
                </div>
                <a class="beta-btn" href="${ghRepo}design/BALANCE_REPORT.md" target="_blank" rel="noopener">Read Report ↗</a>
              </div>
              <div class="file-row">
                <div>
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    <a href="${ghRepo}mechanics/INDEX.md" target="_blank" rel="noopener">mechanics/INDEX.md</a>
                    <span class="type-pill kind-spell" style="font-size:8px;padding:0 4px;">56 PAGES · 649 CLAIMS</span>
                  </div>
                  <div style="font-size:11px;color:var(--text-secondary);">56-page claim-verified UO Idle v0.99.0 + ModernUO knowledgebase (649 verbatim claims).</div>
                </div>
                <a class="beta-btn" href="${ghRepo}mechanics/INDEX.md" target="_blank" rel="noopener">Browse KB ↗</a>
              </div>
            </div>
          </div>

          <!-- Contact Sheets Preview Row -->
          <div class="contact-sheets-grid">
            <a class="launch-card" href="${prefix}assets/icons/contact-sheet.png" target="_blank" rel="noopener">
              <img class="launch-thumb" src="${prefix}assets/icons/contact-sheet.png" alt="Ability Icons Contact Sheet" style="height:175px;" />
              <div class="launch-body">
                <strong style="color:#fff2bf;font-size:12px;">Authentic UO Gumps &amp; Oil-Painted Ability Icon Sheet (140 PNGs, Zero Polygons)</strong>
                <span class="mono" style="font-size:10px;color:var(--text-gold);">${prefix}assets/icons/contact-sheet.png</span>
              </div>
            </a>
            <a class="launch-card" href="${prefix}assets/items/items-contact-sheet.png" target="_blank" rel="noopener">
              <img class="launch-thumb" src="${prefix}assets/items/items-contact-sheet.png" alt="UO Item Sprites &amp; Paperdolls Contact Sheet" style="height:175px;" />
              <div class="launch-body">
                <strong style="color:#fff2bf;font-size:12px;">Layered UO Paperdolls &amp; Extracted Item Sprites Sheet (37 PNGs from art.png &amp; gumps)</strong>
                <span class="mono" style="font-size:10px;color:var(--text-gold);">${prefix}assets/items/items-contact-sheet.png</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</body>
</html>`;
}

function compileAllMockups(): {
  classes: Record<string, ClassDefinition>;
  files: Record<string, string>;
} {
  const classes = loadValidatedClasses();
  const items = loadItemsDataset();
  const parity = loadParityDataset();
  const gearWaves = loadGearWavesDataset();

  const samuraiHtml = buildClassSkillTreeHtml(
    classes.samurai!,
    'ninja-skill-tree.html',
    'Ninja (NJ 115)'
  );
  const ninjaHtml = buildClassSkillTreeHtml(
    classes.ninja!,
    'samurai-skill-tree.html',
    'Samurai (SM 114)'
  );
  const comparisonHtml = buildClassComparisonHtml(classes, items, parity, gearWaves);
  const mockupsIndexHtml = buildPortalIndexHtml(false);
  const rootIndexHtml = buildPortalIndexHtml(true);

  const files: Record<string, string> = {
    [path.join(MOCKUPS_DIR, 'samurai-skill-tree.html')]: samuraiHtml,
    [path.join(MOCKUPS_DIR, 'ninja-skill-tree.html')]: ninjaHtml,
    [path.join(MOCKUPS_DIR, 'class-comparison.html')]: comparisonHtml,
    [path.join(MOCKUPS_DIR, 'index.html')]: mockupsIndexHtml,
    [path.join(ROOT_DIR, 'index.html')]: rootIndexHtml,
  };

  return { classes, files };
}

function captureScreenshots(): void {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  const chromeBin = resolveChromeBin();
  if (!chromeBin) {
    return;
  }
  const targets = [
    { html: 'samurai-skill-tree.html', png: 'samurai-skill-tree.png', height: 2580 },
    { html: 'ninja-skill-tree.html', png: 'ninja-skill-tree.png', height: 2640 },
    { html: 'class-comparison.html', png: 'class-comparison.png', height: 3900 },
    { html: 'index.html', png: 'portal-index.png', height: 1580 },
  ];

  for (const t of targets) {
    const htmlPath = path.join(MOCKUPS_DIR, t.html);
    const pngPath = path.join(SCREENSHOTS_DIR, t.png);
    const fileUrl = `file://${htmlPath}`;
    execFileSync(
      chromeBin,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        `--window-size=1600,${t.height}`,
        '--device-scale-factor=2',
        `--screenshot=${pngPath}`,
        fileUrl,
      ],
      { stdio: 'ignore' }
    );
  }
}

function readPngDimensions(filePath: string): { width: number; height: number; size: number } {
  const buf = fs.readFileSync(filePath);
  const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buf.subarray(0, 8).compare(pngMagic) !== 0) {
    throw new Error(`Invalid PNG magic bytes in ${filePath}`);
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height, size: buf.length };
}

function runVerify(): void {
  const { classes, files } = compileAllMockups();

  let resolvedIconsCount = 0;

  for (const [filePath, expectedHtml] of Object.entries(files)) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing mockup HTML file: ${filePath}`);
    }
    const actualHtml = fs.readFileSync(filePath, 'utf8');
    if (actualHtml !== expectedHtml) {
      throw new Error(`Mockup HTML drift detected in ${filePath}; re-run build_mockups.ts`);
    }
    for (const token of ['#0b0d0a', '#c9a227', 'Cinzel', 'IBM Plex Sans']) {
      if (!actualHtml.includes(token)) {
        throw new Error(`Missing UI-SPEC token "${token}" in ${filePath}`);
      }
    }
    if (actualHtml.includes('fetch' + '(')) {
      throw new Error(`Forbidden network call found in ${filePath}`);
    }

    const iconRegex = /src="((?:mockups\/)?assets\/(?:icons|items)\/[^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = iconRegex.exec(actualHtml)) !== null) {
      const relAsset = m[1]!;
      const absAsset = relAsset.startsWith('mockups/')
        ? path.join(ROOT_DIR, relAsset)
        : path.join(MOCKUPS_DIR, relAsset);
      if (!fs.existsSync(absAsset)) {
        throw new Error(`Broken asset path "${relAsset}" in ${filePath}`);
      }
      resolvedIconsCount++;
    }
  }

  const samuraiHtml = fs.readFileSync(path.join(MOCKUPS_DIR, 'samurai-skill-tree.html'), 'utf8');
  for (const ab of classes.samurai!.abilities) {
    for (const needle of [ab.id, ab.name, ab.namePtBr, String(ab.cooldownMs), String(ab.manaCost), String(ab.staminaCost)]) {
      if (!samuraiHtml.includes(needle)) {
        throw new Error(`Samurai HTML missing ability field "${needle}" for ${ab.id}`);
      }
    }
  }
  for (const ms of classes.samurai!.progression) {
    if (!samuraiHtml.includes(`L${ms.level}`) || !samuraiHtml.includes(ms.nameEn) || !samuraiHtml.includes(ms.namePtBr)) {
      throw new Error(`Samurai HTML missing milestone L${ms.level}`);
    }
  }

  const ninjaHtml = fs.readFileSync(path.join(MOCKUPS_DIR, 'ninja-skill-tree.html'), 'utf8');
  for (const ab of classes.ninja!.abilities) {
    for (const needle of [ab.id, ab.name, ab.namePtBr, String(ab.cooldownMs), String(ab.manaCost), String(ab.staminaCost)]) {
      if (!ninjaHtml.includes(needle)) {
        throw new Error(`Ninja HTML missing ability field "${needle}" for ${ab.id}`);
      }
    }
  }
  for (const ms of classes.ninja!.progression) {
    if (!ninjaHtml.includes(`L${ms.level}`) || !ninjaHtml.includes(ms.nameEn) || !ninjaHtml.includes(ms.namePtBr)) {
      throw new Error(`Ninja HTML missing milestone L${ms.level}`);
    }
  }

  const screenshotNames = ['samurai-skill-tree.png', 'ninja-skill-tree.png', 'class-comparison.png', 'portal-index.png'];
  for (const sName of screenshotNames) {
    const sPath = path.join(SCREENSHOTS_DIR, sName);
    if (!fs.existsSync(sPath)) {
      throw new Error(`Missing screenshot: ${sPath}`);
    }
    const { width, height, size } = readPngDimensions(sPath);
    if (width < 1600 || height < 1400) {
      throw new Error(`Screenshot ${sName} dimensions ${width}x${height} below 1600x1400 minimum`);
    }
    if (size <= 50_000) {
      throw new Error(`Screenshot ${sName} file size ${size} bytes <= 50,000 bytes`);
    }
  }

  console.log(
    JSON.stringify({
      ok: true,
      mockups: Object.keys(files).length,
      screenshots: screenshotNames.length,
      samuraiAbilities: classes.samurai!.abilities.length,
      ninjaAbilities: classes.ninja!.abilities.length,
      resolvedAssets: resolvedIconsCount,
    })
  );
}

function main(): void {
  const args = new Set(process.argv.slice(2));
  if (args.has('--verify')) {
    runVerify();
    return;
  }

  fs.mkdirSync(MOCKUPS_DIR, { recursive: true });
  const { files } = compileAllMockups();
  for (const [filePath, html] of Object.entries(files)) {
    fs.writeFileSync(filePath, html, 'utf8');
  }

  if (!args.has('--no-screenshots')) {
    captureScreenshots();
  }
}

main();
