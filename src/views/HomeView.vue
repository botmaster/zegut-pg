<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import type { Playlist } from '@/types/types'
import { useToast } from 'vue-toastification'
// @ts-ignore
import { DateTimeOptions, useI18n } from 'vue-i18n'
import {
  addTracksToPlaylist,
  createPlaylist,
  getPlaylist,
  searchTracks
} from '@/services/spotify.service'
import AppLoader from '@/components/AppLoader.vue'
import { usePodcastStore } from '@/stores/podcastStore'
import { usePreferredLanguages } from '@vueuse/core'

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
const { user, isLoading: isUserLoading, hasError: hasUserError } = storeToRefs(userStore)

// PodcastStore
const podcastStore = usePodcastStore()
const {
  rss,
  episodes,
  currentEpisode,
  isLoading: isPodcastLoading,
  hasError: hasPodcastError
} = storeToRefs(podcastStore)

// Toast
const toast = useToast()

// Reactive variables
const spotifyPlaylist = ref<Playlist | null>(null)

// Playlist form
const formPlaylist = reactive<{ name: string; description: string; public: boolean }>({
  name: 'Zégut playlist',
  description: 'Zégut playlist description',
  public: false
})

// Local state
const hasScrapeError = ref<boolean | any>(false)

const isCreatePlaylistPending = ref(false)
const hasCreatePlaylistError = ref<boolean | any>(false)

/**
 * Computed
 */
const episodeTrackList = computed(() => {
  const content = currentEpisode.value?.content.split('\n') || []
  return content.filter((track) => !track.toLowerCase().includes('reprise') && track !== '')
})

const podcastInfos = computed(() => {
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
  const date = new Date(rss.value?.items[0]?.published || '').toLocaleDateString(
    languages.value,
    longDateOptions
  )

  return date
})

/**
 * Events handlers
 */

const fetchPodcast = async () => {
  // console.log('fetchPodcast')

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
    // TODO: Create type for track

    // Set pending, error.
    isCreatePlaylistPending.value = true
    hasCreatePlaylistError.value = false

    // Search tracks in parallel
    const tracks = await Promise.all(
      episodeTrackList.value.map(async (trackItem) => {
        const tracks = await searchTracks({
          query: trackItem
        })
        const track = tracks?.tracks?.items[0]
        if (!track) {
          return trackItem
        }
        return track
      })
    )

    // Get ids
    let tracksIds = tracks.map((track) => track?.id)

    // Get tracks without id
    const tracksWithoutId = tracks.filter((track) => !track?.id)
    console.log('Tracks not found!', tracksWithoutId)

    // if no tracks found
    if (tracksIds.length === 0) {
      toast.error(t('pages.home.toast.playlistError') + Error(t('common.noTracksFound').toString()))
      return
    }

    // Create playlist
    const createPlaylistData = await createPlaylist({
      name: formPlaylist.name,
      description: formPlaylist.description,
      isPublic: formPlaylist.public,
      userId: user.value?.id || ''
    })
    spotifyPlaylist.value = createPlaylistData

    // Add tracks to playlist
    const uris = tracksIds.map((trackId) => `spotify:track:${trackId}`)
    console.log('uris', uris)
    await addTracksToPlaylist(spotifyPlaylist.value?.id || '', uris)

    const getPlaylistData = await getPlaylist(
      spotifyPlaylist.value?.id || '',
      'name, description,tracks.items(track(name,href,album(name,href))), uri, external_urls.spotify'
    )

    spotifyPlaylist.value = getPlaylistData

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

watch(currentEpisode, (value) => {
  // console.log('currentEpisode changed', value)
  formPlaylist.name = value?.title ? `By Zégut 🤘 ${value.title}` : ''
  formPlaylist.description = podcastInfos.value.description || ''
})

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
  if (!rss.value) {
    await fetchPodcast()
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
            <p class="whitespace-pre">
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
          {{ t('common.podcast', 1)
          }}<transition name="fade" mode="out-in"
            ><AppLoader v-if="isPodcastLoading" class="inline-block ml-4"
          /></transition>
        </h2>
        <template v-if="hasPodcastError">
          <p>{{ t('pages.home.podcastError') }}</p>
          <pre>{{ hasPodcastError }}</pre>
        </template>
        <template v-else-if="isPodcastLoading">
          <p>{{ t('common.loading') }}</p>
        </template>
        <template v-else-if="!isPodcastLoading && !hasScrapeError">
          <p class="font-bold">
            {{ rss?.title }}
          </p>
          <p>
            {{ rss?.description.replace(/<[^>]+>/g, '') }}
          </p>
          <p>
            {{ t('pages.home.episodesCount', rss?.items?.length) }}.
            {{ t('pages.home.lastUpdate', { date: lastEpisodeDate }) }}.
          </p>

          <form>
            <label for="episodes" class="mt-4"
              ><span>{{ t('pages.home.selectEpisode') }}</span>
              <select
                :disabled="!currentEpisode"
                v-model="currentEpisode"
                id="episodes"
                class="form-input"
              >
                <option v-for="episode in episodes" :key="episode.id" :value="episode">
                  {{ episode.title }}
                </option>
              </select></label
            >
          </form>

          <h3 class="">{{ t('common.episode') }}</h3>

          <div class="md:flex">
            <img
              v-if="currentEpisode?.itunes_image"
              :src="currentEpisode.itunes_image"
              :alt="podcastInfos.description"
              :width="500"
              :height="500"
              class="w-full md:w-1/4 md:h-1/4 md:mr-6 md:!my-0 shrink-0"
              :title="podcastInfos.description"
              loading="lazy"
            />
            <div>
              <p class="grow">{{ podcastInfos.title }}.</p>
              <p class="text-sm">
                {{ podcastInfos.description }}.<br />{{ t('common.duration') }} :
                {{ podcastInfos.duration }}
              </p>
            </div>
          </div>
          <h4 class="">{{ t('pages.home.podcastTrackList') }}</h4>
          <ol class="not-prose text-sm max-h-64 overflow-auto bg-gray-100 list-inside !px-3 py-2">
            <li v-for="(track, index) in episodeTrackList" :key="index">{{ track }}</li>
          </ol>
        </template>
      </section>

      <!-- User Profil       -->
      <section class="prose lg:prose-lg max-w-prose mt-14">
        <h2 class="">{{ t('pages.home.userProfil') }}</h2>

        <pre v-if="hasUserError">
            {{ hasUserError }}
          </pre
        >

        <template v-else-if="isUserLoading">
          <p><AppLoader /></p>
        </template>

        <template v-else>
          <p v-if="!isAuthenticated">
            {{ t('pages.home.notLogged') }}
            <RouterLink v-if="!isAuthenticated" :to="{ name: 'login' }"
              >{{ t('pages.home.logMeIn') }} </RouterLink
            >.
          </p>

          <div v-else>
            <p v-if="user">
              <i18n-t keypath="pages.profil.loggedAs" tag="span" scope="global">
                <template #name>
                  <span class="font-bold">{{ user.display_name }}</span>
                </template>
              </i18n-t>

              {{ t('common.moreInfo') }}
              <RouterLink :to="{ name: 'profil', params: { id: user.id } }">{{
                t('common.here').toLowerCase()
              }}</RouterLink
              >. <br /><img :src="user?.images[0]?.url" class="!m-0" width="80" alt="" />
            </p>
          </div>
        </template>
      </section>

      <!-- Create Spotify Playlist       -->
      <section
        class="prose lg:prose-lg max-w-prose mt-14"
        v-if="isAuthenticated && episodeTrackList.length"
      >
        <h2 class="">{{ t('pages.home.createSpotifyPlaylist') }}</h2>
        <form @submit.prevent="createPlaylistSubmitHandler">
          <div class="flex flex-col gap-y-2">
            <label for="playlistName" class="block"
              ><span class="block">{{ t('pages.home.form.playlistName') }}</span>
              <input
                type="text"
                id="playlistName"
                name="playlistName"
                class="form-input"
                v-model="formPlaylist.name"
                required
            /></label>
            <label for="playlistDescription" class="block"
              ><span class="block">{{ t('pages.home.form.playlistDescription') }}</span>
              <input
                type="text"
                id="playlistDescription"
                name="playlistDescription"
                class="form-input"
                v-model="formPlaylist.description"
                required
            /></label>
          </div>
          <div class="mt-4 flex items-center gap-y-4">
            <button
              v-if="!spotifyPlaylist"
              type="submit"
              :disabled="isCreatePlaylistPending"
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
                {{ t('common.here') }}</a
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
