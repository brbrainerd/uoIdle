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

  // Gate 3 & 4: Live Class Payload Gate + Cross-Artifact Raw Fidelity Gate
  const defaultLiveClassTargets: Array<{ path: string; expectedCatalogCount: number }> = [
    { path: 'data/live-classes/warrior.json', expectedCatalogCount: 10 },
    { path: 'data/live-classes/mage.json', expectedCatalogCount: 15 },
    { path: 'data/live-classes/ranger.json', expectedCatalogCount: 9 },
  ];

  const targetsToValidate =
    fileArgs.length > 0 && !isVerify
      ? fileArgs.map((p) => ({ path: p, expectedCatalogCount: -1 }))
      : [
          ...defaultLiveClassTargets,
          ...fileArgs.map((p) => ({ path: p, expectedCatalogCount: -1 })),
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
        crossCheckLiveClassWithCatalog(
          parsed.data,
          catalogEntries,
          target.expectedCatalogCount,
          errors
        );
      }
    } catch (err) {
      errors.push(`${target.path}: failed to read/parse (${String(err)})`);
    }
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
