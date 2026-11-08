/* Theme-matrix card art, painted in each card's own palette.
 *
 *   family scene    one bespoke scene per family, defined in families.js
 *   name ending     the theme's ending adds a modifier layer on top
 *                   (shards → cracks, vortex → spiral, phantom → haze …),
 *                   so the 12 cards of one family never look the same
 *   mashup          base family's scene × accent family's scene, spliced
 *                   along a glowing diagonal seam
 *
 * Everything is seeded from the theme id, so a card always renders the same
 * way. All <defs> ids are suffixed per card so hundreds can share a page.
 */
window.CC_SCENE = (() => {
  const W = 160, H = 80;
  const f = n => (+n).toFixed(1);
  const times = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');
  const seedOf = str => { let h = 2166136261; for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const glow = s => `<filter id="gl${s}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  const FAM = () => window.CC_FAMILIES || {};

  /* ---------- the name-ending rule ----------
     Each token of a theme's ending (the part after the family name) is matched
     against these patterns; a card gets at most two modifiers plus an optional
     horizon shift. Endings that match nothing get one modifier picked from the
     seed, so even a one-off name still differs from its siblings. */
  const RULES = [
    ['crack', /^(shards?|shrapnel|cracked|broken|ruin|fallout|gridfall)$/],
    ['spiral', /^(vortex|singularity|cascade|helix|cyclone)$/],
    ['phantom', /^(phantom|ghost|spectre|specter|shadow|mirage|wraith)$/],
    ['glitch', /^(glitch|cipher|static|logic|corrupt)$/],
    ['streak', /^(drift|flux|drive|cruise|transit|outrun|nightrun|wind|run)$/],
    ['echo', /^(echo|array|delta|lattice|mirror)$/],
    ['pulse', /^(pulse|signal|beacon|wave|beam|relay)$/],
    ['nodes', /^(nexus|quantum|neural|network|link|circuit|grid|node)$/],
    ['bits', /^(bitstream|bitrate|bit|binary|data|t800|machine|system|token)$/],
    ['prompt', /^(terminal|kernel|daemon|hacker|mainframe|command|shell|tty)$/],
    ['void', /^(void|blackout|null|midnight|deep|black|abyss)$/],
    ['prism', /^(prismatic|neon|aurora|ultraviolet|blacklight|glow|lumen|afterglow|afterlight)$/],
    ['speed', /^(overdrive|overclock|redline|flare|spark|nova|laser|hyperion)$/],
    ['frost', /^(subzero|cryon|ice|arctic|frost|glacier)$/],
    ['stars', /^(astral|ether|orbital|space|lunar|solar|ion|cosmic|star)$/],
    ['scan', /^(analog|retro|vinyl|cassette|arcade|crt|tape)$/],
    ['core', /^(core|prime|alpha|plasma|heart|forge|reactor)$/],
    ['wire', /^(cyber|synthetic|vector|chrome|steel|titanium|iron|wire|wired|servo)$/],
    ['hex', /^(hex|hexa|cell)$/],
    ['smog', /^(smog|ash|ashfall|dust|dustline|wasteland|smoke|rot|quarantine|ward|sector|slum|ration|rebel|exile|scarcity)$/],
    ['rain', /^(rain|rainline|storm|noir)$/]
  ];
  const HORIZON = [['high', /^(zenith|apex|sky|spire|summit|high)$/], ['low', /^(horizon|dawn|sunset|dusk|evening|low)$/]];
  const FALLBACK = ['echo', 'stars', 'nodes', 'scan', 'prism', 'streak', 'pulse', 'wire', 'hex', 'core'];
  function modsFor(id, family, r) {
    const ending = family && id.startsWith(`${family}-`) ? id.slice(family.length + 1) : (family === id ? '' : id);
    const tokens = ending.split('-').filter(Boolean);
    const mods = [];
    let horizon = null;
    for (const t of tokens) {
      for (const [name, re] of HORIZON) if (re.test(t)) horizon = name;
      for (const [name, re] of RULES) if (re.test(t) && !mods.includes(name) && mods.length < 2) mods.push(name);
    }
    if (!mods.length && !horizon) mods.push(FALLBACK[Math.floor(r() * FALLBACK.length)]);
    return { mods, horizon };
  }

  const OVERLAY = {
    crack(k) {
      const x = 20 + k.r() * 120, y = 10 + k.r() * 60;
      return `<g stroke="${k.c('white')}" stroke-width=".6" fill="none" opacity=".85">${times(5, () => { let d = `M${f(x)} ${f(y)}`, cx = x, cy = y; const a = k.r() * Math.PI * 2; for (let i = 0; i < 4; i++) { cx += Math.cos(a + (k.r() - .5)) * (6 + k.r() * 8); cy += Math.sin(a + (k.r() - .5)) * (6 + k.r() * 8); d += `L${f(cx)} ${f(cy)}`; } return `<path d="${d}"/>`; })}</g>`;
    },
    spiral(k) {
      const cx = 30 + k.r() * 100, cy = 20 + k.r() * 40; let d = '';
      for (let t = 0; t < 5 * Math.PI; t += .25) { const r = 1.2 * Math.exp(.2 * t); d += `${t ? 'L' : 'M'}${f(cx + Math.cos(t) * r * 1.6)} ${f(cy + Math.sin(t) * r)}`; }
      return `<path d="${d}" fill="none" stroke="${k.A}" stroke-width=".7" opacity=".55" ${k.gl}/>`;
    },
    phantom(k) { return `<g fill="${k.c('white')}" opacity=".1">${times(5, () => `<ellipse cx="${f(k.r() * W)}" cy="${f(k.r() * H)}" rx="${f(20 + k.r() * 26)}" ry="${f(4 + k.r() * 5)}"/>`)}</g>`; },
    glitch(k) { return times(4, i => `<rect x="${f(k.r() * W * .6)}" y="${f(k.r() * H)}" width="${f(16 + k.r() * 50)}" height="${f(.6 + k.r() * 1.8)}" fill="${i % 2 ? k.c('hot_pink') : k.c('cyan')}" opacity=".5" style="mix-blend-mode:screen"/>`); },
    streak(k) { return `<g stroke="${k.c('white')}" stroke-width=".5" opacity=".28">${times(9, () => { const x = k.r() * W, y = k.r() * H, l = 10 + k.r() * 24; return `<path d="M${f(x)} ${f(y)}l${f(l)} ${f(-l * .35)}"/>`; })}</g>`; },
    echo(k) { const x = k.r() * W, y = k.r() * H; return `<g fill="none" stroke="${k.A}">${times(4, i => `<circle cx="${f(x)}" cy="${f(y)}" r="${8 + i * 9}" opacity="${f(.5 - i * .11)}" stroke-width=".7"/>`)}</g>`; },
    pulse(k) { const x = 20 + k.r() * 120, y = 14 + k.r() * 50; return `<g fill="none" stroke="${k.B}" ${k.gl}><circle cx="${f(x)}" cy="${f(y)}" r="3" fill="${k.B}"/><circle cx="${f(x)}" cy="${f(y)}" r="8" opacity=".6"/><circle cx="${f(x)}" cy="${f(y)}" r="14" opacity=".3"/></g>`; },
    nodes(k) { const pts = Array.from({ length: 6 }, () => [k.r() * W, k.r() * H]); return `<g stroke="${k.A}" stroke-width=".4" opacity=".55">${pts.map(([x, y], i) => i ? `<path d="M${f(x)} ${f(y)}L${f(pts[i - 1][0])} ${f(pts[i - 1][1])}"/>` : '').join('')}</g><g fill="${k.A}">${pts.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="1.3"/>`).join('')}</g>`; },
    bits(k) { return `<g font-family="monospace" font-size="3.6" fill="${k.A}" opacity=".6">${times(14, i => `<text x="${W - 7}" y="${6 + i * 5.4}">${k.r() < .5 ? 0 : 1}${k.r() < .5 ? 0 : 1}</text>`)}</g>`; },
    prompt(k) { return `<rect x="${W - 26}" y="${H - 12}" width="22" height="9" rx="1" fill="${k.c('bg')}" stroke="${k.A}" stroke-width=".6"/><text x="${W - 23}" y="${H - 5.5}" font-family="monospace" font-size="5.5" fill="${k.A}">&gt;_</text>`; },
    void(k) { k.def(`<radialGradient id="${k.id('vg')}"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient>`); return `<rect width="${W}" height="${H}" fill="url(#${k.id('vg')})"/>`; },
    prism(k) { k.def(`<linearGradient id="${k.id('pr')}" x1="0" x2="1"><stop stop-color="${k.c('hot_pink')}"/><stop offset=".25" stop-color="${k.c('orange')}"/><stop offset=".5" stop-color="${k.c('acid_green')}"/><stop offset=".75" stop-color="${k.c('cyan')}"/><stop offset="1" stop-color="${k.c('purple')}"/></linearGradient>`); return `<rect width="${W}" height="1.6" fill="url(#${k.id('pr')})" ${k.gl}/><rect y="${H - 1.6}" width="${W}" height="1.6" fill="url(#${k.id('pr')})" opacity=".7"/><rect width="${W}" height="${H}" fill="url(#${k.id('pr')})" opacity=".07"/>`; },
    speed(k) { return `<g stroke="${k.B}" stroke-width=".6">${times(8, () => { const y = k.r() * H, l = 14 + k.r() * 40; return `<path d="M0 ${f(y)}h${f(l)}" opacity="${f(.25 + k.r() * .4)}"/>`; })}</g>`; },
    frost(k) {
      const corner = (x, y, sx, sy) => `<g stroke="${k.c('white')}" stroke-width=".55" fill="none" opacity=".75">${times(5, i => { const l = 6 + k.r() * 12, a = (i / 4) * Math.PI / 2; const mx = x + Math.cos(a) * l * .55 * sx, my = y + Math.sin(a) * l * .55 * sy; return `<path d="M${x} ${y}L${f(x + Math.cos(a) * l * sx)} ${f(y + Math.sin(a) * l * sy)}M${f(mx)} ${f(my)}l${f(3 * sx)} ${f(-2 * sy)}"/>`; })}</g>`;
      return corner(0, 0, 1, 1) + corner(W, H, -1, -1);
    },
    stars(k) { return `<g fill="${k.c('white')}">${times(14, () => `<circle cx="${f(k.r() * W)}" cy="${f(k.r() * H * .7)}" r="${(.3 + k.r() * .5).toFixed(2)}" opacity="${(.4 + k.r() * .6).toFixed(2)}"/>`)}</g>`; },
    scan(k) { k.def(`<pattern id="${k.id('sl')}" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="2" height="1" fill="#000" opacity=".28"/></pattern>`); return `<rect width="${W}" height="${H}" fill="url(#${k.id('sl')})"/>`; },
    core(k) { k.def(`<radialGradient id="${k.id('cr')}"><stop stop-color="${k.c('white')}"/><stop offset=".35" stop-color="${k.A}" stop-opacity=".8"/><stop offset="1" stop-color="${k.A}" stop-opacity="0"/></radialGradient>`); return `<circle cx="${f(24 + k.r() * 112)}" cy="${f(14 + k.r() * 52)}" r="9" fill="url(#${k.id('cr')})"/>`; },
    wire(k) { return `<g stroke="${k.A}" stroke-width=".3" opacity=".3">${times(9, i => `<path d="M${i * 20} 0V${H}"/>`)}${times(5, i => `<path d="M0 ${i * 20}H${W}"/>`)}</g>`; },
    hex(k) { k.def(`<pattern id="${k.id('hx')}" width="10" height="17.3" patternUnits="userSpaceOnUse"><path d="M5 0l5 2.9v5.8L5 11.5 0 8.7V2.9ZM5 11.5v5.8" fill="none" stroke="${k.A}" stroke-width=".4"/></pattern>`); return `<rect width="${W}" height="${H}" fill="url(#${k.id('hx')})" opacity=".35"/>`; },
    smog(k) { return `<g fill="${k.c('muted')}" opacity=".22">${times(5, () => `<ellipse cx="${f(k.r() * W)}" cy="${f(k.r() * H)}" rx="${f(20 + k.r() * 24)}" ry="${f(3 + k.r() * 4)}"/>`)}</g>`; },
    rain(k) { return `<g stroke="${k.c('white')}" stroke-width=".35" opacity=".45">${times(26, () => { const x = k.r() * (W + 10), y = k.r() * H; return `<path d="M${f(x)} ${f(y)}l-1.4 5"/>`; })}</g>`; }
  };

  /* ---------- scene context ---------- */
  const ALIAS = { acid: 'acid_green', pink: 'hot_pink' };
  function context(id, p, family, s, r) {
    const fam = FAM()[family] || FAM().default;
    const defs = [];
    const c = key => `#${p[ALIAS[key] || key] || p.white || 'ffffff'}`;
    const { mods, horizon } = modsFor(id, family, r);
    return {
      c, r, s, defs, mods, fam,
      A: c(fam?.a || 'cyan'), B: c(fam?.b || 'purple'),
      hz: horizon === 'high' ? 44 : horizon === 'low' ? 62 : 56,
      id: name => `${name}${s}`,
      def: svg => defs.push(svg),
      gl: `filter="url(#gl${s})"`
    };
  }
  // One family's scene + its name-ending overlays, as an inner SVG fragment.
  function paint(id, p, family, s) {
    const r = rng(seedOf(id + s));
    const k = context(id, p, family, s, r);
    if (!k.fam) return { defs: '', body: `<rect width="${W}" height="${H}" fill="${k.c('bg')}"/>` };
    const scene = k.fam.scene(k);
    const phantom = k.mods.includes('phantom');
    const overlays = k.mods.map(m => OVERLAY[m]?.(k) || '').join('');
    const body = `<rect width="${W}" height="${H}" fill="${k.c('bg')}"/><g${phantom ? ' opacity=".62"' : ''}>${scene}</g>${overlays}`;
    return { defs: glow(s) + k.defs.join(''), body };
  }

  /* scene(id, palette, family, blend?) → <svg> string.
     blend = { baseFamily, accentFamily } for mashups. */
  return function scene(id, p, family, blend) {
    const s = id.replace(/[^a-z0-9]/gi, '');
    if (blend) {
      const base = paint(id, p, blend.baseFamily, `${s}a`), accent = paint(id, p, blend.accentFamily, `${s}b`);
      const seam = 'M104 0L56 80';
      return `<svg class="scene" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs>${base.defs}${accent.defs}${glow(`${s}m`)}<clipPath id="L${s}"><path d="M0 0H104L56 80H0Z"/></clipPath><clipPath id="R${s}"><path d="M104 0H${W}V${H}H56Z"/></clipPath></defs>
        <g clip-path="url(#L${s})">${base.body}</g><g clip-path="url(#R${s})">${accent.body}</g><path d="${seam}" stroke="#${p.white}" stroke-width="1.6" filter="url(#gl${s}m)"/><path d="${seam}" stroke="#${p.hot_pink}" stroke-width=".6"/></svg>`;
    }
    const known = FAM()[family] ? family : 'default';
    const { defs, body } = paint(id, p, known, s);
    return `<svg class="scene" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs>${defs}</defs>${body}</svg>`;
  };
})();
