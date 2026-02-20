import { expect, test } from '../fixtures';
import { getBrowserTodayISO } from '../utils/date';

test('T3 Contract prefill + save', async ({ page, contractPage }) => {
  await contractPage.goto('1');
  await contractPage.setStatus('BLOCKED');

  const todayISO = await getBrowserTodayISO(page);
  await expect(contractPage.blockDate).toHaveValue(todayISO);

  await contractPage.saveAndConfirm();
  await expect(contractPage.toast).toBeVisible();
});
