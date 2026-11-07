// SOURCE: https://uoidle.com/assets/Jogo-D5xEfvfV.js
// BUNDLE_VERSION: 0.99.0
// BUNDLE_SHA256: 4770a0fcb06e7222f285f6f3b1fdd0da2ea3952a94d0f493a69f527016e73b0d
// AST_SPAN: L17227-L17894
const Rs = {
    1: 'classes.paladin',
    2: 'classes.berserker',
    3: 'classes.duelist',
    4: 'classes.bow',
    5: 'classes.crossbow',
    6: 'classes.pyromancer',
    7: 'classes.stormcaller',
    8: 'classes.necromancer',
    9: 'classes.cleric',
  },
  FI = {
    1: 'paladin_close_wounds',
    2: 'berserker_frenzy',
    3: 'duelist_armor_ignore',
    4: 'ranger_moving_shot',
    5: 'ranger_bolt_volley',
    6: 'mage_flamestrike',
    7: 'mage_chain_lightning',
    8: 'necro_strangle',
    9: 'cleric_arch_protection',
  };
function BI(e, a, n) {
  const s = n.trim();
  if (!s) return null;
  const o = e.getBoundingClientRect(),
    r = o.bottom + 170 > window.innerHeight && o.top > 160,
    i = Math.max(8, Math.min(o.left, window.innerWidth - 328));
  return { titulo: a, texto: s, left: i, top: r ? o.top - 8 : o.bottom + 8, acima: r };
}
const HI = { hits: 5, mana: 5, stam: 5 };
function Rm(e, a) {
  const [n, s] = d.useState(null);
  return (
    d.useEffect(() => {
      if (!a || !e) return;
      const o = e.subscribeSpeech((r) => {
        const i = it(r);
        if ((i == null ? void 0 : i.assunto) !== 'ARVORE') return;
        const c = i.dado,
          m = (Array.isArray(c.nodes) ? c.nodes : []).map((f) => {
            if (Array.isArray(f))
              return {
                id: String(f[0] ?? ''),
                lv: Number(f[1]) || 0,
                col: Number(f[2]) || 0,
                name: String(f[3] ?? ''),
                n: Number(f[4]) || 0,
                k: String(f[5] ?? 'a'),
                ab: String(f[6] ?? '') || void 0,
              };
            const h = f;
            return {
              id: String(h.id ?? ''),
              lv: Number(h.lv) || 0,
              col: Number(h.col) || 0,
              name: String(h.name ?? ''),
              n: Number(h.n) || 0,
              k: String(h.k ?? 'a'),
              ab: h.ab ? String(h.ab) : void 0,
            };
          }),
          g = Array.isArray(c.own) ? c.own : [],
          b = VI(c.balances);
        s((f) => {
          const h = YI(f == null ? void 0 : f.own, g),
            u = KI(f == null ? void 0 : f.nodes, m),
            p = JI(f == null ? void 0 : f.balances, b);
          return {
            c: Number(c.c) || 0,
            s: Number(c.s) || 0,
            l: Number(c.l) || 1,
            pts: Number(c.pts) || 0,
            resetPrice: Number(c.resetPrice) || 300,
            resetCredits: Math.max(0, Number(c.resetCredits) || 0),
            canReset:
              typeof c.canReset == 'boolean'
                ? c.canReset
                : h.length > 0 || (Number(c.s) || 0) !== 0,
            own: h,
            nodes: u,
            balances: p,
            skills: b ? Ch(f == null ? void 0 : f.skills, kh(c.skills)) : void 0,
            status: b ? Ch(f == null ? void 0 : f.status, kh(c.status, !0)) : void 0,
            attributes: b ? Ch(f == null ? void 0 : f.attributes, kh(c.attributes)) : void 0,
          };
        });
      });
      return (e.say('[Arvore'), o);
    }, [a, e]),
    n
  );
}
function zI({ session: e, ativo: a, tree: n }) {
  const { t: s } = Se(),
    [o, r] = d.useState(() => co()),
    [i, c] = d.useState(null),
    [l, m] = d.useState(null),
    [g, b] = d.useState(null),
    f = n;
  (d.useEffect(() => {
    m(null);
  }, [n]),
    d.useEffect(() => {
      if (!l) return;
      const K = window.setTimeout(() => {
        (m(null), e.say('[Arvore'));
      }, 5e3);
      return () => window.clearTimeout(K);
    }, [l, e]),
    d.useEffect(() => {
      a || m(null);
    }, [a, e]),
    d.useEffect(() => {
      (Ka().then(r), Fc());
    }, []));
  const h = d.useMemo(() => new Set((f == null ? void 0 : f.own) ?? []), [f]),
    u = ((f == null ? void 0 : f.nodes) ?? []).filter((K) => K.k === 'a' && h.has(K.id)).length,
    p = (f == null ? void 0 : f.pts) ?? 0,
    v = d.useMemo(() => ((f == null ? void 0 : f.nodes) ?? []).some((K) => K.col !== 0), [f]),
    x = d.useMemo(
      () =>
        dl(
          ((f == null ? void 0 : f.nodes) ?? []).filter((K) => K.k !== 'a'),
          0
        ),
      [f]
    ),
    y = d.useMemo(
      () =>
        [
          ...new Set(
            ((f == null ? void 0 : f.nodes) ?? []).filter((Z) => Z.col !== 0).map((Z) => Z.col)
          ),
        ].map((Z) => ({
          col: Z,
          rows: dl(
            ((f == null ? void 0 : f.nodes) ?? []).filter((_) => _.k !== 'a'),
            Z
          ),
        })),
      [f]
    ),
    j = d.useMemo(() => {
      if (!f) return [];
      const K = f.nodes.filter((Z) => Z.k === 'h' || Z.k === 'c');
      return v ? (f.s ? [...dl(K, 0), ...dl(K, f.s)].sort(([Z], [_]) => Z - _) : []) : dl(K, 0);
    }, [f, v]),
    w = d.useMemo(() => GI(j, 5), [j]),
    C = !v || !!(f != null && f.s),
    S = (f == null ? void 0 : f.resetCredits) ?? 0,
    A = (K) =>
      !f || l === `node:${K.id}` || h.has(K.id) || K.k === 'h' || f.l < K.lv
        ? !1
        : K.k === 'c'
          ? f.s === 0
          : K.col === 0 || f.s === K.col,
    I = (K, Z = !1) => {
      if (A(K)) {
        if (K.k === 'c' && !Z) {
          c(K);
          return;
        }
        (c(null), m(`node:${K.id}`), e.say(`[Arvore buy ${K.id}`));
      }
    },
    k = (K, Z) => {
      const _ = `${K}:${Z.id}`;
      l !== _ && (m(_), e.say(`[Arvore ${K} ${Z.id}`));
    },
    P = () => {
      !f ||
        S > 0 ||
        l === 'buyreset' ||
        wr(s('personagem.progressao.resetCompra'), f.resetPrice ?? 300).then((K) => {
          K && (m('buyreset'), e.say('[Arvore buyreset'));
        });
    },
    E = () => {
      !(f != null && f.canReset) || S <= 0 || l === 'reset' || (m('reset'), e.say('[Arvore reset'));
    },
    U = (K, Z, _) => {
      b(BI(K, Z, _));
    },
    N = () => b(null),
    M = (K, Z) => s(`personagem.progressao.dica.${K}.${Z}`, { defaultValue: '' }),
    T = (K) => t.jsx(Om, { artPack: o, abilityId: K, entry: Nc(K), scale: 1 }),
    D = (K, Z) => {
      var le;
      const _ = Z.find((ne) => ne.k === 'c'),
        R = Z.filter((ne) => ne.k === 'h');
      if (!_ && R.length === 0) return null;
      const W = !!f && f.l >= K && (!_ || f.s === 0 || f.s === _.col);
      return _
        ? t.jsxs(
            'div',
            {
              className: 'arvore-col',
              children: [
                t.jsx('span', { className: 'arvore-lv', children: K }),
                t.jsx('div', {
                  className: `arvore-circulo${W ? ' is-on' : ''}`,
                  children: t.jsx('button', {
                    type: 'button',
                    className: 'arvore-circulo-btn',
                    disabled: !A(_),
                    onClick: () => I(_),
                    onMouseEnter: (ne) =>
                      U(
                        ne.currentTarget,
                        Rs[_.col] ? s(Rs[_.col]) : _.name,
                        s('personagem.progressao.dica.caminho', {
                          caminho: Rs[_.col] ? s(Rs[_.col]) : _.name,
                        })
                      ),
                    onMouseLeave: N,
                    children: T(_.ab || FI[_.col]),
                  }),
                }),
                t.jsx('span', { className: 'arvore-nome', children: _.name }),
              ],
            },
            `${K}-${_.col}`
          )
        : t.jsxs(
            'div',
            {
              className: 'arvore-col',
              children: [
                t.jsx('span', { className: 'arvore-lv', children: K }),
                t.jsx('div', {
                  className: `arvore-circulos${W ? ' is-on' : ''}`,
                  children: R.map((ne) =>
                    t.jsx(
                      'div',
                      {
                        className: `arvore-circulo${W ? ' is-on' : ''}`,
                        onMouseEnter: (z) => {
                          var re;
                          const oe = oc(ne.ab, ne.name, s),
                            ge = gN(ne.ab, (re = Nc(ne.ab)) == null ? void 0 : re.blurb, s);
                          U(
                            z.currentTarget,
                            oe,
                            `${ge}

${s('personagem.progressao.dica.habilidade', { level: ne.lv })}`
                          );
                        },
                        onMouseLeave: N,
                        children: ne.ab
                          ? T(ne.ab)
                          : t.jsx('span', {
                              className: 'arvore-habilidade-glyph',
                              'aria-hidden': !0,
                              children: '✦',
                            }),
                      },
                      ne.id
                    )
                  ),
                }),
                t.jsx('span', {
                  className: 'arvore-nome',
                  children: R.map((ne) => ne.name).join(' · '),
                }),
              ],
            },
            `${K}-${((le = Z[0]) == null ? void 0 : le.col) ?? 0}`
          );
    },
    q = f == null ? void 0 : f.balances,
    F = !!q,
    B = (K, Z, _, R) =>
      t.jsxs('span', {
        className: 'arvore-saldo',
        onMouseEnter: (W) => U(W.currentTarget, K, R),
        onMouseLeave: N,
        children: [
          t.jsx('span', { children: K }),
          t.jsx('strong', { children: (_ == null ? void 0 : _.available) ?? '—' }),
          t.jsx('small', { children: s('personagem.progressao.ganhoNivel', { gain: Z }) }),
          _
            ? t.jsx('em', { children: s('personagem.progressao.saldoTotal', { total: _.earned }) })
            : null,
        ],
      }),
    te = (K, Z, _) =>
      t.jsx('ul', {
        className: `arvore-cards arvore-cards-${K}`,
        children: (Z ?? []).map((R) => {
          const W = R.nextCost === null || (R.cap !== null && R.value >= R.cap),
            le = l === `${K}:${R.id}`,
            ne =
              !le &&
              !W &&
              R.nextCost !== null &&
              ((_ == null ? void 0 : _.available) ?? 0) >= R.nextCost,
            z = s(`personagem.progressao.entries.${R.id}`, { defaultValue: R.name }),
            oe = 1,
            ge = K === 'skill' ? 1 : (R.step ?? (K === 'attribute' ? (HI[R.id] ?? 1) : 1));
          return t.jsxs(
            'li',
            {
              className: 'arvore-card',
              onMouseEnter: (re) => U(re.currentTarget, z, M(K, R.id)),
              onMouseLeave: N,
              children: [
                t.jsxs('span', {
                  className: 'arvore-card-info',
                  children: [
                    t.jsx('strong', { className: 'arvore-card-nome', children: z }),
                    t.jsxs('small', {
                      className: 'arvore-card-meta',
                      children: [
                        s('personagem.progressao.desdeNivel', { level: oe }),
                        ' · ',
                        R.cap === null
                          ? s('personagem.progressao.rank', { rank: R.rank })
                          : `${s('personagem.progressao.rank', { rank: R.rank })} · ${s('personagem.progressao.limite', { cap: vu(R.cap) })}`,
                      ],
                    }),
                  ],
                }),
                t.jsx('strong', {
                  className: 'arvore-card-valor',
                  'aria-label': s('personagem.progressao.valorAtual', { value: vu(R.value) }),
                  title: s('personagem.progressao.valorAtual', { value: vu(R.value) }),
                  children: vu(R.value),
                }),
                t.jsx('button', {
                  type: 'button',
                  className: 'arvore-comprar',
                  disabled: !ne,
                  'aria-busy': le,
                  onClick: () => k(K, R),
                  children: W
                    ? s('personagem.progressao.maximo')
                    : s('personagem.progressao.comprar', { gain: ge, cost: R.nextCost ?? 0 }),
                }),
              ],
            },
            R.id
          );
        }),
      });
  return t.jsxs('div', {
    className: 'personagem-arvore',
    'data-personagem-conteudo': 'arvore',
    children: [
      t.jsxs('div', {
        className: 'arvore-head',
        children: [
          t.jsxs('span', {
            className: 'arvore-nivel',
            children: [
              s('personagem.progressao.nivel'),
              ' ',
              t.jsx('strong', { children: (f == null ? void 0 : f.l) ?? '…' }),
            ],
          }),
          F
            ? t.jsxs('div', {
                className: 'arvore-saldos',
                children: [
                  B(
                    s('personagem.progressao.skillPoints'),
                    5,
                    q.skill,
                    s('personagem.progressao.dica.secao.skills')
                  ),
                  B(
                    s('personagem.progressao.statusPoints'),
                    5,
                    q.status,
                    s('personagem.progressao.dica.secao.status')
                  ),
                  B(
                    s('personagem.progressao.attributePoints'),
                    1,
                    q.attribute,
                    s('personagem.progressao.dica.secao.atributos')
                  ),
                ],
              })
            : t.jsxs('span', {
                className: 'arvore-legado',
                children: [s('personagem.progressao.pontos'), ' ', u, '/', p],
              }),
          t.jsxs('span', {
            className: 'arvore-head-acoes',
            children: [
              v && f != null && f.s && Rs[f.s]
                ? t.jsx('span', { className: 'arvore-subclasse', children: s(Rs[f.s]) })
                : null,
              t.jsx('span', {
                className: 'arvore-resets',
                title: s('personagem.progressao.resetCreditosHint'),
                children: s('personagem.progressao.resetCreditos', { count: S }),
              }),
              f && S <= 0
                ? t.jsx('button', {
                    type: 'button',
                    className: 'arvore-reset',
                    disabled: l === 'buyreset',
                    'aria-busy': l === 'buyreset',
                    onClick: P,
                    children: s('personagem.progressao.comprarReset', {
                      price: f.resetPrice ?? 300,
                    }),
                  })
                : null,
              t.jsx('button', {
                type: 'button',
                className: 'arvore-reset arvore-reset-usar',
                disabled: !(f != null && f.canReset) || S <= 0 || l === 'reset',
                'aria-busy': l === 'reset',
                title:
                  f != null && f.canReset
                    ? S <= 0
                      ? s('personagem.progressao.resetSemCredito')
                      : void 0
                    : s('personagem.progressao.resetIndisponivel'),
                onClick: E,
                children: s('personagem.progressao.usarReset'),
              }),
            ],
          }),
        ],
      }),
      i
        ? t.jsx('div', {
            className: 'confirmar-uoc-fundo',
            role: 'presentation',
            onMouseDown: (K) => K.target === K.currentTarget && c(null),
            children: t.jsxs('div', {
              className: 'confirmar-uoc',
              role: 'dialog',
              'aria-modal': 'true',
              'aria-label': s('classes.caminhoTitulo'),
              'data-arvore-confirmar': !0,
              children: [
                t.jsx('h3', { children: s('classes.caminhoTitulo') }),
                t.jsx('p', {
                  className: 'confirmar-uoc-texto',
                  children: s('classes.caminhoTexto', {
                    caminho: Rs[i.col] ? s(Rs[i.col]) : i.name,
                  }),
                }),
                t.jsxs('div', {
                  className: 'confirmar-uoc-botoes',
                  children: [
                    t.jsx('button', {
                      type: 'button',
                      className: 'chrome-btn',
                      'data-arvore-confirmar-nao': !0,
                      onClick: () => c(null),
                      children: s('classes.caminhoNao'),
                    }),
                    t.jsx('button', {
                      type: 'button',
                      className: 'loja-btn-comprar',
                      'data-arvore-confirmar-sim': !0,
                      autoFocus: !0,
                      onClick: () => I(i, !0),
                      children: s('classes.caminhoSim'),
                    }),
                  ],
                }),
              ],
            }),
          })
        : null,
      t.jsxs('div', {
        className: 'arvore-conteudo no-gump-drag',
        children: [
          F
            ? t.jsxs('div', {
                className: 'arvore-progressao-grid',
                children: [
                  t.jsx('p', {
                    className: 'arvore-passe-mouse',
                    children: s('personagem.progressao.passeOMouse'),
                  }),
                  t.jsxs('section', {
                    className: 'arvore-secao arvore-secao-skills',
                    children: [
                      t.jsx('h3', {
                        className: 'arvore-secao-titulo',
                        onMouseEnter: (K) =>
                          U(
                            K.currentTarget,
                            s('personagem.progressao.skills'),
                            s('personagem.progressao.dica.secao.skills')
                          ),
                        onMouseLeave: N,
                        children: s('personagem.progressao.skills'),
                      }),
                      te('skill', f.skills, q.skill),
                    ],
                  }),
                  t.jsxs('section', {
                    className: 'arvore-secao arvore-secao-status',
                    children: [
                      t.jsx('h3', {
                        className: 'arvore-secao-titulo',
                        onMouseEnter: (K) =>
                          U(
                            K.currentTarget,
                            s('personagem.progressao.statusTitulo'),
                            s('personagem.progressao.dica.secao.status')
                          ),
                        onMouseLeave: N,
                        children: s('personagem.progressao.statusTitulo'),
                      }),
                      te('status', f.status, q.status),
                    ],
                  }),
                  t.jsxs('section', {
                    className: 'arvore-secao arvore-secao-atributos',
                    children: [
                      t.jsx('h3', {
                        className: 'arvore-secao-titulo',
                        onMouseEnter: (K) =>
                          U(
                            K.currentTarget,
                            s('personagem.progressao.atributos'),
                            s('personagem.progressao.dica.secao.atributos')
                          ),
                        onMouseLeave: N,
                        children: s('personagem.progressao.atributos'),
                      }),
                      te('attribute', f.attributes, q.attribute),
                    ],
                  }),
                ],
              })
            : null,
          t.jsxs('section', {
            className: 'arvore-secao',
            children: [
              t.jsx('h3', {
                className: 'arvore-secao-titulo',
                onMouseEnter: (K) =>
                  U(
                    K.currentTarget,
                    s('personagem.progressao.habilidades'),
                    s('personagem.progressao.dica.secao.habilidades')
                  ),
                onMouseLeave: N,
                children: s('personagem.progressao.habilidades'),
              }),
              t.jsx('div', {
                className: 'arvore-scroll',
                children: t.jsx('div', {
                  className: `arvore-mapa${C ? ' is-cobra' : ' is-escolha'}`,
                  children: C
                    ? t.jsx('div', {
                        className: 'arvore-cobra',
                        children: w.map((K, Z) => {
                          var W;
                          const _ = Z % 2 === 1,
                            R = _ ? [...K].reverse() : K;
                          return t.jsxs(
                            'div',
                            {
                              className: `arvore-cobra-linha${_ ? ' is-reverse' : ''}`,
                              children: [
                                R.map(([le, ne], z) => {
                                  var oe;
                                  return t.jsxs(
                                    'div',
                                    {
                                      className: 'arvore-passo',
                                      children: [
                                        z > 0 ? t.jsx('div', { className: 'arvore-elo' }) : null,
                                        D(le, ne),
                                      ],
                                    },
                                    `${((oe = ne[0]) == null ? void 0 : oe.col) ?? 0}-${le}`
                                  );
                                }),
                                Z < w.length - 1
                                  ? t.jsx('span', {
                                      className: 'arvore-cobra-curva',
                                      'aria-hidden': !0,
                                    })
                                  : null,
                              ],
                            },
                            ((W = K[0]) == null ? void 0 : W[0]) ?? Z
                          );
                        }),
                      })
                    : t.jsxs(t.Fragment, {
                        children: [
                          t.jsx('div', {
                            className: 'arvore-tronco',
                            children: t.jsx('div', {
                              className: 'arvore-trilho',
                              children: x.map(([K, Z], _) =>
                                t.jsxs(
                                  'div',
                                  {
                                    className: 'arvore-passo',
                                    children: [
                                      _ > 0 ? t.jsx('div', { className: 'arvore-elo' }) : null,
                                      D(K, Z),
                                    ],
                                  },
                                  K
                                )
                              ),
                            }),
                          }),
                          t.jsx('div', {
                            className: 'arvore-colunas',
                            'data-colunas': y.length,
                            children: y.map(({ col: K, rows: Z }) =>
                              t.jsxs(
                                'div',
                                {
                                  className: 'arvore-trilho',
                                  children: [
                                    t.jsx('span', {
                                      className: 'arvore-coluna-nome',
                                      children: Rs[K] ? s(Rs[K]) : '',
                                    }),
                                    Z.map(([_, R], W) =>
                                      t.jsxs(
                                        'div',
                                        {
                                          className: 'arvore-passo',
                                          children: [
                                            W > 0
                                              ? t.jsx('div', { className: 'arvore-elo' })
                                              : null,
                                            D(_, R),
                                          ],
                                        },
                                        `${K}-${_}`
                                      )
                                    ),
                                  ],
                                },
                                K
                              )
                            ),
                          }),
                        ],
                      }),
                }),
              }),
            ],
          }),
        ],
      }),
      g
        ? t.jsxs('div', {
            className: `arvore-dica${g.acima ? ' is-acima' : ''}`,
            style: { left: g.left, top: g.top },
            role: 'tooltip',
            children: [t.jsx('strong', { children: g.titulo }), t.jsx('p', { children: g.texto })],
          })
        : null,
    ],
  });
}
