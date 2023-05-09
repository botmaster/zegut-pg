<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { watchEffect } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import { Icon } from '@iconify/vue'

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
        <h1>Sign in ZPG in progress</h1>
        <template v-if="hasError">
          <pre>Error: {{ authStore.hasError }}</pre>
        </template>
        <template v-else-if="isLoading">
          <p>
            Please wait <Icon class="inline-block" icon="svg-spinners:pulse-rings-multiple"></Icon>
          </p>
        </template>
        <template v-else>
          <p>
            Successful login 💪. You will be redirected to the home page. Please wait.
            <Icon class="inline-block" icon="svg-spinners:pulse-rings-multiple"></Icon>
          </p>
        </template>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
