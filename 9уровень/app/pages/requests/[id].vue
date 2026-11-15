<!-- Карточка заявки (макеты 1.05, 2.07 загрузка, 2.08 ошибка). Данные — GET /api/requests/:id -->
<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const id = computed(() => Number(route.params.id))
const { request, error, notFound, loading, refresh } = useRequest(id)

// Несуществующая заявка — полноценная страница 404
watch(
  notFound,
  (value) => {
    if (value) showError({ statusCode: 404, statusMessage: 'Заявка не найдена' })
  },
  { immediate: true },
)

useHead({ title: () => request.value?.title ?? 'Заявка' })

const retrying = ref(false)
async function retry() {
  retrying.value = true
  try {
    if (route.query.simulate) await router.replace({ query: {} })
    else await refresh()
  } finally {
    retrying.value = false
  }
}
</script>

<template>
  <div class="page container">
    <NuxtLink to="/requests" class="back-link">
      <AppIcon name="arrow-left" :size="14" />
      К списку заявок
    </NuxtLink>

    <RequestDetailSkeleton v-if="loading" />

    <UiErrorBlock v-else-if="error && !notFound" :error="error" :retrying="retrying" @retry="retry" />

    <template v-else-if="request">
      <header class="request-head">
        <h1 class="request-head__title" :class="{ 'is-untitled': request.untitled }">{{ request.title }}</h1>
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
            <p class="block__text">{{ request.description ?? 'Описание не заполнено.' }}</p>
          </section>

          <section class="block panel" aria-labelledby="comments-title">
            <h2 id="comments-title" class="block__title">Комментарии · {{ request.comments.length }}</h2>
            <RequestComments :comments="request.comments" /><RequestAttachments :id="request.id"/>
          </section>

          <section class="block panel" aria-labelledby="history-title">
            <h2 id="history-title" class="block__title">История заявки</h2>
            <RequestTimeline :events="request.timeline" />
          </section>
        </div>

        <aside class="request-layout__side" aria-label="Параметры заявки">
          <RequestParams :request="request" /><RequestActions :id="request.id" />
        </aside>
      </div>
    </template>
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
  overflow-wrap: anywhere;
}

.request-head__title.is-untitled {
  font-style: italic;
  color: var(--c-text-muted);
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
  overflow-wrap: anywhere;
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


