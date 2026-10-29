// Usage: node compare.js <origBase> <newBase> <outDir> [paths...]
// Screenshots each path on both sites (desktop 1440 + mobile 390, full page),
// then reports height difference and % of differing pixels over the common area.
const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const fs = require('fs');
const path = require('path');

const [origBase, newBase, outDir, ...paths] = process.argv.slice(2);
const devices = process.env.WIDTHS ? process.env.WIDTHS.split(',').map((w) => ({ name: 'w' + w, width: +w, height: 900 })) : [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }];

async function shot(browser, url, dev, file) {
  const ctx = await browser.newContext({ viewport: { width: dev.width, height: dev.height }, reducedMotion: 'reduce', ignoreHTTPSErrors: false });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  // Trigger lazy images, then settle.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: file, fullPage: true });
  await ctx.close();
}

function crop(png, w, h) {
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(png, out, 0, 0, w, h, 0, 0);
  return out;
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  for (const p of paths) {
    for (const dev of devices) {
      const slug = (p.replace(/\//g, '_') || 'home') + '-' + dev.name;
      const a = path.join(outDir, slug + '-orig.png');
      const b = path.join(outDir, slug + '-new.png');
      try {
        await shot(browser, origBase + p, dev, a);
        await shot(browser, newBase + p, dev, b);
      } catch (e) { results.push({ page: p || '/', device: dev.name, error: e.message.split('\n')[0] }); continue; }
      const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b));
      const w = Math.min(A.width, B.width), h = Math.min(A.height, B.height);
      const diff = new PNG({ width: w, height: h });
      const n = pixelmatch(crop(A, w, h).data, crop(B, w, h).data, diff.data, w, h, { threshold: 0.1 });
      fs.writeFileSync(path.join(outDir, slug + '-diff.png'), PNG.sync.write(diff));
      results.push({ page: p || '/', device: dev.name, origH: A.height, newH: B.height, diffPct: +(100 * n / (w * h)).toFixed(2) });
    }
  }
  await browser.close();
  console.table(results);
  fs.writeFileSync(path.join(outDir, 'results.json'), JSON.stringify(results, null, 2));
})();
