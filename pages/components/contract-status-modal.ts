import { expect, Locator, Page } from '@playwright/test';

export type StatusAction = 'block' | 'unblock' | 'close';

const ACTION_UI: Record<StatusAction, { title: string; confirmButton: string }> = {
  block: {
    title: 'Блокировка договора',
    confirmButton: 'Заблокировать'
  },
  unblock: {
    title: 'Разблокировка договора',
    confirmButton: 'Разблокировать'
  },
  close: {
    title: 'Закрытие договора',
    confirmButton: 'Закрыть'
  }
};

export class ContractStatusModal {
  readonly root: Locator;
  readonly title: Locator;
  readonly reasonField: Locator;
  readonly dateField: Locator;
  readonly commentField: Locator;

  constructor(private readonly page: Page) {
    this.root = page
      .locator(
        'xpath=(//*[(@role="dialog" or contains(@class,"modal")) and .//*[contains(.,"договора")]])[last()]'
      )
      .first();
    this.title = this.root.locator(
      'xpath=.//*[self::h1 or self::h2 or self::h3 or @role="heading"][1]'
    );
    this.reasonField = this.root
      .locator(
        'xpath=(.//label[contains(normalize-space(),"Причина")]/following::*[self::select or self::input or @role="combobox"][1] | .//*[@name="reason" or @id="reason" or contains(@data-testid,"reason")])[1]'
      )
      .first();
    this.dateField = this.root
      .locator(
        'xpath=(.//label[contains(normalize-space(),"Дата")]/following::*[self::input or @role="textbox"][1] | .//*[@name="date" or @id="date" or contains(@data-testid,"date")])[1]'
      )
      .first();
    this.commentField = this.root
      .locator(
        'xpath=(.//label[contains(normalize-space(),"Комментар") or contains(normalize-space(),"Описание")]/following::*[self::textarea or self::input][1] | .//textarea)[1]'
      )
      .first();
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  async expectTitle(title: string | RegExp): Promise<void> {
    await expect(this.title).toContainText(title);
  }

  confirmButton(action: StatusAction): Locator {
    return this.root.getByRole('button', { name: ACTION_UI[action].confirmButton, exact: true });
  }

  async expectForAction(action: StatusAction): Promise<void> {
    await this.expectVisible();
    await expect(this.title).toContainText(ACTION_UI[action].title);
    await expect(this.confirmButton(action)).toBeVisible();
  }

  async selectReason(reason: string): Promise<void> {
    await expect(this.reasonField).toBeVisible();
    const tag = await this.reasonField.evaluate(element => element.tagName.toLowerCase());

    if (tag === 'select') {
      await this.reasonField.selectOption({ label: reason }).catch(async () => {
        await this.reasonField.selectOption(reason);
      });
      return;
    }

    await this.reasonField.click();
    await this.page
      .locator(`xpath=(//*[self::*[@role="option"] or self::li][contains(normalize-space(),"${reason}")])[1]`)
      .click();
  }

  async fillComment(value: string): Promise<void> {
    await expect(this.commentField).toBeVisible();
    await this.commentField.fill(value);
  }

  async setDate(value: string): Promise<void> {
    await expect(this.dateField).toBeVisible();
    await this.dateField.fill(value);
  }

  async clickConfirm(name: string | RegExp = /Заблокировать|Разблокировать|Закрыть/i): Promise<void> {
    await this.root.getByRole('button', { name }).click();
  }

  async clickConfirmAction(action: StatusAction): Promise<void> {
    await this.confirmButton(action).click();
  }

  async clickCancel(): Promise<void> {
    await this.root.getByRole('button', { name: /Отмена|Отменить|Cancel/i }).click();
  }

  async expectCommentRequiredError(): Promise<void> {
    await expect(
      this.root.locator(
        'xpath=.//*[contains(translate(normalize-space(.),"ОБЯЗАТЕЛЬНО","обязательно"),"обязател")]'
      )
    ).toBeVisible();
  }
}
