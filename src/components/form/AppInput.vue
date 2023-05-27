<script setup lang="ts">
import AppFormErrorMessage from '@/components/form/AppFormErrorMessage.vue'
import UniqueID from '../../utils/uuid'

defineProps<{
  modelValue: string | number
  label?: string
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [payload: string | number]
}>()

const uuid = UniqueID().getID()

const updateValue = (event: Event) => {
  let val = (event.target as HTMLInputElement).value
  emit('update:modelValue', val)
}
</script>

<template>
  <label v-if="label" :for="uuid" class="font-medium">
    {{ label }}
  </label>
  <input
    class="form-input"
    v-bind="{
      ...$attrs,
      onInput: updateValue
    }"
    :id="uuid"
    :value="modelValue"
    :placeholder="label"
    :aria-describedby="error ? `${uuid}-error` : undefined"
    :aria-invalid="!!error"
    :class="{ error }"
  />

  <AppFormErrorMessage v-if="error" :id="`${uuid}-error`">
    {{ error }}
  </AppFormErrorMessage>
</template>

<style scoped></style>
