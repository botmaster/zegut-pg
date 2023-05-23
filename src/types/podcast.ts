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
  itunes_author: PodcastItunesAuthor
  itunes_explicit: PodcastItunesExplicit
  itunes_duration: string
  itunes_episode_type: PodcastItunesEpisodeType
  itunes_image: string
  enclosures: PodcastEnclosure[]
}

export interface PodcastEnclosure {
  url: string
  length: string
  type: PodcastType
}

export enum PodcastType {
  AudioMPEG = 'audio/mpeg'
}

export enum PodcastItunesAuthor {
  Alexis = 'Alexis',
  FrancisZegut = 'Francis Zégut',
  MarjorieHache = 'Marjorie Hache',
  MarjorieHacheFrancisZegut = 'Marjorie Hache, Francis Zégut',
  Rtl2 = 'RTL2'
}

export enum PodcastItunesEpisodeType {
  Full = 'full'
}

export enum PodcastItunesExplicit {
  No = 'no'
}
