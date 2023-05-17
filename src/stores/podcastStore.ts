/**
 * Pinia store for podcast
 * @see https://pinia.esm.dev/
 */

import { defineStore } from 'pinia'
import { fetchRss } from '@/services/rss.service'
import { ref } from 'vue'
import type { Podcast, PodcastItem } from '@/types/types'

export const usePodcastStore = defineStore('podcastStore', () => {
  const url = 'https://www.rtl2.fr/podcast/pop-rock-station.xml'
  const rss = ref<Podcast | null>(null)
  const episodes = ref<Array<PodcastItem>>([])
  const currentEpisode = ref<PodcastItem | null>(null)
  const isLoading = ref<boolean>(false)
  const hasError = ref<boolean | any>(false)

  const fetchPodcast = async () => {
    isLoading.value = true
    try {
      rss.value = await fetchRss(url)

      if (rss.value) {
        episodes.value = rss.value.items
        currentEpisode.value = rss.value.items[0]
      }
    } catch (error) {
      console.log(error)
      hasError.value = error
    } finally {
      isLoading.value = false
    }
  }

  return {
    rss,
    episodes,
    currentEpisode,
    isLoading,
    hasError,
    fetchPodcast
  }
})
