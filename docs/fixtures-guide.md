# Как расширять фикстуры в проекте

## 1) Куда добавлять
- Page Object для новой страницы: `pages/*.ts`
- Общие фикстуры для тестов: `tests/fixtures.ts`

## 2) Что делать при добавлении новой страницы
1. Создай новый POM, например `pages/users.page.ts`.
2. Импортируй его в `tests/fixtures.ts`.
3. Добавь поле в тип `AppFixtures`.
4. Добавь реализацию в `base.extend(...)`.

Пример:

```ts
// tests/fixtures.ts
import { test as base } from '@playwright/test';
import { UsersPage } from '../pages/users.page';

type AppFixtures = {
  usersPage: UsersPage;
};

export const test = base.extend<AppFixtures>({
  usersPage: async ({ page }, use) => {
    await use(new UsersPage(page));
  },
});
```

## 3) Как вызывать в тестах
- Импортируй `test`/`expect` из `tests/fixtures.ts`, а не из `@playwright/test`.
- Получай нужный POM через аргументы теста.

```ts
import { test, expect } from '../fixtures';

test('users list', async ({ usersPage }) => {
  await usersPage.goto();
  await usersPage.expectLoaded();
});
```

## 4) Зачем это нужно
- Убирает дублирование `new SomePage(page)` в каждом тесте.
- Централизует создание Page Object.
- Делает тесты чище и понятнее: по сигнатуре видно, какие страницы используются.

## 5) Как это работает
- `base.extend<AppFixtures>(...)` добавляет твои поля как fixtures Playwright.
- На каждый тест Playwright создает fixture и передает ее в `async ({ ... })`.
- `await use(...)` отдает объект в тест, после завершения теста lifecycle закрывается автоматически.

## 6) Практические правила
- В `fixtures.ts` держи только создание/провайдинг объектов.
- Логику действий оставляй в POM (`pages/*.ts`).
- Если fixture нужна только одной группе тестов, можно сделать локальные fixtures рядом с этой группой.
