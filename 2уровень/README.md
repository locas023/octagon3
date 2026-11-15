# WorkFlow · Уровень 2 — данные, поиск и загрузка

Список и карточка заявки получают данные с API (Nitro server routes), состояние поиска и фильтров живёт в URL.

## Запуск

```bash
npm.cmd install
npm.cmd run dev        # http://127.0.0.1:3002
npm.cmd run typecheck
```

## API

| Метод | Путь | Описание |
| --- | --- | --- |
| GET | `/api/requests` | список: `q`, `status`, `priority`, `assignment`, `sort`, `page`, `pageSize` |
| GET | `/api/requests/:id` | заявка с комментариями и историей, 404 если нет |
| GET | `/api/requests/stats` | сводка для карточек |
| GET | `/api/users`, `/api/customers`, `/api/categories` | справочники |

Демо-режимы любого endpoint: `?simulate=slow` (1,5 с), `empty`, `500`, `429` (с `Retry-After: 5`).
На странице `/requests` они переключаются ссылками внизу.

## Что сделано

- **useFetch** для списка, карточки, статистики и справочников (`app/composables/useRequests.ts`, `useReferenceData.ts`).
  Ключи справочников общие — данные загружаются один раз.
- **URL state:** `useRequestFilters()` читает и пишет `?q=&status=&priority=&assignment=&sort=&page=`.
  Значения по умолчанию в URL не попадают. Прямая ссылка восстанавливает страницу, SSR отдаёт уже отфильтрованный HTML.
- **Debounce поиска** — `useDebouncedRef` (350 мс): ввод «crm» = один запрос.
- **Состояния:** skeleton (первая загрузка), приглушённый список (повторная загрузка), empty state
  («Заявок пока нет» и отдельно «Ничего не найдено» с кнопкой сброса), error state.
- **HTTP 429 / 500:** понятные сообщения (`app/utils/api-error.ts`), кнопка «Повторить»;
  при 429 она заблокирована на время `Retry-After` с обратным отсчётом.
- **Типы API** — `shared/types/api.ts`, без `any`; общий код для сервера и клиента — `shared/utils`.
- **Преобразование API → UI в одном месте** — `app/utils/request-mapper.ts`.
  Записи без названия, клиента, категории или исполнителя отображаются заглушками
  («Без названия», «—», «Не назначен»); длинные названия обрезаются до двух строк с полным текстом в `title`.

## Структура

```
app/
├── components/ request/ (Table, Card, List, Filters, DetailSkeleton…), ui/ (ErrorBlock…)
├── composables/ useRequests.ts, useDebounce.ts, useReferenceData.ts
├── pages/requests/ index.vue, [id].vue
├── utils/ request-mapper.ts, request-filters.ts, api-error.ts
└── types/
server/
├── api/ requests/, users/, customers/, categories/
└── utils/ mock-data.ts, request-query.ts, simulate.ts
shared/
├── types/api.ts
└── utils/request-rules.ts
```
