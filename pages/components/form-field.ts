import { expect, Locator } from '@playwright/test';

export class FormField {
  constructor(
    private readonly container: Locator,
    private readonly label: string,
    private readonly index: number = 0
  ) {}

  private get control(): Locator {
    return this.container.getByLabel(this.label, { exact: true }).nth(this.index);
  }

  async fill(value: string): Promise<void> {
    await this.control.fill(value);
  }

  async select(value: string): Promise<void> {
    await this.control.selectOption({ label: value }).catch(async () => {
      await this.control.selectOption(value);
    });
  }

  async check(): Promise<void> {
    await this.control.check();
  }

  async uncheck(): Promise<void> {
    await this.control.uncheck();
  }

  async click(): Promise<void> {
    await this.control.click();
  }

  async expectVisible(): Promise<void> {
    await expect(this.control).toBeVisible();
  }

  async expectHidden(): Promise<void> {
    await expect(this.control).toBeHidden();
  }

  async expectValue(value: string): Promise<void> {
    await expect(this.control).toHaveValue(value);
  }

  async expectReadOnly(): Promise<void> {
    const isDisabled = await this.control.isDisabled();
    const readOnlyAttr = await this.control.getAttribute('readonly');
    expect(isDisabled || readOnlyAttr !== null).toBeTruthy();
  }

  async expectEditable(): Promise<void> {
    await expect(this.control).toBeEnabled();
    const readOnlyAttr = await this.control.getAttribute('readonly');
    expect(readOnlyAttr).toBeNull();
  }
}
