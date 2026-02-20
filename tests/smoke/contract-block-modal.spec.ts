import { expect, test } from '../fixtures';
import { openParentContractMenuByNumber } from '../flows/contracts.flows';

test(
  'block contract via status flow and verify status + toast',
  { tag: ['@manual', '@contracts'] },
  async ({ contractsPage, page }) => {
    const contractNumber = 'CN-0001';
    const expectedStatusText = 'BLOCKED';

    const flow = await openParentContractMenuByNumber(contractsPage, contractNumber);
    const modal = await flow.changeStatus(
      'block',
      'Иное',
      'Автотестовая причина блокировки'
    );

    await expect(modal.root).toBeHidden();

    const updatedItem = await contractsPage.contractsList.findByNumber(contractNumber);
    await expect(updatedItem.status()).toContainText(expectedStatusText);

    const toast = page.locator(
      'xpath=(//*[@role="alert" or contains(@class,"toast")][contains(.,"успеш") or contains(.,"сохран")])[last()]'
    );
    await expect(toast).toBeVisible();
  }
);
