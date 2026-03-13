import { expect, Locator, Page } from '@playwright/test';

export class ContactTypeMenu {
  readonly root: Locator;

  constructor(private readonly page: Page) {
    this.root = page
      .locator(
        'xpath=(//*[@role="menu" or @role="listbox" or contains(@class,"options") or contains(@class,"dropdown")])[last()]'
      )
      .first();
  }

  async select(typeName: string): Promise<void> {
    await expect(this.root).toBeVisible();
    await this.root.getByText(typeName, { exact: true }).first().click();
  }
}
