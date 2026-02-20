import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL ?? 'http://localhost:4173';
const storageStatePath = '.auth/state.json';
const slowMoMs = Number(process.env.SLOW_MO_MS ?? 1000);

export default defineConfig({
  testDir: './tests',
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL,
    headless: false,
    launchOptions: {
      slowMo: slowMoMs
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    timezoneId: 'Europe/Berlin'
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: storageStatePath
      },
      testIgnore: /auth\.setup\.ts/,
      dependencies: ['setup']
    }
  ]
});
