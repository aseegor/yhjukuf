import { ContractCreatePage } from '../../pages/contract-create.page';
import { ContractCreateBlockCase } from '../data/contract-create-block-cases';

function fieldIndex(index?: number): number {
  return index ?? 0;
}

export async function assertBlockByType(
  contractCreatePage: ContractCreatePage,
  scenario: ContractCreateBlockCase,
  options?: { openForm?: boolean }
): Promise<void> {
  if (options?.openForm !== false) {
    await contractCreatePage.goto();
    await contractCreatePage.expectOpened();
  }

  await contractCreatePage.selectContractType(scenario.type);

  for (const rule of scenario.rules) {
    const field = contractCreatePage.block(scenario.block).field(rule.field, fieldIndex(rule.index));

    if (rule.visible === false) {
      await field.expectHidden();
      continue;
    }

    await field.expectVisible();

    if (rule.prefilledValue !== undefined) {
      await field.expectValue(rule.prefilledValue);
    }

    if (rule.editable === false) {
      await field.expectReadOnly();
    }

    if (rule.editable === true) {
      await field.expectEditable();
    }
  }
}
