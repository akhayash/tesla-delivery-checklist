import { test, expect } from './fixtures';

test('HomePage: PWA インストールガイドを開ける', async ({ freshPage: page }) => {
  await page.getByTestId('install-open').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('ホーム画面に追加して使う')).toBeVisible();
  // Platform-specific steps render numbered step markers (1〜).
  await expect(page.getByRole('dialog').getByText(/^1$/)).toBeVisible();
});

test('Settings: PWA インストールガイドを開ける', async ({ freshPage: page }) => {
  await page.getByRole('link', { name: '設定 / データ' }).click();
  await expect(page).toHaveURL(/#\/settings/);
  await page.getByTestId('install-open').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('オフラインでもチェック作業を続けられます')).toBeVisible();
});
