// node jpgpair.js a1 a2 ... -- b1 b2 ... : compare same-service captures piece by piece
const sharp = require('sharp'); const pm = require('pixelmatch');
(async () => {
  const args = process.argv.slice(2); const k = args.indexOf('--'); const A = args.slice(0, k), B = args.slice(k + 1);
  for (let i = 0; i < A.length; i++) {
    const a = await sharp(A[i]).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const b = await sharp(B[i]).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const W = a.info.width, H = Math.min(a.info.height, b.info.height);
    const x = new Uint8ClampedArray(W * H * 4), y = new Uint8ClampedArray(W * H * 4);
    for (let j = 0; j < W * H; j++) { for (let c = 0; c < 3; c++) { x[j * 4 + c] = a.data[j * 3 + c]; y[j * 4 + c] = b.data[j * 3 + c]; } x[j * 4 + 3] = y[j * 4 + 3] = 255; }
    console.log(`piece ${i + 1}: ${a.info.height} vs ${b.info.height} px tall, ${(100 * pm(x, y, null, W, H, { threshold: 0.15 }) / (W * H)).toFixed(2)}% differ`);
  }
})();
