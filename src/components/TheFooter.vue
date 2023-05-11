<script setup lang="ts">
// @ts-ignore
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer
    class="px-8 text-gray-600 min-h-[--header-height] flex items-center justify-between border-t border-gray-100 bg-white"
  >
    <p>
      {{ t('footer.codedWithLove') }}
      <a href="https://www.pascal-achard.com" target="_blank">Pascal Achard</a>
    </p>
  </footer>
</template>

<style scoped></style>
