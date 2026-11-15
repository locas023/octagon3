<!-- Публичный layout: главная, вход, будущие публичные страницы. -->
<script setup lang="ts">
const route = useRoute()
// Страница может попросить упрощённую шапку без навигации (например, /login).
const minimal = computed(() => route.meta.minimalHeader === true)
</script>

<template>
  <div class="public-layout">
    <a href="#main" class="skip-link">Перейти к содержимому</a>
    <LayoutPublicHeader :minimal="minimal" />
    <main id="main" class="public-layout__main" tabindex="-1">
      <slot />
    </main>
    <footer v-if="!minimal" class="footer">
      <div class="container footer__inner">
        <span>WorkFlow © 2026</span>
        <nav class="footer__nav" aria-label="Дополнительная навигация">
          <NuxtLink to="/#steps">Помощь</NuxtLink>
          <span aria-hidden="true">·</span>
          <NuxtLink to="/#faq">FAQ</NuxtLink>
        </nav>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.public-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.public-layout__main {
  flex: 1;
}

.footer {
  border-top: 1px solid var(--c-border);
  background: rgba(18, 15, 48, 0.6);
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 56px;
  padding-block: 12px;
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.footer__nav {
  display: flex;
  gap: 8px;
}

.footer__nav a {
  color: var(--c-text-muted);
}

.footer__nav a:hover {
  color: var(--c-text);
}
</style>
