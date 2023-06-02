<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { usePlaylistsStore } from '@/stores/playlistsStore'
import { ref, watch } from 'vue'
// @ts-ignore
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import PlaylistItem from '@/components/PlaylistItem.vue'
import AppLoader from '@/components/AppLoader.vue'
import AppPagination from '@/components/AppPagination.vue'

const { t } = useI18n()

// AuthStore
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

// UserStore
const userStore = useUserStore()
const { user, isLoading: isUserLoading, hasError: hasUserError } = storeToRefs(userStore)

// PlaylistsStore
const playlistsStore = usePlaylistsStore()
const {
  playlists,
  isLoading: isPlaylistsLoading,
  hasError: hasPlaylistsError
} = storeToRefs(playlistsStore)

const logoutClickHandler = () => {
  console.log('logoutClickHandler')
  authStore.logout()
}

// Local state
const pageSize = 50
const currentPage = ref(1)

// Refs
const playlistListRef = ref<HTMLElement | null>(null)

// Methods

const scrollListToTop = () => {
  const listElement = playlistListRef.value as HTMLElement
  if (listElement) {
    listElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

watch(
  currentPage,
  async (newPage, oldPage) => {
    if (!user?.value) {
      await userStore.fetchUserCurrentUser()
    }
    if (newPage === oldPage || !newPage) return
    await playlistsStore.fetchPlaylists(pageSize, (newPage - 1) * pageSize)
    scrollListToTop()
  },
  { immediate: true }
)
</script>

<template>
  <main>
    <div class="container mx-auto">
      <section class="prose lg:prose-xl max-w-prose pt-8 pb-14">
        <h1>
          {{ t('pages.profil.title') }}
          <Icon class="inline-block text-2xl align-baseline" icon="logos:spotify-icon"></Icon>
        </h1>

        <pre v-if="hasUserError">
            {{ hasUserError }}
          </pre
        >

        <template v-else-if="isUserLoading">
          <p>{{ t('common.loading') }}</p>
        </template>

        <template v-else>
          <p v-if="!isAuthenticated">
            {{ t('pages.profil.notLoggedIn') }}
            <RouterLink v-if="!isAuthenticated" :to="{ name: 'login' }" class="btn btn-primary">{{
              t('common.login')
            }}</RouterLink>
          </p>

          <div v-else>
            <template v-if="user">
              <h2>
                <i18n-t keypath="pages.profil.loggedAs" tag="span" scope="global">
                  <template #name>
                    <span class="font-extrabold">{{ user.display_name }}</span>
                  </template>
                </i18n-t>
              </h2>
              <div class="md:flex gap-x-8">
                <figure class="shrink-0 !my-0" v-if="user.images && user.images.length > 0">
                  <img
                    :src="user.images[0].url"
                    :alt="user.display_name"
                    class="w-48 h-48 border border-zinc-100"
                  />
                </figure>
                <div class="text-base">
                  <ul class="p-0 !mt-0 !list-inside !md:list-outside min-w-0">
                    <li class="truncate">
                      {{ t('pages.profil.details.profilId') }}
                      <span class="font-medium">{{ user.id }}</span>
                    </li>
                    <li class="truncate">
                      {{ t('pages.profil.details.spotifyUrl') }}
                      <a :href="user.external_urls?.spotify" target="_blank" rel="noopener">{{
                        user.external_urls?.spotify
                      }}</a>
                    </li>
                    <li class="truncate">
                      {{ t('pages.profil.details.spotifyUri') }}
                      <a :href="user.uri" target="_blank"> {{ user.uri }}</a>
                    </li>
                    <li>
                      {{ t('pages.profil.details.followers') }}
                      <span class="font-medium">{{ user.followers?.total }}</span>
                    </li>
                  </ul>
                  <p class="mt-2 md:mt-4">
                    <button class="inline-flex btn btn-border" @click="logoutClickHandler">
                      {{ t('common.logout') }}
                    </button>
                  </p>
                </div>
              </div>

              <!-- user playlists -->
              <h2 class="text-2xl">
                {{ t('pages.profil.playlists') }}

                <transition name="fade" mode="out-in">
                  <AppLoader v-if="isPlaylistsLoading" class="text-2xl ml-3"></AppLoader
                  ><span v-else-if="playlists" class="text-xs text-zinc-500"
                    >{{ playlists?.total }}
                  </span>
                </transition>
              </h2>
              <pre v-if="hasPlaylistsError">
                {{ hasPlaylistsError }}
              </pre>
              <div
                ref="playlistListRef"
                v-else
                class="not-prose max-h-[50vh] overflow-y-auto bg-zinc-50 rounded p-2"
              >
                <ul v-if="playlists" class="not-prose list-none text-sm flex flex-col gap-y-2">
                  <li v-for="playlist in playlists.items" :key="playlist.id">
                    <PlaylistItem :playlist="playlist"></PlaylistItem>
                  </li>
                </ul>
              </div>
              <app-pagination
                v-if="
                  playlists?.items && playlists?.items.length > 0 && playlists?.total > pageSize
                "
                v-model="currentPage"
                :total-items="playlists?.total"
                :items-per-page="pageSize"
                class="not-prose mt-6"
              />
            </template>
          </div>
        </template>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
