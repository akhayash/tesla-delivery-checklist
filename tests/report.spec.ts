import { test, expect } from './fixtures';

test('HomePage: 詳細スペックが初期表示で閉じている', async ({ freshPage: page }) => {
  const trigger = page.getByRole('button', { name: /詳細スペック/ });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('HomePage: 詳細スペックを開くと車両仕様が表示される', async ({ freshPage: page }) => {
  const trigger = page.getByRole('button', { name: /詳細スペック/ });
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  // Pick a label that only appears in the spec grid (not in the model name).
  await expect(page.getByText('全長×全幅×全高')).toBeVisible();
});

test('SummaryPage: Markdown / JSON ボタンが存在しない', async ({ freshPage: page }) => {
  await page.getByRole('link', { name: /チェックを開始/ }).click();
  await page.getByRole('link', { name: 'レポート' }).click();
  await expect(page).toHaveURL(/#\/summary/);
  await expect(page.getByTestId('export-md')).toHaveCount(0);
  await expect(page.getByTestId('export-json')).toHaveCount(0);
});

test('SummaryPage → /report/preview に遷移して iframe が描画される', async ({ freshPage: page }) => {
  await page.getByRole('link', { name: /チェックを開始/ }).click();
  await page.getByRole('link', { name: 'レポート' }).click();
  await expect(page).toHaveURL(/#\/summary/);
  await page.getByTestId('preview-btn').click();
  await expect(page).toHaveURL(/#\/report\/preview/);
  // iframe should eventually appear
  await expect(page.getByTestId('preview-native')).toBeVisible({ timeout: 15000 });
});

test('ReportPreviewPage: HTML としてダウンロードが発火する', async ({ freshPage: page }) => {
  await page.goto('/#/report/preview');
  await expect(page.getByTestId('preview-native')).toBeVisible({ timeout: 15000 });
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('preview-download-html').click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.html$/);
});

test('Settings: JSON エクスポートができる', async ({ freshPage: page }) => {
  await page.getByRole('link', { name: '設定 / データ' }).click();
  await expect(page).toHaveURL(/#\/settings/);
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /JSON でバックアップ/ }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.json$/);
});

test('印刷ビューに切り替えても基本要素が表示される', async ({ freshPage: page }) => {
  await page.getByRole('link', { name: /チェックを開始/ }).click();
  await page.getByRole('link', { name: 'レポート' }).click();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('header.app-header')).toBeHidden();
});
