<script setup lang="ts">
// Intercept axios requests
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import { useHead } from '@vueuse/head'

axios.interceptors.request.use(
  (config) => {
    // console.log('axios request', config)
    return config
  },
  (error) => {
    console.error('axios request error', error)
    return Promise.reject(error)
  }
)

// Intercept axios responses
axios.interceptors.response.use(
  (response) => {
    // console.log('Axios interceptors response', response)
    return response
  },
  (error) => {
    console.error('Axios interceptors response error', error)

    // If token is expired, logout
    if (error.response.status === 401) {
      console.warn('Http 401 error, logging out')
      useAuthStore().logout()
    }
    return Promise.reject(error)
  }
)

useHead({
  titleTemplate: (title?: string) => (!title ? 'Zégut PG 🤘' : `${title} - Zégut PG 🤘`)
})
</script>

<template>
  <div class="layout">
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
