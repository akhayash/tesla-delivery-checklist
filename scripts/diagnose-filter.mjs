import { chromium, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'docs/handoff');
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 14'] });
const page = await ctx.newPage();
const messages = [];
page.on('console', (msg) => messages.push(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', (err) => messages.push(`[pageerror] ${err.message}`));

await page.goto('http://localhost:4174/tesla-delivery-checklist/#/checklist', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Check DOM for filter chip
const chipCount = await page.locator('[data-testid^="filter-chip-"]').count();
console.log('filter chip elements found:', chipCount);
const headerHTML = await page.locator('header.app-header').innerHTML();
console.log('header innerHTML length:', headerHTML.length);
console.log('contains 最低限:', headerHTML.includes('最低限'));

await page.screenshot({ path: path.join(outDir, 'diagnose-checklist-iphone.png'), fullPage: false });
console.log('screenshot saved');

if (messages.length) {
  console.log('--- console messages ---');
  messages.forEach((m) => console.log(m));
}

await browser.close();
