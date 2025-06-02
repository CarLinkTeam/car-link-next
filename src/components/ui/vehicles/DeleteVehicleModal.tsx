'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { Vehicle } from '@/lib/types/entities/vehicle'
import Image from 'next/image'

interface DeleteVehicleModalProps {
  isOpen: boolean
  vehicle: Vehicle | null
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
}

export const DeleteVehicleModal: React.FC<DeleteVehicleModalProps> = ({
  isOpen,
  vehicle,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen || !vehicle) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='glass rounded-4xl max-w-md w-full overflow-hidden border border-red-200'>
        {/* Header con ícono de advertencia */}
        <div className='bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-red-200'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
              <svg className='w-6 h-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-xl font-bold text-red-900'>Eliminar Vehículo</h3>
              <p className='text-red-700 text-sm'>Esta acción no se puede deshacer</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 space-y-4'>
          <div className='bg-red-50 border border-red-200 rounded-xl p-4'>
            <p className='text-secondary-800 mb-3'>¿Estás seguro de que quieres eliminar este vehículo?</p>

            {/* Información del vehículo */}
            <div className='bg-white rounded-lg p-3 border border-red-200'>
              <div className='flex items-center gap-3'>
                {vehicle.url_photos && vehicle.url_photos.length > 0 && (
                  <div className='w-12 h-12 rounded-lg overflow-hidden bg-secondary-100'>
                    <Image
                      src={vehicle.url_photos[0]}
                      alt={`${vehicle.make} ${vehicle.vehicleModel}`}
                      width={48}
                      height={48}
                      className='w-full h-full object-cover'
                      unoptimized={true}
                    />
                  </div>
                )}
                <div>
                  <p className='font-semibold text-secondary-900'>
                    {vehicle.make} {vehicle.vehicleModel}
                  </p>
                  <p className='text-sm text-secondary-600'>
                    {vehicle.year} • {vehicle.color} • {vehicle.license_plate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-amber-50 border border-amber-200 rounded-xl p-4'>
            <div className='flex gap-3'>
              <svg
                className='w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <div className='text-sm text-amber-800'>
                <p className='font-medium mb-1'>Qué pasará al eliminar:</p>
                <ul className='space-y-1 text-amber-700'>
                  <li>• Se eliminará toda la información del vehículo</li>
                  <li>• No podrás deshacer esta acción</li>
                  <li>• Las fotos se eliminarán permanentemente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className='bg-secondary-50 px-6 py-4 border-t border-secondary-200'>
          <div className='flex gap-3'>
            <Button type='button' variant='outline' onClick={onCancel} disabled={isDeleting} className='flex-1'>
              <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
              Cancelar
            </Button>

            <Button
              type='button'
              onClick={onConfirm}
              disabled={isDeleting}
              className='flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700'
            >
              {isDeleting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                  Eliminando...
                </>
              ) : (
                <>
                  <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                  Sí, eliminar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
