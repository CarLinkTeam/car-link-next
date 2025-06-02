import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { useUpdateProfile } from '@/hooks/useUpdateProfile'
import { AuthUser } from '@/lib/types/entities/user'
import { editProfileSchema, EditProfileFormData } from '@/lib/validations/profile'

interface EditProfileFormProps {
  user: AuthUser
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, isOpen, onClose, onSuccess }) => {
  const { updateProfile, isLoading, error, success, clearMessages } = useUpdateProfile()
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onBlur',
  })

  // Manejar el éxito
  useEffect(() => {
    if (success) {
      setShowSuccessAlert(true)
      setTimeout(() => {
        setShowSuccessAlert(false)
        onSuccess?.()
        onClose()
        clearMessages()
        setHasInitialized(false)
      }, 2000)
    }
  }, [success, onSuccess, onClose, clearMessages])

  // Inicializar valores solo cuando se abre el modal
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      setValue('fullName', user.fullName)
      setValue('phone', user.phone)
      setValue('location', user.location)
      setValue('password', '')
      clearMessages()
      setShowSuccessAlert(false)
      setHasInitialized(true)
    } else if (!isOpen) {
      setHasInitialized(false)
    }
  }, [isOpen, hasInitialized, setValue, user.fullName, user.phone, user.location, clearMessages])

  const onSubmit = async (data: EditProfileFormData) => {
    // Solo incluir la contraseña si se proporcionó
    const updateData = {
      fullName: data.fullName,
      phone: data.phone,
      location: data.location,
      ...(data.password && { password: data.password }),
    }

    await updateProfile(updateData)
  }

  const handleClose = () => {
    clearMessages()
    setShowSuccessAlert(false)
    setHasInitialized(false)
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-secondary-900'>Editar Perfil</h2>
          <button onClick={handleClose} className='p-2 hover:bg-secondary-100 rounded-lg transition-colors'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {showSuccessAlert && (
          <Alert
            type='success'
            title='¡Perfil actualizado!'
            message='Tus datos se han actualizado correctamente.'
            className='mb-4'
          />
        )}

        {error && (
          <Alert type='error' title='Error al actualizar' message={error} onClose={clearMessages} className='mb-4' />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Input
            {...register('fullName')}
            type='text'
            label='Nombre Completo'
            placeholder='Tu nombre completo'
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

          <Input
            {...register('location')}
            type='text'
            label='Ubicación'
            placeholder='Tu ciudad'
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
            {...register('password')}
            type='password'
            label='Nueva Contraseña (Opcional)'
            placeholder='Dejar vacío para mantener la actual'
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

          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              size='lg'
              className='flex-1'
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              variant='primary'
              size='lg'
              className='flex-1 btn-gradient'
              disabled={!isValid || isLoading}
              isLoading={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
