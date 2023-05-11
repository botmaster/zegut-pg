<script setup lang="ts">
// AuthStore
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { onMounted } from 'vue'
// @ts-ignore
import { useI18n } from 'vue-i18n'
// import { useRoute } from 'vue-router'

// const route = useRoute()

const { t } = useI18n()

// AuthStore
const authStore = useAuthStore()
const { isAuthenticated, accessToken } = storeToRefs(authStore)

// UserStore
const userStore = useUserStore()
const { user, isLoading: isUserLoading, hasError: hasUserError } = storeToRefs(userStore)

const logoutClickHandler = () => {
  console.log('logoutClickHandler')
  authStore.logout()
}

onMounted(() => {
  // Get user profile id from url params
  // const id = route.params.id

  // Get user profile
  // userStore.getUserProfile(id)
  if (!user?.value) {
    userStore.fetchUserCurrentUser(accessToken.value || '')
  }
})
</script>

<template>
  <main>
    <div class="container mx-auto">
      <section class="prose lg:prose-xl max-w-prose pt-8 pb-14">
        <h1>{{ t('pages.profil.title') }}</h1>

        <pre v-if="hasUserError">
            {{ hasUserError }}
          </pre
        >

        <template v-else-if="isUserLoading">
          <p>Loading...</p>
        </template>

        <template v-else>
          <p v-if="!isAuthenticated">
            😬 You must be logged in to Spotify to create a playlist.
            <RouterLink v-if="!isAuthenticated" :to="{ name: 'login' }" class="btn btn-primary"
              >Log me in
            </RouterLink>
          </p>

          <div v-else>
            <p v-if="user">
              {{ t('pages.profil.loggedAs', { name: user.display_name }) }}
              <button class="inline-flex btn btn-border" @click="logoutClickHandler">
                {{ t('common.logout') }}
              </button>

              <br /><img :src="user?.images[0]?.url" class="!m-0" width="80" alt="" />
            </p>
            <pre v-if="user" class="!text-xs">{{ user }}</pre>
          </div>
        </template>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
