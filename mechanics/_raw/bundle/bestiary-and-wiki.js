// SOURCE: https://uoidle.com/assets/Jogo-D5xEfvfV.js
// BUNDLE_VERSION: 0.99.0
// BUNDLE_SHA256: 4770a0fcb06e7222f285f6f3b1fdd0da2ea3952a94d0f493a69f527016e73b0d
// AST_SPAN: L29306-L30106, L55132-L55425
function kO(e, a, n) {
  const [s, o] = d.useState([]),
    [r, i] = d.useState(!1),
    [c, l] = d.useState(!1),
    m = d.useRef([]),
    [g, b] = d.useState(null),
    f = d.useRef(new Map()),
    [h, u] = d.useState(0),
    p = d.useRef(null),
    [v, x] = d.useState(0),
    y = d.useRef(n);
  y.current = n;
  const j = d.useCallback(() => e.say('[bestiario'), [e]);
  (d.useEffect(() => {
    if (!a) {
      ((m.current = []), o([]), i(!1), f.current.clear(), u((A) => A + 1), (p.current = null));
      return;
    }
    return e.subscribeSpeech((A) => {
      const I = it(A);
      if (!I) return;
      const k = I.dado;
      if (I.assunto === 'BESTAINFO') {
        const P = SO(k),
          E = String(k.dificuldade ?? 'medio') || 'medio',
          U = Cu(P.id, P.paragon, E);
        (f.current.set(U, P), u((N) => N + 1), p.current === U && (b(P), (p.current = null)));
        return;
      }
      I.assunto === 'BESTA'
        ? m.current.push({
            id: String(k.id ?? ''),
            nome: String(k.nome ?? ''),
            linhagem: String(k.linhagem ?? ''),
            grau: Number(k.grau) || 0,
            corpo: Number(k.corpo) || 0,
            mortes: Number(k.mortes) || 0,
            mortesParagon: Number(k.paragon) || 0,
            conta: Number(k.conta) || 0,
            nivel: Number(k.nivel) || 0,
            ant: Number(k.ant) || 0,
            prox: Number(k.prox) || 0,
          })
        : I.assunto === 'FIM' && k.de === 'bestiario'
          ? (o(m.current), (m.current = []), l(!!k.indisponivel), x(Number(k.bonus) || 0), i(!0))
          : I.assunto === 'BESTANIVEL' && y.current && e.say('[bestiario');
    });
  }, [e, a]),
    d.useEffect(() => {
      a && n && j();
    }, [a, n, j]));
  const w = d.useCallback(
      (A, I = !1, k = 'medio') => {
        const P = Cu(A, I, k);
        ((p.current = P), b(f.current.get(P) ?? null));
        const E = k && k !== 'medio' ? ` ${k}` : '';
        e.say(`[bestiariobicho ${A}${I ? ' paragon' : ''}${E}`);
      },
      [e]
    ),
    C = d.useCallback((A, I = !1, k = 'medio') => f.current.get(Cu(A, I, k)) ?? null, [h]),
    S = d.useCallback(
      (A, I = !1, k = 'medio') => {
        if (!A) return;
        const P = Cu(A, I, k);
        if (f.current.has(P)) return;
        const E = k ? ` ${k}` : '';
        e.say(`[bestiariobicho ${A}${I ? ' paragon' : ''}${E}`);
      },
      [e]
    );
  return {
    bestas: s,
    carregado: r,
    indisponivel: c,
    bonus: v,
    atualizar: j,
    ficha: g,
    obterFicha: C,
    pedirFicha: S,
    abrir: w,
    fechar: d.useCallback(() => {
      ((p.current = null), b(null));
    }, []),
  };
}
const CO = ['fisico', 'fogo', 'frio', 'veneno', 'energia'],
  MO = {
    ParalyzingBlow: 'paralyzingBlow',
    DoubleStrike: 'doubleStrike',
    CrushingBlow: 'crushingBlow',
    MortalStrike: 'mortalStrike',
    BleedAttack: 'bleedAttack',
    ArmorIgnore: 'armorIgnore',
    ConcussionBlow: 'concussionBlow',
    Disarm: 'disarm',
    Dismount: 'dismount',
    WhirlwindAttack: 'whirlwindAttack',
  };
function bS({
  mobId: e,
  nivelId: a = null,
  obterFicha: n,
  pedirFicha: s,
  children: o,
  className: r,
  style: i,
  as: c = 'div',
  'data-monstro': l,
}) {
  const { t: m, i18n: g } = Se(),
    b = d.useId(),
    [f, h] = d.useState(!1),
    [u, p] = d.useState({ x: 0, y: 0 }),
    v = a || 'medio',
    x = n(e, !1, v),
    y = c,
    j = (N) => N.toLocaleString(g.language),
    w = (N, M) => (N === M ? j(N) : `${j(N)}–${j(M)}`),
    C = d.useCallback((N, M) => {
      let F = N + 14,
        B = M + 14;
      (F + 300 > window.innerWidth - 8 && (F = N - 300 - 8),
        B + 360 > window.innerHeight - 8 && (B = M - 360 - 8),
        p({ x: Math.max(8, F), y: Math.max(8, B) }));
    }, []),
    S = d.useCallback(
      (N) => {
        C(N.clientX, N.clientY);
      },
      [C]
    ),
    A = d.useCallback(
      (N) => {
        const M = N.getBoundingClientRect();
        C(M.right, M.top);
      },
      [C]
    ),
    I = !!e,
    k = [];
  if (
    x &&
    (x.magia > 0 && k.push(m(x.necro ? 'wiki.sheet.necro' : 'wiki.sheet.magic', { n: x.magia })),
    x.poison && k.push(m('wiki.sheet.poison', { nivel: x.poison })),
    x.sopro > 0 &&
      k.push(m(x.soproFrio ? 'wiki.sheet.coldBreath' : 'wiki.sheet.fireBreath', { n: x.sopro })),
    x.golpe)
  ) {
    const N = MO[x.golpe];
    k.push(m('wiki.sheet.strike', { nome: N ? m(`wiki.strike.${N}`) : x.golpe }));
  }
  const P = x && a ? x.ouro.find((N) => N.nivel === a) : void 0,
    E = P != null && P.xp && P.xp > 0 ? P.xp : x == null ? void 0 : x.xp,
    U = x
      ? [
          ['fisico', x.danoFisico ?? 100],
          ['fogo', x.danoFogo ?? 0],
          ['frio', x.danoFrio ?? 0],
          ['veneno', x.danoVeneno ?? 0],
          ['energia', x.danoEnergia ?? 0],
        ].filter(([, N]) => N > 0)
      : [];
  return t.jsxs(y, {
    className: ['hunt-mob-tip-anchor', r].filter(Boolean).join(' '),
    style: i,
    'data-monstro': l,
    'aria-describedby': f && I ? b : void 0,
    onPointerEnter: (N) => {
      I && (s(e, !1, v), S(N), h(!0));
    },
    onPointerMove: (N) => {
      if (!I) {
        f && h(!1);
        return;
      }
      (S(N), f || h(!0));
    },
    onPointerLeave: () => h(!1),
    onFocus: (N) => {
      I && (s(e, !1, v), A(N.currentTarget), h(!0));
    },
    onBlur: () => h(!1),
    children: [
      o,
      f && I
        ? $o.createPortal(
            t.jsx('div', {
              id: b,
              className: 'hunt-mob-tip',
              role: 'tooltip',
              style: { left: u.x, top: u.y },
              children: x
                ? t.jsxs(t.Fragment, {
                    children: [
                      t.jsxs('header', {
                        className: 'hunt-mob-tip-head',
                        children: [
                          t.jsx('strong', { children: x.nome }),
                          x.grau > 0
                            ? t.jsx('span', {
                                className: 'hunt-mob-tip-grau',
                                children: m(`wiki.grade.${x.grau}`),
                              })
                            : null,
                        ],
                      }),
                      t.jsxs('dl', {
                        className: 'hunt-mob-tip-lista',
                        children: [
                          t.jsx('dt', { children: m('wiki.sheet.hp') }),
                          t.jsx('dd', { children: w(x.vidaMin, x.vidaMax) }),
                          t.jsx('dt', { children: m('wiki.sheet.xp') }),
                          t.jsxs('dd', {
                            children: [
                              E != null ? j(E) : '—',
                              P != null && P.xp && P.xp !== x.xp
                                ? t.jsxs('small', {
                                    className: 'hunt-mob-tip-nota',
                                    children: [' ', '(', P.nome, ')'],
                                  })
                                : null,
                            ],
                          }),
                          x.nivelRec
                            ? t.jsxs(t.Fragment, {
                                children: [
                                  t.jsx('dt', { children: m('wiki.sheet.recLevel') }),
                                  t.jsx('dd', {
                                    'data-nivel-recomendado': x.nivelRec,
                                    children: gS(x.nivelRec),
                                  }),
                                ],
                              })
                            : null,
                          t.jsx('dt', { children: m('wiki.sheet.damage') }),
                          t.jsx('dd', { children: w(x.danoMin, x.danoMax) }),
                          t.jsx('dt', { children: m('wiki.sheet.str') }),
                          t.jsx('dd', { children: j(x.forca) }),
                          t.jsx('dt', { children: m('wiki.sheet.dex') }),
                          t.jsx('dd', { children: j(x.destreza) }),
                          t.jsx('dt', { children: m('wiki.sheet.int') }),
                          t.jsx('dd', { children: j(x.inteligencia) }),
                        ],
                      }),
                      U.length > 0
                        ? t.jsxs('section', {
                            className: 'hunt-mob-tip-bloco',
                            children: [
                              t.jsx('h4', { children: m('wiki.sheet.damageTypes') }),
                              t.jsx('ul', {
                                className: 'hunt-mob-tip-barras',
                                children: U.map(([N, M]) =>
                                  t.jsxs(
                                    'li',
                                    {
                                      'data-resistencia': N,
                                      children: [
                                        t.jsx('span', { children: m(`wiki.resist.${N}`) }),
                                        t.jsx('span', {
                                          className: 'besta-barra',
                                          children: t.jsx('span', {
                                            className: `besta-barra-cheia besta-res-${N}`,
                                            style: { width: `${Math.min(100, M)}%` },
                                          }),
                                        }),
                                        t.jsxs('span', { children: [M, '%'] }),
                                      ],
                                    },
                                    N
                                  )
                                ),
                              }),
                            ],
                          })
                        : null,
                      t.jsxs('section', {
                        className: 'hunt-mob-tip-bloco',
                        children: [
                          t.jsx('h4', { children: m('wiki.sheet.resists') }),
                          t.jsx('ul', {
                            className: 'hunt-mob-tip-barras',
                            children: CO.map((N) =>
                              t.jsxs(
                                'li',
                                {
                                  'data-resistencia': N,
                                  children: [
                                    t.jsx('span', { children: m(`wiki.resist.${N}`) }),
                                    t.jsx('span', {
                                      className: 'besta-barra',
                                      children: t.jsx('span', {
                                        className: `besta-barra-cheia besta-res-${N}`,
                                        style: { width: `${Math.max(0, Math.min(100, x[N]))}%` },
                                      }),
                                    }),
                                    t.jsxs('span', { children: [x[N], '%'] }),
                                  ],
                                },
                                N
                              )
                            ),
                          }),
                        ],
                      }),
                      k.length > 0
                        ? t.jsxs('section', {
                            className: 'hunt-mob-tip-bloco',
                            children: [
                              t.jsx('h4', { children: m('wiki.sheet.specials') }),
                              t.jsx('ul', {
                                className: 'hunt-mob-tip-especiais',
                                children: k.map((N) => t.jsx('li', { children: N }, N)),
                              }),
                            ],
                          })
                        : null,
                    ],
                  })
                : t.jsx('p', { className: 'hunt-mob-tip-loading', children: m('wiki.loading') }),
            }),
            document.body
          )
        : null,
    ],
  });
}
const xS = 'uoidle.hunt.favs';
function wy(e, a) {
  const n = a.dungeon ?? '';
  return a.dungeonId ? e(`hunt.dgs.${a.dungeonId}`, { defaultValue: n || a.dungeonId }) : n;
}
function AO() {
  try {
    const e = localStorage.getItem(xS),
      a = e ? JSON.parse(e) : [];
    return new Set(a);
  } catch {
    return new Set();
  }
}
function vS({ membros: e, chamados: a, limite: n, podeEscolher: s, onConvidar: o }) {
  const { t: r } = Se(),
    i = Math.max(n ?? 0, e.length + a.length, 2);
  return t.jsxs('div', {
    className: 'hunt-lobby-party',
    children: [
      t.jsx('span', { className: 'hunt-lobby-party-rotulo', children: r('hunt.lobby.party') }),
      t.jsx('div', {
        className: 'hunt-lobby-slots',
        children: Array.from({ length: i }, (c, l) => {
          const m = e[l],
            g = m ? null : a[l - e.length];
          return m
            ? t.jsxs(
                'div',
                {
                  className: `hunt-lobby-slot is-filled${m.lider ? ' is-lead' : ''}`,
                  children: [
                    t.jsx('strong', { children: m.n }),
                    t.jsxs('small', { children: [Dc(m.cls) ?? '—', m.lv ? ` · ${m.lv}` : ''] }),
                  ],
                },
                m.s
              )
            : g
              ? t.jsxs(
                  'div',
                  {
                    className: 'hunt-lobby-slot is-wait',
                    children: [
                      t.jsx('strong', { children: g.n }),
                      t.jsx('small', { children: r('party.waiting') }),
                    ],
                  },
                  `c${g.n}`
                )
              : t.jsx(
                  'button',
                  {
                    type: 'button',
                    className: 'hunt-lobby-slot is-empty',
                    disabled: !s,
                    onClick: () => s && o(),
                    children: '+',
                  },
                  `e${l}`
                );
        }),
      }),
    ],
  });
}
const EO = ['livre', 'rodizio', 'dano', 'lider', 'sorteio'];
function IO({
  comuns: e,
  niveis: a,
  target: n,
  onTarget: s,
  podeEscolher: o,
  membros: r,
  chamados: i,
  limite: c,
  onConvidar: l,
  esconderGrupo: m = !1,
  onModo: g,
  lfgLista: b = [],
  lfgCarregado: f = !1,
  onLfgEntrar: h,
  onLfgRefresh: u,
  meuSerial: p = 0,
  pedidosEnviados: v,
  nivelId: x = null,
  obterFicha: y,
  pedirFicha: j,
}) {
  const { t: w } = Se(),
    [C, S] = d.useState('lista'),
    [A, I] = d.useState(''),
    [k, P] = d.useState(!1),
    [E, U] = d.useState(AO),
    [N, M] = d.useState(''),
    [T, D] = d.useState(''),
    [q, F] = d.useState(''),
    B = d.useMemo(
      () =>
        b.filter(
          (_) =>
            !(
              (p > 0 && _.s === p) ||
              (N && _.alvo !== N && _.alvoNome !== N) ||
              (T && _.nivel !== T && _.nivelNome !== T) ||
              (q && _.despojo !== q)
            )
        ),
      [b, N, T, q, p]
    ),
    te = d.useMemo(() => {
      const _ = A.trim().toLowerCase();
      return [
        ...e.filter(
          (W) =>
            !(
              (_ &&
                !W.nome.toLowerCase().includes(_) &&
                !W.id.toLowerCase().includes(_) &&
                !wy(w, W).toLowerCase().includes(_)) ||
              (C === 'favoritos' && !E.has(W.id))
            )
        ),
      ].sort((W, le) => {
        const ne = W.escada,
          z = le.escada;
        return ne == null && z == null
          ? 0
          : ne == null
            ? 1
            : z == null
              ? -1
              : ne !== z
                ? ne - z
                : W.nome.localeCompare(le.nome, void 0, { sensitivity: 'base' });
      });
    }, [e, A, C, E, w]),
    K = (_) => {
      U((R) => {
        const W = new Set(R);
        W.has(_) ? W.delete(_) : W.add(_);
        try {
          localStorage.setItem(xS, JSON.stringify([...W]));
        } catch {}
        return W;
      });
    },
    Z = ['lista', 'favoritos', 'time'];
  return (
    d.useEffect(() => {
      g == null || g(C === 'time' ? 'lfg' : 'mobs');
    }, [C, g]),
    t.jsxs('div', {
      className: 'hunt-lobby',
      children: [
        m
          ? null
          : t.jsx(vS, { membros: r, chamados: i, limite: c, podeEscolher: o, onConvidar: l }),
        t.jsx('div', {
          className: 'hunt-lobby-subs',
          children: Z.map((_) =>
            t.jsx(
              'button',
              {
                type: 'button',
                className: `hunt-lobby-sub${C === _ ? ' is-on' : ''}`,
                onClick: () => S(_),
                children: w(`hunt.lobby.sub.${_}`),
              },
              _
            )
          ),
        }),
        C === 'time'
          ? t.jsxs('div', {
              className: 'hunt-lfg-lista',
              children: [
                t.jsxs('div', {
                  className: 'hunt-lfg-lista-topo',
                  children: [
                    t.jsx('p', { className: 'hunt-hint', children: w('hunt.lobby.findHint') }),
                    t.jsx('button', {
                      type: 'button',
                      className: 'chrome-btn',
                      onClick: () => (u == null ? void 0 : u()),
                      children: w('hunt.lobby.findRefresh'),
                    }),
                  ],
                }),
                t.jsxs('div', {
                  className: 'hunt-lfg-filtros',
                  children: [
                    t.jsxs('select', {
                      className: 'hunt-lobby-busca',
                      value: N,
                      onChange: (_) => M(_.target.value),
                      'aria-label': w('hunt.lobby.orgTarget'),
                      children: [
                        t.jsx('option', { value: '', children: w('hunt.lobby.filterAllTargets') }),
                        e.map((_) => t.jsx('option', { value: _.id, children: _.nome }, _.id)),
                      ],
                    }),
                    t.jsxs('select', {
                      className: 'hunt-lobby-busca',
                      value: T,
                      onChange: (_) => D(_.target.value),
                      'aria-label': w('hunt.difficulty'),
                      children: [
                        t.jsx('option', { value: '', children: w('hunt.lobby.filterAllDiff') }),
                        a.map((_) => t.jsx('option', { value: _.id, children: _.nome }, _.id)),
                      ],
                    }),
                    t.jsxs('select', {
                      className: 'hunt-lobby-busca',
                      value: q,
                      onChange: (_) => F(_.target.value),
                      'aria-label': w('party.lootTitle'),
                      children: [
                        t.jsx('option', { value: '', children: w('hunt.lobby.filterAllLoot') }),
                        EO.map((_) =>
                          t.jsx('option', { value: _, children: w(`party.lootMode.${_}`) }, _)
                        ),
                      ],
                    }),
                  ],
                }),
                f
                  ? B.length === 0
                    ? t.jsx('p', {
                        className: 'friends-vazio',
                        children: w('hunt.lobby.findEmpty'),
                      })
                    : t.jsx('div', {
                        className: 'hunt-lfg-cards',
                        children: B.map((_) =>
                          t.jsxs(
                            'div',
                            {
                              className: `hunt-lfg-card${_.corpo ? ' hunt-lfg-card-com-arte' : ''}`,
                              children: [
                                _.corpo
                                  ? t.jsx(Yt, {
                                      className: 'hunt-lfg-card-arte',
                                      corpo: _.corpo,
                                      caixa: 36,
                                      alt: _.alvoNome,
                                    })
                                  : null,
                                t.jsxs('div', {
                                  className: 'hunt-lfg-card-head',
                                  children: [
                                    t.jsx('strong', { children: _.lider }),
                                    t.jsxs('span', {
                                      className: 'hunt-lfg-vagas',
                                      children: [_.n, '/', _.limite],
                                    }),
                                  ],
                                }),
                                t.jsxs('div', {
                                  className: 'hunt-lfg-card-meta',
                                  children: [
                                    t.jsx('span', { children: _.alvoNome || _.alvo || '—' }),
                                    t.jsx('span', { children: _.nivelNome || _.nivel || '—' }),
                                    t.jsx('span', { children: w(`party.lootMode.${_.despojo}`) }),
                                    _.cls || _.lvl
                                      ? t.jsxs('span', {
                                          children: [
                                            _.cls
                                              ? w(`classes.${_.cls}`, { defaultValue: _.cls })
                                              : '—',
                                            _.lvl ? ` · ${_.lvl}` : '',
                                          ],
                                        })
                                      : null,
                                  ],
                                }),
                                t.jsx('button', {
                                  type: 'button',
                                  className: `chrome-btn${v != null && v.has(_.s) ? ' chrome-btn-active' : ''}`,
                                  disabled: !h || !!(v != null && v.has(_.s)),
                                  onClick: () => (h == null ? void 0 : h(_.lider, _.s)),
                                  children:
                                    v != null && v.has(_.s)
                                      ? w('hunt.lobby.findAskSent')
                                      : w('hunt.lobby.findAsk'),
                                }),
                              ],
                            },
                            _.s
                          )
                        ),
                      })
                  : t.jsx('p', {
                      className: 'friends-vazio',
                      children: w('hunt.lobby.findLoading'),
                    }),
              ],
            })
          : t.jsxs(t.Fragment, {
              children: [
                t.jsxs('div', {
                  className: 'hunt-lobby-toolbar',
                  children: [
                    t.jsx('input', {
                      className: 'hunt-lobby-busca',
                      value: A,
                      onChange: (_) => I(_.target.value),
                      placeholder: w('hunt.lobby.search'),
                    }),
                    t.jsx('button', {
                      type: 'button',
                      className: `chrome-btn${k ? ' chrome-btn-active' : ''}`,
                      onClick: () => P((_) => !_),
                      children: w('hunt.lobby.filter'),
                    }),
                  ],
                }),
                k
                  ? t.jsxs('div', {
                      className: 'hunt-lobby-filtros',
                      children: [
                        t.jsx('span', {
                          className: 'hunt-lobby-rotulo',
                          children: w('hunt.difficulty'),
                        }),
                        t.jsx('div', {
                          className: 'hunt-lobby-chips',
                          children: a.map((_) =>
                            t.jsx(
                              'span',
                              {
                                className: `hunt-lobby-chip${_.actual ? ' is-on' : ''}`,
                                children: _.nome,
                              },
                              _.id
                            )
                          ),
                        }),
                      ],
                    })
                  : null,
                t.jsx('div', {
                  className: 'hunt-lobby-cards',
                  children: te.map((_) => {
                    const R = n === _.id,
                      W = t.jsxs('div', {
                        role: 'button',
                        tabIndex: o && Eo(_.id) ? 0 : -1,
                        className: `hunt-card${R ? ' is-on' : ''}${_.neste ? ' is-here' : ''}${!o || !Eo(_.id) ? ' is-disabled' : ''}`,
                        'data-monstro': _.id,
                        'aria-disabled': !o || !Eo(_.id),
                        onClick: () => o && Eo(_.id) && s(_.id),
                        onKeyDown: (le) => {
                          le.target === le.currentTarget &&
                            (le.key === 'Enter' || le.key === ' ') &&
                            (le.preventDefault(), o && Eo(_.id) && s(_.id));
                        },
                        children: [
                          t.jsx('span', {
                            className: 'hunt-card-art',
                            children: t.jsx(Yt, { corpo: _.corpo, alt: _.nome }),
                          }),
                          t.jsxs('span', {
                            className: 'hunt-card-body',
                            children: [
                              t.jsxs('span', {
                                className: 'hunt-card-top',
                                children: [
                                  t.jsx('strong', { children: _.nome }),
                                  t.jsx('button', {
                                    type: 'button',
                                    className: `hunt-card-star${E.has(_.id) ? ' is-on' : ''}`,
                                    onClick: (le) => {
                                      (le.stopPropagation(), K(_.id));
                                    },
                                    onKeyDown: (le) => le.stopPropagation(),
                                    children: '★',
                                  }),
                                ],
                              }),
                              t.jsx('small', { children: wy(w, _) || _.sobre }),
                            ],
                          }),
                        ],
                      });
                    return !y || !j
                      ? t.jsx('div', { className: 'hunt-card-slot', children: W }, _.id)
                      : t.jsx(
                          bS,
                          {
                            mobId: _.id,
                            nivelId: x,
                            obterFicha: y,
                            pedirFicha: j,
                            className: 'hunt-card-slot',
                            children: W,
                          },
                          _.id
                        );
                  }),
                }),
              ],
            }),
      ],
    })
  );
}
function TO({ pedidos: e, onAceitar: a, onRecusar: n, onRefresh: s }) {
  const { t: o } = Se();
  return e.length === 0
    ? null
    : t.jsxs('div', {
        className: 'hunt-lfg-ask-banner',
        role: 'status',
        'aria-live': 'polite',
        children: [
          t.jsxs('div', {
            className: 'hunt-lfg-ask-banner-topo',
            children: [
              t.jsx('strong', { children: o('hunt.lobby.lfgAsks') }),
              s
                ? t.jsx('button', {
                    type: 'button',
                    className: 'chrome-btn',
                    onClick: s,
                    children: o('hunt.lobby.findRefresh'),
                  })
                : null,
            ],
          }),
          t.jsx('ul', {
            className: 'hunt-lfg-ask-banner-lista',
            children: e.map((r) =>
              t.jsxs(
                'li',
                {
                  children: [
                    t.jsxs('span', {
                      children: [
                        t.jsx('strong', { children: r.n }),
                        t.jsxs('small', {
                          children: [
                            r.cls ? o(`classes.${r.cls}`, { defaultValue: r.cls }) : '—',
                            r.lvl ? ` · ${r.lvl}` : '',
                          ],
                        }),
                      ],
                    }),
                    t.jsxs('span', {
                      className: 'hunt-lfg-pedidos-acoes',
                      children: [
                        t.jsx('button', {
                          type: 'button',
                          className: 'chrome-btn chrome-btn-active',
                          onClick: () => a(r.n, r.s),
                          children: o('hunt.lobby.lfgAskYes'),
                        }),
                        t.jsx('button', {
                          type: 'button',
                          className: 'chrome-btn',
                          onClick: () => n(r.n, r.s),
                          children: o('hunt.lobby.lfgAskNo'),
                        }),
                      ],
                    }),
                  ],
                },
                r.s
              )
            ),
          }),
        ],
      });
}

const cq = ['bestiario'],
  uq = ['comum', 'paragon'],
  sk = [
    { tipo: 'ratos', ids: ['rat', 'giantrat', 'alligator'] },
    { tipo: 'ratmen', ids: ['ratman', 'ratmanarcher', 'ratmanmage'] },
    {
      tipo: 'mortosVivos',
      ids: [
        'skeleton',
        'zombie',
        'boneknight',
        'ghoul',
        'bonemagi',
        'mummy',
        'wraith',
        'spectre',
        'lich',
        'lichlord',
      ],
    },
    { tipo: 'orcs', ids: ['orc', 'orccaptain', 'orcishmage', 'orcbrute'] },
    { tipo: 'aracnideos', ids: ['giantspider', 'scorpion', 'frostspider', 'dreadspider'] },
    { tipo: 'terathans', ids: ['terathandrone', 'terathanwarrior', 'terathanavenger'] },
    { tipo: 'gigantes', ids: ['troll', 'ogre', 'frosttroll', 'cyclops'] },
    { tipo: 'gargulas', ids: ['gargoyle', 'stonegargoyle', 'firegargoyle'] },
    {
      tipo: 'reptilianos',
      ids: ['lizardman', 'ophidianwarrior', 'ophidianmage', 'ophidianmatriarch'],
    },
    {
      tipo: 'elementais',
      ids: ['airelemental', 'earthelemental', 'fireelemental', 'waterelemental', 'sandvortex'],
    },
    { tipo: 'minotauros', ids: ['minotaur', 'minotaurscout', 'minotaurcaptain'] },
    { tipo: 'yomotsu', ids: ['yomotsuwarrior', 'yomotsupriest', 'yomotsuelder'] },
    {
      tipo: 'dragoes',
      ids: ['wyvern', 'drake', 'dragon', 'skeletaldragon', 'serpentinedragon', 'ancientwyrm'],
    },
    { tipo: 'demonios', ids: ['daemon', 'icefiend', 'chaosdaemon', 'balron'] },
  ];
function dq(e) {
  const a = new Map(e.map((r) => [r.id, r])),
    n = new Set(),
    s = sk
      .map(({ tipo: r, ids: i }) => ({
        tipo: r,
        bestas: i.flatMap((c) => {
          const l = a.get(c);
          return l ? (n.add(c), [l]) : [];
        }),
      }))
      .filter((r) => r.bestas.length),
    o = e.filter((r) => !n.has(r.id));
  return (o.length && s.push({ tipo: 'outros', bestas: o }), s);
}
function mq({ open: e, bestiario: a, onClose: n, onActivate: s, style: o }) {
  var w;
  const { t: r, i18n: i } = Se(),
    [c, l] = d.useState('bestiario'),
    [m, g] = d.useState('comum'),
    [b, f] = d.useState(null);
  if (
    (d.useEffect(() => {
      e || f(null);
    }, [e]),
    !e)
  )
    return null;
  const h = () => {
      (f(null), a.fechar(), a.atualizar());
    },
    u = (C) => {
      var A;
      const S = ((A = sk.find((I) => I.ids.includes(C))) == null ? void 0 : A.tipo) ?? 'outros';
      return r(`wiki.type.${S}`);
    },
    p = m === 'paragon',
    v = (C) => (p ? C.mortesParagon : C.mortes),
    x = dq(a.bestas),
    y = a.bestas.reduce((C, S) => C + v(S), 0),
    j = a.bestas.filter((C) => v(C) > 0).length;
  return t.jsx(dt, {
    className: 'wiki-gump',
    title: r('wiki.title'),
    label: r('wiki.title'),
    onClose: n,
    onActivate: s,
    draggable: !0,
    style: o,
    children: t.jsxs('div', {
      className: 'wiki-body no-gump-drag',
      children: [
        t.jsx('div', {
          className: 'wiki-abas',
          role: 'tablist',
          children: cq.map((C) =>
            t.jsx(
              'button',
              {
                type: 'button',
                role: 'tab',
                'aria-selected': c === C,
                'data-aba': C,
                className: `chrome-btn wiki-aba${c === C ? ' chrome-btn-active' : ''}`,
                onClick: () => {
                  (l(C), f(null), a.atualizar());
                },
                children: r(`wiki.tab.${C}`),
              },
              C
            )
          ),
        }),
        c === 'bestiario'
          ? t.jsx('div', {
              className: 'wiki-subabas',
              role: 'tablist',
              children: uq.map((C) =>
                t.jsx(
                  'button',
                  {
                    type: 'button',
                    role: 'tab',
                    'aria-selected': m === C,
                    'data-versao': C,
                    className: `wiki-subaba${m === C ? ' wiki-subaba-ativa' : ''}${C === 'paragon' ? ' wiki-subaba-paragon' : ''}`,
                    onClick: () => {
                      (g(C), f(null), a.fechar(), a.atualizar());
                    },
                    children: r(`wiki.version.${C}`),
                  },
                  C
                )
              ),
            })
          : null,
        b
          ? t.jsx(iq, {
              ficha:
                ((w = a.ficha) == null ? void 0 : w.id) === b && a.ficha.paragon === p
                  ? a.ficha
                  : null,
              familia: u(b),
              onVoltar: h,
              onTrocarVersao: () => {
                (g(p ? 'comum' : 'paragon'), a.abrir(b, !p));
              },
            })
          : a.carregado
            ? t.jsxs(t.Fragment, {
                children: [
                  t.jsx('p', {
                    className: 'wiki-resumo',
                    children: r(p ? 'wiki.summaryParagon' : 'wiki.summary', {
                      total: y.toLocaleString(i.language),
                      conhecidas: j,
                      todas: a.bestas.length,
                    }),
                  }),
                  p
                    ? t.jsx('p', {
                        className: 'wiki-paragon-dica',
                        children: r('wiki.paragonHint'),
                      })
                    : t.jsx('p', {
                        className: 'wiki-bonus',
                        'data-bestiario-bonus': a.bonus,
                        children: r('wiki.levels.bonus', {
                          b: a.bonus.toLocaleString(i.language, {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          }),
                        }),
                      }),
                  a.indisponivel
                    ? t.jsx('p', {
                        className: 'wiki-indisponivel',
                        children: r('wiki.unavailable'),
                      })
                    : null,
                  t.jsx('div', {
                    className: 'wiki-rolagem',
                    children: x.map((C) =>
                      t.jsxs(
                        'section',
                        {
                          className: 'wiki-familia',
                          'data-tipo': C.tipo,
                          children: [
                            t.jsx('h4', {
                              className: 'wiki-familia-titulo',
                              children: r(`wiki.type.${C.tipo}`),
                            }),
                            t.jsx('ul', {
                              className: 'wiki-bestas',
                              children: C.bestas.map((S) =>
                                t.jsx(
                                  'li',
                                  {
                                    className: `wiki-besta${v(S) > 0 ? '' : ' wiki-besta-nova'}${p ? ' wiki-besta-paragon' : ''}`,
                                    'data-besta': S.id,
                                    'data-mortes': v(S),
                                    children: t.jsxs('button', {
                                      type: 'button',
                                      className: 'wiki-besta-botao',
                                      title: r('wiki.open', { nome: S.nome }),
                                      onClick: () => {
                                        (f(S.id), a.abrir(S.id, p));
                                      },
                                      children: [
                                        t.jsx('span', {
                                          className: 'wiki-besta-arte',
                                          children: t.jsx(Yt, {
                                            corpo: S.corpo,
                                            caixa: 52,
                                            alt: S.nome,
                                            matiz: p ? pS : 0,
                                          }),
                                        }),
                                        t.jsx('span', {
                                          className: 'wiki-besta-nome',
                                          children: S.nome,
                                        }),
                                        p || v(S) <= 0 || S.prox === 0
                                          ? t.jsx('span', {
                                              className: 'wiki-besta-mortes',
                                              children:
                                                v(S) > 0
                                                  ? r('wiki.kills', {
                                                      n: v(S).toLocaleString(i.language),
                                                    })
                                                  : r('wiki.never'),
                                            })
                                          : null,
                                        p || S.conta <= 0
                                          ? null
                                          : t.jsxs('span', {
                                              className: 'wiki-besta-nivel',
                                              'data-nivel': S.nivel,
                                              title: r('wiki.levels.short', { n: S.nivel }),
                                              children: [
                                                t.jsxs('span', {
                                                  className: 'wiki-besta-nivel-n',
                                                  children: [
                                                    r('wiki.levels.card', { n: S.nivel }),
                                                    S.prox === 0 ? ' ✓' : '',
                                                  ],
                                                }),
                                                S.prox > 0
                                                  ? t.jsxs(t.Fragment, {
                                                      children: [
                                                        t.jsx('span', {
                                                          className: 'wiki-besta-barra',
                                                          children: t.jsx('span', {
                                                            style: {
                                                              width: `${Math.min(100, Math.max(0, ((S.conta - S.ant) / (S.prox - S.ant)) * 100))}%`,
                                                            },
                                                          }),
                                                        }),
                                                        t.jsxs('span', {
                                                          className: 'wiki-besta-prog',
                                                          children: [
                                                            S.conta.toLocaleString(i.language),
                                                            ' /',
                                                            ' ',
                                                            S.prox.toLocaleString(i.language),
                                                          ],
                                                        }),
                                                      ],
                                                    })
                                                  : null,
                                              ],
                                            }),
                                      ],
                                    }),
                                  },
                                  S.id
                                )
                              ),
                            }),
                          ],
                        },
                        C.tipo
                      )
                    ),
                  }),
                ],
              })
            : t.jsx('p', { className: 'wiki-vazio', children: r('wiki.loading') }),
      ],
    }),
  });
}
