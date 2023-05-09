import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { UserProfile } from '@/types/types'

export const useUserStore = defineStore('userStore', () => {
  const user = ref<UserProfile | null>(null)
  const isLoading = ref<boolean>(false)
  const hasError = ref<boolean | any>(false)

  const fetchUserCurrentUser = async (accessToken: string) => {
    isLoading.value = true
    hasError.value = false
    try {
      const { data } = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      console.log(data)
      user.value = data
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
