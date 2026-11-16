# Состояние WorkFlow

Уровни 1–9 находятся в отдельных самостоятельных папках. Порт первого уровня — 3000, остальных — 3002–3009. Финальное Docker-приложение: http://127.0.0.1:3019.

- 1: интерфейс и переиспользуемые компоненты по макету.
- 2: типизированные GET API, URL-фильтры, debounce, пагинация, loading/error/retry/empty.
- 3: Pinia-настройки, optimistic mutation, rollback, Undo, комментарии.
- 4: PostgreSQL, seed, серверные сессии и четыре роли, CRUD справочников, профиль, валидация и переходы статусов.
- 5: unit/Vitest, API integration, Playwright, Vue/TS/JS lint.
- 6: SSR landing/FAQ/help/articles, metadata, sitemap/robots, 404, локальные шрифты. Performance before/after измерен на финальной версии, методика указана в docs.
- 7: features и серверные сервисы, SQL pagination/filtering, проверка границ импортов, ARCHITECTURE и три ADR.
- 8: SLA, эскалация с причиной, фоновый scan, уведомления read/unread, вложения, историческая аналитика периода.
- 9: Docker Compose, CI workflow, release audit, доступность, performance, demo-сценарий и документация.

Подтверждено локально: typecheck 4–9, unit и lint 5–9; production Docker build. Финальные 10 браузерных сценариев прошли. API/business/admin-analytics прошли; тесты повторяемы. Public SSR/hydration и ширины 360/768/1280 проверены. Полные результаты доступности — `9уровень/docs/audit/accessibility.json`. Lighthouse mobile на трёх страницах: performance 100, LCP 0,76–0,91 с, CLS 0; это единичные локальные диагностические прогоны.

Запуск в отдельном Compose-проекте с новой пустой базой прошёл: миграции, seed, API/business/admin-analytics и все 10 E2E. Проверены сохранность заявки и сессии после down/up и фоновое создание SLA-уведомления без запроса страницы. Видео записано: `9уровень/docs/demo/workflow-demo.webm`.

Репозиторий: https://github.com/locas023/octagon3. Бесплатный deployment подготовлен через корневой render.yaml и внешнюю PostgreSQL Neon; облачные аккаунты и публичный URL пока не подключены. Фактическое состояние CI и tag проверяются в GitHub. Не считать наличие конфигурации подтверждением прошедшего внешнего CI/deploy.

Ограничения: нет полевых INP и нагрузочного тестирования, полного ручного screen reader аудита и pixel-perfect проверки каждого состояния Figma. Планировщик зависит от работающего процесса. В npm audit остаются low/moderate зависимости; high/critical нет. Подробности — `9уровень/docs/TRADEOFFS.md`.
