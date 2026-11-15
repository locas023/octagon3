<script setup lang="ts">
const open = defineModel<boolean>('open', { required: true })

withDefaults(defineProps<{ title: string; description?: string }>(), { description: undefined })

const dialog = ref<HTMLElement | null>(null)
const titleId = useId()
const descriptionId = useId()

useFocusTrap(dialog, open)

function close() {
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.stopPropagation()
    close()
  }
}

// Блокируем прокрутку страницы под модальным окном
watch(open, (value) => {
  if (import.meta.client) document.body.style.overflow = value ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal" @keydown="onKeydown">
        <div class="modal__backdrop" aria-hidden="true" @click="close" />
        <div
          ref="dialog"
          class="modal__dialog"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="description ? descriptionId : undefined"
          tabindex="-1"
        >
          <header class="modal__header">
            <div>
              <h2 :id="titleId" class="modal__title">{{ title }}</h2>
              <p v-if="description" :id="descriptionId" class="modal__description">{{ description }}</p>
            </div>
            <button type="button" class="modal__close" aria-label="Закрыть окно" @click="close">
              <AppIcon name="close" :size="18" />
            </button>
          </header>
          <div class="modal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="modal__footer">
            <slot name="footer" :close="close" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 16px;
}

.modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(8, 6, 28, 0.72);
  backdrop-filter: blur(3px);
}

.modal__dialog {
  position: relative;
  width: 100%;
  max-width: 520px;
  max-height: calc(100vh - 32px);
  overflow: auto;
  background: var(--c-surface);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

.modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 20px 0;
}

.modal__title {
  font-size: var(--fs-lg);
}

.modal__description {
  margin-top: 4px;
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
}

.modal__close {
  display: grid;
  flex-shrink: 0;
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
    color var(--transition);
}

.modal__close:hover {
  background: var(--c-surface-2);
  color: var(--c-text);
}

.modal__body {
  padding: 20px;
}

.modal__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 20px 20px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 180ms ease;
}

.modal-enter-active .modal__dialog,
.modal-leave-active .modal__dialog {
  transition: transform 180ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal__dialog,
.modal-leave-to .modal__dialog {
  transform: translateY(12px) scale(0.98);
}
</style>
