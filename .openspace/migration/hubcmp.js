// node hubcmp.js <origPng> <hub jpg pieces in order...> — aligns each piece to the original (scaled
// to the piece width) by searching the vertical offset, then reports differing pixels.
const sharp = require('sharp'); const pm = require('pixelmatch');
(async () => {
  const [origPath, ...pieces] = process.argv.slice(2);
  const m0 = await sharp(pieces[0]).metadata(); const W = m0.width;
  const om = await sharp(origPath).metadata(); const scale = W / om.width;
  const orig = await sharp(origPath).resize(W, Math.round(om.height * scale)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const OH = orig.info.height;
  let guess = 0;
  for (const p of pieces) {
    const { data, info } = await sharp(p).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const h = info.height;
    const rows = (buf, y, n) => { const out = new Uint8ClampedArray(W * n * 4); for (let i = 0; i < W * n; i++) { for (let c = 0; c < 3; c++) out[i * 4 + c] = buf[(y * W + i) * 3 + c]; out[i * 4 + 3] = 255; } return out; };
    const piece = rows(data, 0, h);
    let best = null;
    for (let off = Math.max(0, guess - 120); off <= Math.min(OH - h, guess + 120); off += 1) {
      const n = pm(piece, rows(orig.data, off, h), null, W, h, { threshold: 0.15 });
      if (!best || n < best.n) best = { off, n };
      if (best.n === 0) break;
    }
    console.log(`${p.split('-').pop()} at y=${best.off}: ${(100 * best.n / (W * h)).toFixed(2)}% differ`);
    guess = best.off + h;
  }
})();
