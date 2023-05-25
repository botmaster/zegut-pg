<script setup lang="ts">
// @ts-ignore
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
defineProps<{
  playlist: SpotifyApi.PlaylistObjectSimplified
}>()

const { t } = useI18n()
</script>

<template>
  <div class="playlist-item">
    <div class="playlist-item__cover">
      <img
        v-if="playlist.images.length"
        :src="playlist.images[1]?.url || playlist.images[0]?.url"
        :alt="playlist.name"
        loading="lazy"
      />
    </div>
    <div class="playlist-item__infos">
      <p class="playlist-item__infos-title">{{ playlist.name }}</p>
      <p class="playlist-item__infos-subtitle">
        <span>{{ t('components.playlistsItem.trackCount', playlist.tracks.total) }}</span>
        <span>{{ playlist.owner.display_name }}</span>

        <span>{{
          playlist.public
            ? t('components.playlistsItem.public').toLowerCase()
            : t('components.playlistsItem.private').toLowerCase()
        }}</span>

        <span
          ><a :href="playlist.uri" :title="t('pages.home.openPlaylistSpotify')"
            ><Icon icon="logos:spotify-icon" class="inline-block"></Icon></a
        ></span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.playlist-item {
  @apply flex items-center;
}

.playlist-item__cover {
  @apply shrink-0 w-12 h-12 rounded overflow-hidden shadow-lg bg-zinc-100;
}

.playlist-item__cover img {
  @apply w-full h-full object-cover;
}

.playlist-item__infos {
  @apply ml-4 grow min-w-0;
}

.playlist-item__infos-title {
  @apply text-sm md:text-base font-medium leading-tight truncate;
}

.playlist-item__infos-subtitle {
  @apply mt-2 text-xs md:text-sm text-zinc-500 truncate;
}

/*.playlist-item__infos-subtitle span {
  @apply inline-block text-zinc-500;
}

.playlist-item__infos-subtitle span:first-child {
  @apply text-gray-500;
}

.playlist-item__infos-subtitle span:last-child {
  @apply text-gray-700;
}*/

.playlist-item__infos-subtitle span:not(:last-child)::after {
  @apply mx-1;
  content: '•';
}

.playlist-item__infos-subtitle span:last-child::after {
  @apply mx-1;
  content: '';
}
</style>
