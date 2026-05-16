import { test, expect } from './fixtures';

test('manifest と service worker が利用可能', async ({ page }) => {
  const resp = await page.goto('manifest.webmanifest');
  expect(resp?.status()).toBe(200);
  const manifest = await resp!.json();
  expect(manifest.name).toContain('Tesla');
  expect(manifest.start_url).toContain('/tesla-delivery-checklist/');

  // Service worker file is served
  const sw = await page.goto('sw.js');
  expect(sw?.status()).toBe(200);
});

test('Reset が動作する', async ({ freshPage: page }) => {
  // create some state
  await page.getByRole('link', { name: /チェックを開始/ }).click();
  await page
    .getByTestId('item-doc.vin-match')
    .getByRole('radio', { name: 'OK' })
    .click();
  await expect(page.locator('header.app-header')).toContainText('1');

  await page.getByRole('link', { name: '設定' }).click();
  await page.getByTestId('reset-btn').click();
  await page.getByTestId('reset-confirm').click();

  await page.getByRole('link', { name: 'チェック' }).click();
  await expect(page.locator('header.app-header')).toContainText('0');
});
