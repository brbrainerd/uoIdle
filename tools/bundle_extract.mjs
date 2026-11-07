#!/usr/bin/env node
/**
 * Deterministic UO Idle v0.99.0 bundle formatter, Acorn AST domain slicer,
 * changelog/API/protocol registry extractor, and redacted live evidence builder.
 *
 * Usage:
 *   node tools/bundle_extract.mjs           # Extract all 20 _raw/{bundle,wiki,api}/ files + _evidence/live-bundle-probe.txt
 *   node tools/bundle_extract.mjs --force   # Re-download assets into mechanics/_crawl/ before extracting
 *   node tools/bundle_extract.mjs --verify  # Verify all 20 _raw/ files and _evidence/live-bundle-probe.txt against manifest.json
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
const WIKI_OUT_DIR = path.join(RAW_DIR, 'wiki');
const API_OUT_DIR = path.join(RAW_DIR, 'api');
const EVIDENCE_OUT_DIR = path.join(ROOT, 'mechanics', '_evidence');
const EVIDENCE_PROBE_PATH = path.join(EVIDENCE_OUT_DIR, 'live-bundle-probe.txt');
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

const WIKI_CHANGELOGS = [
  {
    rel: 'wiki/changelog-server-dev.md',
    url: 'https://cdn.uoidle.com/news/server/dev.md',
    cacheName: 'changelog-server-dev.md',
    category: 'combat',
  },
  {
    rel: 'wiki/changelog-client-dev.md',
    url: 'https://cdn.uoidle.com/news/client/dev.md',
    cacheName: 'changelog-client-dev.md',
    category: 'engine-ui',
  },
  {
    rel: 'wiki/changelog-server-en.md',
    url: 'https://api.uoidle.com/news/server/en.md',
    cacheName: 'changelog-server-en.md',
    category: 'combat',
  },
  {
    rel: 'wiki/changelog-client-en.md',
    url: 'https://api.uoidle.com/news/client/en.md',
    cacheName: 'changelog-client-en.md',
    category: 'engine-ui',
  },
];

const CLOSED_BETA_ASSET = {
  rel: 'api/closed-beta-status.json',
  url: 'https://api.uoidle.com/closed-beta',
  cacheName: 'closed-beta-status.json',
  category: 'engine-ui',
};

const PROTOCOL_INDEX_REL = 'api/protocol-commands-index.json';

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

const EXPECTED_RAW_REL_PATHS = [
  ...JS_SLICES.map((s) => s.rel),
  ...STATIC_BUNDLE_FILES.map((s) => s.rel),
  ...WIKI_CHANGELOGS.map((w) => w.rel),
  CLOSED_BETA_ASSET.rel,
  PROTOCOL_INDEX_REL,
];

const SENSITIVE_KEYS = new Set([
  'token',
  'uo-idle-token',
  'idtoken',
  'password',
  'access_token',
  'refresh_token',
  'client_secret',
  'cookie',
  'set-cookie',
  'authorization',
  'email',
]);

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

export function redactText(text) {
  return normEol(text)
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]{16,}/g, 'Bearer <REDACTED>')
    .replace(/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, '<REDACTED>')
    .replace(/(Set-Cookie|Cookie)\s*:\s*[^\s;"'`]{8,}/gi, '$1: <REDACTED>')
    .replace(
      /"(uo-idle-token|idToken|password|access_token|refresh_token|client_secret)"\s*:\s*"[^"]*"/g,
      '"$1": "<REDACTED>"'
    )
    .replace(/\b[A-Za-z0-9._%+-]+@(?!example\.com\b)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, 'redacted@example.com');
}

export function redactJsonObject(value) {
  if (Array.isArray(value)) {
    return value.map(redactJsonObject);
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        out[key] = '<REDACTED>';
      } else {
        out[key] = redactJsonObject(value[key]);
      }
    }
    return out;
  }
  if (typeof value === 'string') {
    return redactText(value);
  }
  return value;
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

/**
 * Deterministically extract server packet `assunto` string literals and client WebSocket
 * `[command` speech verbs with their exact 1-based line numbers in the formatted bundles.
 */
export function extractProtocolCommandsIndex(parsedBundles) {
  const serverAssuntos = new Map();
  const clientCommands = new Map();

  const assuntoPatterns = [
    /assunto\s*===\s*'([A-Z0-9_]+)'/g,
    /assunto\s*!==\s*'([A-Z0-9_]+)'/g,
    /case\s+'([A-Z0-9_]{3,})':/g,
    /#([A-Z]{4,})\b/g,
  ];
  const clientCmdPatterns = [
    /['"`](\[[A-Za-z][A-Za-z0-9_-]{2,})(?:\s|\$\{|['"`])/g,
  ];

  for (const [bundleKey, bundleInfo] of parsedBundles.entries()) {
    const lines = bundleInfo.astIndex.lines;
    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      const lineNo = idx + 1;

      for (const pat of assuntoPatterns) {
        pat.lastIndex = 0;
        let m;
        while ((m = pat.exec(line)) !== null) {
          const assunto = m[1];
          if (!serverAssuntos.has(assunto)) {
            serverAssuntos.set(assunto, []);
          }
          const locs = serverAssuntos.get(assunto);
          const ref = `${bundleKey}:L${lineNo}`;
          if (!locs.includes(ref)) {
            locs.push(ref);
          }
        }
      }

      for (const pat of clientCmdPatterns) {
        pat.lastIndex = 0;
        let m;
        while ((m = pat.exec(line)) !== null) {
          const cmd = m[1];
          if (!clientCommands.has(cmd)) {
            clientCommands.set(cmd, []);
          }
          const locs = clientCommands.get(cmd);
          const ref = `${bundleKey}:L${lineNo}`;
          if (!locs.includes(ref)) {
            locs.push(ref);
          }
        }
      }
    }
  }

  const sortedAssuntos = {};
  for (const key of [...serverAssuntos.keys()].sort()) {
    sortedAssuntos[key] = serverAssuntos.get(key);
  }

  const sortedCommands = {};
  for (const key of [...clientCommands.keys()].sort()) {
    sortedCommands[key] = clientCommands.get(key);
  }

  return {
    bundleVersion: BUNDLE_VERSION,
    sources: [
      'https://uoidle.com/assets/Jogo-D5xEfvfV.js',
      'https://uoidle.com/assets/index-CCYN0Dy6.js',
    ],
    serverAssuntoCount: Object.keys(sortedAssuntos).length,
    clientCommandCount: Object.keys(sortedCommands).length,
    serverAssuntos: sortedAssuntos,
    clientSpeechCommands: sortedCommands,
  };
}

export function buildLiveBundleProbeText(rawAssets, closedBetaObj) {
  const versionText = rawAssets.get('VERSION').content.trim();
  const indexAsset = rawAssets.get('index-CCYN0Dy6.js');
  const jogoAsset = rawAssets.get('Jogo-D5xEfvfV.js');
  const bonecoAsset = rawAssets.get('bonecoVivo-DY66RLNm.js');
  const cssAsset = rawAssets.get('Jogo-CVXGOt-C.css');
  const abilitiesAsset = rawAssets.get('abilities.json');
  const iconsAsset = rawAssets.get('ability-icons.json');

  return normEol(
    [
      '# UO Idle Live Surface & Runtime Probe Evidence (Redacted)',
      'probe_target: https://uoidle.com/beta',
      `bundle_version: ${versionText}`,
      'entry_bundle_url: https://uoidle.com/assets/index-CCYN0Dy6.js',
      `entry_bundle_sha256: ${indexAsset.sha256}`,
      'game_chunk_url: https://uoidle.com/assets/Jogo-D5xEfvfV.js',
      `game_chunk_sha256: ${jogoAsset.sha256}`,
      'paperdoll_chunk_url: https://uoidle.com/assets/bonecoVivo-DY66RLNm.js',
      `paperdoll_chunk_sha256: ${bonecoAsset.sha256}`,
      'stylesheet_url: https://uoidle.com/assets/Jogo-CVXGOt-C.css',
      `stylesheet_sha256: ${cssAsset.sha256}`,
      'abilities_catalog_url: https://cdn.uoidle.com/packs/idle/abilities.json?v=0.99.0',
      `abilities_catalog_sha256: ${abilitiesAsset.sha256}`,
      'ability_icons_url: https://cdn.uoidle.com/packs/ability-icons/ability-icons.json?v=9',
      `ability_icons_sha256: ${iconsAsset.sha256}`,
      `closed_beta_api_url: ${CLOSED_BETA_ASSET.url}`,
      `closed_beta_status: ${JSON.stringify(closedBetaObj)}`,
      'localStorage.uo-idle-token: "<REDACTED>"',
      'localStorage.uoidle.convidado: "<REDACTED>"',
      'localStorage.uoidle.google: "<REDACTED>"',
      '',
    ].join('\n')
  );
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

async function runVerify() {
  if (!existsSync(MANIFEST_PATH)) {
    console.error(JSON.stringify({ ok: false, error: 'manifest.json missing' }));
    process.exit(1);
  }
  if (!existsSync(EVIDENCE_PROBE_PATH)) {
    console.error(JSON.stringify({ ok: false, error: 'live-bundle-probe.txt missing' }));
    process.exit(1);
  }

  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));
  const entries = manifest.entries || {};
  const errors = [];
  let verified = 0;

  for (const rel of EXPECTED_RAW_REL_PATHS) {
    const entry = entries[rel];
    const diskPath = path.join(RAW_DIR, rel);
    if (!entry) {
      errors.push(`missing manifest entry for ${rel}`);
      continue;
    }
    if (!existsSync(diskPath)) {
      errors.push(`missing file on disk: ${rel}`);
      continue;
    }
    const content = normEol(await fs.readFile(diskPath, 'utf8'));
    const actualSha = sha256Hex(content);
    const actualLines = countLines(content);
    if (actualSha !== entry.sha256 || actualLines !== entry.lines) {
      errors.push(
        `mismatch for ${rel}: expected (${entry.sha256}, ${entry.lines}) != actual (${actualSha}, ${actualLines})`
      );
      continue;
    }
    verified += 1;
  }

  const probeContent = normEol(await fs.readFile(EVIDENCE_PROBE_PATH, 'utf8'));
  if (!probeContent.includes('bundle_version: 0.99.0') || !probeContent.includes('<REDACTED>')) {
    errors.push('live-bundle-probe.txt missing required probe fields');
  }

  if (errors.length > 0 || verified !== EXPECTED_RAW_REL_PATHS.length) {
    console.error(JSON.stringify({ ok: false, verified, errors }));
    process.exit(1);
  }

  console.log(JSON.stringify({ ok: true, verified }));
}

async function main() {
  const args = new Set(process.argv.slice(2));
  if (args.has('--verify')) {
    await runVerify();
    return;
  }
  const force = args.has('--force');

  await fs.mkdir(CRAWL_DIR, { recursive: true });
  await fs.mkdir(BUNDLE_OUT_DIR, { recursive: true });
  await fs.mkdir(WIKI_OUT_DIR, { recursive: true });
  await fs.mkdir(API_OUT_DIR, { recursive: true });
  await fs.mkdir(EVIDENCE_OUT_DIR, { recursive: true });

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

  // 4. Slice all 11 JS domain modules into mechanics/_raw/bundle/
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

  // 6. Fetch, redact, normalize LF, and write the 4 server/client changelogs into mechanics/_raw/wiki/
  for (const wikiItem of WIKI_CHANGELOGS) {
    const cachePath = path.join(CRAWL_DIR, wikiItem.cacheName);
    const rawMd = await fetchOrReadCached(wikiItem.url, cachePath, force);
    const redactedMd = redactText(rawMd.endsWith('\n') ? rawMd : `${rawMd}\n`);
    const outPath = path.join(RAW_DIR, wikiItem.rel);
    await fs.writeFile(outPath, redactedMd, 'utf8');

    manifest.entries[wikiItem.rel] = {
      sha256: sha256Hex(redactedMd),
      lines: countLines(redactedMd),
      category: wikiItem.category,
      source: wikiItem.url,
    };
  }

  // 7. Fetch, redact, format, and write mechanics/_raw/api/closed-beta-status.json
  const closedBetaCache = path.join(CRAWL_DIR, CLOSED_BETA_ASSET.cacheName);
  const closedBetaRaw = await fetchOrReadCached(CLOSED_BETA_ASSET.url, closedBetaCache, force);
  const closedBetaObj = redactJsonObject(JSON.parse(closedBetaRaw));
  const closedBetaFormatted = await formatCode(JSON.stringify(closedBetaObj, null, 2), 'json');
  await fs.writeFile(path.join(RAW_DIR, CLOSED_BETA_ASSET.rel), closedBetaFormatted, 'utf8');
  manifest.entries[CLOSED_BETA_ASSET.rel] = {
    sha256: sha256Hex(closedBetaFormatted),
    lines: countLines(closedBetaFormatted),
    category: CLOSED_BETA_ASSET.category,
    source: CLOSED_BETA_ASSET.url,
  };

  // 8. Extract and format mechanics/_raw/api/protocol-commands-index.json
  const protocolIndexObj = extractProtocolCommandsIndex(
    new Map([
      ['Jogo-D5xEfvfV.js', parsedBundles.get('Jogo-D5xEfvfV.js')],
      ['index-CCYN0Dy6.js', parsedBundles.get('index-CCYN0Dy6.js')],
    ])
  );
  const protocolFormatted = await formatCode(JSON.stringify(protocolIndexObj, null, 2), 'json');
  await fs.writeFile(path.join(RAW_DIR, PROTOCOL_INDEX_REL), protocolFormatted, 'utf8');
  manifest.entries[PROTOCOL_INDEX_REL] = {
    sha256: sha256Hex(protocolFormatted),
    lines: countLines(protocolFormatted),
    category: 'engine-ui',
    source: 'https://uoidle.com/assets/Jogo-D5xEfvfV.js#protocol-commands',
  };

  // 9. Write redacted live runtime/surface probe evidence to mechanics/_evidence/live-bundle-probe.txt
  const probeText = buildLiveBundleProbeText(rawAssets, closedBetaObj);
  await fs.writeFile(EVIDENCE_PROBE_PATH, probeText, 'utf8');

  // 10. Sort manifest entries deterministically by key and save
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
      extractedRawFiles: EXPECTED_RAW_REL_PATHS.length,
      evidenceFile: 'mechanics/_evidence/live-bundle-probe.txt',
    })
  );
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: err.message }));
  process.exit(1);
});
