// Eigene Verifikation: Chromium ohne h264, deshalb liefert die Route eine VP9-Kopie (nur im Test, nichts davon wird ausgeliefert).
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
const a = process.argv.slice(2);
const arg = (n, d) => { const i = a.indexOf(n); return i > -1 ? a[i + 1] : d; };
const W = +arg('--width', 1440), H = +arg('--height', 900), N = +arg('--steps', 30);
const OUT = path.resolve(arg('--out', 'lab/desk'));
const reduced = a.includes('--reduced-motion');
const apiState = arg('--api', 'ok'); // ok | none | closed | error | off
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: reduced ? 'reduce' : 'no-preference', deviceScaleFactor: 1, isMobile: W < 700, hasTouch: W < 700 });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('pageerror ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text()); });
p.on('requestfailed', r => errs.push('reqfail ' + r.url()));
const root = path.resolve('.');
await p.route('**/assets/hero.mp4', r => r.fulfill({ status: 200, contentType: 'video/webm', body: fs.readFileSync(root + '/build/hero.webm') }));
await p.route('**/assets/hero-m.mp4', r => r.fulfill({ status: 200, contentType: 'video/webm', body: fs.readFileSync(root + '/build/hero-m.webm') }));
if (apiState !== 'off') {
  await p.route('http://localhost:4500/', async r => { const res = await r.fetch(); let t = await res.text(); t = t.replace('name="pembeef-api" content=""', 'name="pembeef-api" content="http://localhost:4500"'); r.fulfill({ response: res, body: t }); });
  await p.route('**/api/public/next-delivery', r => {
    if (apiState === 'error') return r.fulfill({ status: 500, body: 'x' });
    if (apiState === 'none') return r.fulfill({ status: 200, contentType: 'application/json', body: 'null' });
    const closed = apiState === 'closed';
    r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ orderDate: '2026-11-05', reservationDeadline: closed ? '2026-10-01' : '2026-10-29', isOrderable: !closed }) });
  });
}
await p.goto('http://localhost:4500/', { waitUntil: 'load' });
await p.waitForTimeout(1500);
const total = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
console.log('total scroll px', total, 'vh', (total / H).toFixed(1));
const rows = [];
for (let i = 0; i <= N; i++) {
  const y = Math.round(total * i / N);
  await p.evaluate(y => scrollTo(0, y), y);
  await p.waitForTimeout(i === 0 ? 900 : 650);
  const info = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: innerWidth, vt: (document.querySelector('video[data-sc-scrub]')||{}).currentTime }));
  rows.push({ i, y, ...info });
  await p.screenshot({ path: `${OUT}/${String(i).padStart(2, '0')}.png` });
}
const hx = rows.filter(r => r.sw > r.cw + 1);
console.log('horizontal overflow at', hx.length ? hx.map(r => r.i).join(',') : 'none');
console.log('video time samples', rows.filter(r => r.vt != null).map(r => (+r.vt).toFixed(1)).join(' '));
console.log('errors', errs.length ? errs.slice(0, 8) : 'none');
await b.close();
