import { afterEach, expect, test, vi } from 'vitest'
import { ref,nextTick,effectScope } from 'vue'
import { useDebouncedRef } from '../../app/composables/useDebounce'
afterEach(()=>vi.useRealTimers())
test('search publishes only the latest value after a quiet period',async()=>{
 vi.useFakeTimers()
 const scope=effectScope()
 const source=ref('')
 const debounced=scope.run(()=>useDebouncedRef(source,350))!
 source.value='C';await nextTick();await vi.advanceTimersByTimeAsync(200)
 source.value='CRM';await nextTick();await vi.advanceTimersByTimeAsync(349)
 expect(debounced.value).toBe('')
 await vi.advanceTimersByTimeAsync(1)
 expect(debounced.value).toBe('CRM')
 scope.stop()
})
test('disposed search cannot publish a pending update',async()=>{
 vi.useFakeTimers()
 const scope=effectScope(),source=ref('before')
 const debounced=scope.run(()=>useDebouncedRef(source,350))!
 source.value='after';await nextTick();scope.stop()
 await vi.advanceTimersByTimeAsync(500)
 expect(debounced.value).toBe('before')
})
