import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  ClassBaseObjectSchema,
  ClassSchema,
  EffectSchema,
  RawCatalogAbilitySchema,
  SkillBaseObjectSchema,
  type ClassDefinition,
  type RawCatalogAbility,
} from '../src/schemas/skill.schema.js';

const ROOT_DIR = process.cwd();

interface JsonSchemaDocument {
  $schema?: string;
  $id?: string;
  type?: string;
  additionalProperties?: boolean;
  required?: string[];
  properties?: Record<string, unknown>;
}

function readJsonFile<T>(relOrAbsPath: string): T {
  const fullPath = path.isAbsolute(relOrAbsPath)
    ? relOrAbsPath
    : path.resolve(ROOT_DIR, relOrAbsPath);
  const raw = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(raw) as T;
}

function validateJsonSchemaParity(
  schemaRelPath: string,
  expectedId: string,
  zodShape: Record<string, unknown>,
  errors: string[]
): void {
  let doc: JsonSchemaDocument;
  try {
    doc = readJsonFile<JsonSchemaDocument>(schemaRelPath);
  } catch (err) {
    errors.push(`${schemaRelPath}: failed to parse JSON (${String(err)})`);
    return;
  }

  if (doc.$schema !== 'https://json-schema.org/draft/2020-12/schema') {
    errors.push(`${schemaRelPath}: expected $schema Draft 2020-12, got ${String(doc.$schema)}`);
  }
  if (doc.$id !== expectedId) {
    errors.push(`${schemaRelPath}: expected $id ${expectedId}, got ${String(doc.$id)}`);
  }
  if (doc.type !== 'object') {
    errors.push(`${schemaRelPath}: expected type "object", got ${String(doc.type)}`);
  }
  if (doc.additionalProperties !== false) {
    errors.push(`${schemaRelPath}: expected additionalProperties === false`);
  }

  const requiredKeys = Array.isArray(doc.required) ? [...doc.required].sort() : [];
  const propertyKeys = doc.properties ? Object.keys(doc.properties).sort() : [];
  const zodKeys = Object.keys(zodShape).sort();

  if (JSON.stringify(requiredKeys) !== JSON.stringify(zodKeys)) {
    errors.push(
      `${schemaRelPath}: required keys ${JSON.stringify(requiredKeys)} do not match Zod shape keys ${JSON.stringify(zodKeys)}`
    );
  }
  if (JSON.stringify(propertyKeys) !== JSON.stringify(zodKeys)) {
    errors.push(
      `${schemaRelPath}: properties keys ${JSON.stringify(propertyKeys)} do not match Zod shape keys ${JSON.stringify(zodKeys)}`
    );
  }
}

function crossCheckLiveClassWithCatalog(
  cls: ClassDefinition,
  catalogEntries: RawCatalogAbility[],
  expectedCatalogCount: number,
  errors: string[]
): void {
  const classCatalog = catalogEntries.filter((entry) => entry.class === cls.id);
  if (classCatalog.length !== expectedCatalogCount) {
    errors.push(
      `catalog[${cls.id}]: expected ${expectedCatalogCount} entries, found ${classCatalog.length}`
    );
  }

  const byId = new Map(cls.abilities.map((a) => [a.id, a]));
  for (const rawEntry of classCatalog) {
    const skill = byId.get(rawEntry.id);
    if (!skill) {
      errors.push(`${cls.id}.json: missing catalog ability "${rawEntry.id}"`);
      continue;
    }
    if (!skill.inCatalog) {
      errors.push(`${cls.id}.json: ability "${rawEntry.id}" must have inCatalog === true`);
    }
    if (skill.kind !== rawEntry.kind) {
      errors.push(
        `${cls.id}.json [${rawEntry.id}]: kind "${skill.kind}" !== catalog "${rawEntry.kind}"`
      );
    }
    if (skill.name !== rawEntry.name) {
      errors.push(
        `${cls.id}.json [${rawEntry.id}]: name "${skill.name}" !== catalog "${rawEntry.name}"`
      );
    }
    if (skill.tab !== rawEntry.tab) {
      errors.push(
        `${cls.id}.json [${rawEntry.id}]: tab "${skill.tab}" !== catalog "${rawEntry.tab}"`
      );
    }
    if (skill.unlockLevel !== rawEntry.unlock) {
      errors.push(
        `${cls.id}.json [${rawEntry.id}]: unlockLevel ${String(skill.unlockLevel)} !== catalog unlock ${rawEntry.unlock}`
      );
    }
    if (skill.manaCost !== rawEntry.mana) {
      errors.push(
        `${cls.id}.json [${rawEntry.id}]: manaCost ${skill.manaCost} !== catalog mana ${rawEntry.mana}`
      );
    }
    const expectedMapScope = rawEntry.map ?? null;
    if (skill.mapScope !== expectedMapScope) {
      errors.push(
        `${cls.id}.json [${rawEntry.id}]: mapScope ${String(skill.mapScope)} !== catalog map ${String(expectedMapScope)}`
      );
    }
    const expectedGumpIcon = rawEntry.gumpIcon ?? null;
    if (skill.gumpIcon !== expectedGumpIcon) {
      errors.push(
        `${cls.id}.json [${rawEntry.id}]: gumpIcon ${String(skill.gumpIcon)} !== catalog gumpIcon ${String(expectedGumpIcon)}`
      );
    }
    const expectedIconKey = rawEntry.iconKey ?? null;
    if (skill.iconKey !== expectedIconKey) {
      errors.push(
        `${cls.id}.json [${rawEntry.id}]: iconKey ${String(skill.iconKey)} !== catalog iconKey ${String(expectedIconKey)}`
      );
    }
    if (rawEntry.kind === 'WeaponAbility') {
      const expectedRef = rawEntry.ref ?? null;
      if (skill.weaponAbilityRef !== expectedRef) {
        errors.push(
          `${cls.id}.json [${rawEntry.id}]: weaponAbilityRef ${String(skill.weaponAbilityRef)} !== catalog ref ${String(expectedRef)}`
        );
      }
    } else if (rawEntry.kind === 'Spell' || rawEntry.kind === 'SpecialMove') {
      const expectedRef = rawEntry.ref ?? null;
      if (skill.spellId !== expectedRef) {
        errors.push(
          `${cls.id}.json [${rawEntry.id}]: spellId ${String(skill.spellId)} !== catalog ref ${String(expectedRef)}`
        );
      }
    }
  }
}

function crossCheckDropInClassWithCatalog(
  cls: ClassDefinition,
  catalogEntries: RawCatalogAbility[],
  expectedCatalogCount: number,
  errors: string[]
): void {
  const classCatalog = catalogEntries.filter((entry) => entry.class === cls.id);
  if (classCatalog.length !== expectedCatalogCount) {
    errors.push(
      `catalog[${cls.id}]: expected ${expectedCatalogCount} entries, found ${classCatalog.length}`
    );
  }

  const byId = new Map(cls.abilities.map((a) => [a.id, a]));
  for (const rawEntry of classCatalog) {
    const skill = byId.get(rawEntry.id);
    if (!skill) {
      errors.push(`${cls.id}.json: missing pre-existing catalog ability "${rawEntry.id}"`);
      continue;
    }
    if (!skill.inCatalog) {
      errors.push(`${cls.id}.json: ability "${rawEntry.id}" must have inCatalog === true`);
    }
    if (skill.name !== rawEntry.name) {
      errors.push(
        `${cls.id}.json [${rawEntry.id}]: name "${skill.name}" !== catalog "${rawEntry.name}"`
      );
    }
    if (skill.unlockLevel !== rawEntry.unlock) {
      errors.push(
        `${cls.id}.json [${rawEntry.id}]: unlockLevel ${String(skill.unlockLevel)} !== catalog unlock ${rawEntry.unlock}`
      );
    }
    const expectedRef = rawEntry.ref ?? null;
    if (skill.spellId !== expectedRef) {
      errors.push(
        `${cls.id}.json [${rawEntry.id}]: spellId ${String(skill.spellId)} !== catalog ref ${String(expectedRef)}`
      );
    }
  }
}

function validateTokunoItemsCatalog(relPath: string, errors: string[]): void {
  try {
    const doc = readJsonFile<{
      version?: string;
      weapons?: unknown[];
      consumables?: unknown[];
      iconicTokunoArmaments?: unknown[];
      materialTiers?: unknown[];
      affixPools?: Record<string, unknown>;
    }>(relPath);

    if (!Array.isArray(doc.weapons) || doc.weapons.length !== 8) {
      errors.push(
        `${relPath}: expected weapons array of length 8, got ${Array.isArray(doc.weapons) ? doc.weapons.length : typeof doc.weapons}`
      );
    }
    if (!Array.isArray(doc.consumables) || doc.consumables.length !== 4) {
      errors.push(
        `${relPath}: expected consumables array of length 4, got ${Array.isArray(doc.consumables) ? doc.consumables.length : typeof doc.consumables}`
      );
    }
    if (!Array.isArray(doc.iconicTokunoArmaments) || doc.iconicTokunoArmaments.length !== 8) {
      errors.push(
        `${relPath}: expected iconicTokunoArmaments array of length 8, got ${Array.isArray(doc.iconicTokunoArmaments) ? doc.iconicTokunoArmaments.length : typeof doc.iconicTokunoArmaments}`
      );
    }
    if (!Array.isArray(doc.materialTiers) || doc.materialTiers.length !== 9) {
      errors.push(
        `${relPath}: expected materialTiers array of length 9, got ${Array.isArray(doc.materialTiers) ? doc.materialTiers.length : typeof doc.materialTiers}`
      );
    }
    if (!doc.affixPools || typeof doc.affixPools !== 'object') {
      errors.push(`${relPath}: missing affixPools object`);
    }
  } catch (err) {
    errors.push(`${relPath}: failed to read/parse (${String(err)})`);
  }
}

function main(): void {
  const args = process.argv.slice(2);
  const isVerify = args.includes('--verify');
  const fileArgs = args.filter((a) => !a.startsWith('--'));
  const errors: string[] = [];

  // Gate 1: JSON Schema Structural Gate
  validateJsonSchemaParity(
    'schemas/effect.schema.json',
    'https://uoidle.com/schemas/effect.schema.json',
    EffectSchema.shape,
    errors
  );
  validateJsonSchemaParity(
    'schemas/skill.schema.json',
    'https://uoidle.com/schemas/skill.schema.json',
    SkillBaseObjectSchema.shape,
    errors
  );
  validateJsonSchemaParity(
    'schemas/class.schema.json',
    'https://uoidle.com/schemas/class.schema.json',
    ClassBaseObjectSchema.shape,
    errors
  );

  // Gate 2: Raw Catalog Completeness Gate (134 entries)
  const catalogPath = 'mechanics/_raw/bundle/abilities-catalog.json';
  let catalogEntries: RawCatalogAbility[] = [];
  try {
    const rawCatalogDoc = readJsonFile<{ abilities?: unknown[] }>(catalogPath);
    if (!Array.isArray(rawCatalogDoc.abilities)) {
      errors.push(`${catalogPath}: missing top-level "abilities" array`);
    } else {
      if (rawCatalogDoc.abilities.length !== 134) {
        errors.push(
          `${catalogPath}: expected 134 abilities, found ${rawCatalogDoc.abilities.length}`
        );
      }
      rawCatalogDoc.abilities.forEach((item, idx) => {
        const res = RawCatalogAbilitySchema.safeParse(item);
        if (!res.success) {
          for (const issue of res.error.issues) {
            errors.push(
              `${catalogPath}[${idx}].${issue.path.join('.')}: ${issue.message}`
            );
          }
        } else {
          catalogEntries.push(res.data);
        }
      });
    }
  } catch (err) {
    errors.push(`${catalogPath}: failed to read/parse (${String(err)})`);
  }

  // Gate 3 & 4: Live + Drop-In Class Payload Gate + Cross-Artifact Raw Fidelity Gate
  const defaultClassTargets: Array<{
    path: string;
    expectedCatalogCount: number;
    mode: 'live' | 'drop-in' | 'none';
  }> = [
    { path: 'data/live-classes/warrior.json', expectedCatalogCount: 10, mode: 'live' },
    { path: 'data/live-classes/mage.json', expectedCatalogCount: 15, mode: 'live' },
    { path: 'data/live-classes/ranger.json', expectedCatalogCount: 9, mode: 'live' },
    { path: 'design/drop-in/samurai.json', expectedCatalogCount: 6, mode: 'drop-in' },
    { path: 'design/drop-in/ninja.json', expectedCatalogCount: 6, mode: 'drop-in' },
  ];

  const targetsToValidate =
    fileArgs.length > 0 && !isVerify
      ? fileArgs.map((p) => ({
          path: p,
          expectedCatalogCount: -1,
          mode: 'none' as const,
        }))
      : [
          ...defaultClassTargets,
          ...fileArgs.map((p) => ({
            path: p,
            expectedCatalogCount: -1,
            mode: 'none' as const,
          })),
        ];

  let validatedClassesCount = 0;

  for (const target of targetsToValidate) {
    try {
      const rawClassJson = readJsonFile<unknown>(target.path);
      const parsed = ClassSchema.safeParse(rawClassJson);
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          errors.push(`${target.path}#${issue.path.join('.')}: ${issue.message}`);
        }
        continue;
      }
      validatedClassesCount++;
      if (target.expectedCatalogCount >= 0 && catalogEntries.length > 0) {
        if (target.mode === 'live') {
          crossCheckLiveClassWithCatalog(
            parsed.data,
            catalogEntries,
            target.expectedCatalogCount,
            errors
          );
        } else if (target.mode === 'drop-in') {
          crossCheckDropInClassWithCatalog(
            parsed.data,
            catalogEntries,
            target.expectedCatalogCount,
            errors
          );
        }
      }
    } catch (err) {
      errors.push(`${target.path}: failed to read/parse (${String(err)})`);
    }
  }

  // Gate 5: Tokuno Items Catalog Gate (when --verify or no single file arg)
  if (isVerify || fileArgs.length === 0) {
    validateTokunoItemsCatalog('design/drop-in/items-bushido-ninjitsu.json', errors);
  }

  if (errors.length > 0) {
    process.stdout.write(`${JSON.stringify({ ok: false, errors })}\n`);
    process.exit(1);
  }

  process.stdout.write(
    `${JSON.stringify({
      ok: true,
      classes: validatedClassesCount,
      catalogAbilities: catalogEntries.length,
    })}\n`
  );
}

main();
