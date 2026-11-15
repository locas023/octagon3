<script setup lang="ts" generic="T extends string">
import type { SelectOption } from '~/types'

const model = defineModel<T>({ required: true })

withDefaults(
  defineProps<{
    label: string
    options: SelectOption<T>[]
    disabled?: boolean
    hideLabel?: boolean
  }>(),
  { disabled: false, hideLabel: false },
)

const id = useId()
</script>

<template>
  <div class="select" :class="{ 'select--disabled': disabled }">
    <label :for="id" class="field-label" :class="{ 'visually-hidden': hideLabel }">{{ label }}</label>
    <div class="select__wrap">
      <!-- Нативный select: клавиатура (стрелки, Home/End, поиск по буквам) работает из коробки -->
      <select :id="id" v-model="model" class="select__control" :disabled="disabled">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <AppIcon name="chevron-down" :size="14" class="select__icon" />
    </div>
  </div>
</template>

<style scoped>
.select {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.select__wrap {
  position: relative;
}

.select__control {
  width: 100%;
  min-height: var(--control-h);
  padding: 0 36px 0 14px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  background: var(--c-surface-2);
  font-size: var(--fs-sm);
  color: var(--c-text);
  appearance: none;
  cursor: pointer;
  transition:
    border-color var(--transition),
    background var(--transition),
    box-shadow var(--transition);
}

.select__control option {
  background: var(--c-surface);
  color: var(--c-text);
}

.select__control:hover:not(:disabled) {
  border-color: var(--c-border-strong);
  background: var(--c-surface-3);
}

.select__control:focus-visible {
  outline: none;
  border-color: var(--c-focus);
  box-shadow: 0 0 0 3px rgba(157, 140, 255, 0.25);
  border-radius: var(--radius);
}

.select__control:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.select__icon {
  position: absolute;
  top: 50%;
  right: 14px;
  color: var(--c-text-muted);
  transform: translateY(-50%);
  pointer-events: none;
}
</style>
