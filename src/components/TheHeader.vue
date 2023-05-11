<script setup lang="ts">
// UserStore
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>

<template>
  <header
    class="min-h-[--header-height] flex items-center justify-between border-b border-gray-100 backdrop-blur-sm bg-white/95 fixed top-0 w-full px-8"
  >
    <div class="">
      <p class="text-amber-500 text-2xl font-extrabold">
        <RouterLink to="/">Zegut PG</RouterLink>
      </p>
    </div>
    <nav>
      <RouterLink v-if="user" :to="{ name: 'profil', params: { id: user.id } }">
        <img
          :src="user?.images[0]?.url"
          :alt="user?.display_name"
          :title="user?.display_name"
          width="40"
          height="40"
          class="rounded-full border"
        />
      </RouterLink>
      <RouterLink v-if="!user" :to="{ name: 'login' }"> {{ t('common.login') }} </RouterLink>
    </nav>
  </header>
</template>

<style scoped></style>
