import { ContractCreatePage } from '../../pages/contract-create.page';
import { ContractCreateCase, FillField, PrefilledField } from '../data/contract-create-cases';

function fieldIndex(index?: number): number {
  return index ?? 0;
}

async function assertVisibleFields(
  contractCreatePage: ContractCreatePage,
  fields: ContractCreateCase['expectedVisibleFields']
): Promise<void> {
  for (const field of fields) {
    await contractCreatePage
      .block(field.block)
      .field(field.field, fieldIndex(field.index))
      .expectEditable();
  }
}

async function assertPrefilledFields(
  contractCreatePage: ContractCreatePage,
  fields: PrefilledField[]
): Promise<void> {
  for (const field of fields) {
    await contractCreatePage
      .block(field.block)
      .field(field.field, fieldIndex(field.index))
      .expectValue(field.value);
  }
}

async function fillField(contractCreatePage: ContractCreatePage, field: FillField): Promise<void> {
  const target = contractCreatePage.block(field.block).field(field.field, fieldIndex(field.index));

  if (field.mode === 'fill') {
    await target.fill(String(field.value));
    return;
  }

  if (field.mode === 'select') {
    await target.select(String(field.value));
    return;
  }

  if (field.value) {
    await target.check();
    return;
  }

  await target.uncheck();
}

async function fillAllFields(
  contractCreatePage: ContractCreatePage,
  fields: ContractCreateCase['fillFields']
): Promise<void> {
  for (const field of fields) {
    await fillField(contractCreatePage, field);
  }
}

export async function createContractByCase(
  contractCreatePage: ContractCreatePage,
  scenario: ContractCreateCase,
  options?: { submit?: boolean }
): Promise<void> {
  await contractCreatePage.goto();
  await contractCreatePage.expectOpened();
  await contractCreatePage.selectContractType(scenario.type);

  await assertVisibleFields(contractCreatePage, scenario.expectedVisibleFields);
  await assertPrefilledFields(contractCreatePage, scenario.expectedPrefilledFields);
  await fillAllFields(contractCreatePage, scenario.fillFields);

  if (options?.submit !== false) {
    await contractCreatePage.save(scenario.saveButtonName ?? 'Создать');
  }
}
