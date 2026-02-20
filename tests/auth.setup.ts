import fs from 'node:fs';
import path from 'node:path';
import { Browser, expect, test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import {
  AUTH_PASSWORD,
  AUTH_USERNAME,
  BASE_URL,
  STORAGE_STATE_PATH
} from './utils/paths';

async function hasValidSession(browser: Browser): Promise<boolean> {
  if (!fs.existsSync(STORAGE_STATE_PATH)) {
    return false;
  }

  const context = await browser.newContext({ storageState: STORAGE_STATE_PATH });
  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/contracts`);
    if (/\/login(?:\/)?$/.test(page.url())) {
      return false;
    }

    await expect(page.getByTestId('contracts.title')).toBeVisible({ timeout: 3000 });
    return true;
  } catch {
    return false;
  } finally {
    await context.close();
  }
}

setup('authenticate admin once', async ({ browser }) => {
  fs.mkdirSync(path.dirname(STORAGE_STATE_PATH), { recursive: true });
  if (await hasValidSession(browser)) {
    return;
  }

  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await expect(loginPage.title).toBeVisible();

  await loginPage.login(AUTH_USERNAME, AUTH_PASSWORD);
  await expect(page).toHaveURL(/\/contracts(?:\/)?$/);

  await context.storageState({ path: STORAGE_STATE_PATH });
  await context.close();
});
