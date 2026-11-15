import { test, expect } from '@playwright/test'

test('notification read state survives reload and can be cleared', async ({ page }) => {
  await page.goto('/login')
  await page.waitForFunction(() => document.documentElement.dataset.appReady === 'true')
  await page.getByLabel('Электронная почта').fill('admin@workflow.demo')
  await page.getByLabel('Пароль').fill('WorkflowDemo2026!')
  await page.getByRole('button', { name: 'Войти', exact: true }).click()
  await expect(page).toHaveURL(/dashboard/)
  const created = await page.request.post('/api/requests', { data: { title: 'Notification browser test' } })
  expect(created.status()).toBe(201)
  const { id } = await created.json()
  for (const status of ['assigned', 'in_progress']) {
    const response = await page.request.patch(`/api/requests/${id}`, { data: { status, ...(status === 'assigned' ? { assigneeId: 'agent' } : {}) } })
    expect(response.status()).toBe(200)
  }
  const reason = `browser-${crypto.randomUUID()}`
  expect((await page.request.patch(`/api/requests/${id}`, { data: { status: 'escalated', reason } })).status()).toBe(200)
  await page.goto('/notifications')
  await page.waitForFunction(() => document.documentElement.dataset.appReady === 'true')
  const notice = page.getByRole('article').filter({ hasText: reason })
  await notice.getByRole('button', { name: 'Отметить прочитанным', exact: true }).click()
  await expect(notice.getByRole('button', { name: 'Отметить непрочитанным', exact: true })).toBeVisible()
  await page.reload()
  await page.waitForFunction(() => document.documentElement.dataset.appReady === 'true')
  await notice.getByRole('button', { name: 'Отметить непрочитанным', exact: true }).click()
  await expect(notice.getByRole('button', { name: 'Отметить прочитанным', exact: true })).toBeVisible()
})
