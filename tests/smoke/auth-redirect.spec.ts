import { expect, test } from '@playwright/test';
import { BASE_URL } from '../utils/paths';
  // test.use({ storageState: { cookies: [], origins: [] } });
test('T1 Unauthorized redirect to login',{ tag: '@smoke' }, async ({ browser }) => {

const context = await browser.newContext({ storageState: undefined });
  // const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/contracts`);
// await page.getByTestId('logout').click();
  await expect(page).toHaveURL(/\/login(?:\/)?$/);
  await expect(page.getByTestId('login.title')).toBeVisible();

  await context.close();
});
