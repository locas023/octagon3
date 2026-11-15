import type { SupportRequest } from '~/types'

export interface StatItem {
  key: string
  label: string
  value: number
  hint: string
}

export function computeStats(list: SupportRequest[]): StatItem[] {
  const count = (predicate: (request: SupportRequest) => boolean) => list.filter(predicate).length

  return [
    {
      key: 'new',
      label: 'Новые заявки',
      value: count((r) => r.status === 'new'),
      hint: 'Ожидают назначения',
    },
    {
      key: 'progress',
      label: 'В работе',
      value: count((r) => r.status === 'assigned' || r.status === 'in_progress'),
      hint: 'Назначены исполнителям',
    },
    {
      key: 'waiting',
      label: 'Ожидают ответа',
      value: count((r) => r.status === 'waiting'),
      hint: 'Нужна информация',
    },
    {
      key: 'resolved',
      label: 'Решены',
      value: count((r) => r.status === 'resolved'),
      hint: 'За эту неделю',
    },
  ]
}

/** Сводка по заявкам для Dashboard и списка. */
export function useRequestStats() {
  const { requests } = useRequestsStore()
  return computed(() => computeStats(requests.value))
}
