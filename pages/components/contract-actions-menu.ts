import { Locator, Page } from '@playwright/test';

export class ContractActionsMenu {
  constructor(private readonly page: Page) {}

  get root(): Locator {
    return this.page.getByRole('menu').last();
  }

  async clickItem(name: string | RegExp): Promise<void> {
    await this.root.getByRole('menuitem', { name }).click();
  }

  async clickEdit(): Promise<void> {
    await this.clickItem(/редакт|edit/i);
  }

  async clickViewChangeHistory(): Promise<void> {
    await this.clickItem(/Посмотреть историю изменений/i);
  }

  async clickCreateRelatedAgreement(): Promise<void> {
    await this.clickItem(/Создать связанное соглашение/i);
  }

  async clickLinkAgreement(): Promise<void> {
    await this.clickItem(/Связать соглашение/i);
  }

  async clickCreateAddendum(): Promise<void> {
    await this.clickItem(/Создать доп\\.? соглашение/i);
  }

  async clickUnlinkFromParentAgreement(): Promise<void> {
    await this.clickItem(/Удалить связь с родительским соглашением/i);
  }

  async clickViewActualVersion(): Promise<void> {
    await this.clickItem(/Посмотреть актуальную версию/i);
  }
}
