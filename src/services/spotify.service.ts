/**
 * Spotify Services
 */

import http from './spotify.api'
import type { Playlist } from '@/types/types'

/**
 * Get the current user's profile
 */
export const getCurrentUserProfile = async () => {
  const url = `/me`
  const { data } = await http.get(url)
  return data
}

/**
 * Create a new playlist
 *  @param userId
 *  @param name
 *  @param description
 *  @param isPublic
 */
export const createPlaylist = async ({
  userId,
  name,
  description,
  isPublic
}: {
  userId: string
  name: string
  description: string
  isPublic: boolean
}) => {
  const url = `/users/${userId}/playlists`
  const { data: playlistData } = await http.post<Playlist>(url, {
    name,
    description,
    public: isPublic
  })

  return playlistData
}

/**
 * Search for tracks
 * @param query
 * @param type
 * @param limit
 * @param offset
 */
export const searchTracks = async ({
  query,
  type = 'track',
  limit = 5,
  offset = 0
}: {
  query: string
  type?: string
  limit?: number
  offset?: number
}) => {
  const url = `/search`

  const { data } = await http.get(url, {
    params: {
      q: query,
      type,
      limit,
      offset
    }
  })

  return data
}

/**
 * Add tracks to playlist
 * @param playlistId
 * @param uris
 */

export const addTracksToPlaylist = async (playlistId: string, uris: string[]) => {
  const url = `/playlists/${playlistId}/tracks`

  const { data } = await http.post(url, {
    uris: uris
  })

  return data
}

/**
 * Get a playlist owned by a Spotify user.
 * @param playlistId
 * @param fields
 */

export const getPlaylist = async (playlistId: string, fields: string) => {
  const url = `/playlists/${playlistId}`

  const { data } = await http.get<Playlist>(url, {
    params: {
      fields
    }
  })
  return data
}
