import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4173/login');
  await page.getByTestId('login.username').click();
  await page.getByTestId('login.username').fill('admin');
  await page.getByTestId('login.username').press('Tab');
  await page.getByTestId('login.password').fill('admin');
  await page.getByTestId('login.password').press('Enter');
  await page.getByTestId('login.submit').click();
  await page.getByTestId('contracts.item.1').click();
  await expect(page.getByTestId('contract.number')).toHaveValue('CN-0001');
  await expect(page.getByTestId('contract.form')).toMatchAriaSnapshot(`
    - text: Причина
    - textbox "Причина"
    `);
  await page.getByText('Номер').click();
  await expect(page.getByTestId('contract.form')).toMatchAriaSnapshot(`
    - text: Номер
    - textbox "Номер" [disabled]: /CN-\\d+/
    `);
  await page.getByText('Статус ACTIVE BLOCKED CLOSED').click();
  await expect(page.getByTestId('contract.form')).toMatchAriaSnapshot(`
    - text: Статус
    - combobox "Статус":
      - option "ACTIVE" [selected]
      - option "BLOCKED"
      - option "CLOSED"
    `);
});