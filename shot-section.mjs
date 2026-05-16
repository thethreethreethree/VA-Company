import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';

const url = 'http://localhost:3000';
const selector = process.argv[2];
const label = process.argv[3] || 'section';

await mkdir('temporary screenshots', { recursive: true });
const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y <= document.body.scrollHeight; y += step) {
    window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
  document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-visible'));
});
await new Promise(r => setTimeout(r, 800));
const el = await page.$(selector);
const file = `temporary screenshots/sec-${label}.png`;
await el.screenshot({ path: file });
await browser.close();
console.log('saved', file);
