import type {
  RequestComment,
  RequestPriority,
  RequestStatus,
  SupportRequest,
  TimelineEvent,
} from '~/types'
import { STATUS_LABELS } from './request-meta'

/** Список исполнителей, доступных для назначения. */
export const MOCK_EXECUTORS: readonly string[] = ['Брунгильда Б.', 'Олег С.', 'Ирина К.']

export const MOCK_CLIENTS: readonly string[] = ['АО «Вектор»', 'ООО «Сфера»', 'ООО «Пульс»']

export const MOCK_CATEGORIES: readonly string[] = [
  'Доступ и учётные записи',
  'Отчёты и выгрузки',
  'Оборудование',
  'Инфраструктура',
  'Интеграции',
]

interface Seed {
  id: number
  title: string
  description: string
  client: string
  category: string
  assignee: string | null
  status: RequestStatus
  priority: RequestPriority
  createdAt: string
  dueAt: string
  comments?: Array<Omit<RequestComment, 'id'>>
}

const seeds: Seed[] = [
  {
    id: 1042,
    title: 'Не работает доступ к CRM',
    description:
      'После обновления не удаётся войти в CRM. При попытке входа появляется сообщение «Доступ запрещён». Проблема затрагивает отдел продаж.',
    client: 'АО «Вектор»',
    category: 'Доступ и учётные записи',
    assignee: null,
    status: 'new',
    priority: 'high',
    createdAt: '2026-10-05T09:14:00+03:00',
    dueAt: '2026-10-05T13:14:00+03:00',
    comments: [
      {
        author: 'Мария Смирнова',
        text: 'Не можем войти с рабочих компьютеров. Нужна помощь.',
        createdAt: '2026-10-05T09:16:00+03:00',
      },
    ],
  },
  {
    id: 1041,
    title: 'Ошибка выгрузки отчёта',
    description:
      'Ежедневный отчёт по продажам не выгружается в Excel: процесс обрывается на 80% с ошибкой сервера.',
    client: 'ООО «Сфера»',
    category: 'Отчёты и выгрузки',
    assignee: null,
    status: 'new',
    priority: 'critical',
    createdAt: '2026-10-05T08:40:00+03:00',
    dueAt: '2026-10-05T10:40:00+03:00',
  },
  {
    id: 1040,
    title: 'Подключить нового сотрудника',
    description:
      'С понедельника выходит новый менеджер. Нужно создать учётную запись, почту и выдать доступ к CRM.',
    client: 'АО «Вектор»',
    category: 'Доступ и учётные записи',
    assignee: 'Брунгильда Б.',
    status: 'assigned',
    priority: 'normal',
    createdAt: '2026-10-04T16:20:00+03:00',
    dueAt: '2026-10-06T16:20:00+03:00',
  },
  {
    id: 1039,
    title: 'Обновить сертификат',
    description: 'Через три дня истекает SSL-сертификат клиентского портала. Требуется перевыпуск.',
    client: 'ООО «Пульс»',
    category: 'Инфраструктура',
    assignee: 'Брунгильда Б.',
    status: 'waiting',
    priority: 'high',
    createdAt: '2026-10-04T12:05:00+03:00',
    dueAt: '2026-10-07T12:05:00+03:00',
    comments: [
      {
        author: 'Брунгильда Б.',
        text: 'Пришлите, пожалуйста, подтверждение от владельца домена.',
        createdAt: '2026-10-04T14:30:00+03:00',
      },
    ],
  },
  {
    id: 1038,
    title: 'Настроить резервное копирование',
    description: 'Нужно настроить ежедневное резервное копирование базы 1С на сетевое хранилище.',
    client: 'ООО «Пульс»',
    category: 'Инфраструктура',
    assignee: 'Брунгильда Б.',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2026-10-03T10:00:00+03:00',
    dueAt: '2026-10-06T10:00:00+03:00',
  },
  {
    id: 1037,
    title: 'Сбой печати документов',
    description: 'Принтер в бухгалтерии печатает пустые листы при отправке документов из 1С.',
    client: 'ООО «Пульс»',
    category: 'Оборудование',
    assignee: 'Брунгильда Б.',
    status: 'resolved',
    priority: 'low',
    createdAt: '2026-10-02T15:45:00+03:00',
    dueAt: '2026-10-05T15:45:00+03:00',
    comments: [
      {
        author: 'Брунгильда Б.',
        text: 'Переустановили драйвер, печать восстановлена.',
        createdAt: '2026-10-03T11:10:00+03:00',
      },
    ],
  },
  {
    id: 1036,
    title: 'Изменить права доступа',
    description: 'Сотруднику отдела закупок нужен доступ на чтение к папке «Договоры».',
    client: 'АО «Вектор»',
    category: 'Доступ и учётные записи',
    assignee: null,
    status: 'new',
    priority: 'normal',
    createdAt: '2026-10-02T11:30:00+03:00',
    dueAt: '2026-10-04T11:30:00+03:00',
  },
  {
    id: 1035,
    title: 'Ошибка авторизации в кабинете',
    description: 'Клиенты жалуются, что после ввода кода из SMS личный кабинет снова просит войти.',
    client: 'ООО «Пульс»',
    category: 'Доступ и учётные записи',
    assignee: 'Олег С.',
    status: 'assigned',
    priority: 'high',
    createdAt: '2026-10-01T17:05:00+03:00',
    dueAt: '2026-10-02T17:05:00+03:00',
  },
  {
    id: 1034,
    title: 'Подключить почтовый ящик',
    description: 'Создать общий ящик support@ и подключить его к почтовым клиентам отдела.',
    client: 'ООО «Сфера»',
    category: 'Инфраструктура',
    assignee: 'Олег С.',
    status: 'closed',
    priority: 'low',
    createdAt: '2026-09-30T09:50:00+03:00',
    dueAt: '2026-10-03T09:50:00+03:00',
  },
  {
    id: 1033,
    title: 'Недоступен файловый сервер',
    description: 'С утра не открываются сетевые папки на сервере FS-02. Работа отдела остановлена.',
    client: 'ООО «Сфера»',
    category: 'Инфраструктура',
    assignee: 'Брунгильда Б.',
    status: 'in_progress',
    priority: 'critical',
    createdAt: '2026-09-30T08:15:00+03:00',
    dueAt: '2026-09-30T10:15:00+03:00',
    comments: [
      {
        author: 'Брунгильда Б.',
        text: 'Сервер перезапущен, проверяем дисковый массив.',
        createdAt: '2026-09-30T08:55:00+03:00',
      },
    ],
  },
  {
    id: 1032,
    title: 'Изменить контакты компании',
    description: 'Обновить телефон и адрес офиса в карточке клиента и в подписи писем.',
    client: 'ООО «Пульс»',
    category: 'Интеграции',
    assignee: 'Олег С.',
    status: 'waiting',
    priority: 'normal',
    createdAt: '2026-09-29T13:25:00+03:00',
    dueAt: '2026-10-02T13:25:00+03:00',
  },
  {
    id: 1031,
    title: 'Проверить интеграцию',
    description: 'Заказы с сайта перестали попадать в учётную систему после смены API-ключа.',
    client: 'ООО «Сфера»',
    category: 'Интеграции',
    assignee: 'Олег С.',
    status: 'resolved',
    priority: 'normal',
    createdAt: '2026-09-28T10:40:00+03:00',
    dueAt: '2026-09-30T10:40:00+03:00',
  },
  {
    id: 1030,
    title: 'Не приходят уведомления',
    description: 'Пользователи не получают письма о смене статуса заявки.',
    client: 'АО «Вектор»',
    category: 'Интеграции',
    assignee: null,
    status: 'new',
    priority: 'low',
    createdAt: '2026-09-27T18:00:00+03:00',
    dueAt: '2026-10-01T18:00:00+03:00',
  },
  {
    id: 1029,
    title: 'Медленно работает портал',
    description: 'Страницы клиентского портала загружаются 10–15 секунд, особенно раздел отчётов.',
    client: 'ООО «Сфера»',
    category: 'Инфраструктура',
    assignee: 'Олег С.',
    status: 'in_progress',
    priority: 'normal',
    createdAt: '2026-09-27T11:20:00+03:00',
    dueAt: '2026-09-30T11:20:00+03:00',
  },
]

function addMinutes(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString()
}

function buildTimeline(seed: Seed): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: `${seed.id}-t1`,
      type: 'created',
      text: 'создала заявку',
      author: 'Мария Смирнова',
      createdAt: seed.createdAt,
    },
  ]

  if (seed.assignee) {
    events.push({
      id: `${seed.id}-t2`,
      type: 'assigned',
      text: `назначила исполнителя: ${seed.assignee}`,
      author: 'Анна Кузнецова',
      createdAt: addMinutes(seed.createdAt, 25),
    })
  }

  if (seed.status !== 'new' && seed.status !== 'assigned') {
    events.push({
      id: `${seed.id}-t3`,
      type: 'status',
      text: `изменил статус на «${STATUS_LABELS[seed.status]}»`,
      author: seed.assignee ?? 'Анна Кузнецова',
      createdAt: addMinutes(seed.createdAt, 90),
    })
  }

  return events
}

function buildRequest(seed: Seed): SupportRequest {
  const comments: RequestComment[] = (seed.comments ?? []).map((comment, index) => ({
    ...comment,
    id: `${seed.id}-c${index + 1}`,
  }))

  return {
    id: seed.id,
    title: seed.title,
    description: seed.description,
    client: seed.client,
    category: seed.category,
    assignee: seed.assignee,
    status: seed.status,
    priority: seed.priority,
    createdAt: seed.createdAt,
    dueAt: seed.dueAt,
    comments,
    timeline: buildTimeline(seed),
  }
}

/** Возвращает новую копию mock-заявок, чтобы состояние не мутировало исходные данные. */
export function createMockRequests(): SupportRequest[] {
  return seeds.map(buildRequest)
}
