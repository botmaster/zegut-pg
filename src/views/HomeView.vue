<script setup lang="ts">
import * as cheerio from 'cheerio'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import type { Playlist } from '@/types/types'
import { Icon } from '@iconify/vue'

// AuthStore
const authStore = useAuthStore()
const { isAuthenticated, accessToken } = storeToRefs(authStore)

// UserStore
const userStore = useUserStore()
const { user, isLoading: isUserLoading, hasError: hasUserError } = storeToRefs(userStore)

// Reactive variables
const playlistList = ref<Array<string>>([])
const podcastUrl = ref('')
const playlist = ref<Playlist | null>(null)

// Podcast infos
const podcastInfos = ref({
  title: '',
  description: ''
})

// Playlist form
const formPlaylist = ref<{ name: string; description: string; public: boolean }>({
  name: 'Zégut playlist',
  description: 'Zégut playlist',
  public: false
})

// Local state
const isScrapePending = ref(false)
const hasScrapeError = ref<boolean | any>(false)

const isCreatePlalistPending = ref(false)
const hasCreatePlalistError = ref<boolean | any>(false)

/**
 * Methods
 */

// Parse podCloud podcast page and get playlist.
async function getPodcastTracks() {
  try {
    const response = await axios.get(podcastUrl.value)
    //console.log(response.data)

    const $ = cheerio.load(response.data)

    // Get podcast infos
    podcastInfos.value.title = $('.panel-heading h3').text()
    podcastInfos.value.description = $('.panel-heading h4').text().split('\n').join(' ')

    formPlaylist.value.name = `By Zégut 🤘 - ${podcastInfos.value.title}`
    formPlaylist.value.description = podcastInfos.value.description

    // Get playlist
    let tracks: Array<string> = []
    const selector = '.col-md-12.post-content p'

    // Iterate over each track (p)
    $(selector).each((i, e) => {
      const content = $(e).text()
      content.split('\n').forEach((track) => {
        // console.log('track -->', track)

        // Exclude "reprise" word. Zégut name some tracks as "La Reprise, L'original" but it's not a real track
        if (track.toLowerCase().includes('reprise')) {
          //console.log('reprise')
          return
        }
        tracks.push(track)
      })
    })

    return tracks
  } catch (error) {
    console.error(error)
    throw error
  }
}

// Create playlist
const createPlaylist = async () => {
  console.log('createPlaylist')

  // Create playlist
  const playlistEndpoint = `https://api.spotify.com/v1/users/${user.value?.id}/playlists`
  const playlistName = formPlaylist.value.name || 'Zégut playlist'
  const playlistDescription = formPlaylist.value.description || 'Zégut playlist'
  const playlistPublic = false

  const playlistData = await axios.post(
    playlistEndpoint,
    {
      name: playlistName,
      description: playlistDescription,
      public: playlistPublic
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    }
  )
  console.log('playlistData', playlistData.data)
  return playlistData.data
}

// Find track
const findTrack = async (name: string) => {
  console.log('findTrack', name)

  const trackEndpoint = 'https://api.spotify.com/v1/search'
  const trackName = name
  const trackType = 'track'
  const trackLimit = 5

  const trackData = await axios.get(trackEndpoint, {
    params: {
      q: trackName,
      type: trackType,
      limit: trackLimit
    },
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
      'Content-Type': 'application/json'
    }
  })
  console.log('trackData', trackData.data)
  return trackData.data
}

// Add tracks to playlist.
const addTracksToPlaylist = async (playlistId: string = '', tracksIds: Array<string> = []) => {
  console.log('addTracksToPlaylist', playlistId, tracksIds)

  const addTracksEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
  const uris = tracksIds.map((trackId) => `spotify:track:${trackId}`)
  console.log('uris', uris)

  await axios.post(
    addTracksEndpoint,
    {
      uris: uris
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    }
  )
}

// Get playlist by id (with tracks) - https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlist/
const getPlaylist = async (playlistId: string = '') => {
  console.log('getPlaylist', playlistId)

  const playlistEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}`

  const playlistData = await axios.get(playlistEndpoint, {
    params: {
      fields: 'name, description,tracks.items(track(name,href,album(name,href)))'
    },
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
      'Content-Type': 'application/json'
    }
  })
  console.log('playlistData', playlistData.data)
  return playlistData.data as Playlist
}

/**
 * Event handlers
 */

const submitPodcastUrlHandler = () => {
  console.log('submitHandler', podcastUrl.value)
  isScrapePending.value = true
  getPodcastTracks()
    .then((tracks) => {
      playlistList.value = tracks || []
    })
    .catch((error) => {
      hasScrapeError.value = error
    })
    .finally(() => {
      isScrapePending.value = false
    })
}

const createPlaylistSubmitHandler = async () => {
  console.log('createPlaylistSubmitHandler')

  try {
    // Search tracks in parallel
    const tracksIds = await Promise.all(
      playlistList.value.map(async (track) => {
        const trackData = await findTrack(track)
        return trackData['tracks']['items'][0]['id']
      })
    )

    console.log('tracks', tracksIds)

    // Create playlist
    playlist.value = await createPlaylist()

    // Add tracks to playlist
    await addTracksToPlaylist(playlist.value?.id, tracksIds)

    // Get playlist
    playlist.value = await getPlaylist(playlist.value?.id)
  } catch (error) {
    console.error(error)
  }
}

const logoutClickHandler = () => {
  console.log('logoutClickHandler')
  authStore.logout()
}

/**
 * Vue lifecycle
 */

onMounted(async () => {
  console.log('mounted')

  // fetch current user
  if (accessToken.value) {
    await userStore.fetchUserCurrentUser(accessToken.value)
  }
})
</script>

<template>
  <main>
    <div class="container mx-auto pt-8 pb-14">
      <section class="prose lg:prose-xl max-w-prose">
        <h1 class="mb-8">Zégut Playlist Generator</h1>
        <!--        <figure>
          <blockquote>
            <p>
              Mais nan ! Les playlists de Zégut ne sont pas sur Spotify ?! <br />Ok j'ai compris, je
              m'en occupe.
            </p>
          </blockquote>
          <figcaption>— Pascal Achard, <cite>Dans sa tête</cite>.</figcaption>
        </figure>-->
        <figure>
          <blockquote>
            <p>
              No wait! Pop-Rock Station by Zégut's playlists are not on Spotify ?! <br />Ok I got
              it, I'll take care of it.
            </p>
          </blockquote>
          <figcaption>— Pascal Achard, <cite>In his mind</cite>.</figcaption>
        </figure>

        <h2 class="">User profile</h2>

        <pre v-if="hasUserError">
            {{ hasUserError }}
          </pre
        >

        <template v-else-if="isUserLoading">
          <p>Loading...</p>
        </template>

        <template v-else>
          <p v-if="!isAuthenticated">
            😬 You must be logged in to Spotify to create a playlist.
            <RouterLink v-if="!isAuthenticated" :to="{ name: 'login' }" class="btn btn-primary"
              >Log me in
            </RouterLink>
          </p>

          <div v-else>
            <p v-if="user">
              🤘 Connected as {{ user.display_name }}
              <button class="inline-flex btn btn-border" @click="logoutClickHandler">
                Log me out
              </button>
              <br /><img :src="user?.images[0]?.url" class="!m-0" width="80" alt="" />
            </p>
            <pre v-if="user" class="!text-xs">{{ user }}</pre>
          </div>
        </template>
      </section>

      <section v-if="isAuthenticated" class="prose lg:prose-xl max-w-prose mt-14">
        <h2 class="">Fetch Zégut playlist on podCloud</h2>
        <p>
          The complete list of Zégut's podcasts can be found on
          <a
            href="https://podcloud.fr/podcast/rtl2-pop-rock-station-by-zegut"
            target="_blank"
            rel="noopener noreferrer"
            >podCloud</a
          >. Copy the url of the podcast and paste it in the field below.
        </p>
        <form class="" @submit.prevent="submitPodcastUrlHandler">
          <div class="flex flex-col gap-y-4">
            <label for="podcastUrl" class="block"
              ><span class="block">Podcast url</span>
              <input
                type="text"
                id="podcastUrl"
                name="podcastUrl"
                class="w-full"
                v-model="podcastUrl"
                :disabled="isScrapePending"
              />
              <span class="not-prose block" v-if="hasScrapeError">
                <span class="block text-sm mt-2 text-red-600">
                  Enable to retrieve the podcast playlist from podCloud 😕.
                </span>
              </span></label
            >
          </div>
          <div class="mt-4">
            <button class="btn btn-primary" :disabled="isScrapePending" type="submit">
              Submit
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
        v-if="isAuthenticated && playlistList.length"
      >
        <h2 class="">Podcast</h2>
        <h3 class="">Podcast infos</h3>
        <p>{{ podcastInfos.title }} <br />{{ podcastInfos.description }}</p>
        <h3 class="">Playlist</h3>
        <ol class="not-prose text-sm max-h-64 overflow-auto bg-gray-100 list-inside !px-3 py-2">
          <li v-for="(track, index) in playlistList" :key="index">{{ track }}</li>
        </ol>
      </section>

      <section
        class="prose lg:prose-xl max-w-prose mt-14"
        v-if="isAuthenticated && playlistList.length"
      >
        <h2 class="">Create playlist</h2>
        <form @submit.prevent="createPlaylistSubmitHandler">
          <div class="flex flex-col gap-y-2">
            <label for="playlistName" class="block"
              ><span class="block">Playlist name</span>
              <input
                type="text"
                id="playlistName"
                name="playlistName"
                class="w-full"
                v-model="formPlaylist.name"
            /></label>
            <label for="playlistDescription" class="block"
              ><span class="block">Playlist description</span>
              <input
                type="text"
                id="playlistDescription"
                name="playlistDescription"
                class="w-full"
                v-model="formPlaylist.description"
            /></label>
          </div>
          <div class="mt-4 flex items-center gap-y-4">
            <button v-if="!playlist" type="submit" class="btn btn-primary">Create playlist</button>
            <Icon
              v-if="isCreatePlalistPending"
              class="inline-block ml-4"
              icon="svg-spinners:pulse-rings-multiple"
            ></Icon>
          </div>
        </form>
        <div class="not-prose" v-if="hasCreatePlalistError">
          <p class="text-sm mt-2 text-red-600">Enable to create the Spotify playlist 😕.</p>
        </div>
        <pre v-if="playlist" class="!text-xs">{{ playlist }}</pre>
      </section>
    </div>
  </main>
</template>
