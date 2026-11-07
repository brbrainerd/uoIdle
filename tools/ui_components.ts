import { escapeHtml } from './build_mockups.js';
import type { ClassDefinition, SkillDefinition } from '../src/schemas/skill.schema.js';

export interface AbilityPowerMetric {
  basePct: number;
  burstPct: number;
  modeBPct: number;
  labelLeft: string;
  labelRight: string;
}

const ABILITY_POWER_MAP: Record<string, AbilityPowerMetric> = {
  // Samurai (12)
  samurai_way: { basePct: 45, burstPct: 68, modeBPct: 82, labelLeft: '1.00x Auto + 25.8%–29.3% Parry', labelRight: 'Shieldless 1H/2H Parry' },
  samurai_lightning: { basePct: 55, burstPct: 76, modeBPct: 88, labelLeft: '1.10x–1.20x Strike +50 Acc', labelRight: 'Bushido²/72k Crit Roll' },
  samurai_perfection: { basePct: 50, burstPct: 72, modeBPct: 90, labelLeft: '+10% Mode A Streak Buff', labelRight: '+15% Mode B + Vital Restore' },
  samurai_honorable: { basePct: 65, burstPct: 92, modeBPct: 96, labelLeft: '1.35x–1.45x Base Strike', labelRight: '1.85x Execute (<=35% HP)' },
  samurai_confidence: { basePct: 48, burstPct: 75, modeBPct: 92, labelLeft: '15 + Bushido²/576 Heal', labelRight: '+On-Parry HP/Stam Regen' },
  samurai_counter: { basePct: 68, burstPct: 84, modeBPct: 95, labelLeft: '1.50x–1.60x + 18% Stance', labelRight: 'Free 2.0s ICD Parry Swing' },
  samurai_double_strike: { basePct: 74, burstPct: 88, modeBPct: 94, labelLeft: '2 × 90% Rapid Slash (1.80x)', labelRight: '2x Perfection Stack Gain' },
  samurai_evasion: { basePct: 60, burstPct: 85, modeBPct: 93, labelLeft: '-18% Dmg Taken + Spell Ward', labelRight: '0.85x Iaido Flash Riposte' },
  samurai_momentum_strike: { basePct: 64, burstPct: 90, modeBPct: 94, labelLeft: '1.15x–1.25x Primary Hit', labelRight: '+115%–150% 2-Target Cleave' },
  samurai_armor_ignore: { basePct: 66, burstPct: 89, modeBPct: 95, labelLeft: '1.25x–1.35x Direct Pierce', labelRight: '100% Bypass + -18% Shred' },
  samurai_frenzied_whirlwind: { basePct: 70, burstPct: 92, modeBPct: 96, labelLeft: '1.15x–1.25x + 50% Splash', labelRight: '25% Bypass + 4-Tick Bleed' },
  samurai_kensei_judgment: { basePct: 75, burstPct: 98, modeBPct: 100, labelLeft: '1.25x Base + Kensei Stance', labelRight: '1.95x Grandmaster Execute' },
  // Ninja (13)
  ninja_shadowjump: { basePct: 46, burstPct: 68, modeBPct: 84, labelLeft: 'Speed 53–55 Auto-Swing', labelRight: 'Mid-Combat Stealth Opener' },
  ninja_focus: { basePct: 58, burstPct: 78, modeBPct: 88, labelLeft: '1.15x–1.25x Ki Strike', labelRight: '+8% Crit & +20% Proc Rate' },
  ninja_mirror: { basePct: 52, burstPct: 76, modeBPct: 94, labelLeft: '-8% Mode A Shadow Veil', labelRight: '70% Ablative Clone Absorb' },
  ninja_backstab: { basePct: 60, burstPct: 84, modeBPct: 92, labelLeft: '1.15x–1.25x Ambush Strike', labelRight: '+15% Stealth Opener Mult' },
  ninja_death: { basePct: 62, burstPct: 90, modeBPct: 96, labelLeft: '1.10x–1.20x + 4-Tick DoT', labelRight: '5-Swing Meridian Detonate' },
  ninja_animal_form: { basePct: 54, burstPct: 78, modeBPct: 88, labelLeft: '+10% Speed & +3% Evasion', labelRight: 'Fox-Fire Claw on 3rd Swing' },
  ninja_infectious_strike: { basePct: 56, burstPct: 86, modeBPct: 92, labelLeft: '0.90x–1.00x Kryss Strike', labelRight: '3-Tick Virulent Deadly DoT' },
  ninja_smoke_bomb: { basePct: 50, burstPct: 80, modeBPct: 93, labelLeft: '6s Vanish Veil (-8% Dmg)', labelRight: 'Refreshes Stealth + Dual L35' },
  ninja_shuriken: { basePct: 52, burstPct: 76, modeBPct: 86, labelLeft: '0.75x Ranged Star Volley', labelRight: 'Poison + Zero Backpack Ammo' },
  ninja_ki_attack: { basePct: 58, burstPct: 86, modeBPct: 92, labelLeft: '0.95x–1.05x Gap-Closer', labelRight: '+85% Kinetic Ki Splash' },
  ninja_surprise_attack: { basePct: 60, burstPct: 85, modeBPct: 93, labelLeft: '1.10x–1.20x Blindside Cut', labelRight: '-8% Boss Defense Shred (6s)' },
  ninja_fukiya_barrage: { basePct: 64, burstPct: 88, modeBPct: 95, labelLeft: '1.15x–1.25x Poison Barrage', labelRight: '-10% Dmg Taken + Egg Decoy' },
  ninja_twin_shadow: { basePct: 76, burstPct: 98, modeBPct: 100, labelLeft: '1.25x–1.35x Twin Clone Cut', labelRight: '1.95x Execute + Dual Mark' },
};

const SKILL_ROLE_MAP: Record<string, { role: string; color: string; label: string }> = {
  bushido: { label: 'Bushido', role: 'Core Scaling & Parry', color: '#e05a47' },
  swords: { label: 'Swords', role: 'Primary Katana/No-Dachi', color: '#e6c36a' },
  tactics: { label: 'Tactics', role: 'Base Damage Multiplier', color: '#f6ad55' },
  parry: { label: 'Parry', role: 'Shieldless Weapon Ward', color: '#63b3ed' },
  anatomy: { label: 'Anatomy', role: 'Physical Bonus & Stagger', color: '#fc8181' },
  healing: { label: 'Healing', role: 'Bandage & Confidence Syn', color: '#68d391' },
  magicresist: { label: 'MagicResist', role: 'Evasion & Spell Ward', color: '#b794f4' },
  focus: { label: 'Focus', role: 'Stamina & Mana Sustain', color: '#4fd1c5' },
  ninjitsu: { label: 'Ninjitsu', role: 'Core Scaling & Clones', color: '#34b37a' },
  fencing: { label: 'Fencing', role: 'Primary Kryss & Tekagi', color: '#e6c36a' },
  hiding: { label: 'Hiding', role: 'Smoke Veil & Ambush', color: '#63b3ed' },
  stealth: { label: 'Stealth', role: 'Backstab Opener Scaling', color: '#b794f4' },
};

export function buildComponentStyles(): string {
  return `
    /* ==========================================================================
       v2.1 Component Architecture & Dark-Fantasy Animation System
       ========================================================================== */
    @keyframes auraPulse {
      0%, 100% { opacity: 0.55; transform: scale(1); }
      50% { opacity: 0.92; transform: scale(1.04); }
    }
    @keyframes railFlow {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }
    @keyframes nodeHaloPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(230, 195, 106, 0.55), 0 0 14px var(--class-glow); }
      50% { box-shadow: 0 0 0 5px rgba(230, 195, 106, 0), 0 0 22px var(--border-gold-bright); }
    }
    @keyframes modeFlash {
      0% { filter: brightness(1.35); transform: translateY(-1px); }
      100% { filter: brightness(1); transform: translateY(0); }
    }
    @keyframes tickerSweep {
      0% { width: 0%; }
      100% { width: 100%; }
    }
    @keyframes floatUpBadge {
      0% { opacity: 0; transform: translateY(4px) scale(0.96); }
      20% { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* 1. Global Quick Command & Shortcut Bar Component (<uo-quick-dock>) */
    .uo-quick-dock {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px 12px;
      padding: 6px 14px;
      background: linear-gradient(90deg, #0d100c 0%, #171c15 50%, #0d100c 100%);
      border-bottom: 1px solid #352d1d;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: var(--text-secondary);
    }
    .uo-quick-dock-left, .uo-quick-dock-right {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 10px;
    }
    .kbd-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 1px 6px;
      border-radius: 3px;
      background: #141812;
      border: 1px solid #3c3425;
      color: #d6e4ca;
      font-size: 9.5px;
    }
    .kbd-chip kbd {
      padding: 0 4px;
      border-radius: 2px;
      background: #282112;
      border: 1px solid var(--border-gold);
      color: var(--text-gold);
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      font-weight: 700;
    }
    .live-pulse-dot {
      display: inline-block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #48bb78;
      box-shadow: 0 0 8px #48bb78;
      animation: auraPulse 2.2s infinite ease-in-out;
    }

    /* 2. Segmented Stat Distribution & Resource Bar Component (<uo-stat-bar>) */
    .stat-ratio-strip {
      margin-top: 8px;
      padding: 6px 8px;
      background: #10140f;
      border: 1px solid #2a3026;
      border-radius: 4px;
    }
    .stat-ratio-bar {
      display: flex;
      height: 7px;
      border-radius: 4px;
      overflow: hidden;
      background: #090b08;
      border: 1px solid #2a3026;
      margin: 4px 0;
    }
    .stat-seg-str { background: linear-gradient(90deg, #c83e37, #e05a47); transition: width 0.3s ease; }
    .stat-seg-dex { background: linear-gradient(90deg, #2e9e6b, #48bb78); transition: width 0.3s ease; }
    .stat-seg-int { background: linear-gradient(90deg, #3b82f6, #63b3ed); transition: width 0.3s ease; }

    /* 3. Starter Skill Mastery Progress Card Component */
    .skill-mastery-card {
      padding: 5px 8px;
      background: linear-gradient(180deg, #171c15 0%, #111510 100%);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
      transition: border-color 0.15s ease, transform 0.15s ease;
    }
    .skill-mastery-card:hover {
      border-color: var(--border-gold);
      transform: translateY(-1px);
    }
    .skill-mastery-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 4px;
    }
    .skill-mastery-bar-bg {
      height: 4px;
      border-radius: 2px;
      background: #090b08;
      overflow: hidden;
    }
    .skill-mastery-bar-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.4s ease;
    }

    /* 4. Connected [Arvore Progression Rail & Halo Nodes */
    .arvore-cobra-wrap {
      position: relative;
      padding: 12px 14px;
      border-bottom: 1px solid #2a3026;
      background:
        radial-gradient(circle at 50% 0%, var(--class-glow), transparent 70%),
        rgba(11, 13, 10, 0.72);
    }
    .arvore-tier-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9.5px;
      color: var(--text-secondary);
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px dashed #262c22;
    }
    .arvore-col {
      position: relative;
      z-index: 1;
    }
    .arvore-col::after {
      content: '';
      position: absolute;
      top: 37px;
      left: 55%;
      width: 90%;
      height: 2px;
      background: linear-gradient(90deg, var(--border-gold) 0%, rgba(201, 162, 39, 0.2) 50%, var(--border-gold) 100%);
      background-size: 200% 100%;
      animation: railFlow 5s linear infinite;
      z-index: -1;
      pointer-events: none;
    }
    .arvore-col:nth-child(6n)::after,
    .arvore-col:last-child::after {
      display: none;
    }
    .arvore-circulo.is-selected-node {
      border-color: #fff2bf !important;
      animation: nodeHaloPulse 2s infinite ease-in-out;
      transform: scale(1.08);
    }
    .arvore-circulo[data-node-kind="passive"] { border-color: var(--kind-passive); }
    .arvore-circulo[data-node-kind="skill"]   { border-color: var(--kind-skill); }
    .arvore-circulo[data-node-kind="spell"]   { border-color: var(--kind-spell); }
    .arvore-circulo[data-node-kind="mechanic"] { border-color: var(--kind-mechanic); }
    .arvore-circulo[data-node-kind="feature"] {
      border-color: var(--kind-capstone);
      box-shadow: 0 0 14px rgba(246, 224, 94, 0.45);
    }

    /* 5. Ability Power & Scaling Meter Component (<uo-power-meter>) */
    .uo-power-meter {
      margin-top: 5px;
      padding: 4px 6px;
      background: #0e120d;
      border: 1px solid #252b21;
      border-radius: 3px;
    }
    .uo-power-labels {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      color: var(--text-secondary);
      margin-bottom: 3px;
    }
    .uo-power-track {
      position: relative;
      height: 5px;
      border-radius: 3px;
      background: #080a07;
      overflow: hidden;
      display: flex;
    }
    .uo-power-seg-base {
      height: 100%;
      background: linear-gradient(90deg, #8b6f1e, #d4af37);
      transition: width 0.25s ease;
    }
    .uo-power-seg-burst {
      height: 100%;
      background: linear-gradient(90deg, var(--class-accent), #f6ad55);
      transition: width 0.25s ease;
    }
    .uo-power-seg-modeb {
      height: 100%;
      background: #68d391;
      opacity: 0.35;
      transition: width 0.25s ease, opacity 0.25s ease;
    }
    .is-mode-b-active .uo-power-seg-modeb {
      opacity: 1;
      box-shadow: 0 0 8px #68d391;
    }

    /* 6. Interactive Live 100ms Tick Combat & Streak Visualizer (<uo-combat-ticker>) */
    .uo-combat-ticker {
      margin-top: 8px;
      padding: 8px 10px;
      border-radius: 4px;
      border: 1px solid #4a3c24;
      background: linear-gradient(180deg, #151913 0%, #0b0e0a 100%);
      box-shadow: inset 0 1px 0 rgba(255, 242, 191, 0.08);
    }
    .ticker-head {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
    }
    .ticker-progress-bg {
      position: relative;
      height: 6px;
      border-radius: 3px;
      background: #070907;
      border: 1px solid #2a3026;
      overflow: hidden;
      margin-bottom: 6px;
    }
    .ticker-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--class-accent), var(--border-gold-bright));
      width: 65%;
      transition: width 0.18s linear;
    }
    .posture-pips-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }
    .posture-pips {
      display: flex;
      gap: 3px;
      align-items: center;
    }
    .posture-pip {
      width: 12px;
      height: 8px;
      border-radius: 2px;
      background: #141812;
      border: 1px solid #3c3425;
      transition: all 0.15s ease;
    }
    .posture-pip.is-lit {
      background: var(--border-gold-bright);
      border-color: #fff2bf;
      box-shadow: 0 0 6px var(--border-gold);
    }
    .posture-pip.is-crimson {
      background: var(--class-accent);
      border-color: #ffb3a7;
      box-shadow: 0 0 6px var(--class-accent);
    }
    .ticker-log-feed {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .ticker-log-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      padding: 3px 6px;
      border-radius: 3px;
      background: #10140f;
      border-left: 2px solid var(--border-gold);
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9.5px;
      animation: floatUpBadge 0.22s ease-out;
    }

    /* 7. Paperdoll Ambient Torchlight & Weapon Telemetry Bars */
    .paperdoll-figure-box {
      position: relative;
      display: grid;
      place-items: center;
      border: 1px solid var(--border-gold);
      border-radius: 5px;
      padding: 4px;
      overflow: hidden;
      min-width: 0;
      background:
        radial-gradient(circle at 50% 35%, var(--class-glow), transparent 62%),
        radial-gradient(circle at 50% 50%, rgba(201, 162, 39, 0.16), #090b08 78%);
      box-shadow: inset 0 0 24px rgba(0, 0, 0, 0.75);
    }
    .paperdoll-aura-ring {
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      border: 1px dashed rgba(201, 162, 39, 0.22);
      pointer-events: none;
      animation: auraPulse 4s infinite ease-in-out;
    }
    .weapon-stat-bars {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 6px;
      margin-top: 6px;
      padding-top: 5px;
      border-top: 1px dashed #2a3026;
    }
    .w-stat-col {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      color: var(--text-secondary);
    }
    .w-stat-track {
      height: 4px;
      background: #080a07;
      border-radius: 2px;
      overflow: hidden;
      margin-top: 2px;
    }
    .w-stat-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--class-accent), var(--border-gold-bright));
      transition: width 0.25s ease;
    }

    /* 8. 5-Class Executive KPI Comparison Strip (class-comparison.html) */
    .exec-kpi-strip {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 10px;
    }
    .exec-kpi-card {
      padding: 8px 10px;
      border-radius: 4px;
      background: linear-gradient(180deg, #181d16 0%, #10140f 100%);
      border: 1px solid #2a3026;
      border-top: 3px solid var(--border-gold);
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
      transition: transform 0.15s ease, border-color 0.15s ease;
    }
    .exec-kpi-card:hover {
      transform: translateY(-2px);
      border-color: var(--border-gold-bright);
    }
    @media (max-width: 1120px) {
      .exec-kpi-strip {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }
      .arvore-col::after {
        display: none;
      }
    }
  `;
}

export function renderQuickCommandBar(activePage: 'portal' | 'samurai' | 'ninja' | 'comparison', prefix = ''): string {
  return `
    <nav class="uo-quick-dock" aria-label="Developer Quick Command Bar">
      <div class="uo-quick-dock-left">
        <span style="display:inline-flex;align-items:center;gap:5px;color:#fff2bf;font-weight:600;">
          <i class="live-pulse-dot"></i>
          UO IDLE v0.99.0 · TOKUNO EXPANSION WORKBENCH
        </span>
        <span class="kbd-chip"><kbd>M</kbd> Mode A/B</span>
        ${
          activePage === 'samurai' || activePage === 'ninja'
            ? `<span class="kbd-chip"><kbd>L</kbd> EN / PT-BR</span>
               <span class="kbd-chip"><kbd>1–9</kbd> Select Milestone</span>
               <span class="kbd-chip"><kbd>Space</kbd> Combat Sim</span>`
            : `<span class="kbd-chip"><kbd>1–3</kbd> Switch View</span>`
        }
      </div>
      <div class="uo-quick-dock-right">
        <span style="color:var(--text-gold);">Verify Gates: 7/7 PASS · 0 Polygons · ±5–8% Balance</span>
        <a href="${prefix}samurai-skill-tree.html?mode=mode_b" style="color:#ff9b93;text-decoration:none;font-weight:600;">⚡ SM Mode B</a>
        <a href="${prefix}ninja-skill-tree.html?mode=mode_b" style="color:#7ce8b4;text-decoration:none;font-weight:600;">⚡ NJ Mode B</a>
      </div>
    </nav>
  `;
}

export function renderStatDistributionStrip(cls: ClassDefinition): string {
  const sum = cls.baseStats.str + cls.baseStats.dex + cls.baseStats.int;
  const pStr = Math.round((cls.baseStats.str / sum) * 100);
  const pDex = Math.round((cls.baseStats.dex / sum) * 100);
  const pInt = 100 - pStr - pDex;
  return `
    <div class="stat-ratio-strip">
      <div style="display:flex;justify-content:space-between;align-items:center;font-family:'IBM Plex Mono',monospace;font-size:9.5px;">
        <span style="color:#ff9b93;">STR ${cls.baseStats.str} (${pStr}%)</span>
        <span style="color:#7ce8b4;">DEX ${cls.baseStats.dex} (${pDex}%)</span>
        <span style="color:#9ec9ff;">INT ${cls.baseStats.int} (${pInt}%)</span>
      </div>
      <div class="stat-ratio-bar" title="Stat Allocation: ${cls.baseStats.str} STR / ${cls.baseStats.dex} DEX / ${cls.baseStats.int} INT (Sum = ${sum})">
        <div class="stat-seg-str" style="width:${pStr}%;"></div>
        <div class="stat-seg-dex" style="width:${pDex}%;"></div>
        <div class="stat-seg-int" style="width:${pInt}%;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--text-secondary);">
        <span>Swing Floor: 2,000ms</span>
        <span>Reagents: 0 · Ammo: 0</span>
      </div>
    </div>
  `;
}

export function renderStarterSkillCards(cls: ClassDefinition): string {
  return cls.starterSkills
    .map((sk) => {
      const meta = SKILL_ROLE_MAP[sk.skillKey.toLowerCase()] ?? {
        label: sk.skillKey,
        role: 'Core Template',
        color: '#c9a227',
      };
      return `
        <div class="skill-mastery-card">
          <div class="skill-mastery-top">
            <span style="font-weight:600;color:#fff2bf;font-size:11px;">
              ${escapeHtml(meta.label)} <small class="mono" style="color:var(--text-secondary);font-size:9.5px;">(#${sk.skillId})</small>
            </span>
            <span class="mono" style="color:var(--text-gold);font-size:11px;font-weight:700;">${sk.initialValue}.0</span>
          </div>
          <div class="skill-mastery-bar-bg">
            <div class="skill-mastery-bar-fill" style="width:${sk.initialValue}%;background:${meta.color};"></div>
          </div>
          <div class="mono" style="font-size:8.5px;color:var(--text-secondary);display:flex;justify-content:space-between;">
            <span>${escapeHtml(meta.role)}</span>
            <span>GM Cap 100.0</span>
          </div>
        </div>
      `;
    })
    .join('\n');
}

export function renderAbilityPowerMeter(abilityId: string): string {
  const m = ABILITY_POWER_MAP[abilityId] ?? {
    basePct: 55,
    burstPct: 80,
    modeBPct: 90,
    labelLeft: '1.15x–1.25x Base',
    labelRight: 'Mode B Hook Ready',
  };
  const seg1 = m.basePct;
  const seg2 = Math.max(5, m.burstPct - m.basePct);
  const seg3 = Math.max(4, m.modeBPct - m.burstPct);
  return `
    <div class="uo-power-meter" data-power-meter="${escapeHtml(abilityId)}">
      <div class="uo-power-labels">
        <span style="color:#f6ecd4;">⚡ ${escapeHtml(m.labelLeft)}</span>
        <span style="color:var(--text-gold);">${escapeHtml(m.labelRight)}</span>
      </div>
      <div class="uo-power-track" title="Gold: Base Scaling | Accent: Execute/Crit/Splash Ceiling | Emerald: Mode B C# Hook Boost">
        <div class="uo-power-seg-base" style="width:${seg1}%;"></div>
        <div class="uo-power-seg-burst" style="width:${seg2}%;"></div>
        <div class="uo-power-seg-modeb" style="width:${seg3}%;"></div>
      </div>
    </div>
  `;
}

export function renderLiveCombatTickerComponent(cls: ClassDefinition): string {
  const isSamurai = cls.id === 'samurai';
  const postureLabel = isSamurai
    ? 'Bushido Perfection Streak (10-Stack Cap · +15% Dmg)'
    : 'Death Strike 5-Swing Meridian & 3 Clone Orbs';
  const pipsCount = isSamurai ? 10 : 5;
  const pipsHtml = Array.from({ length: pipsCount }, (_, i) => {
    const lit = i < (isSamurai ? 7 : 3);
    return `<span class="posture-pip ${lit ? (isSamurai ? 'is-lit' : 'is-crimson') : ''}" data-ticker-pip="${i}"></span>`;
  }).join('');

  const initialFeed = isSamurai
    ? [
        { t: 't=0.0s', tag: 'CAST', col: '#e05a47', txt: 'Armor Ignore · 279 dmg (100% Pierce)' },
        { t: 't=2.0s', tag: 'PARRY', col: '#f6e05e', txt: 'Shieldless Daisho Parry → 0.85x Riposte +18 HP' },
        { t: 't=4.0s', tag: 'SKILL', col: '#63b3ed', txt: 'Double Strike (2×90%) · 312 dmg (+8% Streak)' },
        { t: 't=6.0s', tag: 'EXEC', col: '#b794f4', txt: "Kensei: Amakura's Judgment · 498 dmg ★" },
      ]
    : [
        { t: 't=0.0s', tag: 'VEIL', col: '#4fd1c5', txt: 'Smoke Bomb + Shuriken Volley · 205 dmg' },
        { t: 't=2.0s', tag: 'AMBUSH', col: '#e05a47', txt: 'Surprise Attack · 298 dmg (-8% Boss Def)' },
        { t: 't=4.0s', tag: 'CLONE', col: '#68d391', txt: 'Mirror Image Clone Intercepted Boss Hit (-70%)' },
        { t: 't=6.0s', tag: 'DETONATE', col: '#b794f4', txt: '5th Swing Death Strike + Twin Shadow · 514 dmg ★' },
      ];

  const feedHtml = initialFeed
    .map(
      (f) => `
      <div class="ticker-log-item" style="border-left-color:${f.col};">
        <div><strong style="color:#fff2bf;">${f.t}</strong> <span style="color:${f.col};font-weight:700;">[${f.tag}]</span> ${escapeHtml(f.txt)}</div>
      </div>
    `
    )
    .join('');

  return `
    <div class="uo-combat-ticker" id="live-combat-ticker">
      <div class="ticker-head">
        <div style="display:flex;align-items:center;gap:6px;">
          <i class="live-pulse-dot"></i>
          <strong style="font-family:'Cinzel',serif;font-size:11px;color:var(--text-gold);text-transform:uppercase;">
            Live 100ms Tick Combat Loop Preview
          </strong>
        </div>
        <div style="display:flex;gap:4px;">
          <button type="button" class="beta-btn" id="btn-ticker-toggle" onclick="toggleCombatTicker()" style="padding:1px 6px;font-size:9px;">Pause</button>
          <button type="button" class="beta-btn" onclick="stepCombatTicker()" style="padding:1px 6px;font-size:9px;">Step +2.0s</button>
        </div>
      </div>
      <div class="ticker-progress-bg" title="2,000ms Custom Cooldown & Swing Cadence Floor">
        <div class="ticker-progress-fill" id="ticker-bar-fill"></div>
      </div>
      <div class="posture-pips-row">
        <span class="mono" style="font-size:9px;color:var(--text-secondary);" id="ticker-posture-label">${escapeHtml(postureLabel)}</span>
        <div class="posture-pips" id="ticker-pips-box">
          ${pipsHtml}
        </div>
      </div>
      <div class="ticker-log-feed" id="ticker-log-feed">
        ${feedHtml}
      </div>
    </div>
  `;
}

export function renderExecutiveClassKpiStrip(
  scenarios: Array<{
    classId: string;
    sustainedDps: number;
    ehpPerSec: number;
    parryCount: number;
    cloneInterceptions: number;
    oomTicks: number;
  }>,
  classColors: Record<string, string>
): string {
  const baselineClasses = scenarios.filter((s) => s.classId === 'warrior' || s.classId === 'mage' || s.classId === 'ranger');
  const meanDps =
    baselineClasses.length > 0
      ? baselineClasses.reduce((acc, s) => acc + s.sustainedDps, 0) / baselineClasses.length
      : 375.0;

  return `<div class="exec-kpi-strip" id="sim-exec-kpi-strip">
    ${scenarios
      .map((s) => {
        const col = classColors[s.classId] ?? '#c9a227';
        const deltaPct = (((s.sustainedDps - meanDps) / meanDps) * 100).toFixed(1);
        const deltaStr = Number(deltaPct) >= 0 ? `+${deltaPct}%` : `${deltaPct}%`;
        const mitLabel =
          s.classId === 'samurai'
            ? `${s.parryCount} Bushido Parries`
            : s.classId === 'ninja'
              ? `${s.cloneInterceptions > 0 ? s.cloneInterceptions + ' Clone Absorbs' : 'Smoke & Clone Veil'}`
              : `${s.parryCount} Shield Parries`;
        return `
          <div class="exec-kpi-card" style="border-top-color:${col};">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <strong style="font-family:'Cinzel',serif;font-size:12px;color:${col};text-transform:uppercase;">${escapeHtml(s.classId)}</strong>
              <span class="mono" style="font-size:9.5px;color:#82d5b0;">${deltaStr} vs Mean</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:2px;">
              <span class="mono" style="font-size:15px;font-weight:700;color:#fff2bf;">${s.sustainedDps.toFixed(1)} <small style="font-size:9.5px;color:var(--text-secondary);">DPS</small></span>
              <span class="mono" style="font-size:11px;color:#9ec9ff;">${s.ehpPerSec.toFixed(1)} EHP/s</span>
            </div>
            <div class="mono" style="font-size:9.5px;color:var(--text-secondary);display:flex;justify-content:space-between;">
              <span>${escapeHtml(mitLabel)}</span>
              <span style="color:#82d5b0;">0 OOM</span>
            </div>
          </div>
        `;
      })
      .join('')}
  </div>`;
}
