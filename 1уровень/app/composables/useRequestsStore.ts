import type {
  NewRequestPayload,
  RequestPriority,
  RequestStatus,
  SupportRequest,
} from '~/types'

let uid = 0
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${++uid}`

/**
 * Локальное хранилище заявок. На следующих уровнях здесь появятся
 * запросы к API — интерфейс composable при этом останется прежним.
 */
export function useRequestsStore() {
  const requests = useState<SupportRequest[]>('requests', () => createMockRequests())
  const user = useCurrentUser()

  function getById(id: number): SupportRequest | undefined {
    return requests.value.find((request) => request.id === id)
  }

  function addTimelineEvent(request: SupportRequest, type: SupportRequest['timeline'][number]['type'], text: string) {
    request.timeline.push({
      id: nextId('t'),
      type,
      text,
      author: user.value.name,
      createdAt: new Date().toISOString(),
    })
  }

  function addComment(id: number, text: string) {
    const request = getById(id)
    const trimmed = text.trim()
    if (!request || !trimmed) return

    request.comments.push({
      id: nextId('c'),
      author: user.value.name,
      text: trimmed,
      createdAt: new Date().toISOString(),
    })
    addTimelineEvent(request, 'comment', 'добавила комментарий')
  }

  function assign(id: number, assignee: string | null) {
    const request = getById(id)
    if (!request || request.assignee === assignee) return

    request.assignee = assignee
    if (assignee && request.status === 'new') request.status = 'assigned'
    addTimelineEvent(
      request,
      'assigned',
      assignee ? `назначила исполнителя: ${assignee}` : 'сняла исполнителя',
    )
  }

  function setPriority(id: number, priority: RequestPriority) {
    const request = getById(id)
    if (!request || request.priority === priority) return

    request.priority = priority
    addTimelineEvent(request, 'priority', `изменила приоритет на «${PRIORITY_LABELS[priority]}»`)
  }

  function setStatus(id: number, status: RequestStatus) {
    const request = getById(id)
    if (!request || request.status === status) return

    request.status = status
    addTimelineEvent(request, 'status', `изменила статус на «${STATUS_LABELS[status]}»`)
  }

  function create(payload: NewRequestPayload): SupportRequest {
    const id = Math.max(0, ...requests.value.map((request) => request.id)) + 1
    const now = new Date()
    const request: SupportRequest = {
      id,
      ...payload,
      assignee: null,
      status: 'new',
      createdAt: now.toISOString(),
      dueAt: new Date(now.getTime() + 4 * 60 * 60_000).toISOString(),
      comments: [],
      timeline: [
        {
          id: nextId('t'),
          type: 'created',
          text: 'создала заявку',
          author: user.value.name,
          createdAt: now.toISOString(),
        },
      ],
    }
    requests.value.unshift(request)
    return request
  }

  return { requests, getById, addComment, assign, setPriority, setStatus, create }
}
