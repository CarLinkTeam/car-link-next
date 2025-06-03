'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4 auth-pattern'>
      {/* Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400 to-accent-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-400 to-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow'></div>
      </div>

      <div className='relative text-center max-w-2xl mx-auto'>
        {/* 404 Illustration */}
        <div className='mb-8'>
          <div className='relative'>
            <h1 className='text-[120px] md:text-[180px] font-bold gradient-text leading-none animate-glow'>404</h1>
          </div>
        </div>

        {/* Content */}
        <div className='space-y-6'>
          <div>
            <h2 className='text-3xl md:text-4xl font-bold gradient-text mb-4'>¡Oops! Página no encontrada</h2>
            <p className='text-lg text-secondary-600 max-w-lg mx-auto'>
              La página que estás buscando no existe o ha sido movida. No te preocupes, te ayudamos a encontrar lo que
              necesitas en CarLink.
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Link href='/'>
              <Button variant='primary' size='lg' className='w-full sm:w-auto'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                  />
                </svg>
                Ir al inicio
              </Button>
            </Link>

            <Button variant='outline' size='lg' className='w-full sm:w-auto' onClick={() => window.history.back()}>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
              </svg>
              Volver atrás
            </Button>
          </div>

          {/* Quick Links */}
          <div className='glass rounded-2xl p-6 border border-white/20 car-card'>
            <h3 className='text-lg font-semibold gradient-text mb-4'>Enlaces útiles</h3>
            <div className='grid grid-cols-2 md:grid-cols-2 gap-3'>
              <Link
                href='/auth/login'
                className='flex flex-col items-center p-4 rounded-xl glass hover:bg-primary-50 transition-all duration-200 group'
              >
                <svg
                  className='w-8 h-8 text-primary-600 mb-2 group-hover:scale-110 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                  />
                </svg>
                <span className='text-sm font-medium text-secondary-700'>Iniciar sesión</span>
              </Link>

              <Link
                href='/auth/register'
                className='flex flex-col items-center p-4 rounded-xl glass hover:bg-accent-50 transition-all duration-200 group'
              >
                <svg
                  className='w-8 h-8 text-accent-600 mb-2 group-hover:scale-110 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
                  />
                </svg>
                <span className='text-sm font-medium text-secondary-700'>Registrarse</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
