import { expect, Page } from '@playwright/test';

export class ContractActualVersionPage {
  constructor(private readonly page: Page) {}

  async expectOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/\/contracts\/\d+\/actual(?:\/)?(?:\?.*)?$/);
  }
}
