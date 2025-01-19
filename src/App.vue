<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import { useHead } from '@vueuse/head'
import { useErrorStore } from '@/stores/error'
import AppErrorPage from '@/components/app-error/AppErrorPage.vue'
import NotFound from '@/components/NotFound.vue'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

useHead({
  titleTemplate: (title?: string) => (!title ? 'Zégut PG 🤘' : `${title} - Zégut PG 🤘`)
})

const errorStore = useErrorStore()

const { activeError } = storeToRefs(errorStore)
const is404 = computed(() => {
  const error = activeError.value
  if (error && 'customCode' in error) {
    return error.customCode === 404
  }
  return false
})
</script>

<template>
  <div class="layout">
    <div v-if="is404">
      <NotFound />
    </div>
    <div v-else-if="errorStore.activeError" class="absolute inset-0 h-screen bg-background">
      <AppErrorPage />
    </div>
    <template v-else>
      <TheHeader />
      <RouterView class="pt-[--header-height] grow shrink-0" />
      <TheFooter />
    </template>
  </div>
</template>

<style scoped>
.layout {
  --header-height: 60px;

  @apply relative min-h-screen flex flex-col;
}
</style>
