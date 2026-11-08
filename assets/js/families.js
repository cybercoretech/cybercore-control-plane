/* CYBERCORE family definitions: one entry per registry family.
 *
 * Each family owns everything the Control Plane shows for it:
 *   label / short   matrix + inventory names
 *   color           tab accent and count badge
 *   desc            one-line description (Family Signals, card footers)
 *   a / b           palette slots the card scene leans on (primary / secondary)
 *   icon            48×48 tab emblem, drawn in currentColor
 *   scene(k)        160×80 card art, painted in the card's own palette
 *
 * Scenes receive a context `k` (see scenes.js): k.c(slot) colour, k.A / k.B
 * primary / secondary colours, k.r() seeded random, k.hz horizon line,
 * k.id(name) unique defs id, k.def(svg) to add <defs>, k.gl glow filter attr.
 * The name-ending rule (shards → cracks, vortex → spiral …) is layered on top
 * by scenes.js, so the 12 cards of a family never look the same.
 */
(() => {
  const W = 160, H = 80;
  const f = n => (+n).toFixed(1);
  const times = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');
  const F = 'fill="currentColor" stroke="none"';

  /* ---------- shared drawing helpers ---------- */
  // Classic sheet ghost: dome centred (x, cy), radius 10·s, hem at cy + 12·s.
  const ghostPath = (x, cy, s = 1) => {
    const R = 10 * s, step = (2 * R) / 6;
    let d = `M${f(x - R)} ${f(cy + 12 * s)}V${f(cy)}A${f(R)} ${f(R)} 0 0 1 ${f(x + R)} ${f(cy)}V${f(cy + 12 * s)}`;
    for (let i = 0; i < 6; i++) d += `l${f(-step)} ${f(i % 2 ? 3 * s : -3 * s)}`;
    return d + 'Z';
  };
  const ghostEyes = (x, cy, s, fill) => `<circle cx="${f(x - 3.6 * s)}" cy="${f(cy)}" r="${f(1.7 * s)}" fill="${fill}"/><circle cx="${f(x + 3.6 * s)}" cy="${f(cy)}" r="${f(1.7 * s)}" fill="${fill}"/>`;
  const stars = (k, n = 10, maxY = 40) => `<g fill="${k.c('white')}">${times(n, () => `<circle cx="${f(k.r() * W)}" cy="${f(k.r() * maxY)}" r="${(.25 + k.r() * .5).toFixed(2)}" opacity="${(.4 + k.r() * .6).toFixed(2)}"/>`)}</g>`;
  // Perspective floor grid from the horizon down, vanishing at (vx, hz).
  const floor = (k, color, vx = 80, rows = 6, cols = 9, sw = .6) => {
    const hz = k.hz;
    const horiz = times(rows, i => { const y = hz + (H - hz) * Math.pow((i + 1) / rows, 1.8); return `<path d="M0 ${f(y)}H${W}"/>`; });
    const vert = times(cols * 2 + 1, i => { const x = vx + (i - cols) * 26; return `<path d="M${vx} ${hz}L${f(x)} ${H}"/>`; });
    return `<g stroke="${color}" stroke-width="${sw}" fill="none" opacity=".8">${horiz}${vert}</g>`;
  };
  // Row of buildings standing on y0.
  const skyline = (k, y0, n, minH, maxH, fill, stroke, lit = .25, winColor) => {
    let x = -4, out = '';
    for (let i = 0; i < n && x < W; i++) {
      const w = 8 + k.r() * 14, h = minH + k.r() * (maxH - minH), y = y0 - h;
      out += `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" stroke="${stroke}" stroke-width=".5"/>`;
      if (winColor) for (let wy = y + 3; wy < y0 - 3; wy += 4) for (let wx = x + 2; wx < x + w - 2; wx += 3) if (k.r() < lit) out += `<rect x="${f(wx)}" y="${f(wy)}" width="1.4" height="1.6" fill="${winColor}"/>`;
      x += w + k.r() * 2;
    }
    return out;
  };
  // Window chrome: frame + title bar with three dots.
  const windowFrame = (k, x, y, w, h, accent) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${k.c('panel')}" stroke="${accent}" stroke-width=".8"/><rect x="${x}" y="${y}" width="${w}" height="5" fill="${accent}" opacity=".25"/>${times(3, i => `<circle cx="${x + 3.5 + i * 3.5}" cy="${y + 2.5}" r="1" fill="${[k.c('red'), k.c('orange'), k.c('acid_green')][i]}"/>`)}`;
  // Lines of "code": coloured token bars.
  const codeLines = (k, x, y, n, maxW, gap = 4.2, palette = ['hot_pink', 'cyan', 'acid_green', 'orange', 'purple', 'white']) => times(n, i => {
    let cx = x + (k.r() < .3 ? 5 : 0), row = '';
    const toks = 1 + Math.floor(k.r() * 4);
    for (let t = 0; t < toks && cx < x + maxW; t++) { const w = 3 + k.r() * 12; row += `<rect x="${f(cx)}" y="${f(y + i * gap)}" width="${f(Math.min(w, x + maxW - cx))}" height="1.6" fill="${k.c(palette[Math.floor(k.r() * palette.length)])}" opacity=".85"/>`; cx += w + 2; }
    return row;
  });
  const wave = (x0, x1, y, amp, freq, phase = 0, step = 2) => { let d = ''; for (let x = x0; x <= x1; x += step) d += `${x === x0 ? 'M' : 'L'}${f(x)} ${f(y + Math.sin((x - x0) / (x1 - x0) * Math.PI * 2 * freq + phase) * amp)}`; return d; };
  const frostCorner = (k, x, y, sx, sy, color) => `<g stroke="${color}" stroke-width=".6" fill="none" opacity=".85">${times(5, i => { const l = 6 + k.r() * 10, a = (i / 4) * Math.PI / 2; const ex = x + Math.cos(a) * l * sx, ey = y + Math.sin(a) * l * sy; const mx = x + Math.cos(a) * l * .55 * sx, my = y + Math.sin(a) * l * .55 * sy; return `<path d="M${x} ${y}L${f(ex)} ${f(ey)}M${f(mx)} ${f(my)}l${f(3 * sx)} ${f(-2 * sy)}M${f(mx)} ${f(my)}l${f(-2 * sx)} ${f(3 * sy)}"/>`; })}</g>`;
  const crtMonitor = (k, x, y, w, h, accent) => `<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 10}" rx="4" fill="${k.c('panel')}" stroke="${k.c('line')}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${k.c('bg')}" stroke="${accent}" stroke-width=".8"/><rect x="${x + w / 2 - 8}" y="${y + h + 6}" width="16" height="3" fill="${k.c('line')}"/>`;
  const hexPts = (cx, cy, r, rot = -Math.PI / 2) => times(6, i => { const a = rot + i * Math.PI / 3; return `${f(cx + r * Math.cos(a))},${f(cy + r * Math.sin(a))} `; }).trim();
  const tiles = (k, x, y, w, h, accent, active = 1) => {
    const cells = [[x, y, w * .45, h], [x + w * .47, y, w * .53, h * .48], [x + w * .47, y + h * .52, w * .25, h * .48], [x + w * .74, y + h * .52, w * .26, h * .48]];
    return cells.map(([cx, cy, cw, ch], i) => `<rect x="${f(cx)}" y="${f(cy)}" width="${f(cw)}" height="${f(ch)}" fill="${k.c('panel')}" stroke="${i === active ? accent : k.c('line')}" stroke-width="${i === active ? 1 : .6}"/>`).join('');
  };
  const bar = (k, accent) => `<rect x="0" y="0" width="${W}" height="6" fill="${k.c('panel')}"/><g fill="${accent}">${times(5, i => `<rect x="${4 + i * 6}" y="2" width="4" height="2" opacity="${i === 1 ? 1 : .45}"/>`)}</g><rect x="122" y="2" width="12" height="2" fill="${k.c('muted')}"/><rect x="138" y="2" width="18" height="2" fill="${accent}" opacity=".7"/>`;

  /* ---------- the 50 families ---------- */
  const FAMILIES = {
    alien: {
      label: 'ALIEN', color: '#9b7cff', a: 'purple', b: 'acid_green', desc: 'extraterrestrial signals, saucers and orbital patterns',
      icon: `<path d="M8 22c0-5 7-8 16-8s16 3 16 8-7 6-16 6-16-1-16-6Z"/><path d="M16 15a8 7 0 0 1 16 0"/><path d="M18 29l-5 13M30 29l5 13M24 30v12" opacity=".7"/><circle cx="17" cy="22" r="1.5" ${F}/><circle cx="24" cy="23" r="1.5" ${F}/><circle cx="31" cy="22" r="1.5" ${F}/>`,
      scene(k) {
        const px = 112 + k.r() * 16, py = k.hz - 22, sx = 28 + k.r() * 30;
        return `${stars(k, 16, k.hz)}<circle cx="${f(px)}" cy="${f(py)}" r="15" fill="${k.c('panel')}" stroke="${k.A}"/><path d="M${f(px - 13)} ${f(py - 4)}q13 6 26 0" stroke="${k.A}" fill="none" opacity=".5"/><ellipse cx="${f(px)}" cy="${f(py)}" rx="26" ry="6" transform="rotate(-16 ${f(px)} ${f(py)})" fill="none" stroke="${k.B}" stroke-width="1.2" ${k.gl}/>
          <path d="M${f(sx - 7)} 26L${f(sx - 18)} ${k.hz}H${f(sx + 18)}L${f(sx + 7)} 26Z" fill="${k.B}" opacity=".18"/><path d="M0 ${k.hz}H${W}" stroke="${k.c('line')}"/>
          <ellipse cx="${f(sx)}" cy="22" rx="15" ry="4.5" fill="${k.c('panel')}" stroke="${k.A}" ${k.gl}/><path d="M${f(sx - 7)} 19a7 6 0 0 1 14 0" fill="${k.B}" opacity=".5"/>${times(4, i => `<circle cx="${f(sx - 9 + i * 6)}" cy="23" r="1" fill="${k.B}"/>`)}`;
      }
    },
    'cybercore-tech': {
      label: 'CYBERCORE TECH / MASTER MIX', short: 'MASTER', color: '#39ff33', a: 'acid_green', b: 'cyan', desc: 'the governed master palette: circuit traces into the hex core',
      icon: `<path d="M24 4 41.3 14v20L24 44 6.7 34V14Z"/><path d="M29.5 18.5a8 8 0 1 0 0 11" stroke-width="3" stroke-linecap="square"/><rect x="22" y="22" width="4" height="4" ${F}/>`,
      scene(k) {
        const cx = 80, cy = 40, R = 15, cols = ['cyan', 'acid_green', 'orange', 'red', 'hot_pink', 'purple'];
        const arcs = cols.map((key, i) => { const a0 = Math.PI / 3 * i - Math.PI / 2 + .12, a1 = a0 + Math.PI / 3 - .24, rr = R + 6; return `<path d="M${f(cx + rr * Math.cos(a0))} ${f(cy + rr * Math.sin(a0))}A${rr} ${rr} 0 0 1 ${f(cx + rr * Math.cos(a1))} ${f(cy + rr * Math.sin(a1))}" stroke="${k.c(key)}"/>`; }).join('');
        const traces = [['M58 40H34V18H10', 'cyan'], ['M58 34H44V8H22', 'purple'], ['M58 46H40V66H8', 'hot_pink'], ['M102 40H128V60H152', 'acid_green'], ['M102 34H118V12H150', 'orange'], ['M102 46H112V72H140', 'red']];
        k.def(`<pattern id="${k.id('gr')}" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r=".5" fill="${k.c('line')}"/></pattern>`);
        return `<rect width="${W}" height="${H}" fill="url(#${k.id('gr')})"/><g fill="none" stroke-width="1" ${k.gl}>${traces.map(([d, key]) => `<path d="${d}" stroke="${k.c(key)}"/>`).join('')}</g>
          ${traces.map(([d, key]) => { const pts = d.match(/[\d.]+/g); return `<rect x="${pts[pts.length - 2] - 1.6}" y="${pts[pts.length - 1] - 1.6}" width="3.2" height="3.2" fill="${k.c(key)}"/>`; }).join('')}
          <polygon points="${hexPts(cx, cy, R + 12)}" fill="none" stroke="${k.c('hot_pink')}" stroke-width="1.2" ${k.gl}/><g fill="none" stroke-width="2.2" stroke-linecap="round">${arcs}</g>
          <polygon points="${hexPts(cx, cy, R - 3)}" fill="${k.c('panel')}" stroke="${k.c('white')}" stroke-width=".8"/><path d="M${cx + 4.6} ${cy - 4.6}a6.5 6.5 0 1 0 0 9.2" fill="none" stroke="${k.c('white')}" stroke-width="2.4"/><rect x="${cx - 1.5}" y="${cy - 1.5}" width="3" height="3" fill="${k.c('acid_green')}"/>`;
      }
    },
    cyberdark: {
      label: 'CYBERDARK', color: '#00e5ff', a: 'cyan', b: 'purple', desc: 'deep-space darkness with a wireframe moon and electric telemetry',
      icon: `<path d="M30 7a17 17 0 1 0 11 27A14 14 0 0 1 30 7Z"/><circle cx="36" cy="14" r="2.6" ${F}/><path d="M36 17v7h6" stroke-width="1.8"/>`,
      scene(k) {
        const mx = 104 + k.r() * 20, my = 30, R = 19;
        return `${stars(k, 22, 70)}<circle cx="${f(mx)}" cy="${my}" r="${R}" fill="${k.c('panel')}" stroke="${k.A}" ${k.gl}/>
          <g fill="none" stroke="${k.A}" stroke-width=".5" opacity=".7">${times(3, i => `<ellipse cx="${f(mx)}" cy="${my}" rx="${f(R * (i + 1) / 4)}" ry="${R}"/>`)}${times(3, i => `<path d="M${f(mx - R * Math.cos(Math.asin((i - 1) * .5)))} ${f(my + (i - 1) * R * .5)}H${f(mx + R * Math.cos(Math.asin((i - 1) * .5)))}"/>`)}</g>
          <path d="M${f(mx - 26)} ${my - 18}a30 30 0 0 1 10 -6" stroke="${k.B}" fill="none"/><g fill="${k.A}">${times(30, i => `<rect x="${4 + i * 5.2}" y="${f(72 - (i % 5 ? 2 : 5))}" width="1" height="${i % 5 ? 2 : 5}" opacity=".7"/>`)}</g>
          <path d="M8 18h18l4 4h12" stroke="${k.B}" fill="none" stroke-width=".8"/><circle cx="42" cy="22" r="1.6" fill="${k.B}"/>`;
      }
    },
    'cyberdark-grid': {
      label: 'CYBERDARK GRID', color: '#4cc9f0', a: 'cyan', b: 'white', desc: 'precision grids running to the vanishing point',
      icon: `<path d="M24 14 44 40H4Z"/><path d="M24 14v26M14 27l-6 13M34 27l6 13M8.6 34h30.8M12 29h24" stroke-width="1.6"/>`,
      scene(k) {
        const cx = 80 + (k.r() - .5) * 40, cy = k.hz - 18, s = 9;
        k.def(`<pattern id="${k.id('sk')}" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" stroke="${k.c('line')}" stroke-width=".35"/></pattern>`);
        return `<rect width="${W}" height="${k.hz}" fill="url(#${k.id('sk')})" opacity=".7"/>${floor(k, k.A, 80, 7, 8)}<path d="M0 ${k.hz}H${W}" stroke="${k.A}" ${k.gl}/>
          <g fill="none" stroke="${k.B}" stroke-width=".9" ${k.gl}><rect x="${f(cx - s)}" y="${f(cy - s)}" width="${2 * s}" height="${2 * s}"/><rect x="${f(cx - s + 5)}" y="${f(cy - s - 5)}" width="${2 * s}" height="${2 * s}" opacity=".7"/><path d="M${f(cx - s)} ${f(cy - s)}l5 -5M${f(cx + s)} ${f(cy - s)}l5 -5M${f(cx + s)} ${f(cy + s)}l5 -5M${f(cx - s)} ${f(cy + s)}l5 -5" opacity=".7"/></g>`;
      }
    },
    'cyberdark-industrial': {
      label: 'CYBERDARK INDUSTRIAL', color: '#ff9d3d', a: 'orange', b: 'acid_green', desc: 'factory stacks, pistons and a conveyor of glowing blocks',
      icon: `<circle cx="24" cy="24" r="8"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M11.3 36.7l4.2-4.2M32.5 15.5l4.2-4.2"/><circle cx="24" cy="24" r="2.5" ${F}/>`,
      scene(k) {
        const g = 62;
        const stacks = times(3, i => { const x = 14 + i * 22 + k.r() * 6, h = 26 + k.r() * 18; return `<rect x="${f(x)}" y="${f(g - h)}" width="7" height="${f(h)}" fill="${k.c('panel')}" stroke="${k.c('line')}"/><rect x="${f(x - 1)}" y="${f(g - h)}" width="9" height="2" fill="${k.A}"/>${times(3, j => `<ellipse cx="${f(x + 3.5 + j * 4 + k.r() * 3)}" cy="${f(g - h - 4 - j * 5)}" rx="${f(3 + j * 2)}" ry="${f(1.6 + j)}" fill="${k.c('muted')}" opacity="${f(.35 - j * .08)}"/>`)}`; });
        const pistons = times(3, i => { const x = 96 + i * 18, ext = 6 + k.r() * 14; return `<rect x="${x}" y="22" width="12" height="8" fill="${k.c('panel')}" stroke="${k.c('line')}"/><rect x="${x + 4}" y="30" width="4" height="${f(ext)}" fill="${k.c('muted')}"/><rect x="${x + 1}" y="${f(30 + ext)}" width="10" height="4" fill="${k.A}"/>`; });
        return `<rect x="0" y="${g}" width="${W}" height="${H - g}" fill="${k.c('panel')}"/>${stacks}<rect x="86" y="18" width="${W - 86}" height="3" fill="${k.c('line')}"/>${pistons}
          <path d="M0 ${g}H${W}" stroke="${k.c('line')}"/><g fill="${k.B}" ${k.gl}>${times(9, i => `<rect x="${f(4 + i * 18 + k.r() * 4)}" y="${g - 5}" width="8" height="5" opacity="${f(.6 + k.r() * .4)}"/>`)}</g>
          <g stroke="${k.c('muted')}">${times(20, i => `<circle cx="${4 + i * 8}" cy="${g + 4}" r="2" fill="none"/>`)}</g><path d="M0 ${g + 9}h${W}" stroke="${k.A}" stroke-dasharray="6 4" opacity=".7"/>`;
      }
    },
    'cyberdark-ops': {
      label: 'CYBERDARK OPS', color: '#ff334f', a: 'red', b: 'cyan', desc: 'tactical maps, targeting reticles and command overlays',
      icon: `<circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="6"/><path d="M24 3v10M24 35v10M3 24h10M35 24h10"/><circle cx="24" cy="24" r="1.8" ${F}/>`,
      scene(k) {
        const tx = 40 + k.r() * 80, ty = 22 + k.r() * 36;
        const contours = times(5, i => `<path d="${wave(-4, W + 4, 12 + i * 15, 4 + k.r() * 4, 1 + k.r() * 1.5, k.r() * 6, 4)}" fill="none" stroke="${k.c('line')}" stroke-width=".7"/>`);
        return `${contours}<g fill="none" stroke="${k.B}" stroke-width=".5" opacity=".5">${times(8, i => `<path d="M${i * 20} 0V${H}"/>`)}${times(4, i => `<path d="M0 ${i * 20}H${W}"/>`)}</g>
          <path d="M${f(tx)} ${f(ty)}L${f(tx + 40)} ${f(ty - 22)}A46 46 0 0 1 ${f(tx + 46)} ${f(ty + 4)}Z" fill="${k.A}" opacity=".14"/>
          <g fill="none" stroke="${k.A}" ${k.gl}><circle cx="${f(tx)}" cy="${f(ty)}" r="12"/><circle cx="${f(tx)}" cy="${f(ty)}" r="5" stroke-dasharray="2 2"/><path d="M${f(tx)} ${f(ty - 18)}v10M${f(tx)} ${f(ty + 8)}v10M${f(tx - 18)} ${f(ty)}h10M${f(tx + 8)} ${f(ty)}h10"/></g>
          ${times(4, () => { const x = k.r() * W, y = k.r() * H; return `<path d="M${f(x)} ${f(y - 3)}l3 5h-6Z" fill="${k.B}"/>`; })}<text x="6" y="74" font-size="5" font-family="monospace" fill="${k.A}">TGT ${String(Math.floor(k.r() * 900 + 100))}</text>`;
      }
    },
    cyberdyne: {
      label: 'CYBERDYNE', color: '#ff1f3d', a: 'red', b: 'orange', desc: 'a single machine eye behind armour plate',
      icon: `<path d="M4 24 12 12h24l8 12-8 12H12Z"/><circle cx="24" cy="24" r="7"/><circle cx="24" cy="24" r="3" ${F}/>`,
      scene(k) {
        const ex = 80 + (k.r() - .5) * 20, ey = 38;
        k.def(`<radialGradient id="${k.id('ir')}"><stop stop-color="${k.c('white')}"/><stop offset=".25" stop-color="${k.A}"/><stop offset="1" stop-color="${k.c('bg')}"/></radialGradient>`);
        return `<g fill="${k.c('panel')}" stroke="${k.c('line')}"><path d="M0 8L${f(ex - 24)} 20L${f(ex - 28)} 56L0 70Z"/><path d="M${W} 8L${f(ex + 24)} 20L${f(ex + 28)} 56L${W} 70Z"/><path d="M${f(ex - 24)} 12H${f(ex + 24)}L${f(ex + 18)} 22H${f(ex - 18)}Z"/><path d="M${f(ex - 22)} 64H${f(ex + 22)}L${f(ex + 16)} 54H${f(ex - 16)}Z"/></g>
          <g stroke="${k.c('muted')}" stroke-width=".6">${times(5, i => `<circle cx="${f(8 + i * 3)}" cy="${20 + i * 9}" r=".9" fill="${k.c('muted')}"/><circle cx="${f(W - 8 - i * 3)}" cy="${20 + i * 9}" r=".9" fill="${k.c('muted')}"/>`)}</g>
          <circle cx="${f(ex)}" cy="${ey}" r="15" fill="${k.c('bg')}" stroke="${k.B}" stroke-width="1.2"/><circle cx="${f(ex)}" cy="${ey}" r="11" fill="url(#${k.id('ir')})" ${k.gl}/><circle cx="${f(ex)}" cy="${ey}" r="3" fill="${k.c('white')}"/>
          <path d="M${f(ex - 30)} ${ey}H${f(ex - 18)}M${f(ex + 18)} ${ey}H${f(ex + 30)}" stroke="${k.A}" ${k.gl}/><rect x="0" y="${f(30 + k.r() * 20)}" width="${W}" height="1.2" fill="${k.A}" opacity=".35"/>`;
      }
    },
    cyberpunk: {
      label: 'CYBERPUNK', color: '#ff0055', a: 'hot_pink', b: 'cyan', desc: 'a rain-soaked neon alley strung with wires and signs',
      icon: `<rect x="11" y="11" width="26" height="26"/><path d="M16 5v6M24 5v6M32 5v6M16 37v6M24 37v6M32 37v6M5 16h6M5 24h6M5 32h6M37 16h6M37 24h6M37 32h6" stroke-width="2"/><path d="M26.5 15 18 25.5h6.5L21.5 33l8.5-10.5h-6.5Z" ${F}/>`,
      scene(k) {
        const signs = times(5, i => { const left = i % 2 === 0, x = left ? 30 + i * 4 : 122 - i * 4, y = 10 + i * 9, h = 10 + k.r() * 10, col = [k.A, k.B, k.c('purple'), k.c('orange')][i % 4]; return `<rect x="${f(x)}" y="${f(y)}" width="5" height="${f(h)}" fill="${k.c('bg')}" stroke="${col}" ${k.gl}/>${times(3, j => `<rect x="${f(x + 1.5)}" y="${f(y + 2 + j * 3.2)}" width="2" height="1.6" fill="${col}"/>`)}`; });
        return `<path d="M0 0L52 18V64L0 ${H}Z" fill="${k.c('panel')}" stroke="${k.c('line')}"/><path d="M${W} 0L108 18V64L${W} ${H}Z" fill="${k.c('panel')}" stroke="${k.c('line')}"/>
          <path d="M52 64L0 ${H}H${W}L108 64Z" fill="${k.c('bg')}"/><path d="M52 64H108" stroke="${k.c('line')}"/><rect x="72" y="40" width="16" height="24" fill="${k.A}" opacity=".15"/>
          ${signs}<g fill="none" stroke="${k.c('muted')}" stroke-width=".5">${times(4, i => `<path d="M${10 + i * 8} ${8 + i * 10}Q80 ${22 + i * 10} ${150 - i * 8} ${8 + i * 10}"/>`)}</g>
          <g stroke="${k.B}" stroke-width=".4" opacity=".55">${times(30, () => { const x = k.r() * (W + 10), y = k.r() * H; return `<path d="M${f(x)} ${f(y)}l-1.6 5"/>`; })}</g>`;
      }
    },
    cyborg: {
      label: 'CYBORG', color: '#c6ff00', a: 'acid_green', b: 'cyan', desc: 'half human profile, half circuitry, with augmented vision',
      icon: `<path d="M24 5c-9 0-14 7-14 15 0 4 1 7 3 9l-2 6 6 2 1 6h6"/><path d="M24 5c9 0 14 7 14 15v16h-8v7h-6" stroke-dasharray="3 2"/><circle cx="31" cy="19" r="3" ${F}/><path d="M24 5v38" stroke-width="1.4"/>`,
      scene(k) {
        const x = 70 + k.r() * 10;
        const face = `M${x} 8C${x - 22} 8 ${x - 28} 24 ${x - 26} 36L${x - 30} 44L${x - 25} 46L${x - 26} 54Q${x - 24} 60 ${x - 16} 60L${x - 14} 70H${x}`;
        return `<path d="${face}V8Z" fill="${k.c('panel')}" stroke="${k.c('white')}" stroke-width=".9"/>
          <g fill="none" stroke="${k.A}" stroke-width=".8" ${k.gl}>${times(6, i => { const y = 14 + i * 9; return `<path d="M${x} ${y}h${f(8 + k.r() * 14)}v${f((k.r() - .5) * 8)}h${f(8 + k.r() * 10)}"/>`; })}</g>
          <g fill="${k.A}">${times(6, i => `<rect x="${f(x + 28 + k.r() * 12)}" y="${f(12 + i * 9)}" width="2.4" height="2.4"/>`)}</g><path d="M${x} 8V70" stroke="${k.B}" stroke-dasharray="2 2"/>
          <circle cx="${x + 10}" cy="26" r="5" fill="${k.c('bg')}" stroke="${k.B}"/><circle cx="${x + 10}" cy="26" r="2.2" fill="${k.B}" ${k.gl}/>
          <g fill="none" stroke="${k.B}" stroke-width=".8"><path d="M${x + 40} 12h10v6M${x + 40} 40h10v-6"/><path d="M${x + 44} 26h12" stroke-dasharray="1 2"/></g>`;
      }
    },
    'dark-futurism': {
      label: 'DARK FUTURISM', color: '#bf8cff', a: 'purple', b: 'white', desc: 'monolithic silhouettes under a pale eclipse',
      icon: `<path d="M18 44 21 6h6l3 38Z"/><circle cx="36" cy="12" r="6"/><path d="M6 44h36"/>`,
      scene(k) {
        const ex = 50 + k.r() * 60, ey = 22;
        k.def(`<radialGradient id="${k.id('co')}"><stop offset=".55" stop-color="${k.B}" stop-opacity=".9"/><stop offset="1" stop-color="${k.A}" stop-opacity="0"/></radialGradient>`);
        const obelisks = times(5, i => { const x = 8 + i * 32 + (k.r() - .5) * 8, h = 30 + k.r() * 34, w = 6 + k.r() * 6; return `<path d="M${f(x)} ${k.hz}L${f(x + w * .2)} ${f(k.hz - h)}L${f(x + w * .5)} ${f(k.hz - h - 4)}L${f(x + w * .8)} ${f(k.hz - h)}L${f(x + w)} ${k.hz}Z" fill="${k.c('bg')}" stroke="${k.A}" stroke-width=".6"/>`; });
        return `<circle cx="${f(ex)}" cy="${ey}" r="17" fill="url(#${k.id('co')})" ${k.gl}/><circle cx="${f(ex + 1.5)}" cy="${ey}" r="11" fill="${k.c('bg')}"/>${stars(k, 8, 40)}
          ${obelisks}<rect x="0" y="${k.hz}" width="${W}" height="${H - k.hz}" fill="${k.c('panel')}"/><path d="M0 ${k.hz}H${W}" stroke="${k.B}" opacity=".6"/>`;
      }
    },
    'dark-skylines': {
      label: 'DARK SKYLINES', color: '#7c83ff', a: 'hot_pink', b: 'cyan', desc: 'dense city towers after midnight',
      icon: `<path d="M4 44V24h7v20M11 44V12h9v32M20 44V18h7v26M27 44V8h9v36M36 44V22h8v22"/><path d="M3 44h42"/>`,
      scene(k) {
        return `<circle cx="${f(120 + k.r() * 20)}" cy="16" r="7" fill="${k.c('white')}" opacity=".8"/>${stars(k, 12, 30)}
          ${skyline(k, H, 14, 24, 50, k.c('panel'), k.c('line'), .12, k.c('muted'))}${skyline(k, H, 12, 12, 34, k.c('bg'), k.A, .3, k.B)}
          <path d="M0 ${H - 1}H${W}" stroke="${k.A}" ${k.gl}/>`;
      }
    },
    default: {
      label: 'DEFAULT / CLASSICS', short: 'CLASSICS', color: '#7dcfff', a: 'cyan', b: 'purple', desc: 'the classic editor themes in a clean code window',
      icon: `<rect x="5" y="8" width="38" height="32" rx="2"/><path d="M5 15h38"/><path d="M12 22l5 4-5 4M21 31h10" stroke-width="2"/>`,
      scene(k) {
        return `${windowFrame(k, 10, 8, 140, 64, k.A)}<rect x="10" y="13" width="14" height="59" fill="${k.c('bg')}" opacity=".6"/>
          <g fill="${k.c('muted')}">${times(12, i => `<rect x="14" y="${17 + i * 4.4}" width="${i > 8 ? 6 : 3}" height="1.4"/>`)}</g>${codeLines(k, 28, 17, 12, 110, 4.4)}
          <rect x="${f(40 + k.r() * 60)}" y="${17 + Math.floor(k.r() * 10) * 4.4 - 1}" width="1.2" height="3.4" fill="${k.c('white')}"/><rect x="10" y="68" width="140" height="4" fill="${k.A}" opacity=".35"/>`;
      }
    },
    dystopian: {
      label: 'DYSTOPIAN', color: '#d4e157', a: 'acid_green', b: 'orange', desc: 'ruined blocks under smog and hazard tape',
      icon: `<path d="M24 5 44 41H4Z"/><path d="M24 17v11" stroke-width="3.2" stroke-linecap="square"/><rect x="22.2" y="32" width="3.6" height="3.6" ${F}/>`,
      scene(k) {
        let x = -2, ruins = '';
        while (x < W) { const w = 10 + k.r() * 18, h = 14 + k.r() * 30, y = k.hz - h; ruins += `<path d="M${f(x)} ${k.hz}V${f(y + 6)}L${f(x + w * .3)} ${f(y)}L${f(x + w * .55)} ${f(y + 5 + k.r() * 5)}L${f(x + w * .8)} ${f(y + 1)}L${f(x + w)} ${f(y + 8)}V${k.hz}Z" fill="${k.c('panel')}" stroke="${k.c('line')}" stroke-width=".6"/>${times(3, () => `<rect x="${f(x + 2 + k.r() * (w - 5))}" y="${f(y + 9 + k.r() * (h - 14))}" width="2" height="2.4" fill="${k.c('bg')}"/>`)}`; x += w + 1; }
        k.def(`<pattern id="${k.id('hz')}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="8" fill="${k.B}"/><rect x="4" width="4" height="8" fill="${k.c('bg')}"/></pattern>`);
        return `<circle cx="${f(30 + k.r() * 100)}" cy="18" r="9" fill="${k.A}" opacity=".35" ${k.gl}/>${ruins}<rect x="0" y="${k.hz}" width="${W}" height="${H - k.hz}" fill="${k.c('bg')}"/>
          <g fill="${k.c('muted')}" opacity=".3">${times(6, () => `<ellipse cx="${f(k.r() * W)}" cy="${f(10 + k.r() * 30)}" rx="${f(18 + k.r() * 20)}" ry="${f(3 + k.r() * 4)}"/>`)}</g>
          <rect x="-10" y="${k.hz + 6}" width="${W + 20}" height="5" fill="url(#${k.id('hz')})" transform="rotate(-4 80 ${k.hz + 8})"/>`;
      }
    },
    'dystopian-frontier': {
      label: 'DYSTOPIAN FRONTIER', color: '#e58b45', a: 'orange', b: 'acid_green', desc: 'a desert outpost and perimeter fence at dusk',
      icon: `<path d="M12 44V6"/><path d="M12 7c8-3 12 5 22 1v14c-10 4-14-4-22-1" ${F} opacity=".85"/><path d="M4 44h40"/>`,
      scene(k) {
        const sx = 30 + k.r() * 100;
        k.def(`<linearGradient id="${k.id('sky')}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${k.c('bg')}"/><stop offset="1" stop-color="${k.A}" stop-opacity=".45"/></linearGradient>`);
        const ox = 96 + k.r() * 30;
        return `<rect width="${W}" height="${k.hz}" fill="url(#${k.id('sky')})"/><circle cx="${f(sx)}" cy="${k.hz - 6}" r="12" fill="${k.A}" opacity=".85" ${k.gl}/>
          <path d="M0 ${k.hz - 2}Q40 ${k.hz - 10} 80 ${k.hz - 3}T${W} ${k.hz - 4}V${H}H0Z" fill="${k.c('panel')}"/><path d="M0 ${k.hz + 6}Q50 ${k.hz} 100 ${k.hz + 7}T${W} ${k.hz + 5}V${H}H0Z" fill="${k.c('bg')}" opacity=".8"/>
          <g fill="${k.c('bg')}" stroke="${k.c('line')}" stroke-width=".6"><rect x="${f(ox)}" y="${k.hz - 14}" width="16" height="11"/><path d="M${f(ox - 2)} ${k.hz - 14}L${f(ox + 8)} ${k.hz - 20}L${f(ox + 18)} ${k.hz - 14}Z"/></g><path d="M${f(ox + 20)} ${k.hz - 4}V${k.hz - 30}M${f(ox + 16)} ${k.hz - 26}h8" stroke="${k.c('line')}"/><circle cx="${f(ox + 20)}" cy="${k.hz - 30}" r="1.2" fill="${k.B}" ${k.gl}/>
          <g stroke="${k.c('muted')}" stroke-width=".7">${times(9, i => `<path d="M${4 + i * 10} ${k.hz + 14}v-9"/>`)}<path d="M4 ${k.hz + 7}H84M4 ${k.hz + 10}H84" stroke-dasharray="1.5 1"/></g>`;
      }
    },
    futuristic: {
      label: 'FUTURISTIC', color: '#00ffc8', a: 'cyan', b: 'white', desc: 'a maglev rail curving past orbital spheres',
      icon: `<ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(-20 24 24)"/><circle cx="24" cy="24" r="7"/><circle cx="40" cy="15" r="2.4" ${F}/>`,
      scene(k) {
        k.def(`<radialGradient id="${k.id('sp')}" cx=".35" cy=".35"><stop stop-color="${k.B}"/><stop offset="1" stop-color="${k.A}" stop-opacity=".25"/></radialGradient>`);
        const t = .3 + k.r() * .4, px = (1 - t) ** 2 * -10 + 2 * (1 - t) * t * 90 + t * t * 170, py = (1 - t) ** 2 * 70 + 2 * (1 - t) * t * 0 + t * t * 50;
        return `${times(3, i => { const r = 6 + k.r() * 10; return `<circle cx="${f(20 + i * 55 + k.r() * 20)}" cy="${f(12 + k.r() * 22)}" r="${f(r)}" fill="url(#${k.id('sp')})"/>`; })}
          <path d="M-10 70Q90 0 170 50" fill="none" stroke="${k.c('line')}" stroke-width="5"/><path d="M-10 70Q90 0 170 50" fill="none" stroke="${k.A}" stroke-width="1.2" ${k.gl}/>
          <g transform="translate(${f(px)} ${f(py - 4)}) rotate(${f(-30 + t * 60)})"><rect x="-14" y="-3" width="28" height="6" rx="3" fill="${k.c('white')}"/><rect x="-10" y="-1.5" width="18" height="2" fill="${k.A}"/></g>
          ${times(8, i => `<path d="M${f(4 + i * 20)} ${H}V${f(68 - i * 2)}" stroke="${k.c('line')}" opacity=".6"/>`)}`;
      }
    },
    'neon-noir': {
      label: 'NEON NOIR', color: '#ff2bd6', a: 'hot_pink', b: 'cyan', desc: 'rain on the window, a neon sign in the puddles',
      icon: `<path d="M8 28h32"/><path d="M14 28c0-10 3-16 10-16s10 6 10 16"/><path d="M4 31c4 2 36 2 40 0" stroke-width="2"/><path d="M16 38l-2 5M26 38l-2 5M36 38l-2 5" stroke-width="1.6"/>`,
      scene(k) {
        const sx = 50 + k.r() * 50, sy = 16;
        const sign = (y, flip) => `<g ${flip ? `transform="translate(0 ${2 * k.hz}) scale(1 -1)" opacity=".35"` : k.gl}><rect x="${f(sx)}" y="${y}" width="44" height="14" rx="2" fill="none" stroke="${k.A}" stroke-width="1.2"/><path d="M${f(sx + 6)} ${y + 10}V${y + 4}l5 6V${y + 4}M${f(sx + 16)} ${y + 4}h6M${f(sx + 16)} ${y + 7}h4M${f(sx + 16)} ${y + 10}h6M${f(sx + 28)} ${y + 4}a3 3 0 1 0 0.1 0M${f(sx + 36)} ${y + 10}V${y + 4}l4 6V${y + 4}" stroke="${k.B}" fill="none"/></g>`;
        return `${skyline(k, k.hz, 12, 10, 34, k.c('panel'), k.c('line'), .18, k.c('muted'))}${sign(sy)}<rect x="0" y="${k.hz}" width="${W}" height="${H - k.hz}" fill="${k.c('bg')}"/>${sign(sy, true)}
          <g stroke="${k.c('white')}" stroke-width=".35" opacity=".45">${times(26, () => { const x = k.r() * W, y = k.r() * H, l = 4 + k.r() * 8; return `<path d="M${f(x)} ${f(y)}q.6 ${f(l / 2)} 0 ${f(l)}"/>`; })}</g>
          <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="${k.c('line')}" stroke-width="2"/><path d="M80 1V${H - 1}" stroke="${k.c('line')}" stroke-width="1.4"/>`;
      }
    },
    neosynth: {
      label: 'NEOSYNTH', color: '#00ff8c', a: 'cyan', b: 'hot_pink', desc: 'oscilloscope waves over a synth keyboard',
      icon: `<circle cx="24" cy="24" r="19"/><path d="M8 24h4l3-9 5 19 5-24 5 22 4-12 2 4h4" stroke-linejoin="round"/>`,
      scene(k) {
        const keys = times(20, i => `<rect x="${4 + i * 7.6}" y="56" width="7" height="22" fill="${k.c('white')}" opacity=".9"/>`) + times(20, i => [0, 1, 3, 4, 5].includes(i % 7) ? `<rect x="${f(9 + i * 7.6)}" y="56" width="4.4" height="13" fill="${k.c('bg')}"/>` : '');
        return `<rect x="6" y="6" width="148" height="44" fill="${k.c('panel')}" stroke="${k.c('line')}"/><g stroke="${k.c('line')}" stroke-width=".4">${times(7, i => `<path d="M${6 + i * 24.6} 6V50"/>`)}<path d="M6 28H154"/></g>
          <path d="${wave(6, 154, 28, 13, 2 + k.r() * 2, k.r() * 6)}" fill="none" stroke="${k.A}" stroke-width="1.4" ${k.gl}/><path d="${wave(6, 154, 28, 7, 5 + k.r() * 3, k.r() * 6)}" fill="none" stroke="${k.B}" stroke-width=".9" opacity=".8"/>
          ${keys}<rect x="${f(4 + Math.floor(k.r() * 20) * 7.6)}" y="70" width="7" height="8" fill="${k.B}" opacity=".7"/>`;
      }
    },
    'night-ops': {
      label: 'NIGHT OPS', color: '#62a0ff', a: 'acid_green', b: 'cyan', desc: 'green-phosphor radar and covert low-light operations',
      icon: `<rect x="5" y="16" width="16" height="14" rx="5"/><rect x="27" y="16" width="16" height="14" rx="5"/><path d="M21 22h6M13 16V10h22v6"/><circle cx="13" cy="23" r="3" ${F}/><circle cx="35" cy="23" r="3" ${F}/>`,
      scene(k) {
        const cx = 80, cy = 40, a = k.r() * Math.PI * 2;
        k.def(`<linearGradient id="${k.id('sw')}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${k.A}" stop-opacity="0"/><stop offset="1" stop-color="${k.A}" stop-opacity=".55"/></linearGradient>`);
        const ex = cx + Math.cos(a) * 34, ey = cy + Math.sin(a) * 34, bx = cx + Math.cos(a - .7) * 34, by = cy + Math.sin(a - .7) * 34;
        return `<g fill="none" stroke="${k.A}" stroke-width=".7" opacity=".7">${times(4, i => `<circle cx="${cx}" cy="${cy}" r="${9 + i * 8.5}"/>`)}<path d="M${cx - 38} ${cy}H${cx + 38}M${cx} ${cy - 38}V${cy + 38}"/></g>
          <path d="M${cx} ${cy}L${f(bx)} ${f(by)}A34 34 0 0 1 ${f(ex)} ${f(ey)}Z" fill="${k.A}" opacity=".25"/><path d="M${cx} ${cy}L${f(ex)} ${f(ey)}" stroke="${k.A}" stroke-width="1.2" ${k.gl}/>
          <g fill="${k.A}" ${k.gl}>${times(5, () => { const r = 8 + k.r() * 26, t = k.r() * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(t) * r)}" cy="${f(cy + Math.sin(t) * r)}" r="1.3"/>`; })}</g>
          <g fill="${k.B}" font-family="monospace" font-size="4.5"><text x="6" y="10">BRG ${String(Math.floor(a * 57)).padStart(3, '0')}</text><text x="6" y="74">RNG ${Math.floor(k.r() * 90 + 10)}K</text><text x="124" y="74">NV-ON</text></g>`;
      }
    },
    'omarchy-live': {
      label: 'OMARCHY LIVE', color: '#f5c2e7', a: 'white', b: 'hot_pink', desc: 'a live tiling desktop with its bar and widgets',
      icon: `<rect x="5" y="5" width="38" height="38" rx="2"/><path d="M5 12h38M22 12v31M22 28h21"/><circle cx="10" cy="8.5" r="1.4" ${F}/>`,
      scene(k) {
        const active = Math.floor(k.r() * 4);
        return `${bar(k, k.B)}${tiles(k, 4, 10, 152, 66, k.B, active)}${codeLines(k, 8, 16, 11, 58, 4.8)}
          <path d="${wave(76, 152, 24, 4, 3 + k.r() * 2, k.r() * 5)}" stroke="${k.B}" fill="none" ${k.gl}/><g fill="${k.A}" opacity=".7">${times(7, i => `<rect x="${f(76 + i * 10)}" y="${f(38 - k.r() * 6)}" width="6" height="${f(4 + k.r() * 6)}"/>`)}</g>
          <circle cx="94" cy="62" r="8" fill="none" stroke="${k.c('line')}" stroke-width="2"/><path d="M94 54a8 8 0 0 1 ${f(8 * Math.sin(k.r() * 5))} ${f(8 - 8 * Math.cos(k.r() * 5))}" stroke="${k.B}" stroke-width="2" fill="none"/>`;
      }
    },
    'plasma-core': {
      label: 'PLASMA CORE', color: '#ff6bce', a: 'hot_pink', b: 'purple', desc: 'a contained tokamak arc and magnetic turbulence',
      icon: `<ellipse cx="24" cy="24" rx="19" ry="11"/><ellipse cx="24" cy="24" rx="9" ry="4.5"/><path d="M5 24c6-8 10 6 19-2s13 6 19 2" stroke-width="1.6"/>`,
      scene(k) {
        k.def(`<radialGradient id="${k.id('pl')}"><stop stop-color="${k.c('white')}"/><stop offset=".3" stop-color="${k.A}"/><stop offset="1" stop-color="${k.B}" stop-opacity="0"/></radialGradient>`);
        let arc = 'M30 40'; for (let x = 34; x <= 130; x += 4) arc += `L${x} ${f(40 + Math.sin(x / 8 + k.r()) * (4 + k.r() * 5) * Math.sin((x - 30) / 100 * Math.PI))}`;
        return `<ellipse cx="80" cy="40" rx="58" ry="24" fill="url(#${k.id('pl')})" opacity=".35"/><ellipse cx="80" cy="40" rx="58" ry="24" fill="none" stroke="${k.c('line')}" stroke-width="6"/><ellipse cx="80" cy="40" rx="30" ry="10" fill="${k.c('bg')}" stroke="${k.c('line')}" stroke-width="3"/>
          <path d="${arc}" fill="none" stroke="${k.A}" stroke-width="1.6" ${k.gl}/><path d="${arc}" fill="none" stroke="${k.c('white')}" stroke-width=".5"/>
          <g fill="${k.c('panel')}" stroke="${k.B}" stroke-width=".7">${times(8, i => { const t = i / 8 * Math.PI * 2; return `<rect x="${f(80 + Math.cos(t) * 58 - 3)}" y="${f(40 + Math.sin(t) * 24 - 5)}" width="6" height="10"/>`; })}</g>`;
      }
    },
    'signal-cities': {
      label: 'SIGNAL CITIES', color: '#00f0ff', a: 'cyan', b: 'orange', desc: 'broadcast towers throwing waves across the city',
      icon: `<path d="M24 16 16 44M24 16l8 28M19 32h10M17.5 38h13"/><circle cx="24" cy="12" r="2.6" ${F}/><path d="M14 6a14 14 0 0 0 0 12M34 6a14 14 0 0 1 0 12M10 3a19 19 0 0 0 0 18M38 3a19 19 0 0 1 0 18" stroke-width="1.8"/>`,
      scene(k) {
        const towers = times(2, i => { const x = 36 + i * 76 + k.r() * 10, top = 10 + k.r() * 10; return `<g stroke="${k.c('white')}" stroke-width=".7" fill="none"><path d="M${f(x)} ${f(top)}L${f(x - 7)} 64M${f(x)} ${f(top)}L${f(x + 7)} 64"/>${times(5, j => { const y = top + (64 - top) * (j + 1) / 6, hw = 7 * (y - top) / (64 - top); return `<path d="M${f(x - hw)} ${f(y)}L${f(x + hw)} ${f(y + 6)}M${f(x + hw)} ${f(y)}L${f(x - hw)} ${f(y + 6)}"/>`; })}</g><circle cx="${f(x)}" cy="${f(top)}" r="1.8" fill="${k.B}" ${k.gl}/><g fill="none" stroke="${k.A}" ${k.gl}>${times(3, j => `<path d="M${f(x - 8 - j * 6)} ${f(top - 6 - j * 3)}a${f(11 + j * 7)} ${f(11 + j * 7)} 0 0 0 0 ${f(12 + j * 6)}M${f(x + 8 + j * 6)} ${f(top - 6 - j * 3)}a${f(11 + j * 7)} ${f(11 + j * 7)} 0 0 1 0 ${f(12 + j * 6)}" opacity="${f(1 - j * .28)}"/>`)}</g>`; });
        return `${skyline(k, H, 14, 10, 26, k.c('panel'), k.c('line'), .25, k.A)}${towers}`;
      }
    },
    'synth-industrial': {
      label: 'SYNTH INDUSTRIAL', color: '#a6e22e', a: 'acid_green', b: 'orange', desc: 'machine hammers striking in time with a waveform',
      icon: `<rect x="8" y="6" width="12" height="8"/><path d="M14 14v12"/><rect x="6" y="26" width="16" height="6"/><path d="M26 30c3-12 5-12 8 0s5 12 8 0" stroke-width="2"/><path d="M4 42h40"/>`,
      scene(k) {
        const ph = k.r() * 6;
        const hammers = times(8, i => { const ext = 6 + (Math.sin(i * .9 + ph) + 1) * 12; return `<rect x="${8 + i * 19}" y="6" width="12" height="6" fill="${k.c('panel')}" stroke="${k.c('line')}"/><rect x="${12.5 + i * 19}" y="12" width="3" height="${f(ext)}" fill="${k.c('muted')}"/><rect x="${6 + i * 19}" y="${f(12 + ext)}" width="16" height="6" fill="${ext > 26 ? k.B : k.c('panel')}" stroke="${k.A}" stroke-width=".6"/>`; });
        return `<rect x="0" y="66" width="${W}" height="14" fill="${k.c('panel')}"/><path d="M0 66H${W}" stroke="${k.A}"/>${hammers}
          <path d="${wave(0, W, 54, 6, 4, ph + Math.PI, 2)}" fill="none" stroke="${k.A}" stroke-width="1.3" ${k.gl}/>${times(8, i => (Math.sin(i * .9 + ph) + 1) * 12 + 6 > 26 ? `<path d="M${f(14 + i * 19)} 62l-4 -3M${f(14 + i * 19)} 62l4 -3" stroke="${k.B}" ${k.gl}/>` : '')}`;
      }
    },
    synthwave: {
      label: 'SYNTHWAVE', color: '#4cc9f0', a: 'cyan', b: 'hot_pink', desc: 'outrun sun, grid floor and palm silhouettes',
      icon: `<path d="M8 26a16 16 0 0 1 32 0Z" ${F} opacity=".9"/><path d="M8 20.5h32M8 23.5h32" stroke="var(--bg)" stroke-width="1.6"/><path d="M2 28h44M4 33h40M1 39h46M24 28v17M14 28 6 45M34 28l8 17" stroke-width="1.6"/>`,
      scene(k) {
        const sx = 80 + (k.r() - .5) * 30, R = 20;
        k.def(`<linearGradient id="${k.id('sun')}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${k.c('orange')}"/><stop offset="1" stop-color="${k.B}"/></linearGradient><clipPath id="${k.id('sc')}"><rect width="${W}" height="${k.hz}"/></clipPath>`);
        const palm = x => `<g fill="${k.c('bg')}"><path d="M${x} ${k.hz}q2 -14 0 -26h2q2 12 0 26Z"/>${times(5, i => { const a = -2.6 + i * .55; return `<path d="M${x + 1} ${k.hz - 26}q${f(Math.cos(a) * 8)} ${f(Math.sin(a) * 8 - 2)} ${f(Math.cos(a) * 14)} ${f(Math.sin(a) * 14 + 4)}q${f(-Math.cos(a) * 6)} ${f(-Math.sin(a) * 4)} ${f(-Math.cos(a) * 14)} ${f(-Math.sin(a) * 14 - 4)}Z"/>`; })}</g>`;
        return `${stars(k, 10, k.hz - 20)}<g clip-path="url(#${k.id('sc')})"><circle cx="${f(sx)}" cy="${k.hz}" r="${R}" fill="url(#${k.id('sun')})" ${k.gl}/>${times(4, i => `<rect x="${f(sx - R)}" y="${f(k.hz - 12 + i * 3)}" width="${2 * R}" height="${f(.8 + i * .4)}" fill="${k.c('bg')}"/>`)}</g>
          <rect y="${k.hz}" width="${W}" height="${H - k.hz}" fill="${k.c('bg')}"/>${floor(k, k.B, 80, 6, 8, .7)}<path d="M0 ${k.hz}H${W}" stroke="${k.A}" ${k.gl}/>${palm(f(12 + k.r() * 14))}${palm(f(130 + k.r() * 14))}`;
      }
    },
    'terminal-ghost': {
      label: 'TERMINAL GHOST', color: '#9eff6e', a: 'acid_green', b: 'purple', desc: 'haunted terminals and residual machine text',
      icon: `<rect x="4" y="8" width="40" height="32" rx="2"/><path d="M10 17l6 5-6 5" stroke-width="2"/><rect x="20" y="25" width="7" height="4" ${F}/><rect x="30" y="25" width="5" height="4" ${F} opacity=".45"/><rect x="37" y="25" width="3" height="4" ${F} opacity=".2"/>`,
      scene(k) {
        const lines = codeLines(k, 0, 0, 9, 96, 6, ['acid_green', 'acid_green', 'white']);
        const cy = 12 + Math.floor(k.r() * 9) * 6;
        return `${crtMonitor(k, 18, 6, 124, 60, k.A)}<g transform="translate(26 14)" opacity=".18">${lines}</g><g transform="translate(24 13)" opacity=".35">${lines}</g><g transform="translate(22 12)">${lines}</g>
          ${times(4, i => `<rect x="${f(76 + i * 8)}" y="${cy + 10}" width="5" height="4" fill="${k.A}" opacity="${f(1 - i * .25)}"/>`)}<rect x="18" y="6" width="124" height="60" rx="3" fill="${k.A}" opacity=".05"/>`;
      }
    },
    tokyo: {
      label: 'TOKYO', color: '#ff4fa3', a: 'hot_pink', b: 'cyan', desc: 'vertical signs, lanterns and an elevated rail at night',
      icon: `<path d="M5 10h38M8 16h32M13 10v34M35 10v34"/><path d="M4 7c8 3 32 3 40 0" stroke-width="2.6"/>`,
      scene(k) {
        const signs = times(7, i => { const x = 6 + i * 22 + k.r() * 6, h = 20 + k.r() * 18, col = [k.A, k.B, k.c('orange'), k.c('acid_green')][i % 4]; return `<rect x="${f(x)}" y="6" width="7" height="${f(h)}" fill="${k.c('bg')}" stroke="${col}" ${k.gl}/>${times(Math.floor(h / 6), j => `<rect x="${f(x + 2)}" y="${f(9 + j * 6)}" width="3" height="${f(2 + k.r() * 2)}" fill="${col}"/>`)}`; });
        const tx = -20 + k.r() * 100;
        return `${skyline(k, 70, 12, 30, 60, k.c('panel'), k.c('line'), .1, k.c('muted'))}${signs}<rect x="0" y="48" width="${W}" height="4" fill="${k.c('line')}"/>${times(6, i => `<rect x="${6 + i * 30}" y="52" width="3" height="28" fill="${k.c('line')}"/>`)}
          <g transform="translate(${f(tx)} 39)"><rect width="70" height="9" rx="2" fill="${k.c('white')}" opacity=".9"/>${times(8, i => `<rect x="${4 + i * 8}" y="2" width="5" height="3" fill="${k.B}"/>`)}<rect y="6" width="70" height="1.5" fill="${k.A}"/></g>
          ${times(4, i => `<circle cx="${20 + i * 38}" cy="${f(62 + k.r() * 6)}" r="3" fill="${k.c('red')}" opacity=".85" ${k.gl}/>`)}`;
      }
    },

    /* ---------- the newer 25 ---------- */
    'cryo-frost-net': {
      label: 'CRYO FROST NET', color: '#9be7ff', a: 'cyan', b: 'white', desc: 'frost crystals growing as a network graph',
      icon: `<path d="M24 4v40M6.7 14l34.6 20M6.7 34l34.6-20"/><circle cx="24" cy="4.5" r="2.4" ${F}/><circle cx="24" cy="43.5" r="2.4" ${F}/><circle cx="7" cy="14" r="2.4" ${F}/><circle cx="41" cy="34" r="2.4" ${F}/><circle cx="7" cy="34" r="2.4" ${F}/><circle cx="41" cy="14" r="2.4" ${F}/><circle cx="24" cy="24" r="4"/>`,
      scene(k) {
        const nodes = times(4, () => { const cx = 14 + k.r() * 132, cy = 12 + k.r() * 56, R = 8 + k.r() * 12; return `<g stroke="${k.A}" stroke-width=".8" fill="none" ${k.gl}>${times(6, i => { const a = i * Math.PI / 3 + k.r() * .2, ex = cx + Math.cos(a) * R, ey = cy + Math.sin(a) * R, mx = cx + Math.cos(a) * R * .55, my = cy + Math.sin(a) * R * .55; return `<path d="M${f(cx)} ${f(cy)}L${f(ex)} ${f(ey)}M${f(mx)} ${f(my)}l${f(Math.cos(a + .7) * 4)} ${f(Math.sin(a + .7) * 4)}M${f(mx)} ${f(my)}l${f(Math.cos(a - .7) * 4)} ${f(Math.sin(a - .7) * 4)}"/>`; })}</g><circle cx="${f(cx)}" cy="${f(cy)}" r="2.2" fill="${k.B}"/>`; });
        const pts = Array.from({ length: 9 }, () => [k.r() * W, k.r() * H]);
        return `<g stroke="${k.c('line')}" stroke-width=".6">${pts.map(([x, y], i) => i ? `<path d="M${f(x)} ${f(y)}L${f(pts[i - 1][0])} ${f(pts[i - 1][1])}"/>` : '').join('')}</g><g fill="${k.A}" opacity=".7">${pts.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="1.2"/>`).join('')}</g>${nodes}`;
      }
    },
    'cryo-glacial-drift': {
      label: 'CRYO GLACIAL DRIFT', color: '#7fdbff', a: 'cyan', b: 'acid_green', desc: 'icebergs drifting on dark water under an aurora',
      icon: `<path d="M12 22 19 9l5 5 4-6 9 14Z"/><path d="M4 22h40"/><path d="M10 22l3 13 11 7 11-7 3-13" stroke-dasharray="3 2.4" opacity=".75"/>`,
      scene(k) {
        k.def(`<linearGradient id="${k.id('au')}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${k.B}" stop-opacity=".0"/><stop offset=".5" stop-color="${k.B}" stop-opacity=".45"/><stop offset="1" stop-color="${k.c('purple')}" stop-opacity="0"/></linearGradient>`);
        const berg = (x, w, h) => `<path d="M${f(x)} ${k.hz}L${f(x + w * .2)} ${f(k.hz - h * .6)}L${f(x + w * .45)} ${f(k.hz - h)}L${f(x + w * .6)} ${f(k.hz - h * .7)}L${f(x + w * .8)} ${f(k.hz - h * .8)}L${f(x + w)} ${k.hz}Z" fill="${k.c('white')}" opacity=".9"/><path d="M${f(x + w * .45)} ${f(k.hz - h)}L${f(x + w * .5)} ${k.hz}" stroke="${k.A}" stroke-width=".6"/><path d="M${f(x - 4)} ${k.hz}L${f(x + w * .3)} ${f(k.hz + h * 1.1)}L${f(x + w * .8)} ${f(k.hz + h * .9)}L${f(x + w + 4)} ${k.hz}Z" fill="${k.A}" opacity=".18"/>`;
        return `<path d="${wave(0, W, 16, 6, 1.5, k.r() * 6, 4)}V40H0Z" fill="url(#${k.id('au')})"/><path d="${wave(0, W, 22, 5, 2, k.r() * 6, 4)}" fill="none" stroke="${k.B}" opacity=".5" ${k.gl}/>${stars(k, 10, 30)}
          <rect y="${k.hz}" width="${W}" height="${H - k.hz}" fill="${k.c('panel')}"/>${berg(14 + k.r() * 20, 40, 22 + k.r() * 8)}${berg(90 + k.r() * 20, 30, 12 + k.r() * 8)}
          <g stroke="${k.A}" stroke-width=".5" opacity=".5">${times(6, i => `<path d="M${f(k.r() * W)} ${f(k.hz + 4 + i * 3)}h${f(8 + k.r() * 20)}"/>`)}</g>`;
      }
    },
    'cryo-quantum-frost': {
      label: 'CRYO QUANTUM FROST', color: '#b39dff', a: 'purple', b: 'cyan', desc: 'an ice lattice wrapped in qubit orbits',
      icon: `<ellipse cx="24" cy="24" rx="19" ry="7"/><ellipse cx="24" cy="24" rx="19" ry="7" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="19" ry="7" transform="rotate(120 24 24)"/><path d="M24 19v10M19.7 21.5l8.6 5M19.7 26.5l8.6-5" stroke-width="1.6"/>`,
      scene(k) {
        const cx = 80 + (k.r() - .5) * 30, cy = 40;
        const lattice = times(11, i => times(6, j => { const x = i * 16 + (j % 2) * 8, y = j * 14 + 2; return `<polygon points="${hexPts(x, y, 7)}" fill="none" stroke="${k.B}" stroke-width=".4" opacity="${f(.15 + k.r() * .3)}"/>`; }));
        return `${lattice}<g fill="none" stroke="${k.A}" stroke-width=".9" ${k.gl}>${times(3, i => `<ellipse cx="${f(cx)}" cy="${cy}" rx="32" ry="9" transform="rotate(${i * 60 + k.r() * 10} ${f(cx)} ${cy})"/>`)}</g>
          <polygon points="${hexPts(cx, cy, 8)}" fill="${k.c('panel')}" stroke="${k.B}"/><path d="M${f(cx)} ${cy - 5}v10M${f(cx - 4.3)} ${cy - 2.5}l8.6 5M${f(cx - 4.3)} ${cy + 2.5}l8.6 -5" stroke="${k.c('white')}" stroke-width=".8"/>
          <g fill="${k.B}" ${k.gl}>${times(3, i => { const a = k.r() * Math.PI * 2, rot = (i * 60) * Math.PI / 180, x = Math.cos(a) * 32, y = Math.sin(a) * 9; return `<circle cx="${f(cx + x * Math.cos(rot) - y * Math.sin(rot))}" cy="${f(cy + x * Math.sin(rot) + y * Math.cos(rot))}" r="2"/>`; })}</g>`;
      }
    },
    'cryo-subzero-core': {
      label: 'CRYO SUBZERO CORE', color: '#4fc3f7', a: 'cyan', b: 'white', desc: 'a frozen reactor core venting cold mist',
      icon: `<rect x="16" y="6" width="16" height="30" rx="8"/><circle cx="24" cy="36" r="7"/><path d="M24 28V14" stroke-width="3"/><path d="M36 10h6M36 16h4M36 22h6" stroke-width="1.6"/>`,
      scene(k) {
        const cx = 80 + (k.r() - .5) * 30;
        k.def(`<linearGradient id="${k.id('cy')}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${k.c('panel')}"/><stop offset=".5" stop-color="${k.A}" stop-opacity=".55"/><stop offset="1" stop-color="${k.c('panel')}"/></linearGradient>`);
        return `<rect x="0" y="66" width="${W}" height="14" fill="${k.c('panel')}"/><rect x="${f(cx - 16)}" y="14" width="32" height="52" fill="url(#${k.id('cy')})" stroke="${k.A}"/>
          ${times(4, i => `<ellipse cx="${f(cx)}" cy="${18 + i * 14}" rx="19" ry="3.5" fill="none" stroke="${k.B}" stroke-width="1.2"/>`)}<rect x="${f(cx - 4)}" y="22" width="8" height="40" fill="${k.B}" opacity=".7" ${k.gl}/>
          <g fill="${k.B}" opacity=".85">${times(9, i => { const x = cx - 18 + i * 4.5; return `<path d="M${f(x)} 14l1.2 ${f(4 + k.r() * 7)}l1.2 ${f(-(4 + k.r() * 7))}Z"/>`; })}</g>
          <g fill="${k.c('white')}" opacity=".18">${times(7, () => `<ellipse cx="${f(k.r() * W)}" cy="${f(52 + k.r() * 18)}" rx="${f(14 + k.r() * 18)}" ry="${f(3 + k.r() * 3)}"/>`)}</g>
          <g fill="${k.A}" font-family="monospace" font-size="5"><text x="6" y="12">-${Math.floor(180 + k.r() * 90)}°K</text></g>`;
      }
    },
    'cryo-terminal-blue': {
      label: 'CRYO TERMINAL BLUE', color: '#2f80ff', a: 'cyan', b: 'white', desc: 'a terminal window icing over at the edges',
      icon: `<rect x="4" y="8" width="40" height="32" rx="2"/><path d="M10 18l6 5-6 5M20 29h9" stroke-width="2"/><path d="M4 14l6-6M38 40l6-6M36 8l2 3 3-1M8 40l-1-3-3 1" stroke-width="1.6"/>`,
      scene(k) {
        return `${windowFrame(k, 8, 6, 144, 68, k.A)}<g font-family="monospace" font-size="5" fill="${k.A}">${times(6, i => `<text x="14" y="${20 + i * 8}">${['❯', '$', '❯', '$', '❯', '$'][i]}</text>`)}</g>${codeLines(k, 22, 16.5, 6, 100, 8, ['cyan', 'white', 'cyan', 'purple'])}
          <rect x="${f(30 + k.r() * 40)}" y="60" width="4" height="5" fill="${k.B}"/>${frostCorner(k, 8, 6, 1, 1, k.B)}${frostCorner(k, 152, 6, -1, 1, k.B)}${frostCorner(k, 8, 74, 1, -1, k.B)}${frostCorner(k, 152, 74, -1, -1, k.B)}
          <rect x="8" y="6" width="144" height="68" fill="${k.B}" opacity=".06"/>`;
      }
    },
    'cyber-pulse-dark': {
      label: 'CYBER PULSE DARK', color: '#ff3366', a: 'hot_pink', b: 'red', desc: 'an ECG pulse racing across a dark grid',
      icon: `<path d="M3 26h9l4-10 6 20 6-28 5 18h12" stroke-linejoin="round"/><circle cx="33" cy="26" r="2.4" ${F}/>`,
      scene(k) {
        const beat = x => `L${x} 40L${x + 4} 30L${x + 8} 52L${x + 13} 12L${x + 18} 46L${x + 22} 40`;
        const starts = [8 + k.r() * 10, 60 + k.r() * 10, 112 + k.r() * 10];
        let d = 'M0 40'; starts.forEach(x => { d += `L${f(x)} 40` + beat(+f(x)); }); d += `L${W} 40`;
        k.def(`<linearGradient id="${k.id('fade')}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${k.A}" stop-opacity=".15"/><stop offset="1" stop-color="${k.A}"/></linearGradient>`);
        return `<g stroke="${k.c('line')}" stroke-width=".4">${times(17, i => `<path d="M${i * 10} 0V${H}"/>`)}${times(9, i => `<path d="M0 ${i * 10}H${W}"/>`)}</g><path d="${d}" fill="none" stroke="url(#${k.id('fade')})" stroke-width="1.6" ${k.gl}/>
          <circle cx="${f(starts[2] + 13)}" cy="12" r="2.4" fill="${k.c('white')}" ${k.gl}/><g fill="${k.B}" font-family="monospace" font-size="6"><text x="6" y="74">${Math.floor(60 + k.r() * 80)} BPM</text></g>`;
      }
    },
    'cyber-shattered': {
      label: 'CYBER SHATTERED', color: '#e0e0ff', a: 'cyan', b: 'hot_pink', desc: 'a glass interface fractured into displaced shards',
      icon: `<path d="M24 4 41.3 14v20L24 44 6.7 34V14Z"/><path d="M24 4l-2 14 10 6-8 6 2 14M22 18l-15-4M32 24l9-10M24 30l-17 4" stroke-width="1.6"/>`,
      scene(k) {
        const ix = 60 + k.r() * 40, iy = 30 + k.r() * 20;
        const angles = Array.from({ length: 7 }, (_, i) => i / 7 * Math.PI * 2 + k.r() * .5);
        const shards = angles.map((a, i) => {
          const b = angles[(i + 1) % 7] + (i === 6 ? Math.PI * 2 : 0), R = 140;
          const pts = `${f(ix)},${f(iy)} ${f(ix + Math.cos(a) * R)},${f(iy + Math.sin(a) * R)} ${f(ix + Math.cos(b) * R)},${f(iy + Math.sin(b) * R)}`;
          const dx = Math.cos((a + b) / 2) * (1.5 + k.r() * 2.5), dy = Math.sin((a + b) / 2) * (1.5 + k.r() * 2.5);
          k.def(`<clipPath id="${k.id('sh' + i)}"><polygon points="${pts}"/></clipPath>`);
          return `<g clip-path="url(#${k.id('sh' + i)})"><g transform="translate(${f(dx)} ${f(dy)})">${windowFrame(k, 12, 8, 136, 64, k.A)}${codeLines(k, 18, 18, 10, 120, 5)}</g></g>`;
        }).join('');
        return `${shards}<g stroke="${k.c('white')}" stroke-width=".7" fill="none" opacity=".9">${angles.map(a => `<path d="M${f(ix)} ${f(iy)}L${f(ix + Math.cos(a) * 140)} ${f(iy + Math.sin(a) * 140)}"/>`).join('')}<circle cx="${f(ix)}" cy="${f(iy)}" r="5"/><circle cx="${f(ix)}" cy="${f(iy)}" r="11" stroke-dasharray="3 4"/></g><circle cx="${f(ix)}" cy="${f(iy)}" r="1.6" fill="${k.B}" ${k.gl}/>`;
      }
    },
    'cybercore-vortex': {
      label: 'CYBERCORE VORTEX', color: '#8c5bff', a: 'purple', b: 'cyan', desc: 'data streams spiralling into a central vortex',
      icon: `<path d="M24 24c0-3 3-4 5-2s1 7-4 8-9-3-8-9 7-10 13-8 9 8 7 14-9 11-16 9" stroke-width="2.2"/><circle cx="24" cy="24" r="2" ${F}/>`,
      scene(k) {
        const cx = 80 + (k.r() - .5) * 20, cy = 40;
        const arm = (off, col) => { let d = ''; for (let t = 0; t < 4.2 * Math.PI; t += .2) { const r = 1.5 * Math.exp(.21 * t); d += `${t ? 'L' : 'M'}${f(cx + Math.cos(t + off) * r * 1.8)} ${f(cy + Math.sin(t + off) * r)}`; } return `<path d="${d}" fill="none" stroke="${col}" stroke-width="1" ${k.gl}/>`; };
        const dots = times(26, () => { const t = k.r() * 4 * Math.PI, r = 1.5 * Math.exp(.21 * t), off = Math.floor(k.r() * 4) * Math.PI / 2; return `<rect x="${f(cx + Math.cos(t + off) * r * 1.8)}" y="${f(cy + Math.sin(t + off) * r)}" width="1.6" height="1.6" fill="${k.c('white')}" opacity="${f(.3 + k.r() * .7)}"/>`; });
        return `${arm(0, k.A)}${arm(Math.PI / 2, k.B)}${arm(Math.PI, k.A)}${arm(Math.PI * 1.5, k.B)}${dots}<circle cx="${f(cx)}" cy="${cy}" r="4" fill="${k.c('white')}" ${k.gl}/>`;
      }
    },
    'cybergrid-zsh': {
      label: 'CYBERGRID ZSH', color: '#50fa7b', a: 'acid_green', b: 'cyan', desc: 'a zsh prompt with git branch segments over the grid',
      icon: `<rect x="4" y="8" width="40" height="32" rx="2"/><circle cx="14" cy="20" r="3"/><circle cx="24" cy="30" r="3"/><path d="M26 17 12 33" stroke-width="2.2"/><path d="M30 30h8" stroke-width="2.2"/>`,
      scene(k) {
        const seg = (x, w, fill, label, tc) => `<path d="M${x} 30h${w}l5 6-5 6h-${w}l5-6Z" fill="${fill}"/><text x="${x + 7}" y="38" font-family="monospace" font-size="5.5" fill="${tc}">${label}</text>`;
        const branch = ['main', 'dev', 'feat/grid', 'fix/zsh'][Math.floor(k.r() * 4)];
        return `<g stroke="${k.c('line')}" stroke-width=".4">${times(17, i => `<path d="M${i * 10} 0V${H}"/>`)}${times(9, i => `<path d="M0 ${i * 10}H${W}"/>`)}</g>
          <rect x="4" y="30" width="6" height="12" fill="${k.A}"/>${seg(4, 34, k.A, '~/core', k.c('bg'))}${seg(40, 46, k.B, `⎇ ${branch}`, k.c('bg'))}${seg(88, 22, k.c('purple'), '✔', k.c('white'))}
          <text x="6" y="58" font-family="monospace" font-size="9" fill="${k.A}" ${k.gl}>%</text><rect x="16" y="51" width="${f(20 + k.r() * 60)}" height="2" fill="${k.c('white')}" opacity=".8"/><rect x="${f(40 + k.r() * 60)}" y="50" width="4" height="7" fill="${k.A}"/>
          <g fill="${k.c('muted')}" font-family="monospace" font-size="4.5"><text x="6" y="16">❯ git status -sb</text><text x="6" y="23">## ${branch}...origin/${branch}</text></g>`;
      }
    },
    'cyberpunk-noir': {
      label: 'CYBERPUNK NOIR', color: '#ff5577', a: 'hot_pink', b: 'cyan', desc: 'a lone trench-coat figure under the streetlamp',
      icon: `<circle cx="24" cy="12" r="5"/><path d="M15 12h18"/><path d="M18 18l-4 26h20l-4-26Z"/><path d="M24 18v14" stroke-width="1.6"/>`,
      scene(k) {
        const lx = 92 + k.r() * 30, fx = lx - 20 + k.r() * 10;
        k.def(`<linearGradient id="${k.id('cone')}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${k.c('white')}" stop-opacity=".45"/><stop offset="1" stop-color="${k.c('white')}" stop-opacity="0"/></linearGradient>`);
        return `${skyline(k, 66, 12, 18, 40, k.c('panel'), k.c('line'), .12, k.A)}<rect y="66" width="${W}" height="14" fill="${k.c('bg')}"/>
          <path d="M${f(lx)} 66V12h-12" stroke="${k.c('line')}" stroke-width="1.6" fill="none"/><path d="M${f(lx - 14)} 12h6l4 3h-14Z" fill="${k.c('muted')}"/><path d="M${f(lx - 11)} 15L${f(lx - 30)} 66H${f(lx + 8)}Z" fill="url(#${k.id('cone')})"/>
          <g fill="${k.c('bg')}"><circle cx="${f(fx)}" cy="38" r="3.6"/><path d="M${f(fx - 7)} 36h14l-2 2h-10Z"/><path d="M${f(fx - 5)} 42h10l2 22h-14Z"/></g><path d="M${f(fx + 5)} 42l2 22" stroke="${k.A}" stroke-width=".8" ${k.gl}/><path d="M${f(fx - 5)} 42l-2 22" stroke="${k.B}" stroke-width=".6" opacity=".7"/>
          <g stroke="${k.c('white')}" stroke-width=".35" opacity=".5">${times(28, () => { const x = k.r() * (W + 10), y = k.r() * H; return `<path d="M${f(x)} ${f(y)}l-1.2 4"/>`; })}</g>`;
      }
    },
    'darkwave-terminal': {
      label: 'DARKWAVE TERMINAL', color: '#7b61ff', a: 'purple', b: 'hot_pink', desc: 'terminal output dissolving into a dark audio wave',
      icon: `<rect x="4" y="8" width="40" height="32" rx="2"/><path d="M10 18l5 4-5 4" stroke-width="2"/><path d="M18 30c3-8 5-8 7 0s4 8 7 0 4-8 6 0" stroke-width="2"/>`,
      scene(k) {
        const rows = times(9, i => { const y = 14 + i * 6.4; let d = `M14 ${f(y)}`; const len = 30 + k.r() * 30; d += `H${f(14 + len)}`; for (let x = 14 + len; x <= 148; x += 3) d += `L${f(x)} ${f(y + Math.sin(x / 5 + i) * ((x - 14 - len) / 110) * 4)}`; return `<path d="${d}" fill="none" stroke="${i % 3 ? k.A : k.B}" stroke-width="1.2" opacity="${f(.5 + k.r() * .5)}"/>`; });
        return `${windowFrame(k, 8, 4, 144, 72, k.A)}<g ${k.gl}>${rows}</g><text x="14" y="72" font-family="monospace" font-size="5" fill="${k.B}">$ cat /dev/dsp | wave</text>`;
      }
    },
    'ghost-protocol-x': {
      label: 'GHOST PROTOCOL X', color: '#ff4444', a: 'red', b: 'white', desc: 'a classified dossier with a ghost peeking past the redactions',
      icon: `<path d="M12 44V22a12 12 0 0 1 24 0v22l-4-3-4 3-4-3-4 3-4-3Z"/><path d="M14 20h20" stroke-width="5"/><path d="M17 17l6 6M23 17l-6 6M25 17l6 6M31 17l-6 6" stroke="var(--bg)" stroke-width="1.4"/>`,
      scene(k) {
        const gx = 104 + k.r() * 16, gy = 34;
        return `<path d="M10 10h40l6 6h94v60H10Z" fill="${k.c('panel')}" stroke="${k.c('line')}"/><path d="M10 16h140" stroke="${k.c('line')}"/>
          <path d="${ghostPath(gx, gy, 1.5)}" fill="${k.B}" opacity=".92" ${k.gl}/>${ghostEyes(gx + 2, gy, 1.5, k.c('bg'))}
          ${times(7, i => { const y = 22 + i * 7, w = 40 + k.r() * 70, red = k.r() < .55; return `<rect x="18" y="${y}" width="${f(w)}" height="${red ? 5 : 1.6}" fill="${red ? k.c('bg') : k.c('muted')}" ${red ? '' : `transform="translate(0 1.7)"`}/>`; })}
          <g transform="rotate(-14 46 58)"><rect x="24" y="50" width="44" height="14" fill="none" stroke="${k.A}" stroke-width="1.4"/><text x="46" y="60.5" text-anchor="middle" font-family="monospace" font-size="7" font-weight="700" fill="${k.A}">X-${Math.floor(10 + k.r() * 89)}</text></g>
          <text x="14" y="14" font-family="monospace" font-size="4.5" fill="${k.A}">CLASSIFIED</text>`;
      }
    },
    'ghostcore-veil': {
      label: 'GHOSTCORE VEIL', color: '#d6c8ff', a: 'purple', b: 'white', desc: 'a ghost glimpsed through a translucent, rippling veil',
      icon: `<path d="M14 40V20a10 10 0 0 1 20 0v20l-3.3-3-3.3 3-3.4-3-3.4 3-3.3-3Z" ${F} opacity=".55"/><path d="M4 6h40"/><path d="M8 6c-2 12 2 26-2 38M18 6c-2 12 2 26-2 38M28 6c-2 12 2 26-2 38M38 6c-2 12 2 26-2 38" stroke-width="1.6"/>`,
      scene(k) {
        const gx = 60 + k.r() * 40, gy = 34, s = 1.9;
        k.def(`<radialGradient id="${k.id('aura')}"><stop stop-color="${k.A}" stop-opacity=".95"/><stop offset=".5" stop-color="${k.A}" stop-opacity=".35"/><stop offset="1" stop-color="${k.A}" stop-opacity="0"/></radialGradient><linearGradient id="${k.id('veil')}" x1="0" y1="0" x2="1" y2="0">${times(9, i => `<stop offset="${f(i / 8)}" stop-color="${k.c('panel')}" stop-opacity="${i % 2 ? '.22' : '.5'}"/>`)}</linearGradient>`);
        let folds = ''; for (let i = 0; i < 9; i++) { const x = 6 + i * 18 + k.r() * 4; folds += `<path d="M${f(x)} 6C${f(x - 4)} 24 ${f(x + 5)} 44 ${f(x - 2)} ${H}" stroke="${k.B}" stroke-width=".6" fill="none" opacity="${f(.25 + k.r() * .35)}"/>`; }
        let hem = ''; for (let x = W; x > 0; x -= 10) hem += `Q${x - 5} ${f(H - 2 - k.r() * 6)} ${x - 10} ${H - 6}`;
        const top = times(8, i => `Q${i * 20 + 10} ${f(9 + k.r() * 3)} ${i * 20 + 20} 6`);
        return `<circle cx="${f(gx)}" cy="${gy + 6}" r="30" fill="url(#${k.id('aura')})"/><path d="${ghostPath(gx, gy, s)}" fill="${k.B}" ${k.gl}/>${ghostEyes(gx, gy, s, k.c('bg'))}<ellipse cx="${f(gx)}" cy="${f(gy + 9)}" rx="3" ry="3.6" fill="${k.c('bg')}" opacity=".7"/>
          <path d="M0 6${top}L${W} ${H - 6}${hem}Z" fill="url(#${k.id('veil')})"/>
          <path d="M${W} ${H - 6}${hem}" fill="none" stroke="${k.B}" stroke-width=".5" opacity=".5"/>${folds}<rect x="0" y="3" width="${W}" height="3" fill="${k.c('line')}"/>${times(9, i => `<circle cx="${4 + i * 19}" cy="4.5" r="1.4" fill="${k.c('muted')}"/>`)}`;
      }
    },
    'ghostwire-matrix': {
      label: 'GHOSTWIRE MATRIX', color: '#39ff88', a: 'acid_green', b: 'cyan', desc: 'a wireframe ghost built from falling glyph columns',
      icon: `<path d="M14 40V20a10 10 0 0 1 20 0v20l-3.3-3-3.3 3-3.4-3-3.4 3-3.3-3Z" stroke-dasharray="2.5 2"/><path d="M19 22v6M29 22v6" stroke-width="3"/><path d="M8 6v10M40 10v12M6 30v8" stroke-width="1.6" opacity=".6"/>`,
      scene(k) {
        const gx = 80 + (k.r() - .5) * 40, gy = 30, s = 2.3;
        k.def(`<clipPath id="${k.id('gc')}"><path d="${ghostPath(gx, gy, s)}"/></clipPath>`);
        const cols = (bright) => times(27, i => { const x = 2 + i * 6, off = k.r() * 30; return times(10, j => { const y = (j * 8 + off) % H; return `<rect x="${x}" y="${f(y)}" width="3.2" height="${f(2 + k.r() * 3)}" fill="${j === 9 ? k.c('white') : bright ? k.A : k.c('line')}" opacity="${bright ? f(.6 + k.r() * .4) : f(.25 + k.r() * .4)}"/>`; }); });
        return `<g>${cols(false)}</g><g clip-path="url(#${k.id('gc')})">${cols(true)}</g><path d="${ghostPath(gx, gy, s)}" fill="none" stroke="${k.B}" stroke-width=".9" stroke-dasharray="3 1.5" ${k.gl}/>${ghostEyes(gx, gy, s, k.c('bg'))}`;
      }
    },
    'neon-ghost-omarchy': {
      label: 'NEON GHOST OMARCHY', color: '#ff6ad5', a: 'hot_pink', b: 'cyan', desc: 'a neon ghost drifting across a tiling desktop',
      icon: `<rect x="4" y="4" width="40" height="40" rx="2" opacity=".5"/><path d="M4 11h40M22 11v33" opacity=".5"/><path d="M16 38V24a8 8 0 0 1 16 0v14l-2.7-2.5-2.7 2.5-2.6-2.5-2.6 2.5-2.7-2.5Z" ${F}/>`,
      scene(k) {
        const gx = 30 + k.r() * 100, gy = 34, s = 1.7;
        return `${bar(k, k.A)}${tiles(k, 4, 10, 152, 66, k.B, Math.floor(k.r() * 4))}${codeLines(k, 8, 16, 11, 58, 4.8)}${codeLines(k, 78, 16, 4, 70, 4.8)}
          <path d="M${f(gx - 40)} ${gy + 14}q20 -8 40 0" stroke="${k.A}" stroke-width="5" fill="none" opacity=".18" stroke-linecap="round"/><path d="${ghostPath(gx, gy, s)}" fill="${k.c('bg')}" stroke="${k.A}" stroke-width="1.4" ${k.gl}/>${ghostEyes(gx, gy, s, k.B)}`;
      }
    },
    'neon-specter-tty': {
      label: 'NEON SPECTER TTY', color: '#00ffd0', a: 'cyan', b: 'hot_pink', desc: 'a wraith rising out of a VT100 console',
      icon: `<rect x="6" y="22" width="36" height="20" rx="2"/><path d="M12 30l4 3-4 3" stroke-width="1.8"/><path d="M24 22c-6-4-4-10 0-12 4 2 6-2 4-6 6 2 8 10 2 14Z" ${F}/>`,
      scene(k) {
        const cx = 80 + (k.r() - .5) * 20;
        let tail = `M${f(cx - 10)} 40`; for (let y = 40; y >= 10; y -= 6) tail += `Q${f(cx - 14 + k.r() * 28)} ${y - 3} ${f(cx - 8 + k.r() * 16)} ${y - 6}`;
        return `${crtMonitor(k, cx - 34, 36, 68, 30, k.A)}<rect x="${f(cx - 46)}" y="72" width="92" height="7" rx="1" fill="${k.c('panel')}" stroke="${k.c('line')}"/>${times(14, i => `<rect x="${f(cx - 44 + i * 6.4)}" y="74" width="5" height="3" fill="${k.c('line')}"/>`)}
          <g font-family="monospace" font-size="4.5" fill="${k.A}"><text x="${f(cx - 30)}" y="46">login: specter</text><text x="${f(cx - 30)}" y="53">tty1 &gt; _</text></g>
          <path d="${tail}" fill="none" stroke="${k.A}" stroke-width="5" opacity=".2" stroke-linecap="round"/><path d="${tail}" fill="none" stroke="${k.A}" stroke-width="1.2" ${k.gl}/>
          <path d="M${f(cx - 7)} 16c0-8 14-8 14 0v8l-3-2-4 3-3-3-4 2Z" fill="${k.c('bg')}" stroke="${k.B}" ${k.gl}/><circle cx="${f(cx - 2.5)}" cy="16" r="1.3" fill="${k.B}"/><circle cx="${f(cx + 2.5)}" cy="16" r="1.3" fill="${k.B}"/>`;
      }
    },
    'omarchy-cyber-synth': {
      label: 'OMARCHY CYBER SYNTH', color: '#ffb86c', a: 'orange', b: 'cyan', desc: 'a tiling desktop whose panes pulse like a synthesiser',
      icon: `<rect x="4" y="4" width="40" height="40" rx="2"/><path d="M4 11h40M24 11v33M24 28h20"/><path d="M8 30c2-8 4-8 6 0s4 8 6 0" stroke-width="1.8"/>`,
      scene(k) {
        const panes = [[4, 10, 74, 66], [80, 10, 76, 32], [80, 44, 37, 32], [119, 44, 37, 32]];
        return `${bar(k, k.A)}${panes.map(([x, y, w, h], i) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${k.c('panel')}" stroke="${i === 0 ? k.A : k.c('line')}"/><path d="${wave(x + 3, x + w - 3, y + h / 2, h * .3, 1 + k.r() * 4, k.r() * 6)}" fill="none" stroke="${[k.A, k.B, k.c('hot_pink'), k.c('acid_green')][i]}" stroke-width="${i === 0 ? 1.4 : 1}" ${i === 0 ? k.gl : ''}/>`).join('')}
          <g fill="${k.A}" opacity=".5">${times(10, i => `<rect x="${8 + i * 7}" y="${f(68 - k.r() * 8)}" width="4" height="${f(2 + k.r() * 8)}"/>`)}</g>`;
      }
    },
    'phantom-wave-core': {
      label: 'PHANTOM WAVE CORE', color: '#a0a8ff', a: 'purple', b: 'cyan', desc: 'a translucent phantom made of stacked waves',
      icon: `<path d="M14 40V20a10 10 0 0 1 20 0v20" opacity=".5"/><path d="M14 20c3-3 5 3 10 0s7 3 10 0M14 27c3-3 5 3 10 0s7 3 10 0M14 34c3-3 5 3 10 0s7 3 10 0" stroke-width="2"/>`,
      scene(k) {
        const gx = 80 + (k.r() - .5) * 40, gy = 30, s = 2.4;
        k.def(`<clipPath id="${k.id('pc')}"><path d="${ghostPath(gx, gy, s)}"/></clipPath>`);
        const lines = times(18, i => `<path d="${wave(0, W, 4 + i * 4.4, 1.6 + k.r(), 3 + k.r() * 2, i * .6)}" fill="none" stroke="${i % 2 ? k.A : k.B}" stroke-width="1"/>`);
        return `<g opacity=".18">${lines}</g><g clip-path="url(#${k.id('pc')})" ${k.gl}>${lines}</g><path d="${ghostPath(gx, gy, s)}" fill="none" stroke="${k.c('white')}" stroke-width=".5" opacity=".6"/>${ghostEyes(gx, gy, s, k.c('bg'))}`;
      }
    },
    'subgrid-wave-ui': {
      label: 'SUBGRID WAVE UI', color: '#00c2ff', a: 'cyan', b: 'purple', desc: 'UI panels floating over an undulating grid floor',
      icon: `<rect x="10" y="4" width="22" height="14" rx="1.5"/><rect x="26" y="12" width="16" height="10" rx="1.5"/><path d="M4 32c6-4 10 4 20 0s14 4 20 0M4 40c6-4 10 4 20 0s14 4 20 0" stroke-width="1.8"/>`,
      scene(k) {
        const ph = k.r() * 6;
        const rows = times(7, i => { const y = 46 + i * 5; return `<path d="${wave(0, W, y, 2 + i * .5, 2, ph + i * .5, 4)}" fill="none" stroke="${k.A}" stroke-width=".6" opacity="${f(.4 + i * .08)}"/>`; });
        const colsV = times(17, i => { let d = ''; for (let j = 0; j <= 6; j++) { const y = 46 + j * 5, x = 80 + (i * 10 - 80) * (1 + j * .12); d += `${j ? 'L' : 'M'}${f(x)} ${f(y + Math.sin((x / W) * Math.PI * 4 + ph + j * .5) * (2 + j * .5))}`; } return `<path d="${d}" fill="none" stroke="${k.A}" stroke-width=".5" opacity=".5"/>`; });
        const panel = (x, y, w, h, col) => `<rect x="${f(x)}" y="${f(y)}" width="${w}" height="${h}" rx="1.5" fill="${k.c('panel')}" stroke="${col}" ${k.gl}/><rect x="${f(x + 3)}" y="${f(y + 3)}" width="${w * .5}" height="2" fill="${col}"/><rect x="${f(x + 3)}" y="${f(y + 8)}" width="${w - 6}" height="1.4" fill="${k.c('muted')}"/><rect x="${f(x + 3)}" y="${f(y + 12)}" width="${w * .7}" height="1.4" fill="${k.c('muted')}"/>`;
        return `${rows}${colsV}${panel(18 + k.r() * 10, 10 + k.r() * 6, 44, 22, k.A)}${panel(86 + k.r() * 10, 6 + k.r() * 6, 34, 18, k.B)}${panel(110 + k.r() * 10, 24 + k.r() * 6, 36, 16, k.A)}`;
      }
    },
    'synth-decay-crt': {
      label: 'SYNTH DECAY CRT', color: '#ffcc33', a: 'orange', b: 'hot_pink', desc: 'a burned-in CRT with scanline rot and colour bleed',
      icon: `<rect x="5" y="8" width="38" height="28" rx="5"/><path d="M18 42h12M24 36v6"/><path d="M14 12l6 8-3 4 5 6" stroke-width="1.8"/><path d="M10 26h10M28 18h10" stroke-width="1.2" opacity=".6"/>`,
      scene(k) {
        k.def(`<clipPath id="${k.id('scr')}"><rect x="22" y="8" width="116" height="58" rx="4"/></clipPath>`);
        const burn = `<circle cx="80" cy="37" r="16" fill="none" stroke="COL" stroke-width="2.4"/><path d="M50 22h20M90 52h22M40 50h14" stroke="COL" stroke-width="2"/>`;
        const rot = times(14, () => `<rect x="22" y="${f(8 + k.r() * 58)}" width="116" height="${f(.6 + k.r() * 1.6)}" fill="${k.c('bg')}" opacity=".8"/>`);
        return `${crtMonitor(k, 22, 8, 116, 58, k.c('line'))}<g clip-path="url(#${k.id('scr')})"><g transform="translate(-1.6 0)" opacity=".55">${burn.replaceAll('COL', k.c('red'))}</g><g transform="translate(1.6 0)" opacity=".55">${burn.replaceAll('COL', k.c('cyan'))}</g>${burn.replaceAll('COL', k.A)}
          ${times(29, i => `<rect x="22" y="${8 + i * 2}" width="116" height=".8" fill="${k.c('bg')}" opacity=".35"/>`)}${rot}<rect x="22" y="${f(30 + k.r() * 20)}" width="116" height="3" fill="${k.B}" opacity=".3"/></g>
          <path d="M${f(110 + k.r() * 20)} 8l-6 12 4 4-8 10" stroke="${k.c('white')}" stroke-width=".6" fill="none" opacity=".8"/>`;
      }
    },
    'synth-syntax-grid': {
      label: 'SYNTH SYNTAX GRID', color: '#66ffcc', a: 'acid_green', b: 'hot_pink', desc: 'code tokens laid out like a step sequencer',
      icon: `<rect x="4" y="4" width="40" height="40" rx="2"/><path d="M4 17h40M4 30h40M17 4v40M30 4v40" stroke-width="1.4"/><path d="M8 8h5v5H8ZM21 21h5v5h-5ZM34 34h5v5h-5Z" ${F}/>`,
      scene(k) {
        const toks = ['fn', '{ }', '=>', 'let', '()', '::', '[]', '&&', 'if', '0x', '++', '//'];
        const play = Math.floor(k.r() * 8);
        const cells = times(8, c => times(4, r => { const on = k.r() < .38, x = 6 + c * 19, y = 8 + r * 17; return `<rect x="${x}" y="${y}" width="17" height="15" rx="1.5" fill="${on ? (c === play ? k.B : k.A) : k.c('panel')}" opacity="${on ? (c === play ? 1 : .75) : 1}" stroke="${k.c('line')}"/>${on ? `<text x="${x + 8.5}" y="${y + 10}" text-anchor="middle" font-family="monospace" font-size="5.5" fill="${k.c('bg')}">${toks[Math.floor(k.r() * toks.length)]}</text>` : ''}`; }));
        return `${cells}<rect x="${5 + play * 19}" y="6" width="19" height="72" fill="none" stroke="${k.B}" stroke-width="1" ${k.gl}/><g fill="${k.c('muted')}" font-family="monospace" font-size="4">${times(8, i => `<text x="${12 + i * 19}" y="79">${i + 1}</text>`)}</g>`;
      }
    },
    'synthwave-dusk': {
      label: 'SYNTHWAVE DUSK', color: '#ff7edb', a: 'hot_pink', b: 'purple', desc: 'late synthwave dusk: the sun nearly set under a violet sky',
      icon: `<path d="M10 30a14 14 0 0 1 28 0Z" ${F} opacity=".8"/><path d="M3 30h42M6 36h36M10 42h28" stroke-width="1.8"/><circle cx="12" cy="10" r="1.4" ${F}/><circle cx="36" cy="8" r="1.4" ${F}/>`,
      scene(k) {
        const sx = 80 + (k.r() - .5) * 50, R = 24;
        k.def(`<linearGradient id="${k.id('sky')}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${k.c('bg')}"/><stop offset=".6" stop-color="${k.B}" stop-opacity=".55"/><stop offset="1" stop-color="${k.A}" stop-opacity=".75"/></linearGradient><linearGradient id="${k.id('sun')}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${k.c('orange')}"/><stop offset="1" stop-color="${k.A}"/></linearGradient><clipPath id="${k.id('sc')}"><rect width="${W}" height="${k.hz}"/></clipPath>`);
        return `<rect width="${W}" height="${k.hz}" fill="url(#${k.id('sky')})"/>${stars(k, 18, k.hz - 14)}<g clip-path="url(#${k.id('sc')})"><circle cx="${f(sx)}" cy="${k.hz + 12}" r="${R}" fill="url(#${k.id('sun')})" ${k.gl}/>${times(3, i => `<rect x="${f(sx - R)}" y="${f(k.hz - 8 + i * 3)}" width="${2 * R}" height="${f(1 + i * .5)}" fill="${k.B}"/>`)}</g>
          <rect y="${k.hz}" width="${W}" height="${H - k.hz}" fill="${k.c('bg')}"/>${floor(k, k.B, sx, 5, 8, .6)}<path d="M0 ${k.hz}H${W}" stroke="${k.A}" ${k.gl}/>
          <path d="M0 ${k.hz}L18 ${k.hz - 10}L30 ${k.hz - 4}L46 ${k.hz - 14}L62 ${k.hz}Z M100 ${k.hz}L118 ${k.hz - 12}L132 ${k.hz - 5}L146 ${k.hz - 11}L${W} ${k.hz}Z" fill="${k.c('panel')}" stroke="${k.B}" stroke-width=".6"/>`;
      }
    },
    'terminal-specter': {
      label: 'TERMINAL SPECTER', color: '#b8ff5c', a: 'acid_green', b: 'purple', desc: 'a hooded specter typing at a lone terminal',
      icon: `<path d="M12 44c0-14 2-30 12-36 10 6 12 22 12 36Z"/><path d="M18 22l4 3-4 3M24 30h6" stroke-width="2"/>`,
      scene(k) {
        const hx = 46 + k.r() * 12;
        return `<rect x="96" y="14" width="56" height="38" rx="2" fill="${k.c('panel')}" stroke="${k.A}"/><rect x="99" y="17" width="50" height="32" fill="${k.c('bg')}"/>${codeLines(k, 102, 21, 6, 44, 4.6, ['acid_green', 'acid_green', 'white'])}<rect x="${f(110 + k.r() * 30)}" y="44" width="3" height="3" fill="${k.A}"/>
          <path d="M152 30L${f(hx + 20)} 40L${f(hx + 20)} 64L152 52Z" fill="${k.A}" opacity=".08"/><rect x="60" y="62" width="100" height="4" fill="${k.c('line')}"/><rect x="96" y="58" width="40" height="4" rx="1" fill="${k.c('muted')}"/>
          <path d="M${f(hx - 18)} ${H}C${f(hx - 18)} 50 ${f(hx - 12)} 22 ${f(hx + 2)} 14C${f(hx + 16)} 22 ${f(hx + 22)} 44 ${f(hx + 24)} ${H}Z" fill="${k.c('bg')}" stroke="${k.B}" stroke-width=".9"/>
          <path d="M${f(hx - 4)} 28c0-6 12-6 13 2l-1 9c-4 3-9 2-12-1Z" fill="${k.c('panel')}"/><circle cx="${f(hx + 4)}" cy="31" r="1.2" fill="${k.A}" ${k.gl}/><circle cx="${f(hx + 8)}" cy="31" r="1.2" fill="${k.A}" ${k.gl}/>
          <path d="M${f(hx + 16)} 48Q${f(hx + 34)} 52 98 58" stroke="${k.B}" stroke-width="2" fill="none"/>`;
      }
    },
    'tokengrid-neon': {
      label: 'TOKENGRID NEON', color: '#ff9f1c', a: 'orange', b: 'cyan', desc: 'a grid of glowing token tiles lighting in sequence',
      icon: `<rect x="5" y="5" width="11" height="11" rx="2" ${F}/><rect x="19" y="5" width="11" height="11" rx="2"/><rect x="33" y="5" width="11" height="11" rx="2"/><rect x="5" y="19" width="11" height="11" rx="2"/><rect x="19" y="19" width="11" height="11" rx="2" ${F}/><rect x="33" y="19" width="11" height="11" rx="2"/><rect x="5" y="33" width="11" height="11" rx="2"/><rect x="19" y="33" width="11" height="11" rx="2"/><rect x="33" y="33" width="11" height="11" rx="2" ${F}/>`,
      scene(k) {
        const front = k.r() * 14;
        return times(13, c => times(6, r => { const d = c + r, x = 4 + c * 12, y = 4 + r * 12.2, lit = Math.max(0, 1 - Math.abs(d - front) / 3), col = (c + r) % 3 ? k.A : k.B; return `<rect x="${x}" y="${f(y)}" width="10" height="10" rx="2" fill="${lit > .05 ? col : k.c('panel')}" opacity="${lit > .05 ? f(.25 + lit * .75) : 1}" stroke="${lit > .6 ? k.c('white') : k.c('line')}" stroke-width=".5" ${lit > .6 ? k.gl : ''}/>${lit > .6 ? `<rect x="${x + 3}" y="${f(y + 4)}" width="4" height="2" fill="${k.c('bg')}"/>` : ''}`; }));
      }
    },
    'wavefront-cyber': {
      label: 'WAVEFRONT CYBER', color: '#29e6ff', a: 'cyan', b: 'hot_pink', desc: 'a wavefront rolling across a wireframe landscape',
      icon: `<path d="M6 40a18 18 0 0 1 18-18M6 40a28 28 0 0 1 28-28M6 40a38 38 0 0 1 38-38" stroke-width="2.2"/><circle cx="6" cy="40" r="3" ${F}/>`,
      scene(k) {
        const ox = k.r() * 40, oy = H;
        const hills = times(6, i => { const y = 44 + i * 6; let d = ''; for (let x = 0; x <= W; x += 8) d += `${x ? 'L' : 'M'}${x} ${f(y - Math.abs(Math.sin(x / 30 + i * .7 + ox)) * (10 - i))}`; return `<path d="${d}" fill="none" stroke="${k.c('line')}" stroke-width=".7"/>`; });
        return `${hills}<g fill="none" stroke="${k.A}" ${k.gl}>${times(6, i => `<circle cx="${f(ox)}" cy="${oy}" r="${30 + i * 22}" stroke-width="${f(1.4 - i * .18)}" opacity="${f(1 - i * .15)}"/>`)}</g><circle cx="${f(ox)}" cy="${oy}" r="6" fill="${k.B}" ${k.gl}/>
          ${stars(k, 10, 30)}`;
      }
    }
  };

  // Inject every family emblem into the page sprite as <symbol id="fam-…">.
  // A family's emblem replaces any older symbol with the same id.
  const sprite = document.getElementById('fam-mashup')?.parentNode || document.querySelector('body > svg[width="0"]');
  const ALL_ICON = { icon: `<rect x="5" y="5" width="16" height="16" rx="2"/><rect x="27" y="5" width="16" height="16" rx="2"/><rect x="5" y="27" width="16" height="16" rx="2"/><rect x="27" y="27" width="16" height="16" rx="2" ${F}/>` };
  if (sprite) {
    [...Object.entries(FAMILIES), ['all', ALL_ICON]].forEach(([id, fam]) => {
      document.getElementById(`fam-${id}`)?.remove();
      const sym = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
      sym.id = `fam-${id}`; sym.setAttribute('viewBox', '0 0 48 48');
      sym.innerHTML = `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${fam.icon}</g>`;
      sprite.appendChild(sym);
    });
  }
  window.CC_FAMILIES = FAMILIES;
})();
