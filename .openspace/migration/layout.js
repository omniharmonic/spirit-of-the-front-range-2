// node layout.js <origUrl> <newUrl> [width] [maxReports]
// Matches leaf text elements of both pages in document order (by text) and reports the first
// elements whose box differs, with the computed styles that differ.
const { chromium } = require('playwright');
const PROPS = ['font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'margin', 'padding', 'display', 'width', 'height', 'border-width', 'gap', 'grid-template-columns', 'flex', 'text-transform', 'white-space', 'word-spacing', 'font-variation-settings', 'font-feature-settings', 'text-wrap', 'hyphens', 'position', 'top', 'transform', 'box-sizing', 'column-count'];
async function grab(browser, url, width) {
  const p = await browser.newPage({ viewport: { width, height: 900 } });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  const r = await p.evaluate((PROPS) => {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let n;
    while ((n = walker.nextNode())) {
      if (n.closest('script,style,svg')) continue;
      const own = [...n.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent).join('').replace(/\s+/g, ' ').trim();
      if (!own) continue;
      const b = n.getBoundingClientRect();
      if (b.width === 0 && b.height === 0) continue;
      const cs = getComputedStyle(n);
      const chain = [];
      for (let e = n, i = 0; e && i < 6; e = e.parentElement, i++) { const c = getComputedStyle(e); chain.push(Object.fromEntries(PROPS.map((k) => [k, c.getPropertyValue(k)]))); }
      out.push({ text: own.slice(0, 50), tag: n.tagName, cls: (n.className + '').slice(0, 60), x: Math.round(b.x), y: Math.round(b.y + scrollY), w: Math.round(b.width), h: Math.round(b.height), chain });
    }
    return out;
  }, PROPS);
  await p.close();
  return r;
}
(async () => {
  const [a, b, w = '1440', max = '6'] = process.argv.slice(2);
  const browser = await chromium.launch();
  const A = await grab(browser, a, +w), B = await grab(browser, b, +w);
  await browser.close();
  let j = 0, reports = 0;
  for (const ea of A) {
    let k = j;
    while (k < B.length && B[k].text !== ea.text) k++;
    if (k >= B.length) { console.log(`MISSING in new: "${ea.text}"`); if (++reports >= +max) break; continue; }
    const eb = B[k]; j = k + 1;
    const d = ['x', 'y', 'w', 'h'].filter((p) => Math.abs(ea[p] - eb[p]) > 1);
    if (d.length) {
      console.log(`\n"${ea.text}" <${ea.tag} ${ea.cls}>  orig ${ea.x},${ea.y} ${ea.w}x${ea.h}  new ${eb.x},${eb.y} ${eb.w}x${eb.h}`);
      ea.chain.forEach((ca, lvl) => { const cb = eb.chain[lvl] || {}; const diffs = PROPS.filter((p) => ca[p] !== cb[p]).map((p) => `${p}: ${ca[p]} → ${cb[p]}`); if (diffs.length) console.log(`   [${lvl}] ${diffs.join(' | ')}`); });
      if (++reports >= +max) break;
    }
  }
  console.log(`\nmatched ${j}/${B.length} new elements, ${A.length} orig`);
})();
