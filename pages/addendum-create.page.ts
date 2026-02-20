import { expect, Page } from '@playwright/test';

export class AddendumCreatePage {
  constructor(private readonly page: Page) {}

  async expectOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/\/agreem\/create\/addendum(?:\/)?(?:\?.*)?$/);
  }
}
