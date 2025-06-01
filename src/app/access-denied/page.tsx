'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth-store'

export default function AccessDeniedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, logout } = useAuthStore()

  const reason = searchParams.get('reason')

  const getMessages = () => {
    switch (reason) {
      case 'invalid-token':
        return {
          title: 'Token Inválido',
          description: 'Tu sesión ha expirado o el token de autenticación no es válido.',
          suggestion: 'Por favor, inicia sesión nuevamente para continuar.',
        }
      case 'unauthorized':
        return {
          title: 'Sin Permisos',
          description: 'No tienes los permisos necesarios para acceder a esta página.',
          suggestion: 'Contacta al administrador si crees que esto es un error.',
        }
      case 'session-invalid':
        return {
          title: 'Sesión Inválida',
          description: 'Tu sesión es inválida o ha ocurrido un error de autenticación.',
          suggestion: 'Por favor, inicia sesión nuevamente para continuar.',
        }
      case 'no-token':
        return {
          title: 'Acceso Restringido',
          description: 'Esta página requiere autenticación para acceder.',
          suggestion: 'Inicia sesión para continuar.',
        }
      default:
        return {
          title: 'Acceso Denegado',
          description: 'No tienes permisos para acceder a esta página o tu sesión ha expirado.',
          suggestion: 'Por favor, verifica tus credenciales e intenta nuevamente.',
        }
    }
  }

  const messages = getMessages()

  const handleGoHome = () => {
    if (isAuthenticated) {
      router.push('/dashboard/vehicles')
    } else {
      router.push('/')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  const shouldShowLogout = isAuthenticated && ['invalid-token', 'session-invalid'].includes(reason || '')

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4'>
      {/* Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400 to-accent-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-400 to-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000'></div>
      </div>

      <div className='relative text-center max-w-2xl mx-auto'>
        {/* Lock Icon */}
        <div className='mb-8 flex justify-center'>
          <div className='w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center animate-float'>
            <svg className='w-16 h-16 text-primary-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className='space-y-6 animate-fade-in'>
          <div>
            <h1 className='text-4xl md:text-5xl font-bold gradient-text mb-4'>{messages.title}</h1>
            <p className='text-lg text-secondary-600 max-w-lg mx-auto mb-2'>{messages.description}</p>
            <p className='text-sm text-secondary-500'>{messages.suggestion}</p>

            {reason && (
              <div className='mt-4 glass rounded-xl p-4 inline-block'>
                <div className='flex items-center gap-2 text-sm text-secondary-600'>
                  <svg className='w-4 h-4 text-amber-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                    />
                  </svg>
                  <span>Código: {reason.toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            {isAuthenticated ? (
              <>
                <Button variant='primary' size='lg' className='w-full sm:w-auto btn-gradient' onClick={handleGoHome}>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                    />
                  </svg>
                  Ir al Dashboard
                </Button>

                {shouldShowLogout && (
                  <Button
                    variant='outline'
                    size='lg'
                    className='w-full sm:w-auto border-primary-300 text-primary-600 hover:bg-primary-50 transition-all duration-200'
                    onClick={handleLogout}
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                      />
                    </svg>
                    Renovar sesión
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant='primary' size='lg' className='w-full sm:w-auto btn-gradient'>
                  <Link href='/auth/login' className='flex items-center gap-2'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                      />
                    </svg>
                    Iniciar sesión
                  </Link>
                </Button>

                <Button
                  variant='outline'
                  size='lg'
                  className='w-full sm:w-auto border-primary-300 text-primary-600 hover:bg-primary-50 transition-all duration-200'
                >
                  <Link href='/' className='flex items-center gap-2'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                      />
                    </svg>
                    Ir al inicio
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
