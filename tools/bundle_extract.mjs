#!/usr/bin/env node
/**
 * Deterministic UO Idle v0.99.0 bundle formatter and Acorn AST domain slicer.
 *
 * Usage:
 *   node tools/bundle_extract.mjs          # Fetch (if needed), prettier-format, AST-slice into mechanics/_raw/bundle/
 *   node tools/bundle_extract.mjs --force  # Re-download assets into mechanics/_crawl/bundle/ before slicing
 */
import * as fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import * as prettier from 'prettier';
import * as acorn from 'acorn';

const ROOT = process.cwd();
const CRAWL_DIR = path.join(ROOT, 'mechanics', '_crawl', 'bundle');
const RAW_DIR = path.join(ROOT, 'mechanics', '_raw');
const BUNDLE_OUT_DIR = path.join(RAW_DIR, 'bundle');
const MANIFEST_PATH = path.join(RAW_DIR, 'manifest.json');
const BUNDLE_VERSION = '0.99.0';

const BUNDLE_ASSETS = [
  {
    key: 'VERSION',
    url: 'https://uoidle.com/VERSION',
    cacheName: 'VERSION',
  },
  {
    key: 'index-CCYN0Dy6.js',
    url: 'https://uoidle.com/assets/index-CCYN0Dy6.js',
    cacheName: 'index-CCYN0Dy6.js',
  },
  {
    key: 'Jogo-D5xEfvfV.js',
    url: 'https://uoidle.com/assets/Jogo-D5xEfvfV.js',
    cacheName: 'Jogo-D5xEfvfV.js',
  },
  {
    key: 'bonecoVivo-DY66RLNm.js',
    url: 'https://uoidle.com/assets/bonecoVivo-DY66RLNm.js',
    cacheName: 'bonecoVivo-DY66RLNm.js',
  },
  {
    key: 'Jogo-CVXGOt-C.css',
    url: 'https://uoidle.com/assets/Jogo-CVXGOt-C.css',
    cacheName: 'Jogo-CVXGOt-C.css',
  },
  {
    key: 'abilities.json',
    url: 'https://cdn.uoidle.com/packs/idle/abilities.json?v=0.99.0',
    cacheName: 'abilities.json',
  },
  {
    key: 'ability-icons.json',
    url: 'https://cdn.uoidle.com/packs/ability-icons/ability-icons.json?v=9',
    cacheName: 'ability-icons.json',
  },
];

/**
 * 11 AST-sliced JS domain modules + 3 full formatted JSON/CSS bundle assets = 14 bundle files.
 */
const JS_SLICES = [
  {
    rel: 'bundle/classes-config.js',
    asset: 'Jogo-D5xEfvfV.js',
    category: 'classes',
    spans: [{ startSymbol: 'Wj', endSymbol: 'Dc', mode: 'statement' }],
  },
  {
    rel: 'bundle/skills-and-progression.js',
    asset: 'Jogo-D5xEfvfV.js',
    category: 'progression',
    spans: [{ startSymbol: 'jc', endSymbol: 'CE', mode: 'statement' }],
  },
  {
    rel: 'bundle/abilities-loader-and-hotbar.js',
    asset: 'Jogo-D5xEfvfV.js',
    category: 'skills',
    spans: [{ startSymbol: 'tb', endSymbol: 's5', mode: 'statement' }],
  },
  {
    rel: 'bundle/character-bonus-and-status.js',
    asset: 'Jogo-D5xEfvfV.js',
    category: 'status-effects',
    spans: [{ startSymbol: 'wo', endSymbol: 'nI', mode: 'statement' }],
  },
  {
    rel: 'bundle/progression-tree-ui.js',
    asset: 'Jogo-D5xEfvfV.js',
    category: 'progression',
    spans: [{ startSymbol: 'Rs', endSymbol: 'zI', mode: 'statement' }],
  },
  {
    rel: 'bundle/bestiary-and-wiki.js',
    asset: 'Jogo-D5xEfvfV.js',
    category: 'dungeons-monsters',
    spans: [
      { startSymbol: 'kO', endSymbol: 'TO', mode: 'statement' },
      { startSymbol: 'cq', endSymbol: 'mq', mode: 'statement' },
    ],
  },
  {
    rel: 'bundle/hunt-and-bot-config.js',
    asset: 'Jogo-D5xEfvfV.js',
    category: 'combat',
    spans: [{ startSymbol: 'qm', endSymbol: 'gR', mode: 'statement' }],
  },
  {
    rel: 'bundle/combat-estimators-and-hotbar.js',
    asset: 'Jogo-D5xEfvfV.js',
    category: 'combat',
    spans: [{ startSymbol: 'pq', endSymbol: 'rk', mode: 'statement' }],
  },
  {
    rel: 'bundle/i18n-en-abilities.js',
    asset: 'index-CCYN0Dy6.js',
    category: 'skills',
    spans: [
      { startSymbol: 'Kg', endSymbol: 'Kg', mode: 'declarator' },
      { startSymbol: 'ph', endSymbol: 'HB', mode: 'declarator' },
    ],
    wrapConst: true,
  },
  {
    rel: 'bundle/i18n-pt-abilities.js',
    asset: 'index-CCYN0Dy6.js',
    category: 'skills',
    spans: [{ startSymbol: 'V1', endSymbol: 'XB', mode: 'declarator' }],
    wrapConst: true,
  },
  {
    rel: 'bundle/paperdoll-and-items.js',
    asset: 'bonecoVivo-DY66RLNm.js',
    category: 'items-equipment',
    spans: [{ startSymbol: 'wA', endSymbol: 'lR', mode: 'statement' }],
  },
];

const STATIC_BUNDLE_FILES = [
  {
    rel: 'bundle/abilities-catalog.json',
    asset: 'abilities.json',
    parser: 'json',
    category: 'skills',
  },
  {
    rel: 'bundle/ability-icons-atlas.json',
    asset: 'ability-icons.json',
    parser: 'json',
    category: 'engine-ui',
  },
  {
    rel: 'bundle/game-theme.css',
    asset: 'Jogo-CVXGOt-C.css',
    parser: 'css',
    category: 'engine-ui',
  },
];

export function normEol(text) {
  return text.replace(/\r\n/g, '\n');
}

export function sha256Hex(text) {
  return crypto.createHash('sha256').update(normEol(text), 'utf8').digest('hex');
}

export function countLines(text) {
  const norm = normEol(text);
  const lines = norm.split('\n');
  return norm.endsWith('\n') ? lines.length - 1 : lines.length;
}

export async function formatCode(rawCode, parser = 'babel') {
  const formatted = await prettier.format(normEol(rawCode), {
    parser,
    printWidth: 100,
    singleQuote: true,
    semi: true,
    trailingComma: 'es5',
  });
  return normEol(formatted);
}

export function indexAstDeclarations(formattedJs) {
  const ast = acorn.parse(formattedJs, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    locations: true,
  });
  const statementMap = new Map();
  const declaratorMap = new Map();

  for (const node of ast.body) {
    if (node.type === 'FunctionDeclaration' && node.id) {
      statementMap.set(node.id.name, {
        startLine: node.loc.start.line,
        endLine: node.loc.end.line,
      });
    } else if (node.type === 'VariableDeclaration') {
      for (const decl of node.declarations) {
        if (decl.id.type === 'Identifier') {
          statementMap.set(decl.id.name, {
            startLine: node.loc.start.line,
            endLine: node.loc.end.line,
          });
          declaratorMap.set(decl.id.name, {
            startLine: decl.loc.start.line,
            endLine: decl.loc.end.line,
          });
        }
      }
    }
  }
  return {
    lines: formattedJs.split('\n'),
    statementMap,
    declaratorMap,
  };
}

async function fetchOrReadCached(url, cachePath, force = false) {
  if (!force && existsSync(cachePath)) {
    return normEol(await fs.readFile(cachePath, 'utf8'));
  }
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'uo-idle-kb-extractor/1.0 (read-only static asset verifier)',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  const text = normEol(await res.text());
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  await fs.writeFile(cachePath, text, 'utf8');
  return text;
}

async function ensureFormattedJs(assetKey, rawContent, force = false) {
  const formattedCachePath = path.join(CRAWL_DIR, `${assetKey}.formatted.js`);
  if (!force && existsSync(formattedCachePath)) {
    return normEol(await fs.readFile(formattedCachePath, 'utf8'));
  }
  const formatted = await formatCode(rawContent, 'babel');
  await fs.writeFile(formattedCachePath, formatted, 'utf8');
  return formatted;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const force = args.has('--force');

  await fs.mkdir(CRAWL_DIR, { recursive: true });
  await fs.mkdir(BUNDLE_OUT_DIR, { recursive: true });

  // 1. Ensure all raw bundle assets are cached in mechanics/_crawl/bundle/
  const rawAssets = new Map();
  for (const asset of BUNDLE_ASSETS) {
    const cachePath = path.join(CRAWL_DIR, asset.cacheName);
    const content = await fetchOrReadCached(asset.url, cachePath, force);
    rawAssets.set(asset.key, {
      ...asset,
      content,
      sha256: sha256Hex(content),
    });
  }

  // 2. Format the 3 JS bundles and index their top-level AST declarations
  const parsedBundles = new Map();
  for (const jsKey of ['index-CCYN0Dy6.js', 'Jogo-D5xEfvfV.js', 'bonecoVivo-DY66RLNm.js']) {
    const rawInfo = rawAssets.get(jsKey);
    const formatted = await ensureFormattedJs(jsKey, rawInfo.content, force);
    parsedBundles.set(jsKey, {
      ...rawInfo,
      formatted,
      astIndex: indexAstDeclarations(formatted),
    });
  }

  // 3. Load existing manifest.json so non-bundle entries (modernuo/*, etc.) are preserved
  let manifest = {
    version: 1,
    updatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    bundleVersion: BUNDLE_VERSION,
    modernuoCommit: 'b0e6b17c5cba3a6944ca25a9676dcdec0022ac38',
    entries: {},
  };
  if (existsSync(MANIFEST_PATH)) {
    const existing = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));
    manifest = {
      ...manifest,
      ...existing,
      bundleVersion: BUNDLE_VERSION,
      entries: { ...(existing.entries || {}) },
    };
  }

  // 4. Slice all 11 JS domain modules
  for (const sliceDef of JS_SLICES) {
    const bundle = parsedBundles.get(sliceDef.asset);
    const { lines, statementMap, declaratorMap } = bundle.astIndex;
    const spanStrings = [];
    const extractedBlocks = [];

    for (const span of sliceDef.spans) {
      const lookup = span.mode === 'declarator' ? declaratorMap : statementMap;
      const startNode = lookup.get(span.startSymbol);
      const endNode = lookup.get(span.endSymbol);
      if (!startNode) {
        throw new Error(`Missing startSymbol ${span.startSymbol} in ${sliceDef.asset}`);
      }
      if (!endNode) {
        throw new Error(`Missing endSymbol ${span.endSymbol} in ${sliceDef.asset}`);
      }
      const startLine = startNode.startLine;
      const endLine = endNode.endLine;
      spanStrings.push(`L${startLine}-L${endLine}`);
      extractedBlocks.push(lines.slice(startLine - 1, endLine).join('\n'));
    }

    let body = extractedBlocks.join('\n\n');
    if (sliceDef.wrapConst) {
      body = `const\n${body.replace(/,\s*$/, ';')}`;
    }

    const header = [
      `// SOURCE: ${bundle.url}`,
      `// BUNDLE_VERSION: ${BUNDLE_VERSION}`,
      `// BUNDLE_SHA256: ${bundle.sha256}`,
      `// AST_SPAN: ${spanStrings.join(', ')}`,
    ].join('\n');

    const fullContent = normEol(`${header}\n${body}\n`);
    const outPath = path.join(RAW_DIR, sliceDef.rel);
    await fs.writeFile(outPath, fullContent, 'utf8');

    manifest.entries[sliceDef.rel] = {
      sha256: sha256Hex(fullContent),
      lines: countLines(fullContent),
      category: sliceDef.category,
      source: `${bundle.url}#${spanStrings.join(',')}`,
    };
  }

  // 5. Format and write the 3 JSON/CSS static bundle files
  for (const item of STATIC_BUNDLE_FILES) {
    const asset = rawAssets.get(item.asset);
    const formatted = await formatCode(asset.content, item.parser);
    const outPath = path.join(RAW_DIR, item.rel);
    await fs.writeFile(outPath, formatted, 'utf8');

    manifest.entries[item.rel] = {
      sha256: sha256Hex(formatted),
      lines: countLines(formatted),
      category: item.category,
      source: asset.url,
    };
  }

  // Sort manifest entries deterministically by key
  const sortedEntries = {};
  for (const key of Object.keys(manifest.entries).sort()) {
    sortedEntries[key] = manifest.entries[key];
  }
  manifest.entries = sortedEntries;
  manifest.updatedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  await fs.writeFile(MANIFEST_PATH, normEol(JSON.stringify(manifest, null, 2) + '\n'), 'utf8');
  console.log(
    JSON.stringify({
      ok: true,
      bundleSlices: JS_SLICES.length + STATIC_BUNDLE_FILES.length,
    })
  );
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: err.message }));
  process.exit(1);
});
