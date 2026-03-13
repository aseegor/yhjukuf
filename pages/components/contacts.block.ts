import { expect, Locator, Page } from '@playwright/test';
import { ContractBlock } from './contract-block';
import { ContactTypeMenu } from './contact-type-menu';
import { FormField } from './form-field';

export class ContactsBlock {
  constructor(
    private readonly block: ContractBlock,
    private readonly page: Page
  ) {}

  phone(index: number = 0): FormField {
    return new FormField(this.phoneInput(index));
  }

  email(index: number = 0): FormField {
    return new FormField(this.emailInput(index));
  }

  address(index: number = 0): FormField {
    return new FormField(this.addressInput(index));
  }

  usageType(index: number = 0): FormField {
    return new FormField(this.usageTypeInput(index));
  }

  async addRow(
    contactType: string = 'Телефон',
    addButtonName: string = 'Добавить контакт'
  ): Promise<void> {
    await this.block.root.getByRole('button', { name: addButtonName }).click();

    const menu = new ContactTypeMenu(this.page);
    await menu.select(contactType);
  }

  async clickAddButton(buttonName: string = 'Добавить'): Promise<void> {
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

  private contactSection(contactType: string, index: number): Locator {
    return this.block.root
      .locator(
        `xpath=.//section[contains(@class,'grid-section-container')][.//h3[normalize-space()='${contactType}']]`
      )
      .nth(index);
  }

  private phoneInput(index: number): Locator {
    return this.contactSection('Телефон', index).locator('xpath=.//input[not(@readonly)]').first();
  }

  private emailInput(index: number): Locator {
    return this.contactSection('E-mail', index).locator('xpath=.//input[not(@readonly)]').first();
  }

  private addressInput(index: number): Locator {
    return this.contactSection('Почтовый адрес', index).locator('xpath=.//textarea').first();
  }

  private usageTypeInput(index: number): Locator {
    return this.contactSection('Почтовый адрес', index)
      .locator("xpath=.//input[@label='Вид использования контакта' or @readonly]")
      .first();
  }
}
