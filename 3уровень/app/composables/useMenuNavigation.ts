import type { Ref } from 'vue'

/**
 * Клавиатурная навигация по меню-раскрывашке:
 * Esc — закрыть и вернуть фокус на кнопку, стрелки/Home/End — перемещение по пунктам,
 * Tab за пределы меню — закрыть.
 */
export function useMenuNavigation(options: {
  menu: Ref<HTMLElement | null>
  toggle: Ref<HTMLElement | null>
}) {
  const open = ref(false)
  const route = useRoute()

  const items = () =>
    Array.from(options.menu.value?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])

  async function show(focus: 'first' | 'last' | 'none' = 'none') {
    open.value = true
    if (focus === 'none') return
    await nextTick()
    const list = items()
    ;(focus === 'first' ? list[0] : list[list.length - 1])?.focus()
  }

  function hide(returnFocus = false) {
    open.value = false
    if (returnFocus) options.toggle.value?.focus()
  }

  function toggleMenu() {
    if (open.value) hide()
    else show('first')
  }

  function onToggleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      show('first')
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      show('last')
    }
  }

  function onMenuKeydown(event: KeyboardEvent) {
    const list = items()
    const index = list.indexOf(document.activeElement as HTMLElement)

    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        hide(true)
        break
      case 'ArrowDown':
        event.preventDefault()
        list[(index + 1) % list.length]?.focus()
        break
      case 'ArrowUp':
        event.preventDefault()
        list[(index - 1 + list.length) % list.length]?.focus()
        break
      case 'Home':
        event.preventDefault()
        list[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        list[list.length - 1]?.focus()
        break
    }
  }

  function onFocusOut(event: FocusEvent) {
    const next = event.relatedTarget as Node | null
    if (!next) return
    if (options.menu.value?.contains(next) || options.toggle.value?.contains(next)) return
    hide()
  }

  // Закрываем меню при переходе на другую страницу
  watch(() => route.fullPath, () => hide())

  return { open, show, hide, toggleMenu, onToggleKeydown, onMenuKeydown, onFocusOut }
}
