import type { CustomError, ExtendedPostgrestError, PostgrestError } from '@/types/Error'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref<CustomError | ExtendedPostgrestError | null>(null)
  const isCustomError = ref(false)

  const setError = ({
    error,
    customCode
  }: {
    error: string | CustomError | PostgrestError | Error
    customCode?: number
  }) => {
    if (typeof error === 'string') isCustomError.value = true

    if (typeof error === 'string' || error instanceof Error) {
      activeError.value = typeof error === 'string' ? Error(error) : error
      activeError.value.customCode = customCode || 500
      return
    }

    activeError.value = error
    activeError.value.statusCode = customCode || 500
  }

  const clearError = () => {
    activeError.value = null
    isCustomError.value = false
  }

  return {
    activeError,
    isCustomError,
    setError,
    clearError
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useErrorStore, import.meta.hot))
}
