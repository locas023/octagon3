// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: { databaseUrl: process.env.DATABASE_URL, public: { siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3008' } },
  compatibilityDate: '2025-07-15',
  modules: ['@pinia/nuxt'],
  routeRules: { '/api/**': { headers: { 'Cache-Control': 'no-store' } }, '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } } },
  devtools: { enabled: false },
  // На Windows «localhost» может резолвиться только в IPv6 (::1) — слушаем явный IPv4-адрес.
  devServer: { host: '127.0.0.1', port: 3008 },
  css: ['@fontsource-variable/montserrat','~/assets/css/main.css','~/assets/css/knowledge.css'],
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
      ],
    },
  },
  typescript: {
    strict: true,
  },
})
