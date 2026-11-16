# Проверка релиза

Локальная проверка финального Docker-снимка, 16 ноября 2026. Приложение и PostgreSQL healthy; runtime uid 1000, build tooling отсутствует в runtime. Compose запускает миграции и seed, повторный запуск не сбрасывает данные.

Проверено: typecheck уровней 4–9; unit и Vue/TS/JS lint уровней 5–9. Финал: 10 E2E, API integration, business integration, административный CRUD и историческая аналитика, SQL literal search, архитектурные границы. Комментарий сохраняется в ответе после PATCH заявки. Отдельный тест проверяет заявку и сессию после Docker down/up без удаления тома.

UI-аудит: 35 сочетаний роли/маршрута, overflow 360/768/1280, axe WCAG 2 A/AA + 2.1 AA на desktop. JSON и screenshots в `audit/`. Keyboard E2E проверяет вход, меню со стрелками/Escape, modal focus return. Публичный SSR проверен отдельно; замеры Lighthouse и ограничения — PERFORMANCE.md.

Сессии: случайный токен, SHA-256 в БД, HttpOnly/SameSite, срок 12 часов, production Secure. Пароли scrypt с уникальной солью. Регистрация не принимает роль. Авторизация проверяется на сервере, закрытая сущность возвращает 404, admin-only endpoints — 403. Деактивация отзывает сессии, назначение неактивному Agent запрещено. Вложения проверяются по содержимому и отдаются с attachment/nosniff.

Env исключены из Git и Docker context; demo-аккаунты вымышленные. Production npm audit: 0 high/critical; оставшиеся low/moderate отражены в отчёте. Проверки не являются аудитом безопасности сторонней организацией или нагрузочным тестом.

Чистый Compose-проект с новой базой прошёл миграции, seed, API/business/admin-analytics и все 10 E2E. Проверены background SLA и сохранность сессии/заявки после down/up. Краткое demo-видео записано и просмотрен контрольный кадр.

GitHub CI, release tag и внешний deployment следует проверять по состоянию репозитория и STATUS.md. Локальный успех не доказывает успешный публичный deploy; cloud setup описан в DEPLOY.md.
