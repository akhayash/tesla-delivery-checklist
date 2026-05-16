import { chromium, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const URL = 'https://akhayash.github.io/tesla-delivery-checklist/';
const outDir = path.resolve(process.cwd(), 'docs/handoff');

async function shoot(deviceName, configName, route, file) {
  console.log(`shoot ${deviceName} ${route} -> ${file}`);
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices[configName],
  });
  const page = await context.newPage();
  await page.goto(`${URL}${route}`, { waitUntil: 'networkidle' });
  // Let the app hydrate and PWA register
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, file), fullPage: true });
  await browser.close();
}

(async () => {
  await mkdir(outDir, { recursive: true });
  await shoot('iPhone 14', 'iPhone 14', '', '01-home-iphone.png');
  await shoot('iPhone 14', 'iPhone 14', '#/checklist', '02-checklist-iphone.png');
  await shoot('iPhone 14', 'iPhone 14', '#/summary', '03-summary-iphone.png');
  await shoot('iPhone 14', 'iPhone 14', '#/settings', '04-settings-iphone.png');
  await shoot('Pixel 7', 'Pixel 7', '', '05-home-pixel.png');
  await shoot('Desktop', 'Desktop Chrome', '', '06-home-desktop.png');
  console.log('Done. Screenshots in', outDir);
})();
