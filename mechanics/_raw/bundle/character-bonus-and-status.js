// SOURCE: https://uoidle.com/assets/Jogo-D5xEfvfV.js
// BUNDLE_VERSION: 0.99.0
// BUNDLE_SHA256: 4770a0fcb06e7222f285f6f3b1fdd0da2ea3952a94d0f493a69f527016e73b0d
// AST_SPAN: L13294-L13803
const wo = (e) => (typeof e == 'number' ? e : Number(e) || 0),
  vh = (e) => {
    const a = Array.isArray(e) ? e.map(wo) : [];
    return { base: a[0] ?? 0, itens: a[1] ?? 0, outros: a[2] ?? 0 };
  };
function eI(e, a, n) {
  const [s, o] = d.useState(null);
  return (
    d.useEffect(() => {
      if (!a) {
        o(null);
        return;
      }
      return e.subscribeSpeech((r) => {
        const i = it(r);
        if (!i || i.assunto !== 'PERSONAGEMBONUS') return;
        const c = i.dado,
          l = c.atrib ?? {};
        o({
          atrib: { str: vh(l.str), dex: vh(l.dex), int: vh(l.int) },
          resist: Array.isArray(c.resist)
            ? c.resist.map((m) => ({
                t: String(m.t ?? ''),
                v: wo(m.v),
                itens: wo(m.itens),
                max: wo(m.max),
              }))
            : [],
          bonus: Array.isArray(c.bonus)
            ? c.bonus.map((m) => ({ id: String(m.id ?? ''), v: wo(m.v) }))
            : [],
          arvore: Array.isArray(c.arvore)
            ? c.arvore.map((m) => ({ id: String(m.id ?? ''), v: wo(m.v) }))
            : [],
          skills: Array.isArray(c.skills)
            ? c.skills.map((m) => ({ id: wo(m.id), v: wo(m.v) }))
            : [],
        });
      });
    }, [e, a]),
    d.useEffect(() => {
      if (!a || !n) return;
      e.say('[personagembonus');
      const r = setInterval(() => e.say('[personagembonus'), 5e3);
      return () => clearInterval(r);
    }, [e, a, n]),
    s
  );
}
const Bx = {
  combat: {
    icon: 'swords',
    keys: [
      'swords',
      'macing',
      'fencing',
      'archery',
      'wrestling',
      'tactics',
      'parry',
      'anatomy',
      'healing',
      'focus',
      'bushido',
      'ninjitsu',
      'chivalry',
      'throwing',
    ],
  },
  magic: {
    icon: 'mana',
    keys: [
      'magery',
      'evalInt',
      'meditation',
      'magicResist',
      'necromancy',
      'spiritSpeak',
      'spellweaving',
      'mysticism',
      'imbuing',
    ],
  },
  craft: {
    icon: 'wrench',
    keys: [
      'mining',
      'lumberjacking',
      'blacksmith',
      'carpentry',
      'tailoring',
      'tinkering',
      'fletching',
      'alchemy',
      'cooking',
      'cartography',
      'inscribe',
      'fishing',
    ],
  },
  misc: {
    icon: 'paw',
    keys: [
      'animalTaming',
      'animalLore',
      'veterinary',
      'herding',
      'tracking',
      'hiding',
      'stealth',
      'stealing',
      'snooping',
      'lockpicking',
      'removeTrap',
      'poisoning',
      'detectHidden',
      'camping',
      'begging',
      'forensics',
      'itemId',
      'armsLore',
      'tasteId',
      'musicianship',
      'peacemaking',
      'discordance',
      'provocation',
    ],
  },
};
function cb(e, a) {
  return a <= 0 ? 0 : Math.min(100, Math.max(0, Math.round((e / a) * 1e3) / 10));
}
function uN(e, a) {
  return a <= 0 && e <= 0 ? '—' : `${e} / ${a}`;
}
function tI(e) {
  return e.toFixed(1);
}
function Hx(e) {
  return e
    .filter((a) => a.value > 0 || a.base > 0)
    .sort((a, n) => n.value - a.value || a.id - n.id);
}
function zs({ name: e, size: a = 14 }) {
  return t.jsx('img', {
    src: `/ui/icons/status/${e}.png`,
    alt: '',
    width: a,
    height: a,
    draggable: !1,
  });
}
function rl({ kind: e, label: a, icon: n, value: s, max: o }) {
  const r = cb(s, o);
  return t.jsxs('div', {
    className: `status-vital status-vital-${e}`,
    children: [
      t.jsx('span', {
        className: 'status-vital-ico',
        'aria-hidden': !0,
        children: t.jsx(zs, { name: n }),
      }),
      t.jsxs('div', {
        className: 'status-vital-meta',
        children: [
          t.jsx('span', { className: 'status-vital-label', children: a }),
          t.jsx('strong', { children: uN(s, o) }),
        ],
      }),
      t.jsx('div', {
        className: 'status-vital-track',
        role: 'progressbar',
        'aria-valuenow': s,
        'aria-valuemin': 0,
        'aria-valuemax': o,
        children: t.jsx('span', { className: 'status-vital-fill', style: { width: `${r}%` } }),
      }),
    ],
  });
}
function il({ label: e, value: a, icon: n, soma: s }) {
  return t.jsxs('div', {
    className: 'status-chip',
    'data-status-soma': s,
    children: [
      t.jsx(zs, { name: n, size: 12 }),
      t.jsx('span', { children: e }),
      t.jsx('strong', { children: a }),
    ],
  });
}
function yh({ s: e }) {
  return t.jsxs('span', {
    className: 'status-soma',
    children: [
      t.jsx('span', { className: 'status-soma-base', children: e.base }),
      e.itens
        ? t.jsxs(t.Fragment, {
            children: [' + ', t.jsx('span', { className: 'status-soma-itens', children: e.itens })],
          })
        : null,
      e.outros
        ? t.jsxs(t.Fragment, {
            children: [
              e.outros > 0 ? ' + ' : ' − ',
              t.jsx('span', { className: 'status-soma-outros', children: Math.abs(e.outros) }),
            ],
          })
        : null,
    ],
  });
}
function aI({ name: e, stats: a, retrato: n, bonus: s }) {
  const { t: o } = Se(),
    r = d.useSyncExternalStore(Am, Mm),
    i = cb(r.xp, r.xpMax),
    c = Cm(e),
    l = o(c ? `classes.${c}` : 'chrome.classAdventurer');
  return t.jsxs('div', {
    className: 'status-body no-gump-drag',
    children: [
      t.jsxs('header', {
        className: 'status-hero',
        children: [
          n,
          t.jsxs('div', {
            className: 'status-hero-texto',
            children: [
              t.jsx('p', { className: 'status-name', children: e }),
              t.jsx('p', { className: 'status-class', children: l }),
            ],
          }),
        ],
      }),
      t.jsxs('section', {
        className: 'status-section status-section-progress',
        children: [
          t.jsxs('h3', {
            className: 'status-section-title',
            children: [
              t.jsx(zs, { name: 'plus' }),
              o('chrome.progress', { defaultValue: 'Progresso' }),
            ],
          }),
          t.jsxs('p', {
            className: 'status-row status-nivel',
            children: [
              t.jsx('span', { children: o('chrome.level') }),
              t.jsx('strong', { 'data-status-nivel': r.level, children: r.level }),
            ],
          }),
          t.jsx(rl, {
            kind: 'xp',
            label: `${o('chrome.xp')} · ${Math.round(i)}%`,
            icon: 'plus',
            value: r.xp,
            max: r.xpMax,
          }),
          t.jsx(rl, {
            kind: 'energy',
            label: o('chrome.energy'),
            icon: 'stamina',
            value: r.energy,
            max: r.energyMax,
          }),
        ],
      }),
      t.jsxs('section', {
        className: 'status-section status-section-vitals',
        children: [
          t.jsxs('h3', {
            className: 'status-section-title',
            children: [
              t.jsx(zs, { name: 'heart' }),
              o('chrome.vitals', { defaultValue: 'Vitals' }),
            ],
          }),
          t.jsx(rl, {
            kind: 'hits',
            label: o('status.short.hp'),
            icon: 'heart',
            value: (a == null ? void 0 : a.hits) ?? 0,
            max: (a == null ? void 0 : a.hitsMax) ?? 0,
          }),
          t.jsx(rl, {
            kind: 'mana',
            label: o('status.short.mp'),
            icon: 'mana',
            value: (a == null ? void 0 : a.mana) ?? 0,
            max: (a == null ? void 0 : a.manaMax) ?? 0,
          }),
          t.jsx(rl, {
            kind: 'stam',
            label: o('status.short.st'),
            icon: 'stamina',
            value: (a == null ? void 0 : a.stam) ?? 0,
            max: (a == null ? void 0 : a.stamMax) ?? 0,
          }),
        ],
      }),
      t.jsxs('section', {
        className: 'status-section status-section-attrs',
        children: [
          t.jsxs('h3', {
            className: 'status-section-title',
            children: [
              t.jsx(zs, { name: 'shield' }),
              o('chrome.attributes', { defaultValue: 'Atributos' }),
            ],
          }),
          t.jsxs('div', {
            className: 'status-chips',
            children: [
              t.jsx(il, {
                label: o('status.short.str'),
                value: s
                  ? t.jsx(yh, { s: s.atrib.str })
                  : String((a == null ? void 0 : a.str) ?? '—'),
                icon: 'swords',
                soma: 'str',
              }),
              t.jsx(il, {
                label: o('status.short.dex'),
                value: s
                  ? t.jsx(yh, { s: s.atrib.dex })
                  : String((a == null ? void 0 : a.dex) ?? '—'),
                icon: 'compass',
                soma: 'dex',
              }),
              t.jsx(il, {
                label: o('status.short.int'),
                value: s
                  ? t.jsx(yh, { s: s.atrib.int })
                  : String((a == null ? void 0 : a.int) ?? '—'),
                icon: 'mana',
                soma: 'int',
              }),
              t.jsx(il, {
                label: o('hud.gold'),
                value: String((a == null ? void 0 : a.gold) ?? 0),
                icon: 'gold',
              }),
              t.jsx(il, {
                label: o('hud.weight', { defaultValue: 'Peso' }),
                value: uN(
                  (a == null ? void 0 : a.weight) ?? 0,
                  (a == null ? void 0 : a.weightMax) ?? 0
                ),
                icon: 'pawn',
              }),
            ],
          }),
          s
            ? t.jsxs('p', {
                className: 'status-soma-legenda',
                'data-status-somas': !0,
                children: [
                  t.jsx('span', {
                    className: 'status-soma-base',
                    children: o('personagem.soma.base'),
                  }),
                  t.jsx('span', {
                    className: 'status-soma-itens',
                    children: o('personagem.soma.itens'),
                  }),
                  t.jsx('span', {
                    className: 'status-soma-outros',
                    children: o('personagem.soma.outros'),
                  }),
                ],
              })
            : null,
        ],
      }),
    ],
  });
}
function zx(e) {
  return e.replace(/\+\s?-/g, '−').replace(/[−-]\s?-/g, '+');
}
function nI({ bonus: e }) {
  var n;
  const { t: a } = Se();
  return t.jsxs('div', {
    className: 'status-body personagem-extras',
    children: [
      t.jsxs('section', {
        className: 'status-section status-section-resist',
        'data-status-resist': !0,
        children: [
          t.jsxs('h3', {
            className: 'status-section-title',
            children: [t.jsx(zs, { name: 'shield' }), a('personagem.resistencias')],
          }),
          t.jsx('ul', {
            className: 'status-resist',
            children: e.resist.map((s) =>
              t.jsxs(
                'li',
                {
                  className: `status-resist-${s.t}`,
                  'data-resist': s.t,
                  'data-resist-valor': s.v,
                  children: [
                    t.jsx('span', {
                      className: 'status-resist-nome',
                      children: a(`personagem.resist.${s.t}`),
                    }),
                    t.jsxs('strong', { children: [s.v, '%'] }),
                    t.jsxs('small', {
                      children: [
                        s.itens
                          ? t.jsxs('span', {
                              className: 'status-soma-itens',
                              children: ['+', s.itens, ' '],
                            })
                          : null,
                        t.jsx('span', {
                          className: 'status-resist-max',
                          children: a('personagem.resistMax', { v: s.max }),
                        }),
                      ],
                    }),
                  ],
                },
                s.t
              )
            ),
          }),
        ],
      }),
      t.jsxs('section', {
        className: 'status-section status-section-bonus',
        'data-status-arvore': !0,
        children: [
          t.jsxs('h3', {
            className: 'status-section-title',
            children: [t.jsx(zs, { name: 'plus' }), a('personagem.arvoreBonus.titulo')],
          }),
          (n = e.arvore) != null && n.length
            ? t.jsx('ul', {
                className: 'status-bonus',
                children: e.arvore.map((s) =>
                  t.jsx(
                    'li',
                    {
                      'data-arvore': s.id,
                      children: a(`personagem.arvoreBonus.${s.id}`, { v: s.v }),
                    },
                    s.id
                  )
                ),
              })
            : t.jsx('p', {
                className: 'status-bonus-vazio',
                children: a('personagem.arvoreBonus.vazio'),
              }),
        ],
      }),
      t.jsxs('section', {
        className: 'status-section status-section-bonus',
        'data-status-bonus': !0,
        children: [
          t.jsxs('h3', {
            className: 'status-section-title',
            children: [t.jsx(zs, { name: 'plus' }), a('personagem.bonusItens')],
          }),
          e.bonus.length || e.skills.length
            ? t.jsxs('ul', {
                className: 'status-bonus',
                children: [
                  e.bonus.map((s) =>
                    t.jsx(
                      'li',
                      {
                        'data-bonus': s.id,
                        children: zx(
                          a(`personagem.bonusItem.${s.id}`, {
                            v: s.v,
                            defaultValue: `${s.id} ${s.v}`,
                          })
                        ),
                      },
                      s.id
                    )
                  ),
                  e.skills.map((s) => {
                    const o = jc[s.id];
                    return t.jsx(
                      'li',
                      {
                        'data-bonus': `skill-${o ?? s.id}`,
                        children: zx(
                          a('personagem.bonusSkill', {
                            skill: o ? a(`skillNames.${o}`) : `#${s.id}`,
                            v: s.v,
                          })
                        ),
                      },
                      `skill-${s.id}`
                    );
                  }),
                ],
              })
            : t.jsx('p', { className: 'status-bonus-vazio', children: a('personagem.semBonus') }),
        ],
      }),
    ],
  });
}
