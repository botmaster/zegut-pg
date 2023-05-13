/**
 * Spotify Services
 */
import axios from 'axios'
import type { Playlist } from '@/types/types'

const BASE_URL = 'https://api.spotify.com/v1'

// Acceess Token
const token = localStorage.getItem('access_token') || ''

/**
 * Create a new playlist
 *  @param userId
 *  @param accessToken
 *  @param name
 *  @param description
 *  @param isPublic
 */
export const createPlaylist = async ({
  userId,
  accessToken = token,
  name,
  description,
  isPublic
}: {
  userId: string
  accessToken?: string
  name: string
  description: string
  isPublic: boolean
}) => {
  const url = `${BASE_URL}/users/${userId}/playlists`
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
  const { data: playlistData } = await axios.post<Playlist>(
    url,
    {
      name,
      description,
      public: isPublic
    },
    {
      headers
    }
  )

  return playlistData
}

/**
 * Search for tracks
 * @param accessToken
 * @param query
 * @param type
 * @param limit
 * @param offset
 */
export const searchTracks = async ({
  accessToken = token,
  query,
  type = 'track',
  limit = 5,
  offset = 0
}: {
  accessToken?: string
  query: string
  type?: string
  limit?: number
  offset?: number
}) => {
  const url = `${BASE_URL}/search`
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }

  const { data } = await axios.get(url, {
    headers,
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
 * @param accessToken
 * @param playlistId
 * @param uris
 */

export const addTracksToPlaylist = async (
  accessToken: string,
  playlistId: string,
  uris: string[]
) => {
  const url = `${BASE_URL}/playlists/${playlistId}/tracks`
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }

  const { data } = await axios.post(
    url,
    {
      uris: uris
    },
    {
      headers: headers
    }
  )

  return data
}

/**
 * Get a playlist owned by a Spotify user.
 * @param accessToken
 * @param playlistId
 * @param fields
 */

export const getPlaylist = async (accessToken: string, playlistId: string, fields: string) => {
  const url = `${BASE_URL}/playlists/${playlistId}`
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }

  const { data } = await axios.get<Playlist>(url, {
    headers,
    params: {
      fields
    }
  })
  return data
}
