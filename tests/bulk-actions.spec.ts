import { test, expect } from './fixtures';

test.describe('一括ショートカット', () => {
  test('未選択を一括で OK にして Undo で戻せる', async ({ freshPage: page }) => {
    await page.getByRole('link', { name: /チェックを開始/ }).click();
    await page.getByTestId('checklist-filter-critical').click();

    await expect(page.getByTestId('bulk-preview')).toContainText('現在未チェックの 8 件');

    await page.getByTestId('bulk-ok').click();

    await expect(page.getByTestId('item-doc.vin-match')).toHaveAttribute('data-status', 'ok');
    await expect(page.getByTestId('item-int.pedals')).toHaveAttribute('data-status', 'ok');
    await expect(page.getByText('表示中の未チェック 8 件を OK にしました')).toBeVisible();

    await page.getByRole('button', { name: 'Undo' }).click();

    await expect(page.getByTestId('item-doc.vin-match')).toHaveAttribute('data-status', 'unchecked');
    await expect(page.getByTestId('item-int.pedals')).toHaveAttribute(
      'data-status',
      'unchecked'
    );
  });

  test('表示中の項目を未チェックに戻して Undo で復元できる', async ({ freshPage: page }) => {
    await page.getByRole('link', { name: /チェックを開始/ }).click();

    await page.getByTestId('item-doc.vin-match').getByRole('radio', { name: 'OK' }).click();
    await page
      .getByTestId('item-ext.panel-gaps')
      .getByRole('radio', { name: '問題あり' })
      .click();

    await page.getByTestId('bulk-clear').click();
    await page.getByTestId('bulk-confirm').click();

    await expect(page.getByTestId('item-doc.vin-match')).toHaveAttribute(
      'data-status',
      'unchecked'
    );
    await expect(page.getByTestId('item-ext.panel-gaps')).toHaveAttribute(
      'data-status',
      'unchecked'
    );

    await page.getByRole('button', { name: 'Undo' }).click();

    await expect(page.getByTestId('item-doc.vin-match')).toHaveAttribute('data-status', 'ok');
    await expect(page.getByTestId('item-ext.panel-gaps')).toHaveAttribute(
      'data-status',
      'issue'
    );
  });
});
