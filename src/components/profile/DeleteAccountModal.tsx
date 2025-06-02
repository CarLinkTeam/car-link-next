import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useDeleteUser } from '@/hooks/useDeleteUser'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, userEmail }) => {
  const { deleteUser, isLoading, error, clearError } = useDeleteUser()
  const [confirmText, setConfirmText] = useState('')
  const expectedText = 'ELIMINAR MI CUENTA'
  const isConfirmValid = confirmText === expectedText

  const handleDelete = async () => {
    const success = await deleteUser()
    if (success) {
      onClose()
    }
  }

  const handleClose = () => {
    setConfirmText('')
    clearError()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-3xl p-6 w-full max-w-md'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-red-600'>Eliminar Cuenta</h2>
          <button
            onClick={handleClose}
            className='p-2 hover:bg-secondary-100 rounded-lg transition-colors'
            disabled={isLoading}
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        <div className='space-y-4'>
          <Alert
            type='warning'
            title='¡Esta acción es irreversible!'
            message='Al eliminar tu cuenta, perderás todos tus datos, vehículos registrados y historial. Esta acción no se puede deshacer.'
          />

          <div className='bg-red-50 border border-red-200 rounded-xl p-4'>
            <h3 className='font-semibold text-red-800 mb-2'>Se eliminará permanentemente:</h3>
            <ul className='text-sm text-red-700 space-y-1'>
              <li>• Tu perfil y datos personales</li>
              <li>• Todos tus vehículos registrados</li>
              <li>• Historial de rentas y transacciones</li>
              <li>• Configuraciones y preferencias</li>
            </ul>
          </div>

          <div className='space-y-2'>
            <p className='text-sm text-secondary-700'>
              Cuenta a eliminar: <strong>{userEmail}</strong>
            </p>
            <p className='text-sm text-secondary-700'>
              Para confirmar, escribe <strong>&quot;{expectedText}&quot;</strong> en el campo de abajo:
            </p>
            <input
              type='text'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={expectedText}
              className='w-full p-3 border border-secondary-300 rounded-xl focus:border-red-400 focus:outline-none'
              disabled={isLoading}
            />
          </div>

          {error && <Alert type='error' title='Error al eliminar cuenta' message={error} onClose={clearError} />}

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
              type='button'
              size='lg'
              className='flex-1 bg-red-600 hover:bg-red-700 text-white'
              onClick={handleDelete}
              disabled={!isConfirmValid || isLoading}
              isLoading={isLoading}
            >
              {isLoading ? 'Eliminando...' : 'Eliminar Cuenta'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
