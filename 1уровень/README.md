# WorkFlow · Уровень 1

Интерфейс сервиса заявок на Nuxt 4. Работает без backend, на локальных mock-данных.

## Запуск

```bash
npm install
npm run dev        # http://127.0.0.1:3000 (или http://localhost:3000)
npm run typecheck  # проверка типов (vue-tsc)
npm run build      # production-сборка
```

> **Windows PowerShell:** если `npm` падает с ошибкой «выполнение сценариев отключено в этой системе»,
> запускайте через `npm.cmd` — например, `npm.cmd run dev`.

## Страницы

| Маршрут           | Layout    | Макет                               |
| ----------------- | --------- | ----------------------------------- |
| `/`               | `public`  | 1.01 Главная                        |
| `/login`          | `public`  | 1.02 Вход                           |
| `/dashboard`      | `default` | 1.03 Обзор                          |
| `/requests`       | `default` | 1.04, 1.07–1.09                     |
| `/requests/:id`   | `default` | 1.05 Карточка заявки                |
| `/profile`        | `default` | 1.06 Профиль                        |
| неизвестный адрес | —         | 1.10 Ошибка / 404 (`app/error.vue`) |

### Mock-сценарии списка заявок

- `/requests?mock=loading` — бесконечная загрузка (skeleton)
- `/requests?mock=empty` — пустой список
- `/requests?mock=error` — ошибка загрузки с кнопкой «Повторить»

Переключатель сценариев есть и внизу страницы `/requests`.

## Структура

```
app/
├── assets/css/main.css      # дизайн-токены, базовые стили, focus-visible
├── components/
│   ├── ui/                  # Button, Input, Select, Modal, Pagination, StateBlock, Avatar, PageHeader
│   ├── layout/              # AppHeader, PublicHeader (меню с клавиатурной навигацией)
│   ├── request/             # List, Table, Card, Filters, StatusBadge, PriorityBadge,
│   │                        # Timeline, Comments, Params, ListSkeleton, CreateModal
│   └── dashboard/           # StatCard, StatsGrid
├── composables/             # useRequestsStore, useRequestList, useRequestStats,
│                            # useCurrentUser, useMenuNavigation, useFocusTrap
├── layouts/                 # default (приложение), public (публичные страницы)
├── pages/                   # index, login, dashboard, requests/index, requests/[id], profile
├── types/                   # общие TypeScript-типы
└── utils/                   # mock-данные (14 заявок), подписи статусов, форматирование
```

## Клавиатура

- **Меню** (мобильное): Enter/Space или ↓ — открыть, ↑/↓/Home/End — перемещение, Esc — закрыть и вернуть фокус.
- **Фильтры**: `/` — перейти к поиску, Esc в поиске — очистить; селекты нативные (стрелки, буквы).
- **Модальное окно**: фокус удерживается внутри (Tab / Shift+Tab), Esc — закрыть, фокус возвращается на кнопку.
- **Комментарий**: Ctrl+Enter — отправить.
- Ссылка «Перейти к содержимому» появляется по первому Tab.
