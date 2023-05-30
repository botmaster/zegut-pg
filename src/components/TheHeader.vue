<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

// UserStore
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
// @ts-ignore
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const authStore = useAuthStore()

const logoutClickHandler = () => {
  console.log('logoutClickHandler')
  authStore.logout()
}
</script>

<template>
  <header
    class="min-h-[--header-height] flex items-center justify-between border-b border-gray-100 backdrop-blur-sm bg-white/95 fixed top-0 w-full px-4 md:px-8"
  >
    <div class="">
      <p class="text-amber-500 text-2xl font-extrabold">
        <RouterLink to="/">Zégut PG</RouterLink>
      </p>
    </div>
    <nav class="flex gap-x-3 items-center text-sm leading-none">
      <a
        href="https://github.com/botmaster/zegut-pg"
        target="_blank"
        ref="noopener"
        title="Github - Source code"
      >
        <Icon class="inline-block text-2xl" icon="ph:github-logo" /><span class="sr-only"
          >Github - Source code</span
        >
      </a>

      <!-- User menu     -->

      <Menu as="div" class="relative text-left leading-[0]">
        <RouterLink
          v-if="!user"
          class="router-link relative flex items-center justify-center px-4 h-8 rounded-full bg-black border-2 border-black font-medium text-white overflow-hidden"
          :to="{ name: 'login' }"
        >
          <Icon class="inline-block text-base mr-2" icon="material-symbols:login" />
          <span> {{ t('common.signIn') }}</span>
        </RouterLink>
        <MenuButton v-else>
          <span
            class="relative rounded-full bg-white/50 w-6 h-6 overflow-hidden flex items-center justify-center border-2 border-current"
          >
            <img
              v-if="user?.images && user?.images[0]?.url"
              :src="user?.images[0]?.url"
              :alt="user?.display_name"
              :title="user?.display_name"
              width="40"
              height="40"
              class="absolute top-0 left-0 w-full h-full object-cover"
            />
            <span v-else class="text-base font-extrabold leading-none" :title="user?.display_name">
              {{ user?.display_name?.charAt(0) }}
            </span>
          </span>
        </MenuButton>

        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <MenuItems
            class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-zinc-600 rounded bg-zinc-700 shadow-lg ring-1 ring-zinc-900 ring-opacity-5 focus:outline-none text-white font-medium"
          >
            <div class="px-1 py-1" v-if="user">
              <MenuItem v-slot="{ active, close }">
                <RouterLink
                  :class="[
                    active ? 'bg-zinc-500 text-white' : 'text-[inherit]',
                    'group flex w-full items-center rounded-sm px-2 py-1.5 leading-snug'
                  ]"
                  :to="{ name: 'profil', params: { id: user.id } }"
                  @click="close"
                >
                  {{ t('nav.profil') }}
                </RouterLink>
              </MenuItem>
            </div>
            <div class="px-1 py-1">
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active ? 'bg-zinc-500 text-white' : 'text-[inherit]',
                    'group flex w-full items-center rounded-sm px-2 py-1.5 leading-snug'
                  ]"
                  @click="logoutClickHandler"
                >
                  {{ t('common.logout') }}
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </nav>
  </header>
</template>

<style scoped></style>
