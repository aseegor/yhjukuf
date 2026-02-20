import { expect, Locator, Page } from '@playwright/test';
import { ContractActionsMenu } from './components/contract-actions-menu';
import { ContractBlock } from './components/contract-block';

export class ContractDetailsPage {
  constructor(private readonly page: Page) {}

  async goto(id: string): Promise<void> {
    await this.page.goto(`/contracts/${id}`);
  }

  block(title: string): ContractBlock {
    return new ContractBlock(this.locateBlock(title));
  }

  async enterBlockEdit(title: string): Promise<void> {
    await this.block(title).enterEdit();
  }

  async expectClosedContractReadOnly(
    blockTitle: string,
    fieldLabel: string,
    fieldIndex: number = 0
  ): Promise<void> {
    await this.block(blockTitle).field(fieldLabel, fieldIndex).expectReadOnly();
  }

  async expectDependentFieldReadOnly(
    blockTitle: string,
    triggerFieldLabel: string,
    triggerValue: string,
    targetFieldLabel: string
  ): Promise<void> {
    const block = this.block(blockTitle);
    await block.field(triggerFieldLabel).fill(triggerValue);
    await block.field(targetFieldLabel).expectReadOnly();
  }

  async expectOpened(id: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`/contracts/${id}(?:/)?$`));
  }

  async openActionsMenu(): Promise<ContractActionsMenu> {
    const bySelector = this.page
      .locator(
        '[data-testid*="actions"], button[aria-haspopup="menu"], [aria-label*="действ"], [aria-label*="more"]'
      )
      .first();

    if ((await bySelector.count()) > 0) {
      await bySelector.click();
      return new ContractActionsMenu(this.page);
    }

    const byName = this.page
      .getByRole('button', { name: /действ|ещ|more|menu|меню/i })
      .first();

    if ((await byName.count()) > 0) {
      await byName.click();
      return new ContractActionsMenu(this.page);
    }

    await this.page.getByRole('button').last().click();
    return new ContractActionsMenu(this.page);
  }

  getPage(): Page {
    return this.page;
  }

  private locateBlock(title: string): Locator {
    const heading = this.page.getByRole('heading', { name: title, exact: true }).first();
    return heading.locator('xpath=ancestor::*[self::section or self::article or self::div][1]');
  }
}
