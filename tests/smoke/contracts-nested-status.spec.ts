import { expect, test } from '../fixtures';

test('find contract, expand children, verify child status', { tag: '@smoke' }, async ({
  contractsPage
}) => {
  const parentContractNumber = 'CN-0001';
  const childContractNumber = 'CN-0001-1';
  const expectedChildStatus = 'ACTIVE';

  await contractsPage.goto();
  await contractsPage.expectLoaded();

  const parent = await contractsPage.contractsList.findByNumber(parentContractNumber);
  await parent.expandChildren();

  const child = await parent.findChildByNumber(childContractNumber);
  expect(child).not.toBeNull();

  if (!child) {
    return;
  }

  await expect(child.status()).toBeVisible();
  await expect(child.status()).toContainText(expectedChildStatus);
});
