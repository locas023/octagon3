# WorkFlow — уровень 6

Публичные SSR FAQ, help center, статьи, metadata, sitemap

## Запуск

Откройте терминал в этой папке:

```powershell
npm.cmd install
npm.cmd run db:setup
npm.cmd run dev
```

Адрес: http://127.0.0.1:3006. Соседние уровни запускаются на своих портах.

Для локального запуска нужен .env с DATABASE_URL из .env.example. В этой рабочей папке он уже подготовлен. Скрипт db:setup создаёт базу, таблицы и demo accounts.

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
