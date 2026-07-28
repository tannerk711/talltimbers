// Tracking + behavior verification for the Tall Timbers funnel.
// Run with dev server on :4321:  node tools/verify-tracking.mjs
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';

const base = 'http://localhost:4321';
const outDir = fileURLToPath(new URL('./shots/', import.meta.url));
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars'],
});

const results = [];
const check = (name, ok, detail = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` :: ${detail}` : ''}`);
};
const location_is_thankyou = (p) => p.startsWith('/thank-you');
const settle = (ms) => new Promise((r) => setTimeout(r, ms));

async function pageWithNet(w = 1440, h = 900, mobile = false) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
  const requests = [];
  page.on('request', (r) => requests.push(r.url()));
  return { page, requests };
}

// 1) LP: gtag + hotjar load
{
  const { page, requests } = await pageWithNet();
  await page.goto(base, { waitUntil: 'networkidle0', timeout: 30000 });
  await settle(1500);
  check('gtag.js requested with AW-18132955750',
    requests.some((u) => u.includes('googletagmanager.com/gtag/js') && u.includes('AW-18132955750')));
  check('Hotjar 6725186 requested',
    requests.some((u) => u.includes('static.hotjar.com') && u.includes('6725186')));
  const dl = await page.evaluate(() => (window.dataLayer || []).length > 0);
  check('dataLayer initialized', dl);
  await page.close();
}

// 2) thank-you bare visit: conversion must NOT fire
{
  const { page, requests } = await pageWithNet();
  await page.goto(`${base}/thank-you`, { waitUntil: 'networkidle0', timeout: 30000 });
  await settle(2500);
  // the New Lead conversion carries the label; the generic gtag.config ping does not
  const conv = requests.filter((u) => u.includes('Tbu1CMmLkrUcEObku8ZD'));
  check('bare /thank-you fires NO conversion', conv.length === 0, conv[0] || '');
  await page.close();
}

// 3) thank-you ?demo=1: conversion MUST fire
{
  const { page, requests } = await pageWithNet();
  await page.goto(`${base}/thank-you?demo=1`, { waitUntil: 'networkidle0', timeout: 30000 });
  await settle(3000);
  const conv = requests.filter((u) => u.includes('Tbu1CMmLkrUcEObku8ZD'));
  check('/thank-you?demo=1 fires labeled conversion', conv.length > 0, conv[0] ? conv[0].slice(0, 120) : 'no labeled conversion request seen');
  await page.close();
}

// 4) full form submit end-to-end -> /api/lead 200 -> redirect -> conversion fires
{
  const { page, requests } = await pageWithNet(1440, 980);
  let leadStatus = null;
  page.on('response', (r) => { if (r.url().includes('/api/lead')) leadStatus = r.status(); });
  await page.goto(base, { waitUntil: 'networkidle0', timeout: 30000 });
  await settle(1000);
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
  await click('Continue'); // price
  await click('Continue'); // down payment
  await page.type('#eligibility input:not(#ff-company)', 'Geor');
  await settle(400);
  await click('Georgia');
  await page.evaluate(() => {
    const inputs = [...document.querySelectorAll('#eligibility input')].filter((i) => i.id !== 'ff-company');
    const setVal = (el, v) => {
      const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      s.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    setVal(inputs[0], 'QA Test');
    setVal(inputs[1], 'qa-test@example.com');
  });
  await click('Continue'); // -> phone (no partial capture; removed 2026-07-27)
  await settle(600);
  await page.evaluate(() => {
    const inputs = [...document.querySelectorAll('#eligibility input')];
    const tel = inputs.find((i) => i.type === 'tel');
    const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    s.call(tel, '(555) 010-0199');
    tel.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await settle(300);

  // TCPA gate: submit is blocked until the consent box is checked. Assert the
  // block first (a silent regression here would mean consent stopped gating),
  // then consent and continue the real end-to-end path.
  await click('Get My Eligibility');
  await settle(800);
  check('submit blocked until TCPA consent', leadStatus === null && !location_is_thankyou(await page.evaluate(() => location.pathname)));
  await page.click('#ff-tcpa');
  await settle(300);
  await click('Get My Eligibility');
  await page.waitForFunction(() => location.pathname.startsWith('/thank-you'), { timeout: 15000 }).catch(() => {});
  await settle(3000);
  check('form submit -> /api/lead 200', leadStatus === 200, `status ${leadStatus}`);
  check('redirected to /thank-you', await page.evaluate(() => location.pathname.startsWith('/thank-you')));
  const conv = requests.filter((u) => u.includes('Tbu1CMmLkrUcEObku8ZD'));
  check('real submission fires labeled conversion', conv.length > 0);
  const name = await page.evaluate(() => document.getElementById('ty-name')?.textContent || '');
  check('thank-you personalized with first name', name.includes('QA'), name);
  await page.close();
}

// 4b) honeypot: filling the hidden field must reach /api/lead in the payload
{
  const { page } = await pageWithNet(1440, 980);
  let leadBody = null;
  page.on('request', (r) => {
    if (r.url().includes('/api/lead') && r.method() === 'POST') leadBody = r.postData();
  });
  await page.goto(base, { waitUntil: 'networkidle0', timeout: 30000 });
  await settle(1000);
  const click = async (text) => {
    await page.evaluate((t) => {
      const btns = [...document.querySelectorAll('#eligibility button')];
      const b = btns.find((x) => x.textContent.toLowerCase().includes(t.toLowerCase()));
      if (b) b.click();
    }, text);
    await settle(600);
  };
  await page.waitForSelector('#ff-company', { timeout: 15000 });
  // uncontrolled input: direct value assignment is exactly what a bot does
  await page.evaluate(() => {
    document.getElementById('ff-company').value = 'https://spam.example';
  });
  await click('Buy a rental');
  await click('Single family');
  await click('740+');
  await click('Continue');
  await click('Continue');
  await page.type('#eligibility input:not(#ff-company)', 'Geor');
  await settle(400);
  await click('Georgia');
  await page.evaluate(() => {
    const inputs = [...document.querySelectorAll('#eligibility input')].filter((i) => i.id !== 'ff-company');
    const setVal = (el, v) => {
      const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      s.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    setVal(inputs[0], 'Bot Test');
    setVal(inputs[1], 'bot@example.com');
  });
  await click('Continue');
  await settle(600);
  // Partial captures were removed 2026-07-27, so the only POST comes from a
  // completed submit. This block used to rely on the partial firing at the
  // contact step; it must now finish the form (phone + TCPA consent).
  await page.evaluate(() => {
    const tel = document.querySelector('#eligibility input[type=tel]');
    const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    s.call(tel, '(555) 010-0199');
    tel.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await settle(300);
  await page.click('#ff-tcpa');
  await settle(300);
  await click('Get My Eligibility');
  await settle(1500);
  let parsed = null;
  try { parsed = leadBody ? JSON.parse(leadBody) : null; } catch { /* ignore */ }
  check('honeypot value reaches /api/lead payload', !!parsed && parsed.website === 'https://spam.example',
    parsed ? `website="${parsed.website}"` : 'no /api/lead POST captured');
  await page.close();
}

// 5) redirects from old site routes
for (const [from, to] of [['/lp/georgia-dscr', '/'], ['/lp/florida-dscr', '/'], ['/privacy-policy', '/privacy'], ['/terms-of-service', '/legal']]) {
  const { page } = await pageWithNet();
  const resp = await page.goto(`${base}${from}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const finalPath = await page.evaluate(() => location.pathname.replace(/\/$/, '') || '/');
  check(`redirect ${from} -> ${to}`, finalPath === (to === '/' ? '/' : to), `landed ${finalPath} (http ${resp?.status()})`);
  await page.close();
}

// 6) mobile thank-you with calendar (clipping check) + screenshot
{
  const { page } = await pageWithNet(390, 844, true);
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    sessionStorage.setItem('lead-summary', JSON.stringify({
      firstName: 'Tanner', goal: 'purchase', propertyType: 'sfr', credit: '700-739', price: 350000, state: 'Georgia',
    }));
  });
  await page.goto(`${base}/thank-you`, { waitUntil: 'networkidle0', timeout: 45000 });
  await settle(4000);
  const iframeBox = await page.evaluate(() => {
    const f = document.querySelector('iframe[title="Book your consultation"]');
    if (!f) return null;
    const r = f.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  });
  check('mobile booking iframe present and sized', !!iframeBox && iframeBox.h >= 400, JSON.stringify(iframeBox));
  const mw = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
  check('mobile thank-you no horizontal overflow', mw.s <= mw.c + 1, JSON.stringify(mw));
  await page.screenshot({ path: `${outDir}tt2-mobile-thankyou.png`, fullPage: true });
  await page.close();
}

console.log(results.join('\n'));
await browser.close();
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(failed ? `\n${failed} FAILURES` : '\nALL CHECKS PASSED');
