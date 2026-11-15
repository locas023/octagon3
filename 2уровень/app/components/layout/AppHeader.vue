<script setup lang="ts">
import type { NavItem } from '~/types'

const user = useCurrentUser()

const nav: NavItem[] = [
  { to: '/dashboard', label: 'Обзор' },
  { to: '/requests', label: 'Заявки' },
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
      <AppLogo to="/dashboard" />

      <!-- Desktop / tablet -->
      <nav class="header__nav" aria-label="Основная навигация">
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="header__link">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="header__actions">
        <button type="button" class="icon-btn" aria-label="Уведомления (пока нет новых)">
          <AppIcon name="bell" :size="18" />
        </button>
        <NuxtLink to="/profile" class="header__user" aria-label="Профиль">
          <UiAvatar :name="user.name" />
          <span class="header__role">{{ ROLE_LABELS[user.role] }}</span>
        </NuxtLink>

        <!-- Mobile -->
        <button
          ref="toggle"
          type="button"
          class="icon-btn header__burger"
          :aria-expanded="open"
          aria-controls="app-mobile-menu"
          :aria-label="open ? 'Закрыть меню' : 'Открыть меню'"
          @click="toggleMenu"
          @keydown="onToggleKeydown"
        >
          <AppIcon :name="open ? 'close' : 'menu'" :size="20" />
        </button>
      </div>
    </div>

    <nav
      v-show="open"
      id="app-mobile-menu"
      ref="menu"
      class="mobile-menu"
      aria-label="Мобильная навигация"
      @keydown="onMenuKeydown"
      @focusout="onFocusOut"
    >
      <ul class="container">
        <li v-for="item in nav" :key="item.to">
          <NuxtLink :to="item.to" class="mobile-menu__link">{{ item.label }}</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/profile" class="mobile-menu__link">Профиль</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(23, 20, 58, 0.86);
  border-bottom: 1px solid var(--c-border);
  backdrop-filter: blur(10px);
}

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
  transition:
    background var(--transition),
    color var(--transition);
}

.header__link:hover {
  background: var(--c-surface-2);
  text-decoration: none;
}

.header__link.router-link-active {
  color: var(--c-cyan);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid transparent;
  border-radius: var(--radius);
  background: transparent;
  color: var(--c-text-muted);
  cursor: pointer;
  transition:
    background var(--transition),
    color var(--transition),
    border-color var(--transition);
}

.icon-btn:hover {
  background: var(--c-surface-2);
  color: var(--c-text);
}

.header__user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border-radius: var(--radius);
  color: var(--c-text-muted);
  font-size: var(--fs-xs);
}

.header__user:hover {
  color: var(--c-text);
  text-decoration: none;
}

.header__role {
  display: none;
}

.mobile-menu {
  border-top: 1px solid var(--c-border);
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

.mobile-menu__link.router-link-active {
  color: var(--c-cyan);
}

@media (min-width: 768px) {
  .header__nav {
    display: flex;
  }

  .header__actions {
    margin-left: 0;
  }

  .header__role {
    display: inline;
  }

  .header__burger,
  .mobile-menu {
    display: none !important;
  }
}
</style>
