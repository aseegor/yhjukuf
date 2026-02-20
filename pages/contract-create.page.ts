import { expect, Locator, Page } from '@playwright/test';
import { ContractBlock } from './components/contract-block';
import { OptionalModal } from './components/optional-modal';

export class ContractCreatePage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/contracts/new');
    await new OptionalModal(this.page).closeIfPresent();
  }

  async selectContractType(typeName: string): Promise<void> {
    const typeSelect = this.page.getByRole('combobox', { name: /тип договора/i });
    await typeSelect.selectOption({ label: typeName }).catch(async () => {
      await typeSelect.selectOption(typeName);
    });
  }

  block(title: string): ContractBlock {
    return new ContractBlock(this.locateBlock(title));
  }

  async expectBlockVisible(title: string): Promise<void> {
    await this.block(title).expectVisible();
  }

  async expectBlockHidden(title: string): Promise<void> {
    await this.block(title).expectHidden();
  }

  async save(buttonName: string = 'Создать'): Promise<void> {
    await this.page.getByRole('button', { name: buttonName }).click();
  }

  async expectOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/\/contracts\/new(?:\/)?$/);
  }

  private locateBlock(title: string): Locator {
    const heading = this.page.getByRole('heading', { name: title, exact: true }).first();
    return heading.locator('xpath=ancestor::*[self::section or self::article or self::div][1]');
  }
}
