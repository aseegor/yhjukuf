import { expect, Locator, Page } from '@playwright/test';

export class ChangeHistorySidebar {
  readonly root: Locator;

  constructor(private readonly page: Page) {
    this.root = page
      .locator('xpath=(//*[@role="dialog" or contains(@class,"sidebar")][.//*[contains(normalize-space(),"История")]])[last()]')
      .first();
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  async close(): Promise<void> {
    await this.root.getByRole('button', { name: /Закрыть|Close|×/i }).first().click();
  }
}
