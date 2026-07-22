// Verifies the price slider responds to a continuous mouse DRAG (not just
// clicks). Before the module-scope fix, React remounted the input after the
// first change event and the drag died with exactly one value change.
import puppeteer from 'puppeteer-core';

const base = 'http://localhost:4321';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
});
const settle = (ms) => new Promise((r) => setTimeout(r, ms));

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 980 });
await page.goto(base, { waitUntil: 'networkidle0', timeout: 30000 });
await settle(1200);

const click = async (text) => {
  await page.evaluate((t) => {
    const btns = [...document.querySelectorAll('#eligibility button')];
    const b = btns.find((x) => x.textContent.toLowerCase().includes(t.toLowerCase()));
    if (b) b.click();
  }, text);
  await settle(650);
};
await click('Buy a rental');
await click('Single family');
await click('740+');

// on the price step now; instrument the range input
await page.waitForSelector('#eligibility input[type="range"]', { timeout: 10000 });
await page.evaluate(() => {
  window.__dragValues = [];
  const el = document.querySelector('#eligibility input[type="range"]');
  el.addEventListener('input', () => window.__dragValues.push(el.value));
});

const box = await page.evaluate(() => {
  const r = document.querySelector('#eligibility input[type="range"]').getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
// thumb sits at ~10.8% for the $350K default (min 150K, max 2M)
const startX = box.x + box.w * 0.108;
const y = box.y + box.h / 2;

await page.mouse.move(startX, y);
await page.mouse.down();
for (let i = 1; i <= 12; i++) {
  await page.mouse.move(startX + (box.w * 0.5 * i) / 12, y, { steps: 3 });
  await settle(40);
}
await page.mouse.up();
await settle(300);

const result = await page.evaluate(() => ({
  events: window.__dragValues.length,
  distinct: [...new Set(window.__dragValues)].length,
  final: document.querySelector('#eligibility input[type="range"]')?.value,
  display: document.querySelector('#eligibility .font-display.tabular-nums')?.textContent,
  stillSameEl: !!document.querySelector('#eligibility input[type="range"]'),
}));
console.log(JSON.stringify(result));
const pass = result.events >= 5 && result.distinct >= 5;
console.log(pass ? 'PASS: slider drags continuously' : 'FAIL: drag did not produce continuous value changes');
await browser.close();
process.exit(pass ? 0 : 1);
