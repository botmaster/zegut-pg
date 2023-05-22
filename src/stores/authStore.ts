import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getAccessToken } from '@/helpers/auth/authCodeWithPkce'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'
import type { UserAuth } from '@/types/spotify'

export const useAuthStore = defineStore('authStore', () => {
  const userAuth = ref<UserAuth | null>(JSON.parse(localStorage.getItem('userAuth') || 'null'))
  const router = useRouter()
  const toast = useToast()

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
      toast.error('Error while logging in!\n' + error)
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    userAuth.value = null
    localStorage.removeItem('userAuth')
    router.push({ name: 'home' }).then()

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
