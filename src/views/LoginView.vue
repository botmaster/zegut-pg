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
            class="border-l-4 border-primary mb-8 py-3 pl-8 pr-6 bg-secondary not-prose text-base text-secondary-foreground"
          >
            <p class="mb-2 font-bold">{{ t('pages.login.calloutTitle') }}</p>
            <i18n-t tag="p" class="leading-snug my-0" keypath="pages.login.callout">
              <template #link>
                <a href="mailto:pascal.achard@gmail.com" class="underline">ici</a>
              </template>
            </i18n-t>
          </div>
          <p>{{ t('pages.login.intro') }}</p>
          <p>
            {{ t('pages.login.letsConnect') }}
            <Icon icon="logos:spotify" class="inline-block ml-1"></Icon>
          </p>
          <p class="flex gap-4">
            <button class="btn btn-primary" @click="connectClickHandler">
              {{ t('common.continue') }}
            </button>
            <button class="btn btn-ghost" @click="router.push({ name: 'home' })">
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
