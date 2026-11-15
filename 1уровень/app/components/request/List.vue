<!-- Адаптивный список: таблица от 768px, карточки на мобильной ширине. -->
<script setup lang="ts">
import type { SupportRequest } from '~/types'

withDefaults(
  defineProps<{
    requests: SupportRequest[]
    caption?: string
  }>(),
  { caption: 'Список заявок' },
)

const { density } = useUiPreferences()
</script>

<template>
  <div class="request-list">
    <RequestTable
      class="request-list__table"
      :requests="requests"
      :caption="caption"
      :compact="density === 'compact'"
    />
    <ul class="request-list__cards" :class="{ 'is-compact': density === 'compact' }" :aria-label="caption">
      <li v-for="request in requests" :key="request.id">
        <RequestCard :request="request" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.request-list__table {
  display: none;
}

.request-list__cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.request-list__cards.is-compact {
  gap: 8px;
}

@media (min-width: 768px) {
  .request-list__table {
    display: block;
  }

  .request-list__cards {
    display: none;
  }
}
</style>
