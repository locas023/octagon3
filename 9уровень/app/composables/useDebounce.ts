import { ref, watch, readonly, getCurrentScope, onScopeDispose, type Ref } from 'vue'

/**
 * Возвращает ref, который обновляется только после паузы `delay` мс
 * в изменениях исходного значения. Используется для поиска,
 * чтобы не отправлять запрос на каждый введённый символ.
 */
export function useDebouncedRef<T>(source: Ref<T>, delay = 350): Readonly<Ref<T>> {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(source, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = value
    }, delay)
  })

  if (getCurrentScope()) {
    onScopeDispose(() => clearTimeout(timer))
  }

  return readonly(debounced) as Readonly<Ref<T>>
}
