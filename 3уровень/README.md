# WorkFlow — уровень 3

Pinia preferences, API mutations, optimistic priority, rollback, Undo, comments

## Запуск

Откройте терминал в этой папке:

```powershell
npm.cmd install

npm.cmd run dev
```

Адрес: http://127.0.0.1:3003. Соседние уровни запускаются на своих портах.

Данные уровня 3 хранятся в памяти Nitro и сбрасываются при перезапуске.

## Демо

Уровни 4–9: admin@workflow.demo, operator@workflow.demo, agent@workflow.demo, client@workflow.demo. Пароль: WorkflowDemo2026!.

Публичная главная: `/`; приложение: `/dashboard`, `/requests`, `/profile`. Создание: `/new-request`; выход: `/logout`. Уровни 6–9: `/faq`, `/help`, `/articles`. Уровни 8–9: `/admin/sla`, `/admin/analytics`, `/notifications`.

## Проверки

```powershell
npm.cmd run typecheck
npm.cmd run build
```

Начиная с уровня 5:

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run test:integration
npm.cmd run test:e2e
```

API/E2E требуют работающий сервер и seed. Playwright использует установленный Edge. Папки являются самостоятельными снимками; зависимости устанавливаются отдельно. Локальные `.env` исключены из Git. При одинаковом DATABASE_URL уровни 4–9 используют одну локальную базу.

## Архитектура

Nuxt 4 / Vue 3 / TypeScript / Nitro; Pinia хранит UI preferences. Server state — useFetch, фильтры — URL. PostgreSQL и сессии находятся на сервере. Shared содержит общие модели и правила. Уровни 7–9: `docs/ARCHITECTURE.md`.

Точное состояние выполнения и ограничения: `../STATUS.md`. Изображения интерфейса и численные проверки финальной сборки: `../9уровень/docs/`.
