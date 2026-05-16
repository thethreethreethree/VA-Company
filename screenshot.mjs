import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || 'full';
const width = Number(process.argv[4]) || 1440;

await mkdir('temporary screenshots', { recursive: true });
const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const page = await browser.newPage();
await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
// Scroll through the page so IntersectionObserver reveal animations fire
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y <= document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
});
await new Promise(r => setTimeout(r, 1200));
const file = `temporary screenshots/screenshot-${label}-${width}.png`;
await page.screenshot({ path: file, fullPage: true });
await browser.close();
console.log('saved', file);
