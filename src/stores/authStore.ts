import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getAccessToken } from '@/auth/authCodeWithPkce'
import { useRouter } from 'vue-router'
import type { UserAuth } from '@/types/types'
import { useUserStore } from '@/stores/userStore'
import { toast } from 'vue-sonner'

export const useAuthStore = defineStore('authStore', () => {
  const userAuth = ref<UserAuth | null>(JSON.parse(localStorage.getItem('userAuth') || 'null'))
  const router = useRouter()
  const isLoading = ref<boolean>(false)
  const hasError = ref<boolean | any>(false)

  // Login
  const login = async (clientId: string, code: string) => {
    isLoading.value = true
    hasError.value = false
    try {
      userAuth.value = await getAccessToken(clientId, code)
      localStorage.setItem('userAuth', JSON.stringify(userAuth.value))
      toast.success('Successfully logged in!')
    } catch (error) {
      console.log(error)
      hasError.value = error
      toast.error('Error while logging in!', {
        description: error
      })
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    userAuth.value = null
    localStorage.removeItem('userAuth')
    router.push({ name: 'login' }).then()

    // Reset the user store
    useUserStore().reset()
  }

  const isAuthenticated = computed(() => {
    return userAuth.value !== null
  })

  const accessToken = computed(() => {
    return userAuth.value?.access_token
  })

  return {
    userAuth,
    isAuthenticated,
    accessToken,
    isLoading,
    hasError,
    login,
    logout
  }
})
