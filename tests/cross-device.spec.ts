import { test, expect, type BrowserContext } from '@playwright/test';
import { chromium } from '@playwright/test';

test('別デバイスで QR の URL を開いてもチェック結果が表示される', async ({ browser, baseURL }) => {
  // Step 1: device A — set up some checks and grab the viewer URL embedded
  // in the HTML report. We extract the URL directly from the report HTML so
  // the test mirrors what the recipient would actually scan.
  const ctxA = await browser.newContext();
  const pageA = await ctxA.newPage();
  await pageA.goto('');

  await pageA.getByRole('link', { name: /チェックを開始/ }).click();

  await pageA
    .getByTestId('item-doc.vin-match')
    .getByRole('radio', { name: 'OK' })
    .click();

  const issueItem = pageA.getByTestId('item-ext.panel-gaps');
  await issueItem.scrollIntoViewIfNeeded();
  await issueItem.getByRole('radio', { name: '問題あり' }).click();
  await issueItem
    .getByTestId('note-ext.panel-gaps')
    .fill('別デバイステスト用メモ');

  await pageA.getByRole('link', { name: 'レポート' }).click();
  await pageA.getByLabel('VIN').fill('5YJYGAEDXNF000001');

  await pageA.getByTestId('preview-btn').click();
  await expect(pageA.getByTestId('preview-iframe')).toBeVisible({ timeout: 15000 });

  const [download] = await Promise.all([
    pageA.waitForEvent('download'),
    pageA.getByTestId('preview-download-html').click(),
  ]);
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const c of stream) chunks.push(c as Buffer);
  const html = Buffer.concat(chunks).toString('utf-8');

  // Capture the preview server host BEFORE closing context A.
  const previewHost = new URL(baseURL!).host;

  await ctxA.close();

  // Extract the FULL viewer URL from the data-qr-url attribute (the displayed
  // text is truncated for readability but the data-attribute contains the
  // complete URL).
  const urlMatch = html.match(/data-qr-url="([^"]+#\/view\?d=[^"]+)"/);
  expect(urlMatch, 'viewer URL should be embedded in HTML report data-qr-url').not.toBeNull();
  const viewerUrl = decodeHtml(urlMatch![1]);

  // Step 2: simulate a completely separate device — a brand new browser
  // context (no shared storage). We only override the host so the test hits
  // our preview server instead of GitHub Pages.
  const portableUrl = viewerUrl.replace(/https?:\/\/[^/]+/, `http://${previewHost}`);

  const ctxB: BrowserContext = await browser.newContext();
  const pageB = await ctxB.newPage();
  await pageB.goto(portableUrl);

  // Read-only view should render with our data
  await expect(pageB.getByText('Shared Inspection — Read Only')).toBeVisible();
  await expect(
    pageB.getByRole('heading', { name: /Tesla Model Y L/ })
  ).toBeVisible();
  await expect(pageB.getByText('別デバイステスト用メモ')).toBeVisible();
  await expect(pageB.getByText('5YJYGAEDXNF000001')).toBeVisible();

  // Crucially: page B has no localStorage / IndexedDB from page A. Verify so.
  const aStorageEmpty = await pageB.evaluate(() => {
    return Object.keys(localStorage).length === 0;
  });
  expect(aStorageEmpty).toBe(true);

  await ctxB.close();
});

// Silence unused-import warning when running in isolation.
void chromium;

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
