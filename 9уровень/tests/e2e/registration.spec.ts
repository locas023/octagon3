import { test, expect } from '@playwright/test'

test('client registers, signs in, and cannot self-register as admin', async ({ page, request }) => {
  const email = `browser-${crypto.randomUUID()}@workflow.demo`
  await page.goto('/register')
  await page.waitForFunction(() => document.documentElement.dataset.appReady === 'true')
  await page.getByRole('textbox', { name: 'Имя', exact: true }).fill('Демо клиент')
  await page.getByRole('textbox', { name: 'Компания', exact: true }).fill('Учебная компания')
  await page.getByLabel('Электронная почта').fill(email)
  await page.getByLabel('Пароль').fill('TestWorkflow2026!')
  await page.getByRole('button', { name: 'Зарегистрироваться', exact: true }).click()
  await expect(page).toHaveURL(/login\?registered=1/)
  await page.getByLabel('Электронная почта').fill(email)
  await page.getByLabel('Пароль').fill('TestWorkflow2026!')
  await page.getByRole('button', { name: 'Войти', exact: true }).click()
  await expect(page).toHaveURL(/dashboard/)
  const injected = await request.post('/api/auth/register', { data: { name: 'Demo user', company: 'Demo company', email: `injected-${crypto.randomUUID()}@workflow.demo`, password: 'TestWorkflow2026!', role: 'admin' } })
  expect(injected.status()).toBe(422)
})

