<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
// @ts-ignore
import { DateTimeOptions, useI18n } from 'vue-i18n'
import { usePreferredLanguages } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'

import {
  addTracksToPlaylist,
  createPlaylist,
  getPlaylist,
  searchTracks
} from '@/services/spotify.service'
import { usePodcastStore } from '@/stores/podcastStore'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import AppLoader from '@/components/AppLoader.vue'
import EpisodeSelector from '@/components/EpisodeSelector.vue'
import AppInput from '@/components/form/AppInput.vue'
import AppCheckbox from '@/components/form/AppCheckbox.vue'

// Preferred language
const languages = usePreferredLanguages()
const longDateOptions: DateTimeOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
}

// i18n
const { t } = useI18n()

// AuthStore
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

// UserStore
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

// PodcastStore
const podcastStore = usePodcastStore()
const {
  podcast,
  episodesTypeIntegral,
  currentEpisode,
  isLoading: isPodcastLoading,
  hasError: hasPodcastError
} = storeToRefs(podcastStore)

// Toast
const toast = useToast()

// Reactive variables
const spotifyPlaylist = ref<SpotifyApi.PlaylistObjectFull | null>(null)

// Playlist form
const formPlaylist = reactive<{ name: string; description: string; public: boolean }>({
  name: 'Zégut playlist',
  description: 'Zégut playlist description',
  public: false
})

// Local store
const isCreatePlaylistPending = ref(false)
const hasCreatePlaylistError = ref<boolean | any>(false)
const currentEpisodeId = useRouteQuery('id')
const spotifySearchResultList = ref<Array<SpotifyApi.TrackObjectFull | { id: null; name: string }>>(
  []
)
const isSearchPending = ref(false)
const hasSearchError = ref<boolean | any>(false)

/**
 * Computed
 */
const episodeTrackList = computed(() => {
  const content = currentEpisode.value?.content.split('\n') || []
  return content.filter((track) => !track.toLowerCase().includes('reprise') && track !== '')
})

const episodeInfos = computed(() => {
  const date = new Date(currentEpisode.value?.published || '').toLocaleDateString(
    languages.value,
    longDateOptions
  )

  const author = currentEpisode.value?.itunes_author || ''

  return {
    title: currentEpisode.value?.title || '',
    description: date && author ? t('pages.home.publishedDateByAuth', { date, author }) : '',
    duration: currentEpisode.value?.itunes_duration || ''
  }
})

const lastEpisodeDate = computed(() => {
  return new Date(podcast.value?.items[0]?.published || '').toLocaleDateString(
    languages.value,
    longDateOptions
  )
})

/**
 * Methods
 */

// Search tracks in paralell
const searchTracksInParallel = async () => {
  // console.log('searchTracksInParallel')

  // Search tracks in parallel
  try {
    isSearchPending.value = true
    hasSearchError.value = false
    spotifySearchResultList.value = await Promise.all(
      episodeTrackList.value.map(async (trackItem) => {
        const tracks = await searchTracks({
          query: trackItem
        })
        const track = tracks?.tracks?.items[0]
        if (!track) {
          return {
            name: trackItem,
            id: null
          }
        }
        return track
      })
    )
  } catch (error) {
    hasSearchError.value = error
    toast.error(t('pages.home.toast.searchTracksError') + error)
    console.error(error)
  } finally {
    isSearchPending.value = false
  }
}

/**
 * Events handlers
 */

const fetchPodcast = async () => {
  console.log('fetchPodcast')

  try {
    // Fetch podcast
    await podcastStore.fetchPodcast()
    //toast.success(t('pages.home.toast.fetchPodcastSuccess'))
  } catch (error) {
    toast.error(t('pages.home.toast.fetchPodcastError') + error)
    console.error(error)
  } finally {
    isPodcastLoading.value = false
  }
}

const createPlaylistSubmitHandler = async () => {
  // console.log('createPlaylistSubmitHandler')

  try {
    // Set pending, error.
    isCreatePlaylistPending.value = true
    hasCreatePlaylistError.value = false

    // Get ids
    let tracksIds = spotifySearchResultList.value.map((track) => track?.id)

    // Get tracks without id
    const tracksWithoutId = spotifySearchResultList.value.filter((track) => !track?.id)
    console.log('Tracks not found!', tracksWithoutId)

    // Remove tracks without id
    tracksIds = tracksIds.filter((trackId) => trackId)

    // if no tracks found
    if (tracksIds.length === 0) {
      toast.warning(
        t('pages.home.toast.playlistError') + Error(t('common.noTracksFound').toString())
      )
      return
    }

    // Ask user to add tracks without id
    if (tracksWithoutId.length > 0) {
      const tracksWithoutIdToString = tracksWithoutId.map((track) => track).join(', ')

      const confirm = window.confirm(
        tracksWithoutIdToString +
          '\n' +
          "Ces titres n'ont pas été trouvés sur Spotify. Continuer la création de la playlist ?"
      )
      if (!confirm) {
        toast.error(
          t('pages.home.toast.playlistError') + Error(t('common.someTracksNotFound').toString())
        )
        return
      }
    }

    // Create playlist
    spotifyPlaylist.value = await createPlaylist({
      name: formPlaylist.name,
      description: formPlaylist.description,
      isPublic: formPlaylist.public,
      userId: user.value?.id || ''
    })

    // Add tracks to playlist
    const uris = tracksIds.map((trackId) => `spotify:track:${trackId}`)
    console.log('uris', uris)
    await addTracksToPlaylist(spotifyPlaylist.value?.id || '', uris)

    spotifyPlaylist.value = await getPlaylist(
      spotifyPlaylist.value?.id || '',
      'name, description,tracks.items(track(name,href,album(name,href))), uri, external_urls.spotify'
    )

    toast.success(t('pages.home.toast.playlistCreated'))
  } catch (error) {
    hasCreatePlaylistError.value = error
    toast.error(t('pages.home.toast.playlistError') + error)
    console.error(error)
  } finally {
    isCreatePlaylistPending.value = false
  }
}

/**
 * Vue watch
 */

watch(
  currentEpisode,
  (value) => {
    // console.log('currentEpisode changed', value)
    if (!value) {
      return
    }

    formPlaylist.name = value?.title ? `By Zégut 🤘 ${value.title}` : ''
    formPlaylist.description = episodeInfos.value.description || ''
    spotifyPlaylist.value = null
  },
  { immediate: true }
)

watch(
  currentEpisodeId,
  async (value) => {
    if (!value) {
      await fetchPodcast()
      currentEpisodeId.value = episodesTypeIntegral.value[0].id
      return
    }

    await podcastStore.fetchEpisodeById(String(value))
    if (isAuthenticated.value) {
      await searchTracksInParallel()
    }
  },
  { immediate: true }
)

/**
 * Vue lifecycle
 */

onMounted(async () => {
  console.log('HomeView mounted')

  // fetch current user
  if (isAuthenticated.value && !user.value) {
    await userStore.fetchUserCurrentUser()
  }

  // Fetch podcast if not already fetched
  if (!podcast.value) {
    //await fetchPodcast()
  }
})
</script>

<template>
  <main>
    <div class="container mx-auto pt-8 pb-14">
      <section class="prose lg:prose-lg max-w-prose">
        <h1 class="mb-8">{{ t('pages.home.title') }}</h1>
        <figure>
          <blockquote>
            <p class="whitespace-pre-line">
              {{ t('pages.home.quote') }}
            </p>
          </blockquote>
          <figcaption>
            — {{ t('pages.home.caption') }}, <cite>{{ t('pages.home.cite') }}</cite>
          </figcaption>
        </figure>

        <i18n-t keypath="pages.home.intro" tag="p" scope="global">
          <template #link>
            <a
              href="https://www.rtl2.fr/programmes/poprockstation"
              target="_blank"
              ref="noopener"
              >{{ t('common.rtl2PopRockStation ') }}</a
            >
          </template>
        </i18n-t>
      </section>

      <!-- Podcast   -->
      <section class="prose lg:prose-lg max-w-prose mt-14">
        <h2 class="">
          {{ t('common.podcast', 1) }}
          <transition name="fade" mode="out-in">
            <AppLoader v-if="isPodcastLoading" class="inline-block ml-4" />
          </transition>
        </h2>
        <template v-if="hasPodcastError">
          <p>{{ t('pages.home.toast.fetchPodcastError') }}</p>
          <pre>{{ hasPodcastError }}</pre>
        </template>
        <template v-else-if="isPodcastLoading">
          <p>{{ t('common.loading') }}</p>
        </template>
        <template v-else-if="!isPodcastLoading && !hasPodcastError">
          <p class="font-bold">
            {{ podcast?.title }}
          </p>
          <p>
            {{ podcast?.description.replace(/<[^>]+>/g, '') }}
          </p>
          <p>
            {{ t('pages.home.episodesCount', podcast?.items?.length) }}.
            {{ t('pages.home.lastUpdate', { date: lastEpisodeDate }) }}.
          </p>

          <EpisodeSelector
            :episodes="episodesTypeIntegral"
            v-model="currentEpisodeId"
          ></EpisodeSelector>

          <template v-if="currentEpisode">
            <h3 class="">{{ t('common.episode') }}</h3>

            <div class="md:flex">
              <img
                v-if="currentEpisode?.itunes_image"
                :src="currentEpisode.itunes_image"
                :alt="episodeInfos.description"
                :width="500"
                :height="500"
                class="w-full md:w-1/4 md:h-1/4 md:mr-6 md:!my-0 shrink-0 border border-zinc-100"
                :title="episodeInfos.description"
                loading="lazy"
              />
              <div>
                <p class="grow leading-snug">{{ episodeInfos.title }}.</p>
                <p class="text-sm">
                  {{ episodeInfos.description }}.<br />{{ t('common.duration') }} :
                  {{ episodeInfos.duration }}
                </p>
              </div>
            </div>
            <div class="md:flex gap-x-4">
              <div class="flex-1">
                <!-- Podcast track list -->
                <h4 class="">
                  {{ t('pages.home.podcastTrackList') }} ({{ episodeTrackList.length }})
                </h4>
                <ol
                  class="not-prose text-sm max-h-64 overflow-auto bg-zinc-50 list-inside !px-3 py-2"
                  tabindex="0"
                >
                  <li v-for="(track, index) in episodeTrackList" :key="index">{{ track }}</li>
                </ol>
              </div>
              <div v-if="isAuthenticated" class="flex-1">
                <!-- Spotify track list -->
                <h4 class="">
                  {{ t('pages.home.foundedSpotifyTracks') }} (<AppLoader
                    v-if="isSearchPending"
                  /><span v-else>{{ spotifySearchResultList?.length }}</span
                  >)
                </h4>
                <ol
                  class="not-prose text-sm max-h-64 overflow-auto bg-zinc-50 list-inside !px-3 py-2"
                  tabindex="0"
                  v-if="!isSearchPending && !hasSearchError"
                >
                  <li v-for="(item, index) in spotifySearchResultList" :key="index">
                    <span v-if="item.id">{{ item.artists[0].name }} - {{ item.name }}</span>
                    <span v-else>{{ item }}</span>
                  </li>
                </ol>
              </div>
            </div>
          </template>
        </template>
      </section>

      <!-- User Profil       -->
      <section class="prose lg:prose-lg max-w-prose mt-14" v-if="!isAuthenticated">
        <h2 class="">{{ t('pages.home.userProfil') }}</h2>
        <p>
          {{ t('pages.home.notLogged') }}
          <RouterLink v-if="!isAuthenticated" :to="{ name: 'login' }">{{
            t('common.signIn')
          }}</RouterLink
          >.
        </p>
      </section>

      <!-- Create Spotify Playlist       -->
      <section
        class="prose lg:prose-lg max-w-prose mt-14"
        v-if="isAuthenticated && episodeTrackList.length"
      >
        <h2 class="">{{ t('pages.home.createSpotifyPlaylist') }}</h2>
        <form @submit.prevent="createPlaylistSubmitHandler">
          <div class="flex flex-col gap-y-3 not-prose">
            <div>
              <AppInput
                v-model="formPlaylist.name"
                :label="t('pages.home.form.playlistName')"
                required
              />
            </div>
            <div>
              <AppInput
                v-model="formPlaylist.description"
                :label="t('pages.home.form.playlistDescription')"
                required
              />
            </div>
            <div>
              <AppCheckbox
                v-model="formPlaylist.public"
                :label="t('pages.home.form.public') + '.'"
                name="playlistPublic"
              >
                <span class="text-gray-500"
                  ><span class="sr-only">{{ t('pages.home.form.public') }}</span
                  >{{ t('pages.home.form.onProfil') }}</span
                >
              </AppCheckbox>
            </div>
          </div>

          <div class="mt-4 flex items-center gap-y-4">
            <button
              v-if="!spotifyPlaylist"
              type="submit"
              :disabled="isCreatePlaylistPending || hasSearchError"
              class="btn btn-primary"
            >
              {{ t('pages.home.form.ctaCreatePlaylist') }}
              <AppLoader class="ml-2" v-if="isCreatePlaylistPending" />
            </button>
          </div>
        </form>
        <div class="not-prose" v-if="hasCreatePlaylistError">
          <p class="text-sm mt-2 text-red-600">
            {{ t('pages.home.enableToCreateTheSpotifyPlaylist') }}
          </p>
        </div>
        <template v-else>
          <div v-if="spotifyPlaylist" class="">
            <p class="">{{ t('pages.home.toast.playlistCreated') }}</p>
            <p class="">
              {{ t('pages.home.openPlaylistBrowser') }}&nbsp;<a
                :href="spotifyPlaylist.external_urls.spotify"
                target="_blank"
              >
                {{ t('common.here').toLowerCase() }}</a
              >
              <br />{{ t('pages.home.openPlaylistSpotify') }}&nbsp;<a :href="spotifyPlaylist.uri">{{
                t('common.here')
              }}</a>
            </p>

            <pre class="!text-xs max-h-64">{{ spotifyPlaylist }}</pre>
          </div>
        </template>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
