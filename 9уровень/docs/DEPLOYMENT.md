# Проверенная публикация

Публикация 16 ноября, повторная браузерная проверка 22 ноября 2026. Публичный URL: **https://octagon3-workflow.onrender.com**.

Render Free, Docker runtime, база PostgreSQL в Neon Free. Опубликованный код приложения: `3e60de3`. Корневой Dockerfile позволяет сохранить названия папок уровней на русском; Render получает ASCII-путь Dockerfile. Миграции и seed выполнены при запуске, canonical использует HTTPS origin публичного сервиса.

Фактически выполнено против публичного HTTPS URL:

- API integration: вход, создание, идемпотентный комментарий, сохранение комментария после PATCH, статусные ограничения, приватность и logout.
- Business integration: admin-only SLA, deadline, обязательная причина эскалации, уведомления и проверка вложений.
- Admin/analytics integration: CRUD справочников, роли, историческая аналитика периода и буквальный SQL search.
- Archive/rating integration: права, архив только закрытых заявок, read-only, идемпотентность и сохранение оценки после восстановления.
- Playwright: **12 passed**, 2,7 минуты (22 ноября). Включены задержанный application JS, клавиатура/меню/modal focus, 409/500 rollback и Undo, профиль, регистрация, URL/preferences refresh, полный workflow и оценка → архив → восстановление. Последний сценарий занял 35,8 с на публичной сети; ему задан общий лимит 90 с вместо 30 с.
- Public SSR: содержательный HTML, canonical, 404, отсутствие hydration/JS errors и overflow на 360/768/1280. Результаты в `performance-results.json`.
- [CI опубликованного исправления](https://github.com/locas023/octagon3/actions/runs/43870225376): success, 12 E2E плюс typecheck/unit/lint/build/API/SSR на чистом Linux runner.

Тесты используют только вымышленные demo accounts и создают учебные записи. Демо-пароль: `WorkflowDemo2026!`; роли — `client@workflow.demo`, `operator@workflow.demo`, `agent@workflow.demo`, `admin@workflow.demo`.

Ограничение Free: сервис засыпает без трафика, первый запрос может занять около минуты. SLA worker работает при активном процессе, а после старта догоняет просроченные уведомления. Платные ресурсы и реквизиты оплаты не добавлялись. DATABASE_URL хранится в Environment Render и отсутствует в репозитории.
