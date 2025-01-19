import type { CustomError, ExtendedAxiosError } from '@/types/Error'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref<null | CustomError | ExtendedAxiosError>(null)
  const isCustomError = ref(false)

  const setError = ({
    error,
    customCode
  }: {
    error: Error | ExtendedAxiosError | string
    customCode?: number
  }) => {
    if (typeof error === 'string') isCustomError.value = true

    if (typeof error === 'string' || error instanceof Error) {
      activeError.value = typeof error === 'string' ? Error(error) : error
      //activeError.value.customCode = customCode || 500
      return
    }

    activeError.value = error as ExtendedAxiosError
    if (isExtendedAxiosError(activeError.value)) {
      activeError.value.statusCode = customCode || 500
    }
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

function isExtendedAxiosError(error: any): error is ExtendedAxiosError {
  return (error as ExtendedAxiosError).statusCode !== undefined
}
