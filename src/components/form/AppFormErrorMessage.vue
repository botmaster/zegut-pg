<script setup lang="ts">
defineProps<{
  id: string
}>()
</script>

<template>
  <p aria-live="assertive" class="text-sm text-red-700" :id="id">
    <slot />
  </p>
</template>

<style scoped></style>
