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
// @ts-ignore
import { useI18n } from 'vue-i18n'
import { getEpisodeAuthorImage } from '@/utils/podcast'

const props = defineProps<{
  episodes: PodcastItem[] | null
  modelValue: string | string[] | null | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [payload: string]
}>()

const { d } = useI18n()

const selectEpisode = (episode: PodcastItem) => {
  emit('update:modelValue', episode.id)
}

const isSelected = (episode: PodcastItem) => {
  return props.modelValue === episode.id
}

onMounted(() => {
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
        class="flex gap-4 hover:bg-accent cursor-pointer"
        v-for="episode in episodes"
        :key="episode.id"
        :id="episode.id"
        :class="{ '!bg-accent': isSelected(episode) }"
      >
        <figure class="shrink-0">
          <img
            :src="getEpisodeAuthorImage(episode.itunes_author) || episode.itunes_image || ''"
            :alt="episode.title"
            :title="episode.title"
            width="40"
            height="40"
            class="w-14 h-14 border border-zinc-100"
            loading="lazy"
          />
        </figure>

        <button @click="selectEpisode(episode)" class="py-1 text-left leading-none min-w-0">
          <span class="block pr-1 truncate">{{ episode.title }}</span
          ><span
            class="flex gap-x-1 text-xs italic text-zinc-500 leading-none mt-1 md:mt-2 truncate"
          >
            <span>{{ episode.itunes_author }}</span
            >-<span>{{ episode.itunes_duration }}</span
            >-<span class="truncate">{{ d(new Date(episode.created), 'long') }}</span>
          </span>

          <!--            <span class="block text-xs italic">{{ episode.description }}</span>-->
        </button>
      </li>
    </ul>
  </div>
</template>
