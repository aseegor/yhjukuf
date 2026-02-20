import { expect, Page } from '@playwright/test';

export class RelatedAgreementCreatePage {
  constructor(private readonly page: Page) {}

  async expectOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/\/agreem\/create\/parent(?:\/)?(?:\?.*)?$/);
  }
}
