import { expect, Locator, Page } from '@playwright/test';
import { ContractsList } from './components/contracts-list';

export class ContractsPage {
  readonly title: Locator;
  readonly list: Locator;
  readonly item1: Locator;
  readonly contractsList: ContractsList;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('contracts.title');
    this.list = page.getByTestId('contracts.list');
    this.item1 = page.getByTestId('contracts.item.1');
    this.contractsList = new ContractsList(page, this.list);
  }

  async goto(): Promise<void> {
    await this.page.goto('/contracts');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toBeVisible();
    await this.contractsList.expectVisible();
    await expect(this.item1).toBeVisible();
  }

  getPage(): Page {
    return this.page;
  }
}
