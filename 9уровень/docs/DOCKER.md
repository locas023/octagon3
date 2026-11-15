# Проверенный Docker-запуск

Windows + Docker Desktop WSL2. Проект Compose: `workflow-level9`. Docker-версия доступна на http://127.0.0.1:3019; dev-сервер можно продолжать запускать отдельно на 3009.

## Запуск в PowerShell

Из папки `9уровень`:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/docker-start.ps1
```

Скрипт создаёт `.env.compose` со случайным паролем отдельной контейнерной базы. Этот файл исключён из Git и Docker build context. Уже существующий пароль скрипт сохраняет.

Для повторного запуска вручную:

```powershell
docker compose --env-file .env.compose -p workflow-level9 up -d --build --wait
docker compose --env-file .env.compose -p workflow-level9 ps
docker compose --env-file .env.compose -p workflow-level9 logs --tail 30 app
```

Приложение доступно только на localhost. PostgreSQL не публикуется на хосте; данные хранятся в именованном томе `workflow-level9_workflow-data` и независимы от локальной базы предыдущих уровней.

Остановка с сохранением тома:

```powershell
docker compose --env-file .env.compose -p workflow-level9 down
```

## Проверки контейнерной версии

```powershell
$env:TEST_URL='http://127.0.0.1:3019'
npm.cmd run test:integration
npm.cmd run test:business
npm.cmd run test:e2e
npm.cmd run test:docker
```

Последний тест пересоздаёт контейнеры без удаления тома и проверяет сохранность заявки и сессии. Остальные тесты создают учебные записи в демо-базе.

## Runtime

Multi-stage build, пользователь `node` (uid 1000), healthcheck приложения и БД. В runtime не копируются Nuxt CLI, TypeScript, ESLint и Playwright. Seed fixtures предварительно экспортируются в JSON на стадии сборки; runtime использует только PostgreSQL driver и Nitro output.

Zod обновлена до исправленной версии 4.6.7+. Аудит production-зависимостей: 0 high/critical, остаются 6 low и 6 moderate, преимущественно в цепочке Nuxt/build tooling. Автоматическое принудительное понижение Nuxt не применялось; отчёт сохранён в `npm-audit-production.json`.
