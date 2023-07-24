/**
 * Spotify Services
 */

import http from './spotify.api'

/**
 * Get the current user's profil
 */
export const getCurrentUserProfile = async () => {
  const url = `/me`
  const { data } = await http.get<SpotifyApi.UserProfileResponse>(url)
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
  const { data: playlistData } = await http.post<SpotifyApi.PlaylistObjectFull>(url, {
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
  limit = 1,
  offset = 0
}: {
  query: string
  type?: string
  limit?: number
  offset?: number
}) => {
  const url = `/search`

  const { data } = await http.get<SpotifyApi.TrackSearchResponse>(url, {
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

  const { data } = await http.get<SpotifyApi.PlaylistObjectFull>(url, {
    params: {
      fields
    }
  })
  return data
}

/**
 * Get a list of the playlists owned or followed by the current Spotify user.
 * @param limit The maximum number of playlists to return. Default: 20. Minimum: 1. Maximum: 50
 * @param offset The index of the first playlist to return. Default: 0 (the first object). Maximum offset: 100.000. Use with limit to get the next set of playlists.
 *
 */

export const getUserPlaylists = async (limit: number, offset: number) => {
  const url = `/me/playlists`

  const { data } = await http.get<SpotifyApi.ListOfUsersPlaylistsResponse>(url, {
    params: {
      limit,
      offset
    }
  })
  return data
}
