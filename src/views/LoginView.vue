<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { redirectToAuthCodeFlow } from '@/helpers/auth/authCodeWithPkce'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
// @ts-ignore
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const { t } = useI18n()
const router = useRouter()

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
          <div
            class="border-l-4 border-amber-200 mb-8 py-3 pl-8 bg-amber-200/20 not-prose text-base"
          >
            <p class="mb-2 font-bold">{{ t('pages.login.calloutTitle') }}</p>
            <p class="leading-snug my-0">
              {{ t('pages.login.callout') }}
            </p>
          </div>
          <p>
            {{ t('pages.login.letsConnect') }}
            <Icon icon="logos:spotify-icon" class="inline-block"></Icon>
          </p>
          <p class="flex gap-4">
            <button class="btn btn-primary" @click="connectClickHandler">
              {{ t('common.login') }}
            </button>
            <button class="btn btn-border" @click="router.push({ name: 'home' })">
              {{ t('common.cancel') }}
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
