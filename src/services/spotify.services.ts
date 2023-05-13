/**
 * Spotify Services
 */
import axios from 'axios'
import type { Playlist } from '@/types/types'

const BASE_URL = 'https://api.spotify.com/v1'

/**
 * Create playlist
 * @param userId
 * @param accessToken
 * @param name
 * @param description
 * @param isPublic
 */
export const createPlaylist = async (
  userId: string,
  accessToken: string,
  { name, description, isPublic }: { name: string; description: string; isPublic: boolean }
) => {
  console.log('createPlaylist', userId, name, description, isPublic)
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
export const searchTracks = async (
  accessToken: string,
  query: string,
  type: string,
  limit: number,
  offset: number
) => {
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

  const { data } = await axios.get(url, {
    headers,
    params: {
      fields
    }
  })
  return data
}
