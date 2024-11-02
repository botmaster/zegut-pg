<script setup lang="ts">
const colorsList = [
  {
    name: 'primary',
    label: 'Primary',
    class: {
      background: 'bg-primary',
      foreground: 'text-primary-foreground'
    }
  },
  {
    name: 'secondary',
    label: 'Secondary',
    class: {
      background: 'bg-secondary',
      foreground: 'text-secondary-foreground'
    }
  },
  {
    name: 'accent',
    label: 'Accent',
    class: {
      background: 'bg-accent',
      foreground: 'text-accent-foreground'
    }
  },
  {
    name: 'destructive',
    label: 'Destructive',
    class: {
      background: 'bg-destructive',
      foreground: 'text-destructive-foreground'
    }
  },
  {
    name: 'muted',
    label: 'Muted',
    class: {
      background: 'bg-muted',
      foreground: 'text-muted-foreground'
    }
  }
]
</script>

<template>
  <div class="container mx-auto mt-4 mb-12">
    <h1 class="text-5xl font-black mb-8">Styles guide</h1>

    <h2 class="text-2xl font-black mb-6">Colors</h2>
    <div class="flex flex-wrap items-center gap-8">
      <div
        v-for="item in colorsList"
        :key="item.name"
        class="size-64 p-4"
        :class="item.class.background"
      >
        <p :class="item.class.foreground" class="text-xl">{{ item.label }}</p>
      </div>
    </div>

    <h2 class="mt-10 mb-6 text-2xl font-black">Texts</h2>
    <div class="prose">
      <p>
        Lorem ipsum dolor sit amet,
        <span class="text-muted-foreground">consectetur adipisicing elit</span>. Ab assumenda fuga
        hic itaque recusandae rem rerum vel. Asperiores <a href="#">aspernatur</a> consequatur
        deleniti est fugit impedit quisquam quos, rerum tempora temporibus voluptatem.
      </p>
    </div>

    <h2 class="mt-10 mb-6 text-2xl font-black">Buttons</h2>
    <div class="flex flex-wrap gap-2">
      <button class="btn btn-primary">Primary</button>
      <button class="btn btn-secondary">Secondary</button>
      <button class="btn btn-destructive">Destructive</button>
      <button class="btn btn-outline">Outline</button>
      <button class="btn btn-ghost">Ghost</button>
      <button class="btn btn-link">Link</button>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <button disabled class="btn btn-primary">Primary</button>
      <button disabled class="btn btn-secondary">Secondary</button>
      <button disabled class="btn btn-destructive">Destructive</button>
      <button disabled class="btn btn-outline">Outline</button>
      <button disabled class="btn btn-ghost">Ghost</button>
      <button disabled class="btn btn-link">Link</button>
    </div>
  </div>
</template>

<style scoped></style>
