import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly title: Locator;

  constructor(private readonly page: Page) {
    this.username = page.getByTestId('login.username');
    this.password = page.getByTestId('login.password');
    this.submit = page.getByTestId('login.submit');
    this.title = page.getByTestId('login.title');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }
}
