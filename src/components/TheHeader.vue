<script setup lang="ts">
// UserStore
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
// @ts-ignore
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
    <nav class="text-xs">
      <RouterLink
        v-if="user"
        :to="{ name: 'profil', params: { id: user.id } }"
        class="relative rounded-full bg-black border-2 border-black w-8 h-8 overflow-hidden flex items-center justify-center"
      >
        <img
          v-if="user?.images[0]?.url"
          :src="user?.images[0]?.url"
          :alt="user?.display_name"
          :title="user?.display_name"
          width="40"
          height="40"
          class="absolute top-0 left-0 w-full h-full object-cover"
        />
        <span v-else class="text-amber-500 text-lg font-extrabold leading-none">
          {{ user?.display_name?.charAt(0) }}
        </span>
      </RouterLink>
      <RouterLink class="router-link" v-if="!user" :to="{ name: 'login' }">
        {{ t('common.signIn') }}
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.router-link.router-link-active {
  display: none;
}
</style>
