<template>
  <div class="flex items-center gap-x-3 text-zinc-500 font-bold">
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      class="text-3xl enabled:hover:text-zinc-900 disabled:text-zinc-300"
    >
      <Icon icon="material-symbols:arrow-circle-left"></Icon>
      <span class="sr-only">{{ t('common.previous') }}</span>
    </button>
    <template v-if="pageCount">
      <button
        v-for="page in pageCount"
        :key="page"
        @click="goToPage(page)"
        :disabled="currentPage === page"
        class="text-xs"
        :class="{
          'text-zinc-900': currentPage === page,
          'enabled:hover:text-zinc-900 disabled:text-zinc-300': currentPage !== page
        }"
      >
        {{ page }}
      </button>
    </template>
    <button
      @click="nextPage"
      :disabled="currentPage === pageCount"
      class="text-3xl enabled:hover:text-zinc-900 disabled:text-zinc-300"
    >
      <Icon icon="material-symbols:arrow-circle-right"></Icon>
      <span class="sr-only">{{ t('common.next') }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
// @ts-ignore
import { useI18n } from 'vue-i18n'

interface Props {
  totalItems: number
  itemsPerPage: number
  modelValue: number
}

const props = defineProps<Props>()

const { t } = useI18n()

const currentPage = ref(props.modelValue)

const pageCount = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage)
})

const emit = defineEmits(['update:modelValue'])

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    emit('update:modelValue', currentPage.value)
  }
}

function nextPage() {
  if (currentPage.value < pageCount.value) {
    currentPage.value++
    emit('update:modelValue', currentPage.value)
  }
}

function goToPage(page: number) {
  currentPage.value = page
  emit('update:modelValue', currentPage.value)
}
</script>
