import { test as base, expect, type Page } from '@playwright/test';

/**
 * Each Playwright test gets its own fresh browser context by default,
 * so localStorage/IndexedDB are already empty at the start of each test.
 * We just navigate to the home page for convenience.
 */
export const test = base.extend<{ freshPage: Page }>({
  freshPage: async ({ page }, use) => {
    await page.goto('');
    await use(page);
  },
});

export { expect };

export function tinyJpegBuffer(): Buffer {
  // 1x1 red JPEG
  return Buffer.from(
    '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKpwB/9k=',
    'base64'
  );
}
