// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: { databaseUrl: process.env.DATABASE_URL },
  compatibilityDate: '2025-07-15',
  modules: ['@pinia/nuxt'],
  devtools: { enabled: false },
  // На Windows «localhost» может резолвиться только в IPv6 (::1) — слушаем явный IPv4-адрес.
  devServer: { host: '127.0.0.1', port: 3004 },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'WorkFlow',
      titleTemplate: '%s · WorkFlow',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'WorkFlow — система обработки заявок поддержки' },
        { name: 'theme-color', content: '#17143a' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
  typescript: {
    strict: true,
  },
})



