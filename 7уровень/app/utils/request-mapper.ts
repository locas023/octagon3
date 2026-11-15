import type {
  ApiCategory,
  ApiComment,
  ApiCustomer,
  ApiRequest,
  ApiRequestListItem,
  ApiRequestStats,
  ApiTimelineEvent,
  ApiUser,
} from '#shared/types/api'
import type {
  CommentView,
  RequestListItemView,
  RequestView,
  StatItem,
  TimelineEventView,
} from '~/types'
import { isRequestPriority, isRequestStatus } from '#shared/utils/request-rules'
import { PRIORITY_LABELS, STATUS_LABELS } from './request-meta'

/**
 * ЕДИНСТВЕННОЕ место, где данные API превращаются в модели интерфейса.
 * Компоненты не знают про id связанных сущностей и про отсутствующие поля.
 */

export const UNTITLED_REQUEST = 'Без названия'
const UNKNOWN_AUTHOR = 'Неизвестный пользователь'

export interface Lookups {
  users: Map<string, ApiUser>
  customers: Map<string, ApiCustomer>
  categories: Map<string, ApiCategory>
}

export function createLookups(
  users: ApiUser[] = [],
  customers: ApiCustomer[] = [],
  categories: ApiCategory[] = [],
): Lookups {
  return {
    users: new Map(users.map((user) => [user.id, user])),
    customers: new Map(customers.map((customer) => [customer.id, customer])),
    categories: new Map(categories.map((category) => [category.id, category])),
  }
}

function userName(lookups: Lookups, id: string | null | undefined): string | null {
  if (!id) return null
  return lookups.users.get(id)?.name ?? null
}

export function toRequestListItemView(item: ApiRequestListItem, lookups: Lookups): RequestListItemView {
  const title = item.title?.trim()
  return {
    id: item.id,
    title: title || UNTITLED_REQUEST,
    untitled: !title,
    customer: item.customerId ? (lookups.customers.get(item.customerId)?.name ?? null) : null,
    category: item.categoryId ? (lookups.categories.get(item.categoryId)?.name ?? null) : null,
    assignee: userName(lookups, item.assigneeId),
    status: isRequestStatus(item.status) ? item.status : 'new',
    priority: isRequestPriority(item.priority) ? item.priority : 'normal',
    createdAt: item.createdAt,
    dueAt: item.dueAt ?? null,
  }
}

export function toCommentView(comment: ApiComment, lookups: Lookups): CommentView {
  return {
    id: comment.id,
    author: userName(lookups, comment.authorId) ?? UNKNOWN_AUTHOR,
    text: comment.text,
    createdAt: comment.createdAt,
  }
}

function describeEvent(event: ApiTimelineEvent, lookups: Lookups): string {
  switch (event.type) {
    case 'created':
      return 'создал(а) заявку'
    case 'assigned': {
      const name = userName(lookups, event.value)
      return name ? `назначил(а) исполнителя: ${name}` : 'снял(а) исполнителя'
    }
    case 'status':
      return isRequestStatus(event.value) ? `изменил(а) статус на «${STATUS_LABELS[event.value]}»` : 'изменил(а) статус'
    case 'priority':
      return isRequestPriority(event.value)
        ? `изменил(а) приоритет на «${PRIORITY_LABELS[event.value]}»`
        : 'изменил(а) приоритет'
    case 'comment':
      return 'добавил(а) комментарий'
  }
}

export function toTimelineEventView(event: ApiTimelineEvent, lookups: Lookups): TimelineEventView {
  return {
    id: event.id,
    type: event.type,
    author: userName(lookups, event.actorId) ?? 'Система',
    text: describeEvent(event, lookups),
    createdAt: event.createdAt,
  }
}

export function toRequestView(request: ApiRequest, lookups: Lookups): RequestView {
  return {
    ...toRequestListItemView(request, lookups),
    description: request.description?.trim() || null,
    comments: (request.comments ?? []).map((comment) => toCommentView(comment, lookups)),
    timeline: (request.timeline ?? []).map((event) => toTimelineEventView(event, lookups)),
  }
}

export function toStatItems(stats: ApiRequestStats): StatItem[] {
  return [
    { key: 'new', label: 'Новые заявки', value: stats.new, hint: 'Ожидают назначения' },
    { key: 'progress', label: 'В работе', value: stats.inProgress, hint: 'Назначены исполнителям' },
    { key: 'waiting', label: 'Ожидают ответа', value: stats.waiting, hint: 'Нужна информация' },
    { key: 'resolved', label: 'Решены', value: stats.resolved, hint: 'За эту неделю' },
  ]
}
