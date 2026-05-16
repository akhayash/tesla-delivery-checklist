import { test, expect } from './fixtures';

test('HTML / Markdown / JSON レポートをダウンロードできる', async ({ freshPage: page }) => {
  await page.getByRole('link', { name: /チェックを開始/ }).click();
  const item = page.getByTestId('item-ext.panel-gaps');
  await item.scrollIntoViewIfNeeded();
  await item.getByRole('radio', { name: '問題あり' }).click();
  await item.getByTestId('note-ext.panel-gaps').fill('テストメモ');

  await page.getByRole('link', { name: 'レポート' }).click();
  await expect(page).toHaveURL(/#\/summary/);
  // Issue list shows our problem
  await expect(page.getByTestId('issue-ext.panel-gaps')).toContainText('テストメモ');

  // HTML download
  const html = await downloadOnClick(page, 'export-html');
  expect(html.suggestedFilename()).toMatch(/\.html$/);

  const md = await downloadOnClick(page, 'export-md');
  expect(md.suggestedFilename()).toMatch(/\.md$/);

  const json = await downloadOnClick(page, 'export-json');
  expect(json.suggestedFilename()).toMatch(/\.json$/);
});

test('印刷ビューに切り替えても基本要素が表示される', async ({ freshPage: page }) => {
  await page.getByRole('link', { name: /チェックを開始/ }).click();
  await page.getByRole('link', { name: 'レポート' }).click();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('header.app-header')).toBeHidden();
});

async function downloadOnClick(page: import('@playwright/test').Page, testId: string) {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId(testId).click(),
  ]);
  return download;
}
