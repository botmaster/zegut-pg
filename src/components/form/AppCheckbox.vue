<script setup lang="ts">
import AppFormErrorMessage from '@/components/form/AppFormErrorMessage.vue'
import UniqueID from '@/utils/uuid'

const uuid = UniqueID().getID()

defineProps<{
  modelValue: boolean
  label?: string
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [payload: boolean]
}>()

const updateValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <div class="relative flex items-start flex-wrap">
    <div class="flex h-6 items-center">
      <input
        v-bind="{ ...$attrs, onChange: updateValue }"
        :checked="modelValue"
        :id="uuid"
        type="checkbox"
        class="form-checkbox h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
      />
    </div>
    <div class="ml-3 leading-6" v-if="label">
      <label :for="uuid" v-if="label" class="font-medium pr-1.5">
        {{ label }}
      </label>
      <slot />
    </div>

    <AppFormErrorMessage v-if="error" :id="`${uuid}-error`" class="w-full">
      {{ error }}
    </AppFormErrorMessage>
  </div>
</template>

<style scoped></style>
