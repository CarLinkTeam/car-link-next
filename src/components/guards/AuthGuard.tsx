'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/auth/login',
  fallback,
}) => {
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo)
        setShouldRender(false)
      } else if (!requireAuth && isAuthenticated) {
        router.push('/dashboard')
        setShouldRender(false)
      } else {
        setShouldRender(true)
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading || !shouldRender) {
    return (
      fallback || (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50'>
          <div className='text-center'>
            <div className='relative mb-8'>
              <div className='w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto'></div>
              <div className='w-12 h-12 border-4 border-accent-200 border-t-accent-600 rounded-full animate-reverse-spin absolute top-2 left-1/2 transform -translate-x-1/2'></div>
            </div>

            <h2 className='text-2xl font-semibold gradient-text mb-2'>Cargando...</h2>
            <p className='text-secondary-600'>Por favor espera un momento</p>

            <div className='flex justify-center space-x-1 mt-4'>
              <div className='w-2 h-2 bg-primary-600 rounded-full animate-bounce'></div>
              <div className='w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-100'></div>
              <div className='w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-200'></div>
            </div>
          </div>
        </div>
      )
    )
  }
  return <>{children}</>
}
