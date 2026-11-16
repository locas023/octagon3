# Проверенная публикация

16 ноября 2026. Публичный URL: **https://octagon3-workflow.onrender.com**.

Render Free, Docker runtime, база PostgreSQL в Neon Free. Опубликованный код приложения: `bf96533`. Корневой Dockerfile позволяет сохранить названия папок уровней на русском; Render получает ASCII-путь Dockerfile. Миграции и seed выполнены при запуске, canonical использует HTTPS origin публичного сервиса.

Фактически выполнено против публичного HTTPS URL:

- API integration: вход, создание, идемпотентный комментарий, сохранение комментария после PATCH, статусные ограничения, приватность и logout.
- Business integration: admin-only SLA, deadline, обязательная причина эскалации, уведомления и проверка вложений.
- Admin/analytics integration: CRUD справочников, роли, историческая аналитика периода и буквальный SQL search.
- Playwright: **11 passed**, 2,1 минуты. Включены задержанный application JS, клавиатура/меню/modal focus, 409/500 rollback и Undo, профиль, регистрация, URL/preferences refresh и полный workflow.
- Public SSR: содержательный HTML, canonical, 404, отсутствие hydration/JS errors и overflow на 360/768/1280. Результаты в `performance-results.json`.
- [CI опубликованного исправления](https://github.com/locas023/octagon3/actions/runs/43861560069): success, 11 E2E плюс typecheck/unit/lint/build/API/SSR на чистом Linux runner.

Тесты используют только вымышленные demo accounts и создают учебные записи. Демо-пароль: `WorkflowDemo2026!`; роли — `client@workflow.demo`, `operator@workflow.demo`, `agent@workflow.demo`, `admin@workflow.demo`.

Ограничение Free: сервис засыпает без трафика, первый запрос может занять около минуты. SLA worker работает при активном процессе, а после старта догоняет просроченные уведомления. Платные ресурсы и реквизиты оплаты не добавлялись. DATABASE_URL хранится в Environment Render и отсутствует в репозитории.
