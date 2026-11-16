import {chromium} from '@playwright/test'
import {mkdir,rename} from 'node:fs/promises'
const base=process.env.TEST_URL||'http://127.0.0.1:3019'
await mkdir('docs/demo',{recursive:true})
const browser=await chromium.launch({channel:'msedge'})
const context=await browser.newContext({viewport:{width:1280,height:800},recordVideo:{dir:'docs/demo',size:{width:1280,height:800}}})
const page=await context.newPage()
const pause=()=>page.waitForTimeout(2000)
try{
 for(const path of ['/','/help','/articles/first-request','/faq']){await page.goto(base+path);await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true');await pause()}
 await page.goto(base+'/login');await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true');await page.getByLabel('Электронная почта').fill('operator@workflow.demo');await page.getByLabel('Пароль').fill('WorkflowDemo2026!');await page.getByRole('button',{name:'Войти',exact:true}).click();await page.waitForURL('**/dashboard');await pause()
 await page.goto(base+'/new-request');await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true');await page.getByLabel('Тема').fill('Демонстрация: восстановить доступ к рабочему порталу');await page.getByLabel('Описание').fill('После обновления не открывается портал. Требуется проверка прав доступа.');await pause();await page.getByRole('button',{name:'Создать заявку',exact:true}).click();await page.waitForURL('**/requests/*');await pause()
 await page.getByRole('combobox',{name:'Исполнитель',exact:true}).selectOption('agent');await page.getByRole('status',{name:'Сохранение заявки'}).getByText('Изменение сохранено',{exact:true}).waitFor();await page.getByRole('combobox',{name:'Статус',exact:true}).selectOption('assigned');await page.getByRole('status',{name:'Сохранение заявки'}).getByText('Изменение сохранено',{exact:true}).waitFor();await page.getByLabel('Комментарий',{exact:true}).fill('Исполнитель назначен, проверка доступа начата.');await page.getByRole('button',{name:'Отправить',exact:true}).click();await page.getByText('Комментарий отправлен',{exact:true}).waitFor();await pause()
 await page.goto(base+'/logout');await page.waitForURL('**/login');await page.getByLabel('Электронная почта').fill('admin@workflow.demo');await page.getByLabel('Пароль').fill('WorkflowDemo2026!');await page.getByRole('button',{name:'Войти',exact:true}).click();await page.waitForURL('**/dashboard')
 for(const path of ['/admin/sla','/admin/analytics','/admin/categories','/notifications']){await page.goto(base+path);await page.waitForFunction(()=>document.documentElement.dataset.appReady==='true');await pause()}
}finally{
 const file=await page.video().path();await context.close();await browser.close();await rename(file,'docs/demo/workflow-demo.webm')
}
console.log('Demo recorded: docs/demo/workflow-demo.webm')
