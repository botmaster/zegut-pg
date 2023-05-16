<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { Icon } from '@iconify/vue'
import type { Episode, Playlist } from '@/types/types'
import { useToast } from 'vue-toastification'
// @ts-ignore
import { useI18n } from 'vue-i18n'
import {
  addTracksToPlaylist,
  createPlaylist,
  getPlaylist,
  searchTracks
} from '@/services/spotify.service'
import { fetchAndParsePodcastPage } from '@/helpers/podcloudScraper'

// i18n
const { t } = useI18n()

// AuthStore
const authStore = useAuthStore()
const { isAuthenticated, accessToken } = storeToRefs(authStore)

// UserStore
const userStore = useUserStore()
const { user, isLoading: isUserLoading, hasError: hasUserError } = storeToRefs(userStore)

// Toast
const toast = useToast()

// Reactive variables
const episode = ref<Episode | null>(null)
const podcastUrl = ref('')
const playlist = ref<Playlist | null>(null)

// Playlist form
const formPlaylist = ref<{ name: string; description: string; public: boolean }>({
  name: 'Zégut playlist',
  description: 'Zégut playlist',
  public: false
})

// Local state
const isScrapePending = ref(false)
const hasScrapeError = ref<boolean | any>(false)

const isCreatePlaylistPending = ref(false)
const hasCreatePlaylistError = ref<boolean | any>(false)

/**
 * Computed
 */
const episodeTrackList = computed(() => {
  return episode.value?.playlist || []
})

const podcastInfos = computed(() => {
  return {
    title: episode.value?.title || '',
    description: episode.value?.description || '',
    duration: episode.value?.duration || ''
  }
})

/**
 * Methods
 */

/**
 * Event handlers
 */

const submitPodcastUrlHandler = () => {
  console.log('submitHandler', podcastUrl.value)
  isScrapePending.value = true
  hasScrapeError.value = false
  playlist.value = null

  fetchAndParsePodcastPage(podcastUrl.value)
    .then((dataEpisode) => {
      episode.value = dataEpisode
      formPlaylist.value.name = `By Zégut 🤘 - ${dataEpisode.title}`
      formPlaylist.value.description = dataEpisode.description
      toast.success(t('pages.home.toast.scrapSuccess').toString())
    })
    .catch((error) => {
      hasScrapeError.value = error
      toast.error(t('pages.home.toast.scrapError').toString() + error)
    })
    .finally(() => {
      isScrapePending.value = false
    })
}

const createPlaylistSubmitHandler = async () => {
  console.log('createPlaylistSubmitHandler')

  try {
    // TODO: Create type for track

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
      name: formPlaylist.value.name,
      description: formPlaylist.value.description,
      isPublic: formPlaylist.value.public,
      userId: user.value?.id || ''
    })
    playlist.value = createPlaylistData

    // Add tracks to playlist
    const uris = tracksIds.map((trackId) => `spotify:track:${trackId}`)
    console.log('uris', uris)
    await addTracksToPlaylist(playlist.value?.id || '', uris)

    const getPlaylistData = await getPlaylist(
      playlist.value?.id || '',
      'name, description,tracks.items(track(name,href,album(name,href))), uri, external_urls.spotify'
    )

    playlist.value = getPlaylistData

    toast.success(t('pages.home.toast.playlistCreated'))
  } catch (error) {
    toast.error(t('pages.home.toast.playlistError') + error)
    console.error(error)
  }
}

/**
 * Vue lifecycle
 */

onMounted(async () => {
  console.log('HomeView mounted')

  // fetch current user
  if (accessToken.value) {
    await userStore.fetchUserCurrentUser()
  }
})
</script>

<template>
  <main>
    <div class="container mx-auto pt-8 pb-14">
      <section class="prose lg:prose-xl max-w-prose">
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
        <p>{{ t('pages.home.intro') }}</p>

        <h2 class="">{{ t('pages.home.userProfil') }}</h2>

        <pre v-if="hasUserError">
            {{ hasUserError }}
          </pre
        >

        <template v-else-if="isUserLoading">
          <p>{{ t('common.loading') }}</p>
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
              {{ t('pages.profil.loggedAs', { name: user.display_name }) }}
              {{ t('common.moreInfo') }}
              <RouterLink :to="{ name: 'profil', params: { id: user.id } }">{{
                t('common.here').toLowerCase()
              }}</RouterLink
              >. <br /><img :src="user?.images[0]?.url" class="!m-0" width="80" alt="" />
            </p>
          </div>
        </template>
      </section>

      <section v-if="isAuthenticated" class="prose lg:prose-xl max-w-prose mt-14">
        <h2 class="">{{ $t('pages.home.fetchPlaylist') }}</h2>

        <p class="border-l-4 border-amber-200 px-4 py-3 bg-amber-200/20 text-base">
          <span class="inline-block mr-2">📢</span>
          <i18n-t tag="span" class="" keypath="pages.home.calloutExtension">
            <template #link>
              <a
                href="https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf"
                target="_blank"
                rel="noopener noreferrer"
                >{{ t('pages.home.extension') }}</a
              >
            </template>
          </i18n-t>
        </p>

        <i18n-t tag="p" class="" keypath="pages.home.fullPodcastList">
          <template #link>
            <a
              href="https://podcloud.fr/podcast/rtl2-pop-rock-station-by-zegut"
              target="_blank"
              rel="noopener noreferrer"
              >podCloud</a
            >
          </template>
        </i18n-t>

        <form class="" @submit.prevent="submitPodcastUrlHandler">
          <div class="flex flex-col gap-y-4">
            <label for="podcastUrl" class="block"
              ><span class="block">{{ t('pages.home.form.podcastUrl') }}</span>
              <input
                type="url"
                id="podcastUrl"
                name="podcastUrl"
                class="w-full"
                v-model="podcastUrl"
                :disabled="isScrapePending"
                required
              />
            </label>
          </div>
          <div class="mt-4">
            <button class="btn btn-primary" :disabled="isScrapePending" type="submit">
              {{ t('common.submit') }}
            </button>
            <Icon
              v-if="isScrapePending"
              class="inline-block ml-4"
              icon="svg-spinners:pulse-rings-multiple"
            ></Icon>
          </div>
        </form>
      </section>

      <section
        class="prose lg:prose-xl max-w-prose mt-14"
        v-if="isAuthenticated && episodeTrackList.length"
      >
        <h2 class="">{{ t('common.podcast') }}</h2>
        <h3 class="">{{ t('pages.home.podcastInfos') }}</h3>
        <p>{{ podcastInfos.title }} <br />{{ podcastInfos.description }}</p>
        <h3 class="">{{ t('common.playlist') }}</h3>
        <ol class="not-prose text-sm max-h-64 overflow-auto bg-gray-100 list-inside !px-3 py-2">
          <li v-for="(track, index) in episodeTrackList" :key="index">{{ track }}</li>
        </ol>
      </section>

      <section
        class="prose lg:prose-xl max-w-prose mt-14"
        v-if="isAuthenticated && episodeTrackList.length"
      >
        <h2 class="">{{ t('pages.home.form.ctaCreatePlaylist') }}</h2>
        <form @submit.prevent="createPlaylistSubmitHandler">
          <div class="flex flex-col gap-y-2">
            <label for="playlistName" class="block"
              ><span class="block">{{ $t('pages.home.form.playlistName') }}</span>
              <input
                type="text"
                id="playlistName"
                name="playlistName"
                class="w-full"
                v-model="formPlaylist.name"
                required
            /></label>
            <label for="playlistDescription" class="block"
              ><span class="block">{{ t('pages.home.form.playlistDescription') }}</span>
              <input
                type="text"
                id="playlistDescription"
                name="playlistDescription"
                class="w-full"
                v-model="formPlaylist.description"
                required
            /></label>
          </div>
          <div class="mt-4 flex items-center gap-y-4">
            <button v-if="!playlist" type="submit" class="btn btn-primary">
              {{ t('pages.home.form.ctaCreatePlaylist') }}
            </button>
            <Icon
              v-if="isCreatePlaylistPending"
              class="inline-block ml-4"
              icon="svg-spinners:pulse-rings-multiple"
            ></Icon>
          </div>
        </form>
        <div class="not-prose" v-if="hasCreatePlaylistError">
          <p class="text-sm mt-2 text-red-600">
            {{ t('pages.home.enableToCreateTheSpotifyPlaylist') }}
          </p>
        </div>
        <template v-else>
          <div v-if="playlist" class="">
            <p class="">{{ t('pages.home.toast.playlistCreated') }}</p>
            <p class="">
              {{ t('pages.home.openPlaylistBrowser') }}&nbsp;<a
                :href="playlist.external_urls.spotify"
                target="_blank"
              >
                {{ t('common.here') }}</a
              >
              <br />{{ t('pages.home.openPlaylistSpotify') }}&nbsp;<a :href="playlist.uri">{{
                t('common.here')
              }}</a>
            </p>

            <pre class="!text-xs max-h-64">{{ playlist }}</pre>
          </div>
        </template>
      </section>
    </div>
  </main>
</template>
