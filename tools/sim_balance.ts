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
const LIVE_CLASS_PATHS = [
  'data/live-classes/warrior.json',
  'data/live-classes/mage.json',
  'data/live-classes/ranger.json',
];

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

function verifyBaselineSuite(
  classes: ClassDefinition[],
  run1: SimBaselineArtifact,
  run2: SimBaselineArtifact,
  baselineFilePath: string,
  errors: string[]
): void {
  // Gate 1: Schema & Scenario Completeness Gate
  const expectedScenarioCount = classes.length * 4 * 4;
  if (run1.scenarios.length !== expectedScenarioCount) {
    errors.push(
      `Expected ${expectedScenarioCount} scenarios (${classes.length}x4x4), got ${run1.scenarios.length}`
    );
  }

  for (const s of run1.scenarios) {
    const label = `${s.classId}[${s.bracketId}/${s.archetypeId}]`;
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
    errors.push('Determinism failure: two consecutive in-memory simulation runs differed');
  }

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
        errors.push(`Missing summary row for ${cls.id} at ${prevBracket} or ${currBracket}`);
        continue;
      }
      if (!(currRow.sustainedBossDps > prevRow.sustainedBossDps)) {
        errors.push(
          `Monotonic DPS gate failed for ${cls.id}: ${currBracket} sustainedBossDps (${currRow.sustainedBossDps}) <= ${prevBracket} (${prevRow.sustainedBossDps})`
        );
      }
      if (!(currRow.ehpPerSec > prevRow.ehpPerSec)) {
        errors.push(
          `Monotonic EHP/sec gate failed for ${cls.id}: ${currBracket} ehpPerSec (${currRow.ehpPerSec}) <= ${prevBracket} (${prevRow.ehpPerSec})`
        );
      }
    }
  }

  // Gate 4: Resource & Combat Niche Sanity Gate
  for (const row of run1.summaryByClassBracket) {
    if (row.classId === 'warrior') {
      if (row.netManaDeltaPerMin !== 0) {
        errors.push(
          `Warrior 0-mana invariant violated at ${row.bracketId}: netManaDeltaPerMin=${row.netManaDeltaPerMin}`
        );
      }
    }
    if (row.highDefBossDps >= row.sustainedBossDps) {
      errors.push(
        `Mitigation sanity gate failed for ${row.classId}[${row.bracketId}]: highDefBossDps (${row.highDefBossDps}) >= lowDefBossDps (${row.sustainedBossDps})`
      );
    }
    if (row.bracketId === 'L45' || row.bracketId === 'L60') {
      if (!(row.multiTargetDps > row.sustainedBossDps)) {
        errors.push(
          `AoE/cleave niche sanity gate failed for ${row.classId}[${row.bracketId}]: multiTargetDps (${row.multiTargetDps}) <= sustainedBossDps (${row.sustainedBossDps})`
        );
      }
    }
  }

  for (const s of run1.scenarios) {
    if (s.classId === 'warrior' && s.oomTicks !== 0) {
      errors.push(
        `Warrior 0-mana OOM invariant violated at ${s.bracketId}/${s.archetypeId}: oomTicks=${s.oomTicks}`
      );
    }
  }
}

function formatMarkdownReport(artifact: SimBaselineArtifact): string {
  const lines: string[] = [];
  lines.push('# UO Idle v0.99.0 Baseline Combat Simulation Report (`SIM-02`)');
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

  if (isVerify) {
    const run2 = runClassBaselineSuite(classes, mode);
    verifyBaselineSuite(classes, run1, run2, DEFAULT_BASELINE_PATH, errors);
    if (errors.length > 0) {
      process.stdout.write(`${JSON.stringify({ ok: false, errors })}\n`);
      process.exit(1);
    }
    const verifyPayload = {
      ok: true,
      version: run1.version,
      tickMs: run1.tickMs,
      classes: run1.classes,
      brackets: run1.brackets,
      archetypes: run1.archetypes,
      scenarios: run1.scenarios.length,
      baselineArtifact: DEFAULT_BASELINE_PATH,
    };
    process.stdout.write(`${JSON.stringify(verifyPayload)}\n`);
    return;
  }

  if (isJson) {
    process.stdout.write(`${JSON.stringify(run1, null, 2)}\n`);
    return;
  }

  process.stdout.write(`${formatMarkdownReport(run1)}\n`);
}

main();
