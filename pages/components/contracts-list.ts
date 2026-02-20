import { expect, Locator, Page } from '@playwright/test';
import { ContractListItem } from './contract-list-item';

const LIST_ITEM_SELECTOR =
  '[data-testid^="contracts.item."], [data-testid^="contract.item."], [role="listitem"], .contract-list-item';

export class ContractsList {
  constructor(
    private readonly page: Page,
    readonly root: Locator
  ) {}

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  async items(): Promise<ContractListItem[]> {
    const itemLocators = this.root.locator(LIST_ITEM_SELECTOR);
    const count = await itemLocators.count();
    const items: ContractListItem[] = [];

    for (let i = 0; i < count; i += 1) {
      items.push(new ContractListItem(this.page, itemLocators.nth(i)));
    }

    return items;
  }

  async findByNumber(contractNumber: string): Promise<ContractListItem> {
    const item = this.root.locator(LIST_ITEM_SELECTOR).filter({ hasText: contractNumber }).first();
    await expect(item).toBeVisible();
    return new ContractListItem(this.page, item);
  }

  async maybeFindByNumber(contractNumber: string): Promise<ContractListItem | null> {
    const item = this.root.locator(LIST_ITEM_SELECTOR).filter({ hasText: contractNumber }).first();
    if ((await item.count()) === 0) {
      return null;
    }
    return new ContractListItem(this.page, item);
  }
}
