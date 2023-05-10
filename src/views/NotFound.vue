<script setup lang="ts"></script>

<template>
  <main>
    <div class="container mx-auto">
      <section class="prose lg:prose-xl max-w-prose pt-8 pb-14">
        <h1>404</h1>
        <p>
          Zégut est tout perdu. Ramène le à la
          <RouterLink :to="{ name: 'home' }">maison</RouterLink>.
        </p>
        <img src="@/assets/images/zegut-francis.jpg" alt="404" width="1100" height="1020" />
      </section>
    </div>
  </main>
</template>

<style scoped></style>
