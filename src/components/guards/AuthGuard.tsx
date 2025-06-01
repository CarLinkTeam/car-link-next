'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'

interface AuthGuardProps {
  children: React.ReactNode
}

// Rutas que requieren autenticación
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/vehicles', '/rentals']

// Rutas que redirigen usuarios autenticados
const AUTH_ROUTES = ['/auth/login', '/auth/register']

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, _hasHydrated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // Solo verificar una vez después de que el store se haya hidratado
    if (_hasHydrated && !hasChecked) {
      const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
      const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

      if (isProtectedRoute && !isAuthenticated) {
        router.push('/auth/login')
      } else if (isAuthRoute && isAuthenticated) {
        router.push('/dashboard')
      }

      // Marcar como verificado para evitar verificaciones adicionales
      setHasChecked(true)
    }
  }, [_hasHydrated, hasChecked, isAuthenticated, pathname, router])

  // Mostrar loading solo mientras NO se haya hidratado
  if (!_hasHydrated) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50'>
        <div className='text-center'>
          <div className='relative mb-8'>
            <div className='w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto'></div>
            <div className='w-12 h-12 border-4 border-accent-200 border-t-accent-600 rounded-full animate-reverse-spin absolute top-2 left-1/2 transform -translate-x-1/2'></div>
          </div>

          <h2 className='text-2xl font-semibold gradient-text mb-2'>Cargando...</h2>
          <p className='text-secondary-600'>Verificando autenticación...</p>

          <div className='flex justify-center space-x-1 mt-4'>
            <div className='w-2 h-2 bg-primary-600 rounded-full animate-bounce'></div>
            <div className='w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-100'></div>
            <div className='w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-200'></div>
          </div>
        </div>
      </div>
    )
  }

  // Una vez hidratado, siempre mostrar el contenido
  return <>{children}</>
}
