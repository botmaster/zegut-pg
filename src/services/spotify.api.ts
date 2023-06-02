import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
// @ts-ignore
import i18n from '@/plugins/i18n'

const toast = useToast()
const { t } = i18n.global

/**
 * Axios instance to make requests to the Spotify API
 */

const baseURL = 'https://api.spotify.com/v1'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add an interceptor to add the authentication token to requests
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
    return config
  },
  (error) => {
    console.error('axios request error', error)
    return Promise.reject(error)
  }
)

// Add an interceptor to refresh the token if it has expired
api.interceptors.response.use(
  (response) => {
    // console.log('Axios interceptors response', response)
    return response
  },
  (error) => {
    console.error('Axios interceptors response error', error)

    // If token is expired, logout
    if (error.response.status === 401) {
      console.warn('Http 401 error, logging out')
      useAuthStore().logout()
      toast.warning(t('common.errors.sessionExpired'))
    }
    return Promise.reject(error)
  }
)

export default api
