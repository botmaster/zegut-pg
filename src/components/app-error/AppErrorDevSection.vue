<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  message: string
  customCode: number
  code: string
  statusCode: number
  hint: string | null
  details: string
  rawError?: any
}>()
</script>

<template>
  <div>
    <Icon icon="lucide:triangle-alert" class="error__icon" />
    <h1 class="error__code">{{ customCode || code }}</h1>
    <p class="error__code" v-if="statusCode">Status Code: {{ statusCode }}</p>
    <p class="error__msg">{{ message }}</p>
    <p v-if="hint">{{ hint }}</p>
    <p v-if="details">{{ details }}</p>
    <pre class="text-left text-xs max-h-64 overflow-y-auto" v-if="rawError">{{
      rawError.stack
    }}</pre>
    <div class="error-footer">
      <p class="error-footer__text">You'll find lots to explore on the home page.</p>
      <RouterLink to="/">
        <button class="btn btn-primary">Back to homepage</button>
      </RouterLink>
    </div>
  </div>
</template>
