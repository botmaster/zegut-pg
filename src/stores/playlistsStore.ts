/**
 * Pinia store for playlist
 */

import { defineStore } from 'pinia'
import { getUserPlaylists } from '@/services/spotify.service'
import { ref } from 'vue'

export const usePlaylistsStore = defineStore('playlistsStore', () => {
  const playlists = ref<SpotifyApi.ListOfUsersPlaylistsResponse | null>(null)
  const isLoading = ref<boolean>(false)
  const hasError = ref<boolean | any>(false)

  const fetchPlaylists = async (limit: number = 20, offset: number = 0) => {
    try {
      isLoading.value = true
      hasError.value = false
      playlists.value = await getUserPlaylists(limit, offset)
      return playlists
    } catch (error) {
      console.log(error)
      hasError.value = error
    } finally {
      isLoading.value = false
    }
  }

  return {
    fetchPlaylists,
    playlists,
    isLoading,
    hasError
  }
})
