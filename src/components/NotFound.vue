<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import router from '@/router'
import { useErrorStore } from '@/stores/error'

const { t } = useI18n()

const errorStore = useErrorStore()
router.afterEach(() => {
  errorStore.clearError()
})
</script>

<template>
  <div class="container mx-auto">
    <section class="prose lg:prose-xl max-w-prose pt-8 pb-14">
      <h1>{{ t('pages.notFound.title') }}</h1>
      <p>
        {{ t('pages.notFound.lost', 1) }}
        <RouterLink :to="{ name: 'home' }">{{ t('pages.notFound.lost', 2) }}</RouterLink
        >.
      </p>
      <img src="@/assets/images/zegut-francis.jpg" alt="404" width="1100" height="1020" />
    </section>
  </div>
</template>

<style scoped></style>
