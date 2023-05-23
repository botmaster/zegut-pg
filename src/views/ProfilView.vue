<script setup lang="ts">
// AuthStore
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { onMounted } from 'vue'
// @ts-ignore
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useSeoMeta } from '@vueuse/head'

const { t } = useI18n()

// AuthStore
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

// UserStore
const userStore = useUserStore()
const { user, isLoading: isUserLoading, hasError: hasUserError } = storeToRefs(userStore)

const logoutClickHandler = () => {
  console.log('logoutClickHandler')
  authStore.logout()
}

useSeoMeta({
  title: 'About',
  description: 'My about page',
  ogDescription: 'Still about my about page',
  ogTitle: 'About',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image'
})

onMounted(() => {
  // Get user profile id from url params
  // const id = route.params.id

  // Get user profile
  // userStore.getUserProfile(id)
  if (!user?.value) {
    userStore.fetchUserCurrentUser()
  }
})
</script>

<template>
  <main>
    <div class="container mx-auto">
      <section class="prose lg:prose-xl max-w-prose pt-8 pb-14">
        <h1>
          {{ t('pages.profil.title') }}
          <Icon class="inline-block text-2xl align-baseline" icon="logos:spotify-icon"></Icon>
        </h1>

        <pre v-if="hasUserError">
            {{ hasUserError }}
          </pre
        >

        <template v-else-if="isUserLoading">
          <p>{{ t('common.loading') }}</p>
        </template>

        <template v-else>
          <p v-if="!isAuthenticated">
            {{ t('pages.profil.notLoggedIn') }}
            <RouterLink v-if="!isAuthenticated" :to="{ name: 'login' }" class="btn btn-primary">{{
              t('common.login')
            }}</RouterLink>
          </p>

          <div v-else>
            <p v-if="user" class="flex gap-4 items-center">
              <span class="block grow"
                ><i18n-t keypath="pages.profil.loggedAs" tag="span" scope="global">
                  <template #name>
                    <span class="font-bold">{{ user.display_name }}</span>
                  </template>
                </i18n-t>
                <img
                  v-if="user?.images"
                  :src="user?.images[0]?.url"
                  class="!m-0 inline-block"
                  width="80"
                  alt=""
              /></span>
              <button class="inline-flex btn btn-border" @click="logoutClickHandler">
                {{ t('common.logout') }}
              </button>
            </p>
            <pre v-if="user" class="!text-xs">{{ user }}</pre>
          </div>
        </template>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
