import { test, expect } from './fixtures';

test('Home から QR コードを表示できる', async ({ freshPage: page }) => {
  await page.getByTestId('qr-open').click();
  // Wait for the SVG to be rendered into the dialog
  const qrImage = page.getByTestId('qr-image');
  await expect(qrImage).toBeVisible();
  await expect(qrImage.locator('svg')).toHaveCount(1);
  // The URL should be shown as code
  await expect(page.getByText(/tesla-delivery-checklist/)).toBeVisible();
});

test('HTML レポートに QR コードと URL が埋め込まれる', async ({ freshPage: page }) => {
  await page.getByRole('link', { name: /チェックを開始/ }).click();
  await page
    .getByTestId('item-doc.vin-match')
    .getByRole('radio', { name: '問題あり' })
    .click();

  // Bottom nav "レポート" goes to /#/summary; Summary has the preview entry.
  await page.getByRole('link', { name: 'レポート' }).click();
  await page.getByTestId('preview-btn').click();
  await expect(page.getByTestId('preview-iframe')).toBeVisible({ timeout: 15000 });
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('preview-download-html').click(),
  ]);
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const c of stream) chunks.push(c as Buffer);
  const html = Buffer.concat(chunks).toString('utf-8');
  expect(html).toMatch(/<svg[^>]*>[\s\S]*<\/svg>/);
  expect(html).toContain('tesla-delivery-checklist');
  // Either the viewer ("スマホで…") or app-only ("アプリを開く") section header
  // must be present.
  expect(html).toMatch(/スマホでこの結果を見る|アプリを開く/);
  // Full QR target URL must be retrievable via the data-qr-url attribute.
  expect(html).toMatch(/data-qr-url="[^"]+"/);
});
