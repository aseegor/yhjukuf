import { expect, Locator, Page } from '@playwright/test';

export class ContractPage {
  readonly status: Locator;
  readonly blockDate: Locator;
  readonly save: Locator;
  readonly modalConfirm: Locator;
  readonly modalConfirmOk: Locator;
  readonly toast: Locator;

  constructor(private readonly page: Page) {
    this.status = page.getByTestId('contract.status');
    this.blockDate = page.getByTestId('contract.blockDate');
    this.save = page.getByTestId('contract.save');
    this.modalConfirm = page.getByTestId('modal.confirm');
    this.modalConfirmOk = page.getByTestId('modal.confirm.ok');
    this.toast = page.getByTestId('contract.toast');
  }

  async goto(id: string): Promise<void> {
    await this.page.goto(`/contracts/${id}`);
  }

  async setStatus(value: string): Promise<void> {
    const tagName = await this.status.evaluate((element: Element) =>
      element.tagName.toLowerCase()
    );

    if (tagName === 'select') {
      await this.status.selectOption({ label: value }).catch(async () => {
        await this.status.selectOption(value);
      });
      return;
    }

    await this.status.fill(value);
  }

  async saveAndConfirm(): Promise<void> {
    await this.save.click();
    await expect(this.modalConfirm).toBeVisible();
    await this.modalConfirmOk.click();
  }
}
