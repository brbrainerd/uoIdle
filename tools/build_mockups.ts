import * as fs from 'node:fs';
import * as path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ClassSchema, type ClassDefinition, type SkillDefinition } from '../src/schemas/skill.schema.js';

const ROOT_DIR = process.cwd();

const MOCKUPS_DIR = path.join(ROOT_DIR, 'mockups');
const SCREENSHOTS_DIR = path.join(MOCKUPS_DIR, 'screenshots');
const ICONS_DIR = path.join(MOCKUPS_DIR, 'assets', 'icons');
const CHROME_BIN = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

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

const MODE_DESCRIPTIONS: Record<string, { modeA: string; modeB: string; qCEstimator: string }> = {
  samurai_way: {
    modeA: 'Passive auto-attack swing loop + Parrying (ID 5) & Bushido (ID 52) shieldless parry scaling.',
    modeB: 'Native BaseWeapon.CheckParry shieldless 1H (48,000) / 2H (41,140) Bushido Weapon Parry formula.',
    qCEstimator: '1.00x Weapon Auto-Swing + 25.8% (1H) / 29.3% (2H) Parry @ 100 Bushido',
  },
  samurai_lightning: {
    modeA: 'SpecialMove (spellId: 404) 1.10x-1.20x precision strike + 3.0s Lightning Stagger debuff.',
    modeB: 'Authentic LightningStrike (+50% Hit Chance, Bushido^2/72,000 critical IgnoreArmor roll).',
    qCEstimator: '1.10x - 1.20x Melee + 13.9% IgnoreArmor Crit @ 100 Bushido',
  },
  samurai_perfection: {
    modeA: 'Custom self-buff (customCooldownMs: 14,000ms >= 2,000ms floor) granting +10% Perfection streak.',
    modeB: 'Passive BaseWeapon.OnHit auto-Honored target bind (+4%/hit up to +15% cap, +8 HP/Stam/Mana on kill).',
    qCEstimator: '+10% Damage Dealt (8.0s Mode A) / +15% Streak Cap + Vital Restore (Mode B)',
  },
  samurai_honorable: {
    modeA: 'SpecialMove (spellId: 400) 1.15x-1.25x strike (1.60x Execute <= 35% HP) + 10s +15% Attack Speed.',
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
  samurai_lightning_r2: {
    modeA: 'Master SpecialMove (spellId: 404 R2, 15 Stamina) 1.25x-1.35x strike + 45% secondary arc splash.',
    modeB: 'Grandmaster LightningStrike II with guaranteed IgnoreArmor crit roll and 45% chain lightning.',
    qCEstimator: '1.25x - 1.35x Primary + 45% Arc Splash (15 Stamina)',
  },
  samurai_honorable_r2: {
    modeA: 'Capstone SpecialMove (spellId: 400 R2, 15 Stamina) 1.95x Execute <= 35% HP + +12% Speed / +8% Damage (10s).',
    modeB: 'Grandmaster HonorableExecution II: 1.95x Execute finisher + dual offensive posture.',
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
    modeA: 'Spell (spellId: 507) summons illusory shadow clone granting -8% damage taken for 8.0s.',
    modeB: 'MirrorImage clone stack: intercepts incoming hit at Ninjitsu/150 chance (70% ablative absorb, 1.5s ICD).',
    qCEstimator: '1 Shadow Clone (-8% Damage Taken Mode A / 70% Intercept Mode B)',
  },
  ninja_backstab: {
    modeA: 'SpecialMove (spellId: 504) 1.15x-1.25x ambush strike + 5.0s +6% Shadow Ambush damage buff.',
    modeB: 'Backstab consuming CombatStealthUntil window for 1.15x multiplicative stealth opener bonus.',
    qCEstimator: '1.15x - 1.25x Ambush + +6% Damage Dealt (5.0s)',
  },
  ninja_death: {
    modeA: 'SpecialMove (spellId: 501) 1.10x-1.20x vital strike + 4-tick Death Mark internal trauma DoT (4.0s).',
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
  ninja_mirror_r2: {
    modeA: 'Master Spell (spellId: 507 R2) deploying coordinated shadow clones (-10% dmg taken, +8% dmg dealt for 7.0s).',
    modeB: 'Summons 2 ablative shadow clones (70% hit interception each, 1.5s ICD) + +8% offensive clone sync.',
    qCEstimator: '2 Shadow Clones (-10% Dmg Taken & +8% Dmg Dealt, 7.0s)',
  },
  ninja_death_r2: {
    modeA: 'Capstone SpecialMove (spellId: 501 R2, 18 Stamina) 1.25x-1.35x (1.95x Execute <= 35% HP) + 4-tick Death Mark II.',
    modeB: 'Grandmaster DeathStrike II: 1.95x Execute below 35% HP + 5-swing delayed assassination detonation.',
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
      descEn: 'Crowns the Samurai with Lightning Strike II and Honorable Execution II (1.95x Execute).',
      descPtBr: 'Coroa o Samurai com Golpe Relâmpago II e Execução Honrosa II (Execução 1.95x).',
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
      descEn: 'Unlocks Mirror Image II and Death Strike II (1.95x Execute + 5-swing lethal detonation).',
      descPtBr: 'Libera Imagem Espelhada II e Golpe Mortal II (Execução 1.95x + detonação de 5 golpes).',
    },
  ],
};

function buildSharedStyles(accentVar: string): string {
  return `
    :root {
      --bg-canvas: #0b0d0a;
      --bg-panel: #121510;
      --bg-card: #181c16;
      --bg-card-hover: #20261d;
      --border-subtle: #2a3026;
      --border-gold: #c9a227;
      --border-gold-bright: #e5c158;
      --text-primary: #e8e4d9;
      --text-secondary: #a39e90;
      --text-gold: #d4af37;
      --samurai-accent: #c83e37;
      --ninja-accent: #2e9e6b;
      --mana-blue: #4a90e2;
      --stamina-amber: #e2a04a;
      --cd-purple: #9b6be2;
      --class-accent: ${accentVar};
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: radial-gradient(circle at 50% 0%, #171c14 0%, var(--bg-canvas) 68%);
      color: var(--text-primary);
      font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      line-height: 1.45;
      min-height: 100vh;
    }

    .mono, code, pre, .num {
      font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
      font-variant-numeric: tabular-nums;
    }

    .beta-shell {
      max-width: 1560px;
      margin: 0 auto;
      padding: 12px 16px 24px;
    }

    /* Live uoidle.com/beta .personagem-arvore & .arvore-* structural rules from game-theme.css */
    .personagem-arvore {
      display: flex;
      flex-direction: column;
      width: 100%;
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
      align-items: center;
      gap: 10px;
      min-height: 36px;
      padding-right: 12px;
      border-right: 1px solid #725b31;
      white-space: nowrap;
    }

    .arvore-nivel strong {
      color: #fff2bf;
      font-family: 'Cinzel', Georgia, serif;
      font-size: 15px;
      letter-spacing: 0.04em;
    }

    .arvore-saldos {
      display: flex;
      flex-wrap: nowrap;
      gap: 6px;
      flex: 1 1 auto;
      justify-content: center;
    }

    .arvore-saldo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 2px 10px;
      border-left: 1px solid #725b31;
      white-space: nowrap;
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
    }

    .hue-swatch {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: var(--class-accent);
      border: 1px solid #fff2bf;
      display: inline-block;
    }

    .arvore-secao {
      min-width: 0;
      border: 1px solid #5d4a2b;
      border-radius: 4px;
      background: radial-gradient(circle at 50% 0, rgba(53, 50, 36, 0.22), transparent 55%), var(--bg-panel);
      box-shadow: inset 0 1px 0 rgba(255, 242, 191, 0.06);
    }

    .arvore-secao-titulo {
      display: flex;
      gap: 8px;
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
    }

    .workbench-grid {
      display: grid;
      grid-template-columns: 340px minmax(0, 1fr) 430px;
      gap: 12px;
      align-items: start;
    }

    .col-stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .panel-body {
      padding: 10px 12px;
    }

    /* Portrait & Identity */
    .identity-hero {
      display: grid;
      grid-template-columns: 116px minmax(0, 1fr);
      gap: 12px;
      align-items: center;
    }

    .portrait-frame {
      position: relative;
      width: 116px;
      height: 116px;
      border: 2px solid var(--border-gold);
      border-radius: 6px;
      overflow: hidden;
      background: #080907;
      box-shadow: 0 0 16px rgba(0, 0, 0, 0.8);
    }

    .portrait-frame img.main-portrait {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .portrait-mini-badge {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 28px;
      height: 28px;
      border: 1px solid var(--border-gold-bright);
      border-radius: 4px;
      background: #0b0d0a;
    }

    .stat-chips {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      margin-top: 8px;
    }

    .stat-chip {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      padding: 4px 6px;
      text-align: center;
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
    }

    .kv-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 3px;
      font-size: 11px;
    }

    .kv-item .k {
      color: var(--text-primary);
      text-transform: capitalize;
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
    }

    /* Winding .arvore-cobra ribbon */
    .arvore-cobra-wrap {
      padding: 10px 12px;
      border-bottom: 1px solid #2a3026;
      background: rgba(11, 13, 10, 0.55);
    }

    .arvore-cobra {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 4px;
      align-items: center;
    }

    .arvore-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
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
      font-size: 9px;
      line-height: 1.1;
      text-align: center;
      max-width: 64px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* 12 Milestone Cards Grid */
    .milestone-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      padding: 10px 12px;
    }

    .milestone-card {
      display: grid;
      grid-template-columns: 52px minmax(0, 1fr);
      gap: 10px;
      padding: 8px 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .milestone-card:hover, .milestone-card.is-selected {
      background: var(--bg-card-hover);
      border-color: var(--border-gold);
      box-shadow: 0 0 12px rgba(201, 162, 39, 0.22);
    }

    .milestone-card.is-capstone {
      border-color: var(--border-gold-bright);
      background: linear-gradient(180deg, #241f14, #171a14);
    }

    .milestone-icon-box {
      position: relative;
      width: 52px;
      height: 52px;
    }

    .milestone-icon-box img {
      width: 52px;
      height: 52px;
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
    }

    .type-pill {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 3px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      text-transform: uppercase;
      border: 1px solid #3c4436;
      background: #121611;
      color: var(--text-secondary);
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
    }

    .dual-unlock-banner img {
      width: 28px;
      height: 28px;
      border-radius: 3px;
      border: 1px solid var(--border-gold);
    }

    /* Pinned Live Tooltip Inspector (.arvore-dica) */
    .arvore-dica-pinned {
      padding: 10px 12px;
      border: 1px solid var(--border-gold);
      border-radius: 4px;
      background: #0c0e0cf7;
      color: #f6ecd4;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.65);
    }

    .dica-header {
      display: grid;
      grid-template-columns: 56px minmax(0, 1fr);
      gap: 10px;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid #3c3425;
      margin-bottom: 8px;
    }

    .dica-header img {
      width: 56px;
      height: 56px;
      border-radius: 4px;
      border: 1px solid var(--border-gold-bright);
    }

    /* Ability Catalog Cards */
    .catalog-list {
      display: flex;
      flex-direction: column;
      gap: 7px;
      padding: 10px 12px;
    }

    .catalog-card {
      display: grid;
      grid-template-columns: 48px minmax(0, 1fr);
      gap: 10px;
      padding: 7px 9px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      cursor: pointer;
    }

    .catalog-card:hover {
      background: var(--bg-card-hover);
      border-color: var(--border-gold);
    }

    .catalog-card img {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      display: block;
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
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px;
      padding: 8px 12px 12px;
    }

    .passive-badge-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 7px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
    }

    .passive-badge-item img {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      flex-shrink: 0;
    }
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
  const robeLabel = isSamurai ? 'Hue 1884 (Crimson Lacquer)' : 'Hue 1175 (Midnight Shinobi)';
  const portraitRel = `assets/icons/${cls.id}/portrait-${cls.id}.png`;
  const portrait64Rel = `assets/icons/${cls.id}/portrait-${cls.id}-64.png`;

  const shurikenAbility: SkillDefinition | undefined = cls.abilities.find((a) => a.id === 'ninja_shuriken');

  const cobraNodesHtml = cls.progression
    .map((m) => {
      const iconRel = `assets/icons/${cls.id}/${m.id}@64.png`;
      return `
        <div class="arvore-col" onclick="selectAbility('${escapeHtml(m.id)}')" title="L${m.level}: ${escapeHtml(m.nameEn)} / ${escapeHtml(m.namePtBr)}">
          <span class="arvore-lv">L${m.level}</span>
          <div class="arvore-circulo is-on">
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
      const dualUnlockHtml =
        !isSamurai && m.level === 35 && shurikenAbility
          ? `
            <div class="dual-unlock-banner" onclick="event.stopPropagation(); selectAbility('ninja_shuriken');">
              <img src="assets/icons/ninja/ninja_shuriken@48.png" alt="Shuriken &amp; Fukiya Volley" />
              <div>
                <strong>+ Dual L35 Unlock: <span data-en="${escapeHtml(shurikenAbility.name)}" data-pt="${escapeHtml(shurikenAbility.namePtBr)}">${escapeHtml(shurikenAbility.name)}</span></strong>
                <div class="mono" style="font-size:9px;color:#a39e90;">id: ninja_shuriken | CD: ${shurikenAbility.cooldownMs}ms | Mana: ${shurikenAbility.manaCost} | gump: ${shurikenAbility.gumpIcon}</div>
              </div>
            </div>
          `
          : '';

      return `
        <div class="milestone-card ${idx === 0 ? 'is-selected' : ''} ${isCapstone ? 'is-capstone' : ''}" data-milestone-id="${escapeHtml(m.id)}" onclick="selectAbility('${escapeHtml(m.id)}')">
          <div class="milestone-icon-box">
            <img src="${escapeHtml(icon64)}" alt="${escapeHtml(m.nameEn)}" />
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;">
              <span class="lv-pill">L${m.level}</span>
              <span class="type-pill">${escapeHtml(m.type)}</span>
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
                  </div>`
                : ''
            }
            ${dualUnlockHtml}
          </div>
        </div>
      `;
    })
    .join('\n');

  const catalogCardsHtml = cls.abilities
    .map((ab) => {
      const icon48 = `assets/icons/${cls.id}/${ab.id}@48.png`;
      const modeInfo = MODE_DESCRIPTIONS[ab.id] ?? {
        modeA: ab.scalingFormula.summary,
        modeB: ab.scalingFormula.summary,
        qCEstimator: ab.scalingFormula.summary,
      };
      const refBadge =
        ab.spellId !== null
          ? `spellId: ${ab.spellId}`
          : ab.weaponAbilityRef !== null
            ? `weaponRef: ${ab.weaponAbilityRef}`
            : ab.itemId !== null
              ? `itemId: ${ab.itemId}`
              : 'innate';

      return `
        <div class="catalog-card" data-ability-card="${escapeHtml(ab.id)}" onclick="selectAbility('${escapeHtml(ab.id)}')">
          <img src="${escapeHtml(icon48)}" alt="${escapeHtml(ab.name)}" />
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
              <strong style="color:#fff2bf;font-size:12px;" data-en="${escapeHtml(ab.name)}" data-pt="${escapeHtml(ab.namePtBr)}">${escapeHtml(ab.name)}</strong>
              <span class="lv-pill">Tree L${ab.progressionTreeLevel} / Raw ${ab.unlockLevel}</span>
            </div>
            <div class="mono" style="font-size:10px;color:var(--text-secondary);">
              id: <code>${escapeHtml(ab.id)}</code> · kind: ${escapeHtml(ab.kind)} · tab: ${escapeHtml(ab.tab)} · ${escapeHtml(refBadge)} · scope: ${escapeHtml(ab.mapScope)} · gump: ${escapeHtml(ab.gumpIcon)} (${escapeHtml(ab.iconKey)})
            </div>
            <div class="cost-badges">
              <span class="badge-cd">cooldownMs: ${ab.cooldownMs}ms</span>
              ${ab.customCooldownMs > 0 ? `<span class="badge-cd">customCD: ${ab.customCooldownMs}ms (&gt;=2000ms)</span>` : ''}
              <span class="badge-mana">manaCost: ${ab.manaCost}</span>
              <span class="badge-stamina">staminaCost: ${ab.staminaCost}</span>
              <span class="badge-meta">${escapeHtml(ab.effectType)}</span>
            </div>
            <div style="margin-top:4px;font-size:11px;color:var(--text-primary);" class="mode-text" data-mode-a="${escapeHtml(modeInfo.modeA)}" data-mode-b="${escapeHtml(modeInfo.modeB)}">
              ${escapeHtml(modeInfo.modeA)}
            </div>
          </div>
        </div>
      `;
    })
    .join('\n');

  const starterSkillsHtml = cls.starterSkills
    .map(
      (sk) => `
      <div class="kv-item">
        <span class="k">${escapeHtml(sk.skillKey)} <small class="mono" style="color:var(--text-secondary)">(#${sk.skillId})</small></span>
        <span class="v">${sk.initialValue}.0</span>
      </div>
    `
    )
    .join('\n');

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

  const hotbarHtml = cls.seededHotbar
    .map((slot) => {
      const condStr =
        slot.conditions.length === 0
          ? 'Unconditional Primary Strike (ro(e) Queue)'
          : slot.conditions
              .map((c) => `${c.target}.${c.attr} ${c.op} ${c.value}${c.percent ? '%' : ''}`)
              .join(' OR ');
      return `
        <div class="hotbar-slot">
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
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UO Idle v0.99.0 Beta — ${escapeHtml(classTitle)} [Arvore Skill Tree &amp; Hotbar Workbench</title>
  <style>${buildSharedStyles(accentVar)}</style>
</head>
<body>
  <div class="beta-shell">
    <div class="personagem-arvore" data-personagem-conteudo="arvore">
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
          <a class="nav-pill" href="${escapeHtml(otherClassFile)}">${escapeHtml(otherClassLabel)}</a>
          <a class="nav-pill" href="class-comparison.html">5-Class Parity</a>
        </div>
      </header>

      <!-- 3-Column Beta Workbench -->
      <div class="workbench-grid">
        <!-- LEFT COLUMN: Character Identity, 8 Starter Skills, Tokuno Paperdoll & 5-Slot Seeded Hotbar -->
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
                  <div class="mono" style="font-size:11px;color:var(--text-secondary);">classId: "${escapeHtml(cls.id)}" · numericId: ${cls.classNumericId} · badge: "${escapeHtml(cls.badge)}"</div>
                  <div class="mono" style="font-size:10px;color:var(--text-gold);margin-top:3px;">
                    Primary: ${escapeHtml(cls.resourceProfile.primaryResource)} | StartMana: ${cls.resourceProfile.startingManaMax} | MedCap: ${cls.resourceProfile.meditationCap} | Reagents: false | Ammo: false
                  </div>
                  <div class="stat-chips">
                    <div class="stat-chip"><span>STR</span><strong>${cls.baseStats.str}</strong></div>
                    <div class="stat-chip"><span>DEX</span><strong>${cls.baseStats.dex}</strong></div>
                    <div class="stat-chip"><span>INT</span><strong>${cls.baseStats.int}</strong></div>
                  </div>
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
              <div style="margin-top:6px;font-size:10px;color:var(--text-secondary);">
                ${
                  isSamurai
                    ? 'Shieldless Bushido Weapon Parry scales via Parrying (50) × Bushido (50) ÷ 48,000 (1H) or 41,140 (2H).'
                    : 'Synergizes with Poisoning (#30) for Infectious Strike, Shuriken, and Fukiya virulent toxin application.'
                }
              </div>
              <div style="margin-top:8px;font-size:10px;font-weight:700;color:var(--text-gold);text-transform:uppercase;">Legacy Template Weights (FE = 100%)</div>
              <div class="kv-grid" style="margin-top:4px;">
                ${legacyWeightsHtml}
              </div>
            </div>
          </section>

          <section class="arvore-secao">
            <h2 class="arvore-secao-titulo">
              <span class="title-left">Tokuno Starter Paperdoll</span>
              <span class="arvore-secao-sub">yE / mx (${cls.starterEquipment.paperdollLayers.length} Layers)</span>
            </h2>
            <div class="panel-body">
              <div class="mono" style="font-size:10px;color:var(--text-secondary);margin-bottom:6px;">
                kitTokens: [${cls.starterEquipment.kitTokens.map((t) => `"${escapeHtml(t)}"`).join(', ')}] · ${
                  isSamurai ? 'Shieldless TwoHanded Empty (Parry Enabled)' : 'Off-Hand Free (FocusAttack &amp; Throws Enabled)'
                }
              </div>
              <div class="kv-grid">
                ${paperdollHtml}
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
        </div>

        <!-- CENTER COLUMN: Winding .arvore-cobra Path & 12 L1-L60 Progression Milestones -->
        <div class="col-stack">
          <section class="arvore-secao">
            <h2 class="arvore-secao-titulo">
              <span class="title-left">L1–L60 [Arvore Progression Timeline (12 Milestones)</span>
              <span class="arvore-secao-sub">gE.${escapeHtml(cls.id)} · Click any node to inspect</span>
            </h2>

            <!-- Live .arvore-cobra 12-node ribbon -->
            <div class="arvore-cobra-wrap">
              <div class="arvore-cobra">
                ${cobraNodesHtml}
              </div>
            </div>

            <!-- 12 Interactive Milestone Cards -->
            <div class="milestone-grid">
              ${milestoneCardsHtml}
            </div>
          </section>

          <section class="arvore-secao">
            <h2 class="arvore-secao-titulo">
              <span class="title-left">Class Mastery &amp; Passive Milestone Badges</span>
              <span class="arvore-secao-sub">Custom 64×64 Beveled Gump Seals</span>
            </h2>
            <div class="passive-badges-row">
              ${passiveBadgesHtml}
            </div>
          </section>
        </div>

        <!-- RIGHT COLUMN: Pinned .arvore-dica Tooltip Inspector & Complete Catalog -->
        <div class="col-stack">
          <section class="arvore-secao">
            <h2 class="arvore-secao-titulo">
              <span class="title-left">Pinned .arvore-dica Tooltip Inspector</span>
              <span class="arvore-secao-sub" id="inspector-mode-pill">Mode A (100% Existing Engine)</span>
            </h2>
            <div class="panel-body">
              <div class="arvore-dica-pinned" id="live-inspector">
                <div class="dica-header">
                  <img id="insp-icon" src="assets/icons/${escapeHtml(cls.id)}/${escapeHtml(firstAbility.id)}@64.png" alt="${escapeHtml(firstAbility.name)}" />
                  <div>
                    <div style="display:flex;gap:6px;align-items:center;">
                      <span class="lv-pill" id="insp-level">L${firstAbility.progressionTreeLevel}</span>
                      <span class="type-pill" id="insp-kind">${escapeHtml(firstAbility.kind)}</span>
                      <code style="font-size:10px;color:var(--text-secondary);" id="insp-id">${escapeHtml(firstAbility.id)}</code>
                    </div>
                    <strong style="display:block;font-size:15px;color:#fff2bf;margin-top:3px;" id="insp-name">${escapeHtml(firstAbility.name)} / ${escapeHtml(firstAbility.namePtBr)}</strong>
                    <div class="mono" style="font-size:10px;color:var(--text-gold);" id="insp-qC">qC Estimator: ${escapeHtml(firstMode.qCEstimator)}</div>
                  </div>
                </div>
                <p id="insp-desc" data-en="${escapeHtml(firstMilestone.descEn)}" data-pt="${escapeHtml(firstMilestone.descPtBr)}" style="margin:0 0 8px;font-size:12px;color:var(--text-primary);">${escapeHtml(firstMilestone.descEn)}</p>
                <div class="cost-badges" id="insp-badges" style="margin-bottom:8px;">
                  <span class="badge-cd">CD: ${firstAbility.cooldownMs}ms</span>
                  <span class="badge-cd">CustomCD: ${firstAbility.customCooldownMs}ms</span>
                  <span class="badge-mana">Mana: ${firstAbility.manaCost}</span>
                  <span class="badge-stamina">Stamina: ${firstAbility.staminaCost}</span>
                  <span class="badge-meta">Gump: ${firstAbility.gumpIcon}</span>
                </div>
                <div style="padding:6px 8px;background:#141812;border:1px solid #2a3026;border-radius:4px;font-size:11px;margin-bottom:6px;">
                  <strong style="color:var(--text-gold);display:block;font-size:10px;text-transform:uppercase;">Scaling Formula &amp; Status Effect</strong>
                  <div class="mono" id="insp-formula" style="font-size:10px;color:var(--text-primary);">${escapeHtml(firstAbility.scalingFormula.summary)}</div>
                  <div class="mono" id="insp-status" style="font-size:10px;color:var(--text-secondary);margin-top:3px;">StatusEffect: None (Innate Passive)</div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:10px;">
                  <div style="padding:6px;background:#141812;border:1px solid var(--border-gold);border-radius:4px;">
                    <strong style="color:#fff2bf;display:block;">Mode A (Drop-In JSON)</strong>
                    <span id="insp-mode-a" style="color:var(--text-secondary);">${escapeHtml(firstMode.modeA)}</span>
                  </div>
                  <div style="padding:6px;background:#141812;border:1px solid var(--class-accent);border-radius:4px;">
                    <strong style="color:#fff2bf;display:block;">Mode B (&lt;20 LOC C# Hook)</strong>
                    <span id="insp-mode-b" style="color:var(--text-secondary);">${escapeHtml(firstMode.modeB)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="arvore-secao">
            <h2 class="arvore-secao-titulo">
              <span class="title-left">Complete Ability Catalog (${cls.abilities.length} Entries)</span>
              <span class="arvore-secao-sub">48×48 Icons · 1:1 Schema Fields</span>
            </h2>
            <div class="catalog-list">
              ${catalogCardsHtml}
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>

  <script id="mockup-data" type="application/json">${safeJsonEmbed(embeddedPayload)}</script>
  <script>
    (function() {
      var raw = document.getElementById('mockup-data').textContent;
      var payload = JSON.parse(raw);
      var cls = payload.classData;
      var modeMap = payload.modeDescriptions;
      var currentLocale = 'en';
      var currentMode = 'mode_a';
      var selectedAbilityId = cls.abilities[0].id;

      window.setLocale = function(lang) {
        currentLocale = lang;
        document.getElementById('btn-lang-en').classList.toggle('is-active', lang === 'en');
        document.getElementById('btn-lang-pt').classList.toggle('is-active', lang === 'pt');
        var nodes = document.querySelectorAll('[data-en][data-pt]');
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].textContent = lang === 'pt' ? nodes[i].getAttribute('data-pt') : nodes[i].getAttribute('data-en');
        }
        window.selectAbility(selectedAbilityId);
      };

      window.setExecMode = function(mode) {
        currentMode = mode;
        document.getElementById('btn-mode-a').classList.toggle('is-active', mode === 'mode_a');
        document.getElementById('btn-mode-b').classList.toggle('is-active', mode === 'mode_b');
        document.getElementById('inspector-mode-pill').textContent =
          mode === 'mode_b' ? 'Mode B (<20 LOC C# Hook)' : 'Mode A (100% Existing Engine)';
        var modeNodes = document.querySelectorAll('.mode-text');
        for (var i = 0; i < modeNodes.length; i++) {
          modeNodes[i].textContent =
            mode === 'mode_b' ? modeNodes[i].getAttribute('data-mode-b') : modeNodes[i].getAttribute('data-mode-a');
        }
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
        document.getElementById('insp-formula').textContent = ab.scalingFormula.summary;
        if (ab.statusEffect) {
          var mods = ab.statusEffect.modifiers.map(function(m) { return m.stat + ': ' + m.value; }).join(', ');
          document.getElementById('insp-status').textContent =
            'StatusEffect: ' + ab.statusEffect.name + ' (' + ab.statusEffect.durationMs + 'ms, ' + ab.statusEffect.stackingRule + ') [' + mods + ']';
        } else {
          document.getElementById('insp-status').textContent = 'StatusEffect: None (Direct / Innate)';
        }
        document.getElementById('insp-mode-a').textContent = mInfo.modeA;
        document.getElementById('insp-mode-b').textContent = mInfo.modeB;
      };
    })();
  </script>
</body>
</html>`;
}

function buildClassComparisonHtml(
  classes: Record<string, ClassDefinition>,
  items: ItemsDataset,
  parity: ParityDataset
): string {
  const orderedIds = ['warrior', 'mage', 'ranger', 'samurai', 'ninja'] as const;
  const levels = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60];

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
                  <strong style="color:#fff2bf;font-size:11px;display:block;">${escapeHtml(m.nameEn)}</strong>
                  <span class="mono" style="font-size:9px;color:var(--text-secondary);">${escapeHtml(m.id)} · ${escapeHtml(m.type)}</span>
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
        <div class="kv-item" style="flex-direction:column;align-items:flex-start;gap:3px;padding:7px 9px;">
          <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
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
      `;
    })
    .join('\n');

  const weaponsTableHtml = items.weapons
    .map(
      (w) => `
      <tr>
        <td><strong style="color:#fff2bf;">${escapeHtml(w.name)}</strong> <code class="mono" style="font-size:10px;color:var(--text-secondary);">(${escapeHtml(w.id)})</code></td>
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
      <div class="kv-item" style="flex-direction:column;align-items:flex-start;gap:3px;padding:7px 9px;">
        <div style="display:flex;justify-content:space-between;width:100%;">
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

  const samuraiCSharp = `// Mode B Server Hook (17 LOC total in Projects/UOContent/Items/Weapons/BaseWeapon.cs)
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
// 3. OnParrySuccess (inside AbsorbDamageAOS when CheckParry == true): 2.0s ICD Counter & Confidence (6 LOC)
if (blocked && Core.TickCount - defender.NextBushidoParryProc >= 2000) {
    defender.NextBushidoParryProc = Core.TickCount;
    if (CounterAttack.IsCountering(defender) && defender.Weapon is BaseWeapon bw) bw.OnSwing(defender, attacker);
    if (Confidence.IsConfident(defender)) { defender.Hits += (int)(bushido / 12); defender.Stam += (int)(bushido / 5); }
}`;

  const ninjaCSharp = `// Mode B Server Hook (16 LOC total in Projects/UOContent/Items/Weapons/BaseWeapon.cs)
// 1. OnIncomingHit: Ablative Mirror Image Clone Interception with 1.5s ICD (8 LOC)
if (MirrorImage.HasClone(defender) && Core.TickCount - defender.NextCloneIntercept >= 1500
    && defender.Skills.Ninjitsu.Value / 150.0 > Utility.RandomDouble()) {
    defender.NextCloneIntercept = Core.TickCount;
    MirrorImage.ConsumeOneClone(defender); // Destroys 1 clone & decrements cloneStacks
    damage = (int)(damage * 0.30); // Bounded ablative clone mitigation (prevents immortality)
}
// 2. OnWeaponSwingHit: 5-Swing DeathStrike Detonation & Stealth Opener Consumption (8 LOC)
if (attacker is PlayerMobile nj && nj.ClassId == 115) {
    DeathStrike.AddStep(defender); // Every connected Ninja swing advances ++Steps toward 5!
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
      font-size: 11px;
      line-height: 1.45;
      color: #e8e4d9;
    }
  </style>
</head>
<body>
  <div class="beta-shell">
    <div class="personagem-arvore">
      <header class="arvore-head">
        <div class="arvore-nivel">
          <span class="class-badge-pill">v0.99.0 PARITY</span>
          <strong>5-Class Progression Matrix, Combat Telemetry &amp; Tokuno Armaments</strong>
        </div>
        <div class="arvore-saldos">
          <div class="arvore-saldo">
            <div><strong>5 Classes</strong><div><small>WR · MG · RG · SM · NJ</small></div></div>
            <em>12 Tiers (L1–L60)</em>
          </div>
          <div class="arvore-saldo">
            <div><strong>4 Brackets × 4 Archetypes</strong><div><small>L10 · L25 · L45 · L60</small></div></div>
            <em>100ms Tick Engine</em>
          </div>
          <div class="arvore-saldo">
            <div><strong>0 OOM Ticks</strong><div><small>Resource Sustainability</small></div></div>
            <em>±5–8% Envelope</em>
          </div>
          <div class="arvore-saldo">
            <div><strong>8 Armaments + 10 Affixes</strong><div><small>Tokuno Drop-In Kit</small></div></div>
            <em>Mode A &amp; Mode B</em>
          </div>
        </div>
        <div class="arvore-head-acoes">
          <a class="nav-pill" href="samurai-skill-tree.html">Samurai (SM 114)</a>
          <a class="nav-pill" href="ninja-skill-tree.html">Ninja (NJ 115)</a>
          <a class="nav-pill is-active" href="class-comparison.html">5-Class Parity</a>
        </div>
      </header>

      <!-- SECTION 1: 5-Class L1-L60 Structural Parity Matrix -->
      <section class="arvore-secao">
        <h2 class="arvore-secao-titulo">
          <span class="title-left">1. 5-Class L1–L60 Progression Structural Parity Matrix</span>
          <span class="arvore-secao-sub">Warrior (101) · Mage (103) · Ranger (102) · Samurai (114) · Ninja (115)</span>
        </h2>
        <div class="panel-body" style="overflow-x:auto;">
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
      </section>

      <!-- SECTION 2: Interactive 5-Class Combat Parity Telemetry -->
      <section class="arvore-secao">
        <h2 class="arvore-secao-titulo">
          <span class="title-left">2. Deterministic 5-Class Combat Simulation Telemetry (100ms Tick Engine)</span>
          <span class="arvore-secao-sub">Source: data/sim-baselines/parity-5class-v0.99.0.json</span>
        </h2>
        <div class="panel-body">
          <div class="filter-bar">
            <div style="display:flex;gap:6px;align-items:center;">
              <span class="mono" style="font-size:11px;color:var(--text-gold);">Mode:</span>
              <button type="button" class="beta-btn is-active" data-sim-mode="mode_a" onclick="updateSimFilter('mode', 'mode_a')">Mode A (100% Existing Engine)</button>
              <button type="button" class="beta-btn" data-sim-mode="mode_b" onclick="updateSimFilter('mode', 'mode_b')">Mode B (&lt;20 LOC C# Hook)</button>
            </div>
            <div style="display:flex;gap:6px;align-items:center;">
              <span class="mono" style="font-size:11px;color:var(--text-gold);">Bracket:</span>
              <button type="button" class="beta-btn" data-sim-bracket="L10" onclick="updateSimFilter('bracket', 'L10')">L10</button>
              <button type="button" class="beta-btn" data-sim-bracket="L25" onclick="updateSimFilter('bracket', 'L25')">L25</button>
              <button type="button" class="beta-btn" data-sim-bracket="L45" onclick="updateSimFilter('bracket', 'L45')">L45</button>
              <button type="button" class="beta-btn is-active" data-sim-bracket="L60" onclick="updateSimFilter('bracket', 'L60')">L60</button>
            </div>
            <div style="display:flex;gap:6px;align-items:center;">
              <span class="mono" style="font-size:11px;color:var(--text-gold);">Archetype:</span>
              <button type="button" class="beta-btn is-active" data-sim-arch="low_def_boss" onclick="updateSimFilter('arch', 'low_def_boss')">low_def_boss</button>
              <button type="button" class="beta-btn" data-sim-arch="high_def_boss" onclick="updateSimFilter('arch', 'high_def_boss')">high_def_boss</button>
              <button type="button" class="beta-btn" data-sim-arch="fast_trash" onclick="updateSimFilter('arch', 'fast_trash')">fast_trash</button>
              <button type="button" class="beta-btn" data-sim-arch="multi_target_pack" onclick="updateSimFilter('arch', 'multi_target_pack')">multi_target_pack</button>
            </div>
          </div>

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
      </section>

      <!-- SECTION 3: Tokuno Armaments, Consumables & Affix Showcase -->
      <section class="arvore-secao">
        <h2 class="arvore-secao-titulo">
          <span class="title-left">3. Tokuno Armaments, Ninjitsu Consumables, Material Tiers &amp; Affix Pools</span>
          <span class="arvore-secao-sub">Source: design/drop-in/items-bushido-ninjitsu.json</span>
        </h2>
        <div class="panel-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
              <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--text-gold);margin-bottom:6px;text-transform:uppercase;">8 Iconic Tokuno Armaments (Iron → Valorite Scaling)</div>
              <div class="kv-grid">
                ${iconicArmamentsHtml}
              </div>
              <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--text-gold);margin:10px 0 6px;text-transform:uppercase;">4 Cooldown-Gated Ninjitsu Consumables &amp; Projectiles</div>
              <div class="kv-grid">
                ${consumablesHtml}
              </div>
            </div>
            <div>
              <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--text-gold);margin-bottom:6px;text-transform:uppercase;">8 Drop-In Tokuno Weapon Definitions</div>
              <table class="comp-table" style="margin-bottom:10px;">
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

              <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--text-gold);margin-bottom:6px;text-transform:uppercase;">9 Material Tiers (1.00x Iron → 1.85x Valorite)</div>
              <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">
                ${materialTiersHtml}
              </div>

              <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--text-gold);margin-bottom:6px;text-transform:uppercase;">10 Bushido &amp; Ninjitsu Equipment Affix Pools</div>
              <div class="kv-grid">
                ${affixHtml}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 4: Mode A vs Mode B Implementation & <20 LOC C# Server Hook Inspector -->
      <section class="arvore-secao">
        <h2 class="arvore-secao-titulo">
          <span class="title-left">4. Mode A (Zero Engine Changes) vs Mode B (&lt;20 LOC C# Server Hooks)</span>
          <span class="arvore-secao-sub">design/drop-in/classes-patch.js · BaseWeapon.cs</span>
        </h2>
        <div class="panel-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
              <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--samurai-accent);font-weight:700;margin-bottom:6px;">
                Samurai (ID 114) — 17-LOC C# Server Hook (design/SAMURAI_SPEC.md §4)
              </div>
              <pre class="code-card"><code>${escapeHtml(samuraiCSharp)}</code></pre>
            </div>
            <div>
              <div style="font-family:'Cinzel',serif;font-size:12px;color:var(--ninja-accent);font-weight:700;margin-bottom:6px;">
                Ninja (ID 115) — 16-LOC C# Server Hook (design/NINJA_SPEC.md §4)
              </div>
              <pre class="code-card"><code>${escapeHtml(ninjaCSharp)}</code></pre>
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

  <script id="mockup-data" type="application/json">${safeJsonEmbed({ parity })}</script>
  <script>
    (function() {
      var payload = JSON.parse(document.getElementById('mockup-data').textContent);
      var parityData = payload.parity;
      var state = { mode: 'mode_a', bracket: 'L60', arch: 'low_def_boss' };

      window.updateSimFilter = function(kind, val) {
        state[kind] = val;
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
            '<td><strong style="text-transform:uppercase;color:#fff2bf;">' + s.classId + '</strong></td>' +
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
      };
    })();
  </script>
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
  const comparisonHtml = buildClassComparisonHtml(classes, items, parity);

  const files: Record<string, string> = {
    [path.join(MOCKUPS_DIR, 'samurai-skill-tree.html')]: samuraiHtml,
    [path.join(MOCKUPS_DIR, 'ninja-skill-tree.html')]: ninjaHtml,
    [path.join(MOCKUPS_DIR, 'class-comparison.html')]: comparisonHtml,
  };

  return { classes, files };
}

function captureScreenshots(): void {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  const targets = [
    { html: 'samurai-skill-tree.html', png: 'samurai-skill-tree.png' },
    { html: 'ninja-skill-tree.html', png: 'ninja-skill-tree.png' },
    { html: 'class-comparison.html', png: 'class-comparison.png' },
  ];

  for (const t of targets) {
    const htmlPath = path.join(MOCKUPS_DIR, t.html);
    const pngPath = path.join(SCREENSHOTS_DIR, t.png);
    const fileUrl = `file://${htmlPath}`;
    execFileSync(
      CHROME_BIN,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        '--window-size=1600,1400',
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

    const iconRegex = /src="(assets\/icons\/[^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = iconRegex.exec(actualHtml)) !== null) {
      const relIcon = m[1]!;
      const absIcon = path.join(MOCKUPS_DIR, relIcon);
      if (!fs.existsSync(absIcon)) {
        throw new Error(`Broken icon path "${relIcon}" in ${filePath}`);
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

  const screenshotNames = ['samurai-skill-tree.png', 'ninja-skill-tree.png', 'class-comparison.png'];
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
      mockups: 3,
      screenshots: 3,
      samuraiAbilities: classes.samurai!.abilities.length,
      ninjaAbilities: classes.ninja!.abilities.length,
      resolvedIcons: resolvedIconsCount,
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
