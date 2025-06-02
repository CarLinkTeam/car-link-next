import { useState, useEffect, useCallback } from 'react'
import { UserService } from '@/lib/api/services/user-service'
import { useAuthStore } from '@/store/auth-store'
import { AuthUser } from '@/lib/types/entities/user'

interface UseUserProfileReturn {
  userProfile: AuthUser | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [userProfile, setUserProfile] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, updateUser } = useAuthStore()

  const fetchUserProfile = useCallback(async () => {
    if (!user?.id) {
      setUserProfile(null)
      setIsLoading(false)
      setError(null)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Obtener datos completos del usuario
      const completeUserData = await UserService.getById(user.id)

      // Actualizar el estado local
      setUserProfile(completeUserData)

      // Sincronizar con el store de auth para que otros componentes tengan los datos actualizados
      updateUser(completeUserData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el perfil del usuario'
      setError(errorMessage)
      console.error('Error fetching user profile:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, updateUser])

  useEffect(() => {
    if (user?.id) {
      // Solo hacer fetch si no tenemos datos completos
      // Verificamos si faltan campos importantes como phone o location
      if (!user.phone || !user.location) {
        fetchUserProfile()
      } else {
        // Si ya tenemos datos completos, usarlos directamente
        setUserProfile(user)
        setIsLoading(false)
        setError(null)
      }
    }
  }, [user, fetchUserProfile])

  return {
    userProfile,
    isLoading,
    error,
    refetch: fetchUserProfile,
  }
}
