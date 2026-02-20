# Playwright Test (TypeScript) - Smoke-тесты mock frontend

## Требования
- Установлены Node.js и npm
- Mock frontend запущен на `http://localhost:4173`
  - Можно переопределить через `BASE_URL`, например: `BASE_URL=http://localhost:3000 npm test`

## Установка
```bash
npm i
```

## Установка браузеров
```bash
npx playwright install
```

## Запуск тестов (headed по умолчанию)
```bash
npm test
# или
npx playwright test
```

## Запуск в serial (без параллельности)
```bash
npm run test:serial
# эквивалент: npx playwright test --workers=1
```

## Глобальная задержка между действиями (slowMo)
- В проекте добавлена настройка `SLOW_MO_MS`.
- По умолчанию: `0` (без задержки).
- Чтобы замедлить выполнение, передай значение в миллисекундах:

```bash
SLOW_MO_MS=300 npm test
SLOW_MO_MS=800 npx playwright test
```

## Организация тестов (папки + теги)
Используй оба подхода вместе:
- Папки для крупных наборов тестов (`tests/smoke`, `tests/regression` и т.д.)
- Теги для поперечной фильтрации (`@smoke`, `@auth`, `@critical` и т.д.)

### Разделение по папкам
- Smoke-тесты хранятся в `tests/smoke/`
- При необходимости добавляй отдельные папки:
  - `tests/regression/`
  - `tests/contracts/`

### Теги в тестах
Пример:
```ts
import { test } from '@playwright/test';

test('T1 Unauthorized redirect to login', { tag: '@smoke' }, async ({ browser }) => {
  // ...
});

test('T2 Authenticated contracts list', { tag: ['@smoke', '@auth'] }, async ({ page }) => {
  // ...
});
```

## Запуск по файлу/папке/тегу
```bash
# все тесты
npx playwright test

# один файл
npx playwright test tests/smoke/auth-redirect.spec.ts

# все тесты в папке
npx playwright test tests/smoke

# по имени теста
npx playwright test -g "T1 Unauthorized redirect to login"

# по тегу
npx playwright test --grep @smoke
npx playwright test --grep @auth

# исключить тег
npx playwright test --grep-invert @slow

# один воркер (serial)
npx playwright test --workers=1
```

## HTML-отчет
- Генерируется в `playwright-report/`
- Открыть отчет вручную после прогона:
```bash
npx playwright show-report
```

## Как работает auth storageState
- `tests/auth.setup.ts` выполняется в проекте `setup`.
- Setup логинится один раз и сохраняет auth state в `.auth/state.json`.
- Основной проект тестов зависит от `setup` и использует `.auth/state.json`.
- Smoke-тесты повторно не логинятся (кроме явного теста на неавторизованного пользователя с чистым контекстом).

## Строгий режим TypeScript
- В `tsconfig.json` включен `"strict": true`.
- Это включает строгую проверку типов (в том числе запрет неявного `any`) и помогает раньше находить ошибки.
