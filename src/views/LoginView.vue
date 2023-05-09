<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { redirectToAuthCodeFlow } from '@/auth/authCodeWithPkce'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID

const initiateSpotifyLogin = () => {
  redirectToAuthCodeFlow(client_id)
}

const connectClickHandler = () => {
  console.log('connectClickHandler')

  if (!authStore.userAuth?.access_token) {
    initiateSpotifyLogin()
  } else {
    console.log('already logged in')
  }
}
</script>

<template>
  <main>
    <div class="container mx-auto">
      <section class="prose lg:prose-xl max-w-prose pt-8 pb-14">
        <h1>Sign in ZPG</h1>
        <template v-if="!isAuthenticated">
          <p>
            Let's connect to Spotify! <Icon icon="logos:spotify-icon" class="inline-block"></Icon>
          </p>
          <p>
            <button class="btn btn-primary" @click="connectClickHandler">Connect</button>
          </p>
        </template>

        <div v-else>
          <p>You are already connected to Spotify 🤘</p>
          <p>
            <button class="btn btn-primary" @click="authStore.logout">Logout</button>
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
