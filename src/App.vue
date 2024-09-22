<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import { useHead } from '@vueuse/head'
import { onErrorCaptured } from 'vue'
import { useErrorStore } from '@/stores/error'
import AppErrorPage from '@/components/AppError/AppErrorPage.vue'

useHead({
  titleTemplate: (title?: string) => (!title ? 'Zégut PG 🤘' : `${title} - Zégut PG 🤘`)
})

const errorStore = useErrorStore()
onErrorCaptured((error, vm, info) => {
  console.error('!!!!!!', error, vm, info)
  errorStore.setError({ error })
  return false
})
//const objEl = ref<HTMLElement | null>(null)
/*onMounted(() => {
  setTimeout(() => {
    objEl.value.innerHTML = 'hi'
  }, 3000)
})*/
</script>

<template>
  <div class="layout">
    <AppErrorPage v-if="errorStore.activeError" />
    <TheHeader />

    <RouterView class="pt-[--header-height] grow shrink-0" />
    <TheFooter />
  </div>
</template>

<style scoped>
.layout {
  --header-height: 60px;

  @apply min-h-screen flex flex-col;
}
</style>
