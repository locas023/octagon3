# Проверка кандидата в релиз

- Production build: успешно.
- Typecheck: успешно.
- Unit: правила переходов статуса и ролей.
- API integration: вход, создание, идемпотентность комментария, запрет перехода, приватность заявки, logout.
- Business integration: admin-only SLA, срок решения, причина эскалации, уведомления, подпись и количество вложений.
- Regression E2E: гонка поиска, URL refresh и сохранение плотности — 3 tests passed вместе с основным workflow.
- E2E: login → create → assign → status → comment → logout, затем закрытый route.
- Public SSR: h1, canonical, 404, отсутствие hydration/JS errors, ширины 360/768/1280.
- Сессия: случайный токен, SHA-256 в БД, HttpOnly/SameSite cookie, срок 12 часов; production Secure cookie.
- Права: проверки на сервере; деактивированные аккаунты не входят и не назначаются.
- Пароли: scrypt с уникальной солью; demo password намеренно опубликован.
- Вложения: проверка типа по содержимому, max 5 МБ/5 файлов, доступ через заявку, скачивание attachment + nosniff.
- Env: локальные .env исключены из Git и Docker context.

Открыто: полный a11y/keyboard audit всех форм; Web Vitals before/after; детальная визуальная сверка всех экранов/ролей; перенос фильтрации в SQL; нормализованные связи предметной области; полнота административного CRUD; Docker/CI запуск; внешняя публикация и видео. ESLint сейчас проверяет JS/MJS, Vue/TS проверяются typecheck; полноценный Vue/TS lint ещё нужен.

Статус: кандидат в релиз, не подтверждённый production release.


## Дополнение 16 ноября 2026

Добавлена регистрация Client с транзакцией и защитой от одновременной регистрации одного email. Поле role запрещено во входе. API: создание 201, вход client, повторный email 409. Playwright: 4 passed (регистрация + прежние сценарии). ESLint разбирает Vue, TS и MJS; lint, typecheck, production build проходят. Docker Desktop установлен; CLI/Compose проверены, compose config валиден. Контейнерный runtime ждёт перезагрузки и SVM в BIOS.
