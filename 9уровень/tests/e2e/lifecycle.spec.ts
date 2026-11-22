import {test,expect} from '@playwright/test'

test('client rates a resolution; admin archives and restores it with confirmations',async({page})=>{
  // Several role changes and sequential writes also run against the remote Free demo.
  test.setTimeout(90_000)
  const login=async(role:string)=>{expect((await page.request.post('/api/auth/login',{data:{email:`${role}@workflow.demo`,password:'WorkflowDemo2026!'}})).status()).toBe(200)}
  await login('client')
  const title=`Archive UI ${crypto.randomUUID()}`
  const created=await page.request.post('/api/requests',{data:{title}});expect(created.status()).toBe(201)
  const {id}=await created.json(),path=`/requests/${id}`
  await login('operator')
  for(const status of ['assigned','in_progress','resolved'])expect((await page.request.patch('/api'+path,{data:{status,assigneeId:'agent',reason:'Доступ восстановлен'}})).status()).toBe(200)
  await login('client')
  expect((await page.request.patch('/api'+path,{data:{status:'closed',reason:'Работает'}})).status()).toBe(200)
  await page.goto(path);await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true')
  const first=page.getByRole('radio',{name:'Оценка 1 из 5',exact:true})
  await first.focus();await page.keyboard.press('Space')
  for(let i=0;i<4;i++)await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('radio',{name:'Оценка 5 из 5',exact:true})).toBeChecked()
  await page.getByRole('button',{name:'Отправить оценку',exact:true}).click()
  await expect(page.getByText('Ваша оценка: 5 из 5. Спасибо за обратную связь!',{exact:true})).toBeVisible()
  await page.reload();await expect(page.getByText('Ваша оценка: 5 из 5. Спасибо за обратную связь!',{exact:true})).toBeVisible()
  await login('admin');await page.goto(path);await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true')
  await page.getByRole('button',{name:'Архивировать заявку',exact:true}).click()
  await page.getByRole('dialog',{name:'Архивировать заявку?'}).getByRole('button',{name:'Подтвердить архивирование',exact:true}).click()
  await expect(page.getByText('Заявка в архиве. Доступно только чтение.',{exact:true})).toBeVisible()
  await page.goto('/requests?archive=archived&q='+encodeURIComponent(title));await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true')
  await page.getByRole('link',{name:title,exact:true}).first().click()
  await page.getByRole('button',{name:'Восстановить из архива',exact:true}).click()
  await page.getByRole('dialog',{name:'Восстановить заявку?'}).getByRole('button',{name:'Подтвердить восстановление',exact:true}).click()
  await expect(page.getByText('Заявка в архиве. Доступно только чтение.',{exact:true})).toHaveCount(0)
  expect((await page.request.get('/api/requests?q='+encodeURIComponent(title)).then(r=>r.json())).total).toBe(1)
})
