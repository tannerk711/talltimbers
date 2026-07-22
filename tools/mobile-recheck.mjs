// Focused mobile re-check: calendar paint + headshot load on /thank-you.
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';

const base = 'http://localhost:4321';
const outDir = fileURLToPath(new URL('./shots/', import.meta.url));
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars'],
});
const settle = (ms) => new Promise((r) => setTimeout(r, ms));

const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.goto(base, { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  sessionStorage.setItem('lead-summary', JSON.stringify({
    firstName: 'Tanner', goal: 'purchase', propertyType: 'sfr', credit: '700-739', price: 350000, state: 'Georgia',
  }));
});
await page.goto(`${base}/thank-you`, { waitUntil: 'networkidle2', timeout: 60000 });
await settle(8000);

// check headshot actually loaded
const img = await page.evaluate(() => {
  const el = document.querySelector('img[alt="Adam C. Cunningham"]');
  if (!el) return null;
  return { complete: el.complete, w: el.naturalWidth, h: el.naturalHeight, src: el.currentSrc };
});
console.log('headshot:', JSON.stringify(img));

// scroll to calendar, wait, viewport shot
await page.evaluate(() => {
  document.querySelector('iframe[title="Book your consultation"]')?.scrollIntoView({ block: 'start' });
});
await settle(6000);
await page.screenshot({ path: `${outDir}tt2-mobile-calendar.png` });

// scroll to specialist card, viewport shot
await page.evaluate(() => {
  document.querySelector('img[alt="Adam C. Cunningham"]')?.scrollIntoView({ block: 'center' });
});
await settle(1500);
await page.screenshot({ path: `${outDir}tt2-mobile-specialist.png` });

await browser.close();
console.log('done');
