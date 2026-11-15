import type { Ref } from 'vue'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function getFocusable(root: HTMLElement | null | undefined): HTMLElement[] {
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('hidden') && el.offsetParent !== null,
  )
}

/**
 * Удерживает фокус внутри контейнера, пока active = true.
 * При деактивации возвращает фокус на элемент, который был активен до открытия.
 */
export function useFocusTrap(container: Ref<HTMLElement | null>, active: Ref<boolean>) {
  let previouslyFocused: HTMLElement | null = null

  function onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return
    const items = getFocusable(container.value)
    if (items.length === 0) {
      event.preventDefault()
      return
    }
    const first = items[0]!
    const last = items[items.length - 1]!
    const current = document.activeElement

    if (event.shiftKey && (current === first || !container.value?.contains(current))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && current === last) {
      event.preventDefault()
      first.focus()
    }
  }

  watch(active, async (isActive) => {
    if (!import.meta.client) return
    if (isActive) {
      previouslyFocused = document.activeElement as HTMLElement | null
      await nextTick()
      // data-autofocus может стоять на обёртке поля — тогда фокусируем первый интерактивный элемент внутри
      const autofocus = container.value?.querySelector<HTMLElement>('[autofocus], [data-autofocus]')
      const target = autofocus
        ? (autofocus.matches('input, select, textarea, button') ? autofocus : getFocusable(autofocus)[0])
        : getFocusable(container.value)[0]
      ;(target ?? container.value)?.focus()
      document.addEventListener('keydown', onKeydown)
    } else {
      document.removeEventListener('keydown', onKeydown)
      previouslyFocused?.focus()
      previouslyFocused = null
    }
  })

  onBeforeUnmount(() => {
    if (import.meta.client) document.removeEventListener('keydown', onKeydown)
  })
}
