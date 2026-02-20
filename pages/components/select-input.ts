import { Locator, Page } from '@playwright/test';

export class SelectInput {
  constructor(
    private readonly page: Page,
    private readonly label: string | RegExp,
    private readonly container?: Locator
  ) {}

  private get field(): Locator {
    if (this.container) {
      return this.container.getByLabel(this.label).first();
    }

    return this.page.getByLabel(this.label).first();
  }

  async selectDropdownOption(value: string): Promise<void> {
    const tagName = await this.field.evaluate(element => element.tagName.toLowerCase());

    if (tagName === 'select') {
      await this.field.selectOption({ label: value }).catch(async () => {
        await this.field.selectOption(value);
      });
      return;
    }

    await this.field.click();
    await this.page.getByRole('option', { name: value, exact: true }).first().click();
  }
}
