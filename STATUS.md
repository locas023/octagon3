# Состояние WorkFlow

Уровни 1–9 находятся в отдельных самостоятельных папках. Итоговая версия — [9уровень](9уровень/README.md), локальный Docker — http://127.0.0.1:3019, [публичное демо](https://octagon3-workflow.onrender.com).

Реализованы интерфейс, API, URL-фильтры, PostgreSQL, сессии четырёх ролей, управление справочниками, workflow заявок, комментарии, SLA, уведомления, вложения и историческая аналитика. В итоговую версию добавлены архив/восстановление закрытых заявок и однократная оценка клиентом. Сервер проверяет права и закрывает изменение архивных записей.

Локальная финальная проверка: typecheck, unit/Vitest, lint, границы архитектуры, production Docker build; API/business/admin-analytics/lifecycle, 12 Playwright E2E, public SSR, axe и overflow 360/768/1280. Отчёты: [релиз](9уровень/docs/RELEASE-AUDIT.md), [доступность и NVDA](9уровень/docs/ACCESSIBILITY.md), [сверка Figma](9уровень/docs/VISUAL-CHECKS.md), [Lighthouse](9уровень/docs/PERFORMANCE.md), [публикация](9уровень/docs/DEPLOYMENT.md).

Предыдущие этапы: typecheck 4–9, unit/lint 5–9; уровень 5 — API и 9 E2E, уровень 8 — API/business/admin-analytics и 10 E2E. Сохранность заявки и сессии после Docker down/up проверялась без удаления тома.

Ограничения: нет полевых INP и нагрузочного тестирования, полного пользовательского screen reader аудита и сверки каждого состояния Figma. Free-сервис засыпает; SLA worker работает при активном процессе. Подробности — [TRADEOFFS](9уровень/docs/TRADEOFFS.md).
