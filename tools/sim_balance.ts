import * as fs from 'node:fs';
import * as path from 'node:path';
import { ClassSchema, type ClassDefinition } from '../src/schemas/skill.schema.js';
import { runClassBaselineSuite } from '../src/sim/engine.js';
import {
  BRACKET_IDS,
  type BracketId,
  type ClassBracketSummary,
  type SimBaselineArtifact,
  type SimImplementationMode,
} from '../src/sim/types.js';

const ROOT_DIR = process.cwd();
const DEFAULT_BASELINE_PATH = 'data/sim-baselines/baseline-v0.99.0.json';
const DEFAULT_PARITY_PATH = 'data/sim-baselines/parity-5class-v0.99.0.json';
const LIVE_CLASS_PATHS = [
  'data/live-classes/warrior.json',
  'data/live-classes/mage.json',
  'data/live-classes/ranger.json',
];
const DROP_IN_CLASS_PATHS = [
  'design/drop-in/samurai.json',
  'design/drop-in/ninja.json',
];

export interface SimParityArtifact {
  version: string;
  tickMs: number;
  classes: string[];
  brackets: BracketId[];
  archetypes: string[];
  mode_a: SimBaselineArtifact;
  mode_b: SimBaselineArtifact;
}

function readJsonFile<T>(relOrAbsPath: string): T {
  const fullPath = path.isAbsolute(relOrAbsPath)
    ? relOrAbsPath
    : path.resolve(ROOT_DIR, relOrAbsPath);
  const raw = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(raw) as T;
}

function loadValidatedClasses(
  classPaths: string[],
  errors: string[]
): ClassDefinition[] {
  const classes: ClassDefinition[] = [];
  for (const relPath of classPaths) {
    try {
      const raw = readJsonFile<unknown>(relPath);
      const parsed = ClassSchema.safeParse(raw);
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          errors.push(`${relPath}#${issue.path.join('.')}: ${issue.message}`);
        }
        continue;
      }
      classes.push(parsed.data);
    } catch (err) {
      errors.push(`${relPath}: failed to read/parse (${String(err)})`);
    }
  }
  return classes;
}

function verifySuiteSanityAndMonotonicity(
  classes: ClassDefinition[],
  run1: SimBaselineArtifact,
  run2: SimBaselineArtifact,
  modeLabel: string,
  errors: string[]
): void {
  // Gate 1: Schema & Scenario Completeness Gate
  const expectedScenarioCount = classes.length * 4 * 4;
  if (run1.scenarios.length !== expectedScenarioCount) {
    errors.push(
      `[${modeLabel}] Expected ${expectedScenarioCount} scenarios (${classes.length}x4x4), got ${run1.scenarios.length}`
    );
  }

  for (const s of run1.scenarios) {
    const label = `${s.classId}[${s.bracketId}/${s.archetypeId}/${modeLabel}]`;
    const numericFields: Array<[string, number]> = [
      ['sustainedDps', s.sustainedDps],
      ['rawDps', s.rawDps],
      ['trashTtkSec', s.trashTtkSec],
      ['overkillWastePct', s.overkillWastePct],
      ['netManaDeltaPerMin', s.netManaDeltaPerMin],
      ['netStaminaDeltaPerMin', s.netStaminaDeltaPerMin],
      ['ehpPerSec', s.ehpPerSec],
    ];
    for (const [field, val] of numericFields) {
      if (typeof val !== 'number' || !Number.isFinite(val) || Number.isNaN(val)) {
        errors.push(`${label}: ${field} is not finite (${String(val)})`);
      }
    }
    if (s.sustainedDps <= 0) {
      errors.push(`${label}: sustainedDps must be > 0, got ${s.sustainedDps}`);
    }
    if (s.trashTtkSec <= 0) {
      errors.push(`${label}: trashTtkSec must be > 0, got ${s.trashTtkSec}`);
    }
    if (s.overkillWastePct < 0) {
      errors.push(`${label}: overkillWastePct must be >= 0, got ${s.overkillWastePct}`);
    }
    if (s.ehpPerSec <= 0) {
      errors.push(`${label}: ehpPerSec must be > 0, got ${s.ehpPerSec}`);
    }
  }

  // Gate 2: Bit-for-Bit Determinism Gate
  const json1 = JSON.stringify(run1);
  const json2 = JSON.stringify(run2);
  if (json1 !== json2) {
    errors.push(
      `[${modeLabel}] Determinism failure: two consecutive in-memory simulation runs differed`
    );
  }

  // Gate 3: Monotonic Progression Scaling Gate (L10 < L25 < L45 < L60)
  const getSummary = (
    classId: string,
    bracketId: BracketId
  ): ClassBracketSummary | undefined =>
    run1.summaryByClassBracket.find(
      (row) => row.classId === classId && row.bracketId === bracketId
    );

  for (const cls of classes) {
    for (let i = 1; i < BRACKET_IDS.length; i++) {
      const prevBracket = BRACKET_IDS[i - 1];
      const currBracket = BRACKET_IDS[i];
      const prevRow = getSummary(cls.id, prevBracket);
      const currRow = getSummary(cls.id, currBracket);
      if (!prevRow || !currRow) {
        errors.push(
          `[${modeLabel}] Missing summary row for ${cls.id} at ${prevBracket} or ${currBracket}`
        );
        continue;
      }
      if (!(currRow.sustainedBossDps > prevRow.sustainedBossDps)) {
        errors.push(
          `[${modeLabel}] Monotonic DPS gate failed for ${cls.id}: ${currBracket} sustainedBossDps (${currRow.sustainedBossDps}) <= ${prevBracket} (${prevRow.sustainedBossDps})`
        );
      }
      if (!(currRow.ehpPerSec > prevRow.ehpPerSec)) {
        errors.push(
          `[${modeLabel}] Monotonic EHP/sec gate failed for ${cls.id}: ${currBracket} ehpPerSec (${currRow.ehpPerSec}) <= ${prevBracket} (${prevRow.ehpPerSec})`
        );
      }
    }
  }

  // Gate 4: Resource & Combat Niche Sanity Gate
  for (const row of run1.summaryByClassBracket) {
    if (row.classId === 'warrior') {
      if (row.netManaDeltaPerMin !== 0) {
        errors.push(
          `[${modeLabel}] Warrior 0-mana invariant violated at ${row.bracketId}: netManaDeltaPerMin=${row.netManaDeltaPerMin}`
        );
      }
    }
    if (row.highDefBossDps >= row.sustainedBossDps) {
      errors.push(
        `[${modeLabel}] Mitigation sanity gate failed for ${row.classId}[${row.bracketId}]: highDefBossDps (${row.highDefBossDps}) >= lowDefBossDps (${row.sustainedBossDps})`
      );
    }
    if (row.bracketId === 'L45' || row.bracketId === 'L60') {
      if (!(row.multiTargetDps > row.sustainedBossDps)) {
        errors.push(
          `[${modeLabel}] AoE/cleave niche sanity gate failed for ${row.classId}[${row.bracketId}]: multiTargetDps (${row.multiTargetDps}) <= sustainedBossDps (${row.sustainedBossDps})`
        );
      }
    }
  }

  for (const s of run1.scenarios) {
    if (s.classId === 'warrior' && s.oomTicks !== 0) {
      errors.push(
        `[${modeLabel}] Warrior 0-mana OOM invariant violated at ${s.bracketId}/${s.archetypeId}: oomTicks=${s.oomTicks}`
      );
    }
  }
}

function verifyBaselineSuite(
  classes: ClassDefinition[],
  run1: SimBaselineArtifact,
  run2: SimBaselineArtifact,
  baselineFilePath: string,
  errors: string[]
): void {
  verifySuiteSanityAndMonotonicity(classes, run1, run2, 'mode_a', errors);

  const json1 = JSON.stringify(run1);
  const absBaseline = path.resolve(ROOT_DIR, baselineFilePath);
  if (!fs.existsSync(absBaseline)) {
    errors.push(`Committed baseline artifact missing at ${baselineFilePath}`);
  } else {
    try {
      const committed = readJsonFile<SimBaselineArtifact>(baselineFilePath);
      if (JSON.stringify(committed) !== json1) {
        errors.push(
          `Baseline drift detected: live simulation output does not match ${baselineFilePath}`
        );
      }
    } catch (err) {
      errors.push(`Failed to read baseline artifact ${baselineFilePath}: ${String(err)}`);
    }
  }
}

function verifyFiveClassParityEnvelope(
  artifact: SimBaselineArtifact,
  modeLabel: SimImplementationMode,
  errors: string[]
): void {
  const tolerance = 0.081; // +/- 8% parity envelope (with 0.1% rounding tolerance for 2-decimal rounded telemetry)
  const getRow = (classId: string, bracketId: BracketId): ClassBracketSummary | undefined =>
    artifact.summaryByClassBracket.find(
      (r) => r.classId === classId && r.bracketId === bracketId
    );

  for (const bracketId of BRACKET_IDS) {
    const w = getRow('warrior', bracketId);
    const m = getRow('mage', bracketId);
    const r = getRow('ranger', bracketId);
    if (!w || !m || !r) {
      errors.push(`[${modeLabel}/${bracketId}] Missing live baseline summary row`);
      continue;
    }

    // At L10 and L25, physical melee classes compare against the physical warrior/ranger DPS envelope
    // while L45 and L60 compare against the unified 3-class envelope
    const refRowsForDps =
      bracketId === 'L10' || bracketId === 'L25' ? [w, r] : [w, m, r];
    const refRowsAll = [w, m, r];

    const checkBand = (
      classId: string,
      metricName: string,
      actual: number,
      refs: number[]
    ): void => {
      const minRef = Math.min(...refs);
      const maxRef = Math.max(...refs);
      const lowerBound = minRef * (1 - tolerance);
      const upperBound = maxRef * (1 + tolerance);
      if (actual < lowerBound || actual > upperBound) {
        errors.push(
          `[${modeLabel}/${bracketId}] Parity gate failed for ${classId}.${metricName}: got ${actual}, expected within [${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}] (live range [${minRef.toFixed(2)}, ${maxRef.toFixed(2)}])`
        );
      }
    };

    for (const dropInId of ['samurai', 'ninja']) {
      const row = getRow(dropInId, bracketId);
      if (!row) {
        errors.push(`[${modeLabel}/${bracketId}] Missing drop-in summary row for ${dropInId}`);
        continue;
      }

      checkBand(
        dropInId,
        'sustainedBossDps',
        row.sustainedBossDps,
        refRowsForDps.map((x) => x.sustainedBossDps)
      );
      checkBand(
        dropInId,
        'highDefBossDps',
        row.highDefBossDps,
        refRowsForDps.map((x) => x.highDefBossDps)
      );
      checkBand(
        dropInId,
        'multiTargetDps',
        row.multiTargetDps,
        refRowsForDps.map((x) => x.multiTargetDps)
      );
      checkBand(
        dropInId,
        'trashTtkSec',
        row.trashTtkSec,
        refRowsAll.map((x) => x.trashTtkSec)
      );
      checkBand(
        dropInId,
        'ehpPerSec',
        row.ehpPerSec,
        refRowsAll.map((x) => x.ehpPerSec)
      );

      // Resource sustainability & anti-starvation gate
      if (row.netManaDeltaPerMin < -195) {
        errors.push(
          `[${modeLabel}/${bracketId}] Mana sustainability gate failed for ${dropInId}: netManaDeltaPerMin=${row.netManaDeltaPerMin} < -195`
        );
      }
      if (row.netStaminaDeltaPerMin < -35) {
        errors.push(
          `[${modeLabel}/${bracketId}] Stamina sustainability gate failed for ${dropInId}: netStaminaDeltaPerMin=${row.netStaminaDeltaPerMin} < -35`
        );
      }
    }
  }
}

function formatMarkdownReport(artifact: SimBaselineArtifact, titleSuffix = '(`SIM-02`)'): string {
  const lines: string[] = [];
  lines.push(`# UO Idle v0.99.0 Combat Simulation Report ${titleSuffix}`);
  lines.push('');
  lines.push(
    `- **Tick Resolution:** \`${artifact.tickMs}ms\` deterministic accumulator state machine`
  );
  lines.push(`- **Classes Simulated:** \`${artifact.classes.join('`, `')}\``);
  lines.push(`- **Progression Brackets:** \`${artifact.brackets.join('`, `')}\``);
  lines.push(`- **Enemy Archetypes:** \`${artifact.archetypes.join('`, `')}\``);
  lines.push(`- **Total Scenarios:** \`${artifact.scenarios.length}\``);
  lines.push('');
  lines.push('## Summary by Class & Progression Bracket');
  lines.push('');
  lines.push(
    '| Class | Bracket | Low-Def Boss DPS | High-Def Boss DPS | Multi-Target Pack DPS | Trash TTK (s) | Overkill Waste % | Net Mana/min | Net Stamina/min | EHP/sec |'
  );
  lines.push('|---|---|---:|---:|---:|---:|---:|---:|---:|---:|');

  for (const row of artifact.summaryByClassBracket) {
    lines.push(
      `| \`${row.classId}\` | **${row.bracketId}** | ${row.sustainedBossDps.toFixed(2)} | ${row.highDefBossDps.toFixed(2)} | ${row.multiTargetDps.toFixed(2)} | ${row.trashTtkSec.toFixed(2)}s | ${row.overkillWastePct.toFixed(2)}% | ${row.netManaDeltaPerMin.toFixed(2)} | ${row.netStaminaDeltaPerMin.toFixed(2)} | ${row.ehpPerSec.toFixed(2)} |`
    );
  }
  lines.push('');
  return lines.join('\n');
}

function main(): void {
  const args = process.argv.slice(2);
  const isBaseline = args.includes('--baseline');
  const isWriteBaseline = args.includes('--write-baseline');
  const isParity = args.includes('--parity');
  const isWriteParity = args.includes('--write-parity');
  const isVerify = args.includes('--verify');
  const isJson = args.includes('--json');
  const modeArgIdx = args.indexOf('--mode');
  const mode: SimImplementationMode =
    modeArgIdx >= 0 && args[modeArgIdx + 1] === 'mode_b' ? 'mode_b' : 'mode_a';

  const extraClassPaths: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--extra-class' && args[i + 1]) {
      extraClassPaths.push(args[i + 1]);
      i++;
    }
  }

  const errors: string[] = [];

  if (isParity) {
    const fiveClassPaths = [...LIVE_CLASS_PATHS, ...DROP_IN_CLASS_PATHS];
    const fiveClasses = loadValidatedClasses(fiveClassPaths, errors);
    if (errors.length > 0) {
      process.stdout.write(`${JSON.stringify({ ok: false, errors })}\n`);
      process.exit(1);
    }

    const modeA = runClassBaselineSuite(fiveClasses, 'mode_a');
    const modeB = runClassBaselineSuite(fiveClasses, 'mode_b');
    const parityArtifact: SimParityArtifact = {
      version: modeA.version,
      tickMs: modeA.tickMs,
      classes: modeA.classes,
      brackets: modeA.brackets,
      archetypes: modeA.archetypes,
      mode_a: modeA,
      mode_b: modeB,
    };

    const absParityPath = path.resolve(ROOT_DIR, DEFAULT_PARITY_PATH);
    if (isWriteParity || !fs.existsSync(absParityPath)) {
      fs.mkdirSync(path.dirname(absParityPath), { recursive: true });
      fs.writeFileSync(absParityPath, `${JSON.stringify(parityArtifact, null, 2)}\n`, 'utf8');
    }

    if (isJson) {
      process.stdout.write(`${JSON.stringify(parityArtifact, null, 2)}\n`);
      return;
    }

    process.stdout.write(
      `${formatMarkdownReport(modeA, '(`SIM-03` — Mode A Engine-Strict)')}\n${formatMarkdownReport(
        modeB,
        '(`SIM-03` — Mode B Authentic Extension)'
      )}\n`
    );
    return;
  }

  if (isVerify) {
    // 1. Always verify the frozen 3-class Mode A baseline first
    const liveClasses = loadValidatedClasses(LIVE_CLASS_PATHS, errors);
    if (errors.length > 0) {
      process.stdout.write(`${JSON.stringify({ ok: false, errors })}\n`);
      process.exit(1);
    }
    const baseRun1 = runClassBaselineSuite(liveClasses, 'mode_a');
    const baseRun2 = runClassBaselineSuite(liveClasses, 'mode_a');
    verifyBaselineSuite(liveClasses, baseRun1, baseRun2, DEFAULT_BASELINE_PATH, errors);

    if (isBaseline) {
      if (errors.length > 0) {
        process.stdout.write(`${JSON.stringify({ ok: false, errors })}\n`);
        process.exit(1);
      }
      process.stdout.write(
        `${JSON.stringify({
          ok: true,
          version: baseRun1.version,
          tickMs: baseRun1.tickMs,
          classes: baseRun1.classes,
          brackets: baseRun1.brackets,
          archetypes: baseRun1.archetypes,
          scenarios: baseRun1.scenarios.length,
          baselineArtifact: DEFAULT_BASELINE_PATH,
        })}\n`
      );
      return;
    }

    // 2. Verify all 5 classes across Mode A and Mode B against parity gates and parity-5class-v0.99.0.json
    const fiveClassPaths = [...LIVE_CLASS_PATHS, ...DROP_IN_CLASS_PATHS];
    const fiveClasses = loadValidatedClasses(fiveClassPaths, errors);
    if (errors.length > 0) {
      process.stdout.write(`${JSON.stringify({ ok: false, errors })}\n`);
      process.exit(1);
    }

    const parityA1 = runClassBaselineSuite(fiveClasses, 'mode_a');
    const parityA2 = runClassBaselineSuite(fiveClasses, 'mode_a');
    const parityB1 = runClassBaselineSuite(fiveClasses, 'mode_b');
    const parityB2 = runClassBaselineSuite(fiveClasses, 'mode_b');

    verifySuiteSanityAndMonotonicity(fiveClasses, parityA1, parityA2, 'mode_a', errors);
    verifySuiteSanityAndMonotonicity(fiveClasses, parityB1, parityB2, 'mode_b', errors);
    verifyFiveClassParityEnvelope(parityA1, 'mode_a', errors);
    verifyFiveClassParityEnvelope(parityB1, 'mode_b', errors);

    const parityArtifact: SimParityArtifact = {
      version: parityA1.version,
      tickMs: parityA1.tickMs,
      classes: parityA1.classes,
      brackets: parityA1.brackets,
      archetypes: parityA1.archetypes,
      mode_a: parityA1,
      mode_b: parityB1,
    };

    const absParityPath = path.resolve(ROOT_DIR, DEFAULT_PARITY_PATH);
    if (!fs.existsSync(absParityPath)) {
      errors.push(`Committed 5-class parity artifact missing at ${DEFAULT_PARITY_PATH}`);
    } else {
      try {
        const committedParity = readJsonFile<SimParityArtifact>(DEFAULT_PARITY_PATH);
        if (JSON.stringify(committedParity) !== JSON.stringify(parityArtifact)) {
          errors.push(
            `Parity artifact drift detected: live 5-class output does not match ${DEFAULT_PARITY_PATH}`
          );
        }
      } catch (err) {
        errors.push(`Failed to read parity artifact ${DEFAULT_PARITY_PATH}: ${String(err)}`);
      }
    }

    if (errors.length > 0) {
      process.stdout.write(`${JSON.stringify({ ok: false, errors })}\n`);
      process.exit(1);
    }

    const verifyPayload = {
      ok: true,
      version: parityA1.version,
      tickMs: parityA1.tickMs,
      classes: parityA1.classes,
      brackets: parityA1.brackets,
      archetypes: parityA1.archetypes,
      scenarios: parityA1.scenarios.length,
      baselineScenarios: baseRun1.scenarios.length,
      parityModes: ['mode_a', 'mode_b'],
      baselineArtifact: DEFAULT_BASELINE_PATH,
      parityArtifact: DEFAULT_PARITY_PATH,
    };
    process.stdout.write(`${JSON.stringify(verifyPayload)}\n`);
    return;
  }

  const targetClassPaths = [...LIVE_CLASS_PATHS, ...extraClassPaths];
  const classes = loadValidatedClasses(targetClassPaths, errors);

  if (errors.length > 0) {
    process.stdout.write(`${JSON.stringify({ ok: false, errors })}\n`);
    process.exit(1);
  }

  const run1 = runClassBaselineSuite(classes, mode);

  const absBaselinePath = path.resolve(ROOT_DIR, DEFAULT_BASELINE_PATH);
  if (
    extraClassPaths.length === 0 &&
    mode === 'mode_a' &&
    (isWriteBaseline || (isBaseline && !fs.existsSync(absBaselinePath)))
  ) {
    fs.mkdirSync(path.dirname(absBaselinePath), { recursive: true });
    fs.writeFileSync(absBaselinePath, `${JSON.stringify(run1, null, 2)}\n`, 'utf8');
  }

  if (isJson) {
    process.stdout.write(`${JSON.stringify(run1, null, 2)}\n`);
    return;
  }

  process.stdout.write(`${formatMarkdownReport(run1)}\n`);
}

main();
