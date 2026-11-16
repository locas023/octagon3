import {test,expect} from '@playwright/test'
async function signIn(page:import('@playwright/test').Page){await page.goto('/login');await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true');await page.getByLabel('Электронная почта').fill('operator@workflow.demo');await page.getByLabel('Пароль').fill('WorkflowDemo2026!');await page.getByRole('button',{name:'Войти',exact:true}).click();await expect(page).toHaveURL(/dashboard/)}
test('URL filters survive refresh and latest search wins',async({page})=>{
 await signIn(page)
 await page.goto('/requests?q=CRM&sort=oldest')
 await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true')
 const search=page.getByRole('searchbox').first()
 await expect(search).toHaveValue('CRM')
 await page.reload();await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true');await expect(search).toHaveValue('CRM')
 await page.route('**/api/requests?**',async route=>{const url=new URL(route.request().url());if(url.searchParams.get('q')==='slow-query'){await new Promise(resolve=>setTimeout(resolve,900))}await route.continue()})
 await Promise.all([page.waitForRequest(request=>request.url().includes('q=slow-query')),search.fill('slow-query')])
 await search.fill('CRM')
 await expect(page).toHaveURL(/q=CRM/)
 await expect(page.getByRole('link',{name:'Не работает доступ к CRM',exact:true})).toBeVisible()
 await expect(search).toHaveValue('CRM')
})
test('profile density survives refresh',async({page})=>{
 await signIn(page);await page.goto('/profile')
 await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true')
 await page.getByLabel('Плотность списка').selectOption('compact')
 await page.waitForFunction(()=>localStorage.getItem('workflow-density')==='compact')
 await page.reload();await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true');await expect(page.getByLabel('Плотность списка')).toHaveValue('compact')
})
