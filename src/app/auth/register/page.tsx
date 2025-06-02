'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'

export default function RegisterPage() {
  const {
    register: registerUser,
    isLoading,
    error,
    clearError,
  } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      location: '',
      phone: '',
    },
  })

  // Limpiar errores solo cuando el usuario cambie el email después de un error de email duplicado
  const watchedFields = watch()
  useEffect(() => {
    if (error && watchedFields.email) {
      // Solo limpiar si hay contenido en email y hubo un error previo
      const isEmailDuplicateError = error.toLowerCase().includes('email') && error.toLowerCase().includes('registrado')
      const timer = setTimeout(() => {
        clearError()
      }, isEmailDuplicateError ? 5000 : 2000) // 5s para email duplicado, 2s para otros errores

      return () => clearTimeout(timer)
    }
  }, [watchedFields.email, error, clearError])

  const onSubmit = async (data: RegisterFormData) => {
    clearError() // Limpiar errores previos al enviar
    // Extraer confirmPassword ya que no se envía al server
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = data
    await registerUser(registerData)
    // AuthGuard se encarga automáticamente de la redirección si es exitoso
  }

  const isFormComplete = isValid

  return (
    <>
      {/* Header */}
      <div className='text-center mb-6'>
        <div className='inline-flex items-center justify-center w-14 h-14 btn-gradient-orange rounded-2xl mb-3 animate-float shadow-lg'>
          <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
            />
          </svg>
        </div>
        <h1 className='text-2xl font-bold gradient-text mb-1'>Únete a CarLink</h1>
        <p className='text-sm text-secondary-700 font-medium'>Crea tu cuenta y comienza a rentar vehículos</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className='mb-4 animate-fade-in'>
          <Alert 
            type='error' 
            title={error.toLowerCase().includes('email') && error.toLowerCase().includes('registrado') 
              ? 'Email ya registrado' 
              : 'Error en el registro'
            }
            message={error} 
            onClose={clearError} 
          />
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='grid grid-cols-1 gap-4'>
          <Input
            {...register('fullName')}
            type='text'
            label='Nombre completo'
            placeholder='John Doe'
            error={errors.fullName?.message}
            icon={
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            }
          />

          <Input
            {...register('email')}
            type='email'
            label='Correo electrónico'
            placeholder='tu@ejemplo.com'
            error={errors.email?.message}
            icon={
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                />
              </svg>
            }
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <Input
              {...register('password')}
              type='password'
              label='Contraseña'
              placeholder='••••••••'
              error={errors.password?.message}
              icon={
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
              }
            />

            <Input
              {...register('confirmPassword')}
              type='password'
              label='Confirmar contraseña'
              placeholder='••••••••'
              error={errors.confirmPassword?.message}
              icon={
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              }
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <Input
              {...register('location')}
              type='text'
              label='Ubicación'
              placeholder='Bogotá, Colombia'
              error={errors.location?.message}
              icon={
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              }
            />

            <Input
              {...register('phone')}
              type='tel'
              label='Teléfono'
              placeholder='+57 300 123 4567'
              error={errors.phone?.message}
              icon={
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                  />
                </svg>
              }
            />
          </div>

          {/* Register Button */}
          <Button
            type='submit'
            variant='primary'
            size='lg'
            className='w-full btn-gradient-orange mt-6'
            isLoading={isLoading}
            disabled={!isFormComplete || isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className='relative my-4 p-1'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-secondary-200'></div>
        </div>
      </div>

      {/* Login Link */}
      <p className='text-center text-sm text-secondary-600'>
        ¿Ya tienes una cuenta?{' '}
        <Link href='/auth/login' className='font-medium text-accent-600 hover:text-accent-800 transition-colors'>
          Inicia sesión aquí
        </Link>
      </p>
    </>
  )
}
