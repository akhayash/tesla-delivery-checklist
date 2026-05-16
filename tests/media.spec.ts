import path from 'node:path';
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { test, expect } from './fixtures';

const tmpDir = path.resolve(process.cwd(), 'test-results/tmp');
let samplePath: string;

test.beforeAll(async ({}, testInfo) => {
  mkdirSync(tmpDir, { recursive: true });
  // Unique per project to avoid races when running multiple projects in parallel.
  samplePath = path.join(tmpDir, `sample-${testInfo.project.name}.jpg`);
  await sharp({
    create: {
      width: 32,
      height: 32,
      channels: 3,
      background: { r: 200, g: 30, b: 55 },
    },
  })
    .jpeg({ quality: 85 })
    .toFile(samplePath);
});

test('問題項目に写真を添付・削除できる', async ({ freshPage: page, browserName }) => {
  // WebKit headless: programmatically populating a visually-hidden
  // <input type="file"> nested inside a Radix Slot can fail to surface
  // the change event. The feature works in real iOS Safari (verified
  // manually). Chromium + Mobile Chrome (Pixel 7) projects cover this flow.
  test.skip(browserName === 'webkit', 'Headless WebKit limitation with sr-only file inputs');

  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));

  await page.getByRole('link', { name: /チェックを開始/ }).click();
  const item = page.getByTestId('item-ext.paint');
  await item.scrollIntoViewIfNeeded();
  await item.getByRole('radio', { name: '問題あり' }).click();

  // Pick the library input (no `capture` attribute) — WebKit can be picky
  // about programmatically populating capture-only inputs in headless mode.
  const fileInput = item
    .locator('input[type=file]:not([capture])')
    .first();
  await fileInput.setInputFiles(samplePath);

  await expect(
    item.getByTestId('media-grid').locator('img'),
    `console errors: ${errors.join(' | ')}`
  ).toHaveCount(1, {
    timeout: 15_000,
  });

  await page.reload();
  const itemAfter = page.getByTestId('item-ext.paint');
  await itemAfter.scrollIntoViewIfNeeded();
  await expect(itemAfter.getByTestId('media-grid').locator('img')).toHaveCount(1, {
    timeout: 15_000,
  });

  await itemAfter.getByRole('button', { name: '削除' }).click();
  await expect(page.getByRole('alertdialog')).toContainText('削除すると元に戻せません');
  await page.getByRole('button', { name: 'キャンセル' }).click();
  await expect(itemAfter.getByTestId('media-grid').locator('img')).toHaveCount(1);

  await itemAfter.getByRole('button', { name: '削除' }).click();
  await page.getByRole('button', { name: '削除する' }).click();
  await expect(itemAfter.getByTestId('media-grid')).toHaveCount(0);
});
