<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { watchEffect } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
// @ts-ignore
import { useI18n } from 'vue-i18n'
import AppLoader from '@/components/AppLoader.vue'

const { t } = useI18n()
const router = useRouter()

const authStore = useAuthStore()
const { isLoading, hasError, isAuthenticated } = storeToRefs(authStore)

const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const redirectDelay = 3000

const params = new URLSearchParams(window.location.search)
const code = params.get('code') || ''

// Let's login
authStore.login(client_id, code)

const { start } = useTimeoutFn(
  () => {
    router.push({ name: 'home' })
  },
  redirectDelay,
  { immediate: false }
)

watchEffect(() => {
  if (isAuthenticated.value) {
    start()
  }
})
</script>

<template>
  <main>
    <div class="container mx-auto">
      <section class="prose lg:prose-xl max-w-prose pt-8 pb-14">
        <h1>{{ t('pages.redirect.title') }}</h1>
        <template v-if="hasError">
          <pre>Error: {{ authStore.hasError }}</pre>
        </template>
        <template v-else-if="isLoading">
          <p>
            {{ t('common.pleaseWait') }}

            <AppLoader class="ml-4" />
          </p>
        </template>
        <template v-else>
          <p>
            {{ t('pages.redirect.loginSuccess') }}
            {{ t('common.pleaseWait') }}.
            <AppLoader class="ml-4" />
          </p>
        </template>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
