import {test,expect} from '@playwright/test'
test('profile is server-backed and profile logout revokes access',async({page})=>{
 await page.goto('/login');await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true')
 await page.getByLabel('Электронная почта').fill('operator@workflow.demo');await page.getByLabel('Пароль').fill('WorkflowDemo2026!');await page.getByRole('button',{name:'Войти',exact:true}).click();await expect(page).toHaveURL(/dashboard/)
 await page.goto('/profile');await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true')
 const name=page.getByRole('textbox',{name:'Имя',exact:true}),original=await name.inputValue()
 await name.fill(original+' Test');await page.getByRole('button',{name:'Сохранить изменения'}).click();await expect(page.getByText('Изменения сохранены',{exact:true})).toBeVisible()
 await page.reload();await expect(name).toHaveValue(original+' Test');await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true')
 await name.fill(original);await page.getByRole('button',{name:'Сохранить изменения'}).click();await expect(page.getByText('Изменения сохранены',{exact:true})).toBeVisible()
 const logout=page.getByRole('button',{name:/Выйти/})
 await logout.click();await expect(page).toHaveURL(/login/)
 expect((await page.request.get('/api/auth/me')).status()).toBe(401)
})
