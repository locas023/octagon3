import { test, expect } from '@playwright/test'
test('login → create → assign → status → comment → logout', async ({page})=>{
 await page.goto('/login')
 await page.waitForFunction(() => document.documentElement.dataset.appReady === 'true')
 await page.getByLabel('Электронная почта').fill('operator@workflow.demo')
 await page.getByLabel('Пароль').fill('WorkflowDemo2026!')
 await page.getByRole('button',{name:'Войти',exact:true}).click()
  await page.getByRole('link',{name:'Заявки',exact:true}).first().click()
 await page.getByRole('link',{name:'Создать заявку',exact:true}).first().click()
 await page.getByLabel('Тема').fill('E2E заявка')
 await page.getByRole('button',{name:'Создать заявку',exact:true}).click()
 await page.getByRole('combobox',{name:'Исполнитель',exact:true}).selectOption('agent')
 await expect(page.getByRole('status',{name:'Сохранение заявки'})).toContainText('сохранено')
 await page.getByRole('combobox',{name:'Статус',exact:true}).selectOption('assigned')
 await expect(page.getByRole('status',{name:'Сохранение заявки'})).toContainText('сохранено')
 await page.getByLabel('Комментарий',{exact:true}).fill('Проверено E2E')
 await page.getByRole('button',{name:'Отправить',exact:true}).click()
 await expect(page.getByText('Проверено E2E', {exact:true})).toBeVisible()
  await page.getByRole('link',{name:'Профиль',exact:true}).click()
  await page.getByRole('button',{name:/Выйти/}).click()
 await expect(page).toHaveURL(/login/)
 await page.goto('/requests'); await expect(page).toHaveURL(/login/)
})






