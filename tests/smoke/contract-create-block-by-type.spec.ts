import { test } from '../fixtures';
import { contractCreateBlockCases } from '../data/contract-create-block-cases';
import { assertAndFillBlockByType } from '../flows/contract-create-block.flows';

test('create form block rules differ by contract type', { tag: ['@manual', '@contracts', '@create'] }, async ({
  contractCreatePage
}) => {
  await assertAndFillBlockByType(contractCreatePage, contractCreateBlockCases.financeForBasicType, {
    openForm: true
  });

  await assertAndFillBlockByType(contractCreatePage, contractCreateBlockCases.financeForSpecialType, {
    openForm: false
  });
});
