import { expect, test } from '../fixtures';

test('mock contract #2 response data', { tag: '@smoke1' }, async ({ page, contractPage }) => {
  const mockedContract = {
    id: '1234',
    number: 'CN-00043',
    status: 'BLOCKED',
    blockDate: '2026-02-01',
    reason: 'хузог'
  };

  await page.route('**/api/contracts/2', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockedContract)
    });
  });

  await contractPage.goto('2');

  await expect(contractPage.status).toHaveValue(mockedContract.status);
  await expect(contractPage.blockDate).toHaveValue(mockedContract.blockDate);
});
