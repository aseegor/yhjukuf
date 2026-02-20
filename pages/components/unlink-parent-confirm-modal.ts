import { expect, Locator, Page } from '@playwright/test';

export class UnlinkParentConfirmModal {
  readonly root: Locator;

  constructor(private readonly page: Page) {
    this.root = page
      .locator('xpath=(//*[@role="dialog" or contains(@class,"modal")][.//*[contains(normalize-space(),"Удал") and contains(normalize-space(),"связ")]])[last()]')
      .first();
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  async confirm(): Promise<void> {
    await this.root.getByRole('button', { name: /Удалить|Подтвердить|Да/i }).first().click();
  }

  async cancel(): Promise<void> {
    await this.root.getByRole('button', { name: /Отмена|Cancel|Нет/i }).first().click();
  }
}
