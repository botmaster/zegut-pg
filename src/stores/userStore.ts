import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCurrentUserProfile } from '@/services/spotify.service'

export const useUserStore = defineStore('userStore', () => {
  const user = ref<SpotifyApi.UserProfileResponse | null>(null)
  const isLoading = ref<boolean>(false)
  const hasError = ref<boolean | any>(false)

  const fetchUserCurrentUser = async () => {
    console.log('fetchUserCurrentUser')
    isLoading.value = true
    hasError.value = false
    try {
      user.value = await getCurrentUserProfile()
    } catch (error) {
      hasError.value = error
      console.error(error)
      return error
    } finally {
      isLoading.value = false
    }
  }

  // Reset the store when the user logs out
  const reset = () => {
    user.value = null
    isLoading.value = false
    hasError.value = false
  }

  return { user, isLoading, hasError, fetchUserCurrentUser, reset }
})
