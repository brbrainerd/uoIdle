// SOURCE: https://uoidle.com/assets/Jogo-D5xEfvfV.js
// BUNDLE_VERSION: 0.99.0
// BUNDLE_SHA256: 4770a0fcb06e7222f285f6f3b1fdd0da2ea3952a94d0f493a69f527016e73b0d
// AST_SPAN: L55437-L55973
function pq(e, a, n) {
  const [s, o] = d.useState(() => new Map()),
    [r, i] = d.useState({});
  return (
    d.useEffect(() => {
      if (!(!e || !a))
        return e.subscribeSpeech((c) => {
          const l = it(c);
          if (!l) return;
          if (l.assunto === 'SUPPLY') {
            i(hj(l.dado));
            return;
          }
          if (l.assunto !== 'HABINFO') return;
          const m = Array.isArray(l.dado.lista) ? l.dado.lista : [];
          (o(new Map(m.map((g) => [g.id, g]))), l.dado.supply !== void 0 && i(hj(l.dado.supply)));
        });
    }, [e, a]),
    d.useEffect(() => {
      if (!e || !a) return;
      const c = () => e.say('[habinfo'),
        l = () => e.say('[supply'),
        m = window.setTimeout(c, 2500),
        g = window.setTimeout(l, 1200),
        b = window.setInterval(c, hq),
        f = window.setInterval(l, fq);
      return () => {
        (window.clearTimeout(m),
          window.clearTimeout(g),
          window.clearInterval(b),
          window.clearInterval(f));
      };
    }, [e, a, n]),
    { infos: s, supply: r }
  );
}
function Ng(e, a) {
  if (!e) return '';
  const n = (o, r) => {
      const i = Math.round((o + r) / 2);
      return o === r ? String(i) : `~${i}`;
    },
    s = [];
  if (e.dmax && e.dmax > 0) {
    let o = a('hotbar.damage', { v: n(e.dmin ?? e.dmax, e.dmax) });
    (e.golpes &&
      e.golpes > 1 &&
      (o += ` ×${e.golpes} = ~${Math.round((((e.dmin ?? e.dmax) + e.dmax) / 2) * e.golpes)}`),
      e.area && (o += ` ${a('hotbar.area')}`),
      s.push(o));
  }
  return (
    e.cmax && e.cmax > 0 && s.push(a('hotbar.heal', { v: n(e.cmin ?? e.cmax, e.cmax) })),
    s.join(' · ')
  );
}
function fj(e, a) {
  if (!e) return [];
  const n = (o, r) => (o === r ? String(r) : `${o}–${r}`),
    s = [];
  if (e.dmax && e.dmax > 0) {
    const o = e.dmin ?? e.dmax,
      r = e.golpes && e.golpes > 1 ? e.golpes : 1,
      i = Math.round(((o + e.dmax) / 2) * r);
    (s.push(a('hotbar.detalhe.porGolpe', { v: n(o, e.dmax) })),
      r > 1 && s.push(a('hotbar.detalhe.total', { n: r, v: i })),
      e.area && s.push(a('hotbar.detalhe.area')),
      e.cd > 0 &&
        s.push(
          a('hotbar.detalhe.porSegundo', {
            v: (i / e.cd).toLocaleString(sn.language, { maximumFractionDigits: 1 }),
          })
        ));
  }
  return (
    e.cmax && e.cmax > 0 && s.push(a('hotbar.detalhe.cura', { v: n(e.cmin ?? e.cmax, e.cmax) })),
    e.mana > 0 && s.push(a('hotbar.detalhe.mana', { v: e.mana })),
    s
  );
}
function Sg(e, a) {
  return e
    ? e.id === 'warrior_slash' || e.id === 'ranger_arrow' || e.id === 'monk_palm'
      ? a('hotbar.autoAttackCd')
      : e.cd > 0
        ? a('hotbar.cooldownSec', { s: Number.isInteger(e.cd) ? e.cd : e.cd.toFixed(1) })
        : a('hotbar.noCooldown')
    : '';
}
function gq(e, a) {
  if (!e || e.length === 0) return '';
  const n = e.map((s) => a(`hotbar.reagent.${s}`, { defaultValue: s })).join(', ');
  return a('hotbar.reagents', { list: n });
}
const ok = {
  blackPearl: 3962,
  bloodMoss: 3963,
  garlic: 3972,
  ginseng: 3973,
  mandrake: 3974,
  nightshade: 3976,
  spidersSilk: 3981,
  sulfurousAsh: 3980,
  batWing: 3960,
  graveDust: 3983,
  daemonBlood: 3965,
  noxCrystal: 3982,
  pigIron: 3978,
  bone: 3966,
  fertileDirt: 3969,
  dragonsBlood: 16503,
  daemonBone: 3968,
};
function bq({
  slots: e,
  fx: a,
  quantities: n,
  fixo: s = null,
  infos: o,
  blockedIds: r,
  onUse: i,
  onConfigure: c,
  onClear: l,
  onSwap: m,
}) {
  const { t: g } = Se(),
    b = uo(),
    [f, h] = d.useState(() => co()),
    u = d.useRef(null),
    p = d.useRef(!1),
    [v, x] = d.useState(null),
    [y, j] = d.useState(null),
    w = (I, k) => {
      const P = document.elementFromPoint(I, k),
        E = P == null ? void 0 : P.closest('[data-drop-hotbar]');
      if (!(E instanceof HTMLElement) || E.dataset.dropHotbar == null) return null;
      const U = Number(E.dataset.dropHotbar);
      return U >= 0 && U < Gn ? U : null;
    },
    C = (I, k) => {
      k.button !== 0 ||
        !e[I] ||
        (b != null && b.hold) ||
        ((u.current = { from: I, x: k.clientX, y: k.clientY, moved: !1 }),
        k.currentTarget.setPointerCapture(k.pointerId));
    },
    S = (I) => {
      const k = u.current;
      k &&
        (!k.moved &&
          Math.hypot(I.clientX - k.x, I.clientY - k.y) > 6 &&
          ((k.moved = !0), x(k.from)),
        k.moved && j(w(I.clientX, I.clientY)));
    },
    A = (I) => {
      const k = u.current;
      if (((u.current = null), !(k != null && k.moved))) {
        (x(null), j(null));
        return;
      }
      p.current = !0;
      const P = w(I.clientX, I.clientY);
      (P != null && P !== k.from && (m == null || m(k.from, P)), x(null), j(null));
    };
  return (
    d.useEffect(() => {
      (Ka().then(h), Fc());
    }, []),
    t.jsx('div', {
      className: 'hud-hotbar',
      role: 'toolbar',
      'aria-label': g('hud.hotbar'),
      children: Array.from({ length: Gn }, (I, k) => {
        var P, E, U;
        return t.jsx(
          xq,
          {
            index: k,
            bind: e[k] ?? null,
            artPack: f,
            keyCap: String(k + 1),
            slotFx: a == null ? void 0 : a[k],
            qty: (n == null ? void 0 : n[k]) ?? null,
            fixa: s === k,
            blocked:
              !!((P = e[k]) != null && P.abilityId) && !!(r != null && r.has(e[k].abilityId)),
            info:
              (E = e[k]) != null && E.abilityId
                ? o == null
                  ? void 0
                  : o.get(e[k].abilityId)
                : void 0,
            holding: !!(b != null && b.hold),
            hovered:
              (((U = b == null ? void 0 : b.hover) == null ? void 0 : U.kind) === 'hotbar' &&
                b.hover.index === k) ||
              (y === k && v !== k),
            dragging: v === k,
            ignoreClick: p,
            onPointerDown: (N) => C(k, N),
            onPointerMove: S,
            onPointerUp: A,
            onUse: () => i(k),
            onConfigure: () => c(k),
            onClear: () => l(k),
          },
          k
        );
      }),
    })
  );
}
function xq({
  index: e,
  bind: a,
  artPack: n,
  keyCap: s,
  slotFx: o,
  qty: r,
  fixa: i,
  blocked: c,
  info: l,
  holding: m,
  hovered: g,
  dragging: b,
  ignoreClick: f,
  onPointerDown: h,
  onPointerMove: u,
  onPointerUp: p,
  onUse: v,
  onConfigure: x,
  onClear: y,
}) {
  var U, N;
  const { t: j } = Se(),
    w = (a == null ? void 0 : a.kind) === 'ability' || (a == null ? void 0 : a.kind) === 'spell',
    C = a != null && a.enabled === !1,
    S = ((o == null ? void 0 : o.coolRatio) ?? 0) > 0.01,
    A = !!(o != null && o.active),
    k =
      a != null &&
      (a.kind === 'item' || a.abilityId === 'bandage' || (a.abilityId ?? '').includes('potion')) &&
      typeof r == 'number',
    P = a
      ? j(`abilities.name.${a.abilityId ?? ''}`, {
          defaultValue: a.label || a.abilityId || j('hud.hotbar'),
        })
      : '',
    E = [Ng(l, j), Sg(l, j), gq(l == null ? void 0 : l.reags, j)].filter(Boolean).join(' · ');
  return t.jsxs('button', {
    type: 'button',
    className: [
      'hud-hotbar-slot',
      a ? 'hud-hotbar-filled' : '',
      w ? 'hud-hotbar-ability' : '',
      C ? 'hud-hotbar-off' : '',
      c ? 'hud-hotbar-blocked' : '',
      m ? 'hud-hotbar-can-accept' : '',
      g ? 'hud-hotbar-drop-hover' : '',
      b ? 'hud-hotbar-dragging' : '',
      A ? 'hud-hotbar-active' : '',
      S ? 'hud-hotbar-cooling' : '',
      k && r === 0 ? 'hud-hotbar-empty-qty' : '',
      i ? 'hud-hotbar-fixa' : '',
    ]
      .filter(Boolean)
      .join(' '),
    'aria-label': a ? `${P}${k ? ` ×${r}` : ''} (${s})` : j('hud.bindHint'),
    'data-drop-hotbar': String(e),
    'data-hotbar-fixa': i ? '1' : void 0,
    title: a
      ? `${P}${k ? ` ×${r}` : ''}${E ? ` · ${E}` : ''}${(U = a.conditions) != null && U.length ? ' · auto' : ''}${S ? ` · ${o.coolSec}s` : ''}${
          i
            ? `
${j('hotbar.fixed')}`
            : ` — ${j('hud.useHint')}`
        }`
      : j('hud.bindHint'),
    onPointerDown: h,
    onPointerMove: u,
    onPointerUp: p,
    onClick: (M) => {
      if (!m) {
        if (f.current) {
          ((f.current = !1), M.preventDefault());
          return;
        }
        if (M.shiftKey && a) {
          v();
          return;
        }
        x();
      }
    },
    onDoubleClick: (M) => {
      (M.preventDefault(), a && v());
    },
    onContextMenu: (M) => {
      (M.preventDefault(), M.stopPropagation(), a && !i && y());
    },
    children: [
      (a == null ? void 0 : a.kind) === 'item' && a.serial
        ? t.jsx(Ue, {
            pack: n,
            graphic: a.graphic || 0,
            hue: a.hue || ki[a.abilityId ?? ''] || 0,
            partialHue: !!a.partialHue,
            scale: 1,
            alt: '',
          })
        : a
          ? t.jsx(Om, {
              artPack: n,
              abilityId: a.abilityId,
              entry: Nc(a.abilityId),
              graphic: a.graphic,
              hue:
                a.hue ||
                ((N = Nc(a.abilityId)) == null ? void 0 : N.hue) ||
                ki[a.abilityId ?? ''] ||
                0,
              partialHue: !!a.partialHue,
            })
          : t.jsx('span', { className: 'hud-hotbar-plus', 'aria-hidden': !0, children: '+' }),
      k
        ? t.jsx('span', {
            className: `hud-hotbar-qty${r === 0 ? ' is-empty' : ''}`,
            'aria-hidden': !0,
            children: r > 999 ? '999+' : r,
          })
        : null,
      c
        ? t.jsx('span', {
            className: 'hud-hotbar-block-mark',
            title: j('hotbar.blockedReag'),
            'aria-hidden': !0,
            children: '!!',
          })
        : null,
      S
        ? t.jsx('span', {
            className: 'hud-hotbar-cd',
            style: { '--cd': String(o.coolRatio) },
            'aria-hidden': !0,
          })
        : null,
      S && o.coolSec > 0
        ? t.jsx('span', { className: 'hud-hotbar-cd-num', 'aria-hidden': !0, children: o.coolSec })
        : null,
      t.jsx('span', { className: 'hud-hotbar-key', children: s }),
    ],
  });
}
const Zo = {
  alchemy: 0,
  anatomy: 1,
  evalInt: 16,
  healing: 17,
  magery: 25,
  tactics: 27,
  chivalry: 51,
};
function vq(e, a) {
  return Math.round((e + a) / 2);
}
function Gs(e, a, n) {
  const s = Math.max(1, Math.floor(a)),
    o = Math.max(s, Math.ceil(n));
  return { kind: e, min: s, max: o, avg: vq(s, o), variant: 'range' };
}
function yq(e) {
  return Math.floor((e * 10) / 33);
}
function pj(e, a) {
  return Math.floor((e * (100 + a)) / 100);
}
function jq(e, a) {
  const n =
    e === 'lesser_heal_potion'
      ? { min: 6, max: 8 }
      : e === 'heal_potion'
        ? { min: 13, max: 16 }
        : e === 'greater_heal_potion'
          ? { min: 20, max: 25 }
          : null;
  if (!n) return null;
  const s = yq(a);
  return Gs('heal', pj(n.min, s), pj(n.max, s));
}
function wq(e, a) {
  const n = a / 8 + e / 5 + 4,
    s = a / 6 + e / 2.5 + 4;
  return Gs('heal', n, s);
}
function Nq(e, a = !0) {
  const n = e / 12,
    s = n + 1,
    o = n + 4;
  return Gs('heal', s, o);
}
function Sq(e) {
  const a = e / 5;
  return Gs('heal', a + 1, a + 6);
}
function kq(e) {
  const a = e / 10;
  return Gs('heal', a + 1, a + 6);
}
function Cq(e, a, n = 1) {
  if (e.includes('execution')) {
    const s = Math.floor(a * 0.6) + 20 * n;
    return Gs('damage', s, s);
  }
  if (e.includes('cleave') || e.endsWith('_cleave')) {
    const s = 15 + 10 * n,
      o = 8 + 4 * n;
    return { kind: 'damage', min: s, max: s, avg: s, variant: 'cleave', splash: o };
  }
  if (e.includes('multishot') || e.includes('bolt_volley')) {
    const s = 2 + n,
      o = 10 + 5 * n;
    return { kind: 'damage', min: o, max: o, avg: o * s, variant: 'multihit', hits: s };
  }
  if (e.includes('flurry')) {
    const s = 2 + n,
      o = 8 + 3 * n;
    return { kind: 'damage', min: o, max: o, avg: o * s, variant: 'multihit', hits: s };
  }
  if (e.includes('shield_bash') || e.includes('earthshaker')) {
    const s = 10 + 5 * n + Math.floor(a * 0.15);
    return Gs('damage', s, s + 6);
  }
  if (e.includes('cleric_thunderstorm') || e.includes('chain_lightning')) {
    const s = 14 + 5 * n;
    return {
      kind: 'damage',
      min: s,
      max: s + 8,
      avg: s + 4,
      variant: 'cleave',
      splash: Math.max(1, Math.floor(s / 2)),
    };
  }
  if (e.includes('heavy_strike') || e.includes('crushing')) {
    const s = 12 + Math.floor(a * 0.25);
    return Gs('damage', s - 4, s + 8);
  }
  return (e.includes('fireball'), null);
}
function Mq(e) {
  return e.includes('magic_arrow')
    ? 2.1
    : e.includes('_harm') || e.endsWith('harm')
      ? 2
      : e.includes('fireball')
        ? 1.85
        : e.includes('lightning') && !e.includes('chain')
          ? 1.65
          : e.includes('energy_bolt') || e.includes('explosion') || e.includes('poison_strike')
            ? 1.75
            : e.includes('flame_strike') || e.includes('chain_lightning') || e.includes('wither')
              ? 1.6
              : e.includes('pain_spike')
                ? 1.65
                : (e.includes('strangle'), 1.75);
}
function Aq(e, a, n) {
  const s = a * 0.5 + n * 0.3,
    o = Mq(e),
    r = (i, c) => Gs('damage', i * o, c * o);
  return e.includes('magic_arrow')
    ? r(3 + s * 0.05, 8 + s * 0.08)
    : e.includes('_harm') || e.endsWith('harm')
      ? r(6 + s * 0.08, 14 + s * 0.12)
      : e.includes('fireball')
        ? r(10 + s * 0.1, 20 + s * 0.15)
        : e.includes('lightning') || e.includes('energy_bolt')
          ? r(14 + s * 0.12, 28 + s * 0.18)
          : e.includes('explosion') || e.includes('flame_strike')
            ? r(20 + s * 0.15, 40 + s * 0.22)
            : e.includes('pain_spike')
              ? r(8 + s * 0.08, 18 + s * 0.12)
              : e.includes('thunderstorm') || e.includes('eagle')
                ? r(10 + s * 0.1, 22 + s * 0.16)
                : null;
}
function Eq(e, a) {
  const n = e.id.toLowerCase(),
    s = a.getSkill(Zo.alchemy),
    o = a.getSkill(Zo.healing),
    r = a.getSkill(Zo.anatomy),
    i = a.getSkill(Zo.magery),
    c = a.getSkill(Zo.evalInt),
    l = a.getSkill(Zo.tactics),
    m = a.getSkill(Zo.chivalry),
    g = jq(n, s);
  if (g) return g;
  if (n === 'bandage' || n.includes('bandage')) return wq(o, r);
  if (n.includes('greater_heal') || n.includes('magery_gh')) return Sq(i);
  if (
    (n.includes('_heal') || n.endsWith('heal') || n.includes('magery_heal')) &&
    !n.includes('potion') &&
    e.kind === 'Spell'
  )
    return Nq(i);
  if (n.includes('close_wounds')) return kq(m);
  if (n.includes('ki_recovery')) {
    const h = 15 + 5 * Math.max(1, e.unlock > 40 ? 2 : 1);
    return Gs('heal', h - 5, h + 5);
  }
  const b = e.kind === 'Spell' ? Aq(n, i, c) : null;
  if (b) return b;
  const f = n.includes('_r2') ? 2 : n.includes('_r3') ? 3 : 1;
  return Cq(n, l, f);
}
function rk(e) {
  switch (e) {
    case 'enemies':
      return ['self'];
    case 'ally_agro':
      return ['self'];
    case 'in_combat':
      return ['self', 'enemy'];
    case 'str_buff':
    case 'dex_buff':
    case 'int_buff':
      return ['self'];
    case 'mana':
    case 'stam':
      return ['self', 'ally', 'party:leader'];
    case 'poisoned':
      return ['self', 'ally', 'party:leader'];
    case 'hp':
    default:
      return ['self', 'ally', 'party:leader', 'enemy'];
  }
}
