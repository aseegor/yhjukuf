import { expect, Locator } from '@playwright/test';
import { ContractBlock } from './contract-block';
import { FormField } from './form-field';

export class ContactsBlock {
  constructor(private readonly block: ContractBlock) {}

  phone(index: number = 0): FormField {
    return this.block.field('Телефон', index);
  }

  email(index: number = 0): FormField {
    return this.block.field('Email', index);
  }

  address(index: number = 0): FormField {
    return this.block.field('Адрес', index);
  }

  async addRow(buttonName: string = 'Добавить'): Promise<void> {
    await this.block.root.getByRole('button', { name: buttonName }).click();
  }

  async setCheckbox(index: number, checked: boolean): Promise<void> {
    const checkbox = this.block.root.locator(`xpath=(.//input[@type='checkbox'])[${index + 1}]`).first();
    await expect(checkbox).toBeVisible();
    if (checked) {
      await checkbox.check();
      return;
    }
    await checkbox.uncheck();
  }

  async expectRowCountAtLeast(count: number): Promise<void> {
    const rows = this.block.root.locator("xpath=.//*[contains(@class,'row') or contains(@class,'item')]");
    expect(await rows.count()).toBeGreaterThanOrEqual(count);
  }
}
