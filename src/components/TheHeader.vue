<script setup lang="ts">
// UserStore
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
// @ts-ignore
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>

<template>
  <header
    class="min-h-[--header-height] flex items-center justify-between border-b border-gray-100 backdrop-blur-sm bg-white/95 fixed top-0 w-full px-4 md:px-8">
    <div class="">
      <p class="text-amber-500 text-2xl font-extrabold">
        <RouterLink to="/">Zegut PG</RouterLink>
      </p>
    </div>
    <nav class="flex gap-x-3 items-center text-sm">
      <a href="https://github.com/botmaster/zegut-pg" target="_blank" ref="noopener" title="Github - Source code">
        <Icon class="inline-block text-2xl" icon="ph:github-logo" /><span class="sr-only">Github - Source code</span>
      </a>
      <RouterLink v-if="!user"
        class="router-link relative flex items-center justify-center px-4 h-8 rounded-full bg-black border-2 border-black font-medium text-white overflow-hidden"
        :to="{ name: 'login' }">
        <Icon class="inline-block text-base mr-2" icon="material-symbols:login" />
        <span> {{ t('common.signIn') }}</span>
      </RouterLink>
      <RouterLink v-else :to="{ name: 'profil', params: { id: user.id } }"
        class="relative rounded-full bg-white/50 w-6 h-6 overflow-hidden flex items-center justify-center border-2 border-current">
        <img v-if="user?.images && user?.images[0]?.url" :src="user?.images[0]?.url" :alt="user?.display_name"
          :title="user?.display_name" width="40" height="40" class="absolute top-0 left-0 w-full h-full object-cover" />
        <span v-else class="text-base font-extrabold leading-none">
          {{ user?.display_name?.charAt(0) }}
        </span>
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.router-link.router-link-active {
  display: none;
}
</style>
