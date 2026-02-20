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

  private async resolveControl(): Promise<Locator> {
    const control = this.control;
    if ((await control.count()) === 0) {
      throw new Error(
        `Field "${this.label}" with index ${this.index} was not found in the current block.`
      );
    }
    return control;
  }

  async fill(value: string): Promise<void> {
    const control = await this.resolveControl();
    await expect(control).toBeVisible();
    await control.fill(value);
  }

  async select(value: string): Promise<void> {
    const control = await this.resolveControl();
    await expect(control).toBeVisible();
    await control.selectOption({ label: value }).catch(async () => {
      await control.selectOption(value);
    });
  }

  async check(): Promise<void> {
    const control = await this.resolveControl();
    await expect(control).toBeVisible();
    await control.check();
  }

  async uncheck(): Promise<void> {
    const control = await this.resolveControl();
    await expect(control).toBeVisible();
    await control.uncheck();
  }

  async click(): Promise<void> {
    const control = await this.resolveControl();
    await expect(control).toBeVisible();
    await control.click();
  }

  async expectVisible(): Promise<void> {
    const control = await this.resolveControl();
    await expect(control).toBeVisible();
  }

  async expectHidden(): Promise<void> {
    const control = this.control;
    if ((await control.count()) === 0) {
      return;
    }
    await expect(control).toBeHidden();
  }

  async expectValue(value: string): Promise<void> {
    const control = await this.resolveControl();
    await expect(control).toHaveValue(value);
  }

  async expectReadOnly(): Promise<void> {
    const control = await this.resolveControl();
    const isDisabled = await control.isDisabled();
    const readOnlyAttr = await control.getAttribute('readonly');
    expect(
      isDisabled || readOnlyAttr !== null,
      `Field "${this.label}" with index ${this.index} is expected to be read-only.`
    ).toBeTruthy();
  }

  async expectEditable(): Promise<void> {
    const control = await this.resolveControl();
    await expect(control).toBeEnabled();
    const readOnlyAttr = await control.getAttribute('readonly');
    expect(
      readOnlyAttr,
      `Field "${this.label}" with index ${this.index} is expected to be editable.`
    ).toBeNull();
  }
}
