import { Locator, Page } from '@playwright/test';

export class OptionalModal {
  constructor(private readonly page: Page) {}

  async closeIfPresent(): Promise<void> {
    const dialog = this.page.getByRole('dialog').first();
    const isVisible = await dialog.isVisible({ timeout: 700 }).catch(() => false);
    if (!isVisible) {
      return;
    }

    const closeButton = this.pickCloseButton(dialog);
    const hasCloseButton = (await closeButton.count()) > 0;
    if (hasCloseButton) {
      await closeButton.first().click();
      return;
    }

    await this.page.keyboard.press('Escape').catch(() => undefined);
  }

  private pickCloseButton(dialog: Locator): Locator {
    return dialog.getByRole('button', {
      name: /^(закрыть|close|ok|ок|понятно|принять)$/i
    });
  }
}
