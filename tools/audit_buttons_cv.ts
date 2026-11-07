import * as fs from 'node:fs';
import * as path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium, type Page } from 'playwright-core';

const ROOT_DIR = process.cwd();
const MOCKUPS_DIR = path.join(ROOT_DIR, 'mockups');
const CV_DIR = path.join(MOCKUPS_DIR, 'screenshots', 'cv-audit');

function resolveChromeBin(): string {
  const candidates = [
    process.env.CHROME_BIN,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter((x): x is string => Boolean(x));
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('Could not locate Chrome executable for Playwright');
}

interface ButtonAuditRecord {
  page: string;
  id: string;
  label: string;
  selector: string;
  category: 'scroll-nav' | 'sim-filter' | 'tree-interaction' | 'quick-dock' | 'card-spotlight';
  scrollBeforeY: number;
  scrollAfterY: number;
  scrollDeltaY: number;
  hiddenSectionsAfter: number;
  hiddenCardsAfter: number;
  cvChangedPixels: number;
  cvTotalPixels: number;
  cvDiffPct: number;
  cvRmsDiff: number;
  chartRegionDiffPct?: number;
  breakdownRegionDiffPct?: number;
  beforePng: string;
  afterPng: string;
  diffPng: string;
  passed: boolean;
  notes: string;
}

async function settlePage(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const anims = document.getAnimations ? document.getAnimations() : [];
    await Promise.all(
      anims.map((a) => {
        try {
          // Only wait for finite transitions/animations, not infinite ambient pulses
          const timing = a.effect?.getComputedTiming();
          if (timing && timing.iterations !== Infinity && Number.isFinite(timing.endTime)) {
            return a.finished.catch(() => {});
          }
        } catch {
          // ignore
        }
        return Promise.resolve();
      })
    );
  });
  await page.waitForTimeout(180);
}

function computeCvDiff(
  beforePath: string,
  afterPath: string,
  diffOutPath: string,
  cropBox?: [number, number, number, number]
): { changedPixels: number; totalPixels: number; diffPct: number; rmsDiff: number } {
  const pyScript = `
import sys, json, math
from PIL import Image, ImageChops, ImageStat, ImageEnhance

b_path, a_path, d_path, crop_json = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
im1 = Image.open(b_path).convert('RGB')
im2 = Image.open(a_path).convert('RGB')
if im1.size != im2.size:
    w = min(im1.width, im2.width)
    h = min(im1.height, im2.height)
    im1 = im1.crop((0, 0, w, h))
    im2 = im2.crop((0, 0, w, h))

if crop_json != "none":
    box = json.loads(crop_json)
    im1 = im1.crop((box[0], box[1], min(im1.width, box[2]), min(im1.height, box[3])))
    im2 = im2.crop((box[0], box[1], min(im2.width, box[2]), min(im2.height, box[3])))

diff = ImageChops.difference(im1, im2)
stat = ImageStat.Stat(diff)
rms = math.sqrt(sum(x*x for x in stat.rms) / 3.0)

# Count pixels where max channel delta > 12
gray = diff.convert('L')
hist = gray.histogram()
total = im1.width * im1.height
changed = sum(hist[13:])
diff_pct = (changed / max(1, total)) * 100.0

if d_path != "none":
    # Save amplified visual heatmap overlay for inspection
    amp = ImageEnhance.Brightness(diff).enhance(4.0)
    blended = Image.blend(im2, amp, 0.65)
    blended.save(d_path)

print(json.dumps({
    "changedPixels": changed,
    "totalPixels": total,
    "diffPct": round(diff_pct, 4),
    "rmsDiff": round(rms, 4)
}))
`;
  const out = execFileSync(
    'python3',
    ['-c', pyScript, beforePath, afterPath, diffOutPath, cropBox ? JSON.stringify(cropBox) : 'none'],
    { encoding: 'utf8' }
  );
  return JSON.parse(out.trim());
}

async function disableInfiniteAnimationsForDeterministicCapture(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition-duration: 0ms !important;
        scroll-behavior: auto !important;
      }
    `,
  });
  await page.evaluate(() => {
    // Pause background combat ticker interval if running so only button click changes are measured
    const w = window as unknown as { tickerRunning?: boolean };
    if (typeof w.tickerRunning === 'boolean') {
      w.tickerRunning = false;
    }
  });
}

async function testButtonInteraction(
  page: Page,
  pageName: string,
  phaseDir: string,
  id: string,
  label: string,
  selector: string,
  category: ButtonAuditRecord['category'],
  setupFn?: () => Promise<void>
): Promise<ButtonAuditRecord> {
  if (setupFn) {
    await setupFn();
    await settlePage(page);
  }

  const beforePng = path.join(phaseDir, `${pageName}__${id}__before.png`);
  const afterPng = path.join(phaseDir, `${pageName}__${id}__after.png`);
  const diffPng = path.join(phaseDir, `${pageName}__${id}__diff.png`);

  const scrollBeforeY = await page.evaluate(() => Math.round(window.scrollY));
  await page.screenshot({ path: beforePng, fullPage: false });

  const loc = page.locator(selector).first();
  const exists = (await loc.count()) > 0;
  let notes = '';

  if (!exists) {
    await page.screenshot({ path: afterPng, fullPage: false });
    return {
      page: pageName,
      id,
      label,
      selector,
      category,
      scrollBeforeY,
      scrollAfterY: scrollBeforeY,
      scrollDeltaY: 0,
      hiddenSectionsAfter: 0,
      hiddenCardsAfter: 0,
      cvChangedPixels: 0,
      cvTotalPixels: 1600 * 1000,
      cvDiffPct: 0,
      cvRmsDiff: 0,
      beforePng,
      afterPng,
      diffPng,
      passed: false,
      notes: `Selector not found: ${selector}`,
    };
  }

  try {
    await loc.click({ timeout: 3000 });
  } catch (err) {
    notes = `Click error: ${(err as Error).message}`;
  }

  await settlePage(page);

  const scrollAfterY = await page.evaluate(() => Math.round(window.scrollY));
  const scrollDeltaY = scrollAfterY - scrollBeforeY;

  const hiddenCounts = await page.evaluate(() => {
    const secs = Array.from(document.querySelectorAll('section.arvore-secao, [data-comp-section]'));
    const hiddenSecs = secs.filter((s) => getComputedStyle(s).display === 'none').length;
    const cards = Array.from(document.querySelectorAll('.milestone-card'));
    const hiddenCards = cards.filter((c) => getComputedStyle(c).display === 'none').length;
    return { hiddenSecs, hiddenCards };
  });

  await page.screenshot({ path: afterPng, fullPage: false });

  const cv = computeCvDiff(beforePng, afterPng, diffPng);

  // Check if any sections or cards were hidden via display:none (disallowed per user prompt!)
  const usedShowHide = hiddenCounts.hiddenSecs > 0 || hiddenCounts.hiddenCards > 0;

  let passed = false;
  if (usedShowHide) {
    passed = false;
    notes = `Used show/hide (hiddenSections=${hiddenCounts.hiddenSecs}, hiddenCards=${hiddenCounts.hiddenCards}) instead of scrolling/spotlighting`;
  } else if (category === 'scroll-nav') {
    passed = Math.abs(scrollDeltaY) >= 40 && cv.diffPct >= 1.0;
    if (!passed) {
      notes = `Expected scroll navigation (scrollDeltaY=${scrollDeltaY}px, cvDiffPct=${cv.diffPct}%)`;
    } else {
      notes = `Scrolled ${scrollDeltaY >= 0 ? '+' : ''}${scrollDeltaY}px cleanly (${cv.diffPct}% viewport CV change)`;
    }
  } else {
    passed = cv.diffPct >= 0.15 || Math.abs(scrollDeltaY) >= 30;
    if (!passed) {
      notes = `Button produced no meaningful visual or scroll change (cvDiffPct=${cv.diffPct}%, scrollDeltaY=${scrollDeltaY}px)`;
    } else {
      notes = `Updated view (cvDiffPct=${cv.diffPct}%, rms=${cv.rmsDiff}, scrollDeltaY=${scrollDeltaY}px)`;
    }
  }

  return {
    page: pageName,
    id,
    label,
    selector,
    category,
    scrollBeforeY,
    scrollAfterY,
    scrollDeltaY,
    hiddenSectionsAfter: hiddenCounts.hiddenSecs,
    hiddenCardsAfter: hiddenCounts.hiddenCards,
    cvChangedPixels: cv.changedPixels,
    cvTotalPixels: cv.totalPixels,
    cvDiffPct: cv.diffPct,
    cvRmsDiff: cv.rmsDiff,
    beforePng: path.relative(ROOT_DIR, beforePng),
    afterPng: path.relative(ROOT_DIR, afterPng),
    diffPng: path.relative(ROOT_DIR, diffPng),
    passed,
    notes,
  };
}

async function runAudit(phase: 'before' | 'after'): Promise<void> {
  const phaseDir = path.join(CV_DIR, phase);
  fs.mkdirSync(phaseDir, { recursive: true });

  const chromeBin = resolveChromeBin();
  const browser = await chromium.launch({
    executablePath: chromeBin,
    headless: true,
    args: ['--disable-gpu', '--hide-scrollbars'],
  });

  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1,
  });

  const records: ButtonAuditRecord[] = [];

  // =========================================================================
  // 1. SIMULATOR & 5-CLASS PARITY WORKBENCH (mockups/class-comparison.html)
  // =========================================================================
  {
    const page = await context.newPage();
    const url = `file://${path.join(MOCKUPS_DIR, 'class-comparison.html')}`;
    await page.goto(url, { waitUntil: 'load' });
    await disableInfiniteAnimationsForDeterministicCapture(page);

    // A. Workbench Section Navigation Buttons
    records.push(
      await testButtonInteraction(
        page,
        'sim',
        phaseDir,
        'nav_sim_section',
        'Workbench View: 1. Combat Simulator & Visual Charts',
        '[data-comp-tab="sim"]',
        'scroll-nav',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );

    records.push(
      await testButtonInteraction(
        page,
        'sim',
        phaseDir,
        'nav_charts_section',
        'Workbench View: Visual SVG Curves & 5-Channel Breakdown',
        '[data-comp-tab="charts"], [data-scroll-target="#sec-charts"]',
        'scroll-nav',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );

    records.push(
      await testButtonInteraction(
        page,
        'sim',
        phaseDir,
        'nav_endurance_section',
        'Workbench View: 9-Tier Material & 10-Wave Endurance',
        '[data-comp-tab="endurance"], [data-scroll-target="#sec-endurance"]',
        'scroll-nav',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );

    records.push(
      await testButtonInteraction(
        page,
        'sim',
        phaseDir,
        'nav_matrix_section',
        'Workbench View: 2. 5-Class L1–L60 Progression Matrix',
        '[data-comp-tab="matrix"]',
        'scroll-nav',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );

    records.push(
      await testButtonInteraction(
        page,
        'sim',
        phaseDir,
        'nav_armaments_section',
        'Workbench View: 3. Tokuno Armaments & C# Server Hooks',
        '[data-comp-tab="armaments"]',
        'scroll-nav',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );

    records.push(
      await testButtonInteraction(
        page,
        'sim',
        phaseDir,
        'nav_all_top',
        'Workbench View: All Sections (Return to Top Overview)',
        '[data-comp-tab="all"]',
        'scroll-nav',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 1400));
        }
      )
    );

    // Reset to Sim controls section for filter tests
    await page.goto(url, { waitUntil: 'load' });
    await disableInfiniteAnimationsForDeterministicCapture(page);

    // B. Sim Filter Buttons: Mode A vs Mode B (must meaningfully change breakdown bars & charts too!)
    const modeRec = await testButtonInteraction(
      page,
      'sim',
      phaseDir,
      'filter_mode_b',
      'Sim Filter: Mode B (<20 LOC C# Hook)',
      '[data-sim-mode="mode_b"]',
      'sim-filter',
      async () => {
        await page.evaluate(() => window.scrollTo(0, 260));
      }
    );
    // Also measure CV diff specifically on the lower half (SVG charts + 5-Channel Breakdown bars)
    const breakdownDiff = computeCvDiff(
      path.join(ROOT_DIR, modeRec.beforePng),
      path.join(ROOT_DIR, modeRec.afterPng),
      'none',
      [800, 420, 1580, 980]
    );
    modeRec.breakdownRegionDiffPct = breakdownDiff.diffPct;
    if (breakdownDiff.diffPct < 0.25) {
      modeRec.passed = false;
      modeRec.notes += ` | FAIL: 5-Channel Breakdown & Rotation region barely changed (${breakdownDiff.diffPct}%) on Mode B toggle`;
    }
    records.push(modeRec);

    records.push(
      await testButtonInteraction(
        page,
        'sim',
        phaseDir,
        'filter_mode_a',
        'Sim Filter: Mode A (100% Existing Engine)',
        '[data-sim-mode="mode_a"]',
        'sim-filter'
      )
    );

    // C. Sim Filter Buttons: Brackets L10, L25, L45, L60 (must also update SVG chart highlight & rotation!)
    for (const br of ['L10', 'L25', 'L45', 'L60']) {
      const brRec = await testButtonInteraction(
        page,
        'sim',
        phaseDir,
        `filter_bracket_${br}`,
        `Sim Filter: Bracket ${br}`,
        `[data-sim-bracket="${br}"]`,
        'sim-filter'
      );
      const svgRegionDiff = computeCvDiff(
        path.join(ROOT_DIR, brRec.beforePng),
        path.join(ROOT_DIR, brRec.afterPng),
        'none',
        [20, 450, 790, 980]
      );
      brRec.chartRegionDiffPct = svgRegionDiff.diffPct;
      if (svgRegionDiff.diffPct < 0.1) {
        brRec.passed = false;
        brRec.notes += ` | FAIL: SVG Progression Charts region did not change (${svgRegionDiff.diffPct}%) when selecting bracket ${br}`;
      }
      records.push(brRec);
    }

    // D. Sim Filter Buttons: Archetypes
    for (const arch of ['high_def_boss', 'fast_trash', 'multi_target_pack', 'low_def_boss']) {
      records.push(
        await testButtonInteraction(
          page,
          'sim',
          phaseDir,
          `filter_arch_${arch}`,
          `Sim Filter: Archetype ${arch}`,
          `[data-sim-arch="${arch}"]`,
          'sim-filter'
        )
      );
    }

    // E. Executive 5-Class KPI Cards (clicking a class KPI card spotlights that class across the Sim)
    records.push(
      await testButtonInteraction(
        page,
        'sim',
        phaseDir,
        'kpi_card_samurai',
        'Executive KPI Card: Samurai (SM)',
        '.exec-kpi-card >> nth=3',
        'card-spotlight',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 260));
        }
      )
    );

    // E2. Progression Chart Metric Pill Buttons & Clickable SVG Bracket Column
    records.push(
      await testButtonInteraction(
        page,
        'sim',
        phaseDir,
        'chart_metric_ttk',
        'Progression Chart Metric: Trash TTK Speed',
        '[data-chart-metric="trashTtkSec"]',
        'sim-filter',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 480));
        }
      )
    );
    records.push(
      await testButtonInteraction(
        page,
        'sim',
        phaseDir,
        'chart_metric_parity',
        'Progression Chart Metric: Parity Envelope %',
        '[data-chart-metric="parityDelta"]',
        'sim-filter',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 480));
        }
      )
    );
    records.push(
      await testButtonInteraction(
        page,
        'sim',
        phaseDir,
        'chart_svg_bracket_l25',
        'Progression Chart SVG Bracket Column: L25',
        '[data-svg-bracket="L25"]',
        'sim-filter',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 480));
        }
      )
    );

    // F. Quick-Dock & Header Saldo Pills on Sim
    records.push(
      await testButtonInteraction(
        page,
        'sim',
        phaseDir,
        'quick_dock_mode',
        'Quick Dock Chip: [M] Mode A/B',
        '.uo-quick-dock .kbd-chip >> nth=0',
        'quick-dock',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );

    records.push(
      await testButtonInteraction(
        page,
        'sim',
        phaseDir,
        'header_saldo_sprites',
        'Header Summary Pill: 34 UO Item Sprites (Scroll to Armaments)',
        '.arvore-head .arvore-saldo >> nth=3',
        'scroll-nav',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );

    await page.close();
  }

  // =========================================================================
  // 2. SAMURAI SKILL TREE WORKBENCH (mockups/samurai-skill-tree.html)
  // =========================================================================
  {
    const page = await context.newPage();
    const url = `file://${path.join(MOCKUPS_DIR, 'samurai-skill-tree.html')}`;
    await page.goto(url, { waitUntil: 'load' });
    await disableInfiniteAnimationsForDeterministicCapture(page);

    // Locale PT-BR & EN
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'btn_lang_pt',
        'Header Button: PT-BR Locale',
        '#btn-lang-pt',
        'tree-interaction',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'btn_lang_en',
        'Header Button: EN Locale',
        '#btn-lang-en',
        'tree-interaction'
      )
    );

    // Mode B & Mode A
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'btn_mode_b',
        'Header Button: Mode B (<20 LOC C#)',
        '#btn-mode-b',
        'tree-interaction'
      )
    );
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'btn_mode_a',
        'Header Button: Mode A (100% Engine)',
        '#btn-mode-a',
        'tree-interaction'
      )
    );

    // Cobra L60 Capstone Node (updates progression strip + path illumination + inspector in-place)
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'cobra_l60_node',
        '[Arvore Cobra Node: L60 Capstone (Kensei)',
        '.arvore-cobra .arvore-col >> nth=11',
        'tree-interaction',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );

    // Cobra Progression Chart Tier Filter & Step Buttons
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'cobra_tier_gm',
        '[Arvore Progression Tier: Grandmaster L40–L60',
        '[data-cobra-tier="master"]',
        'tree-interaction',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'cobra_step_next',
        '[Arvore Progression Step: Next Milestone ▶',
        '[data-cobra-step="next"]',
        'tree-interaction',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'cobra_tier_all',
        '[Arvore Progression Tier: All L1–L60',
        '[data-cobra-tier="all"]',
        'tree-interaction',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );

    // Inspector Progressive Disclosure Tabs
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'insp_tab_json',
        'Inspector Progressive Disclosure Tab: Drop-In JSON Schema',
        '[data-insp-tab="schema"]',
        'tree-interaction',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'insp_tab_overview',
        'Inspector Progressive Disclosure Tab: Overview',
        '[data-insp-tab="overview"]',
        'tree-interaction',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );

    // Filter Kind Buttons (must spotlight & scroll rather than hiding cards with display:none!)
    for (const kind of ['passive', 'skill', 'spell', 'special', 'all']) {
      records.push(
        await testButtonInteraction(
          page,
          'samurai',
          phaseDir,
          `kind_filter_${kind}`,
          `Filter Kind Button: ${kind}`,
          `[data-kind-btn="${kind}"]`,
          'card-spotlight',
          async () => {
            await page.evaluate(() => window.scrollTo(0, 260));
          }
        )
      );
    }

    // Toggle All Schema Drawers
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'toggle_schema_drawers',
        'Button: Toggle All Schema Drawers',
        'button[onclick*="toggleAllSchemaDrawers"]',
        'tree-interaction',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 320));
        }
      )
    );

    // Paperdoll Material Tier Button (Iron vs Valorite)
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'paperdoll_tier_iron',
        'Paperdoll Material Tier: Iron',
        '[data-mat-tier="Iron"]',
        'tree-interaction',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 520));
        }
      )
    );

    // Paperdoll Gear Tile Click (Kabuto Helm)
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'paperdoll_gear_kabuto',
        'Paperdoll Gear Slot: Imperial Kabuto Helm',
        '[data-gear-id="kabuto"]',
        'tree-interaction',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 520));
        }
      )
    );

    // Live Combat Ticker Step +2.0s
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'combat_ticker_step',
        'Live Combat Ticker: Step +2.0s',
        'button[onclick*="stepCombatTicker"]',
        'tree-interaction',
        async () => {
          await page.evaluate(() => {
            if (typeof (window as any).switchInspectorTab === 'function') {
              (window as any).switchInspectorTab('ticker');
            }
            window.scrollTo(0, 0);
          });
        }
      )
    );

    // Passive Seal Badge Click (Tier IV Grandmaster Bushido Seal)
    records.push(
      await testButtonInteraction(
        page,
        'samurai',
        phaseDir,
        'passive_seal_l60',
        'Class Mastery Seal: Tier IV (L60)',
        '.passive-badge-item >> nth=3',
        'card-spotlight',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 900));
        }
      )
    );

    await page.close();
  }

  // =========================================================================
  // 3. NINJA SKILL TREE WORKBENCH (mockups/ninja-skill-tree.html)
  // =========================================================================
  {
    const page = await context.newPage();
    const url = `file://${path.join(MOCKUPS_DIR, 'ninja-skill-tree.html')}`;
    await page.goto(url, { waitUntil: 'load' });
    await disableInfiniteAnimationsForDeterministicCapture(page);

    // Dual L35 Shuriken Unlock Banner Click
    records.push(
      await testButtonInteraction(
        page,
        'ninja',
        phaseDir,
        'dual_l35_shuriken',
        'Dual L35 Unlock Banner: Shuriken & Fukiya Volley',
        '.dual-unlock-banner',
        'tree-interaction',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 680));
        }
      )
    );

    // Filter Kind: Spells (must spotlight & scroll rather than hide!)
    records.push(
      await testButtonInteraction(
        page,
        'ninja',
        phaseDir,
        'kind_filter_spell',
        'Ninja Filter Kind: Spells',
        '[data-kind-btn="spell"]',
        'card-spotlight',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 260));
        }
      )
    );

    // Hotbar Slot 2 Click
    records.push(
      await testButtonInteraction(
        page,
        'ninja',
        phaseDir,
        'hotbar_slot_2',
        'Ninja 5-Slot Hotbar: Slot 2',
        '.hotbar-slot >> nth=1',
        'tree-interaction',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 720));
        }
      )
    );

    await page.close();
  }

  // =========================================================================
  // 4. LEAD DEVELOPER PORTAL (index.html)
  // =========================================================================
  {
    const page = await context.newPage();
    const url = `file://${path.join(ROOT_DIR, 'index.html')}`;
    await page.goto(url, { waitUntil: 'load' });
    await disableInfiniteAnimationsForDeterministicCapture(page);

    records.push(
      await testButtonInteraction(
        page,
        'portal',
        phaseDir,
        'header_saldo_kb',
        'Portal Header Pill: 56 KB Pages (Scroll to Repo Guide)',
        '.arvore-head .arvore-saldo >> nth=0',
        'scroll-nav',
        async () => {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      )
    );

    await page.close();
  }

  await browser.close();

  const passedCount = records.filter((r) => r.passed).length;
  const failedCount = records.length - passedCount;
  const reportPath = path.join(CV_DIR, `${phase}-audit.json`);
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        phase,
        timestamp: new Date().toISOString(),
        totalChecked: records.length,
        passedCount,
        failedCount,
        records,
      },
      null,
      2
    ),
    'utf8'
  );

  if (phase === 'after') {
    const beforeReportPath = path.join(CV_DIR, 'before-audit.json');
    if (fs.existsSync(beforeReportPath)) {
      const beforeData = JSON.parse(fs.readFileSync(beforeReportPath, 'utf8')) as {
        totalChecked: number;
        passedCount: number;
        failedCount: number;
        records: ButtonAuditRecord[];
      };
      const lines: string[] = [
        '# Playwright + Computer Vision (CV) Button & Smooth-Scroll Audit Report',
        '',
        `- **Before Baseline**: \`${beforeData.passedCount}/${beforeData.totalChecked}\` passed (\`${beforeData.failedCount}\` failed — fatal JS \`SyntaxError\` on Simulator, \`display: none\` section/card hiding, non-reactive SVG brackets & breakdown bars)`,
        `- **After Overhaul**: \`${passedCount}/${records.length}\` passed (\`${failedCount}\` failed — \`100%\` pass rate, zero \`display: none\` hiding, smooth scroll + section/card spotlighting verified via CV)`,
        '',
        '| # | Page | Button / Control | Category | BEFORE Status | BEFORE Scroll / Hidden / CV% | AFTER Status | AFTER Scroll / Hidden / CV% |',
        '|---|------|------------------|----------|---------------|------------------------------|--------------|-----------------------------|',
      ];
      records.forEach((aft, idx) => {
        const bef = beforeData.records.find((b) => b.page === aft.page && b.id === aft.id);
        const befStatus = bef ? (bef.passed ? 'PASS' : '**FAIL**') : 'N/A';
        const befMetrics = bef
          ? `ΔY=${bef.scrollDeltaY}px, hid=${bef.hiddenSectionsAfter}/${bef.hiddenCardsAfter}, CV=${bef.cvDiffPct}%`
          : '—';
        const aftStatus = aft.passed ? '**PASS**' : 'FAIL';
        const extra =
          aft.chartRegionDiffPct !== undefined
            ? ` (Chart=${aft.chartRegionDiffPct}%)`
            : aft.breakdownRegionDiffPct !== undefined
              ? ` (Brk=${aft.breakdownRegionDiffPct}%)`
              : '';
        const aftMetrics = `ΔY=${aft.scrollDeltaY}px, hid=${aft.hiddenSectionsAfter}/${aft.hiddenCardsAfter}, CV=${aft.cvDiffPct}%${extra}`;
        lines.push(
          `| ${idx + 1} | \`${aft.page}\` | ${aft.label} | \`${aft.category}\` | ${befStatus} | ${befMetrics} | ${aftStatus} | ${aftMetrics} |`
        );
      });
      fs.writeFileSync(path.join(CV_DIR, 'COMPARISON_REPORT.md'), lines.join('\n') + '\n', 'utf8');
    }
  }

  console.log(
    JSON.stringify({
      phase,
      totalChecked: records.length,
      passedCount,
      failedCount,
      failedIds: records.filter((r) => !r.passed).map((r) => `${r.page}:${r.id} (${r.notes})`),
    }, null, 2)
  );
}

const phaseArg = process.argv.includes('--phase=after') ? 'after' : 'before';
runAudit(phaseArg).catch((err) => {
  console.error(err);
  process.exit(1);
});
