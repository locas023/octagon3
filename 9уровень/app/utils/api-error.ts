import type { ApiErrorBody } from '#shared/types/api'
import type { UiError } from '~/types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readBody(error: unknown): ApiErrorBody | null {
  if (!isRecord(error)) return null
  // FetchError из ofetch: тело ответа лежит в error.data
  const body = error.data
  if (isRecord(body) && typeof body.statusCode === 'number') return body as unknown as ApiErrorBody
  return null
}

function readStatus(error: unknown, body: ApiErrorBody | null): number | null {
  if (body) return body.statusCode
  if (isRecord(error)) {
    const status = error.statusCode ?? error.status
    if (typeof status === 'number') return status
  }
  return null
}

/** Превращает любую ошибку запроса в понятное пользователю сообщение. */
export function toUiError(error: unknown): UiError {
  const body = readBody(error)
  const status = readStatus(error, body)

  if (status === 429) {
    const retryAfter = body?.data?.retryAfter ?? 5
    return {
      status,
      title: 'Слишком много запросов',
      message: `Сервер временно ограничил число запросов. Повторите через ${retryAfter} с.`,
      retryAfter,
    }
  }

  if (status !== null && status >= 500) {
    return {
      status,
      title: 'Не удалось загрузить данные',
      message: 'Сервис временно недоступен. Попробуйте ещё раз.',
      retryAfter: null,
    }
  }

  if (status === 409) return { status, title: 'Конфликт', message: 'Заявка изменена или переход недопустим. Предыдущее значение восстановлено.', retryAfter: null }
  if (status === 401) return { status, title: 'Требуется вход', message: 'Сессия истекла. Войдите снова.', retryAfter: null }
  if (status === 404) {
    return { status, title: 'Не найдено', message: 'Запрошенные данные не найдены.', retryAfter: null }
  }

  if (status === null) {
    return {
      status,
      title: 'Нет соединения',
      message: 'Проверьте подключение к сети и повторите попытку.',
      retryAfter: null,
    }
  }

  return {
    status,
    title: 'Ошибка запроса',
    message: body?.message ?? 'Что-то пошло не так. Попробуйте ещё раз.',
    retryAfter: null,
  }
}

