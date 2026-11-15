<!-- Карточка заявки (макет 1.05): описание, комментарии, timeline, параметры. -->
<script setup lang="ts">
import type { RequestPriority } from '~/types'

const route = useRoute()
const store = useRequestsStore()

const id = computed(() => Number(route.params.id))
const request = computed(() => store.getById(id.value))

if (!request.value) {
  throw createError({ statusCode: 404, statusMessage: 'Заявка не найдена', fatal: true })
}

useHead({ title: () => request.value?.title ?? 'Заявка' })

function onComment(text: string) {
  store.addComment(id.value, text)
}

function onSaveParams(payload: { assignee: string | null; priority: RequestPriority }) {
  store.assign(id.value, payload.assignee)
  store.setPriority(id.value, payload.priority)
}
</script>

<template>
  <div v-if="request" class="page container">
    <NuxtLink to="/requests" class="back-link">
      <AppIcon name="arrow-left" :size="14" />
      К списку заявок
    </NuxtLink>

    <header class="request-head">
      <h1 class="request-head__title">{{ request.title }}</h1>
      <p class="request-head__meta">
        {{ formatRequestNumber(request.id) }} · Создана {{ formatDateTime(request.createdAt) }}
      </p>
      <div class="request-head__badges">
        <RequestStatusBadge :status="request.status" />
        <RequestPriorityBadge :priority="request.priority" />
      </div>
    </header>

    <div class="request-layout">
      <div class="request-layout__main">
        <section class="block panel" aria-labelledby="desc-title">
          <h2 id="desc-title" class="block__title">Описание проблемы</h2>
          <p class="block__text">{{ request.description || 'Описание не заполнено.' }}</p>
        </section>

        <section class="block panel" aria-labelledby="comments-title">
          <h2 id="comments-title" class="block__title">Комментарии · {{ request.comments.length }}</h2>
          <RequestComments :comments="request.comments" @submit="onComment" />
        </section>

        <section class="block panel" aria-labelledby="history-title">
          <h2 id="history-title" class="block__title">История заявки</h2>
          <RequestTimeline :events="request.timeline" />
        </section>
      </div>

      <aside class="request-layout__side" aria-label="Параметры заявки">
        <RequestParams :request="request" @save="onSaveParams" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  padding: 4px 0;
  font-size: var(--fs-sm);
}

.request-head {
  margin-bottom: 24px;
}

.request-head__title {
  font-size: var(--fs-xl);
}

.request-head__meta {
  margin-top: 8px;
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
}

.request-head__badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.request-layout {
  display: grid;
  gap: 16px;
}

.request-layout__main {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.block {
  padding: 20px;
}

.block__title {
  margin-bottom: 12px;
  font-size: var(--fs-lg);
}

.block__text {
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

@media (min-width: 768px) {
  .request-head__title {
    font-size: var(--fs-2xl);
  }
}

@media (min-width: 1024px) {
  .request-layout {
    grid-template-columns: minmax(0, 1fr) 320px;
    align-items: start;
  }

  .request-layout__side {
    position: sticky;
    top: calc(var(--header-h) + 16px);
  }
}
</style>
