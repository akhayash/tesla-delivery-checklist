import { test, expect } from './fixtures';

test('重要度フィルタを切り替えると表示件数と保存内容が変わる', async ({
  freshPage: page,
}) => {
  await page.getByTestId('severity-standard').click();
  await page.getByRole('link', { name: /チェックを開始/ }).click();

  await expect(page.getByTestId('bulk-preview')).toContainText('表示中の 62 件');
  await expect(page.getByTestId('item-doc.mobile-connector')).toBeVisible();
  await expect(page.getByTestId('item-doc.floormats')).toHaveCount(0);

  await page.getByTestId('checklist-filter-critical').click();

  await expect(page.getByTestId('bulk-preview')).toContainText('表示中の 14 件');
  await expect(page.getByTestId('item-doc.vin-match')).toBeVisible();
  await expect(page.getByTestId('item-doc.mobile-connector')).toHaveCount(0);

  await page.reload();

  await expect(page.getByTestId('bulk-preview')).toContainText('表示中の 14 件');
  await expect(page.getByTestId('item-doc.mobile-connector')).toHaveCount(0);

  const persistedFilter = await page.evaluate(() => {
    const raw = localStorage.getItem('tesla-delivery-progress');
    if (!raw) return null;
    return JSON.parse(raw).state.severityFilter;
  });
  expect(persistedFilter).toBe('critical');
});
