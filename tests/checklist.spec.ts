import { test, expect } from './fixtures';

test.describe('チェックリスト基本操作', () => {
  test('ホーム → チェックリスト → 状態切替 → 永続化', async ({ freshPage: page }) => {
    // Home shows the model card
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Tesla');
    await expect(
      page.getByText('Tesla Model Y L (ロングホイールベース 6 人乗り)')
    ).toBeVisible();

    // Navigate to checklist
    await page.getByRole('link', { name: /チェックを開始/ }).click();
    await expect(page).toHaveURL(/#\/checklist/);
    await expect(page.getByTestId('cat-step-1-handoff')).toBeVisible();
    await expect(page.getByTestId('cat-step-10-aftercare')).toBeVisible();

    // The first item (VIN match) is critical
    const firstItem = page.getByTestId('item-doc.vin-match');
    await expect(firstItem).toBeVisible();

    // Mark OK via the OK toggle inside the row
    await firstItem.getByRole('radio', { name: 'OK' }).click();
    await expect(firstItem).toHaveAttribute('data-status', 'ok');

    // Mark another item as Issue and verify note appears
    const second = page.getByTestId('item-ext.panel-gaps');
    await second.scrollIntoViewIfNeeded();
    await second.getByRole('radio', { name: '問題あり' }).click();
    await expect(second).toHaveAttribute('data-status', 'issue');
    await second.getByTestId('note-ext.panel-gaps').fill('右リアハッチの隙間が大きい');

    // Progress header should show 2 checked
    await expect(page.locator('header.app-header')).toContainText('2');

    // Reload — state should persist via localStorage
    await page.reload();
    await expect(page.getByTestId('item-doc.vin-match')).toHaveAttribute('data-status', 'ok');
    await expect(page.getByTestId('item-ext.panel-gaps')).toHaveAttribute(
      'data-status',
      'issue'
    );
    await expect(
      page.getByTestId('item-ext.panel-gaps').getByTestId('note-ext.panel-gaps')
    ).toHaveValue('右リアハッチの隙間が大きい');
  });

  test('カテゴリのバッジが集計を反映する', async ({ freshPage: page }) => {
    await page.getByRole('link', { name: /チェックを開始/ }).click();
    const item = page.getByTestId('item-doc.vin-match');
    await item.getByRole('radio', { name: '問題あり' }).click();
    await expect(page.getByTestId('cat-step-1-handoff')).toContainText('問題 1');
  });
});
