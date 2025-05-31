import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'

interface UseAuthOptions {
  requireAuth?: boolean
  redirectTo?: string
  redirectFrom?: string
}

/**
 * Hook para manejar la autenticación y redirecciones
 * @param options Opciones de configuración:
 *   - requireAuth: Si requiere autenticación (por defecto true)
 *   - redirectTo: Ruta a redirigir (por defecto '/auth/login' si requireAuth es true, '/dashboard' si es false)
 *   - redirectFrom: Ruta desde la que se redirige (por defecto '/auth/login' si requireAuth es true, '/dashboard' si es false)
 * @returns Objeto con:
 *   - Estado y métodos del authStore
 *   - Métodos de conveniencia: isLoggedIn, user, hasRole, hasAnyRole
 */
export function useAuth(options: UseAuthOptions = {}) {
  const { user, token, isAuthenticated, isLoading, error, login, register, logout, clearError, setLoading } =
    useAuthStore()

  const router = useRouter()

  useEffect(() => {
    if (options.requireAuth && !isAuthenticated && !isLoading) {
      router.push(options.redirectFrom || '/auth/login')
    } else if (!options.requireAuth && isAuthenticated && options.redirectTo) {
      router.push(options.redirectTo)
    }
  }, [isAuthenticated, isLoading, router, options])

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    setLoading,
  }
}
