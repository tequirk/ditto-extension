import { ref } from 'vue'

export function useErrorHandling() {
  const error = ref('')

  function setError(message: string) {
    error.value = message
  }

  function clearError() {
    error.value = ''
  }

  /**
   * Wraps an async operation with error handling
   */
  async function handleAsync<T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T | null> {
    try {
      return await operation()
    } catch (err) {
      console.error(errorMessage, err)
      setError(errorMessage)
      return null
    }
  }

  /**
   * Wraps a sync operation with error handling
   */
  function handleSync<T>(
    operation: () => T,
    errorMessage: string
  ): T | null {
    try {
      return operation()
    } catch (err) {
      console.error(errorMessage, err)
      setError(errorMessage)
      return null
    }
  }

  return {
    error,
    setError,
    clearError,
    handleAsync,
    handleSync,
  }
}
