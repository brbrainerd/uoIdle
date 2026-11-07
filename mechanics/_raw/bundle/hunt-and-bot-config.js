// SOURCE: https://uoidle.com/assets/Jogo-D5xEfvfV.js
// BUNDLE_VERSION: 0.99.0
// BUNDLE_SHA256: 4770a0fcb06e7222f285f6f3b1fdd0da2ea3952a94d0f493a69f527016e73b0d
// AST_SPAN: L31584-L32408
function qm(e) {
  const a = it(e);
  if (!a) return null;
  switch (a.assunto) {
    case 'BOT':
    case 'PLACAR':
    case 'NIVEL':
    case 'MONSTRO':
    case 'HUNTASK':
    case 'FIM':
      return a;
    default:
      return null;
  }
}
function JO(e, a, n) {
  const [s, o] = d.useState(null),
    r = d.useRef(n);
  return (
    (r.current = n),
    d.useEffect(() => {
      if (!a) {
        o(null);
        return;
      }
      return e.subscribeSpeech((i) => {
        var m;
        const c = qm(i);
        if ((c == null ? void 0 : c.assunto) !== 'HUNTASK') return;
        const l = c.dado;
        if (l.fase === 'cancel') {
          o(null);
          return;
        }
        if (l.fase === 'go') {
          const g = l.alvo,
            b = l.euLider;
          (o(null), (m = r.current) == null || m.call(r, g, b));
          return;
        }
        o({ ...l, membros: Array.isArray(l.membros) ? l.membros : [] });
      });
    }, [e, a]),
    s
  );
}
function QO(e, a) {
  const [n, s] = d.useState([]),
    [o, r] = d.useState([]),
    [i, c] = d.useState(''),
    l = d.useRef({ niveis: [], monstros: [] }),
    m = d.useCallback(() => {
      ((l.current = { niveis: [], monstros: [] }), e.say('[huntinfo'));
    }, [e]);
  (d.useEffect(() => {
    if (!a) {
      ((l.current = { niveis: [], monstros: [] }), s([]), r([]), c(''));
      return;
    }
    return e.subscribeSpeech((h) => {
      const u = qm(h);
      if (u)
        switch (u.assunto) {
          case 'NIVEL':
            l.current.niveis.push(u.dado);
            return;
          case 'MONSTRO':
            l.current.monstros.push(u.dado);
            return;
          case 'FIM': {
            if (u.dado.de !== 'caca') return;
            const p = l.current.niveis,
              v = l.current.monstros;
            if (((l.current = { niveis: [], monstros: [] }), p.length === 0 && v.length === 0))
              return;
            (s([...p]), r([...v]), c(u.dado.dungeon ?? ''));
          }
        }
    });
  }, [e, a]),
    d.useEffect(() => {
      a && m();
    }, [a, m]));
  const g = d.useCallback((f) => e.say(`[huntdiff ${f}`), [e]),
    b = n.find((f) => f.actual) ?? null;
  return { niveis: n, monstros: o, dungeon: i, nivelActual: b, pedirInfo: m, escolherNivel: g };
}
const SS = 'uoidle.caca.lootRecusado';
function ZO() {
  try {
    const e = window.localStorage.getItem(SS),
      a = e ? JSON.parse(e) : [];
    return new Set(Array.isArray(a) ? a.filter((n) => typeof n == 'string') : []);
  } catch {
    return new Set();
  }
}
function Oy(e) {
  try {
    window.localStorage.setItem(SS, JSON.stringify([...e]));
  } catch {}
}
const Ry = ['ouro', 'magico', 'instrumento', 'outro'];
function eR(e, a) {
  const [n, s] = d.useState(() => ZO());
  d.useEffect(() => {
    if (!a) return;
    const i = Ry.filter((c) => !n.has(c));
    e.say(i.length === Ry.length ? '[huntloot' : `[huntloot ${i.join(',')}`);
  }, [e, a, n]);
  const o = d.useCallback((i) => {
      s((c) => {
        const l = new Set(c);
        return (l.has(i) ? l.delete(i) : l.add(i), Oy(l), l);
      });
    }, []),
    r = d.useCallback(() => {
      s(() => {
        const i = new Set();
        return (Oy(i), i);
      });
    }, []);
  return { recusados: n, alternar: o, aceitarTudo: r };
}
const tR = 3823;
function aR(e, a) {
  const [n, s] = d.useState(null);
  return (
    d.useEffect(() => {
      if (!a) {
        s(null);
        return;
      }
      return e.subscribeSpeech((o) => {
        const r = qm(o);
        (r == null ? void 0 : r.assunto) === 'PLACAR' && s({ ...r.dado, recebidoEm: Date.now() });
      });
    }, [e, a]),
    n
  );
}
function us(e) {
  const a = Math.abs(e),
    n = (s, o) => `${s.toLocaleString(void 0, { maximumFractionDigits: 1 })}${o}`;
  return a >= 1e6 ? n(e / 1e6, 'M') : a >= 1e3 ? n(e / 1e3, 'k') : Math.round(e).toLocaleString();
}
function $y(e) {
  const a = Math.max(0, Math.floor(e)),
    n = Math.floor(a / 3600),
    s = Math.floor((a % 3600) / 60),
    o = a % 60,
    r = (i) => String(i).padStart(2, '0');
  return n > 0 ? `${n}h ${r(s)}m` : s > 0 ? `${s}m ${r(o)}s` : `${o}s`;
}
const Au = 30;
function _y({ fontes: e, total: a, baseLabel: n }) {
  return e.length === 0
    ? null
    : t.jsx('ul', {
        children: e.map((s) => {
          const o = a > 0 ? Math.round((s.d / a) * 100) : 0,
            r = s.id === 'base' ? n : s.n || s.id;
          return t.jsxs(
            'li',
            {
              children: [
                t.jsx('span', { className: 'hunt-placar-danos-nome', title: r, children: r }),
                t.jsx('span', {
                  className: 'hunt-placar-danos-bar',
                  'aria-hidden': !0,
                  children: t.jsx('i', { style: { width: `${o}%` } }),
                }),
                t.jsxs('strong', {
                  children: [us(s.d), o > 0 ? t.jsxs('em', { children: [o, '%'] }) : null],
                }),
              ],
            },
            s.id
          );
        }),
      });
}
function nR({ placar: e, onReset: a, onClose: n, onActivate: s, style: o }) {
  const { t: r } = Se(),
    [i, c] = d.useState(() => Date.now()),
    [l, m] = d.useState(() => co()),
    [g, b] = d.useState('causado');
  d.useEffect(() => {
    if (l) return;
    let D = !0;
    return (
      Ka().then((q) => {
        D && m(q);
      }),
      () => {
        D = !1;
      }
    );
  }, [l]);
  const f = !!e && !e.fim;
  d.useEffect(() => {
    if (!f) return;
    const D = window.setInterval(() => c(Date.now()), 1e3);
    return () => window.clearInterval(D);
  }, [f]);
  const h = e ? (e.fim ? e.segundos : e.segundos + Math.max(0, (i - e.recebidoEm) / 1e3)) : 0,
    u = h / 3600,
    p = (e == null ? void 0 : e.xp) ?? 0,
    v = (e == null ? void 0 : e.ouro) ?? 0,
    x = (D) => (h >= Au ? us(D / u) : '—'),
    y = Math.max(
      0,
      ((e == null ? void 0 : e.xpNeed) ?? 0) - ((e == null ? void 0 : e.xpHave) ?? 0)
    ),
    j = h >= Au && u > 0 ? p / u : 0,
    w = y > 0 && j > 0 ? $y((y / j) * 3600) : '—',
    C = (e == null ? void 0 : e.dano) ?? 0,
    S = (e == null ? void 0 : e.danoRecebido) ?? 0,
    A = (e == null ? void 0 : e.danos) ?? [],
    I = (e == null ? void 0 : e.danosRecebidos) ?? [],
    k = A.length > 0 || C > 0,
    P = I.length > 0 || S > 0,
    E = k || P,
    U =
      (e == null ? void 0 : e.dps) != null && e.dps > 0
        ? us(e.dps)
        : h >= Au && C > 0
          ? us(C / Math.max(h, 1))
          : '—',
    N =
      (e == null ? void 0 : e.dpsRecebido) != null && e.dpsRecebido > 0
        ? us(e.dpsRecebido)
        : h >= Au && S > 0
          ? us(S / Math.max(h, 1))
          : '—',
    M = t.jsx('span', {
      className: 'hunt-placar-icone',
      children: t.jsx(Og, { pack: l, graphic: tR, alt: '' }),
    }),
    T = t.jsx('span', { className: 'hunt-placar-icone hunt-placar-xp', children: 'XP' });
  return t.jsx(dt, {
    className: `hunt-sessao${e != null && e.fim ? ' is-fim' : ''}`,
    title: r(e != null && e.fim ? 'hunt.sessionLast' : 'hunt.session'),
    label: r('hunt.session'),
    draggable: !0,
    onClose: n,
    onActivate: s,
    style: o,
    children: t.jsxs('div', {
      className: 'hunt-analisador no-gump-drag',
      'data-segundos': Math.floor(h),
      'data-xp': p,
      'data-ouro': v,
      children: [
        t.jsxs('div', {
          className: 'hunt-analisador-topo',
          children: [
            t.jsxs('span', { className: 'hunt-analisador-xp', children: ['XP ', x(p), '/h'] }),
            t.jsxs('span', { className: 'hunt-analisador-gp', children: [x(v), ' gp/h'] }),
          ],
        }),
        t.jsxs('dl', {
          className: 'hunt-analisador-lista',
          children: [
            t.jsxs('div', {
              children: [
                t.jsx('dt', { children: r('hunt.sessionTime') }),
                t.jsx('dd', { children: $y(h) }),
              ],
            }),
            t.jsxs('div', {
              children: [
                t.jsx('dt', { children: r('hunt.sessionXp') }),
                t.jsxs('dd', { children: [T, us(p)] }),
              ],
            }),
            t.jsxs('div', {
              children: [
                t.jsx('dt', { children: r('hunt.sessionGold') }),
                t.jsxs('dd', { children: [M, us(v)] }),
              ],
            }),
            t.jsxs('div', {
              children: [
                t.jsx('dt', { children: r('hunt.sessionXpHour') }),
                t.jsx('dd', { children: x(p) }),
              ],
            }),
            t.jsxs('div', {
              children: [
                t.jsx('dt', { children: r('hunt.sessionGoldHour') }),
                t.jsx('dd', { children: x(v) }),
              ],
            }),
            t.jsxs('div', {
              children: [
                t.jsx('dt', { children: r('hunt.sessionToLevel') }),
                t.jsx('dd', { children: w }),
              ],
            }),
            (e == null ? void 0 : e.energia) != null
              ? t.jsxs('div', {
                  children: [
                    t.jsx('dt', { children: r('hunt.sessionEnergy') }),
                    t.jsx('dd', { children: e.energia }),
                  ],
                })
              : null,
            k
              ? t.jsxs(t.Fragment, {
                  children: [
                    t.jsxs('div', {
                      children: [
                        t.jsx('dt', { children: r('hunt.sessionDamageDealt') }),
                        t.jsx('dd', { children: us(C) }),
                      ],
                    }),
                    t.jsxs('div', {
                      children: [
                        t.jsx('dt', { children: r('hunt.sessionDps') }),
                        t.jsx('dd', { children: U }),
                      ],
                    }),
                  ],
                })
              : null,
            P
              ? t.jsxs(t.Fragment, {
                  children: [
                    t.jsxs('div', {
                      children: [
                        t.jsx('dt', { children: r('hunt.sessionDamageTaken') }),
                        t.jsx('dd', { children: us(S) }),
                      ],
                    }),
                    t.jsxs('div', {
                      children: [
                        t.jsx('dt', { children: r('hunt.sessionDpsTaken') }),
                        t.jsx('dd', { children: N }),
                      ],
                    }),
                  ],
                })
              : null,
          ],
        }),
        E
          ? t.jsxs('div', {
              className: 'hunt-placar-danos',
              children: [
                t.jsxs('div', {
                  className: 'hunt-placar-danos-abas',
                  role: 'tablist',
                  children: [
                    t.jsx('button', {
                      type: 'button',
                      role: 'tab',
                      'aria-selected': g === 'causado',
                      className: `chrome-btn${g === 'causado' ? ' chrome-btn-active' : ''}`,
                      onClick: () => b('causado'),
                      children: r('hunt.sessionDamageDealtTab'),
                    }),
                    t.jsx('button', {
                      type: 'button',
                      role: 'tab',
                      'aria-selected': g === 'recebido',
                      className: `chrome-btn${g === 'recebido' ? ' chrome-btn-active' : ''}`,
                      onClick: () => b('recebido'),
                      children: r('hunt.sessionDamageTakenTab'),
                    }),
                  ],
                }),
                g === 'causado'
                  ? k
                    ? t.jsxs(t.Fragment, {
                        children: [
                          t.jsxs('div', {
                            className: 'hunt-placar-danos-total',
                            children: [
                              t.jsx('span', { children: r('hunt.sessionDamageTotal') }),
                              t.jsx('strong', { children: us(C) }),
                            ],
                          }),
                          A.length > 0
                            ? t.jsx(_y, {
                                fontes: A,
                                total: C,
                                baseLabel: r('hunt.sessionDamageBase'),
                              })
                            : t.jsx('p', {
                                className: 'hunt-hint',
                                children: r('hunt.sessionDamageEmpty'),
                              }),
                        ],
                      })
                    : t.jsx('p', { className: 'hunt-hint', children: r('hunt.sessionDamageEmpty') })
                  : P
                    ? t.jsxs(t.Fragment, {
                        children: [
                          t.jsxs('div', {
                            className: 'hunt-placar-danos-total',
                            children: [
                              t.jsx('span', { children: r('hunt.sessionDamageTotal') }),
                              t.jsx('strong', { children: us(S) }),
                            ],
                          }),
                          I.length > 0
                            ? t.jsx(_y, {
                                fontes: I,
                                total: S,
                                baseLabel: r('hunt.sessionDamageBase'),
                              })
                            : t.jsx('p', {
                                className: 'hunt-hint',
                                children: r('hunt.sessionDamageTakenEmpty'),
                              }),
                        ],
                      })
                    : t.jsx('p', {
                        className: 'hunt-hint',
                        children: r('hunt.sessionDamageTakenEmpty'),
                      }),
              ],
            })
          : null,
        a
          ? t.jsx('button', {
              type: 'button',
              className: 'chrome-btn hunt-analisador-reset',
              onClick: a,
              children: r('hunt.sessionReset'),
            })
          : null,
      ],
    }),
  });
}
const sR = ['ranger', 'mage', 'necromancer', 'mystic', 'spellweaver', 'bard'],
  oR = ['warrior', 'paladin', 'samurai', 'monk', 'berserker'];
function rR(e) {
  return !!e && sR.includes(e);
}
function kS(e) {
  return !!e && oR.includes(e);
}
const CS = ['proximo', 'menorVida', 'maiorVida', 'menorPct', 'maiorPct'],
  MS = ['agressivo', 'equilibrado', 'defensivo'],
  Jl = 16,
  Kh = 8,
  Yh = {
    seguirSerial: 0,
    sairSeAliadoMorrer: !1,
    sairSeLiderMorrer: !0,
    sairSeSemPot: !1,
    sairSeSemBandagem: !1,
    sairSeSemReags: !1,
    sairSeSemAmmo: !1,
    sairSePesado: !1,
    sairSeAlguemSair: !0,
    aceitarTudoDoLider: !0,
  };
function Xh(e, a, n) {
  try {
    const s = window.localStorage.getItem(e);
    return a(s) ? s : n;
  } catch {
    return n;
  }
}
function Eu(e, a) {
  try {
    window.localStorage.setItem(e, a);
  } catch {}
}
function iR() {
  try {
    const e = window.localStorage.getItem('uoidle.caca.idlebot');
    if (!e) return { ...Yh };
    const a = JSON.parse(e);
    return {
      seguirSerial: typeof a.seguirSerial == 'number' ? a.seguirSerial : Yh.seguirSerial,
      sairSeAliadoMorrer: !!a.sairSeAliadoMorrer,
      sairSeLiderMorrer: a.sairSeLiderMorrer !== !1,
      sairSeSemPot: !!a.sairSeSemPot,
      sairSeSemBandagem: !!a.sairSeSemBandagem,
      sairSeSemReags: !!a.sairSeSemReags,
      sairSeSemAmmo: !!a.sairSeSemAmmo,
      sairSePesado: !!a.sairSePesado,
      sairSeAlguemSair: a.sairSeAlguemSair !== !1,
      aceitarTudoDoLider: a.aceitarTudoDoLider !== !1,
    };
  } catch {
    return { ...Yh };
  }
}
const lR = (e) => typeof e == 'string' && CS.includes(e),
  cR = (e) => typeof e == 'string' && MS.includes(e),
  uR = (e) => typeof e == 'string' && /^\d+$/.test(e) && +e >= 1 && +e <= Jl;
function dR(e, a, n, s) {
  const [o, r] = d.useState(() => Xh('uoidle.caca.alvo', lR, 'proximo')),
    [i, c] = d.useState(() => Xh('uoidle.caca.postura', cR, 'equilibrado')),
    [l, m] = d.useState(() => +Xh('uoidle.caca.distancia', uR, String(Jl))),
    [g, b] = d.useState(null),
    [f, h] = d.useState(() => iR()),
    u = d.useRef(null);
  d.useEffect(() => {
    if (!n || !s) return;
    const A = `${s}:${n}`;
    u.current !== A &&
      ((u.current = A),
      h((I) => {
        let k = I;
        return (kS(n) && k.seguirSerial === 0 && (k = { ...k, seguirSerial: -1 }), k);
      }));
  }, [n, s]);
  const p = n === 'mage' || n === 'necromancer' || n === 'mystic' || n === 'spellweaver',
    v =
      g != null && g.distante
        ? Math.max(1, Math.min(p ? Kh : Jl, g.alcance || (p ? Kh : Jl)))
        : p
          ? Kh
          : Jl,
    x = Math.min(l, v);
  (d.useEffect(() => {
    a && Rh && e.say(`[huntalvo ${o}`);
  }, [e, a, o]),
    d.useEffect(() => {
      a && Rh && e.say(`[huntpostura ${i}`);
    }, [e, a, i]),
    d.useEffect(() => {
      a && Rh && e.say(`[huntdist ${x}`);
    }, [e, a, x]),
    d.useEffect(() => {
      a && (Eu('uoidle.caca.idlebot', JSON.stringify(f)), e.say(`[IdleBot ${JSON.stringify(f)}`));
    }, [e, a, f]),
    d.useEffect(() => {
      if (!a) {
        b(null);
        return;
      }
      return (
        e.say('[huntbot'),
        e.subscribeSpeech((A) => {
          const I = qm(A);
          (I == null ? void 0 : I.assunto) === 'BOT' && b(I.dado);
        })
      );
    }, [e, a]));
  const y = d.useCallback((A) => {
      (r(A), Eu('uoidle.caca.alvo', A));
    }, []),
    j = d.useCallback((A) => {
      (c(A), Eu('uoidle.caca.postura', A));
    }, []),
    w = d.useCallback(
      (A) => {
        const I = Math.min(v, Math.max(1, Math.round(A)));
        (m(I), Eu('uoidle.caca.distancia', String(I)));
      },
      [v]
    ),
    C = d.useCallback((A, I) => {
      h((k) => ({ ...k, [A]: I }));
    }, []),
    S = d.useCallback(() => e.say('[huntbot'), [e]);
  return {
    alvo: o,
    escolherAlvo: y,
    postura: i,
    escolherPostura: j,
    distancia: x,
    escolherDistancia: w,
    teto: v,
    arma: g,
    pedirEstado: S,
    flags: f,
    setFlag: C,
  };
}
const mR = [
    'warrior',
    'ranger',
    'berserker',
    'duelist',
    'paladin',
    'assassin',
    'ninja',
    'monk',
    'samurai',
    'bard',
    'tamer',
  ],
  hR = ['mage', 'necromancer'],
  fR = ['ranger'];
function Jh({ title: e, children: a }) {
  return t.jsxs('section', {
    className: 'bot-card',
    children: [
      t.jsx('div', {
        className: 'bot-card-head',
        children: t.jsx('span', { className: 'bot-card-title', children: e }),
      }),
      t.jsx('div', { className: 'bot-card-body', children: a }),
    ],
  });
}
const pR = [
  { key: 'sairSeAliadoMorrer', label: 'bot.exitAllyDeath', hint: 'bot.exitAllyDeathHint' },
  { key: 'sairSeLiderMorrer', label: 'bot.exitLeaderDeath', hint: 'bot.exitLeaderDeathHint' },
  { key: 'sairSeAlguemSair', label: 'bot.exitAllyLeave', hint: 'bot.exitAllyLeaveHint' },
  { key: 'sairSeSemPot', label: 'bot.exitNoPot', hint: 'bot.exitNoPotHint' },
  { key: 'sairSeSemBandagem', label: 'bot.exitNoBand', hint: 'bot.exitNoBandHint', classes: mR },
  { key: 'sairSeSemReags', label: 'bot.exitNoReags', hint: 'bot.exitNoReagsHint', classes: hR },
  { key: 'sairSeSemAmmo', label: 'bot.exitNoAmmo', hint: 'bot.exitNoAmmoHint', classes: fR },
  { key: 'sairSePesado', label: 'bot.exitHeavy', hint: 'bot.exitHeavyHint' },
];
function gR({
  open: e,
  bot: a,
  idleClass: n = null,
  partyMembers: s = [],
  onClose: o,
  onActivate: r,
  style: i,
}) {
  const { t: c } = Se(),
    { pedirEstado: l } = a,
    m = rR(n),
    g = kS(n),
    b = s.length > 0,
    f = pR.filter((v) => !v.classes || (!!n && v.classes.includes(n)));
  if (
    (d.useEffect(() => {
      e && l();
    }, [e, l]),
    !e)
  )
    return null;
  const h = a.arma,
    { flags: u } = a,
    p = m || !!(h != null && h.distante);
  return t.jsx(dt, {
    className: 'bot-gump',
    title: c('bot.title'),
    label: c('bot.title'),
    onClose: o,
    onActivate: r,
    draggable: !0,
    style: i,
    children: t.jsxs('div', {
      className: 'bot-body no-gump-drag',
      children: [
        t.jsxs(Jh, {
          title: c('bot.combat'),
          children: [
            t.jsx('label', {
              className: 'hunt-secao-titulo',
              htmlFor: 'bot-alvo',
              children: t.jsx('span', { children: c('hunt.strategy') }),
            }),
            t.jsx('select', {
              id: 'bot-alvo',
              className: 'hunt-estrategia-escolha',
              value: a.alvo,
              onChange: (v) => a.escolherAlvo(v.target.value),
              children: CS.map((v) =>
                t.jsx('option', { value: v, children: c(`hunt.strategyOption.${v}`) }, v)
              ),
            }),
            t.jsx('h3', {
              className: 'hunt-secao-titulo',
              children: t.jsx('span', { children: c('bot.attack') }),
            }),
            t.jsx('div', {
              className: 'bot-posturas',
              role: 'radiogroup',
              'aria-label': c('bot.attack'),
              children: MS.map((v) =>
                t.jsx(
                  'button',
                  {
                    type: 'button',
                    role: 'radio',
                    'aria-checked': a.postura === v,
                    className: `chrome-btn bot-postura${a.postura === v ? ' chrome-btn-active' : ''}`,
                    'data-postura': v,
                    onClick: () => a.escolherPostura(v),
                    children: c(`bot.attackOption.${v}`),
                  },
                  v
                )
              ),
            }),
            t.jsx('p', { className: 'bot-dica', children: c(`bot.attackHint.${a.postura}`) }),
            n == null || m
              ? t.jsxs(t.Fragment, {
                  children: [
                    t.jsx('h3', {
                      className: 'hunt-secao-titulo',
                      children: t.jsx('span', { children: c('bot.distance') }),
                    }),
                    t.jsxs('div', {
                      className: 'bot-distancia',
                      children: [
                        t.jsx('button', {
                          type: 'button',
                          className: 'chrome-btn bot-distancia-menos',
                          'aria-label': c('bot.closer'),
                          disabled: a.distancia <= 1 || !p,
                          onClick: () => a.escolherDistancia(a.distancia - 1),
                          children: '−',
                        }),
                        t.jsx('span', {
                          className: 'bot-distancia-valor',
                          'data-distancia': a.distancia,
                          children: a.distancia,
                        }),
                        t.jsx('button', {
                          type: 'button',
                          className: 'chrome-btn bot-distancia-mais',
                          'aria-label': c('bot.farther'),
                          disabled: a.distancia >= a.teto || !p,
                          onClick: () => a.escolherDistancia(a.distancia + 1),
                          children: '+',
                        }),
                        t.jsx('span', {
                          className: 'bot-distancia-unidade',
                          children: c('bot.tiles'),
                        }),
                      ],
                    }),
                    t.jsx('p', {
                      className: 'bot-dica bot-dica-arma',
                      children: h
                        ? p
                          ? c('bot.distanceRanged', {
                              alcance: h.alcance || a.teto,
                              usa: h.usa || a.distancia,
                            })
                          : c('bot.distanceMelee')
                        : '—',
                    }),
                  ],
                })
              : null,
          ],
        }),
        b
          ? t.jsxs(Jh, {
              title: c('bot.followAlly'),
              children: [
                t.jsxs('select', {
                  id: 'bot-seguir',
                  className: 'hunt-estrategia-escolha',
                  value: u.seguirSerial,
                  onChange: (v) => a.setFlag('seguirSerial', Number(v.target.value)),
                  title: c('bot.followAllyHint'),
                  children: [
                    t.jsx('option', { value: -1, children: c('bot.followNone') }),
                    t.jsx('option', { value: 0, children: c('bot.followLeader') }),
                    s.map((v) => t.jsx('option', { value: v.serial, children: v.name }, v.serial)),
                  ],
                }),
                t.jsx('p', {
                  className: 'bot-dica',
                  children: c(g ? 'bot.followNoneTankHint' : 'bot.followAllyHint'),
                }),
                t.jsxs('label', {
                  className: 'bot-flag',
                  title: c('bot.acceptAllLeaderHint'),
                  children: [
                    t.jsx('input', {
                      type: 'checkbox',
                      checked: !!u.aceitarTudoDoLider,
                      onChange: (v) => a.setFlag('aceitarTudoDoLider', v.target.checked),
                    }),
                    t.jsxs('span', {
                      children: [
                        c('bot.acceptAllLeader'),
                        t.jsx('abbr', {
                          className: 'bot-flag-help',
                          title: c('bot.acceptAllLeaderHint'),
                          children: '?',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          : null,
        t.jsx(Jh, {
          title: c('bot.exitRules'),
          children: f.map((v) =>
            t.jsxs(
              'label',
              {
                className: 'bot-flag',
                title: c(v.hint),
                children: [
                  t.jsx('input', {
                    type: 'checkbox',
                    checked: !!u[v.key],
                    onChange: (x) => a.setFlag(v.key, x.target.checked),
                  }),
                  t.jsxs('span', {
                    children: [
                      c(v.label),
                      t.jsx('abbr', {
                        className: 'bot-flag-help',
                        title: c(v.hint),
                        children: '?',
                      }),
                    ],
                  }),
                ],
              },
              v.key
            )
          ),
        }),
      ],
    }),
  });
}
