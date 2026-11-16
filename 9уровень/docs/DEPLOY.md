# Бесплатное demo: Render + Neon

Источник: https://github.com/locas023/octagon3, финальный проект в `9уровень`. Render использует корневые `render.yaml` и `Dockerfile`: его поля путей не принимают кириллицу. Dockerfile копирует исходники из папки уровня; `.dockerignore` исключает локальные env и зависимости. PostgreSQL хранится отдельно в Neon. Локальный Docker Compose внутри уровня остаётся самостоятельным вариантом запуска.

1. Войти в [Neon](https://console.neon.tech), создать Free project и базу. Скопировать PostgreSQL connection string с `sslmode=require`. Использовать отдельный demo-проект без личных данных.
2. Войти в [Render](https://dashboard.render.com), открыть [Blueprint deploy](https://render.com/deploy?repo=https://github.com/locas023/octagon3), подключить репозиторий. План сервиса в blueprint — free.
3. В поле `DATABASE_URL` в Render вставить строку Neon. Не добавлять её в GitHub, README или сообщения. `CREATE_DATABASE=false` использует готовую облачную базу; `RUN_MIGRATIONS=true` применяет миграции и seed при старте.
4. Дождаться healthy deployment. `scripts/start.mjs` берёт canonical origin из `RENDER_EXTERNAL_URL`; HTTPS включает production Secure cookies. Проверить регистрацию, вход и создание заявки по публичному URL.
5. Внести фактический URL в README/STATUS, после чего повторить API/E2E с `TEST_URL` этого сервиса. Тесты создают учебные записи, поэтому использовать demo-базу.

Render Free может засыпать без трафика: первый запрос медленнее, SLA worker выполняется только при активном процессе. Условия и лимиты облачных тарифов проверять в [Render docs](https://render.com/docs/free) и [Neon plans](https://neon.com/docs/introduction/plans). Реквизиты оплаты для этой схемы не добавлялись, платные ресурсы не создавались.

Секрет хранится в dashboard Render. Для воспроизведения CI secrets не нужны: workflow поднимает отдельную PostgreSQL service database с учебным паролем только на runner.
