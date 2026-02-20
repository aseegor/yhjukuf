# Проверка Request/Response в Playwright

Ниже примеры для кейса:
- страница: `http://localhost:4173/contracts/1`
- действие: клик по `data-testid="contract.save"`
- запрос: `POST http://localhost:4173/api/pseudo-click`

## 1) Базовый шаблон: поймать и запрос, и ответ
```ts
import { expect, test } from '@playwright/test';

test('capture request and response', async ({ page }) => {
  await page.goto('http://localhost:4173/contracts/1');

  const [request, response] = await Promise.all([
    page.waitForRequest(
      r => r.url() === 'http://localhost:4173/api/pseudo-click' && r.method() === 'POST'
    ),
    page.waitForResponse(
      r => r.url() === 'http://localhost:4173/api/pseudo-click' && r.request().method() === 'POST'
    ),
    page.getByTestId('contract.save').click(),
  ]);

  expect(response.ok()).toBeTruthy();
});
```

## 2) Частичное сравнение тела запроса (рекомендуется)
```ts
const reqBody = request.postDataJSON() as Record<string, unknown>;

expect(reqBody).toMatchObject({
  path: '/contracts/1',
  testId: 'contract.save',
  text: 'Сохранить',
});
expect(typeof reqBody.ts).toBe('number');
```

## 3) Полное сравнение тела запроса (строго)
```ts
expect(request.postDataJSON()).toEqual({
  path: '/contracts/1',
  testId: 'contract.save',
  text: 'Сохранить',
  ts: expect.any(Number),
});
```

## 4) Проверка ответа (частично + статус)
```ts
expect(response.status()).toBe(200);
expect(response.ok()).toBeTruthy();

const resBody = (await response.json()) as Record<string, unknown>;
expect(resBody).toMatchObject({
  ok: true,
  received: {
    path: '/contracts/1',
    testId: 'contract.save',
    text: 'Сохранить',
  },
});
```

## 5) Сверка request и response между собой
```ts
const reqBody = request.postDataJSON() as {
  path: string;
  testId: string;
  text: string;
  ts: number;
};
const resBody = (await response.json()) as {
  ok: boolean;
  received: { path: string; testId: string; text: string; ts: number };
};

expect(resBody.ok).toBe(true);
expect(resBody.received.path).toBe(reqBody.path);
expect(resBody.received.testId).toBe(reqBody.testId);
expect(resBody.received.text).toBe(reqBody.text);
expect(resBody.received.ts).toBe(reqBody.ts);
```

## 6) Полный рабочий пример теста
```ts
import { expect, test } from '@playwright/test';

test('validate pseudo-click request and response', async ({ page }) => {
  await page.goto('http://localhost:4173/contracts/1');

  const [request, response] = await Promise.all([
    page.waitForRequest(
      r => r.url() === 'http://localhost:4173/api/pseudo-click' && r.method() === 'POST'
    ),
    page.waitForResponse(
      r => r.url() === 'http://localhost:4173/api/pseudo-click' && r.request().method() === 'POST'
    ),
    page.getByTestId('contract.save').click(),
  ]);

  const reqBody = request.postDataJSON() as {
    path: string;
    testId: string;
    text: string;
    ts: number;
  };
  expect(reqBody).toMatchObject({
    path: '/contracts/1',
    testId: 'contract.save',
    text: 'Сохранить',
  });
  expect(typeof reqBody.ts).toBe('number');

  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();

  const resBody = (await response.json()) as {
    ok: boolean;
    received: { path: string; testId: string; text: string; ts: number };
  };
  expect(resBody.ok).toBe(true);
  expect(resBody.received.path).toBe(reqBody.path);
  expect(resBody.received.testId).toBe(reqBody.testId);
  expect(resBody.received.text).toBe(reqBody.text);
  expect(resBody.received.ts).toBe(reqBody.ts);
});
```

## Важно
- `as { ... }` не валидирует данные в рантайме, это только подсказка TypeScript.
- Реальные проверки делают только `expect(...)`.
