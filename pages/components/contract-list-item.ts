import { Locator, Page } from '@playwright/test';
import { ContractActionsMenu } from './contract-actions-menu';

const ITEM_NUMBER_SELECTOR =
  '[data-testid*="number"], [data-field="number"], [aria-label*="Номер"], .contract-number';
const ITEM_STATUS_SELECTOR =
  '[data-testid*="status"], [data-field="status"], [aria-label*="Статус"], .contract-status';
const ITEM_DATE_SELECTOR =
  '[data-testid*="date"], [data-field="date"], [aria-label*="Дата"], .contract-date';
const ITEM_ACTIONS_BUTTON_SELECTOR =
  '[data-testid*="actions"], button[aria-haspopup="menu"], [aria-label*="действ"], [aria-label*="more"]';
const ITEM_EXPAND_BUTTON_SELECTOR =
  '[data-testid*="expand"], [aria-label*="дочер"], [aria-label*="expand"], button[aria-expanded]';
const ITEM_CHILDREN_CONTAINER_SELECTOR =
  '[data-testid*="children"], .contract-children, [data-contract-children]';
const LIST_ITEM_SELECTOR =
  '[data-testid^="contracts.item."], [data-testid^="contract.item."], [role="listitem"], .contract-list-item';

export class ContractListItem {
  constructor(
    private readonly page: Page,
    readonly root: Locator
  ) {}

  number(): Locator {
    return this.root.locator(ITEM_NUMBER_SELECTOR).first();
  }

  status(): Locator {
    return this.root.locator(ITEM_STATUS_SELECTOR).first();
  }

  signDate(): Locator {
    return this.root.locator(ITEM_DATE_SELECTOR).first();
  }

  async getNumberText(): Promise<string> {
    return (await this.number().innerText()).trim();
  }

  async getStatusText(): Promise<string> {
    return (await this.status().innerText()).trim();
  }

  async getSignDateText(): Promise<string> {
    return (await this.signDate().innerText()).trim();
  }

  async openActionsMenu(): Promise<ContractActionsMenu> {
    const button = await this.findActionsButton();
    await button.click();
    return new ContractActionsMenu(this.page);
  }

  async expandChildren(): Promise<void> {
    const toggle = await this.findExpandButton();
    if (toggle) {
      await toggle.click();
    }
  }

  async collapseChildren(): Promise<void> {
    const toggle = await this.findExpandButton();
    if (toggle) {
      await toggle.click();
    }
  }

  async childItems(): Promise<ContractListItem[]> {
    const childrenContainer = this.root.locator(ITEM_CHILDREN_CONTAINER_SELECTOR).first();
    const hasContainer = (await childrenContainer.count()) > 0;
    if (!hasContainer) {
      return [];
    }

    const locators = childrenContainer.locator(LIST_ITEM_SELECTOR);
    const count = await locators.count();
    const items: ContractListItem[] = [];

    for (let i = 0; i < count; i += 1) {
      items.push(new ContractListItem(this.page, locators.nth(i)));
    }

    return items;
  }

  async findChildByNumber(contractNumber: string): Promise<ContractListItem | null> {
    const childrenContainer = this.root.locator(ITEM_CHILDREN_CONTAINER_SELECTOR).first();
    const hasContainer = (await childrenContainer.count()) > 0;
    if (!hasContainer) {
      return null;
    }

    const child = childrenContainer
      .locator(LIST_ITEM_SELECTOR)
      .filter({ hasText: contractNumber })
      .first();

    if ((await child.count()) === 0) {
      return null;
    }

    return new ContractListItem(this.page, child);
  }

  private async findActionsButton(): Promise<Locator> {
    const bySelector = this.root.locator(ITEM_ACTIONS_BUTTON_SELECTOR).first();
    if ((await bySelector.count()) > 0) {
      return bySelector;
    }

    const byName = this.root
      .getByRole('button', { name: /действ|ещ|more|menu|меню/i })
      .first();

    if ((await byName.count()) > 0) {
      return byName;
    }

    return this.root.getByRole('button').last();
  }

  private async findExpandButton(): Promise<Locator | null> {
    const bySelector = this.root.locator(ITEM_EXPAND_BUTTON_SELECTOR).first();
    if ((await bySelector.count()) > 0) {
      return bySelector;
    }

    const byName = this.root
      .getByRole('button', { name: /дочер|развер|expand|show/i })
      .first();

    if ((await byName.count()) > 0) {
      return byName;
    }

    return null;
  }
}
