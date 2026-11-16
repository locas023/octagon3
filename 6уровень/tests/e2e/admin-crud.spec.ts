import {test,expect} from '@playwright/test'
test('admin creates, edits and deletes a category through the UI',async({page})=>{
 await page.goto('/login');await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true')
 await page.getByLabel('Электронная почта').fill('admin@workflow.demo');await page.getByLabel('Пароль').fill('WorkflowDemo2026!');await page.getByRole('button',{name:'Войти',exact:true}).click();await expect(page).toHaveURL(/dashboard/)
 await page.goto('/admin/categories');await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true')
 const title=`UI category ${crypto.randomUUID()}`
 const input=page.getByRole('textbox',{name:'Название / имя',exact:true})
 await input.fill(title);await page.getByRole('button',{name:'Сохранить',exact:true}).click()
 const entry=page.getByRole('article').filter({has:page.getByRole('heading',{name:title,exact:true})})
 await expect(entry).toBeVisible();await entry.getByRole('button',{name:`Изменить ${title}`,exact:true}).click()
 await input.fill(title+' changed');await page.getByRole('button',{name:'Сохранить',exact:true}).click()
 const updated=page.getByRole('article').filter({has:page.getByRole('heading',{name:title+' changed',exact:true})})
 await expect(updated).toBeVisible();await updated.getByRole('button',{name:`Удалить ${title} changed`,exact:true}).click()
 await page.getByRole('dialog').getByRole('button',{name:'Подтвердить удаление'}).click()
 await expect(updated).toHaveCount(0)
})
