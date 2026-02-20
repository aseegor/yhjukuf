export type FieldRef = {
  block: string;
  field: string;
  index?: number;
};

export type PrefilledField = FieldRef & {
  value: string;
};

export type FillMode = 'fill' | 'select' | 'check';

export type FillField = FieldRef & {
  mode: FillMode;
  value: string | boolean;
};

export type ContractCreateCase = {
  name: string;
  type: string;
  expectedVisibleFields: FieldRef[];
  expectedPrefilledFields: PrefilledField[];
  fillFields: FillField[];
  expectedRequestBody: Record<string, unknown>;
  saveButtonName?: string;
  requestUrlPattern?: string;
};

export const contractCreateCases: Record<string, ContractCreateCase> = {
  basicType: {
    name: 'basic type prefill and create',
    type: 'Базовый',
    expectedVisibleFields: [
      { block: 'Основные данные', field: 'Номер' },
      { block: 'Параметры', field: 'Дата начала' }
    ],
    expectedPrefilledFields: [
      { block: 'Параметры', field: 'Валюта', value: 'RUB' }
    ],
    fillFields: [
      { block: 'Основные данные', field: 'Номер', mode: 'fill', value: 'CN-AUTO-1001' },
      { block: 'Параметры', field: 'Дата начала', mode: 'fill', value: '01.03.2026' },
      { block: 'Параметры', field: 'Сумма', mode: 'fill', value: '100000' }
    ],
    expectedRequestBody: {
      type: 'Базовый',
      number: 'CN-AUTO-1001'
    },
    saveButtonName: 'Создать',
    requestUrlPattern: '**/api/contracts'
  }
};
