<script setup lang="ts">
/**
 * EpisodeSelector
 * @desc Component to select an episode from a list of PodcastItem (PodcastItem[]). Vmodel is the selected PodcastItem.
 * @param {PodcastItem[]} episodes - List of PodcastItem
 * @param {PodcastItem} vmodel - Selected PodcastItem
 *
 * @example
 * <EpisodeSelector :episodes="episodes" v-model="selectedEpisode" />
 */
import type { PodcastItem } from '@/types/podcast'
import { onMounted } from 'vue'

const props = defineProps<{
  episodes: PodcastItem[] | null
  modelValue: string | string[] | null
}>()

const emit = defineEmits<{
  'update:modelValue': [payload: string]
}>()

const selectEpisode = (episode: PodcastItem) => {
  emit('update:modelValue', episode.id)
}

const isSelected = (episode: PodcastItem) => {
  return props.modelValue === episode.id
}

onMounted(() => {
  console.log('mounted')

  // Scroll to selected episode
  const selectedEpisode = props.episodes?.find((episode) => episode.id === props.modelValue)
  if (selectedEpisode) {
    const element = document.getElementById(selectedEpisode.id)
    if (element) {
      element.scrollIntoView({ block: 'start' })
    }
  }
})
</script>

<template>
  <div class="not-prose max-h-96 overflow-auto text-sm">
    <ul class="list-none p-0">
      <li
        class="flex gap-4 mb-4 bg-zinc-50"
        v-for="episode in episodes"
        :key="episode.id"
        :id="episode.id"
        :class="{ '!bg-amber-200': isSelected(episode) }"
      >
        <figure class="shrink-0">
          <img
            :src="episode.itunes_image"
            :alt="episode.title"
            :title="episode.title"
            width="40"
            height="40"
            class="w-14 h-14 border border-zinc-100"
            loading="lazy"
          />
        </figure>

        <button @click="selectEpisode(episode)" class="py-1 text-left leading-none">
          <span class="pr-1">{{ episode.title }}</span
          ><span class="inline-flex gap-x-1 text-xs italic text-zinc-500">
            <span>{{ episode.itunes_author }}</span
            >-<span>{{ episode.itunes_duration }}</span>
          </span>

          <!--            <span class="block text-xs italic">{{ episode.description }}</span>-->
        </button>
      </li>
    </ul>
  </div>
</template>
