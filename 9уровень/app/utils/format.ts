// Фиксированная таймзона, чтобы SSR и клиент выводили одинаковое время.
const TIME_ZONE = 'Europe/Moscow'

const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TIME_ZONE,
})

const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TIME_ZONE,
})

const shortDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  timeZone: TIME_ZONE,
})

/** «5 октября, 09:14» */
export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso)).replace(' в ', ', ')
}

/** «09:14» */
export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso))
}

/** «5 окт.» */
export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(iso))
}

/** «#1042» */
export function formatRequestNumber(id: number): string {
  return `#${id}`
}

/** «Анна Кузнецова» → «АК» */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/** Склонение: pluralize(3, ['заявка', 'заявки', 'заявок']) → «заявки» */
export function pluralize(count: number, forms: [string, string, string]): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}
