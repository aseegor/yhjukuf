import { test } from '../fixtures';

test('T2 Authenticated contracts list', async ({ contractsPage }) => {
  await contractsPage.goto();
  await contractsPage.expectLoaded();
});
