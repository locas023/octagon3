<script setup lang="ts">
const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    label: string
    type?: 'text' | 'email' | 'password' | 'search' | 'date'
    placeholder?: string
    error?: string
    hint?: string
    disabled?: boolean
    required?: boolean
    autocomplete?: string
    hideLabel?: boolean
    multiline?: boolean
    rows?: number
    minlength?: number | string
    maxlength?: number | string
  }>(),
  {
    type: 'text',
    placeholder: undefined,
    error: undefined,
    hint: undefined,
    disabled: false,
    required: false,
    autocomplete: undefined,
    hideLabel: false,
    multiline: false,
    rows: 4,
  },
)

const id = useId()
const describedBy = computed(() => {
  if (props.error) return `${id}-error`
  if (props.hint) return `${id}-hint`
  return undefined
})

const field = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)
defineExpose({ focus: () => field.value?.focus() })
</script>

<template>
  <div class="field" :class="{ 'field--error': error, 'field--disabled': disabled }">
    <label :for="id" class="field-label" :class="{ 'visually-hidden': hideLabel }">
      {{ label }}<span v-if="required" aria-hidden="true"> *</span>
    </label>
    <textarea
      v-if="multiline"
      :id="id"
      ref="field"
      v-model="model"
      class="control control--area"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :minlength="minlength"
      :maxlength="maxlength"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
    />
    <input
      v-else
      :id="id"
      ref="field"
      v-model="model"
      class="control"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :minlength="minlength"
      :maxlength="maxlength"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
    >
    <p v-if="error" :id="`${id}-error`" class="field__error" role="alert">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.control {
  width: 100%;
  min-height: var(--control-h);
  padding: 0 14px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius);
  background: var(--c-surface-2);
  font-size: var(--fs-sm);
  color: var(--c-text);
  transition:
    border-color var(--transition),
    background var(--transition),
    box-shadow var(--transition);
}

.control--area {
  padding: 12px 14px;
  resize: vertical;
  line-height: 1.5;
}

.control::placeholder {
  color: var(--c-text-faint);
}

.control:hover:not(:disabled) {
  border-color: var(--c-border-strong);
  background: var(--c-surface-3);
}

.control:focus-visible {
  outline: none;
  border-color: var(--c-focus);
  box-shadow: 0 0 0 3px rgba(157, 140, 255, 0.25);
  border-radius: var(--radius);
}

.control:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.field--disabled .field-label {
  color: var(--c-text-faint);
}

.field--error .control {
  border-color: var(--c-danger);
}

.field--error .control:focus-visible {
  box-shadow: 0 0 0 3px rgba(255, 93, 143, 0.25);
}

.field__error,
.field__hint {
  margin-top: 6px;
  font-size: var(--fs-xs);
}

.field__error {
  color: var(--c-danger);
}

.field__hint {
  color: var(--c-text-muted);
}
</style>
