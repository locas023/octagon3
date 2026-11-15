<!-- Карточка заявки · Загрузка (макет 2.07) -->
<template>
  <div class="detail-skeleton" role="status" aria-live="polite" aria-busy="true">
    <span class="visually-hidden">Загружаем заявку…</span>
    <div class="bar bar--title" aria-hidden="true" />
    <div class="bar bar--meta" aria-hidden="true" />
    <div class="layout" aria-hidden="true">
      <div class="main">
        <div v-for="block in 3" :key="block" class="block panel">
          <div class="bar bar--heading" />
          <div class="bar" />
          <div class="bar bar--short" />
        </div>
      </div>
      <div class="block panel side">
        <div class="bar bar--heading" />
        <div v-for="row in 4" :key="row" class="bar" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bar {
  height: 10px;
  margin-bottom: 12px;
  border-radius: 5px;
  background: var(--c-surface-3);
  animation: pulse 1.4s ease-in-out infinite;
}

.bar--title {
  width: 60%;
  height: 28px;
  margin-bottom: 16px;
}

.bar--meta {
  width: 30%;
  margin-bottom: 28px;
}

.bar--heading {
  width: 40%;
  height: 16px;
  margin-bottom: 16px;
}

.bar--short {
  width: 55%;
}

.layout {
  display: grid;
  gap: 16px;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.block {
  padding: 20px;
}

@media (min-width: 1024px) {
  .layout {
    grid-template-columns: minmax(0, 1fr) 320px;
    align-items: start;
  }
}

@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}
</style>
