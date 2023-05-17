export interface UserProfile {
  country: string
  display_name: string
  email: string
  explicit_content: {
    filter_enabled: boolean
    filter_locked: boolean
  }
  external_urls: { spotify: string }
  followers: { href: string; total: number }
  href: string
  id: string
  images: Image[]
  product: string
  type: string
  uri: string
}

interface Image {
  url: string
  height: number
  width: number
}

export interface UserAuth {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  refresh_token: string
}

export interface Playlist {
  collaborative: boolean
  description: string
  external_urls: { spotify: string }
  href: string
  id: string
  images: Image[]
  name: string
  owner: {
    display_name: string
    external_urls: { spotify: string }
    href: string
    id: string
    type: string
    uri: string
  }
  primary_color: string
  public: boolean
  snapshot_id: string
  tracks: {
    href: string
    total: number
  }
  type: string
  uri: string
}

export interface Episode {
  title: string
  description: string
  duration?: string
  author?: string
  playlist: Array<string>
  image?: ImageEpisode
}

interface ImageEpisode extends Image {
  alt?: string
}

/**
 * Podcast
 */
export interface Podcast {
  items: PodcastItem[]
  title: string
  description: string
  link: string
  category: string
  image: string
}

export interface PodcastItem {
  title: string
  id: string
  description: string
  url: string
  link: string
  published: number
  created: number
  category: any[]
  content: string
  content_encoded: string
  itunes_subtitle: string
  itunes_summary: string
  itunes_author: string
  itunes_explicit: string
  itunes_duration: string
  itunes_episode_type: string
  itunes_image: string
  enclosures: Enclosure[]
}

export interface Enclosure {
  url: string
  length: string
  type: 'string'
}
