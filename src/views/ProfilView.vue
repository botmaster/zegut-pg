<script setup lang="ts">
// AuthStore
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { usePlaylistsStore } from '@/stores/playlistsStore'
import { onMounted } from 'vue'
// @ts-ignore
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import PlaylistItem from '@/components/PlaylistItem.vue'
import AppLoader from '@/components/AppLoader.vue'
import { useToast } from 'vue-toastification'

const { t } = useI18n()
const toast = useToast()

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

onMounted(async () => {
  // Get user profil id from url params
  // const id = route.params.id

  // Get user profil
  // userStore.getUserProfile(id)
  if (!user?.value) {
    await userStore.fetchUserCurrentUser()
  }

  // Get user playlists
  try {
    await playlistsStore.fetchPlaylists(50)
  } catch (error) {
    console.error(error)
    toast.error(t('common.commonError'))
  }
})
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

                <AppLoader v-if="isPlaylistsLoading"></AppLoader
                ><span v-else-if="playlists" class="text-xs text-zinc-500"
                  >{{ playlists.items.length }}/{{ playlists.total }}</span
                >
              </h2>
              <pre v-if="hasPlaylistsError">
                {{ hasPlaylistsError }}
              </pre>
              <div v-else class="not-prose max-h-80 overflow-y-auto bg-zinc-50 rounded p-2">
                <ul v-if="playlists" class="not-prose list-none text-sm flex flex-col gap-y-2">
                  <li v-for="playlist in playlists.items" :key="playlist.id">
                    <PlaylistItem :playlist="playlist"></PlaylistItem>
                  </li>
                </ul>
              </div>

              <pre class="!text-xs !mt-12">{{ user }}</pre>
            </template>
          </div>
        </template>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
