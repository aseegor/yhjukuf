import { expect, Locator } from '@playwright/test';
import { FormField } from './form-field';

export class ContractBlock {
  constructor(readonly root: Locator) {}

  field(label: string, index: number = 0): FormField {
    return new FormField(this.root, label, index);
  }

  async enterEdit(buttonName: string = 'Редактировать'): Promise<void> {
    await this.root.getByRole('button', { name: buttonName }).click();
  }

  async save(buttonName: string = 'Сохранить'): Promise<void> {
    await this.root.getByRole('button', { name: buttonName }).click();
  }

  async cancel(buttonName: string = 'Отменить'): Promise<void> {
    await this.root.getByRole('button', { name: buttonName }).click();
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  async expectHidden(): Promise<void> {
    await expect(this.root).toBeHidden();
  }
}
