import { defineStore } from 'pinia'
export const usePreferencesStore = defineStore('preferences', () => {
  const density = ref<'comfortable' | 'compact'>('comfortable')
  function load() { try { density.value = localStorage.getItem('workflow-density') === 'compact' ? 'compact' : 'comfortable' } catch {} }
  watch(density, value => { if (import.meta.client) try { localStorage.setItem('workflow-density', value) } catch {} })
  return { density, load }
})
