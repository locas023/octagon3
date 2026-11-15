<script setup lang="ts">
import type { NavItem } from '~/types'

withDefaults(defineProps<{ minimal?: boolean }>(), { minimal: false })

// Публичные разделы появятся на уровне 6 — ссылки ведут на якоря главной.
const nav: NavItem[] = [
  { to: '/', label: 'Главная' },
  { to: '/#features', label: 'Статьи' },
  { to: '/#steps', label: 'Помощь' },
  { to: '/#faq', label: 'FAQ' },
]

const menu = ref<HTMLElement | null>(null)
const toggle = ref<HTMLElement | null>(null)
const { open, toggleMenu, onToggleKeydown, onMenuKeydown, onFocusOut } = useMenuNavigation({
  menu,
  toggle,
})
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <AppLogo />

      <template v-if="!minimal">
        <nav class="header__nav" aria-label="Основная навигация">
          <NuxtLink v-for="item in nav" :key="item.label" :to="item.to" class="header__link">
            {{ item.label }}
          </NuxtLink>
        </nav>

        <UiButton to="/login" variant="secondary" size="sm" class="header__login">Войти</UiButton>

        <button
          ref="toggle"
          type="button"
          class="header__burger"
          :aria-expanded="open"
          aria-controls="public-mobile-menu"
          :aria-label="open ? 'Закрыть меню' : 'Открыть меню'"
          @click="toggleMenu"
          @keydown="onToggleKeydown"
        >
          <AppIcon :name="open ? 'close' : 'menu'" :size="20" />
        </button>
      </template>
    </div>

    <nav
      v-if="!minimal"
      v-show="open"
      id="public-mobile-menu"
      ref="menu"
      class="mobile-menu"
      aria-label="Мобильная навигация"
      @keydown="onMenuKeydown"
      @focusout="onFocusOut"
    >
      <ul class="container">
        <li v-for="item in nav" :key="item.label">
          <NuxtLink :to="item.to" class="mobile-menu__link">{{ item.label }}</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/login" class="mobile-menu__link">Войти</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header__inner {
  display: flex;
  align-items: center;
  gap: 24px;
  min-height: var(--header-h);
}

.header__nav {
  display: none;
  gap: 4px;
  margin-left: auto;
}

.header__link {
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--c-text);
  transition: background var(--transition);
}

.header__link:hover {
  background: var(--c-surface-2);
  text-decoration: none;
}

.header__login {
  display: none;
}

.header__burger {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-left: auto;
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  background: transparent;
  color: var(--c-text);
  cursor: pointer;
  transition: background var(--transition);
}

.header__burger:hover {
  background: var(--c-surface-2);
}

.mobile-menu {
  border-block: 1px solid var(--c-border);
  background: var(--c-bg-deep);
}

.mobile-menu ul {
  display: flex;
  flex-direction: column;
  padding-block: 8px;
}

.mobile-menu__link {
  display: block;
  padding: 12px 8px;
  border-radius: var(--radius);
  font-weight: 500;
  color: var(--c-text);
}

.mobile-menu__link:hover {
  background: var(--c-surface-2);
  text-decoration: none;
}

@media (min-width: 768px) {
  .header__nav,
  .header__login {
    display: flex;
  }

  .header__burger,
  .mobile-menu {
    display: none !important;
  }
}
</style>
