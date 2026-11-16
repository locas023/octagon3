import { test, expect } from '@playwright/test'

test('login waits for hydration when application scripts are delayed', async ({ page }) => {
  let release!: () => void
  const scripts = new Promise<void>(resolve => { release = resolve })
  await page.route('**/_nuxt/*.js', async route => { await scripts; await route.continue() })
  try {
    await page.goto('/login', { waitUntil: 'commit' })
    await expect(page.getByLabel('Электронная почта')).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Войти', exact: true })).toBeDisabled()
  } finally { release() }
  await page.waitForFunction(() => document.documentElement.dataset.appReady === 'true')
  await page.getByLabel('Электронная почта').fill('operator@workflow.demo')
  await page.getByLabel('Пароль').fill('WorkflowDemo2026!')
  const response = page.waitForResponse(r => r.url().endsWith('/api/auth/login') && r.request().method() === 'POST')
  await page.getByRole('button', { name: 'Войти', exact: true }).click()
  expect((await response).status()).toBe(200)
  await expect(page).toHaveURL(/dashboard/)
})
