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
    // console.log('Axios interceptors request', config)
    const authStore = useAuthStore()
    if (authStore.accessToken) config.headers.Authorization = `Bearer ${authStore.accessToken}`
    return config
  },
  (error) => {
    console.error('axios request error', error)
    return Promise.reject(error)
  }
)

// Add an interceptor to refresh the token if it has expired
/*api.interceptors.response.use(
  (response) => {
    //console.log('Axios interceptors response', response)
    return response
  },
  async (error) => {
    console.error('Axios interceptors response error', error)

    const originalRequest = error.config

    // If token is expired, refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      console.warn('Http 401 error, refreshing token')
      originalRequest._retry = true
      await useAuthStore().refreshTheToken()
      console.log('Token refreshed')
      // Retry the request
      return api.request(originalRequest)
    } else {
      toast.error(t('common.errors.apiError'))
      return Promise.reject(error)
    }
  }
)*/

api.interceptors.response.use(
  (res) => {
    return res
  },
  async (err) => {
    console.error('Axios interceptors response error', err)
    const originalConfig = err.config

    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        console.warn('Http 401 error, refreshing token')
        originalConfig._retry = true

        try {
          await useAuthStore().refreshTheToken()
          console.log('Token refreshed')
          return api(originalConfig)
        } catch (error) {
          console.error('Error refreshing token', error)
          useAuthStore().logout()
          toast.warning(t('common.errors.sessionExpired'))
        }
      }

      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data)
      }
    }

    return Promise.reject(err)
  }
)

export default api
