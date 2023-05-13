<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { redirectToAuthCodeFlow } from '@/helpers/auth/authCodeWithPkce'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
// @ts-ignore
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const { t } = useI18n()

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
        <h1>{{ t('pages.login.title') }}</h1>
        <template v-if="!isAuthenticated">
          <p>
            {{ t('pages.login.letsConnect') }}
            <Icon icon="logos:spotify-icon" class="inline-block"></Icon>
          </p>
          <p>
            <button class="btn btn-primary" @click="connectClickHandler">
              {{ t('common.login') }}
            </button>
          </p>
        </template>

        <div v-else>
          <p>{{ t('pages.login.alreadyLogged') }}</p>
          <p>
            <button class="btn btn-primary" @click="authStore.logout">
              {{ t('common.logout') }}
            </button>
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
