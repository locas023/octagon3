<!-- Layout приложения: для авторизованных разделов (dashboard, заявки, профиль). -->
<template>
  <div class="app-layout">
    <a href="#main" class="skip-link">Перейти к содержимому</a>
    <LayoutAppHeader />
    <main id="main" class="app-layout__main" tabindex="-1">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-layout__main {
  flex: 1;
}
</style>
