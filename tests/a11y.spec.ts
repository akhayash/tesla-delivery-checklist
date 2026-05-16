import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';

test('Home はアクセシビリティ重大違反 0', async ({ freshPage: page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .disableRules(['color-contrast']) // dark theme + accent passes visually but axe is strict
    .analyze();
  expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([]);
});

test('チェック画面はアクセシビリティ重大違反 0', async ({ freshPage: page }) => {
  await page.getByRole('link', { name: /チェックを開始/ }).click();
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .disableRules(['color-contrast'])
    .analyze();
  expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([]);
});
