<script setup lang="ts">
// UserStore
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { user, isLoading: isUserLoading, hasError: hasUserError } = storeToRefs(userStore)
</script>

<template>
  <header
    class="min-h-[--header-height] flex items-center justify-between border-b border-gray-100 bg-white fixed top-0 w-full px-8"
  >
    <div class="">
      <p class="text-amber-500 text-2xl font-extrabold">
        <RouterLink to="/">ZPG</RouterLink>
      </p>
    </div>
    <nav>{{ user?.display_name }}</nav>
  </header>
</template>

<style scoped></style>
