// SOURCE: https://uoidle.com/assets/Jogo-D5xEfvfV.js
// BUNDLE_VERSION: 0.99.0
// BUNDLE_SHA256: 4770a0fcb06e7222f285f6f3b1fdd0da2ea3952a94d0f493a69f527016e73b0d
// AST_SPAN: L8192-L9611
let tb = new Map();
function PE(e) {
  tb = new Map(e.map((a) => [a.id, a]));
}
function Nc(e) {
  return e ? (tb.get(e) ?? null) : null;
}
const OE = new Set([
  'lesser_poison_potion',
  'poison_potion',
  'greater_poison_potion',
  'deadly_poison_potion',
  'lesser_explosion_potion',
  'explosion_potion',
  'greater_explosion_potion',
  'nightsight_potion',
  'night_sight_potion',
  'nightshade',
]);
let Fr = null;
async function Fc() {
  if (Fr) return Fr;
  try {
    const a = await (
      await fetch(vt(`/packs/idle/abilities.json?v=${encodeURIComponent(wc)}`))
    ).json();
    ((Fr = Array.isArray(a.abilities) ? a.abilities : []), PE(Fr));
  } catch {
    ((Fr = []), (tb = new Map()));
  }
  return Fr;
}
function Uw(e, a) {
  const n = a.includeLocked !== !1;
  return e.filter((s) =>
    s.tab !== a.tab ||
    OE.has(s.id) ||
    (a.tab !== 'item' && s.kind === 'ItemUse') ||
    s.kind === 'Passive' ||
    (!n && s.unlock > a.level)
      ? !1
      : a.tab === 'item' || s.class === '*'
        ? !0
        : a.idleClass
          ? s.class === a.idleClass
          : !1
  );
}
function bx(e, a) {
  return e.unlock > a;
}
function Tt(e, a, n) {
  if (!a || !sn.isInitialized) return a;
  const s = sn.t(e, n);
  return typeof s == 'string' && s && s !== e ? s : a;
}
function Sc(e, a) {
  const n = {};
  for (const [s, o] of Object.entries(a)) {
    const r = `${e}.${s}`;
    if (typeof o == 'function') {
      const i = o;
      n[s] = (...c) => Tt(r, i(...c), { v: c[0] });
    } else Object.defineProperty(n, s, { enumerable: !0, get: () => Tt(r, o) });
  }
  return n;
}
const Im = 3617,
  RE = new Set([Im, 3846, 3847, 3848, 3849, 3851, 3852]),
  xx = {
    1041314: 'Poção de Visão Noturna',
    1041315: 'Poção de Cura Menor',
    1041316: 'Poção de Cura',
    1041317: 'Poção de Cura Maior',
    1041318: 'Poção de Agilidade',
    1041319: 'Poção de Agilidade Maior',
    1041320: 'Poção de Força',
    1041321: 'Poção de Força Maior',
    1041322: 'Poção de Veneno Menor',
    1041323: 'Poção de Veneno',
    1041324: 'Poção de Veneno Maior',
    1041325: 'Poção de Veneno Mortal',
    1041326: 'Poção de Revigorar',
    1041327: 'Poção de Revigorar Total',
    1041328: 'Poção de Vida Menor',
    1041329: 'Poção de Vida',
    1041330: 'Poção de Vida Maior',
    1041331: 'Poção de Explosão Menor',
    1041332: 'Poção de Explosão',
    1041333: 'Poção de Explosão Maior',
    1041334: 'Poção de Conflagração',
    1041335: 'Poção de Conflagração Maior',
    1041338: 'Poção de Explosão Confusa',
    1041339: 'Poção de Explosão Confusa Maior',
    1041340: 'Poção de Invisibilidade',
    9000001: 'Poção de Mana Menor',
    9000002: 'Poção de Mana',
    9000003: 'Poção de Mana Maior',
  },
  $E = {
    3617: 'Bandagem',
    3846: 'Poção de Mana',
    3847: 'Poção de Cura',
    3848: 'Poção de Agilidade',
    3849: 'Poção de Força',
    3850: 'Poção de Veneno',
    3851: 'Poção de Revigorar',
    3852: 'Poção de Vida',
    3853: 'Poção de Explosão',
  },
  kc = {
    bandage: Im,
    lesser_heal_potion: 3852,
    heal_potion: 3852,
    greater_heal_potion: 3852,
    lesser_cure_potion: 3847,
    cure_potion: 3847,
    greater_cure_potion: 3847,
    refresh_potion: 3851,
    total_refresh_potion: 3851,
    agility_potion: 3848,
    greater_agility_potion: 3848,
    strength_potion: 3849,
    greater_strength_potion: 3849,
    intelligence_potion: 3846,
    greater_intelligence_potion: 3846,
    lesser_mana_potion: 3846,
    mana_potion: 3846,
    greater_mana_potion: 3846,
  },
  ki = {
    lesser_mana_potion: 20,
    mana_potion: 20,
    greater_mana_potion: 20,
    intelligence_potion: 31,
    greater_intelligence_potion: 31,
  },
  _E = [
    'bandage',
    'lesser_heal_potion',
    'heal_potion',
    'greater_heal_potion',
    'lesser_cure_potion',
    'cure_potion',
    'greater_cure_potion',
    'refresh_potion',
    'total_refresh_potion',
    'agility_potion',
    'greater_agility_potion',
    'strength_potion',
    'greater_strength_potion',
    'intelligence_potion',
    'greater_intelligence_potion',
    'lesser_mana_potion',
    'mana_potion',
    'greater_mana_potion',
  ];
function vx(e) {
  const a = _E.indexOf(e);
  return a < 0 ? 999 : a;
}
const DE = {
    lesser_heal_potion: 1041328,
    heal_potion: 1041329,
    greater_heal_potion: 1041330,
    lesser_cure_potion: 1041315,
    cure_potion: 1041316,
    greater_cure_potion: 1041317,
    refresh_potion: 1041326,
    total_refresh_potion: 1041327,
    agility_potion: 1041318,
    greater_agility_potion: 1041319,
    strength_potion: 1041320,
    greater_strength_potion: 1041321,
    lesser_mana_potion: 9000001,
    mana_potion: 9000002,
    greater_mana_potion: 9000003,
    intelligence_potion: 9000004,
    greater_intelligence_potion: 9000005,
  },
  ab = /^(black|orange|blue|white|green|red|yellow|purple)\s+potion$/i,
  Fw = 9000001,
  Bw = 9000002,
  Hw = 9000003,
  zw = 9000004,
  Gw = 9000005;
function Tm(e) {
  return (e >= 1041314 && e <= 1041340) || e === Fw || e === Bw || e === Hw || e === zw || e === Gw;
}
const LE = 1050039;
function Rp(e) {
  if (e)
    for (const a of e.split('	')) {
      const n = a.trim().match(/^#(\d{5,})$/);
      if (!n) continue;
      const s = Number(n[1]);
      if (Tm(s)) return s;
    }
}
function Vw(e) {
  if (e != null && e.length)
    for (const a of e) {
      if (Tm(a.cliloc)) return a.cliloc;
      if (a.cliloc === LE) {
        const s = Rp(a.args);
        if (s) return s;
      }
      const n = Rp(a.args);
      if (n) return n;
    }
}
function nb(e, a) {
  const n = e & 65535,
    s = a.toLowerCase();
  if (!s || ab.test(s.trim())) return;
  const o = /\b(greater|maior|mayor|total)\b/.test(s),
    r = /\b(lesser|menor)\b/.test(s),
    i = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  switch (n) {
    case 3852:
      if (o) return 1041330;
      if (r) return 1041328;
      if (/\b(heal|vida)\b/.test(s)) return 1041329;
      break;
    case 3847:
      if (o) return 1041317;
      if (r) return 1041315;
      if (/\b(cure|cura)\b/.test(s)) return 1041316;
      break;
    case 3851:
      if (o || /\btotal\b/.test(s)) return 1041327;
      if (/\b(refresh|revigorar|stamina)\b/.test(s)) return 1041326;
      break;
    case 3848:
      if (o) return 1041319;
      if (/\b(agility|agilidade)\b/.test(s)) return 1041318;
      break;
    case 3849:
      if (o) return 1041321;
      if (/\b(strength|força|forca)\b/.test(s)) return 1041320;
      break;
    case 3846:
      return /\b(intelligence|inteligencia|inteligencia)\b/.test(i)
        ? o
          ? Gw
          : zw
        : /\bmana\b/.test(i)
          ? o
            ? Hw
            : r
              ? Fw
              : Bw
          : void 0;
  }
}
function Pm(e) {
  return RE.has(e & 65535);
}
function sb(e, a) {
  const n = e & 65535;
  if (n === Im) return Tt('consumivel.bandagem', 'Bandagem');
  const s = Vw(a == null ? void 0 : a.oplLines),
    o =
      (a != null && a.cliloc && Tm(a.cliloc) ? a.cliloc : void 0) ??
      s ??
      (a != null && a.oplText ? nb(n, a.oplText) : void 0);
  if (o && xx[o]) return Tt(`consumivel.pocao.${o}`, xx[o]);
  const r = ((a == null ? void 0 : a.oplText) ?? '').trim();
  if (r && !ab.test(r)) return r.replace(/^an?\s+/i, '').replace(/\s+/g, ' ');
  const i = $E[n];
  return i
    ? Tt(`consumivel.familia.${n.toString(16)}`, i)
    : (a == null ? void 0 : a.fallback) || `0x${n.toString(16)}`;
}
function Cc(e, a, n) {
  var r, i, c, l, m;
  const s = li(a >>> 0);
  if (Pm(e))
    return sb(e, {
      oplLines: s == null ? void 0 : s.lines,
      oplText:
        (i = (r = s == null ? void 0 : s.lines) == null ? void 0 : r[0]) == null ? void 0 : i.text,
      fallback: n,
    });
  const o =
    (m =
      (l = (c = s == null ? void 0 : s.lines) == null ? void 0 : c[0]) == null ? void 0 : l.text) ==
    null
      ? void 0
      : m.trim();
  return o && !ab.test(o) ? o : n || `0x${(e & 65535).toString(16)}`;
}
function qE(e, a) {
  const n = e.find((s) => s.serial === a);
  return n ? Math.max(1, n.amount || 1) : 0;
}
function UE(e) {
  if (e.cliloc != null && Tm(e.cliloc)) return e.cliloc;
  const a = Rp(e.oplArgs);
  if (a) return a;
  if (e.oplText) return nb(e.graphic, e.oplText);
}
function $p(e, a) {
  if (!a) return 0;
  const n = a.toLowerCase();
  if (n === 'bandage')
    return e
      .filter((r) => (r.graphic & 65535) === Im)
      .reduce((r, i) => r + Math.max(1, i.amount || 1), 0);
  const s = DE[n],
    o = kc[n];
  if (s == null && o == null) return 0;
  if (s != null) {
    let r = 0,
      i = !1,
      c = !1,
      l = 0;
    for (const m of e) {
      if (o != null && (m.graphic & 65535) !== o) continue;
      l += Math.max(1, m.amount || 1);
      const g = UE(m);
      g != null && ((c = !0), g === s && ((i = !0), (r += Math.max(1, m.amount || 1))));
    }
    return i ? r : o === 3846 ? 0 : !c && o != null ? l : 0;
  }
  return o === 3846
    ? 0
    : e
        .filter((r) => (r.graphic & 65535) === o)
        .reduce((r, i) => r + Math.max(1, i.amount || 1), 0);
}
const dh = 240,
  mh = 220;
function FE(e) {
  if (!e) return { right: '0.25rem', bottom: '220px', left: 'auto', top: 'auto' };
  const a = document.querySelector('.stage'),
    n = a == null ? void 0 : a.getBoundingClientRect(),
    s = (n == null ? void 0 : n.left) ?? 0,
    o = (n == null ? void 0 : n.top) ?? 0,
    r = (a == null ? void 0 : a.clientWidth) ?? window.innerWidth,
    i = (a == null ? void 0 : a.clientHeight) ?? window.innerHeight,
    c = 56;
  let l = e.x - s + c,
    m = e.y - o - 20;
  return (
    l + dh > r - 8 && (l = e.x - s - dh - c),
    m + mh > i - 8 && (m = e.y - o - mh - 16),
    (l = Math.min(Math.max(8, l), Math.max(8, r - dh - 8))),
    (m = Math.min(Math.max(8, m), Math.max(8, i - mh - 8))),
    { left: l, top: m, right: 'auto', bottom: 'auto' }
  );
}
function Br(e, a) {
  return Number.isFinite(e) ? Math.min(a, Math.max(1, Math.floor(e))) : 1;
}
function Ww({ item: e, origin: a, onConfirm: n, onCancel: s, hint: o }) {
  const { t: r } = Se(),
    i = Math.max(1, e.amount),
    [c, l] = d.useState(i),
    [m, g] = d.useState(() => co()),
    [b, f] = d.useState(null),
    [h, u] = d.useState(0),
    p = d.useRef(null),
    v = d.useId();
  (d.useEffect(() => {
    l(i);
  }, [e.serial, i]),
    d.useEffect(() => {
      Ka().then(g);
    }, []),
    d.useEffect(
      () =>
        Oc((j) => {
          if (!j) {
            f(null);
            return;
          }
          const w = new Map();
          for (const [C, S] of j) w.set(C, S.name);
          f(w);
        }),
      []
    ),
    d.useEffect(() => {
      var j, w;
      ((j = p.current) == null || j.focus(), (w = p.current) == null || w.select());
    }, [e.serial]),
    d.useEffect(
      () => (
        vr(e.serial),
        Oi((j) => {
          j >>> 0 === e.serial >>> 0 && u((w) => w + 1);
        })
      ),
      [e.serial]
    ),
    d.useEffect(() => {
      const j = (w) => {
        if (w.key === 'Escape') {
          (w.preventDefault(), s());
          return;
        }
        w.key === 'Enter' && (w.preventDefault(), n(Br(c, i)));
      };
      return (
        window.addEventListener('keydown', j),
        () => window.removeEventListener('keydown', j)
      );
    }, [c, i, s, n]));
  const x = Rc(b, e.graphic),
    y = Cc(e.graphic, e.serial, x);
  return t.jsx(dt, {
    className: 'lift-amount-gump',
    title: r('inventory.splitTitle'),
    onClose: s,
    draggable: !0,
    label: r('inventory.splitTitle'),
    style: FE(a),
    children: t.jsxs('div', {
      className: 'lift-amount-body',
      children: [
        t.jsxs('div', {
          className: 'lift-amount-item',
          children: [
            t.jsx(Ue, {
              pack: m,
              graphic: e.graphic,
              hue: e.hue,
              partialHue: e.partialHue,
              scale: 1,
              amount: i,
              alt: y,
            }),
            t.jsx('p', { className: 'lift-amount-name', children: y }),
          ],
        }),
        t.jsxs('div', {
          className: 'lift-amount-field',
          children: [
            t.jsx('label', { htmlFor: v, children: o ?? r('inventory.splitHint') }),
            t.jsxs('div', {
              className: 'lift-amount-stepper',
              children: [
                t.jsx('button', {
                  type: 'button',
                  className: 'lift-amount-step no-gump-drag',
                  'aria-label': r('inventory.splitDec'),
                  disabled: c <= 1,
                  onClick: () => l(Br(c - 1, i)),
                  children: '‹',
                }),
                t.jsx('input', {
                  id: v,
                  ref: p,
                  className: 'no-gump-drag',
                  type: 'text',
                  inputMode: 'numeric',
                  autoComplete: 'off',
                  value: c,
                  onChange: (j) => {
                    const w = j.target.value.replace(/\D/g, '');
                    if (w === '') {
                      l(1);
                      return;
                    }
                    l(Br(Number(w), i));
                  },
                }),
                t.jsx('button', {
                  type: 'button',
                  className: 'lift-amount-step no-gump-drag',
                  'aria-label': r('inventory.splitInc'),
                  disabled: c >= i,
                  onClick: () => l(Br(c + 1, i)),
                  children: '›',
                }),
              ],
            }),
            t.jsx('p', {
              className: 'lift-amount-max',
              children: r('inventory.splitMax', { max: i }),
            }),
          ],
        }),
        t.jsx('input', {
          className: 'lift-amount-slider no-gump-drag',
          type: 'range',
          min: 1,
          max: i,
          value: c,
          onChange: (j) => l(Br(Number(j.target.value), i)),
        }),
        t.jsxs('div', {
          className: 'lift-amount-actions',
          children: [
            t.jsx('button', {
              type: 'button',
              className: 'chrome-btn',
              onClick: s,
              children: r('auth.cancel'),
            }),
            t.jsx('button', {
              type: 'button',
              className: 'chrome-btn chrome-btn-active',
              onClick: () => n(Br(c, i)),
              children: r('inventory.splitOk'),
            }),
          ],
        }),
      ],
    }),
  });
}
const yx = {
  bandage: 3617,
  lesser_heal_potion: 3852,
  heal_potion: 3852,
  greater_heal_potion: 3852,
  lesser_cure_potion: 3847,
  cure_potion: 3847,
  greater_cure_potion: 3847,
  refresh_potion: 3851,
  total_refresh_potion: 3851,
  agility_potion: 3848,
  greater_agility_potion: 3848,
  strength_potion: 3849,
  greater_strength_potion: 3849,
  lesser_mana_potion: 3846,
  mana_potion: 3846,
  greater_mana_potion: 3846,
  intelligence_potion: 3846,
  greater_intelligence_potion: 3846,
  lesser_poison_potion: 3850,
  poison_potion: 3850,
  greater_poison_potion: 3850,
  deadly_poison_potion: 3850,
  nightsight_potion: 3846,
  lesser_explosion_potion: 3853,
  explosion_potion: 3853,
  greater_explosion_potion: 3853,
  meditate: 3947,
  ranger_rapid_shot: 3903,
  ranger_arrow: 3903,
  warrior_heavy_strike: 5042,
  warrior_whirlwind: 5042,
  warrior_shield_bash: 7026,
  mage_greater_heal: 8e3,
  mage_heal: 7985,
  mage_cure: 7991,
  mage_fireball: 7997,
  mage_harm: 7992,
  mage_magic_arrow: 7986,
  mage_lightning: 8010,
  paladin_close_wounds: 8e3,
  paladin_cleanse: 7991,
  paladin_holy: 8010,
};
function BE(e) {
  return e == null || e <= 0
    ? null
    : e <= 64
      ? 7981 + e
      : e >= 200 && e < 220
        ? 8e3
        : e >= 100 && e < 120
          ? 8800
          : e >= 600
            ? 11601
            : 8e3;
}
function ob(e, a) {
  const n = (e == null ? void 0 : e.id) || a || '';
  return n && yx[n]
    ? yx[n]
    : (e == null ? void 0 : e.kind) === 'Spell' || (e == null ? void 0 : e.kind) === 'spell'
      ? (BE(e.ref) ?? 3643)
      : n.includes('bandage')
        ? 3617
        : n.includes('cure') && n.includes('potion')
          ? 3847
          : n.includes('refresh') && n.includes('potion')
            ? 3851
            : n.includes('agility') && n.includes('potion')
              ? 3848
              : n.includes('strength') && n.includes('potion')
                ? 3849
                : n.includes('poison') && n.includes('potion')
                  ? 3850
                  : n.includes('explosion') && n.includes('potion')
                    ? 3853
                    : n.includes('potion') || n.includes('heal_potion')
                      ? 3852
                      : n.includes('close_wounds') || n.includes('chivalry')
                        ? 8e3
                        : n.includes('arrow') || n.includes('shot') || n.includes('bow')
                          ? 3903
                          : 7956;
}
function rb(e, a, n) {
  if (n != null && n.icon && n.icon > 0) return n.icon;
  if (n != null && n.gumpIcon && n.gumpIcon > 0) return n.gumpIcon;
  const s = ob(n, e);
  return a && a > 0 && s === 7956 ? a : s && s !== 7956 ? s : a && a > 0 ? a : s;
}
const jo = (e) => ({ target: 'self', attr: 'hp', op: '<=', value: e, percent: !0 }),
  hu = (e) => ({ target: 'self', attr: 'mana', op: '<=', value: e, percent: !0 }),
  hh = (e) => ({ target: 'self', attr: 'stam', op: '<=', value: e, percent: !0 }),
  Td = { target: 'self', attr: 'poisoned', op: '==', value: 1 },
  HE = [jo(80), { ...Td, join: 'or' }],
  fu = { target: 'self', attr: 'in_combat', op: '==', value: 1 },
  fh = (e) => ({ target: 'self', attr: e, op: '==', value: 0 }),
  zE = (e) => ({ target: 'self', attr: 'enemies', op: '>=', value: e }),
  GE =
    /whirl|storm|thunder|explosion|meteor|chain|nova|cleave|quake|blizzard|fire.?field|mass_|blade_storm|flurry|aoe|area/i,
  am = /heal|bandage|close_wounds|ki_recovery|_gh$|greater_heal|cure_wound/i,
  Kw = /cure/i,
  VE = /mana_potion|meditat/i,
  WE = /refresh/i,
  KE = /agility/i,
  YE = /strength/i,
  XE = /intelligence/i,
  JE = /bless|protection|reactive|cunning|night_sight|invis/i;
function ro(e) {
  const a = e.toLowerCase();
  return a === 'bandage'
    ? [...HE]
    : a === 'lesser_heal_potion'
      ? [jo(50)]
      : a === 'heal_potion'
        ? [jo(32)]
        : a === 'greater_heal_potion'
          ? [jo(18)]
          : a.includes('heal') && a.includes('potion')
            ? [jo(35)]
            : a === 'lesser_mana_potion'
              ? [hu(40)]
              : a.includes('mana_potion')
                ? [hu(28)]
                : a.includes('meditat')
                  ? [hu(35)]
                  : a === 'lesser_cure_potion' || a === 'cure_potion' || a === 'greater_cure_potion'
                    ? [Td]
                    : a === 'mage_cure' || a === 'necro_magery_cure'
                      ? [Td, { target: 'ally', attr: 'poisoned', op: '==', value: 1, join: 'or' }]
                      : Kw.test(a) && !am.test(a)
                        ? [Td]
                        : a === 'refresh_potion'
                          ? [hh(45)]
                          : a === 'total_refresh_potion'
                            ? [hh(22)]
                            : WE.test(a)
                              ? [hh(40)]
                              : KE.test(a)
                                ? [fu, fh('dex_buff')]
                                : YE.test(a)
                                  ? [fu, fh('str_buff')]
                                  : XE.test(a)
                                    ? [fu, fh('int_buff')]
                                    : JE.test(a)
                                      ? [fu]
                                      : a === 'mage_heal' || a === 'necro_magery_heal'
                                        ? [
                                            jo(50),
                                            {
                                              target: 'ally',
                                              attr: 'hp',
                                              op: '<=',
                                              value: 50,
                                              percent: !0,
                                              join: 'or',
                                            },
                                          ]
                                        : am.test(a)
                                          ? a.includes('greater') || a.includes('_gh')
                                            ? [jo(40)]
                                            : [jo(55)]
                                          : GE.test(a)
                                            ? [zE(3)]
                                            : a === 'warrior_provoke' || a.endsWith('_provoke')
                                              ? [
                                                  {
                                                    target: 'self',
                                                    attr: 'ally_agro',
                                                    op: '==',
                                                    value: 1,
                                                  },
                                                ]
                                              : VE.test(a)
                                                ? [hu(40)]
                                                : [];
}
function Yw(e) {
  return e.kind !== 'Passive';
}
function ib(e) {
  const a = e.tab === 'item' ? 'ability' : e.tab === 'spell' ? 'spell' : 'ability',
    n = e.id === 'meditate' || e.kind === 'Meditate';
  return {
    kind: n ? 'meditate' : a,
    enabled: !0,
    conditions: ro(e.id),
    context: 'hunt',
    abilityId: n ? 'meditate' : e.id,
    label: e.name,
    graphic: rb(e.id, kc[e.id], e),
    hue: e.hue ?? ki[e.id] ?? 0,
  };
}
function Xw(e, a) {
  return e.class === '*' ? !0 : e.class === a;
}
function QE(e, a, n, s) {
  return e.filter((o) => Yw(o) && Xw(o, a) && o.unlock > n && o.unlock <= s);
}
function gn(e, a) {
  return e.find((n) => n.id === a);
}
function ZE(e, a) {
  const n = e.filter((l) => Yw(l) && Xw(l, a) && l.unlock <= 1),
    s = [],
    o = new Set(),
    r = (l) => {
      !l || o.has(l.id) || (o.add(l.id), s.push(ib(l)));
    };
  if (a === 'mage')
    return (
      r(gn(n, 'lesser_heal_potion') ?? gn(e, 'lesser_heal_potion')),
      r(gn(n, 'mage_heal')),
      r(gn(n, 'mage_cure')),
      r(gn(n, 'mage_magic_arrow')),
      r(gn(n, 'lesser_mana_potion') ?? gn(e, 'lesser_mana_potion')),
      s.slice(0, 8)
    );
  (r(gn(n, 'lesser_heal_potion') ?? gn(e, 'lesser_heal_potion')),
    r(gn(n, 'bandage') ?? gn(e, 'bandage')));
  const i = n
    .filter(
      (l) =>
        l.tab !== 'item' &&
        l.kind !== 'ItemUse' &&
        !am.test(l.id) &&
        !Kw.test(l.id) &&
        !l.id.includes('meditat')
    )
    .sort((l, m) => l.unlock - m.unlock)[0];
  r(i);
  const c = n.find((l) => l.tab !== 'item' && am.test(l.id) && l.id !== 'bandage');
  return (
    r(c),
    r(gn(n, 'lesser_mana_potion') ?? gn(e, 'lesser_mana_potion')),
    r(gn(n, 'lesser_cure_potion') ?? gn(e, 'lesser_cure_potion')),
    r(gn(n, 'refresh_potion') ?? gn(e, 'refresh_potion')),
    s.slice(0, 8)
  );
}
const Mo = 0;
function e5(e, a) {
  return null;
}
const Gn = 12,
  _p = 'idle-hotbar-bind';
function t5(e, a = 0) {
  return a > 0 ? `s${a >>> 0}` : e ? `n:${e}` : '';
}
function Jw(e) {
  return `uo-idle-hotbar-v6:${e}`;
}
function Pd(e) {
  let a = !1;
  const n = e.map((s) => {
    if (!s || (s.conditions && s.conditions.length > 0)) return s;
    const o = (s.abilityId ?? '').toLowerCase(),
      r = (s.graphic ?? 0) & 65535,
      i =
        o ||
        (r === 3617
          ? 'bandage'
          : r === 3852
            ? 'lesser_heal_potion'
            : r === 3847
              ? 'lesser_cure_potion'
              : '');
    if (!i || (i !== 'bandage' && !i.includes('potion') && !i.includes('heal'))) return s;
    const c = ro(i);
    return c.length ? ((a = !0), { ...s, abilityId: s.abilityId || i, conditions: c }) : s;
  });
  return a ? n : e;
}
function pu(e, a) {
  if (
    a !== 'ranger' ||
    e.some((o) => ((o == null ? void 0 : o.abilityId) ?? '').toLowerCase() === 'lesser_mana_potion')
  )
    return e;
  const n = e.findIndex((o) => o == null);
  if (n < 0) return e;
  const s = e.slice();
  return (
    (s[n] = {
      kind: 'ability',
      abilityId: 'lesser_mana_potion',
      label: 'Lesser Mana',
      enabled: !0,
      graphic: 3846,
      hue: 20,
      conditions: [{ target: 'self', attr: 'mana', op: '<=', value: 30, percent: !0 }],
    }),
    s
  );
}
function Ao() {
  return Array.from({ length: Gn }, () => null);
}
function cr(e) {
  if (!e || typeof e != 'object') return null;
  const a = e,
    n = a.kind || 'item',
    s = a.enabled !== !1,
    o = Array.isArray(a.conditions),
    r = o
      ? a.conditions
          .filter((h) => h && typeof h == 'object' && h.target && h.attr && h.op)
          .map((h) => ({
            target: h.target,
            attr: h.attr,
            op: h.op,
            value: Number(h.value) || 0,
            percent: !!h.percent,
            who: typeof h.who == 'number' && h.who > 0 ? h.who >>> 0 : void 0,
            join: h.join === 'or' ? 'or' : void 0,
          }))
      : [],
    i =
      r.length > 0
        ? r
        : o
          ? []
          : typeof a.abilityId == 'string' && a.abilityId
            ? ro(a.abilityId)
            : [];
  if (n === 'item') {
    const h = Number(a.serial) || 0;
    return h <= 0
      ? null
      : {
          kind: 'item',
          enabled: s,
          conditions: i,
          context:
            a.context === 'hunt' || a.context === 'gather' || a.context === 'always'
              ? a.context
              : 'always',
          serial: h >>> 0,
          graphic: Number(a.graphic) || 0,
          hue: Number(a.hue) || 0,
          partialHue: !!a.partialHue,
          label: typeof a.label == 'string' ? a.label : void 0,
        };
  }
  const c = String(a.abilityId || ''),
    l =
      {
        warrior_double_strike_2_r2: 'warrior_double_strike_2',
        ranger_charged_shot_r2: 'ranger_charged_shot',
      }[c] ?? c,
    m =
      a.context === 'hunt' || a.context === 'gather' || a.context === 'always'
        ? a.context
        : 'always';
  if (n === 'meditate' || l === 'meditate')
    return {
      kind: 'meditate',
      enabled: s,
      conditions: i,
      context: m,
      abilityId: 'meditate',
      label: typeof a.label == 'string' ? a.label : 'Meditate',
    };
  if (!l) return null;
  const g = Number(a.graphic) || 0,
    f =
      Number(a.hue) ||
      0 ||
      ki[l] ||
      (g === 3846 && /intelligence/i.test(l) ? 31 : 0) ||
      (g === 3846 && /mana_potion/i.test(l) ? 20 : 0);
  return {
    kind: n,
    enabled: s,
    conditions: i,
    context: m,
    abilityId: l,
    label: String(a.label || l),
    graphic: g,
    hue: f,
  };
}
function jx(e, a = '') {
  if (!e) return Ao();
  try {
    let n = localStorage.getItem(Jw(e));
    if (
      (!n &&
        e.startsWith('n:') &&
        a &&
        (n =
          localStorage.getItem(`uo-idle-hotbar-v5:${a}`) ||
          localStorage.getItem(`uo-idle-hotbar-v4:${a}`) ||
          localStorage.getItem(`uo-idle-hotbar-v3:${a}`) ||
          localStorage.getItem(`uo-idle-hotbar-v2:${a}`) ||
          localStorage.getItem(`uo-idle-hotbar-v1:${a}`)),
      !n)
    )
      return Ao();
    const s = JSON.parse(n);
    if (!Array.isArray(s)) return Ao();
    const o = Ao();
    for (let r = 0; r < Gn; r++) {
      const i = s[r];
      i && typeof i == 'object' && !('kind' in i)
        ? (o[r] = cr({ ...i, kind: 'item', enabled: !0, conditions: [] }))
        : (o[r] = cr(i));
    }
    return Pd(o);
  } catch {
    return Ao();
  }
}
function xs(e, a) {
  if (e)
    try {
      localStorage.setItem(Jw(e), JSON.stringify(a));
    } catch {}
}
function Qw(e) {
  return `uo-idle-hotbar-seeded-v9:${e}`;
}
function a5(e, a) {
  const n = [
    `uo-idle-hotbar-seeded-v8:${e}`,
    `uo-idle-hotbar-seeded-v3:${e}`,
    `uo-idle-hotbar-seeded-v5:${e}`,
    `uo-idle-hotbar-seeded-v6:${e}`,
    `uo-idle-hotbar-seeded-v7:${e}`,
  ];
  return (
    a &&
      n.push(
        `uo-idle-hotbar-seeded-v8:${a}`,
        `uo-idle-hotbar-seeded-v7:${a}`,
        `uo-idle-hotbar-seeded-v6:${a}`
      ),
    n
  );
}
function gu(e) {
  try {
    return !!localStorage.getItem(Qw(e));
  } catch {
    return !1;
  }
}
function ph(e, a = '') {
  try {
    localStorage.setItem(Qw(e), '1');
    for (const n of a5(e, a)) localStorage.removeItem(n);
  } catch {}
}
const Gl = [{ target: 'self', attr: 'hp', op: '<=', value: 50, percent: !0 }],
  Zw = ro('bandage'),
  eN = ro('lesser_cure_potion'),
  Dp = [
    { target: 'self', attr: 'poisoned', op: '==', value: 1 },
    { target: 'ally', attr: 'poisoned', op: '==', value: 1, join: 'or' },
  ],
  tN = [
    { target: 'self', attr: 'hp', op: '<=', value: 50, percent: !0 },
    { target: 'ally', attr: 'hp', op: '<=', value: 50, percent: !0, join: 'or' },
  ],
  n5 = [{ target: 'self', attr: 'hp', op: '<=', value: 55, percent: !0 }],
  aN = [{ target: 'self', attr: 'mana', op: '<=', value: 30, percent: !0 }];
function vs() {
  return {
    kind: 'ability',
    abilityId: 'lesser_heal_potion',
    label: 'Lesser Heal',
    enabled: !0,
    graphic: 3852,
    conditions: [...Gl],
  };
}
function ys() {
  return {
    kind: 'ability',
    abilityId: 'bandage',
    label: 'Bandage',
    enabled: !0,
    graphic: 3617,
    conditions: [...Zw],
  };
}
function Bn() {
  return {
    kind: 'ability',
    abilityId: 'lesser_cure_potion',
    label: 'Lesser Cure',
    enabled: !0,
    graphic: 3847,
    conditions: [...eN],
  };
}
function wx() {
  return {
    kind: 'ability',
    abilityId: 'lesser_mana_potion',
    label: 'Lesser Mana',
    enabled: !0,
    graphic: 3846,
    conditions: [...aN],
  };
}
const gh = {
  warrior: [vs(), ys(), Bn(), wx()],
  mage: [
    {
      kind: 'ability',
      abilityId: 'lesser_heal_potion',
      label: 'Lesser Heal',
      enabled: !0,
      graphic: 3852,
      conditions: [...Gl],
    },
    {
      kind: 'spell',
      abilityId: 'mage_heal',
      label: 'Heal',
      enabled: !0,
      context: 'always',
      conditions: [...tN],
    },
    {
      kind: 'spell',
      abilityId: 'mage_cure',
      label: 'Cure',
      enabled: !0,
      context: 'always',
      conditions: [...Dp],
    },
    {
      kind: 'spell',
      abilityId: 'mage_magic_arrow',
      label: 'Arrow',
      enabled: !0,
      context: 'hunt',
      conditions: [],
    },
    {
      kind: 'ability',
      abilityId: 'lesser_mana_potion',
      label: 'Lesser Mana',
      enabled: !0,
      graphic: 3846,
      hue: 20,
      conditions: [...aN],
    },
  ],
  ranger: [vs(), ys(), Bn(), wx()],
  necromancer: [
    {
      kind: 'spell',
      abilityId: 'necro_magery_heal',
      label: 'Heal',
      enabled: !0,
      conditions: [...Gl],
    },
    {
      kind: 'spell',
      abilityId: 'necro_magery_cure',
      label: 'Cure',
      enabled: !0,
      conditions: [...eN],
    },
    { kind: 'spell', abilityId: 'necro_pain_spike', label: 'Pain', enabled: !0, conditions: [] },
  ],
  paladin: [
    vs(),
    ys(),
    Bn(),
    {
      kind: 'spell',
      abilityId: 'paladin_close_wounds',
      label: 'CW',
      enabled: !0,
      graphic: 8e3,
      conditions: [...n5],
    },
  ],
  berserker: [
    vs(),
    ys(),
    Bn(),
    {
      kind: 'ability',
      abilityId: 'berserker_cleave',
      label: 'Cleave',
      enabled: !0,
      conditions: [],
    },
  ],
  duelist: [
    vs(),
    ys(),
    Bn(),
    {
      kind: 'ability',
      abilityId: 'duelist_piercing',
      label: 'Pierce',
      enabled: !0,
      conditions: [],
    },
  ],
  assassin: [
    vs(),
    ys(),
    Bn(),
    { kind: 'ability', abilityId: 'assassin_poison', label: 'Poison', enabled: !0, conditions: [] },
  ],
  ninja: [
    vs(),
    ys(),
    Bn(),
    { kind: 'ability', abilityId: 'ninja_focus', label: 'Focus', enabled: !0, conditions: [] },
  ],
  monk: [vs(), ys(), Bn()],
  samurai: [
    vs(),
    ys(),
    Bn(),
    { kind: 'ability', abilityId: 'samurai_lightning', label: 'Bolt', enabled: !0, conditions: [] },
  ],
  mystic: [
    {
      kind: 'spell',
      abilityId: 'mystic_magery_heal',
      label: 'Heal',
      enabled: !0,
      conditions: [...Gl],
    },
    Bn(),
    { kind: 'spell', abilityId: 'mystic_eagle', label: 'Eagle', enabled: !0, conditions: [] },
  ],
  spellweaver: [
    { kind: 'spell', abilityId: 'sw_magery_heal', label: 'Heal', enabled: !0, conditions: [...Gl] },
    Bn(),
    { kind: 'spell', abilityId: 'sw_thunderstorm', label: 'Storm', enabled: !0, conditions: [] },
  ],
  bard: [
    vs(),
    ys(),
    Bn(),
    { kind: 'ability', abilityId: 'bard_discord', label: 'Discord', enabled: !0, conditions: [] },
  ],
  tamer: [
    vs(),
    ys(),
    Bn(),
    { kind: 'ability', abilityId: 'tamer_call', label: 'Call', enabled: !0, conditions: [] },
  ],
};
function s5(e, a, n = 0) {
  const s = t5(e, n),
    [o, r] = d.useState(() => jx(s, e)),
    i = d.useRef(o);
  ((i.current = o),
    d.useEffect(() => {
      var I, k;
      if (!s) {
        r(Ao());
        return;
      }
      let u = jx(s, e);
      const p = u.every((P) => P == null),
        v = new Set([
          'warrior_shield_bash',
          'warrior_heavy_strike',
          'mage_greater_heal',
          'necro_magery_gh',
          'mystic_magery_gh',
          'sw_magery_gh',
          'ranger_rapid_shot',
          'monk_flurry',
          'monk_ki_recovery',
        ]),
        x = !p && !gu(s) && u.some((P) => (P == null ? void 0 : P.abilityId) && v.has(P.abilityId)),
        y =
          !p &&
          !gu(s) &&
          ((I = u[0]) == null ? void 0 : I.abilityId) === 'bandage' &&
          ((k = u[0].conditions) == null
            ? void 0
            : k.some((P) => P.attr === 'hp' && P.percent && P.value <= 50));
      if ((p || y || x) && a && gh[a] && s && n > 0 && !gu(s)) {
        const P = Ao();
        (gh[a].forEach((E, U) => {
          U < Gn && (P[U] = { ...E, conditions: [...E.conditions] });
        }),
          (u = P),
          xs(s, P));
      }
      let j = !1;
      u = u.map((P) => {
        if (!P || (P.abilityId ?? '').toLowerCase() !== 'bandage') return P;
        const E = P.conditions ?? [],
          U = E.some((M) => M.attr === 'poisoned'),
          N = E.some((M) => M.join === 'or');
        return U && N ? P : ((j = !0), { ...P, conditions: Zw.map((M) => ({ ...M })) });
      });
      const w = pu(u, a);
      w !== u && ((u = w), (j = !0));
      const C = new Set(['mage_cure', 'necro_magery_cure']),
        S = u
          .map((P, E) => (P && C.has((P.abilityId ?? '').toLowerCase()) ? E : -1))
          .filter((P) => P >= 0);
      if (S.length >= 2) {
        const P = S[0];
        u = u.map((E, U) =>
          U === P
            ? ((j = !0),
              {
                ...E,
                label: E.label || 'Cure',
                context: 'always',
                conditions: Dp.map((N) => ({ ...N })),
              })
            : S.includes(U)
              ? ((j = !0), null)
              : E
        );
      } else if (S.length === 1) {
        const P = S[0],
          E = u[P],
          U = E.conditions ?? [],
          N = U.some((T) => T.target === 'ally'),
          M = U.some((T) => T.join === 'or');
        (!N || !M) &&
          ((j = !0),
          (u = u.map((T, D) => (D === P ? { ...E, conditions: Dp.map((q) => ({ ...q })) } : T))));
      }
      for (const P of ['mage_heal', 'necro_magery_heal']) {
        const E = u.findIndex(
          (D) => ((D == null ? void 0 : D.abilityId) ?? '').toLowerCase() === P
        );
        if (E < 0) continue;
        const U = u[E],
          N = U.conditions ?? [],
          M = N.some((D) => D.target === 'ally' && D.attr === 'hp'),
          T = N.some((D) => D.join === 'or');
        (M && T) ||
          ((j = !0),
          (u = u.map((D, q) => (q === E ? { ...U, conditions: tN.map((F) => ({ ...F })) } : D))));
      }
      if (
        !u.some((P) => {
          const E = ((P == null ? void 0 : P.abilityId) ?? '').toLowerCase();
          return (
            E.includes('cure_potion') ||
            E === 'mage_cure' ||
            E === 'necro_magery_cure' ||
            E === 'mage_arch_cure'
          );
        })
      ) {
        const P = u.findIndex((E) => E == null);
        P >= 0 && ((u = u.map((E, U) => (U === P ? { ...Bn() } : E))), (j = !0));
      }
      (j && s && xs(s, u), r(u));
    }, [e, a, s, n]));
  const c = d.useCallback(
      (u, p) => {
        if (u < 0 || u >= Gn) return;
        const v = cr({ ...p, enabled: p.enabled !== !1, conditions: p.conditions ?? [] });
        v &&
          r((x) => {
            if (bh(x, v, u)) return (Sx(), x);
            const y = x.map((j, w) => (w === u ? v : j));
            return (xs(s, y), y);
          });
      },
      [s]
    ),
    l = d.useCallback(
      (u, p) => {
        if (u < 0 || u >= Gn) return !1;
        const v = p ? cr(p) : null;
        return v && bh(i.current, v, u)
          ? (Sx(), !1)
          : (r((x) => {
              const y = x.map((j, w) => (w === u ? v : j));
              return (xs(s, y), y);
            }),
            !0);
      },
      [s]
    ),
    m = d.useCallback(
      (u) => {
        l(u, null);
      },
      [l]
    ),
    g = d.useCallback(
      (u, p) => {
        u === p ||
          u < 0 ||
          p < 0 ||
          u >= Gn ||
          p >= Gn ||
          r((v) => {
            const x = v.map((j) => j),
              y = x[u];
            return ((x[u] = x[p]), (x[p] = y), xs(s, x), x);
          });
      },
      [s]
    ),
    b = d.useCallback(
      (u) => {
        r((p) => {
          const v = p.map((y) => y);
          let x = 0;
          for (let y = 0; y < Gn && x < u.length; y++) {
            if (v[y] != null) continue;
            const j = cr(u[x]);
            (x++, !(!j || bh(v, j, y)) && (v[y] = j));
          }
          return (xs(s, v), v);
        });
      },
      [s]
    ),
    f = d.useCallback(
      (u) => {
        if (!(!s || !a || n <= 0)) {
          if (gu(s)) {
            r((p) => {
              const v = pu(Pd(p), a);
              return (v !== p && xs(s, v), v);
            });
            return;
          }
          r((p) => {
            const v = ZE(u, a),
              x = gh[a] ?? [],
              y = v.length ? v : x;
            if (!y.length) {
              const C = pu(Pd(p), a);
              return (xs(s, C), ph(s, e), C);
            }
            if (p.some((C) => C != null)) {
              const C = pu(Pd(p), a);
              return (xs(s, C), ph(s, e), C);
            }
            const w = Ao();
            return (
              y.forEach((C, S) => {
                if (S < Gn) {
                  const A =
                    (C.abilityId ?? '').toLowerCase() === 'bandage'
                      ? ro('bandage')
                      : [...C.conditions];
                  w[S] = cr({ ...C, conditions: A });
                }
              }),
              xs(s, w),
              ph(s, e),
              w
            );
          });
        }
      },
      [s, a, e, n]
    );
  d.useEffect(() => {
    const u = (p) => {
      const v = p.detail;
      !v || v.index == null || c(v.index, v);
    };
    return (window.addEventListener(_p, u), () => window.removeEventListener(_p, u));
  }, [c]);
  const h = d.useCallback(
    (u) => {
      !u ||
        !s ||
        r((p) => {
          const v = p[Mo];
          if ((v == null ? void 0 : v.abilityId) === u.id && v.enabled !== !1) return p;
          const x = p.map((j, w) =>
              w !== Mo && (j == null ? void 0 : j.abilityId) === u.id ? null : j
            ),
            y = x[Mo];
          if (y && y.abilityId !== u.id) {
            const j = x.findIndex((w, C) => C !== Mo && w == null);
            j >= 0 && (x[j] = y);
          }
          return ((x[Mo] = cr({ ...ib(u), enabled: !0 })), xs(s, x), x);
        });
    },
    [s]
  );
  return {
    slots: o,
    bind: c,
    setSlot: l,
    clear: m,
    swapSlots: g,
    addBinds: b,
    seedFromCatalog: f,
    fixar: h,
  };
}
