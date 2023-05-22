import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCurrentUserProfile } from '@/services/spotify.service'
import type { UserProfile } from '@/types/spotify'

export const useUserStore = defineStore('userStore', () => {
  const user = ref<UserProfile | null>(null)
  const isLoading = ref<boolean>(false)
  const hasError = ref<boolean | any>(false)

  const fetchUserCurrentUser = async () => {
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
  }

  return { user, isLoading, hasError, fetchUserCurrentUser, reset }
})
