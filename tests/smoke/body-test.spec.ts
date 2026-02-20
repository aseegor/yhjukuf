import { expect, test } from '@playwright/test';

test('check pseudo-click payload and response',{ tag: '@body' }, async ({ page }) => {
  await page.goto('http://localhost:4173/contracts/1');

  const [request, response] = await Promise.all([
    page.waitForRequest(
      req =>
        req.url() === 'http://localhost:4173/api/pseudo-click' &&
        req.method() === 'POST'
    ),
    page.waitForResponse(
      res =>
        res.url() === 'http://localhost:4173/api/pseudo-click' &&
        res.request().method() === 'POST'
    ),
    page.getByTestId('contract.save').click(),
  ]);

//   это вообще не обязятельно
  const reqBody = request.postDataJSON() as {
    path: string;
    testId: string;
    text: string;
    ts: number;
  };
// Проверка тела запроса
  expect(reqBody).toMatchObject({
    path: '/contracts/1',
    testId: 'contract.save',
    text: 'Сохранить',
  });
  expect(typeof reqBody.ts).toBe('number');

  // Проверка ответа
  expect(response.ok()).toBeTruthy();

//   это вообще не обязятельно
  const resBody = (await response.json()) as {
    ok: boolean;
    received: { path: string; testId: string; text: string; ts: number };
  };

  expect(resBody.ok).toBe(true);
  expect(resBody.received).toMatchObject({
    path: '/contracts/1',
    testId: 'contract.save',
    text: 'Сохранить',
  });
  expect(typeof resBody.received.ts).toBe('number');

  // Если нужно строго: ts в ответе должен совпадать с запросом
  expect(resBody.received.ts).toBe(reqBody.ts);
});
