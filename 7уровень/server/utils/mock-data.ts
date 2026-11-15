import type {
  ApiCategory,
  ApiComment,
  ApiCustomer,
  ApiRequest,
  ApiTimelineEvent,
  ApiUser,
  RequestPriority,
  RequestStatus,
} from '#shared/types/api'

/**
 * Учебный источник данных для API (на уровне 4 заменяется PostgreSQL).
 * Данные лежат в памяти процесса Nitro.
 */

export const users: ApiUser[] = [
  { id: 'u-anna', name: 'Анна Кузнецова', email: 'anna@workflow.demo', role: 'operator', active: true },
  { id: 'u-brun', name: 'Брунгильда Б.', email: 'brun@workflow.demo', role: 'agent', active: true },
  { id: 'u-oleg', name: 'Олег С.', email: 'oleg@workflow.demo', role: 'agent', active: true },
  { id: 'u-irina', name: 'Ирина К.', email: 'irina@workflow.demo', role: 'agent', active: false },
  {
    id: 'u-long',
    name: 'Константин Константинопольский-Преображенский',
    email: 'konstantin@workflow.demo',
    role: 'agent',
    active: true,
  },
  { id: 'u-maria', name: 'Мария Смирнова', email: 'maria@workflow.demo', role: 'client', active: true },
]

export const customers: ApiCustomer[] = [
  { id: 'c-vector', name: 'АО «Вектор»' },
  { id: 'c-sfera', name: 'ООО «Сфера»' },
  { id: 'c-puls', name: 'ООО «Пульс»' },
  { id: 'c-long', name: 'ООО «Международная торгово-производственная компания Северо-Запад»' },
]

export const categories: ApiCategory[] = [
  { id: 'cat-access', name: 'Доступ и учётные записи' },
  { id: 'cat-reports', name: 'Отчёты и выгрузки' },
  { id: 'cat-hardware', name: 'Оборудование' },
  { id: 'cat-infra', name: 'Инфраструктура' },
  { id: 'cat-integrations', name: 'Интеграции' },
]

interface Seed {
  id: number
  title?: string | null
  description?: string | null
  customerId?: string | null
  categoryId?: string | null
  assigneeId?: string | null
  status: RequestStatus
  priority: RequestPriority
  createdAt: string
  /** Через сколько часов после создания истекает срок решения */
  slaHours?: number
  comments?: Array<{ authorId: string; text: string; minutes: number }>
}

const seeds: Seed[] = [
  { id: 1042, title: 'Не работает доступ к CRM', description: 'После обновления не удаётся войти в CRM. При попытке входа появляется сообщение «Доступ запрещён». Проблема затрагивает отдел продаж.', customerId: 'c-vector', categoryId: 'cat-access', assigneeId: null, status: 'new', priority: 'high', createdAt: '2026-10-05T09:14:00+03:00', slaHours: 4, comments: [{ authorId: 'u-maria', text: 'Не можем войти с рабочих компьютеров. Нужна помощь.', minutes: 2 }] },
  { id: 1041, title: 'Ошибка выгрузки отчёта', description: 'Ежедневный отчёт по продажам не выгружается в Excel: процесс обрывается на 80% с ошибкой сервера.', customerId: 'c-sfera', categoryId: 'cat-reports', assigneeId: null, status: 'new', priority: 'critical', createdAt: '2026-10-05T08:40:00+03:00', slaHours: 2 },
  { id: 1040, title: 'Подключить нового сотрудника', description: 'С понедельника выходит новый менеджер. Нужно создать учётную запись, почту и выдать доступ к CRM.', customerId: 'c-vector', categoryId: 'cat-access', assigneeId: 'u-brun', status: 'assigned', priority: 'normal', createdAt: '2026-10-04T16:20:00+03:00', slaHours: 48 },
  { id: 1039, title: 'Обновить сертификат', description: 'Через три дня истекает SSL-сертификат клиентского портала. Требуется перевыпуск.', customerId: 'c-puls', categoryId: 'cat-infra', assigneeId: 'u-brun', status: 'waiting', priority: 'high', createdAt: '2026-10-04T12:05:00+03:00', slaHours: 72, comments: [{ authorId: 'u-brun', text: 'Пришлите, пожалуйста, подтверждение от владельца домена.', minutes: 145 }] },
  { id: 1038, title: 'Настроить резервное копирование', description: 'Нужно настроить ежедневное резервное копирование базы 1С на сетевое хранилище.', customerId: 'c-puls', categoryId: 'cat-infra', assigneeId: 'u-brun', status: 'in_progress', priority: 'high', createdAt: '2026-10-03T10:00:00+03:00', slaHours: 72 },
  { id: 1037, title: 'Сбой печати документов', description: 'Принтер в бухгалтерии печатает пустые листы при отправке документов из 1С.', customerId: 'c-puls', categoryId: 'cat-hardware', assigneeId: 'u-brun', status: 'resolved', priority: 'low', createdAt: '2026-10-02T15:45:00+03:00', slaHours: 72, comments: [{ authorId: 'u-brun', text: 'Переустановили драйвер, печать восстановлена.', minutes: 1165 }] },
  { id: 1036, title: 'Изменить права доступа', description: 'Сотруднику отдела закупок нужен доступ на чтение к папке «Договоры».', customerId: 'c-vector', categoryId: 'cat-access', assigneeId: null, status: 'new', priority: 'normal', createdAt: '2026-10-02T11:30:00+03:00', slaHours: 48 },
  { id: 1035, title: 'Ошибка авторизации в кабинете', description: 'Клиенты жалуются, что после ввода кода из SMS личный кабинет снова просит войти.', customerId: 'c-puls', categoryId: 'cat-access', assigneeId: 'u-oleg', status: 'assigned', priority: 'high', createdAt: '2026-10-01T17:05:00+03:00', slaHours: 24 },
  { id: 1034, title: 'Подключить почтовый ящик', description: 'Создать общий ящик support@ и подключить его к почтовым клиентам отдела.', customerId: 'c-sfera', categoryId: 'cat-infra', assigneeId: 'u-oleg', status: 'closed', priority: 'low', createdAt: '2026-09-30T09:50:00+03:00', slaHours: 72 },
  { id: 1033, title: 'Недоступен файловый сервер', description: 'С утра не открываются сетевые папки на сервере FS-02. Работа отдела остановлена.', customerId: 'c-sfera', categoryId: 'cat-infra', assigneeId: 'u-brun', status: 'in_progress', priority: 'critical', createdAt: '2026-09-30T08:15:00+03:00', slaHours: 2, comments: [{ authorId: 'u-brun', text: 'Сервер перезапущен, проверяем дисковый массив.', minutes: 40 }] },
  { id: 1032, title: 'Изменить контакты компании', description: 'Обновить телефон и адрес офиса в карточке клиента и в подписи писем.', customerId: 'c-puls', categoryId: 'cat-integrations', assigneeId: 'u-oleg', status: 'waiting', priority: 'normal', createdAt: '2026-09-29T13:25:00+03:00', slaHours: 72 },
  { id: 1031, title: 'Проверить интеграцию', description: 'Заказы с сайта перестали попадать в учётную систему после смены API-ключа.', customerId: 'c-sfera', categoryId: 'cat-integrations', assigneeId: 'u-oleg', status: 'resolved', priority: 'normal', createdAt: '2026-09-28T10:40:00+03:00', slaHours: 48 },
  { id: 1030, title: 'Не приходят уведомления', description: 'Пользователи не получают письма о смене статуса заявки.', customerId: 'c-vector', categoryId: 'cat-integrations', assigneeId: null, status: 'new', priority: 'low', createdAt: '2026-09-27T18:00:00+03:00', slaHours: 96 },
  { id: 1029, title: 'Медленно работает портал', description: 'Страницы клиентского портала загружаются 10–15 секунд, особенно раздел отчётов.', customerId: 'c-sfera', categoryId: 'cat-infra', assigneeId: 'u-oleg', status: 'in_progress', priority: 'normal', createdAt: '2026-09-27T11:20:00+03:00', slaHours: 72 },
  // 2.05 · Длинное название и имя
  { id: 1028, title: 'После обновления корпоративной CRM сотрудники отдела продаж не могут войти в систему и открыть карточки клиентов', description: 'Ошибка воспроизводится у всех сотрудников отдела продаж после установки обновления 5.2.', customerId: 'c-long', categoryId: 'cat-access', assigneeId: 'u-long', status: 'in_progress', priority: 'high', createdAt: '2026-09-26T09:10:00+03:00', slaHours: 24 },
  // 2.06 · Заявка без названия и без необязательных полей
  { id: 1027, title: null, description: null, customerId: null, categoryId: null, assigneeId: null, status: 'new', priority: 'normal', createdAt: '2026-09-25T15:35:00+03:00' },
  { id: 1026, title: 'Заменить картридж в переговорной', customerId: 'c-vector', categoryId: 'cat-hardware', assigneeId: 'u-brun', status: 'resolved', priority: 'low', createdAt: '2026-09-25T10:00:00+03:00', slaHours: 96 },
  { id: 1025, title: 'Настроить VPN для удалённого сотрудника', customerId: 'c-sfera', categoryId: 'cat-access', assigneeId: 'u-oleg', status: 'closed', priority: 'normal', createdAt: '2026-09-24T12:30:00+03:00', slaHours: 48 },
  { id: 1024, title: 'Ошибка синхронизации календаря', customerId: 'c-puls', categoryId: 'cat-integrations', assigneeId: null, status: 'new', priority: 'normal', createdAt: '2026-09-23T17:45:00+03:00', slaHours: 48 },
  { id: 1023, title: 'Не открывается отчёт по остаткам', customerId: 'c-vector', categoryId: 'cat-reports', assigneeId: 'u-brun', status: 'waiting', priority: 'high', createdAt: '2026-09-23T09:05:00+03:00', slaHours: 24 },
  { id: 1022, title: 'Шумит сервер в серверной', customerId: 'c-puls', categoryId: 'cat-hardware', assigneeId: 'u-oleg', status: 'in_progress', priority: 'low', createdAt: '2026-09-22T14:20:00+03:00', slaHours: 96 },
  { id: 1021, title: 'Сбой обмена с банком', customerId: 'c-sfera', categoryId: 'cat-integrations', assigneeId: 'u-brun', status: 'resolved', priority: 'critical', createdAt: '2026-09-21T08:00:00+03:00', slaHours: 2 },
  { id: 1020, title: 'Выдать доступ к BI-панели', customerId: 'c-vector', categoryId: 'cat-access', assigneeId: 'u-oleg', status: 'closed', priority: 'normal', createdAt: '2026-09-20T11:15:00+03:00', slaHours: 48 },
  { id: 1019, title: 'Не работает сканер на ресепшене', customerId: 'c-puls', categoryId: 'cat-hardware', assigneeId: null, status: 'new', priority: 'low', createdAt: '2026-09-19T16:40:00+03:00', slaHours: 96 },
  { id: 1018, title: 'Перенести сайт на новый хостинг', customerId: 'c-sfera', categoryId: 'cat-infra', assigneeId: 'u-oleg', status: 'assigned', priority: 'normal', createdAt: '2026-09-18T10:25:00+03:00', slaHours: 120 },
  { id: 1017, title: 'Ошибка в отчёте по продажам за квартал', customerId: 'c-vector', categoryId: 'cat-reports', assigneeId: 'u-brun', status: 'resolved', priority: 'high', createdAt: '2026-09-17T13:00:00+03:00', slaHours: 24 },
]

function shift(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString()
}

function buildTimeline(seed: Seed): ApiTimelineEvent[] {
  const events: ApiTimelineEvent[] = [
    { id: `${seed.id}-t1`, type: 'created', actorId: 'u-maria', createdAt: seed.createdAt },
  ]
  if (seed.assigneeId) {
    events.push({ id: `${seed.id}-t2`, type: 'assigned', actorId: 'u-anna', value: seed.assigneeId, createdAt: shift(seed.createdAt, 25) })
  }
  if (seed.status !== 'new' && seed.status !== 'assigned') {
    events.push({ id: `${seed.id}-t3`, type: 'status', actorId: seed.assigneeId ?? 'u-anna', value: seed.status, createdAt: shift(seed.createdAt, 90) })
  }
  return events
}

function buildRequest(seed: Seed): ApiRequest {
  const comments: ApiComment[] = (seed.comments ?? []).map((comment, index) => ({
    id: `${seed.id}-c${index + 1}`,
    authorId: comment.authorId,
    text: comment.text,
    createdAt: shift(seed.createdAt, comment.minutes),
  }))

  return {
    id: seed.id,
    title: seed.title,
    description: seed.description,
    customerId: seed.customerId,
    categoryId: seed.categoryId,
    assigneeId: seed.assigneeId,
    status: seed.status,
    priority: seed.priority,
    createdAt: new Date(seed.createdAt).toISOString(),
    dueAt: seed.slaHours ? shift(seed.createdAt, seed.slaHours * 60) : null,
    comments,
    timeline: buildTimeline(seed),
  }
}

export const requests: ApiRequest[] = seeds.map(buildRequest)
