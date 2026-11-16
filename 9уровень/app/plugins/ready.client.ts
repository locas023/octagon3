export default defineNuxtPlugin(() => {
  // app:mounted can fire while an async page is still hydrating.
  onNuxtReady(() => { document.documentElement.dataset.appReady = 'true' })
})
