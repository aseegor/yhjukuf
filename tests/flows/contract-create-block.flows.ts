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
  await assertBlockRules(contractCreatePage, scenario);
}

export async function fillBlockByType(
  contractCreatePage: ContractCreatePage,
  scenario: ContractCreateBlockCase,
  options?: { openForm?: boolean }
): Promise<void> {
  if (options?.openForm !== false) {
    await contractCreatePage.goto();
    await contractCreatePage.expectOpened();
  }

  await contractCreatePage.selectContractType(scenario.type);
  await fillBlockRules(contractCreatePage, scenario);
}

export async function assertAndFillBlockByType(
  contractCreatePage: ContractCreatePage,
  scenario: ContractCreateBlockCase,
  options?: { openForm?: boolean }
): Promise<void> {
  if (options?.openForm !== false) {
    await contractCreatePage.goto();
    await contractCreatePage.expectOpened();
  }

  await contractCreatePage.selectContractType(scenario.type);
  await assertBlockRules(contractCreatePage, scenario);
  await fillBlockRules(contractCreatePage, scenario);
}

async function assertBlockRules(
  contractCreatePage: ContractCreatePage,
  scenario: ContractCreateBlockCase
): Promise<void> {
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

async function fillBlockRules(
  contractCreatePage: ContractCreatePage,
  scenario: ContractCreateBlockCase
): Promise<void> {
  for (const rule of scenario.rules) {
    if (rule.fillMode === undefined) {
      continue;
    }

    const field = contractCreatePage.block(scenario.block).field(rule.field, fieldIndex(rule.index));
    if (rule.fillValue === undefined) {
      throw new Error(
        `Rule for field "${rule.field}" in block "${scenario.block}" has fillMode but no fillValue.`
      );
    }

    if (rule.fillMode === 'fill') {
      await field.fill(String(rule.fillValue));
      continue;
    }

    if (rule.fillMode === 'select') {
      await field.select(String(rule.fillValue));
      continue;
    }

    if (rule.fillValue) {
      await field.check();
      continue;
    }

    await field.uncheck();
  }
}
