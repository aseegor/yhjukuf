import { test } from '../fixtures';
import { contractCreateBlockCases } from '../data/contract-create-block-cases';
import { assertBlockByType } from '../flows/contract-create-block.flows';

test('create form block rules differ by contract type', { tag: ['@manual', '@contracts', '@create'] }, async ({
  contractCreatePage
}) => {
  await assertBlockByType(contractCreatePage, contractCreateBlockCases.financeForBasicType, {
    openForm: true
  });

  await assertBlockByType(contractCreatePage, contractCreateBlockCases.financeForSpecialType, {
    openForm: false
  });
});
