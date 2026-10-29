// Converts the built SPIRIT site (Astro dist) into OpenSpace content: one custom component per
// page chunk (masthead, each <main> section, footer) carrying the original markup and CSS, with
// every word, link and image exposed as an editable field.
//
// Usage: node convert.mjs <origDist> <osRepo> <gfonts.css>
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parseHTML } from 'linkedom';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import sharp from 'sharp';

const [DIST, REPO, GFONTS] = process.argv.slice(2);
const FILTERS = JSON.parse(fs.readFileSync(new URL('./filters.json', import.meta.url), 'utf8'));
const ROOT_PX = 17; // html { font-size: 17px } on the original site
const MQ_PX = 16; // rem inside media queries is relative to the initial font size
const STUDIO = 'https://studio.openspace.host/sites/st_3c6zwe3a43';
const PAGE_BG = '#F2EAD8';

const PAGES = [
  ['', 'home'], ['mission', 'mission'], ['programs', 'programs'], ['the-commons', 'the-commons'],
  ['stewards', 'stewards'], ['connect', 'connect'], ['catalog', 'catalog'], ['donate', 'donate'],
  ['words', 'words'], ['programs/commons-sense-education', 'programs/commons-sense-education'],
  ['programs/community-grant-rounds', 'programs/community-grant-rounds'],
  ['programs/neighborhood-resiliency', 'programs/neighborhood-resiliency'],
  ['programs/solidarity-suppers', 'programs/solidarity-suppers'],
];

// Template whitelist (mirrors @omniharmonic/openspace-schema components/template.ts).
const TEMPLATE_TAGS = new Set(('div span section article aside header footer nav h1 h2 h3 h4 h5 h6 p ul ol li dl dt dd figure figcaption blockquote cite q em strong b i small mark br hr time abbr sup sub a button details summary').split(' '));
const SVG_TAGS = new Set('svg g path circle ellipse rect line polyline polygon defs lineargradient radialgradient stop title'.split(' '));
const SVG_ATTRS = new Set('viewbox xmlns fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray stroke-dashoffset stroke-miterlimit fill-rule clip-rule fill-opacity stroke-opacity opacity d cx cy r rx ry x y x1 y1 x2 y2 width height points transform focusable preserveaspectratio offset stop-color stop-opacity gradientunits gradienttransform vector-effect pathlength'.split(' '));
const GLOBAL_ATTRS = new Set(['class', 'role', 'title', 'lang', 'dir', 'hidden', 'tabindex']);
const TAG_ATTRS = { a: ['rel'], button: ['type'], details: ['open'], time: ['datetime'], ol: ['start', 'reversed'], li: ['value'], blockquote: ['cite'], q: ['cite'] };
const INLINE_TAGS = new Set('span a em strong b i small mark abbr sup sub time cite q code u s label kbd'.split(' '));

const B32 = '0123456789abcdefghjkmnpqrstvwxyz';
const newId = (prefix, seed) => {
  const h = crypto.createHash('sha256').update(seed).digest();
  let s = '';
  for (let i = 0; i < 10; i++) s += B32[h[i] % 32];
  return `${prefix}_${s}`;
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const preview = (s, n = 28) => { const t = s.replace(/\s+/g, ' ').trim(); return t.length > n ? `${t.slice(0, n)}…` : t; };

// ---------------------------------------------------------------- CSS helpers
const pxFrom = (num, base) => `${+(parseFloat(num) * base).toFixed(4)}px`;
// Component CSS only accepts custom property names made of letters and hyphens.
const DIGIT = 'abcdefghij';
const fixVarName = (name) => (/\d/.test(name) ? `--xv-${name.slice(2).replace(/\d/g, (d) => DIGIT[d])}` : name);
const fixVars = (v) => v.replace(/--[\w-]+/g, (m) => fixVarName(m));
const remToPx = (v, base) => v.replace(/(-?\d*\.?\d+)rem\b/g, (_, n) => pxFrom(n, base));

const FONT_FACES = (() => {
  const css = fs.readFileSync(GFONTS, 'utf8');
  const rename = { 'Bricolage Grotesque': 'Bricolage Grotesque Variable', Fraunces: 'Fraunces Variable', 'Public Sans': 'Public Sans Variable', 'JetBrains Mono': 'JetBrains Mono' };
  const out = [];
  for (const m of css.matchAll(/\/\* ([\w-]+) \*\/\s*@font-face \{([^}]*)\}/g)) {
    if (m[1] !== 'latin') continue;
    const fam = /font-family: '([^']+)'/.exec(m[2])[1];
    // JetBrains Mono is one variable file on Google Fonts: one face covers 400 and 700.
    if (fam === 'JetBrains Mono') { if (out.some((f) => f.family === 'JetBrains Mono')) continue; m[2] = m[2].replace(/font-weight: \d+;/, 'font-weight: 400 700;'); }
    out.push({ family: rename[fam], css: `@font-face{${m[2].replace(/\s*\n\s*/g, '').replace(`'${fam}'`, `"${rename[fam]}"`).replace(/font-stretch:[^;]+;/, '').replace(/font-display:[^;]+;/, '').replace(/font-style: normal;/, '').replace(/: /g, ':').replace(/, /g, ',').replace(/;}?$/, '')}}` });
  }
  return out;
})();

/** Page CSS → CSS that the component scoper accepts and that renders like the original. */
function transformCss(src) {
  const root = postcss.parse(src);
  const propInit = [];
  root.walkAtRules((at) => {
    if (at.name === 'layer') {
      if (at.nodes) at.replaceWith(at.nodes);
      else at.remove();
    } else if (at.name === 'property') {
      let init = null;
      at.walkDecls('initial-value', (d) => { init = d.value; });
      if (init !== null) propInit.push(`${at.params.trim()}:${init}`);
      at.remove();
    } else if (at.name === 'font-face') at.remove();
    else if (at.name === 'media' || at.name === 'container') at.params = remToPx(at.params, MQ_PX);
    else if (at.name === 'supports' && /-webkit-hyphens:none/.test(at.params)) at.remove(); // Tailwind @property fallback; handled below
  });
  // Repeat for nested layers inside media etc.
  let again = true;
  while (again) { again = false; root.walkAtRules('layer', (at) => { again = true; if (at.nodes) at.replaceWith(at.nodes); else at.remove(); }); }
  root.walkDecls((d) => {
    d.value = fixVars(remToPx(d.value, ROOT_PX));
    if (d.prop.startsWith('--')) d.prop = fixVarName(d.prop);
    if (d.prop === 'filter' && /url\(#/.test(d.value)) d.value = d.value.replace(/url\(#[^)]*\)/g, '').trim() || 'none';
  });
  const pre = propInit.length ? `*,::before,::after,::backdrop{${propInit.join(';')}}\n` : '';
  return pre + root.toString();
}

const RENAMED = { table: 'xt-table', thead: 'xt-thead', tbody: 'xt-tbody', tfoot: 'xt-tfoot', tr: 'xt-tr', td: 'xt-td', th: 'xt-th', caption: 'xt-caption', label: 'xt-label', code: 'xt-code', u: 'xt-u', s: 'xt-s', kbd: 'xt-kbd', pre: 'xt-pre', address: 'xt-address', main: 'xt-main' };

function rewriteSelector(sel) {
  return selectorParser((sels) => {
    sels.each((s) => {
      s.walkTags((t) => {
        const name = t.value.toLowerCase();
        if (name === 'html' || name === 'body') t.replaceWith(selectorParser.pseudo({ value: ':scope' }));
        else if (name === 'img' || name === 'picture') {
          // Drop attribute selectors from the same compound (the image wrapper doesn't carry them).
          let n = t.next();
          while (n && n.type === 'attribute') { const nx = n.next(); n.remove(); n = nx; }
          let p = t.prev();
          while (p && p.type === 'attribute') { const pv = p.prev(); p.remove(); p = pv; }
          t.replaceWith(selectorParser.className({ value: 'ximg' }));
        } else if (RENAMED[name]) t.replaceWith(selectorParser.className({ value: RENAMED[name] }));
      });
      s.walkPseudos((p) => { if (p.value === ':root' || p.value === ':host') p.value = ':scope'; });
      s.walkIds((id) => id.replaceWith(selectorParser.attribute({ attribute: 'data-xid', operator: '=', value: `"${id.value}"`, raws: {} })));
    });
  }).processSync(sel);
}

/** Keep the rules whose selectors can match this chunk; drop unused custom properties and keyframes. */
function purgeCss(src, present, extraCss) {
  const root = postcss.parse(src);
  const ALWAYS_TAGS = new Set(['html', 'body', '*']);
  const matches = (sel) => {
    let ok = true;
    try {
      selectorParser((sels) => {
        sels.walk((n) => {
          // Contents of :not() / :has() don't need to exist.
          let p = n.parent;
          while (p && p.type !== 'root') { if (p.type === 'pseudo' && /^:(not|has)$/i.test(p.value)) return; p = p.parent; }
          if (n.type === 'class' && !present.classes.has(n.value)) ok = false;
          else if (n.type === 'tag' && !ALWAYS_TAGS.has(n.value.toLowerCase()) && !present.tags.has(n.value.toLowerCase())) ok = false;
          else if (n.type === 'id' && !present.ids.has(n.value)) ok = false;
        });
      }).processSync(sel);
    } catch { return true; }
    return ok;
  };
  root.walkRules((r) => {
    if (r.parent?.type === 'atrule' && /keyframes$/.test(r.parent.name)) return;
    const keep = r.selectors.filter(matches);
    if (!keep.length) r.remove();
    else r.selectors = keep;
  });
  // Remove emptied at-rules.
  let changed = true;
  while (changed) { changed = false; root.walkAtRules((a) => { if (a.nodes && a.nodes.length === 0) { a.remove(); changed = true; } }); }
  // Custom properties: keep only those reachable from var() uses outside their own definitions.
  const used = new Set();
  const scan = (v) => { for (const m of v.matchAll(/var\(\s*(--[\w-]+)/g)) used.add(m[1]); };
  const defs = new Map();
  root.walkDecls((d) => { if (d.prop.startsWith('--')) { if (!defs.has(d.prop)) defs.set(d.prop, []); defs.get(d.prop).push(d); } else scan(d.value); });
  scan(extraCss);
  let grew = true;
  while (grew) { grew = false; for (const [k, ds] of defs) if (used.has(k)) for (const d of ds) { const before = used.size; scan(d.value); if (used.size > before) grew = true; } }
  for (const [k, ds] of defs) if (!used.has(k)) ds.forEach((d) => d.remove());
  // Keyframes: keep the ones an animation names.
  const anim = new Set();
  root.walkDecls(/^animation(-name)?$/, (d) => { for (const w of d.value.split(/[\s,]+/)) anim.add(w); });
  root.walkAtRules(/keyframes$/, (a) => { if (!anim.has(a.params.trim())) a.remove(); });
  root.walkRules((r) => { if (r.nodes.length === 0) r.remove(); });
  changed = true;
  while (changed) { changed = false; root.walkAtRules((a) => { if (a.nodes && a.nodes.length === 0) { a.remove(); changed = true; } }); }
  return root.toString();
}

const aliases = new Map();
function classAlias(name) {
  if (/^-?[_a-zA-Z][\w-]*$/.test(name) && name.length <= 20) return name;
  if (!aliases.has(name)) aliases.set(name, `k${aliases.size.toString(36)}`);
  return aliases.get(name);
}

function minifyCss(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '\n').replace(/\n+/g, '\n')
    .replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').trim();
}

// Base CSS every component needs: the image wrapper behaves like the original <img>, and
// renamed tags get their user-agent display back.
const BASE_CSS = `
:where(p,li,blockquote,h1,h2,h3,h4,h5,h6){text-wrap:wrap}:where(summary){min-height:0;align-content:normal}
.ximg,.ximg>picture{display:contents!important}
.ximg::before,.ximg::after,.ximg source{display:none!important}
.ximg .os-img__img{display:inline;width:auto;height:auto;max-width:none;object-fit:fill;object-position:50% 50%;filter:none;mix-blend-mode:normal;transition:none;border-radius:0;aspect-ratio:auto}
.xt-table{display:table;border-spacing:2px;box-sizing:border-box;text-indent:initial}.xt-thead{display:table-header-group;vertical-align:middle}.xt-tbody{display:table-row-group;vertical-align:middle}.xt-tfoot{display:table-footer-group;vertical-align:middle}.xt-tr{display:table-row;vertical-align:inherit}.xt-td,.xt-th{display:table-cell;vertical-align:inherit}.xt-th{font-weight:700;text-align:-internal-center}.xt-caption{display:table-caption}
.xt-code,.xt-kbd{font-family:monospace}.xt-u{text-decoration:underline}.xt-s{text-decoration:line-through}.xt-pre{display:block;white-space:pre;font-family:monospace}.xt-address{display:block;font-style:italic}.xt-main{display:block}
`;

// ---------------------------------------------------------------- media
const mediaJsonPath = path.join(REPO, 'content/media.json');
const media = JSON.parse(fs.readFileSync(mediaJsonPath, 'utf8'));
const mediaByOrig = new Map();
const DUO = {
  'duotone-clay': [[0.18, 0.85], [0.10, 0.70], [0.06, 0.52]],
  'duotone-clay-deep': [[0.22, 0.78], [0.10, 0.44], [0.06, 0.26]],
  'duotone-sage': [[0.16, 0.78], [0.22, 0.82], [0.14, 0.62]],
  'duotone-creek': [[0.12, 0.70], [0.20, 0.80], [0.28, 0.86]],
  'duotone-ink': [[0.10, 0.86], [0.10, 0.82], [0.08, 0.72]],
};
async function addMedia(src, alt, duo) {
  const key = `${src}|${duo ?? ''}`;
  if (mediaByOrig.has(key)) return mediaByOrig.get(key);
  const file = path.join(DIST, decodeURIComponent(src.replace(/^\//, '')));
  const base = path.basename(src).replace(/\.[^.]+$/, '');
  const ext = path.extname(src).toLowerCase();
  const rel = `media/2026/10/orig/${base}${duo ? `-${duo}` : ''}${duo ? '.jpg' : ext}`;
  fs.mkdirSync(path.join(REPO, path.dirname(rel)), { recursive: true });
  let img = sharp(file);
  const meta = await img.metadata();
  if (Math.max(meta.width, meta.height) > 2400) img = img.resize({ width: meta.width >= meta.height ? 2400 : undefined, height: meta.height > meta.width ? 2400 : undefined });
  if (duo) {
    const { data, info } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const t = DUO[duo];
    for (let i = 0; i < data.length; i += 3) {
      const g = (0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]) / 255;
      const gg = Math.min(1, Math.max(0, g));
      for (let c = 0; c < 3; c++) data[i + c] = Math.round(255 * (t[c][0] + gg * (t[c][1] - t[c][0])));
    }
    await sharp(data, { raw: info }).jpeg({ quality: 95, chromaSubsampling: '4:4:4' }).toFile(path.join(REPO, rel));
  } else await img.toFile(path.join(REPO, rel));
  const out = await sharp(path.join(REPO, rel)).metadata();
  const entry = {
    id: newId('med', rel), path: rel, kind: 'image', mime: duo ? 'image/jpeg' : ext === '.png' ? 'image/png' : 'image/jpeg',
    bytes: fs.statSync(path.join(REPO, rel)).size, width: out.width, height: out.height, alt: alt ?? '',
    createdAt: '2026-10-29T08:00:00.000Z', originalName: path.basename(src), credit: { source: 'Imported from the original site' },
  };
  media[rel] = entry;
  mediaByOrig.set(key, entry);
  return entry;
}

// ---------------------------------------------------------------- pages and links
const pageJson = {};
for (const [, file] of PAGES) pageJson[file] = JSON.parse(fs.readFileSync(path.join(REPO, `content/pages/${file}.json`), 'utf8'));
const pageIdBySlug = Object.fromEntries(Object.values(pageJson).map((p) => [p.slug, p.id]));

function linkValue(href, target, currentSlug) {
  if (href.startsWith('mailto:')) return { type: 'email', email: href.slice(7) };
  if (href === '/admin/index.html' || href === '/admin/') return { type: 'url', url: STUDIO, newTab: true };
  if (href.startsWith('#')) return { type: 'page', page: pageIdBySlug[currentSlug], anchor: href.slice(1) };
  if (href.startsWith('/')) {
    const [p, anchor] = href.split('#');
    const slug = p.replace(/^\/|\/$/g, '');
    const id = pageIdBySlug[slug];
    if (!id) throw new Error(`No page for ${href}`);
    return anchor ? { type: 'page', page: id, anchor } : { type: 'page', page: id };
  }
  if (href.startsWith('http://')) href = `https://${href.slice(7)}`;
  return target === '_blank' ? { type: 'url', url: href, newTab: true } : { type: 'url', url: href };
}

// ---------------------------------------------------------------- chunk → component
const components = new Map(); // hash → def
let compSeq = 0;

// A chunk is built into "frames": nested arrays of literal template text and slots (fields).
// Slots are named only when the component is finalised, so repeated siblings can be folded into
// list fields and oversized subtrees into single-item group lists.
const MAX_FIELDS = 40;

function frameSlots(fr, out = []) {
  for (const p of fr.parts) {
    if (typeof p === 'string') continue;
    if (p.frame) frameSlots(p, out);
    else if (!out.includes(p.slot)) out.push(p.slot);
  }
  return out;
}
const listDepth = (fr) => Math.max(0, ...frameSlots(fr).map((s) => (s.kind === 'list' ? s.depth : 0)));

/** Render a frame with names for its slots: returns { tpl, fields, values }. */
function renderFrame(fr) {
  const names = new Map();
  const counters = {};
  const fields = {};
  const values = {};
  const nameOf = (slot) => {
    if (!names.has(slot)) {
      const pre = { text: 't', link: 'l', image: 'i', list: 'g' }[slot.kind];
      counters[pre] = (counters[pre] ?? 0) + 1;
      const name = `${pre}${counters[pre]}`;
      names.set(slot, name);
      fields[name] = slot.def;
      values[name] = slot.value;
    }
    return names.get(slot);
  };
  const out = (f) => f.parts.map((p) => {
    if (typeof p === 'string') return p;
    if (p.frame) return out(p);
    const name = nameOf(p.slot);
    switch (p.form) {
      case 'text': return `{{${name}}}`;
      case 'href': return ` href="{{href ${name}}}"`;
      case 'image': return `{{image ${name}${p.extra}}}`;
      case 'list': return `{{#each ${name}}}${p.slot.itemTpl}{{/each}}`;
      default: throw new Error(p.form);
    }
  }).join('');
  const tpl = out(fr);
  return { tpl, fields, values };
}

/** Structural signature: the template with canonical names plus field kinds. */
const signature = (fr) => {
  const r = renderFrame(fr);
  return `${r.tpl}|${Object.entries(r.fields).map(([k, d]) => `${k}:${d.kind}`).join(',')}`;
};

function makeList(frames, sepSpace, label) {
  const first = renderFrame(frames[0]);
  const itemTpl = sepSpace ? `${first.tpl}{{#unless @last}} {{/unless}}` : first.tpl;
  const value = frames.map((f) => renderFrame(f).values);
  const depth = 1 + listDepth(frames[0]);
  return {
    kind: 'list', depth, itemTpl, value,
    def: { kind: 'list', label, fields: first.fields, min: 0, max: 100 },
  };
}

async function convertChunk(el, ctx) {
  const inlineRules = [];
  const styleClass = new Map();
  let hasXid = false;
  let hasTerms = false;

  const styleCls = (value, important, forImg = false) => {
    const key = `${forImg ? 'img:' : ''}${value}`;
    let cls = styleClass.get(key);
    if (!cls) {
      cls = `xs${styleClass.size + 1}`;
      styleClass.set(key, cls);
      const decls = postcss.parse(`a{${value}}`).first.nodes.filter((d) => d.type === 'decl')
        .map((d) => `${fixVarName(d.prop)}:${fixVars(remToPx(d.value, ROOT_PX))}${d.prop.startsWith('--') || !important ? '' : ' !important'}`);
      inlineRules.push(`.${cls}${forImg ? `,.${cls}>picture>.os-img__img` : ''}{${decls.join(';')}}`);
    }
    return cls;
  };

  const attrList = (node, tag, isSvg) => {
    const out = [];
    for (const { name, value } of [...node.attributes]) {
      const a = name.toLowerCase();
      if (a === 'style' || a === 'class') continue;
      if (a === 'id') {
        if (node === el) continue; // the section anchor carries it
        out.push(`data-xid="${esc(value)}"`);
        hasXid = true;
        continue;
      }
      if (a.startsWith('on') || a.startsWith('data-os')) continue;
      const ok = GLOBAL_ATTRS.has(a) || (a.startsWith('aria-') && /^aria-[a-z]+$/.test(a)) || (a.startsWith('data-') && /^data-[a-z0-9-]+$/.test(a)) || TAG_ATTRS[tag]?.includes(a) || (isSvg && SVG_ATTRS.has(a));
      if (!ok) continue;
      if (a === 'tabindex' && !/^(0|-1)$/.test(value)) continue;
      if (a === 'cite' && !/^(https:\/\/|\/|#)/.test(value)) continue;
      if (a === 'type' && tag === 'button') continue;
      out.push(value === '' && (a === 'hidden' || a === 'open' || a.startsWith('data-')) ? a : `${a}="${esc(value)}"`);
    }
    return out;
  };

  async function build(node, inSvg, duo) {
    if (node.nodeType === 8) return null;
    if (node.nodeType === 3) {
      const raw = node.textContent;
      if (!raw.trim()) return /\s/.test(raw) ? { frame: true, ws: true, parts: [' '] } : null;
      if (inSvg) return { frame: true, parts: [esc(raw)] };
      const text = raw.replace(/\s+/g, ' ').trim();
      const slot = { kind: 'text', value: text, def: { kind: 'text', label: preview(text), maxLength: Math.min(10000, Math.max(200, text.length * 3)), ...(text.length > 120 ? { multiline: true } : {}) } };
      return { frame: true, parts: [/^\s/.test(raw) ? ' ' : '', { slot, form: 'text' }, /\s$/.test(raw) ? ' ' : ''] };
    }
    if (node.nodeType !== 1) return null;
    const tag = node.tagName.toLowerCase();
    if (['script', 'style', 'noscript', 'template'].includes(tag)) return null;
    const isSvg = inSvg || tag === 'svg';
    const own = (node.getAttribute('class') ?? '').split(/\s+/).filter(Boolean);
    const duoHere = own.find((c) => DUO[c]) ?? duo;
    const st = node.getAttribute('style');

    if (tag === 'img') {
      const alt = node.getAttribute('alt') ?? '';
      // Bake the duotone the original browser actually applied to this image (filters.json).
      const src = node.getAttribute('src');
      const seen = ctx.imgs.list[ctx.imgs.i++];
      if (!seen || seen[0] !== src) throw new Error(`image order mismatch at ${src} (${seen?.[0]})`);
      const duoName = /#duo-([a-z-]+)/.exec(seen[1])?.[1];
      const m = await addMedia(src, alt, duoName ? `duotone-${duoName}` : null);
      const slot = { kind: 'image', value: { src: m.path, alt }, def: { kind: 'image', label: alt ? preview(alt) : 'Picture' } };
      const cls = ['ximg', ...own, ...(st !== null ? [styleCls(st, true, true)] : [])].join(' ');
      const eager = node.getAttribute('loading') === 'eager' ? ' loading="eager"' : '';
      return { frame: true, parts: [{ slot, form: 'image', extra: ` class="${esc(cls)}"${eager}` }] };
    }
    if (isSvg && !SVG_TAGS.has(tag)) return null;
    if (tag === 'svg' && node.querySelector('filter') && !node.querySelector('path,line,rect,circle,polyline,polygon,ellipse')) return null;

    let outTag = tag;
    const extraCls = [];
    const parts = [];
    let hrefPart = null;
    if (!isSvg && !TEMPLATE_TAGS.has(tag)) {
      outTag = INLINE_TAGS.has(tag) ? 'span' : 'div';
      extraCls.push(RENAMED[tag] ?? `xt-${tag}`);
      if (!RENAMED[tag]) console.warn(`  renamed unknown <${tag}>`);
    }
    if (tag === 'a') {
      const href = node.getAttribute('href');
      if (!href) outTag = 'span';
      else {
        const slot = { kind: 'link', value: linkValue(href, node.getAttribute('target'), ctx.slug), def: { kind: 'link', label: `Link “${preview(node.textContent, 40) || href}”`.slice(0, 60) } };
        hrefPart = { slot, form: 'href' };
      }
    }
    if (own.includes('term-trigger')) hasTerms = true;
    const attrs = attrList(node, tag, isSvg);
    const cls = [...own, ...extraCls, ...(st !== null ? [styleCls(st, true)] : [])];
    if (cls.length) attrs.unshift(`class="${esc(cls.join(' '))}"`);
    if (outTag === 'button') attrs.push('type="button"');
    const tname = { lineargradient: 'linearGradient', radialgradient: 'radialGradient' }[outTag] ?? outTag;
    parts.push(`<${tname}`);
    if (hrefPart) parts.push(hrefPart);
    parts.push(`${attrs.length ? ` ${attrs.join(' ')}` : ''}`);
    if (outTag === 'br' || outTag === 'hr') { parts.push('>'); return { frame: true, el: true, parts }; }

    const kids = [];
    for (const c of node.childNodes) { const r = await build(c, isSvg, duoHere); if (r) kids.push(r); }
    // Fold runs of structurally identical sibling elements into list fields.
    const merged = [];
    for (let i = 0; i < kids.length;) {
      const k = kids[i];
      if (!k.el || isSvg || frameSlots(k).length === 0) { merged.push(k); i++; continue; }
      const sig = signature(k);
      const run = [k];
      let j = i + 1;
      let sep = false;
      while (j < kids.length) {
        if (kids[j].ws && kids[j + 1]?.el && signature(kids[j + 1]) === sig) { sep = true; run.push(kids[j + 1]); j += 2; continue; }
        if (kids[j].el && signature(kids[j]) === sig) { run.push(kids[j]); j++; continue; }
        break;
      }
      if (run.length >= 2 && listDepth(k) < 2) {
        const label = `List “${preview(renderFrame(k).values[Object.keys(renderFrame(k).values).find((x) => x.startsWith('t'))] ?? 'items', 30)}”…`.slice(0, 60);
        merged.push({ frame: true, parts: [{ slot: makeList(run, sep, label), form: 'list' }] });
        i = j;
      } else { merged.push(k); i++; }
    }
    if (isSvg && merged.length === 0 && tag !== 'svg') { parts.push('/>'); return { frame: true, el: true, parts }; }
    // In the site footer OpenSpace turns a link that is the only child of a list item or paragraph
    // into a 44px tap target; a hidden sibling keeps the original's inline link.
    const footerFix = ctx.isFooter && tag === 'a' && node.parentElement && /^(LI|P)$/.test(node.parentElement.tagName) && node.parentElement.children.length === 1;
    parts.push('>', ...merged, `</${tname}>`, ...(footerFix ? ['<span hidden></span>'] : []));
    return { frame: true, el: true, parts };
  }

  const imgClasses = new Set([...el.querySelectorAll('img')].flatMap((n) => (n.getAttribute('class') ?? '').split(/\s+/).filter(Boolean)));
  const usedTags = [...new Set([...el.querySelectorAll('*')].map((n) => n.tagName.toLowerCase()).filter((t) => RENAMED[t]))];
  const root = await build(el, false, null);

  // Too many fields: fold the largest subtrees into single-item groups until it fits.
  const subframes = (fr, depth, out = []) => {
    for (const p of fr.parts) if (p.frame && p.el) { out.push({ fr: p, depth }); subframes(p, depth + 1, out); }
    return out;
  };
  let guard = 0;
  while (frameSlots(root).length > MAX_FIELDS && guard++ < 200) {
    const total = frameSlots(root).length;
    const cands = subframes(root, 1).filter(({ fr }) => listDepth(fr) < 2 && frameSlots(fr).length >= 2 && frameSlots(fr).length < total)
      .sort((a, b) => frameSlots(b.fr).length - frameSlots(a.fr).length);
    // Prefer the smallest candidate that alone brings the total under the limit, else the largest.
    const need = total - MAX_FIELDS + 1;
    const pick = [...cands].reverse().find(({ fr }) => frameSlots(fr).length >= need) ?? cands[0];
    if (!pick) throw new Error(`${ctx.label}: cannot fit into ${MAX_FIELDS} fields`);
    const inner = { frame: true, el: true, parts: pick.fr.parts };
    const r = renderFrame(inner);
    const slot = {
      kind: 'list', depth: 1 + listDepth(inner), itemTpl: r.tpl, value: [r.values],
      def: { kind: 'list', label: `Group “${preview(r.values[Object.keys(r.values).find((x) => x.startsWith('t'))] ?? 'content', 30)}”`.slice(0, 60), fields: r.fields, min: 1, max: 1 },
    };
    pick.fr.parts = [{ slot, form: 'list' }];
  }

  const { tpl, fields, values } = renderFrame(root);
  let template = tpl.replace(/ {2,}/g, ' ');

  // CSS: purge the page stylesheet against this chunk's markup.
  const purgeHtml = template
    .replace(/\{\{image \w+ class="([^"]*)"[^}]*\}\}/g, '<span class="$1"><picture><img class="os-img__img"></picture></span>')
    .replace(/\{\{[^}]*\}\}/g, 'x')
    .replace(/data-xid="/g, 'id="')
    + usedTags.map((t) => `<${t}></${t}>`).join('');
  const { document: pdoc } = parseHTML(`<html><body><div class="os-c">${purgeHtml}</div></body></html>`);
  const present = { classes: new Set(), tags: new Set(), ids: new Set() };
  for (const n of pdoc.querySelectorAll('*')) {
    present.tags.add(n.tagName.toLowerCase());
    for (const c of (n.getAttribute('class') ?? '').split(/\s+/)) if (c) present.classes.add(c);
    if (n.id) present.ids.add(n.id);
  }
  const purged = { css: purgeCss(ctx.css, present, inlineRules.join('\n')) };
  const scoped = postcss.parse(purged.css);
  scoped.walkRules((r) => {
    if (r.parent?.type === 'atrule' && /keyframes$/.test(r.parent.name)) return;
    if (/^\s*(html|body|:root|:host)(\s*,\s*(html|body|:root|:host))*\s*$/.test(r.selector))
      r.walkDecls((d) => { if (/^(min-height|height|overflow|overflow-x|overflow-y|scroll-behavior)$/.test(d.prop)) d.remove(); });
    r.selector = rewriteSelector(r.selector);
    r.selectors = [...new Set(r.selectors)];
    // Rules that styled an <img> must reach the real image inside OpenSpace's wrapper.
    const extra = [];
    for (const sel of r.selectors) {
      const last = sel.split(/\s*[\s>+~]\s*/).pop();
      if (/::?(before|after|marker|placeholder|selection|backdrop)/.test(last)) continue;
      const classes = last.match(/\.((?:\\.|[\w-])+)/g) ?? [];
      if (classes.some((c) => c === '.ximg' || imgClasses.has(c.slice(1).replace(/\\/g, '')))) extra.push(`${sel}>picture>.os-img__img`);
    }
    if (extra.length) r.selectors = [...r.selectors, ...extra];
  });
  // OpenSpace keeps only [A-Za-z0-9_-] in class names (200 characters per attribute): give
  // Tailwind-style names short safe aliases, consistently in the markup and the CSS.
  scoped.walkRules((r) => {
    if (r.parent?.type === 'atrule' && /keyframes$/.test(r.parent.name)) return;
    r.selector = selectorParser((sels) => sels.walkClasses((c) => { c.value = classAlias(c.value); })).processSync(r.selector);
  });
  template = template.replace(/class="([^"]*)"/g, (m, v) => {
    const out = v.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&amp;/g, '&').split(/\s+/).filter(Boolean).map(classAlias).join(' ');
    if (out.length > 200) console.warn(`  class attribute over 200 chars in ${ctx.label}`);
    return `class="${out}"`;
  });
  const body = `${scoped.toString()}\n${inlineRules.join('\n')}`;
  const faces = FONT_FACES.filter((f) => body.includes(f.family)).map((f) => f.css).join('\n');
  const base = BASE_CSS.split('\n').filter((l) => (l.includes('.ximg') ? /ximg/.test(template) : l.includes('.xt-') ? usedTags.length > 0 : true)).join('\n');
  const css = minifyCss(`${faces}\n${base}\n${body}`);

  const js = [];
  if (hasXid) js.push('root.querySelectorAll("[data-xid]").forEach(function (el) { if (!document.getElementById(el.dataset.xid)) el.id = el.dataset.xid; });');
  if (hasTerms) js.push(TERMS_JS);

  const def = {
    name: '', label: ctx.label.slice(0, 60), description: `Recreated from the original site: ${ctx.label}. Every word, picture and link is editable.`.slice(0, 300),
    version: 1, category: 'imported', fields, defaults: values, template, css,
    ...(js.length ? { js: js.join('\n') } : {}),
    section: { width: 'full' },
  };
  const hash = crypto.createHash('sha1').update(template + css + (def.js ?? '') + JSON.stringify(fields)).digest('hex');
  let existing = components.get(hash);
  if (!existing) {
    def.name = `${ctx.prefix}-${++compSeq}`.slice(0, 40);
    components.set(hash, def);
    existing = def;
  }
  return { name: existing.name, values, cssLen: css.length, tplLen: template.length, nFields: Object.keys(fields).length };
}

const TERMS_JS = `root.addEventListener('click', function (e) {
  var trigger = e.target instanceof Element ? e.target.closest('.term-trigger') : null;
  if (!trigger) return;
  e.preventDefault();
  var isOpen = trigger.getAttribute('aria-expanded') === 'true';
  document.querySelectorAll('.term-trigger[aria-expanded="true"]').forEach(function (t) { if (t !== trigger) t.setAttribute('aria-expanded', 'false'); });
  trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
});
document.addEventListener('click', function (e) {
  if (e.target instanceof Element && e.target.closest('.term-trigger')) return;
  root.querySelectorAll('.term-trigger[aria-expanded="true"]').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') root.querySelectorAll('.term-trigger[aria-expanded="true"]').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
});`;

// ---------------------------------------------------------------- main
const report = [];
let footerSection = null;
for (const [dir, file] of PAGES) {
  const html = fs.readFileSync(path.join(DIST, dir, 'index.html'), 'utf8');
  const { document } = parseHTML(html);
  let rawCss = '';
  for (const n of document.querySelectorAll('link[rel="stylesheet"], style')) {
    if (n.tagName === 'LINK') rawCss += fs.readFileSync(path.join(DIST, n.getAttribute('href').replace(/^\//, '')), 'utf8');
    else rawCss += n.textContent;
    rawCss += '\n';
  }
  const css = transformCss(rawCss);
  const slug = pageJson[file].slug;
  const imgs = { list: FILTERS[dir], i: 0 };
  const body = document.body;
  const main = body.querySelector('main');
  const pre = [];
  const post = [];
  let seenMain = false;
  for (const c of body.children) {
    if (c === main) { seenMain = true; continue; }
    if (['SCRIPT', 'STYLE'].includes(c.tagName)) continue;
    if (c.tagName === 'A' && c.getAttribute('href') === '#main') continue;
    if (c.tagName === 'svg' || c.tagName === 'SVG') { if (c.querySelector('filter')) continue; }
    (seenMain ? post : pre).push(c);
  }
  const wrap = (nodes, cls) => { const d = document.createElement('div'); d.setAttribute('class', cls); for (const x of nodes) d.appendChild(x.cloneNode(true)); return d; };
  const chunks = [];
  if (pre.length) chunks.push({ el: wrap(pre, 'x-masthead'), label: 'Masthead', kind: 'masthead' });
  for (const c of [...main.children]) {
    if (['SCRIPT', 'STYLE'].includes(c.tagName)) continue;
    const heading = c.querySelector('h1,h2,h3')?.textContent ?? c.getAttribute('id') ?? c.tagName;
    chunks.push({ el: c, label: preview(heading, 60), kind: 'section', anchor: c.getAttribute('id') });
  }
  const footerEl = post.find((x) => x.tagName === 'FOOTER');
  const otherPost = post.filter((x) => x !== footerEl);
  if (otherPost.length) console.warn(`  ${file}: unexpected nodes after main`, otherPost.map((x) => x.tagName));

  const sections = [];
  for (const [i, ch] of chunks.entries()) {
    const r = await convertChunk(ch.el, { css, slug, imgs, label: ch.label, prefix: ch.kind === 'masthead' ? 'sp-masthead' : `sp-${(file.split('/').pop() || 'home').slice(0, 14).replace(/-+$/, '')}` });
    report.push({ page: file || 'home', chunk: ch.label.slice(0, 30), comp: r.name, css: r.cssLen, tpl: r.tplLen, fields: r.nFields });
    const secId = newId('sec', `${file}:${i}`);
    sections.push({
      id: secId, preset: `component/${r.name}@1`, label: ch.label,
      ...(ch.anchor && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(ch.anchor) ? { anchor: ch.anchor } : {}),
      layout: { mode: 'stack', columns: { d: [12] }, width: 'full' },
      style: { padding: { d: 'none', m: 'none' }, background: { type: 'color', color: PAGE_BG } },
      blocks: [{ id: newId('blk', `${file}:${i}`), type: `component/${r.name}`, v: 1, fields: r.values }],
    });
  }
  const pj = pageJson[file];
  pj.header = { hidden: true };
  // Same browser title and description as the original page.
  let desc = document.querySelector('meta[name="description"]')?.getAttribute('content');
  if (desc && desc.length > 320) { desc = `${desc.slice(0, 319).replace(/\s+\S*$/, '')}…`; console.warn(`  ${file}: description shortened to 320 characters`); }
  pj.seo = { ...(pj.seo ?? {}), title: document.title, ...(desc ? { description: desc } : {}) };
  pj.sections = sections;
  fs.writeFileSync(path.join(REPO, `content/pages/${file}.json`), `${JSON.stringify(pj, null, 2)}\n`);

  if (!footerSection && footerEl) {
    const r = await convertChunk(footerEl, { css, slug, imgs, label: 'Footer', prefix: 'sp-footer', isFooter: true });
    report.push({ page: file || 'home', chunk: 'Footer', comp: r.name, css: r.cssLen, tpl: r.tplLen });
    footerSection = {
      id: newId('sec', 'footer'), preset: `component/${r.name}@1`, label: 'Footer',
      layout: { mode: 'stack', columns: { d: [12] }, width: 'full' },
      style: { padding: { d: 'none', m: 'none' }, background: { type: 'color', color: PAGE_BG } },
      blocks: [{ id: newId('blk', 'footer'), type: `component/${r.name}`, v: 1, fields: r.values }],
    };
  }
}

// Write components (remove the importer's approximations first).
const compDir = path.join(REPO, 'content/components');
for (const f of fs.readdirSync(compDir)) fs.unlinkSync(path.join(compDir, f));
for (const def of components.values()) fs.writeFileSync(path.join(compDir, `${def.name}.json`), `${JSON.stringify(def, null, 2)}\n`);

const site = JSON.parse(fs.readFileSync(path.join(REPO, 'content/site.json'), 'utf8'));
site.footer = footerSection;
fs.writeFileSync(path.join(REPO, 'content/site.json'), `${JSON.stringify(site, null, 2)}\n`);
fs.writeFileSync(mediaJsonPath, `${JSON.stringify(media, null, 2)}\n`);
console.table(report);
console.log(`${components.size} components`);
