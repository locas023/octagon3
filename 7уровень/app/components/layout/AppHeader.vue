<script setup lang="ts">
import type { NavItem } from '~/types'
const user=useCurrentUser()
const nav=computed<NavItem[]>(()=>[
 {to:'/dashboard',label:'Обзор'},{to:'/requests',label:'Заявки'},
 ...(user.value.role==='admin'?[{to:'/admin/users',label:'Пользователи'},{to:'/admin/customers',label:'Клиенты'},{to:'/admin/categories',label:'Категории'}]:[]),
 ...(user.value.role!=='agent'?[{to:'/new-request',label:'Создать заявку'}]:[]),
 {to:'/logout',label:'Выйти'},
])
const menu=ref<HTMLElement|null>(null),toggle=ref<HTMLElement|null>(null)
const {open,toggleMenu,onToggleKeydown,onMenuKeydown,onFocusOut}=useMenuNavigation({menu,toggle})
</script>
<template>
 <header class="header"><div class="container header__inner"><AppLogo to="/dashboard"/>
 <nav class="header__nav" aria-label="Основная навигация"><NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="header__link">{{item.label}}</NuxtLink></nav>
 <div class="header__actions"><NuxtLink to="/profile" class="header__user" aria-label="Профиль"><UiAvatar :name="user.name"/><span class="header__role">{{ROLE_LABELS[user.role]}}</span></NuxtLink><button ref="toggle" type="button" class="icon-btn header__burger" :aria-expanded="open" aria-controls="app-mobile-menu" :aria-label="open?'Закрыть меню':'Открыть меню'" @click="toggleMenu" @keydown="onToggleKeydown"><AppIcon :name="open?'close':'menu'" :size="20"/></button></div></div>
 <nav v-show="open" id="app-mobile-menu" ref="menu" class="mobile-menu" aria-label="Мобильная навигация" @keydown="onMenuKeydown" @focusout="onFocusOut"><ul class="container"><li v-for="item in [...nav,{to:'/profile',label:'Профиль'}]" :key="item.to"><NuxtLink :to="item.to" class="mobile-menu__link">{{item.label}}</NuxtLink></li></ul></nav>
 </header>
</template>
<style scoped>
.header{position:sticky;top:0;z-index:20;background:var(--c-bg);border-bottom:1px solid var(--c-border)}.header__inner{display:flex;align-items:center;gap:16px;min-height:var(--header-h)}.header__nav{display:none;gap:10px;flex:1;flex-wrap:wrap;justify-content:flex-end;min-width:0;font-size:12px}.header__link{padding-block:8px}.header__actions{display:flex;align-items:center;gap:10px;margin-left:auto}.header__user{display:flex;align-items:center;gap:8px}.header__role{display:none;font-size:12px}.icon-btn{display:grid;place-items:center;min-width:36px;min-height:36px}.mobile-menu ul{display:grid;max-height:calc(100dvh - var(--header-h));overflow:auto;padding-block:8px}.mobile-menu__link{display:block;padding:12px 8px}.router-link-active{color:var(--c-cyan)}@media(min-width:1100px){.header__nav{display:flex}.header__burger,.mobile-menu{display:none!important}.header__role{display:inline}}
</style>
