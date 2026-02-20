import { expect, test } from '../fixtures';
import { contractCreateCases } from '../data/contract-create-cases';
import { createContractByCase } from '../flows/contract-create.flows';
import { interceptAndAssertRequestBody } from '../utils/network';

test(
  'create form: type fields, prefill and request body',
  { tag: ['@manual', '@contracts', '@create'] },
  async ({ contractCreatePage, page }) => {
    const scenario = contractCreateCases.basicType;

    const interception = await interceptAndAssertRequestBody(
      page,
      scenario.requestUrlPattern ?? '**/api/contracts',
      scenario.expectedRequestBody
    );

    await createContractByCase(contractCreatePage, scenario);

    expect(interception.getActualBody()).toBeDefined();
  }
);
