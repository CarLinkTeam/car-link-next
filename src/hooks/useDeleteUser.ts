import { useState } from 'react'
import { UserService } from '@/lib/api/services/user-service'
import { useAuthStore } from '@/store/auth-store'

interface UseDeleteUserReturn {
  isLoading: boolean
  error: string | null
  deleteUser: () => Promise<boolean>
  clearError: () => void
}

export const useDeleteUser = (): UseDeleteUserReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, logout } = useAuthStore()

  const deleteUser = async (): Promise<boolean> => {
    if (!user?.id) {
      setError('No se encontró información del usuario')
      return false
    }

    try {
      setIsLoading(true)
      setError(null)

      await UserService.delete(user.id)

      // Cerrar sesión automáticamente después de eliminar la cuenta
      logout()

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la cuenta'
      setError(errorMessage)
      console.error('Error deleting user:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    isLoading,
    error,
    deleteUser,
    clearError,
  }
}
