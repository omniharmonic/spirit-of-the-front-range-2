// Dump computed filter for every <img> on each original page, in document order.
const { chromium } = require('playwright');
const pages = ['', 'mission', 'programs', 'the-commons', 'stewards', 'connect', 'catalog', 'donate', 'words', 'programs/commons-sense-education', 'programs/community-grant-rounds', 'programs/neighborhood-resiliency', 'programs/solidarity-suppers'];
(async () => {
  const b = await chromium.launch(); const out = {};
  for (const w of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    for (const pg of pages) {
      await p.goto(`http://localhost:8802/${pg}${pg ? '/' : ''}`, { waitUntil: 'networkidle' });
      const f = await p.evaluate(() => [...document.querySelectorAll('img')].map((i) => [i.getAttribute('src'), getComputedStyle(i).filter]));
      if (w === 1440) out[pg] = f;
      else f.forEach((x, i) => { if (x[1] !== out[pg][i][1]) console.warn('differs by width', pg, x); });
    }
  }
  require('fs').writeFileSync('filters.json', JSON.stringify(out, null, 1));
  console.log(Object.values(out).flat().filter((x) => /url/.test(x[1])).map((x) => x.join(' ')).join('\n'));
  await b.close();
})();
