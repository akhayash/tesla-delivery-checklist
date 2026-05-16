import { test, expect } from './fixtures';

test.describe('クラッシュ復帰 UX', () => {
  test('チェック後ホームに「前回の続きから」CTA が表示される', async ({ freshPage: page }) => {
    // Initially no resume CTA
    await expect(page.getByTestId('resume-cta')).not.toBeVisible();

    // Go to checklist and check an item
    await page.getByRole('link', { name: /チェックを開始/ }).click();
    await expect(page).toHaveURL(/#\/checklist/);

    const firstItem = page.getByTestId('item-doc.vin-match');
    await firstItem.getByRole('radio', { name: 'OK' }).click();
    await expect(firstItem).toHaveAttribute('data-status', 'ok');

    // Go back to home
    await page.getByRole('link', { name: /ホーム|home/i }).click().catch(() =>
      page.goto('')
    );
    await page.goto('');

    // Resume CTA should now appear
    await expect(page.getByTestId('resume-cta')).toBeVisible();
    await expect(page.getByTestId('resume-cta')).toContainText('前回の続きから');
    await expect(page.getByTestId('resume-cta')).toContainText('1 件目');
  });

  test('チェックリストページにリロード後「前回の続きから」バナーが表示される', async ({ freshPage: page }) => {
    // Check an item
    await page.getByRole('link', { name: /チェックを開始/ }).click();
    const firstItem = page.getByTestId('item-doc.vin-match');
    await firstItem.getByRole('radio', { name: 'OK' }).click();

    // Reload — banner should appear
    await page.reload();
    await expect(page.getByTestId('resume-banner')).toBeVisible();
    await expect(page.getByTestId('resume-banner')).toContainText('1 件チェック済み');
  });

  test('リロード後も状態が永続化される', async ({ freshPage: page }) => {
    await page.getByRole('link', { name: /チェックを開始/ }).click();
    const item = page.getByTestId('item-doc.vin-match');
    await item.getByRole('radio', { name: 'OK' }).click();
    await expect(item).toHaveAttribute('data-status', 'ok');

    await page.reload();
    await expect(page.getByTestId('item-doc.vin-match')).toHaveAttribute('data-status', 'ok');
  });

  test('全件完了かつ問題ありのときホーム CTA は「レポートを確認する」', async ({ freshPage: page }) => {
    await page.getByRole('link', { name: /チェックを開始/ }).click();
    await page.getByTestId('bulk-issue').click();
    await page.getByTestId('bulk-confirm').click();

    await page.goto('');
    await expect(page.getByTestId('complete-cta')).toBeVisible();
    await expect(page.getByTestId('complete-cta')).toContainText('レポートを確認する');
  });

  test('全件完了かつ問題なしのときホーム CTA は完了メッセージ', async ({ freshPage: page }) => {
    await page.getByRole('link', { name: /チェックを開始/ }).click();
    await page.getByTestId('bulk-ok').click();

    await page.goto('');
    await expect(page.getByTestId('complete-cta')).toBeVisible();
    await expect(page.getByTestId('complete-cta')).toContainText('🎉 完璧です！レポートを出力する');
  });
});
