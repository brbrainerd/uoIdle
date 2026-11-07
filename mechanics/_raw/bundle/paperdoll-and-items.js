// SOURCE: https://uoidle.com/assets/bonecoVivo-DY66RLNm.js
// BUNDLE_VERSION: 0.99.0
// BUNDLE_SHA256: 9c5428a741aedb2d07661e07a737dc0054c9452afc219d155968ab271bf06201
// AST_SPAN: L40957-L44410
async function wA(r = mt('/packs/art/art.json?v=6')) {
  if (Xn) return Xn;
  try {
    const e = await fetch(r, { cache: 'no-cache' });
    if (!e.ok) return ((Xn = void 0), null);
    const t = await e.json();
    ko.clear();
    for (const n of t.frames) ((n.atlas = n.atlas || 'art'), ko.set(n.graphic & 65535, n));
    try {
      const n = await fetch(mt('/packs/art/world-art.json?v=9'), { cache: 'no-cache' });
      if (n.ok) {
        const s = await n.json();
        ((t.worldImage = s.image || 'world-art.png'), (t.worldVersion = s.version ?? 9));
        for (const i of s.frames || []) ((i.atlas = 'world'), ko.set(i.graphic & 65535, i));
      }
    } catch {}
    return ((Xn = t), t);
  } catch {
    return ((Xn = void 0), null);
  }
}
function Ur(r, e) {
  return r ? (ko.get(e & 65535) ?? null) : null;
}
function CA() {
  return Xn ?? null;
}
function UP(r, e) {
  var t;
  return !!((t = Ur(r, e)) != null && t.container);
}
function Gi(r) {
  const e = r.version ?? 0;
  return mt(`/packs/art/${r.image || 'art.png'}?v=${e}`);
}
function OP(r) {
  const e = r.worldVersion ?? 9;
  return mt(`/packs/art/${r.worldImage || 'world-art.png'}?v=${e}`);
}
function GP(r, e, t) {
  const n = e & 65535,
    s = Ur(r, n);
  if (!(s != null && s.animation)) return n;
  const i = s.animOffsets;
  if (i != null && i.length) {
    const a = Math.max(100, (s.frameInterval || 1) * 100),
      l = i[Math.floor(t / a) % i.length] ?? 0,
      u = (n + l) & 65535;
    return Ur(r, u) ? u : n;
  }
  let o = 1;
  for (; o < 8 && Ur(r, n + o);) o++;
  return o <= 1 ? n : (n + (Math.floor(t / 200) % o)) & 65535;
}
const Ll = [
    0, 8, 16, 24, 32, 41, 49, 57, 65, 74, 82, 90, 98, 106, 115, 123, 131, 139, 148, 156, 164, 172,
    180, 189, 197, 205, 213, 222, 230, 238, 246, 255,
  ],
  AA = 7;
let Jr = null,
  Xs = null;
function lf(r) {
  return { r: Ll[(r >> 10) & 31], g: Ll[(r >> 5) & 31], b: Ll[r & 31] };
}
function EA(r, e, t) {
  return ((r >> 3) << 10) | ((e >> 3) << 5) | (t >> 3);
}
async function Li(r = mt('/packs/paperdoll/hues.bin'), e = 0) {
  return (
    Jr ||
    Xs ||
    ((Xs = (async () => {
      try {
        const t = await fetch(r.includes('?') ? r : `${r}?v=${AA}`);
        if (!t.ok) return null;
        const n = new Uint16Array(await t.arrayBuffer()),
          s = Math.floor(n.length / 32),
          i = [];
        for (let o = 0; o < s; o++) i.push(n.subarray(o * 32, o * 32 + 32));
        return ((Jr = i), i);
      } catch {
        return null;
      } finally {
        Xs = null;
      }
    })()),
    Xs)
  );
}
function Sv() {
  return Jr;
}
function uf(r, e = 30) {
  const t = r & 16383;
  if (!t || !Jr || t > Jr.length) return 16119285;
  const n = Math.max(0, Math.min(31, e)),
    { r: s, g: i, b: o } = lf(Jr[t - 1][n] ?? 0);
  return (s << 16) | (i << 8) | o;
}
function LP(r, e = '#c8d4be') {
  return !(r & 16383) || !Jr ? e : `#${uf(r).toString(16).padStart(6, '0')}`;
}
function PA(r, e, t, n, s, i = !1) {
  if (!n || !(s != null && s.length)) return { r, g: e, b: t };
  let o = i,
    a = n;
  if ((a & 32768 && ((o = !0), (a &= 32767)), a <= 0 || a > s.length)) return { r, g: e, b: t };
  const l = EA(r, e, t);
  if (o) {
    const u = r >> 3,
      c = e >> 3,
      h = t >> 3;
    if (u !== c || c !== h) return { r, g: e, b: t };
  }
  return lf(s[a - 1][(l >> 10) & 31]);
}
const cm = new Map();
function RA(r) {
  let e = r & 65535;
  return (e & 32768 && (e &= 32767), e);
}
function Tv(r, e) {
  const t = RA(r);
  if (t <= 0 || t > e.length) return null;
  let n = cm.get(t);
  if (n) return n;
  n = new Float32Array(96);
  const s = e[t - 1];
  for (let i = 0; i < 32; i++) {
    const { r: o, g: a, b: l } = lf(s[i]);
    ((n[i * 3] = o / 255), (n[i * 3 + 1] = a / 255), (n[i * 3 + 2] = l / 255));
  }
  return (cm.set(t, n), n);
}
function wv(r, e, t, n, s = !1) {
  const i = document.createElement('canvas');
  ((i.width = e.width), (i.height = e.height));
  const o = i.getContext('2d');
  if (
    (o.drawImage(r, e.x, e.y, e.width, e.height, 0, 0, e.width, e.height),
    !t || !(n != null && n.length))
  )
    return i;
  let a;
  try {
    a = o.getImageData(0, 0, e.width, e.height);
  } catch {
    return i;
  }
  const l = a.data;
  for (let u = 0; u < l.length; u += 4) {
    if (!l[u + 3]) continue;
    const { r: c, g: h, b: d } = PA(l[u], l[u + 1], l[u + 2], t, n, s);
    ((l[u] = c), (l[u + 1] = h), (l[u + 2] = d));
  }
  return (o.putImageData(a, 0, 0), i);
}
const MA = {
  3182: { brilho: [1, 0.84, 0.62], forca: 0.55, cintila: 0.5 },
  3183: { brilho: [1, 1, 1], forca: 0.65, cintila: 0.8 },
  3184: { brilho: [1, 0.95, 0.7], forca: 0.75, cintila: 1 },
};
function Ni(r) {
  return MA[r & 16383] ?? null;
}
const BA = 2,
  hm = 1.4;
function cf() {
  return performance.now() / 1e3;
}
function DA(r = cf()) {
  const e = r % BA;
  return e > hm ? null : -0.25 + (e / hm) * 1.5;
}
var Im;
const Cv =
  typeof window < 'u' &&
  (((Im = window.matchMedia) == null
    ? void 0
    : Im.call(window, '(prefers-reduced-motion: reduce)').matches) ??
    !1);
let FA = null;
function IA(r, e, t, n, s, i, o, a = cf()) {
  const l = Ni(o);
  if (!l || Cv || s < 2 || i < 2) return;
  const u = DA(a);
  if (u === null) return;
  const c = FA ?? (FA = document.createElement('canvas'));
  (c.width < s && (c.width = Math.ceil(s)), c.height < i && (c.height = Math.ceil(i)));
  const h = c.getContext('2d');
  ((h.globalCompositeOperation = 'source-over'),
    h.clearRect(0, 0, c.width, c.height),
    (h.imageSmoothingEnabled = !1),
    h.drawImage(e, 0, 0, s, i),
    (h.globalCompositeOperation = 'source-in'));
  const d = h.createLinearGradient(0, 0, s, i),
    [f, p, g] = l.brilho.map((C) => Math.round(C * 255)),
    m = (C) => `rgba(${f},${p},${g},${C})`,
    b = 0.1,
    x = (C) => Math.min(1, Math.max(0, C));
  (d.addColorStop(0, m(0)),
    d.addColorStop(x(u - b), m(0)),
    d.addColorStop(x(u), m(l.forca)),
    d.addColorStop(x(u + b), m(0)),
    d.addColorStop(1, m(0)),
    (h.fillStyle = d),
    h.fillRect(0, 0, s, i));
  const S = r.globalCompositeOperation;
  ((r.globalCompositeOperation = 'screen'),
    r.drawImage(c, 0, 0, s, i, t, n, s, i),
    (r.globalCompositeOperation = S));
}
function Av(r, e, t, n, s) {
  if (!Ni(s) || Cv) return () => {};
  const i = r.getContext('2d');
  if (!i) return () => {};
  let o = !0,
    a = 0,
    l = 0;
  const u = (c) => {
    if (o) {
      if (!r.isConnected && l) {
        o = !1;
        return;
      }
      (c - l >= 33 &&
        ((l = c),
        (i.imageSmoothingEnabled = !1),
        i.clearRect(0, 0, t, n),
        i.drawImage(e, 0, 0, t, n),
        IA(i, e, 0, 0, t, n, s, c / 1e3),
        UA(i, 0, 0, t, n, s, c / 1e3)),
        (a = requestAnimationFrame(u)));
    }
  };
  return (
    (a = requestAnimationFrame(u)),
    () => {
      ((o = !1), cancelAnimationFrame(a));
    }
  );
}
const ac = { 3182: 'bronze', 3183: 'prata', 3184: 'ouro' },
  lc = {
    ouro: { porSegundo: 7, maximo: 14, noCanvas: 8, cor: 16769658 },
    prata: { porSegundo: 4, maximo: 8, noCanvas: 5, cor: 15660287 },
    bronze: { porSegundo: 2, maximo: 4, noCanvas: 3, cor: 16757882 },
  },
  kA = (r) => lc[ac[r & 16383]] ?? null;
function go(r, e) {
  const t = Math.sin(r * 127.1 + e * 311.7) * 43758.5453;
  return t - Math.floor(t);
}
function UA(r, e, t, n, s, i, o, a = 0, l) {
  const u = kA(i);
  if (!u) return;
  const c = u.noCanvas,
    h = '#' + u.cor.toString(16).padStart(6, '0'),
    d = 1.3;
  (r.save(), (r.globalCompositeOperation = 'lighter'));
  for (let f = 0; f < c; f++) {
    const p = o / d + go(f, a),
      g = Math.floor(p),
      m = p - g,
      b = e + go(g, f + a * 7) * n,
      x = t + go(f + a * 3, g) * s - m * 8,
      S = m < 0.3 ? m / 0.3 : 1 - (m - 0.3) / 0.7,
      C = (2 + go(f, g) * 2.5) * S;
    if (C <= 0.1) continue;
    ((r.globalAlpha = m < 0.5 ? 1 : 1 - (m - 0.5) / 0.5), (r.fillStyle = h), r.beginPath());
    const w = C * 0.28;
    (r.moveTo(b, x - C),
      r.lineTo(b + w, x - w),
      r.lineTo(b + C, x),
      r.lineTo(b + w, x + w),
      r.lineTo(b, x + C),
      r.lineTo(b - w, x + w),
      r.lineTo(b - C, x),
      r.lineTo(b - w, x - w),
      r.closePath(),
      r.fill());
  }
  r.restore();
}
const OA = new Set([3818, 3821, 3824]);
function Ev(r) {
  return OA.has(r & 65535);
}
function GA(r, e, t) {
  const n = r & 65535;
  if (!Ev(n) || e <= 1) return n;
  const s = e > 5 ? 2 : 1,
    i = (n + s) & 65535;
  if (!t || t(i)) return i;
  if (s === 2) {
    const o = (n + 1) & 65535;
    if (t(o)) return o;
  }
  return n;
}
function LA(r, e, t) {
  if (e <= 1) return !1;
  const n = r & 65535;
  return !(n === 8198 || Ev(n));
}
const Pv = 1266,
  NA = [3821, 3822, 3823],
  HA = mt('/packs/ui/uocoin.png?v=1');
function WA(r, e) {
  return (e & 16383) === Pv && NA.includes(r & 65535);
}
const zA = 3709,
  $A = { 1153: 'comum', 1272: 'incomum', 1266: 'raro', 1289: 'epico', 1281: 'lendario' };
function VA(r, e) {
  if ((r & 65535) !== zA) return null;
  const t = $A[e & 16383];
  return t ? `/ui/baus/bau-${t}.png` : null;
}
const uc = 44,
  XA = 8,
  cc = new Map(),
  js = new Map(),
  Ys = new Map();
let Nl = null,
  dm = null;
function Rv() {
  return (Nl || (Nl = Li()), Nl);
}
function hf(r) {
  const e = cc.get(r);
  return e != null && e.complete && e.naturalWidth > 0
    ? Promise.resolve(e)
    : new Promise((t, n) => {
        const s = new Image();
        (/^https?:\/\//i.test(r) && (s.crossOrigin = 'anonymous'),
          (s.decoding = 'async'),
          (s.onload = () => {
            (cc.set(r, s), t(s));
          }),
          (s.onerror = () => n(new Error(r))),
          (s.src = r));
      });
}
function NP(r) {
  if ((Rv(), !r)) return;
  const e = Gi(r);
  dm || (dm = hf(e));
}
function jA(r) {
  return `${r.x}:${r.y}:${r.width}x${r.height}`;
}
function YA(r, e) {
  const t = e.width,
    n = e.height,
    s = { x: 0, y: 0, w: t, h: n };
  if (!t || !n) return s;
  const i = document.createElement('canvas');
  ((i.width = t), (i.height = n));
  const o = i.getContext('2d', { willReadFrequently: !0 });
  if (!o) return s;
  o.drawImage(r, e.x, e.y, t, n, 0, 0, t, n);
  let a;
  try {
    a = o.getImageData(0, 0, t, n).data;
  } catch {
    return s;
  }
  let l = t,
    u = n,
    c = -1,
    h = -1;
  for (let d = 0; d < n; d++)
    for (let f = 0; f < t; f++)
      a[(d * t + f) * 4 + 3] > XA &&
        (f < l && (l = f), f > c && (c = f), d < u && (u = d), d > h && (h = d));
  return c < 0 ? s : { x: l, y: u, w: c - l + 1, h: h - u + 1 };
}
function qA(r, e) {
  const t = jA(e),
    n = { x: 0, y: 0, w: e.width, h: e.height },
    [s, i] = Ue.useState(() => Ys.get(t) ?? n);
  return (
    Ue.useLayoutEffect(() => {
      const o = Ys.get(t);
      if (o) {
        i(o);
        return;
      }
      const a = Gi(r),
        l = (c) => {
          try {
            const h = YA(c, e);
            (Ys.set(t, h), i(h));
          } catch {
            (Ys.set(t, n), i(n));
          }
        },
        u = cc.get(a);
      if (u != null && u.complete && u.naturalWidth > 0) {
        l(u);
        return;
      }
      hf(a).then(l);
    }, [t, r, e.x, e.y, e.width, e.height]),
    Ys.get(t) ?? s
  );
}
function KA(r, e, t) {
  const n = Math.max(r, e, 1);
  if (n * t <= uc)
    return {
      w: Math.max(1, Math.round(r * t)),
      h: Math.max(1, Math.round(e * t)),
      fit: t,
      native: t === 1,
    };
  const s = uc / n;
  return {
    w: Math.max(1, Math.round(r * s)),
    h: Math.max(1, Math.round(e * s)),
    fit: s,
    native: !1,
  };
}
function ZA(r, e, t, n, s, i, o) {
  const a = document.createElement('canvas');
  ((a.width = i), (a.height = o));
  const l = a.getContext('2d');
  return (
    (l.imageSmoothingEnabled = !1),
    (l.imageSmoothingQuality = 'low'),
    l.drawImage(r, e, t, n, s, 0, 0, i, o),
    a
  );
}
function QA({
  pack: r,
  graphic: e,
  hue: t = 0,
  partialHue: n = !1,
  scale: s = 1,
  amount: i = 1,
  stackable: o,
  className: a,
  alt: l,
}) {
  const u = VA(e, t);
  return u
    ? j.jsx(tE, { src: u, pack: r, graphic: e, hue: t, amount: i, scale: s, className: a, alt: l })
    : WA(e, t)
      ? j.jsx(rE, { pack: r, graphic: e, hue: t, amount: i, scale: s, className: a, alt: l })
      : j.jsx(df, {
          pack: r,
          graphic: e,
          hue: t,
          partialHue: n,
          scale: s,
          amount: i,
          stackable: o,
          className: a,
          alt: l,
        });
}
const JA = 28,
  eE = 38;
function tE({ src: r, scale: e = 1, className: t, alt: n, ...s }) {
  const [i, o] = Ue.useState(!1);
  if (i) return j.jsx(df, { ...s, scale: e, className: t, alt: n });
  const a = Math.min(72, Math.round(eE * e));
  return j.jsx('img', {
    className: ['art-sprite', 'hued-art-icon', 'bau-roupas-icone', t].filter(Boolean).join(' '),
    src: r,
    width: a,
    height: a,
    alt: n ?? '',
    'aria-hidden': n ? void 0 : !0,
    draggable: !1,
    onError: () => o(!0),
  });
}
function rE({ scale: r = 1, className: e, alt: t, ...n }) {
  const [s, i] = Ue.useState(!1);
  if (s) return j.jsx(df, { ...n, scale: r, className: e, alt: t });
  const o = Math.min(uc, Math.round(JA * r));
  return j.jsx('img', {
    className: ['art-sprite', 'hued-art-icon', 'uocoin-icone', e].filter(Boolean).join(' '),
    src: HA,
    width: o,
    height: o,
    alt: t ?? '',
    'aria-hidden': t ? void 0 : !0,
    draggable: !1,
    onError: () => i(!0),
  });
}
function df({
  pack: r,
  graphic: e,
  hue: t = 0,
  partialHue: n = !1,
  scale: s = 1,
  amount: i = 1,
  stackable: o,
  className: a,
  alt: l,
}) {
  const u = r ? GA(e, i, (f) => !!Ur(r, f)) : e,
    c = r ? Ur(r, u) : null,
    h = LA(e, i);
  if (!r || !c) return null;
  const d = j.jsx(nE, {
    pack: r,
    graphic: u,
    hue: t,
    partialHue: n,
    scale: s,
    className: a,
    alt: h ? void 0 : l,
  });
  return h
    ? j.jsxs('span', {
        className: 'art-stack',
        role: l ? 'img' : void 0,
        'aria-label': l,
        children: [
          j.jsx('span', { className: 'art-stack-back', 'aria-hidden': !0, children: d }),
          j.jsx('span', { className: 'art-stack-front', 'aria-hidden': !0, children: d }),
        ],
      })
    : d;
}
function nE({ pack: r, graphic: e, hue: t, partialHue: n, scale: s, className: i, alt: o }) {
  const a = Ur(r, e),
    l = qA(r, a ?? { x: 0, y: 0, width: 1, height: 1 }),
    u = (t & 16383) !== 0;
  if (!a) return null;
  const { w: c, h, native: d } = KA(l.w, l.h, s);
  return !u && d
    ? j.jsx('span', {
        className: ['art-sprite', 'hued-art-icon', i].filter(Boolean).join(' '),
        role: o ? 'img' : void 0,
        'aria-label': o,
        'aria-hidden': o ? void 0 : !0,
        style: {
          width: l.w,
          height: l.h,
          backgroundImage: `url(${Gi(r)})`,
          backgroundPosition: `-${a.x + l.x}px -${a.y + l.y}px`,
          backgroundSize: `${r.imageWidth}px ${r.imageHeight}px`,
        },
      })
    : j.jsx(sE, {
        pack: r,
        graphic: e,
        hue: t,
        partialHue: n,
        w: c,
        h,
        crop: l,
        className: i,
        alt: o,
      });
}
function sE({
  pack: r,
  graphic: e,
  hue: t,
  partialHue: n,
  w: s,
  h: i,
  crop: o,
  className: a,
  alt: l,
}) {
  const u = Ue.useRef(null),
    c = Ur(r, e),
    h = `${e}:${t & 65535}:${n ? 1 : 0}:${s}x${i}:${o.x},${o.y},${o.w}x${o.h}`,
    d = js.get(h),
    [f, p] = Ue.useState(!!d);
  return (
    Ue.useEffect(() => {
      let g = !1;
      const m = u.current;
      if (!m) return;
      let b = () => {};
      const x = (S) => {
        ((m.width = s), (m.height = i));
        const C = m.getContext('2d');
        ((C.imageSmoothingEnabled = !1),
          C.clearRect(0, 0, s, i),
          C.drawImage(S, 0, 0),
          b(),
          (b = Av(m, S, s, i, t & 65535)),
          p(!0));
      };
      return d
        ? (x(d), () => b())
        : ((async () => {
            const S = await hf(Gi(r));
            if (g) return;
            let C = S,
              w = c.x + o.x,
              A = c.y + o.y,
              v = o.w,
              P = o.h;
            if ((t & 16383) !== 0) {
              const B = await Rv();
              if (g || !B) return;
              ((C = wv(S, c, t & 65535, B, n)), (w = o.x), (A = o.y), (v = o.w), (P = o.h));
            }
            const D = ZA(C, w, A, v, P, s, i);
            if ((js.set(h, D), js.size > 4e3)) {
              const B = js.keys().next().value;
              B != null && js.delete(B);
            }
            g || !u.current || x(D);
          })().catch(() => {
            g || p(!1);
          }),
          () => {
            ((g = !0), b());
          });
    }, [d, o.h, o.w, o.x, o.y, c, e, t, h, r, n, s, i]),
    j.jsx('canvas', {
      ref: u,
      className: ['atlas-sprite', 'hued-art-icon', a].filter(Boolean).join(' '),
      style: { display: f ? 'inline-block' : 'none' },
      role: l ? 'img' : void 0,
      'aria-label': l,
      'aria-hidden': l ? void 0 : !0,
    })
  );
}
let dt = null,
  Uo = !1,
  qs = null;
const hc = new Set();
function Hl() {
  for (const r of hc) r(dt);
}
function ci(r) {
  return (
    r
      .replace(/%[^%]*%/g, '')
      .replace(/\s+/g, ' ')
      .trim() || r
  ).replace(/\S+/g, (t) => t.charAt(0).toLocaleUpperCase() + t.slice(1));
}
function iE(r) {
  const e = new Map();
  if (r.items) {
    for (const [t, n] of Object.entries(r.items)) {
      const s = ci((n.name || '').trim());
      !s ||
        s === 'nodraw' ||
        e.set(Number(t) & 65535, {
          name: s,
          weight: Number(n.weight) || 0,
          layer: Number(n.layer) || 0,
          height: Number(n.height) || 0,
          anim: Number(n.anim) || 0,
          container: !!n.container,
          partialHue: !!n.partialHue,
          lightSource: !!n.lightSource,
          wearable: !!n.wearable || (Number(n.layer) || 0) > 0,
          stackable: !!n.stackable,
          impassable: !!n.impassable,
        });
    }
    return e;
  }
  for (const [t, n] of Object.entries(r.names ?? {})) {
    const s = ci((n || '').trim());
    !s ||
      s === 'nodraw' ||
      e.set(Number(t) & 65535, {
        name: s,
        weight: 0,
        layer: 0,
        height: 0,
        anim: 0,
        container: !1,
        partialHue: !1,
        lightSource: !1,
        wearable: !1,
        stackable: !1,
        impassable: !1,
      });
  }
  return e;
}
async function Mv(r = mt('/packs/art/items.json')) {
  return (
    dt ||
    qs ||
    ((qs = (async () => {
      try {
        let e = await fetch(r, { cache: 'no-cache' });
        if ((e.ok || (e = await fetch(mt('/packs/art/names.json'), { cache: 'no-cache' })), !e.ok))
          return ((Uo = !0), (dt = null), Hl(), new Map());
        const t = await e.json();
        return ((dt = iE(t)), (Uo = !1), Hl(), dt);
      } catch {
        return ((Uo = !0), (dt = null), Hl(), new Map());
      } finally {
        qs = null;
      }
    })()),
    qs)
  );
}
async function oE() {
  const r = await Mv(),
    e = new Map();
  for (const [t, n] of r) e.set(t, n.name);
  return e;
}
function HP() {
  return dt;
}
function aE() {
  if (!dt) return null;
  const r = new Map();
  for (const [e, t] of dt) r.set(e, t.name);
  return r;
}
function WP(r) {
  return (
    hc.add(r),
    r(dt),
    !dt && !Uo && Mv(),
    () => {
      hc.delete(r);
    }
  );
}
function lE(r, e) {
  return (
    (r == null ? void 0 : r.get(e & 65535)) ?? (dt == null ? void 0 : dt.get(e & 65535)) ?? null
  );
}
function zP(r) {
  var n;
  const e = r & 65535;
  return e <= 1
    ? !0
    : (((n = lE(void 0, e)) == null ? void 0 : n.name) || '').toLowerCase() === 'nodraw';
}
function uE(r, e) {
  const t = e & 65535;
  if (r instanceof Map) {
    const s = r.get(t);
    if (typeof s == 'string' && s) return ci(s);
    if (s && typeof s == 'object' && 'name' in s && s.name) return ci(s.name);
  }
  const n = dt == null ? void 0 : dt.get(t);
  return n != null && n.name ? ci(n.name) : `0x${t.toString(16)}`;
}
function cE() {
  const [r, e] = Ue.useState(() => CA()),
    [t, n] = Ue.useState(() => aE());
  return (
    Ue.useEffect(() => {
      let s = !0;
      return (
        r || wA().then((i) => s && e(i)),
        t || oE().then((i) => s && n(i)),
        () => {
          s = !1;
        }
      );
    }, [r, t]),
    { pack: r, nome: (s, i) => s || uE(t, i) }
  );
}
function Bv({
  imageUrl: r,
  atlasW: e,
  atlasH: t,
  frame: n,
  scale: s = 1,
  mirror: i = !1,
  className: o,
  alt: a,
}) {
  const l = Math.max(1, Math.round(n.width * s)),
    u = Math.max(1, Math.round(n.height * s)),
    c = {
      display: 'inline-block',
      width: l,
      height: u,
      flexShrink: 0,
      backgroundImage: `url(${r})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: `-${Math.round(n.x * s)}px -${Math.round(n.y * s)}px`,
      backgroundSize: `${Math.round(e * s)}px ${Math.round(t * s)}px`,
      transform: i ? 'scaleX(-1)' : void 0,
      imageRendering: 'pixelated',
    };
  return j.jsx('span', {
    className: ['atlas-sprite', o].filter(Boolean).join(' '),
    style: c,
    role: a ? 'img' : void 0,
    'aria-label': a,
    'aria-hidden': a ? void 0 : !0,
  });
}
function $P({ pack: r, graphic: e, scale: t = 1, className: n, alt: s }) {
  if (!r) return null;
  const i = Ur(r, e);
  return i
    ? j.jsx(Bv, {
        imageUrl: Gi(r),
        atlasW: r.imageWidth,
        atlasH: r.imageHeight,
        frame: i,
        scale: t,
        className: n,
        alt: s,
      })
    : null;
}
async function hE(r = mt('/packs/body/body.json?v=5')) {
  try {
    const e = await fetch(r);
    return e.ok ? await e.json() : null;
  } catch {
    return null;
  }
}
function fm(r, e, t, n, s = 0) {
  return (
    r.frames.find((i) => i.body === e && i.action === t && i.animDir === n && i.frame === s) ?? null
  );
}
function Dv(r) {
  const e = new Map(),
    t = new Map();
  for (const n of r.frames) {
    e.set(`${n.body}:${n.action}:${n.animDir}:${n.frame}`, n);
    const s = `${n.body}:${n.action}:${n.animDir}`;
    let i = t.get(s);
    (i || ((i = []), t.set(s, i)), i.push(n));
  }
  for (const n of t.values()) n.sort((s, i) => s.frame - i.frame);
  return { exact: e, byDir: t };
}
function dc(r, e, t, n, s = 0, i) {
  if (i) {
    const l = i.exact.get(`${e}:${t}:${n}:${s}`);
    if (l) return l;
    const u = i.byDir.get(`${e}:${t}:${n}`);
    if (!(u != null && u.length)) return null;
    let c = u[0];
    for (const h of u) {
      if (h.frame > s) break;
      c = h;
    }
    return c;
  }
  const o = fm(r, e, t, n, s);
  if (o) return o;
  let a = null;
  for (const l of r.frames)
    l.body !== e ||
      l.action !== t ||
      l.animDir !== n ||
      l.frame > s ||
      ((!a || l.frame > a.frame) && (a = l));
  return a || fm(r, e, t, n, 0);
}
function dE(r) {
  let e = r & 7,
    t = !1;
  switch (e) {
    case 2:
    case 4:
      ((t = e === 2), (e = 1));
      break;
    case 1:
    case 5:
      ((t = e === 1), (e = 2));
      break;
    case 0:
    case 6:
      ((t = e === 0), (e = 3));
      break;
    case 3:
      e = 0;
      break;
    case 7:
      e = 4;
      break;
  }
  return { animDir: e, mirror: t };
}
const ms = 7,
  gs = mt('/packs/mobile'),
  fE = {
    23: 225,
    25: 225,
    27: 225,
    34: 225,
    63: 214,
    64: 214,
    65: 214,
    164: 13,
    79: 24,
    130: 4,
    140: 17,
    142: 42,
    143: 42,
    153: 26,
    790: 13,
  },
  pE = { 164: 20, 130: 1172, 140: 1401, 142: 91, 143: 16, 790: 2309 };
function ff(r) {
  const e = fE[r];
  return e && e !== r ? e : r;
}
function mE(r, e) {
  return (e & 16383) !== 0 ? e : (pE[r & 65535] ?? e);
}
let yn;
const hi = new Set(),
  Ir = new Map(),
  Wl = new Map();
async function gE(r = `${gs}/mobile.json?v=${ms}`) {
  var e, t;
  if (yn) return yn;
  try {
    const n = await fetch(r, { cache: 'no-cache' });
    if (!n.ok) return ((yn = void 0), null);
    const s = await n.json();
    hi.clear();
    for (const i of s.bodies || []) hi.add(i);
    if (!((e = s.bodies) != null && e.length) && (t = s.frames) != null && t.length)
      for (const i of s.frames) hi.add(i.body);
    return ((yn = s), yn);
  } catch {
    return ((yn = void 0), null);
  }
}
function zl(r, e) {
  var s, i;
  if (!r) return !1;
  const t = e & 65535,
    n = ff(t);
  return r === yn
    ? hi.has(t) || hi.has(n)
    : (s = r.bodies) != null && s.length
      ? r.bodies.includes(t) || r.bodies.includes(n)
      : !!((i = r.frames) != null && i.some((o) => o.body === t || o.body === n));
}
function fc(r) {
  return Ir.get(r) ?? null;
}
function VP(r, e, t = 2) {
  const n = fc(r);
  if (!n) return 0;
  const s = n.slice.body,
    i = n.index.byDir.get(`${s}:${e}:${t}`);
  if (i != null && i.length) return i.length;
  for (let o = 0; o < 5; o++) {
    const a = n.index.byDir.get(`${s}:${e}:${o}`);
    if (a != null && a.length) return a.length;
  }
  return 0;
}
async function pm(r) {
  const e = r & 65535;
  if (!e) return null;
  if (Ir.has(e)) return Ir.get(e) ?? null;
  const t = ff(e);
  if (t !== e && Ir.has(t)) {
    const i = Ir.get(t) ?? null;
    return (Ir.set(e, i), i);
  }
  const n = Wl.get(e);
  if (n) return n;
  const s = (async () => {
    try {
      const { Assets: i, Texture: o } = await Qr(
          async () => {
            const { Assets: d, Texture: f } = await Promise.resolve().then(() => vv);
            return { Assets: d, Texture: f };
          },
          void 0
        ),
        a = await fetch(`${gs}/${t}.json?v=${ms}`);
      if (!a.ok) return (Ir.set(e, null), null);
      const l = await a.json(),
        u = await i.load(`${gs}/${l.image || `${t}.png`}?v=${ms}`),
        c = { version: 1, image: l.image, imageWidth: 0, imageHeight: 0, frames: l.frames || [] },
        h = { slice: l, texture: u, index: Dv(c) };
      return (Ir.set(e, h), h);
    } catch {
      return (Ir.set(e, null), null);
    } finally {
      Wl.delete(e);
    }
  })();
  return (Wl.set(e, s), s);
}
function _o(r, e, t, n = 0) {
  if (!r) return null;
  const s = r.slice.body,
    i = { image: r.slice.image, frames: r.slice.frames },
    o = dc(i, s, e, t, n, r.index);
  return o || (e !== 'stand' ? dc(i, s, 'stand', t, 0, r.index) : null);
}
const $l = new Map(),
  Vl = new Map();
async function _E(r) {
  if ($l.has(r)) return $l.get(r) ?? null;
  const e = Vl.get(r);
  if (e) return e;
  const t = fetch(`${gs}/${r}.json?v=${ms}`)
    .then((n) => (n.ok ? n.json() : null))
    .catch(() => null)
    .then((n) => ($l.set(r, n), Vl.delete(r), n));
  return (Vl.set(r, t), t);
}
const Xl = new Map(),
  bE = 2;
let jl = 0;
const mm = [];
function xE(r) {
  return new Promise((e, t) => {
    const n = () => {
      (jl++,
        r()
          .then(e, t)
          .finally(() => {
            var s;
            (jl--, (s = mm.shift()) == null || s());
          }));
    };
    jl < bE ? n() : mm.push(n);
  });
}
function yE(r, e) {
  const t = document.createElement('canvas');
  return (
    (t.width = e.width),
    (t.height = e.height),
    t.getContext('2d').drawImage(r, e.x, e.y, e.width, e.height, 0, 0, e.width, e.height),
    t
  );
}
function vE(r, e, t) {
  const n = `${r}:${t}:${e.x},${e.y}`,
    s = Xl.get(n);
  if (s) return s;
  const i = xE(
    () =>
      new Promise((o) => {
        const a = new Image();
        ((a.crossOrigin = 'anonymous'),
          (a.onload = async () => {
            try {
              const l = t ? wv(a, e, t, await Li()) : yE(a, e);
              o(l.toDataURL());
            } catch {
              o(null);
            } finally {
              a.src = '';
            }
          }),
          (a.onerror = () => o(null)),
          (a.src = `${gs}/${r}.png?v=${ms}`));
      })
  );
  return (
    i.then((o) => {
      o || Xl.delete(n);
    }),
    Xl.set(n, i),
    i
  );
}
function SE({ src: r, largura: e, altura: t, matiz: n, className: s, alt: i }) {
  const o = Ue.useRef(null);
  return (
    Ue.useEffect(() => {
      let a = () => {},
        l = !0;
      const u = new Image();
      return (
        (u.onload = () => {
          const c = o.current;
          !c ||
            !l ||
            ((c.width = u.naturalWidth),
            (c.height = u.naturalHeight),
            (a = Av(c, u, c.width, c.height, n)));
        }),
        (u.src = r),
        () => {
          ((l = !1), a());
        }
      );
    }, [r, n]),
    j.jsx('canvas', {
      ref: o,
      className: s,
      role: i ? 'img' : void 0,
      'aria-label': i || void 0,
      'aria-hidden': i ? void 0 : !0,
      'data-brilho-metal': !0,
      style: { width: e, height: t, imageRendering: 'pixelated', flexShrink: 0 },
    })
  );
}
function gm({ corpo: r, caixa: e = 44, className: t, alt: n, matiz: s = 0, semAmpliar: i = !1 }) {
  var g;
  const o = ff(r & 65535),
    a = mE(r, s),
    [l, u] = Ue.useState(null),
    [c, h] = Ue.useState(null);
  Ue.useEffect(() => {
    let m = !0;
    return (
      _E(o).then((b) => {
        m && u(b);
      }),
      () => {
        m = !1;
      }
    );
  }, [o]);
  const d =
    (g = l == null ? void 0 : l.frames) != null && g.length
      ? (l.frames.find((m) => m.action === 'stand' && m.animDir === 1) ??
        l.frames.find((m) => m.action === 'stand') ??
        l.frames[0])
      : null;
  if (
    (Ue.useEffect(() => {
      if ((h(null), !d)) return;
      let m = !0;
      return (
        vE(o, d, a).then((b) => {
          m && h(b ?? !1);
        }),
        () => {
          m = !1;
        }
      );
    }, [o, a, d]),
    !d || !l)
  )
    return null;
  const f = Math.max(d.width, d.height, 1),
    p = Math.min(i ? 1 : 4, e / f);
  return c !== !1
    ? c
      ? Ni(a)
        ? j.jsx(SE, {
            src: c,
            largura: Math.max(1, Math.round(d.width * p)),
            altura: Math.max(1, Math.round(d.height * p)),
            matiz: a,
            className: ['atlas-sprite', t].filter(Boolean).join(' '),
            alt: n,
          })
        : j.jsx('img', {
            className: ['atlas-sprite', t].filter(Boolean).join(' '),
            src: c,
            width: Math.max(1, Math.round(d.width * p)),
            height: Math.max(1, Math.round(d.height * p)),
            alt: n ?? '',
            style: { imageRendering: 'pixelated', flexShrink: 0 },
          })
      : null
    : j.jsx(Bv, {
        imageUrl: `${gs}/${o}.png?v=${ms}`,
        atlasW: l.imageWidth,
        atlasH: l.imageHeight,
        frame: d,
        scale: p,
        className: t,
        alt: n,
      });
}
const O = {
    Invalid: 0,
    OneHanded: 1,
    TwoHanded: 2,
    Shoes: 3,
    Pants: 4,
    Shirt: 5,
    Helm: 6,
    Gloves: 7,
    Ring: 8,
    Talisman: 9,
    Necklace: 10,
    Hair: 11,
    Waist: 12,
    InnerTorso: 13,
    Bracelet: 14,
    Face: 15,
    Beard: 16,
    MiddleTorso: 17,
    Earrings: 18,
    Arms: 19,
    Cloak: 20,
    Backpack: 21,
    OuterTorso: 22,
    OuterLegs: 23,
    InnerLegs: 24,
    Mount: 25,
    Bank: 29,
  },
  TE = {
    [O.OneHanded]: 'oneHanded',
    [O.TwoHanded]: 'twoHanded',
    [O.Shoes]: 'shoes',
    [O.Pants]: 'pants',
    [O.Shirt]: 'shirt',
    [O.Helm]: 'helm',
    [O.Gloves]: 'gloves',
    [O.Ring]: 'ring',
    [O.Talisman]: 'talisman',
    [O.Necklace]: 'necklace',
    [O.Hair]: 'hair',
    [O.Waist]: 'waist',
    [O.InnerTorso]: 'innerTorso',
    [O.Bracelet]: 'bracelet',
    [O.Face]: 'face',
    [O.Beard]: 'beard',
    [O.MiddleTorso]: 'middleTorso',
    [O.Earrings]: 'earrings',
    [O.Arms]: 'arms',
    [O.Cloak]: 'cloak',
    [O.Backpack]: 'backpack',
    [O.OuterTorso]: 'outerTorso',
    [O.OuterLegs]: 'outerLegs',
    [O.InnerLegs]: 'innerLegs',
    [O.Mount]: 'mount',
  };
function XP(r) {
  const e = TE[r];
  return e ? i1.t(`slot.${e}`) : `Layer ${r}`;
}
function wE() {
  return new Map();
}
function jP(r) {
  const e = wE();
  for (const t of r) t.layer > 0 && t.layer !== O.Bank && e.set(t.layer, t);
  return e;
}
function CE(r) {
  const e = r & 65535;
  return e === 8270 || e === 8271 || e === 9859;
}
function AE(r) {
  const e = r.get(O.OuterTorso);
  return !!e && CE(e.graphic);
}
function EE(r) {
  return r.has(O.OuterTorso);
}
function YP(r, e) {
  const t = new Map(r);
  for (const [n, s] of t) s.serial === e.serial && t.delete(n);
  return (e.layer > 0 && e.layer !== O.Bank && t.set(e.layer, e), t);
}
function qP(r, e) {
  const t = new Map(r);
  for (const [n, s] of t) s.serial === e && t.delete(n);
  return t;
}
function KP({ size: r = 'hero', className: e = '', alt: t = 'UO Idle' }) {
  return j.jsx('img', {
    className: `brand-logo brand-logo-${r}${e ? ` ${e}` : ''}`,
    src: '/logo.png',
    alt: t,
    draggable: !1,
  });
}
function PE({ children: r, ouro: e = !1, className: t, style: n, as: s = 'div' }) {
  return j.jsxs(s, {
    className: ['gump-frame', 'landing-moldura', e ? 'landing-moldura-ouro' : '', t]
      .filter(Boolean)
      .join(' '),
    style: n,
    children: [
      j.jsx('div', { className: 'gump-frame-tl', 'aria-hidden': !0 }),
      j.jsx('div', { className: 'gump-frame-t', 'aria-hidden': !0 }),
      j.jsx('div', { className: 'gump-frame-tr', 'aria-hidden': !0 }),
      j.jsx('div', { className: 'gump-frame-l', 'aria-hidden': !0 }),
      j.jsx('div', { className: 'gump-frame-c landing-moldura-conteudo', children: r }),
      j.jsx('div', { className: 'gump-frame-r', 'aria-hidden': !0 }),
      j.jsx('div', { className: 'gump-frame-bl', 'aria-hidden': !0 }),
      j.jsx('div', { className: 'gump-frame-b', 'aria-hidden': !0 }),
      j.jsx('div', { className: 'gump-frame-br', 'aria-hidden': !0 }),
    ],
  });
}
const RE = `${mt('/packs/fonts/fonts.json')}?v=2`,
  Fv = 65793;
let ot = null,
  is = null,
  bo = null;
const _m = new Map();
function bm(r, e, t, n, s) {
  const i = `${r.uid}:${e}:${t}:${n}:${s}`;
  let o = _m.get(i);
  return (o || ((o = new Y({ source: r.source, frame: new we(e, t, n, s) })), _m.set(i, o)), o);
}
async function Iv(r = RE) {
  return (
    ot ||
    bo ||
    ((bo = (async () => {
      try {
        const e = await fetch(r);
        if (!e.ok) return null;
        const t = await e.json(),
          n = r.replace(/[^/]+$/, '').replace(/\?.*$/, ''),
          s = await Zr.load({
            alias: `${n}${t.image}?v=${t.version ?? 1}`,
            src: `${n}${t.image}?v=${t.version ?? 1}`,
          });
        return ((s.source.scaleMode = 'nearest'), (is = s), (ot = t), ot);
      } catch {
        return null;
      }
    })()),
    bo)
  );
}
function ZP() {
  return ot;
}
function kv(r) {
  return ot != null && ot.ascii.length ? (ot.ascii[r] ?? ot.ascii[3] ?? ot.ascii[0] ?? null) : null;
}
function Uv(r) {
  if (!(ot != null && ot.unicode.length)) return null;
  const e = ot.unicode.find((t) => (t.id ?? 0) === r);
  return (
    e ||
    (r === 1
      ? (ot.unicode.find((t) => (t.id ?? 0) === 0) ?? null)
      : (ot.unicode.find((t) => (t.id ?? 0) === 0) ?? ot.unicode[0] ?? null))
  );
}
function pf(r) {
  return (r == null ? void 0 : r.fill) != null
    ? r.fill >>> 0
    : (r == null ? void 0 : r.hue) != null && (r.hue & 16383) !== 0
      ? uf(r.hue)
      : 16119285;
}
function ME() {
  const r = is == null ? void 0 : is.source,
    e = r == null ? void 0 : r.resource;
  return !e || typeof e.width != 'number' ? null : e;
}
function BE(r, e) {
  const t = [];
  let n = 0;
  for (const s of r) {
    if (
      s ===
      `
`
    )
      continue;
    const i = s.codePointAt(0) ?? 0,
      o = e.glyphs[String(i)];
    if (s === ' ' && !o) {
      n += e.spaceWidth ?? 8;
      continue;
    }
    if (!o || o.x == null || o.y == null) {
      n += e.spaceWidth ?? 6;
      continue;
    }
    (t.push({ g: o, x: n + (o.ox ?? 0), y: o.oy ?? 0 }), (n += o.adv));
  }
  return { places: t, width: n };
}
const Xr = document.createElement('canvas'),
  Vr = Xr.getContext('2d', { willReadFrequently: !0 });
function xm(r, e, t, n, s, i, o, a, l, u) {
  !Vr ||
    s <= 0 ||
    i <= 0 ||
    ((Xr.width < s || Xr.height < i) &&
      ((Xr.width = Math.max(Xr.width, s)), (Xr.height = Math.max(Xr.height, i))),
    Vr.clearRect(0, 0, s, i),
    (Vr.globalCompositeOperation = 'source-over'),
    Vr.drawImage(e, t, n, s, i, 0, 0, s, i),
    (Vr.globalCompositeOperation = 'source-in'),
    (Vr.fillStyle = `#${(u >>> 0).toString(16).padStart(6, '0')}`),
    Vr.fillRect(0, 0, s, i),
    (Vr.globalCompositeOperation = 'source-over'),
    r.drawImage(Xr, 0, 0, s, i, o, a, s * l, i * l));
}
function DE(r, e, t) {
  const n = ME(),
    i =
      (t == null ? void 0 : t.unicode) === !0
        ? Uv((t == null ? void 0 : t.font) ?? 0)
        : kv((t == null ? void 0 : t.font) ?? 3);
  if (!n || !i || !e) return !1;
  const o = (t == null ? void 0 : t.border) !== !1,
    a = Math.max(1, (t == null ? void 0 : t.scale) ?? 1),
    { places: l, width: u } = BE(e, i),
    c = i.lineHeight + (o ? 2 : 0),
    h = o ? 2 : 0;
  let d = 0,
    f = c;
  if (t != null && t.tight && l.length > 0) {
    ((d = c), (f = 0));
    for (const b of l) {
      const x = o && b.g.bh ? b.y - 1 : b.y,
        S = o && b.g.bh ? b.y - 1 + b.g.bh : b.y + b.g.h;
      (x < d && (d = x), S > f && (f = S));
    }
    ((d -= 1), (f += 1));
  }
  ((r.width = Math.max(1, Math.ceil((u + h) * a))),
    (r.height = Math.max(1, Math.ceil((f - d + (o ? 1 : 0)) * a))));
  const p = r.getContext('2d');
  if (!p) return !1;
  ((p.imageSmoothingEnabled = !1), p.clearRect(0, 0, r.width, r.height));
  const g = pf(t),
    m = o ? 1 : 0;
  for (const b of l) {
    const x = b.y - d + m,
      S = b.x + m;
    (o &&
      b.g.bx != null &&
      b.g.by != null &&
      b.g.bw &&
      b.g.bh &&
      xm(p, n, b.g.bx, b.g.by, b.g.bw, b.g.bh, (S - 1) * a, (x - 1) * a, a, Fv),
      xm(p, n, b.g.x, b.g.y, b.g.w, b.g.h, S * a, x * a, a, g));
  }
  return !0;
}
function FE(r, e, t, n) {
  if (!DE(r, e, { ...t, scale: 3 })) return !1;
  const i = Math.max(1, r.height);
  return (
    (r.style.width = `${(r.width / i) * n}px`),
    (r.style.height = `${n}px`),
    (r.style.imageRendering = 'auto'),
    (r.style.display = 'block'),
    !0
  );
}
function IE() {
  const r = new Me();
  ((r.label = 'uo-label-fallback'), (r.eventMode = 'none'));
  const e = new In({
    text: '',
    style: {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: 12,
      fontWeight: '700',
      fill: 16119285,
      stroke: { color: 921869, width: 3 },
    },
  });
  return (
    e.anchor.set(0.5, 1),
    (e.eventMode = 'none'),
    r.addChild(e),
    {
      root: r,
      get width() {
        return e.width;
      },
      get height() {
        return e.height;
      },
      get visible() {
        return r.visible;
      },
      set visible(t) {
        r.visible = t;
      },
      paint: (t, n) => {
        ((e.text = t), (e.style.fill = pf(n)));
      },
      setVisible: (t) => {
        r.visible = t;
      },
    }
  );
}
function ym() {
  if (!ot || !is) return IE();
  const r = new Me();
  ((r.label = 'uo-label'), (r.eventMode = 'none'));
  const e = [];
  let t = 0,
    n = 0,
    s = 0;
  const i = () => {
    let a = e[t];
    return (
      a ||
        ((a = new wt()), (a.roundPixels = !0), (a.eventMode = 'none'), (e[t] = a), r.addChild(a)),
      (t += 1),
      (a.visible = !0),
      a
    );
  };
  return {
    root: r,
    get width() {
      return n;
    },
    get height() {
      return s;
    },
    get visible() {
      return r.visible;
    },
    set visible(a) {
      r.visible = a;
    },
    paint: (a, l) => {
      t = 0;
      const u = (l == null ? void 0 : l.border) !== !1,
        c = (l == null ? void 0 : l.unicode) === !0,
        h = (l == null ? void 0 : l.font) ?? 3,
        d = c ? Uv(h) : kv(h),
        f = pf(l),
        p = is;
      if (!a || !d || !p) {
        ((n = 0), (s = 0));
        for (const w of e) w.visible = !1;
        return;
      }
      const g = d.lineHeight + (u ? 2 : 0);
      let m = 0;
      const b = [...a],
        x = [];
      for (const w of b) {
        const A = w.codePointAt(0) ?? 0;
        if (
          w ===
          `
`
        )
          continue;
        const v = d.glyphs[String(A)];
        if (w === ' ' && !v) {
          m += d.spaceWidth ?? 8;
          continue;
        }
        if (!v || v.x == null || v.y == null) {
          m += d.spaceWidth ?? (c ? 8 : 6);
          continue;
        }
        const P = v.ox ?? 0,
          M = v.oy ?? 0;
        (x.push({ g: v, x: m + P, y: M }), (m += v.adv));
      }
      ((n = m + (u ? 2 : 0)), (s = g));
      const S = -Math.ceil(n / 2),
        C = -s;
      for (const w of x) {
        if (u && w.g.bx != null && w.g.by != null && w.g.bw && w.g.bh) {
          const v = i();
          ((v.texture = bm(p, w.g.bx, w.g.by, w.g.bw, w.g.bh)),
            (v.tint = Fv),
            (v.alpha = 1),
            v.position.set(S + w.x - 1, C + w.y - 1));
        }
        const A = i();
        ((A.texture = bm(p, w.g.x, w.g.y, w.g.w, w.g.h)),
          (A.tint = f),
          (A.alpha = 1),
          A.position.set(S + w.x, C + w.y));
      }
      for (let w = t; w < e.length; w++) e[w].visible = !1;
    },
    setVisible: (a) => {
      r.visible = a;
    },
  };
}
function kE({ texto: r, altura: e, fonte: t = 4, cor: n = 15255930 }) {
  const s = Ue.useRef(null),
    [i, o] = Ue.useState(!1);
  return (
    Ue.useEffect(() => {
      let a = !0;
      return (
        Iv().then((l) => {
          const u = s.current;
          if (!a || !l || !u) return;
          const c = /[^\x20-\xff]/.test(r);
          o(FE(u, r, { font: c ? 0 : t, unicode: c, fill: n, border: !0 }, e));
        }),
        () => {
          a = !1;
        }
      );
    }, [r, e, t, n]),
    j.jsxs('span', {
      className: `titulo-uo${i ? ' titulo-uo-pronto' : ''}`,
      children: [
        j.jsx('canvas', { ref: s, className: 'titulo-uo-tela', 'aria-hidden': !0 }),
        j.jsx('span', { className: 'titulo-uo-texto', children: r }),
      ],
    })
  );
}
const pc = Date.UTC(2026, 10, 1, 18, 0, 0);
function Ov() {
  const [r, e] = Ue.useState(() => Date.now() >= pc);
  return (
    Ue.useEffect(() => {
      if (r) return;
      const t = window.setInterval(() => {
        Date.now() >= pc && e(!0);
      }, 1e3);
      return () => window.clearInterval(t);
    }, [r]),
    r
  );
}
function UE(r) {
  const e = pc - r;
  if (e <= 0) return null;
  const t = Math.floor(e / 1e3);
  return {
    d: Math.floor(t / 86400),
    h: Math.floor(t / 3600) % 24,
    m: Math.floor(t / 60) % 60,
    s: t % 60,
  };
}
function QP({ onde: r }) {
  const { t: e } = _s(),
    [t, n] = Ue.useState(() => Date.now());
  Ue.useEffect(() => {
    const i = window.setInterval(() => n(Date.now()), 1e3);
    return () => window.clearInterval(i);
  }, []);
  const s = UE(t);
  return j.jsxs('div', {
    className: `landing-beta landing-beta-${r}`,
    'data-beta-contagem': !0,
    children: [
      j.jsxs('p', {
        className: 'landing-beta-titulo',
        children: [
          j.jsx('span', { className: 'landing-beta-selo', children: e('landing.beta.kicker') }),
          j.jsx('span', { children: e('landing.beta.data') }),
        ],
      }),
      s
        ? j.jsx('ol', {
            className: 'landing-beta-relogio',
            role: 'timer',
            'aria-label': e('landing.beta.label'),
            children: [
              ['d', s.d],
              ['h', s.h],
              ['m', s.m],
              ['s', s.s],
            ].map(([i, o]) =>
              j.jsxs(
                'li',
                {
                  children: [
                    j.jsx('span', {
                      className: 'landing-beta-numero',
                      children: String(o).padStart(2, '0'),
                    }),
                    j.jsx('span', {
                      className: 'landing-beta-unidade',
                      children: e(`landing.beta.${i}`),
                    }),
                  ],
                },
                i
              )
            ),
          })
        : j.jsx('p', { className: 'landing-beta-comecou', children: e('landing.beta.comecou') }),
    ],
  });
}
function OE({ onde: r }) {
  const { t: e } = _s(),
    t = Ov();
  return j.jsxs('div', {
    className: `landing-pre-form-caixa landing-pre-${r}`,
    'data-pre-onde': r,
    children: [
      j.jsx('p', {
        className: 'landing-pre-rotulo',
        children: e(t ? 'landing.pre.labelAberto' : 'landing.pre.label'),
      }),
      j.jsx('a', {
        className: 'landing-jogar landing-pre-entrar',
        href: o1(a1),
        'data-pre-entrar': !0,
        children: e(t ? 'landing.pre.submitAberto' : 'landing.pre.submit'),
      }),
      j.jsx('p', { className: 'landing-pre-privacidade', children: e('landing.pre.privacy') }),
    ],
  });
}
function JP() {
  const { t: r } = _s(),
    e = Ov();
  return j.jsxs('section', {
    className: 'landing-secao landing-pre',
    id: 'pre-cadastro',
    'data-pre-cadastro': !0,
    children: [
      j.jsx('h2', {
        className: 'landing-h2',
        children: j.jsx(kE, { texto: r('landing.pre.title'), altura: 40 }),
      }),
      j.jsx('p', {
        className: 'landing-sub',
        children: r(e ? 'landing.pre.subtitleAberto' : 'landing.pre.subtitle'),
      }),
      j.jsxs('div', {
        className: 'landing-pre-corpo',
        children: [
          j.jsx('ol', {
            className: 'landing-pre-passos',
            children: ['1', '2'].map((t) =>
              j.jsxs(
                'li',
                {
                  children: [
                    j.jsx('span', { className: 'landing-passo-numero', children: t }),
                    j.jsxs('div', {
                      children: [
                        j.jsx('h3', {
                          children: r(`landing.pre.step${t}${e ? 'Aberto' : ''}.title`),
                        }),
                        j.jsx('p', {
                          children: r(`landing.pre.step${t}${e ? 'Aberto' : ''}.text`),
                        }),
                      ],
                    }),
                  ],
                },
                t
              )
            ),
          }),
          j.jsx(PE, {
            ouro: !0,
            className: 'landing-pre-moldura',
            children: j.jsx(OE, { onde: 'secao' }),
          }),
        ],
      }),
    ],
  });
}
function Gv(r) {
  return r == null || r <= 0 ? 400 : r >= 16384 ? r - 16384 : r;
}
const GE = new Set([400, 401, 402, 403, 605, 606, 666, 667]),
  LE = new Set([183, 184, 400, 401, 402, 403, 605, 606, 607, 666, 667, 694, 695]);
function Lv(r) {
  const e = Gv(r);
  return LE.has(e) ? 'human' : e >= 200 && e < 400 ? 'animal' : 'monster';
}
function Ks(r) {
  return Lv(r) === 'human';
}
function NE(r) {
  return GE.has(Gv(r));
}
const HE = 2;
function eR(r) {
  return mt(`/packs/idle/class-previews/${r}.png?v=${HE}`);
}
let jn;
const mc = new Map(),
  WE = 3;
async function zE(r = mt(`/packs/paperdoll/paperdoll.json?v=${WE}`)) {
  if (jn) return jn;
  try {
    const e = await fetch(r);
    if (!e.ok) return ((jn = void 0), null);
    const t = await e.json();
    mc.clear();
    for (const n of t.items) mc.set(n.graphic & 65535, n);
    return ((jn = t), t);
  } catch {
    return ((jn = void 0), null);
  }
}
function tR() {
  return jn ?? null;
}
function Nv(r, e) {
  return r ? (mc.get(e & 65535) ?? null) : null;
}
function $E(r, e) {
  return e ? r.femaleGump || r.maleGump : r.maleGump || r.femaleGump;
}
function rR(r, e, t) {
  return t || ((e ? (r.femaleHue ?? r.maleHue) : (r.maleHue ?? r.femaleHue)) ?? 0);
}
function VE(r, e) {
  const t = r.gumpDir || 'gumps';
  return mt(`/packs/paperdoll/${t}/${e}.png`);
}
function Hv(r, e) {
  const t = new Set();
  let n = e;
  try {
    const s = localStorage.getItem(r);
    (s === '1' || s === '0') && (n = s === '1');
  } catch {}
  return {
    get: () => n,
    set: (s) => {
      n = s;
      try {
        localStorage.setItem(r, s ? '1' : '0');
      } catch {}
      for (const i of t) i(n);
    },
    subscribe: (s) => (t.add(s), () => t.delete(s)),
  };
}
const Wv = Hv('uoidle.efeitosDeRoupa', !0),
  nR = Hv('uoidle.alertaParagon', !0),
  XE = { 3185: 'sombra', 3186: 'gelo', 3187: 'fogo' },
  zv = {
    sombra: {
      porSegundo: 3,
      andando: 9,
      vida: [700, 1100],
      cores: [2760008, 3877474, 1445919],
      aditivo: !1,
    },
    gelo: {
      porSegundo: 3,
      andando: 8,
      vida: [600, 1e3],
      cores: [10479359, 14219007, 6079728],
      aditivo: !0,
    },
    fogo: {
      porSegundo: 4,
      andando: 10,
      vida: [350, 600],
      cores: [16738842, 16757322, 16726538],
      aditivo: !0,
    },
  },
  jE = 20;
var km;
const YE =
  typeof window < 'u' &&
  !!(
    (km = window.matchMedia) != null && km.call(window, '(prefers-reduced-motion: reduce)').matches
  );
function qE(r, e, t) {
  const n = new wr();
  if (r === 'sombra')
    (n.circle(0, 0, t).fill({ color: e, alpha: 0.4 }),
      n.circle(0, 0, t * 0.55).fill({ color: e, alpha: 0.35 }));
  else if (r === 'gelo') {
    const s = t,
      i = t * 0.3;
    (n.poly([0, -s, i, 0, 0, s, -i, 0]).fill({ color: e }),
      n.poly([-s, 0, 0, i, s, 0, 0, -i]).fill({ color: e, alpha: 0.7 }),
      n.circle(0, 0, i).fill({ color: 16777215, alpha: 0.9 }));
  } else
    (n.circle(0, 0, t).fill({ color: e }),
      n.circle(0, 0, t * 0.45).fill({ color: 16773808, alpha: 0.9 }));
  return (zv[r].aditivo && (n.blendMode = 'add'), n);
}
function KE() {
  const r = new Me();
  ((r.label = 'rastro-do-beta'), (r.eventMode = 'none'));
  const e = [];
  let t = null,
    n = 0,
    s = 0,
    i = null;
  return {
    root: r,
    ligar: (a) => {
      ((t = a), a || (s = 0));
    },
    atualizar: (a, l, u) => {
      if (r.destroyed) return;
      const c = n ? Math.min(100, a - n) : 16;
      n = a;
      let h = i ? Math.hypot(l - i.x, u - i.y) : 0;
      if (((i = { x: l, y: u }), h > 200)) {
        for (const d of e) d.g.destroy();
        ((e.length = 0), (h = 0));
      }
      if (t && !YE && Wv.get()) {
        const d = zv[t];
        for (s += (c / 1e3) * (h > 0.5 ? d.andando : d.porSegundo); s >= 1 && e.length < jE;) {
          s -= 1;
          const f =
              t === 'sombra'
                ? 4 + Math.random() * 3
                : t === 'gelo'
                  ? 2 + Math.random() * 1.5
                  : 1.6 + Math.random() * 1.4,
            p = qE(t, d.cores[Math.floor(Math.random() * d.cores.length)], f),
            g = {
              t,
              g: p,
              nasceu: a,
              vida: d.vida[0] + Math.random() * (d.vida[1] - d.vida[0]),
              wx: l + (Math.random() - 0.5) * 26,
              wy: u + (Math.random() - 0.5) * 8 - (t === 'gelo' ? Math.random() * 10 : 0),
              vx: (Math.random() - 0.5) * 6,
              vy:
                t === 'fogo'
                  ? -(10 + Math.random() * 12)
                  : t === 'gelo'
                    ? 6 + Math.random() * 5
                    : -(2 + Math.random() * 4),
              tamanho: f,
            };
          (r.addChild(p), e.push(g));
        }
        s > 1 && (s = 1);
      }
      for (let d = e.length - 1; d >= 0; d--) {
        const f = e[d],
          p = (a - f.nasceu) / f.vida;
        if (p >= 1) {
          (f.g.destroy(), e.splice(d, 1));
          continue;
        }
        const g = c / 1e3;
        ((f.wx += f.vx * g),
          (f.wy += f.vy * g),
          f.g.position.set(f.wx - l, f.wy - u),
          f.t === 'sombra'
            ? (f.g.scale.set(0.6 + p * 1.2), (f.g.alpha = p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8))
            : f.t === 'fogo'
              ? (f.g.scale.set(1 - p * 0.7), (f.g.alpha = (1 - p) * (0.7 + Math.random() * 0.3)))
              : ((f.g.rotation += g * 1.5), (f.g.alpha = p < 0.5 ? 1 : 1 - (p - 0.5) / 0.5)));
      }
    },
    destroy: () => {
      for (const a of e) a.g.destroy();
      ((e.length = 0), r.destroyed || r.destroy({ children: !0 }));
    },
  };
}
function sR(r) {
  return r === 'bronze' || r === 'prata' || r === 'ouro' || r === 'beta' || r === 'vip';
}
const $v = '',
  ZE = { bronze: 'b', prata: 'p', ouro: 'o', beta: 't', vip: 'v' },
  QE = { b: 'bronze', p: 'prata', o: 'ouro', t: 'beta', v: 'vip' };
function iR(r, e) {
  return r && e ? `${$v}${ZE[e]}${r}` : r;
}
const vm = new RegExp(`${$v}([bpotv])`);
function JE(r) {
  const e = vm.exec(r);
  return e ? { nome: r.replace(vm, ''), selo: QE[e[1]] ?? '' } : { nome: r, selo: '' };
}
function oR() {
  const { t: r, i18n: e } = _s(),
    [t, n] = Ue.useState(!1),
    s = Ue.useRef(null),
    i = (e.language || 'pt').slice(0, 2),
    o = Kn.find((l) => l.code === i) ?? Kn[0];
  Ue.useEffect(() => {
    if (!t) return;
    const l = (c) => {
        var h;
        ((h = s.current) != null && h.contains(c.target)) || n(!1);
      },
      u = (c) => {
        c.key === 'Escape' && n(!1);
      };
    return (
      document.addEventListener('mousedown', l),
      document.addEventListener('keydown', u),
      () => {
        (document.removeEventListener('mousedown', l), document.removeEventListener('keydown', u));
      }
    );
  }, [t]);
  const a = (l) => {
    (Om(l), n(!1));
  };
  return j.jsxs('div', {
    className: 'lang-switch',
    ref: s,
    children: [
      j.jsx('button', {
        type: 'button',
        className: 'lang-switch-trigger chrome-btn uo-tip uo-tip-west',
        'aria-label': r('chrome.language'),
        'data-tip': r('chrome.language'),
        'aria-haspopup': 'listbox',
        'aria-expanded': t,
        onClick: () => n((l) => !l),
        children: j.jsx('span', {
          className: 'lang-flag',
          'aria-hidden': !0,
          children: j.jsx('img', { src: `/flags/${o.flag}.png`, alt: '', width: 20, height: 20 }),
        }),
      }),
      t
        ? j.jsx('ul', {
            className: 'lang-switch-menu',
            role: 'listbox',
            children: Kn.map((l) =>
              j.jsx(
                'li',
                {
                  role: 'option',
                  'aria-selected': l.code === o.code,
                  children: j.jsxs('button', {
                    type: 'button',
                    className:
                      l.code === o.code
                        ? 'lang-switch-item lang-switch-item-active'
                        : 'lang-switch-item',
                    onClick: () => a(l.code),
                    children: [
                      j.jsx('span', {
                        className: 'lang-flag',
                        'aria-hidden': !0,
                        children: j.jsx('img', {
                          src: `/flags/${l.flag}.png`,
                          alt: '',
                          width: 20,
                          height: 20,
                        }),
                      }),
                      j.jsx('span', { children: l.name }),
                    ],
                  }),
                },
                l.code
              )
            ),
          })
        : null,
    ],
  });
}
function aR() {
  const { t: r, i18n: e } = _s(),
    t = (e.language || 'pt').slice(0, 2),
    n = Kn.find((s) => s.code === t) ?? Kn[0];
  return j.jsx('ul', {
    className: 'settings-lang-list',
    role: 'listbox',
    'aria-label': r('chrome.language'),
    children: Kn.map((s) =>
      j.jsx(
        'li',
        {
          role: 'option',
          'aria-selected': s.code === n.code,
          children: j.jsx('button', {
            type: 'button',
            className:
              s.code === n.code ? 'lang-switch-item lang-switch-item-active' : 'lang-switch-item',
            'aria-label': s.name,
            title: s.name,
            onClick: () => Om(s.code),
            children: j.jsx('span', {
              className: 'lang-flag',
              'aria-hidden': !0,
              children: j.jsx('img', {
                src: `/flags/${s.flag}.png`,
                alt: '',
                width: 28,
                height: 28,
              }),
            }),
          }),
        },
        s.code
      )
    ),
  });
}
const eP = {
    16016: 276,
    16017: 277,
    16018: 284,
    16020: 243,
    16021: 169,
    16023: 195,
    16024: 194,
    16026: 193,
    16027: 192,
    16028: 191,
    16029: 192,
    16030: 190,
    16031: 200,
    16032: 226,
    16033: 228,
    16034: 204,
    16035: 210,
    16036: 218,
    16037: 219,
    16038: 220,
    16039: 116,
    16040: 117,
    16041: 114,
    16042: 200,
    16043: 220,
    16044: 210,
    16045: 132,
    16047: 120,
    16048: 121,
    16049: 119,
    16050: 118,
    16051: 144,
    16052: 122,
    16053: 116,
    16054: 178,
    16055: 179,
    16056: 187,
    16058: 188,
    16059: 793,
    16060: 791,
    16061: 794,
    16062: 799,
    16239: 213,
    16057: 287,
    203: 203,
    204: 204,
    211: 211,
    212: 212,
    213: 213,
    231: 231,
    232: 232,
    233: 233,
    188: 188,
    218: 218,
    219: 219,
    257: 257,
    788: 788,
    793: 793,
    799: 799,
    730: 730,
    1254: 1254,
    1255: 1255,
    1407: 1407,
    1408: 1408,
    1416: 1416,
    1426: 1426,
    1510: 1510,
    1526: 1526,
    1527: 1527,
    1546: 1546,
    1547: 1547,
    1549: 1549,
    1552: 1552,
    1651: 1651,
    1652: 1652,
    1653: 1653,
    1657: 1657,
  },
  tP = {
    203: 22,
    211: 8,
    212: 14,
    213: 10,
    231: 16,
    232: 14,
    233: 14,
    257: -20,
    284: -12,
    730: 14,
    1254: 18,
    1255: 16,
    1407: -16,
    1416: 14,
    1426: 18,
    1526: 12,
    1527: 16,
    1546: 12,
    1547: 10,
    1549: 12,
    1552: 14,
    1651: -20,
    1652: -8,
    1653: -8,
    1657: -8,
  };
function Sm(r) {
  return tP[r & 65535] ?? 0;
}
function rP(r, e = 0) {
  const t = r & 65535,
    n = eP[t];
  return n || (e > 0 && e < 400 ? e : t > 0 && t < 400 ? t : 0);
}
const ra = 7,
  nP = new Map(),
  sP = new Map();
let Zs, Yn;
const di = new Set(),
  os = new Set(),
  Vv = new Map(),
  Xv = new Map();
function gr(r, e, t) {
  return `${r}:${e}:${t}`;
}
function jv(r, e, t) {
  t.clear();
  const n = r.aliases || {};
  for (const [s, i] of Object.entries(n)) {
    const o = Number(s),
      a = Number(i);
    !o || !a || o === a || (t.set(o, a), e.has(a) && e.add(o));
  }
}
function iP(r, e) {
  let t = r;
  for (let n = 0; n < 4; n++) {
    const s = e.get(t);
    if (s == null || s === t) break;
    t = s;
  }
  return t;
}
const Yv = mt('/packs/equip'),
  qv = mt('/packs/equip-mount');
async function Kv(r) {
  try {
    const e = await fetch(r);
    if (!e.ok) return null;
    const t = await e.json(),
      n = new Set();
    for (const s of t.anims || []) n.add(s);
    return { pack: t, set: n };
  } catch {
    return null;
  }
}
async function oP(r = `${Yv}/equip.json?v=${ra}`) {
  if (Zs) return Zs;
  const e = await Kv(r);
  if (!e) return ((Zs = void 0), null);
  di.clear();
  for (const t of e.set) di.add(t);
  return (jv(e.pack, di, Vv), (Zs = e.pack), mf(), Zs);
}
async function mf(r = `${qv}/equip.json?v=${ra}`) {
  if (Yn) return Yn;
  const e = await Kv(r);
  if (!e) return ((Yn = null), null);
  os.clear();
  for (const t of e.set) os.add(t);
  return (jv(e.pack, os, Xv), (Yn = e.pack), Yn);
}
function aP() {
  return os.size > 0;
}
function lP(r, e) {
  return !!r && di.has(e);
}
function uP(r) {
  return r > 0 && os.has(r);
}
async function Zv(r, e, t, n, s) {
  if (!e || !t.has(e)) return null;
  const i = iP(e, s);
  if (n.has(e)) return n.get(e) ?? null;
  if (e !== i && n.has(i)) {
    const o = n.get(i) ?? null;
    return (n.set(e, o), o);
  }
  try {
    const { Assets: o, Texture: a } = await Qr(
        async () => {
          const { Assets: f, Texture: p } = await Promise.resolve().then(() => vv);
          return { Assets: f, Texture: p };
        },
        void 0
      ),
      l = await fetch(`${r}/${i}.json?v=${ra}`);
    if (!l.ok) return (n.set(e, null), null);
    const u = await l.json(),
      c = await o.load(`${r}/${u.image || `${i}.png`}?v=${ra}`),
      h = new Map();
    for (const f of u.frames) h.set(gr(f.action, f.animDir, f.frame), f);
    const d = { slice: u, texture: c, byKey: h };
    return (n.set(i, d), n.set(e, d), d);
  } catch {
    return (n.set(e, null), null);
  }
}
async function Tm(r) {
  return Zv(Yv, r, di, nP, Vv);
}
async function wm(r) {
  return (Yn || (await mf()), Zv(qv, r, os, sP, Xv));
}
function cP(r, e, t, n = 0) {
  if (!r) return null;
  let s = r.byKey.get(gr(e, t, n));
  if (s) return s;
  if (n !== 0) {
    for (let i = n - 1; i >= 0; i--) if (((s = r.byKey.get(gr(e, t, i))), s)) return s;
  }
  if (e === 'run' || e === 'mount-run') {
    const i = e === 'mount-run' ? 'mount-walk' : 'walk';
    if (((s = r.byKey.get(gr(i, t, n))), s)) return s;
    for (let o = n - 1; o >= 0; o--) if (((s = r.byKey.get(gr(i, t, o))), s)) return s;
  }
  if (
    (e === 'attack' || e === 'attack-bow' || e === 'cast') &&
    ((s = r.byKey.get(gr('war-stand', t, 0))), s)
  )
    return s;
  if (e === 'mount-attack-bow') {
    if (((s = r.byKey.get(gr('mount-attack', t, n))), s)) return s;
    for (let i = n - 1; i >= 0; i--) if (((s = r.byKey.get(gr('mount-attack', t, i))), s)) return s;
  }
  return e.startsWith('mount-')
    ? ((s = r.byKey.get(gr('mount-stand', t, 0))), s || null)
    : e !== 'stand' && ((s = r.byKey.get(gr('stand', t, 0))), s)
      ? s
      : null;
}
const hP = `
in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform sampler2D uHueTable;
uniform vec3 uBrilho;
uniform float uForca;
uniform float uCintila;
uniform float uTempo;
// highp, like the vertex shader declares them: with the fragment default (mediump) the program does not link.
uniform highp vec4 uInputSize;
uniform highp vec4 uOutputFrame;

void main()
{
    vec4 color = texture(uTexture, vTextureCoord);
    if (color.a <= 0.001) {
        finalColor = color;
        return;
    }
    color.rgb /= color.a;
    float r5 = floor(floor(color.r * 255.0 + 0.5) / 8.0);
    vec3 hued = texture(uHueTable, vec2((r5 + 0.5) / 32.0, 0.5)).rgb;

    float l = r5 / 31.0;
    // 0..1 inside this drawing, whatever the frame.
    vec2 pos = vTextureCoord * uInputSize.xy / uOutputFrame.zw;
    float d = (pos.x + pos.y) * 0.5;
    // PERIODO_S (2.0) and TRAVESSIA_S (1.4) of metais.ts: the canvases use the same phase.
    float m = mod(uTempo, 2.0);
    float fase = -0.25 + (m / 1.4) * 1.5;
    float banda = m > 1.4 ? 0.0 : exp(-pow((d - fase) / 0.06, 2.0));
    vec3 luz = uBrilho * banda * uForca * (0.35 + 0.65 * l);
    vec2 px = floor(vTextureCoord * uInputSize.xy / 2.0);
    float h = fract(sin(dot(px + floor(uTempo * 6.0), vec2(12.9898, 78.233))) * 43758.5453);
    float cint = step(1.0 - 0.006 * uCintila, h) * smoothstep(0.55, 0.9, l) * uCintila;
    hued = min(hued + luz + uBrilho * cint * 0.9, vec3(1.0));

    finalColor = vec4(hued * color.a, color.a);
}
`,
  Qv = new Ke({ uTempo: { value: 0, type: 'f32' } });
let Pi = !1,
  Ri = 0;
const as = new Set();
function dP() {
  Pi && ((Pi = !1), cancelAnimationFrame(Ri), (Ri = 0));
}
function Jv() {
  var r;
  Ri = 0;
  for (const e of as)
    (e.destroyed || !(((r = e.filters) == null ? void 0 : r[0]) instanceof gc)) && as.delete(e);
  if (!as.size) {
    Pi = !1;
    return;
  }
  ((Qv.uniforms.uTempo = cf()), (Ri = requestAnimationFrame(Jv)));
}
function fP(r) {
  (as.add(r), !Pi && ((Pi = !0), (Ri = requestAnimationFrame(Jv))));
}
const Cm = new Map();
function pP(r, e) {
  const t = r & 32767,
    n = Cm.get(t);
  if (n) return n;
  const s = Tv(r, e);
  if (!s) return null;
  const i = document.createElement('canvas');
  ((i.width = 32), (i.height = 1));
  const o = i.getContext('2d'),
    a = o.createImageData(32, 1);
  for (let u = 0; u < 32; u++)
    ((a.data[u * 4] = Math.round(s[u * 3] * 255)),
      (a.data[u * 4 + 1] = Math.round(s[u * 3 + 1] * 255)),
      (a.data[u * 4 + 2] = Math.round(s[u * 3 + 2] * 255)),
      (a.data[u * 4 + 3] = 255));
  o.putImageData(a, 0, 0);
  const l = Y.from(i);
  return ((l.source.scaleMode = 'nearest'), Cm.set(t, l), l);
}
class gc extends Jt {
  constructor(t) {
    super({
      glProgram: At.from({ vertex: Fn, fragment: hP, name: 'uo-metal-filter' }),
      resources: {
        uoMetal: {
          uBrilho: { value: new Float32Array([1, 1, 1]), type: 'vec3<f32>' },
          uForca: { value: 0, type: 'f32' },
          uCintila: { value: 0, type: 'f32' },
        },
        uoRelogio: Qv,
        uHueTable: t.source,
        uHueSampler: t.source.style,
      },
      padding: 0,
      antialias: !1,
    });
    Gn(this, 'aplicada', -1);
  }
  definir(t, n, s) {
    const i = t & 32767;
    if (this.aplicada === i) return;
    const o = this.resources.uoMetal.uniforms;
    (o.uBrilho.set(n.brilho),
      (o.uForca = n.forca),
      (o.uCintila = n.cintila),
      (this.resources.uHueTable = s.source),
      (this.resources.uHueSampler = s.source.style),
      (this.aplicada = i));
  }
}
const _c = new WeakMap();
function e1(r) {
  var a;
  if (r.destroyed) return;
  const e = _c.get(r);
  if (e == null) return;
  const t = Ni(e),
    n = Sv();
  if (!t) return;
  if (!n) {
    Li().then(() => e1(r));
    return;
  }
  const s = pP(e, n);
  if (!s) return;
  const i = (a = r.filters) == null ? void 0 : a[0],
    o = i instanceof gc ? i : new gc(s);
  (i !== o && (r.filters = [o]), o.definir(e, t, s), fP(r));
}
function mP(r, e, t) {
  return t || (e & 32768) !== 0 || !Ni(e)
    ? (_c.delete(r), as.delete(r), as.size || dP(), !1)
    : (_c.set(r, e), e1(r), !0);
}
const gP = `
in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform sampler2D uHueTable;
uniform float uPartial;
uniform float uEnabled;
uniform float uSpectral;

void main()
{
    vec4 color = texture(uTexture, vTextureCoord);
    if (uSpectral > 0.5) {
        if (color.a <= 0.001) {
            finalColor = vec4(0.0);
            return;
        }
        float r = color.r / color.a;
        float a = color.a * max(0.0, 1.0 - r * 1.5);
        finalColor = vec4(0.0, 0.0, 0.0, a);
        return;
    }
    if (uEnabled < 0.5 || color.a <= 0.001) {
        finalColor = color;
        return;
    }
    if (color.a > 0.0) {
        color.rgb /= color.a;
    }
    float r8 = floor(color.r * 255.0 + 0.5);
    float g8 = floor(color.g * 255.0 + 0.5);
    float b8 = floor(color.b * 255.0 + 0.5);
    float r5 = floor(r8 / 8.0);
    float g5 = floor(g8 / 8.0);
    float b5 = floor(b8 / 8.0);
    if (uPartial > 0.5 && (abs(r5 - g5) > 0.5 || abs(g5 - b5) > 0.5)) {
        finalColor = vec4(color.rgb * color.a, color.a);
        return;
    }
    vec3 hued = texture(uHueTable, vec2((r5 + 0.5) / 32.0, 0.5)).rgb;
    finalColor = vec4(hued * color.a, color.a);
}
`;
function _P(r) {
  return na(r) ? !1 : (r & 16383) !== 0;
}
function na(r) {
  return (r & 32767) === 16385;
}
const Am = new Map();
function t1(r) {
  const e = document.createElement('canvas');
  ((e.width = 32), (e.height = 1));
  const t = e.getContext('2d'),
    n = t.createImageData(32, 1);
  for (let i = 0; i < 32; i++)
    ((n.data[i * 4] = Math.round(r[i * 3] * 255)),
      (n.data[i * 4 + 1] = Math.round(r[i * 3 + 1] * 255)),
      (n.data[i * 4 + 2] = Math.round(r[i * 3 + 2] * 255)),
      (n.data[i * 4 + 3] = 255));
  t.putImageData(n, 0, 0);
  const s = Y.from(e);
  return ((s.source.scaleMode = 'nearest'), s);
}
function bP(r, e) {
  const t = Tv(r, e);
  if (!t) return null;
  const n = r & 32767;
  let s = Am.get(n);
  return (s || ((s = t1(t)), Am.set(n, s)), s);
}
function xP() {
  const r = new Float32Array(96);
  return t1(r);
}
class xo extends Jt {
  constructor() {
    const t = xP();
    super({
      glProgram: At.from({ vertex: Fn, fragment: gP, name: 'uo-hue-filter' }),
      resources: {
        uoHueUniforms: {
          uPartial: { value: 0, type: 'f32' },
          uEnabled: { value: 1, type: 'f32' },
          uSpectral: { value: 0, type: 'f32' },
        },
        uHueTable: t.source,
        uHueSampler: t.source.style,
      },
      padding: 0,
      antialias: !1,
    });
    Gn(this, 'applied', -1);
    Gn(this, 'appliedPartial', !1);
    Gn(this, 'appliedSpectral', !1);
    Gn(this, 'lut');
    this.lut = t;
  }
  setHue(t, n, s) {
    const i = na(t),
      o = !i && (n || (t & 32768) !== 0),
      a = i ? 16385 : t & 32767;
    if (this.applied === a && this.appliedPartial === o && this.appliedSpectral === i) return;
    const l = this.resources.uoHueUniforms.uniforms;
    if (((l.uSpectral = i ? 1 : 0), (this.appliedSpectral = i), i)) {
      ((l.uEnabled = 1), (this.applied = a), (this.appliedPartial = !1));
      return;
    }
    const u = bP(t, s);
    if (!u) {
      ((l.uEnabled = 0), (this.applied = 0));
      return;
    }
    (this.lut !== u &&
      ((this.lut = u),
      (this.resources.uHueTable = u.source),
      (this.resources.uHueSampler = u.source.style)),
      (l.uPartial = o ? 1 : 0),
      (l.uEnabled = 1),
      (this.applied = a),
      (this.appliedPartial = o));
  }
}
const bc = new WeakMap();
function r1(r) {
  var i, o, a;
  if (r.destroyed) return;
  const e = bc.get(r);
  if (!e) return;
  if (!_P(e.hue) && !na(e.hue)) {
    (i = r.filters) != null && i.length && (r.filters = []);
    return;
  }
  if (na(e.hue)) {
    const l = (o = r.filters) == null ? void 0 : o[0],
      u = l instanceof xo ? l : new xo();
    (l !== u && (r.filters = [u]), u.setHue(e.hue, !1, []));
    return;
  }
  const t = Sv();
  if (!t) {
    Li().then(() => r1(r));
    return;
  }
  const n = (a = r.filters) == null ? void 0 : a[0],
    s = n instanceof xo ? n : new xo();
  (n !== s && (r.filters = [s]), s.setHue(e.hue, e.partial, t));
}
function Yl(r, e, t = !1) {
  if (mP(r, e, t)) {
    bc.delete(r);
    return;
  }
  (bc.set(r, { hue: e, partial: t }), r1(r));
}
const ql = [900, 1500];
var Um;
const yP =
  typeof window < 'u' &&
  !!(
    (Um = window.matchMedia) != null && Um.call(window, '(prefers-reduced-motion: reduce)').matches
  );
function vP(r, e) {
  const t = new wr(),
    n = r,
    s = r * 0.28;
  return (
    t.poly([0, -n, s, -s, n, 0, s, s, 0, n, -s, s, -n, 0, -s, -s]).fill({ color: e }),
    t.circle(0, 0, s * 1.1).fill({ color: 16777215, alpha: 0.9 }),
    (t.blendMode = 'add'),
    t
  );
}
function SP() {
  const r = new Me();
  ((r.label = 'faiscas-douradas'), (r.eventMode = 'none'));
  const e = [];
  let t = !1,
    n = lc.ouro,
    s = 70,
    i = 80,
    o = 0,
    a = 0;
  return {
    root: r,
    atualizar: (u) => {
      if (r.destroyed) return;
      const c = o ? Math.min(100, u - o) : 16;
      if (((o = u), t && Wv.get())) {
        for (a += (c / 1e3) * n.porSegundo; a >= 1 && e.length < n.maximo;) {
          a -= 1;
          const h = 2.2 + Math.random() * 2.6,
            d = vP(h, n.cor),
            f = {
              g: d,
              nasceu: u,
              vida: ql[0] + Math.random() * (ql[1] - ql[0]),
              x: (Math.random() - 0.5) * s,
              y: -Math.random() * i,
              sobe: 8 + Math.random() * 10,
              tamanho: h,
            };
          (d.position.set(f.x, f.y), r.addChild(d), e.push(f));
        }
        a > 1 && (a = 1);
      }
      for (let h = e.length - 1; h >= 0; h--) {
        const d = e[h],
          f = (u - d.nasceu) / d.vida;
        if (f >= 1) {
          (d.g.destroy(), e.splice(h, 1));
          continue;
        }
        const p = f < 0.3 ? f / 0.3 : 1 - (f - 0.3) / 0.7;
        (d.g.scale.set(Math.max(0.05, p)),
          (d.g.alpha = f < 0.5 ? 1 : 1 - (f - 0.5) / 0.5),
          (d.g.rotation = f * 0.8),
          d.g.position.set(d.x, d.y - d.sobe * f));
      }
      !t && !e.length && (o = 0);
    },
    ligar(u, c) {
      const h = !!u && !yP;
      (u && (n = lc[u]), c && ((s = c.largura), (i = c.altura)), h !== t && (t = h));
    },
    destroy() {
      for (const u of e) u.g.destroy();
      ((e.length = 0), r.destroy({ children: !0 }));
    },
  };
}
const fn = (r) => r === 'mine' || r === 'chop',
  TP = [
    O.Shoes,
    O.OuterLegs,
    O.InnerLegs,
    O.Pants,
    O.Shirt,
    O.InnerTorso,
    O.MiddleTorso,
    O.Arms,
    O.Gloves,
    O.OuterTorso,
    O.Waist,
    O.Hair,
    O.Beard,
    O.Helm,
    O.Face,
    O.OneHanded,
    O.TwoHanded,
  ];
function Em(r) {
  const e = TP.slice(),
    t = r & 7;
  let n;
  if (t === 0) n = e.length;
  else if (t === 3) n = 0;
  else {
    const s = e.indexOf(O.Helm);
    n = s >= 0 ? s : e.length;
  }
  return (e.splice(n, 0, O.Cloak), e);
}
function Pm(r, e, t, n) {
  const s = n * 0.5,
    i = s / Math.max(1, t),
    o = e + s - 10;
  return new Float32Array([r + t * i, o, r + t * (i + 1), o, r, o + s, r + t, o + s]);
}
const Rm = new Map();
function Mm(r, e) {
  const t = `${r.uid}:${e.x}:${e.y}:${e.width}:${e.height}`;
  let n = Rm.get(t);
  return (
    n ||
      ((n = new Y({ source: r.source, frame: new we(e.x, e.y, e.width, e.height) })), Rm.set(t, n)),
    n
  );
}
function wP(r, e) {
  const t = e.get(O.Mount);
  if (!t) return 0;
  const n = Nv(r, t.graphic),
    s = rP(t.graphic, (n == null ? void 0 : n.anim) || 0);
  return s || 200;
}
const Bm = 0,
  Dm = -18;
function yo(r, e) {
  return e
    ? r === 'walk'
      ? 'mount-walk'
      : r === 'run'
        ? 'mount-run'
        : r === 'attack'
          ? 'mount-attack'
          : r === 'attack-bow'
            ? 'mount-attack-bow'
            : r === 'cast'
              ? 'mount-attack'
              : 'mount-stand'
    : r;
}
function CP(r) {
  return r === 'walk' ? 'walk' : r === 'run' ? 'run' : 'stand';
}
async function lR(r, e) {
  const t = (e == null ? void 0 : e.imageUrl) ?? mt(`/packs/body/${r.image}?v=${r.version}`),
    n = (e == null ? void 0 : e.equipPack) ?? null,
    s = (e == null ? void 0 : e.mobilePack) ?? null,
    i = !!(e != null && e.equipNoGolpe),
    o = await Zr.load(t),
    a = Dv(r);
  (Li(), await Iv());
  const l = new Me();
  l.label = 'body-mobile';
  const u = new Float32Array(8),
    c = new K2({ texture: Y.WHITE, vertices: u, uvs: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]) });
  ((c.label = 'body-shadow'), (c.tint = 0), (c.alpha = 0.45), l.addChild(c));
  const h = new wt();
  ((h.label = 'body-mount'), (h.visible = !1), l.addChild(h));
  const d = new Me();
  ((d.label = 'body-rider'), l.addChild(d));
  const f = SP();
  l.addChild(f.root);
  const p = KE();
  l.addChild(p.root);
  const g = new wt();
  d.addChild(g);
  const m = new Me();
  ((m.label = 'body-equip'), d.addChild(m));
  const b = Math.max(2, Math.round((window.devicePixelRatio || 1) * 2)),
    x = new Me();
  ((x.label = 'body-labels'), (x.eventMode = 'none'), l.addChild(x));
  const S = ym();
  (S.root.position.set(0, 0), x.addChild(S.root));
  let C = '',
    w = 15794152;
  const A = () => {
      (S.paint(JE(C).nome, { fill: w, font: 3, unicode: !0, border: !0 }),
        S.setVisible(C.length > 0));
    },
    v = ym();
  (v.setVisible(!1), x.addChild(v.root));
  let P = null;
  const M = new Re();
  let D = !1,
    B = '',
    I = 16119285;
  const k = new wr();
  ((k.label = 'hp-bar'), (k.eventMode = 'none'), (k.visible = !1), l.addChild(k));
  const H = [14211288, 7255295, 7004010, 13158600, 15261776, 16750933, 16731469, 16772710];
  let W = '',
    F = 0,
    U = 0,
    $ = 0,
    N = !1;
  const q = (_) => {
    if ((k.clear(), l.addChild(k), U <= 0)) {
      if (!N) {
        k.visible = !1;
        return;
      }
      const oe = 48,
        le = 6;
      ((k.visible = !0),
        k.position.set(-oe / 2, _ + 3),
        k.rect(-1, -1, oe + 2, le + 2).fill({ color: 15255658, alpha: 0.85 }),
        k.rect(0, 0, oe, le).fill({ color: 1118481, alpha: 0.9 }));
      return;
    }
    const T = N ? 50 : 46,
      R = N ? 6 : 5,
      L = Math.max(0, Math.min(1, F / U)),
      z = L > 0.66 ? 4050010 : L > 0.33 ? 14729280 : 13384250;
    ((k.visible = !0),
      k.position.set(-T / 2, _ + 3),
      N && k.rect(-1, -1, T + 2, R + 2).fill({ color: 15255658, alpha: 0.85 }),
      k.rect(0, 0, T, R).fill({ color: 1118481, alpha: 0.85 }));
    const G = Math.max(0, (T - 2) * L);
    G > 0 && k.rect(1, 1, G, R - 2).fill({ color: z });
  };
  let ne = !1,
    X = 60,
    Z = 'stand',
    te = 4,
    re = 0,
    V = 0,
    ie = 400,
    be = 0,
    K = 0,
    ge = null,
    ye = null,
    ce = !1,
    Ee = 0,
    ve = !1;
  const Be = [];
  let _t = 0,
    ke = 0,
    He = () => {};
  const Fe = (_, T, R, L) => {
      ((_.texture = Mm(T, R)),
        _.pivot.set(R.centerX, R.height + R.centerY),
        _.position.set(0, 0),
        _.scale.set(L ? -1 : 1, 1),
        (_.visible = !0));
    },
    Le = (_, T, R, L, z, G, oe = !1) => {
      (Fe(_, T, R, L), Yl(_, z, oe), (_.alpha = 1));
    },
    Nt = 10,
    lr = (_) => {
      if (W) {
        ((C = W), A());
        return;
      }
      _ != null && ((C = _), A());
    },
    Ar = () => {
      let T = d.position.y - (g.pivot.y || X);
      return (h.visible && h.pivot.y > 0 && (T = Math.min(T, -h.pivot.y)), Math.round(T - Nt));
    },
    an = (_) => {
      N !== _ && ((N = _), q(Ar()));
    },
    bt = () => {
      const _ = Ar();
      (q(_),
        S.root.position.set(0, 0),
        v.root.position.set(0, v.root.visible ? -(S.height + 4) : 0),
        x.parent === l && x.position.set(0, _));
    },
    ur = () => {
      if (x.destroyed || l.destroyed) return;
      if ((bt(), D)) {
        x.visible = !1;
        return;
      }
      if (x.parent === l) {
        x.visible = !0;
        return;
      }
      (l.toGlobal({ x: 0, y: Ar() }, M), x.position.set(Math.round(M.x), Math.round(M.y)));
      let _ = l.visible;
      for (let T = l.parent; T && _; T = T.parent) _ = T.visible;
      x.visible = _;
    },
    kn = (_) => {
      ((D = _), (S.root.renderable = !_), (v.root.renderable = !_), (x.visible = !_), bt());
    },
    Xt = () => {
      const _ = H[Math.max(0, Math.min(7, $ | 0))] ?? H[0];
      return { name: W || C, nameRgb: _, overhead: B, overheadRgb: I };
    },
    Er = ({ name: _, hits: T, hitsMax: R, notoriety: L }) => {
      (_ != null && ((W = _), (C = _), A()),
        L != null && (($ = L), (w = H[Math.max(0, Math.min(7, $ | 0))] ?? H[0]), A()),
        T != null && (F = T),
        R != null && (U = R),
        bt());
    },
    xt = (_) => {
      ((d.position.y = _ ? Bm + Sm(Ee) : 0), bt());
    },
    tr = () => {
      ((h.visible = !1), f.ligar(ge, { largura: 46, altura: 72 }));
    },
    Nr = () => {
      if (!Ee || !s || !Ks(ie)) {
        (tr(), xt(!1));
        return;
      }
      let _ = Ee;
      if (!zl(s, _)) {
        const z = [200, 204, 210, 226].find((G) => zl(s, G));
        if (!z) {
          (tr(), xt(!1));
          return;
        }
        _ = z;
      }
      const T = (z) => {
          const G = CP(Z),
            oe = G === 'stand' ? 0 : V;
          let le = _o(z, G, re, oe);
          if ((!le && G === 'run' && (le = _o(z, 'walk', re, oe)), !le)) {
            (tr(), xt(!1));
            return;
          }
          (Le(h, z.texture, le, ne, K, `mount:${_}:${G}:${re}:${oe}`, !1),
            xt(!0),
            f.ligar(ac[K & 16383] ?? ge, { largura: 76, altura: Math.max(60, h.height || 80) }));
        },
        R = fc(_);
      if (R) {
        T(R);
        return;
      }
      const L = ke;
      pm(_).then((z) => {
        L !== ke || !z || T(z);
      });
    },
    Pr = (_, T, R, L, z) => {
      ((_.sprite.visible = !0),
        (_.sprite.texture = T),
        _.sprite.pivot.set(R, z + L),
        _.sprite.position.set(0, 0),
        _.sprite.scale.set(ne ? -1 : 1, 1));
    },
    jt = (_) => {
      if (_.mode !== 'anim' || !_.animId) {
        _.mode === 'anim' && (_.sprite.visible = !1);
        return;
      }
      const T = ke,
        R = Z,
        L = re,
        z = V,
        G = Ee > 0 && Ks(ie),
        oe = (le, Ce) => {
          const Je = Ce ? yo(R, !0) : R,
            Dt = cP(le, Je, L, z);
          if (!Dt) {
            if (
              _.sprite.texture &&
              (R === 'cast' || R === 'attack' || R === 'attack-bow' || R === 'war-stand')
            ) {
              _.sprite.visible = !0;
              return;
            }
            _.sprite.visible = !1;
            return;
          }
          (Pr(_, Mm(le.texture, Dt), Dt.centerX, Dt.centerY, Dt.height),
            Yl(_.sprite, _.hue, _.partialHue),
            G && !Ce && (_.sprite.position.y = Dm),
            (_.atlas = le.texture));
        };
      if (_.loadedAnim && _.usedMountPack === G) {
        oe(_.loadedAnim, _.usedMountPack);
        return;
      }
      (async () => {
        let le = null,
          Ce = !1;
        if (
          (G && ((le = await wm(_.animId)), le && (Ce = !0)),
          le || (le = await Tm(_.animId)),
          T === ke)
        ) {
          if (!le) {
            _.sprite.visible = !1;
            return;
          }
          ((_.loadedAnim = le), (_.usedMountPack = Ce), (_.atlas = le.texture), oe(le, Ce));
        }
      })();
    },
    Es = (_) => {
      if (fn(Z)) {
        _.sprite.visible = !1;
        return;
      }
      _.sprite.visible = !0;
      const T =
          (ce ? (ye == null ? void 0 : ye.bodyFemaleHeight) : void 0) ||
          (ye == null ? void 0 : ye.bodyHeight) ||
          237,
        R = Math.max(0.15, X / Math.max(1, T));
      (_.sprite.anchor.set(0.5, 1),
        _.sprite.scale.set(ne ? -R : R, R),
        _.sprite.position.set(0, 0));
    },
    Ps = () => {
      if (!Ks(ie)) {
        m.visible = !1;
        return;
      }
      ((m.visible = !0), Rs(te));
      const T = Ee > 0 && !aP() ? Dm : 0;
      if (Be.some((G) => G.mode === 'anim')) {
        (m.scale.set(1, 1), m.position.set(0, T));
        for (const G of Be) G.mode === 'gump' ? Es(G) : jt(G);
        return;
      }
      const L =
          (ce ? (ye == null ? void 0 : ye.bodyFemaleHeight) : void 0) ||
          (ye == null ? void 0 : ye.bodyHeight) ||
          237,
        z = Math.max(0.15, X / Math.max(1, L));
      (m.scale.set(ne ? -z : z, z), m.position.set(0, T), (m.visible = !fn(Z)));
      for (const G of Be) (G.sprite.anchor.set(0.5, 1), G.sprite.position.set(0, 0));
    },
    Rs = (_) => {
      if (Be.length === 0) return;
      const T = _ & 7,
        R = Be.find((G) => G.layer === O.Cloak),
        L = Be.filter((G) => G.layer !== O.Cloak);
      let z = L;
      if (R) {
        let G;
        if (T === 0) G = L.length;
        else if (T === 3) G = 0;
        else {
          const oe = L.findIndex((le) => le.layer === O.Helm);
          G = oe >= 0 ? oe : L.length;
        }
        z = [...L.slice(0, G), R, ...L.slice(G)];
      }
      for (let G = 0; G < z.length; G++) z[G].sprite.zIndex = G + 1;
      ((m.sortableChildren = !0), m.sortChildren());
    },
    ln = () => {
      for (const _ of Be) _.sprite.destroy();
      ((Be.length = 0), m.removeChildren());
    },
    Ms = async (_, T, R = !1) => {
      ((ye = T), (ce = R));
      const L = _.get(O.Mount);
      ((Ee = wP(T, _)), (K = (L == null ? void 0 : L.hue) ?? 0));
      const z = (me) => {
        const Pe = _.get(me);
        return Pe ? (ac[Pe.hue & 16383] ?? null) : null;
      };
      ge = z(O.OuterTorso) ?? z(O.Cloak);
      const G = (me) => {
        const Pe = _.get(me);
        return Pe ? (XE[Pe.hue & 16383] ?? null) : null;
      };
      (p.ligar(G(O.OuterTorso) ?? G(O.Cloak)), L || ((Ee = 0), (K = 0)));
      const oe = Ee > 0,
        le = oe !== ve,
        Ce = ++_t,
        Je = AE(_),
        Dt = EE(_),
        Ft = [];
      if (T && Ks(ie))
        for (const me of Em(te)) {
          if ((Je && (me === O.Hair || me === O.Beard)) || (Dt && me === O.OuterLegs)) continue;
          const Pe = _.get(me);
          Pe && Ft.push(Pe);
        }
      if ((oe && (await mf()), Ce !== _t)) return !1;
      if ((ln(), Nr(), le && He(), !T || !Ks(ie))) return (Ps(), Ce === _t);
      const Ne = await Promise.all(
        Ft.map(async (me, Pe) => {
          const et = Nv(T, me.graphic);
          if (!et) return null;
          const yt = !!et.partialHue,
            Se = me.hue || 0,
            ft = et.anim || 0,
            pt = lP(n, ft) || uP(ft);
          if (ft && pt) {
            let vt = null,
              cr = !1;
            if ((oe && ((vt = await wm(ft)), vt && (cr = !0)), vt || (vt = await Tm(ft)), vt))
              return {
                kind: 'anim',
                i: Pe,
                item: me,
                animId: ft,
                hue: Se,
                partialHue: yt,
                loaded: vt,
                usedMountPack: cr,
              };
          }
          const Wr = $E(et, ce);
          if (!Wr) return null;
          try {
            const vt = await Zr.load(VE(T, Wr));
            return { kind: 'gump', i: Pe, item: me, hue: Se, partialHue: yt, baseTex: vt };
          } catch {
            return null;
          }
        })
      );
      if (Ce !== _t) return !1;
      for (const me of Ne) {
        if (!me) continue;
        if (me.kind === 'anim') {
          const et = new wt();
          ((et.label = `equip-anim-${me.item.layer}`), (et.zIndex = me.i + 1), m.addChild(et));
          const yt = {
            layer: me.item.layer,
            serial: me.item.serial,
            graphic: me.item.graphic,
            animId: me.animId,
            hue: me.hue,
            partialHue: me.partialHue,
            mode: 'anim',
            sprite: et,
            atlas: me.loaded.texture,
            loadedAnim: me.loaded,
            usedMountPack: me.usedMountPack,
          };
          (Be.push(yt), jt(yt));
          continue;
        }
        const Pe = new wt(me.baseTex);
        ((Pe.label = `equip-gump-${me.item.layer}`),
          (Pe.zIndex = me.i + 1),
          Yl(Pe, me.hue, me.partialHue),
          m.addChild(Pe),
          Be.push({
            layer: me.item.layer,
            serial: me.item.serial,
            graphic: me.item.graphic,
            animId: 0,
            hue: me.hue,
            partialHue: me.partialHue,
            mode: 'gump',
            sprite: Pe,
            atlas: null,
            loadedAnim: null,
            usedMountPack: !1,
          }));
      }
      return Ce !== _t ? !1 : ((m.sortableChildren = !0), Un(te), Ps(), !0);
    },
    Un = (_) => {
      if (Be.length === 0) return;
      const T = new Map(Em(_).map((R, L) => [R, L + 1]));
      for (const R of Be) R.sprite.zIndex = T.get(R.layer) ?? R.sprite.zIndex;
      ((m.sortableChildren = !0), m.sortChildren());
    },
    On = ({ body: _, facing: T, action: R = 'stand', frame: L = 0, label: z, hue: G = 0 }) => {
      (f.atualizar(performance.now()), p.atualizar(performance.now(), l.position.x, l.position.y));
      const { animDir: oe, mirror: le } = dE(T),
        Ce = Lv(_),
        Je = Ce !== 'human' || (!NE(_) && !!s && zl(s, _)),
        Dt = !Je && Ce === 'human' && Ee > 0,
        Ft = (te & 7) !== (T & 7);
      if (ie === _ && Z === R && re === oe && V === L && ne === le && be === G && ve === Dt) {
        (Ft && ((te = T), Un(T)), lr(z));
        return;
      }
      ((ie = _), (Z = R), (te = T), (re = oe), (V = L), (ne = le), (be = G), ke++);
      const Ne = !Je && Ce === 'human' && Ee > 0;
      if (Ne !== ve) {
        ve = Ne;
        for (const Ve of Be) ((Ve.loadedAnim = null), (Ve.usedMountPack = !1));
      }
      const me = yo(R, Ne),
        Pe = (Ve, We, Mr) => dc(r, Ve, We, oe, Mr, a),
        et = () => {
          g.destroyed ||
            l.destroyed ||
            ((g.texture = Y.WHITE),
            g.anchor.set(0, 0),
            g.pivot.set(8, 24),
            g.scale.set(1),
            (g.width = 16),
            (g.height = 24),
            (g.tint = 13214247),
            (g.alpha = 1),
            (g.visible = !0),
            (c.visible = !1),
            (m.visible = !1),
            tr(),
            xt(!1),
            (X = 24),
            bt(),
            lr(z));
        },
        yt = (Ve) => {
          if (g.destroyed || l.destroyed) return;
          let We = _o(Ve, R, oe, L);
          if ((!We && R === 'run' && (We = _o(Ve, 'walk', oe, L)), !We)) {
            et();
            return;
          }
          (g.anchor.set(0, 0),
            (g.tint = 16777215),
            (c.visible = !0),
            Le(g, Ve.texture, We, le, G, `body:${_}:${R}:${oe}:${L}`, !1),
            (g.visible = !0),
            (m.visible = !1),
            (X = We.height));
          const Mr = le ? -(We.width - We.centerX) : -We.centerX,
            zr = -(We.height + We.centerY);
          ((c.texture = g.texture),
            (c.vertices = Pm(Mr, zr, We.width, We.height)),
            le
              ? c.geometry.uvs.set([1, 0, 0, 0, 1, 1, 0, 1])
              : c.geometry.uvs.set([0, 0, 1, 0, 0, 1, 1, 1]),
            tr(),
            xt(!1),
            bt(),
            lr(z));
        };
      if (Je) {
        const Ve = fc(_);
        if (Ve) {
          yt(Ve);
          return;
        }
        et();
        const We = ke;
        pm(_).then((Mr) => {
          We !== ke || !Mr || g.destroyed || l.destroyed || yt(Mr);
        });
        return;
      }
      let Se = Pe(_, me, L);
      if (
        (!Se && R === 'run' && (Se = Pe(_, yo('walk', Ne), L)),
        !Se &&
          Ce === 'human' &&
          !Ne &&
          (R === 'war-stand' ||
            R === 'attack' ||
            R === 'attack-bow' ||
            R === 'cast' ||
            R === 'die' ||
            fn(R)) &&
          (R !== 'war-stand' && !fn(R) && (Se = Pe(_, 'war-stand', 0)),
          Se || (Se = Pe(_, 'stand', 0))),
        !Se && Ne && Ce === 'human' && (Se = Pe(_, 'mount-stand', 0)),
        !Se &&
          Ce === 'human' &&
          _ !== 400 &&
          ((Se = Pe(400, me, L)),
          !Se && R === 'run' && (Se = Pe(400, yo('walk', Ne), L)),
          !Se && Ne && (Se = Pe(400, 'mount-stand', 0)),
          !Se && !Ne && (Se = Pe(400, R, L)),
          !Se &&
            !Ne &&
            (R === 'war-stand' ||
              R === 'attack' ||
              R === 'attack-bow' ||
              R === 'cast' ||
              R === 'die' ||
              fn(R)) &&
            (R !== 'war-stand' && !fn(R) && (Se = Pe(400, 'war-stand', 0)),
            Se || (Se = Pe(400, 'stand', 0)))),
        !Se)
      )
        return;
      (g.anchor.set(0, 0),
        (g.tint = 16777215),
        (c.visible = !0),
        Le(g, o, Se, le, G, `body:${_}:${R}:${oe}:${L}`, !0),
        (g.visible = !0),
        (m.visible = !fn(R) || (i && Be.some((Ve) => Ve.mode === 'anim'))));
      const ft = Se.width,
        pt = Se.height;
      X = pt;
      const Wr = Ne ? Bm + Sm(Ee) : 0;
      xt(Ne);
      const vt = le ? -(ft - Se.centerX) : -Se.centerX,
        cr = -(pt + Se.centerY) + Wr;
      ((c.texture = g.texture),
        (c.vertices = Pm(vt, cr, ft, pt)),
        le
          ? c.geometry.uvs.set([1, 0, 0, 0, 1, 1, 0, 1])
          : c.geometry.uvs.set([0, 0, 1, 0, 0, 1, 1, 1]),
        Nr());
      for (const Ve of Be) Ve.mode === 'anim' && jt(Ve);
      try {
        for (const Ve of Be) Ve.mode === 'gump' && Es(Ve);
      } catch {}
      (Ft && Un(T), lr(z));
    };
  ((He = () => {
    On({ body: ie, facing: te, action: Z, frame: V, hue: be });
  }),
    On({ body: 400, facing: 4, action: 'stand', label: '' }));
  const Hi = () => {
    const _ = Math.max(24, g.pivot.y || X),
      T = te & 7,
      R = [3, 10, 12, 7, -3, -10, -12, -7][T] ?? 0,
      L = [-5, -2, 3, 7, 5, 2, -3, -7][T] ?? 0;
    return { x: l.x + R, y: l.y - _ * 0.38 + L };
  };
  let un = !1,
    Rr = null;
  const Ja = (_) => {
      un !== _ &&
        ((un = _),
        _
          ? (Rr || ((Rr = new Eb()), Rr.desaturate(), Rr.brightness(0.82, !1)),
            (l.filters = [Rr]),
            (l.alpha = 0.55))
          : ((l.filters = null), (l.alpha = 1)));
    },
    Wi = (_, T = {}) => {
      const R = _.trim();
      R &&
        ((B = R),
        T.type === 10
          ? (I = 16769674)
          : T.hue != null && T.hue > 0
            ? (I = uf(T.hue))
            : (I = 16119285),
        v.paint(R, { fill: I, font: 0, unicode: !0, border: !0 }),
        v.setVisible(!D),
        bt(),
        P && clearTimeout(P),
        (P = setTimeout(() => {
          ((B = ''), v.setVisible(!1), (P = null), bt());
        }, 2800)));
    },
    Hr = [];
  return {
    root: l,
    labels: x,
    syncLabels: ur,
    useHtmlNameplates: kn,
    hudLabel: Xt,
    headLocalY: Ar,
    setPose: On,
    setPlate: Er,
    setFocused: an,
    animarFaiscas: (_) => {
      (f.atualizar(_), p.atualizar(_, l.position.x, l.position.y));
    },
    aimPoint: Hi,
    showOverhead: Wi,
    showDamage: (_) => {
      const T = _ | 0;
      if (T <= 0) return;
      const R = new In({
        text: String(T),
        style: {
          fontFamily: 'Segoe UI, Tahoma, Arial, sans-serif',
          fontSize: 14,
          fontWeight: '700',
          fill: 16729156,
          stroke: { color: 0, width: 3 },
          padding: 6,
        },
        resolution: b,
        roundPixels: !0,
        textureStyle: { scaleMode: 'linear' },
      });
      (R.anchor.set(0.5, 1), (R.eventMode = 'none'));
      const L = -6;
      (R.position.set((Math.random() - 0.5) * 10, L), x.addChild(R));
      const z = performance.now(),
        G = { id: 0 },
        oe = (le) => {
          if (R.destroyed) return;
          const Ce = Math.min(1, (le - z) / 1100);
          if (((R.position.y = L - Ce * 32), (R.alpha = 1 - Ce), Ce >= 1)) {
            R.destroy();
            const Je = Hr.indexOf(G);
            Je >= 0 && Hr.splice(Je, 1);
            return;
          }
          G.id = requestAnimationFrame(oe);
        };
      ((G.id = requestAnimationFrame(oe)), Hr.push(G));
    },
    setEquipment: Ms,
    setHidden: Ja,
    destroy: () => {
      P && clearTimeout(P);
      for (const _ of Hr) cancelAnimationFrame(_.id);
      ((Hr.length = 0),
        ke++,
        _t++,
        ln(),
        f.destroy(),
        p.destroy(),
        x.destroyed || x.destroy({ children: !0 }),
        l.destroy({ children: !0 }));
    },
  };
}
