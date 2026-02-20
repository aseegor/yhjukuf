import { expect, Page } from '@playwright/test';

export async function interceptAndAssertRequestBody(
  page: Page,
  urlPattern: string | RegExp,
  expectedBody: Record<string, unknown>,
  options?: { status?: number; body?: string; contentType?: string }
): Promise<{ getActualBody: () => unknown | undefined }> {
  let actualBody: unknown;

  await page.route(urlPattern, async route => {
    actualBody = route.request().postDataJSON();
    expect(actualBody as Record<string, unknown>).toMatchObject(expectedBody);

    await route.fulfill({
      status: options?.status ?? 200,
      contentType: options?.contentType ?? 'application/json',
      body: options?.body ?? '{}'
    });
  });

  return {
    getActualBody: () => actualBody
  };
}
