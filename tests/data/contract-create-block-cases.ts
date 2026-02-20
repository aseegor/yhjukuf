export type BlockFieldRule = {
  field: string;
  index?: number;
  visible?: boolean;
  editable?: boolean;
  prefilledValue?: string;
  fillMode?: 'fill' | 'select' | 'check';
  fillValue?: string | boolean;
};

export type ContractCreateBlockCase = {
  name: string;
  type: string;
  block: string;
  rules: BlockFieldRule[];
};

export const contractCreateBlockCases: Record<string, ContractCreateBlockCase> = {
  financeForBasicType: {
    name: 'finance block for BASIC type',
    type: 'Базовый',
    block: 'Параметры',
    rules: [
      { field: 'Валюта', visible: true, editable: true, prefilledValue: 'RUB' },
      { field: 'Сумма', visible: true, editable: true, fillMode: 'fill', fillValue: '1000' },
      { field: 'Комментарий', visible: false }
    ]
  },
  financeForSpecialType: {
    name: 'finance block for SPECIAL type',
    type: 'Специальный',
    block: 'Параметры',
    rules: [
      { field: 'Валюта', visible: true, editable: false, prefilledValue: 'USD', fillMode: 'select', fillValue: 'USD' },
      { field: 'Сумма', visible: true, editable: true, fillMode: 'fill', fillValue: '2500' },
      { field: 'Комментарий', visible: true, editable: true }
    ]
  }
};
