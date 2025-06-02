'use client'

import React, { useState, useMemo } from 'react'
import { useMyVehicles } from '@/hooks/vehicles/useMyVehicles'
import { usePromoteToOwner } from '@/hooks/usePromoteToOwner'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useDeleteVehicle } from '@/hooks/vehicles/useDeleteVehicle'
import { Button } from '@/components/ui/Button'
import VehicleCard from '@/components/ui/VehicleCard'
import { Alert } from '@/components/ui/Alert'
import { EditProfileForm } from '@/components/ui/profile/EditProfileForm'
import { DeleteAccountModal } from '@/components/ui/profile/DeleteAccountModal'
import { VehicleForm } from '@/components/ui/vehicles/VehicleForm'
import { DeleteVehicleModal } from '@/components/ui/vehicles/DeleteVehicleModal'
import { UserRole } from '@/lib/types/entities/user'
import { Vehicle } from '@/lib/types/entities/vehicle'

const VEHICLES_PER_PAGE = 1

type VehicleSectionMode = 'list' | 'create' | 'edit'

export default function ProfilePage() {
  const { userProfile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useUserProfile()
  const { vehicles, isLoading: vehiclesLoading, error: vehiclesError, refetch } = useMyVehicles()
  const { promoteToOwner, isLoading: promoteLoading, error: promoteError } = usePromoteToOwner()
  const { deleteVehicle, isLoading: isDeleting } = useDeleteVehicle()

  const [showPromoteSuccess, setShowPromoteSuccess] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeleteVehicleModal, setShowDeleteVehicleModal] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null)
  const [vehicleSectionMode, setVehicleSectionMode] = useState<VehicleSectionMode>('list')
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)

  const currentUser = userProfile

  const isOwner = currentUser?.roles?.includes('OWNER' as UserRole)
  const canPromoteToOwner = currentUser?.roles?.some((role) => ['TENANT', 'ADMIN'].includes(role))

  // Calcular paginación
  const totalPages = Math.ceil(vehicles.length / VEHICLES_PER_PAGE)
  const startIndex = (currentPage - 1) * VEHICLES_PER_PAGE
  const endIndex = startIndex + VEHICLES_PER_PAGE
  const currentVehicles = vehicles.slice(startIndex, endIndex)

  // Resetear página cuando cambien los vehículos
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  const handlePromoteToOwner = async () => {
    const success = await promoteToOwner()
    if (success) {
      setShowPromoteSuccess(true)
      setTimeout(() => setShowPromoteSuccess(false), 3000)
      refetch() // Recuperar vehículos en caso de que el usuario tenga ahora acceso
      refetchProfile() // Actualizar datos del perfil
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const handleEditSuccess = () => {
    refetchProfile()
  }

  const handleVehicleFormSuccess = () => {
    refetch() // Refrescar lista de vehículos
    setVehicleSectionMode('list') // Volver a la lista
    setEditingVehicle(null)
  }

  const handleVehicleFormCancel = () => {
    setVehicleSectionMode('list')
    setEditingVehicle(null)
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setVehicleSectionMode('edit')
  }

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle)
    setShowDeleteVehicleModal(true)
  }

  const confirmDeleteVehicle = async () => {
    if (vehicleToDelete) {
      const success = await deleteVehicle(vehicleToDelete.id)
      if (success) {
        refetch() // Refrescar lista de vehículos
        setShowDeleteVehicleModal(false)
        setVehicleToDelete(null)
      }
    }
  }

  const cancelDeleteVehicle = () => {
    setShowDeleteVehicleModal(false)
    setVehicleToDelete(null)
  }

  if (!currentUser) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-secondary-600'>Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold gradient-text mb-2'>Mi Perfil</h1>
        <p className='text-secondary-600'>Gestiona tu información personal y vehículos</p>
      </div>

      {/* Success Message */}
      {showPromoteSuccess && (
        <Alert
          type='success'
          title='¡Promoción exitosa!'
          message='Ahora eres un OWNER y puedes registrar vehículos.'
          onClose={() => setShowPromoteSuccess(false)}
        />
      )}

      {/* Error Messages */}
      {promoteError && <Alert type='error' title='Error en la promoción' message={promoteError} onClose={() => {}} />}

      {/* Profile Error */}
      {profileError && <Alert type='error' title='Error al cargar perfil' message={profileError} onClose={() => {}} />}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* User Information */}
        <div className='glass rounded-4xl p-8'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-4'>
              <div className='w-16 h-16 btn-gradient rounded-2xl flex items-center justify-center'>
                <span className='text-white text-xl font-bold'>
                  {currentUser && currentUser.fullName && (
                    <span className='text-white text-xl font-bold'>
                      {currentUser.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </span>
                  )}
                </span>
              </div>
              <div>
                <h2 className='text-2xl font-bold text-secondary-900'>{currentUser?.fullName}</h2>
                <p className='text-secondary-600'>{currentUser?.email}</p>
              </div>
            </div>

            {/* Profile Actions */}
            <div className='flex gap-2'>
              <Button variant='outline' size='sm' onClick={() => setShowEditModal(true)} disabled={profileLoading}>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
                Editar
              </Button>
            </div>
          </div>

          {profileLoading ? (
            <div className='space-y-4'>
              <div className='animate-pulse'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <div className='h-4 bg-secondary-200 rounded mb-2'></div>
                    <div className='h-10 bg-secondary-100 rounded'></div>
                  </div>
                  <div>
                    <div className='h-4 bg-secondary-200 rounded mb-2'></div>
                    <div className='h-10 bg-secondary-100 rounded'></div>
                  </div>
                </div>
                <div className='mt-4'>
                  <div className='h-4 bg-secondary-200 rounded mb-2'></div>
                  <div className='h-8 bg-secondary-100 rounded'></div>
                </div>
              </div>
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-secondary-700 mb-1'>Teléfono</label>
                  <div className='glass rounded-xl p-3'>
                    <span className='text-secondary-900'>{currentUser?.phone || 'No especificado'}</span>
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-secondary-700 mb-1'>Ubicación</label>
                  <div className='glass rounded-xl p-3'>
                    <span className='text-secondary-900'>{currentUser?.location || 'No especificada'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-secondary-700 mb-1'>Roles</label>
                <div className='flex flex-wrap gap-2'>
                  {currentUser?.roles.map((role) => (
                    <span
                      key={role}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        role === 'OWNER'
                          ? 'bg-green-100 text-green-800'
                          : role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Promote to Owner Button */}
              {canPromoteToOwner && !isOwner && (
                <div className='pt-4 border-t border-secondary-200'>
                  <Button
                    variant='primary'
                    size='lg'
                    className='w-full btn-gradient'
                    onClick={handlePromoteToOwner}
                    disabled={promoteLoading}
                  >
                    {promoteLoading ? (
                      <>
                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        Promoviendo...
                      </>
                    ) : (
                      <>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M13 10V3L4 14h7v7l9-11h-7z'
                          />
                        </svg>
                        Convertirse en OWNER
                      </>
                    )}
                  </Button>
                  <p className='text-xs text-secondary-500 mt-2 text-center'>
                    Conviértete en OWNER para poder registrar y gestionar tus propios vehículos
                  </p>
                </div>
              )}

              {/* Danger Zone */}
              <div className='pt-4 border-t border-red-200'>
                <h3 className='text-sm font-medium text-red-700 mb-2'>Zona de peligro</h3>
                <Button
                  variant='outline'
                  size='sm'
                  className='border-red-300 text-red-600 hover:bg-red-50'
                  onClick={() => setShowDeleteModal(true)}
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                  Eliminar cuenta
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* My Vehicles Section */}
        <div className='glass rounded-4xl p-8'>
          {/* Header con modo dinámico */}
          {vehicleSectionMode === 'list' && (
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-3'>
                <h2 className='text-2xl font-bold text-secondary-900'>Mis Vehículos</h2>
                {vehicles.length > 0 && (
                  <span className='px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium'>
                    {vehicles.length} {vehicles.length === 1 ? 'vehículo' : 'vehículos'}
                  </span>
                )}
              </div>
              {isOwner && (
                <Button variant='outline' size='sm' onClick={() => setVehicleSectionMode('create')}>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                  </svg>
                  Agregar Vehículo
                </Button>
              )}
            </div>
          )}

          {/* Renderizado dinámico según el modo */}
          {vehicleSectionMode === 'create' && (
            <VehicleForm mode='create' onSuccess={handleVehicleFormSuccess} onCancel={handleVehicleFormCancel} />
          )}

          {vehicleSectionMode === 'edit' && editingVehicle && (
            <VehicleForm
              mode='edit'
              vehicle={editingVehicle}
              onSuccess={handleVehicleFormSuccess}
              onCancel={handleVehicleFormCancel}
            />
          )}

          {vehicleSectionMode === 'list' && (
            <>
              {!isOwner ? (
                <div className='text-center py-12'>
                  <svg
                    className='w-16 h-16 text-secondary-300 mx-auto mb-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                    />
                  </svg>
                  <h3 className='text-lg font-semibold text-secondary-700 mb-2'>Acceso restringido</h3>
                  <p className='text-secondary-500 mb-4'>Necesitas ser OWNER para ver y gestionar vehículos</p>
                  {canPromoteToOwner && (
                    <p className='text-sm text-secondary-400'>
                      Usa el botón &quot;Convertirse en OWNER&quot; para obtener acceso
                    </p>
                  )}
                </div>
              ) : vehiclesLoading ? (
                <div className='text-center py-12'>
                  <div className='w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4'></div>
                  <p className='text-secondary-600'>Cargando vehículos...</p>
                </div>
              ) : vehiclesError ? (
                <div className='text-center py-12'>
                  <svg
                    className='w-16 h-16 text-red-300 mx-auto mb-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <h3 className='text-lg font-semibold text-red-700 mb-2'>Error al cargar vehículos</h3>
                  <p className='text-red-600 mb-4'>{vehiclesError}</p>
                  <Button variant='outline' onClick={refetch}>
                    Reintentar
                  </Button>
                </div>
              ) : vehicles.length === 0 ? (
                <div className='text-center py-12'>
                  <svg
                    className='w-16 h-16 text-secondary-300 mx-auto mb-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-4 0H3m2-16h14a2 2 0 012 2v14a2 2 0 01-2 2M7 7h10m-10 4h10m-10 4h7'
                    />
                  </svg>
                  <h3 className='text-lg font-semibold text-secondary-700 mb-2'>No tienes vehículos</h3>
                  <p className='text-secondary-500 mb-4'>
                    Comienza agregando tu primer vehículo para comenzar a generar ingresos
                  </p>
                  <Button variant='primary' className='btn-gradient' onClick={() => setVehicleSectionMode('create')}>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                      />
                    </svg>
                    Agregar mi primer vehículo
                  </Button>
                </div>
              ) : (
                <div className='space-y-6'>
                  {/* Vehicles List con botones de acción */}
                  <div className='space-y-4'>
                    {currentVehicles.map((vehicle) => (
                      <div key={vehicle.id} className='relative'>
                        <VehicleCard vehicle={vehicle} />

                        {/* Botones de acción */}
                        <div className='absolute top-4 right-4 flex gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleEditVehicle(vehicle)}
                            disabled={isDeleting}
                            className='bg-white/90 backdrop-blur-sm'
                          >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                              />
                            </svg>
                            Editar
                          </Button>

                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleDeleteVehicle(vehicle)}
                            disabled={isDeleting}
                            className='bg-white/90 backdrop-blur-sm border-red-300 text-red-600 hover:bg-red-50'
                          >
                            {isDeleting ? (
                              <div className='w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin' />
                            ) : (
                              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                />
                              </svg>
                            )}
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls - mismo código existente */}
                  {totalPages > 1 && (
                    <div className='flex flex-col items-center space-y-4'>
                      <div className='text-sm text-secondary-600'>
                        Mostrando {startIndex + 1}-{Math.min(endIndex, vehicles.length)} de {vehicles.length} vehículos
                      </div>

                      <div className='flex items-center justify-center space-x-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                          className='px-3 py-2 pagination-button'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                          </svg>
                        </Button>

                        <div className='flex space-x-1'>
                          {Array.from({ length: totalPages }, (_, index) => {
                            const page = index + 1
                            const isCurrentPage = page === currentPage

                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 pagination-button ${
                                  isCurrentPage
                                    ? 'btn-gradient text-white shadow-lg pagination-active'
                                    : 'glass text-secondary-700 hover:bg-primary-50 hover:text-primary-700'
                                }`}
                              >
                                {page}
                              </button>
                            )
                          })}
                        </div>

                        <Button
                          variant='outline'
                          size='sm'
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                          className='px-3 py-2 pagination-button'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                          </svg>
                        </Button>
                      </div>

                      {totalPages > 5 && (
                        <div className='flex items-center space-x-2 text-sm text-secondary-600'>
                          <span>Ir a página:</span>
                          <select
                            value={currentPage}
                            onChange={(e) => handlePageChange(Number(e.target.value))}
                            className='glass rounded-lg px-2 py-1 text-secondary-900 border border-secondary-200 focus:border-primary-400 focus:outline-none'
                          >
                            {Array.from({ length: totalPages }, (_, index) => (
                              <option key={index + 1} value={index + 1}>
                                {index + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {currentUser && (
        <>
          <EditProfileForm
            user={currentUser}
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSuccess={handleEditSuccess}
          />
          <DeleteAccountModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            userEmail={currentUser.email}
          />
          <DeleteVehicleModal
            isOpen={showDeleteVehicleModal}
            vehicle={vehicleToDelete}
            onConfirm={confirmDeleteVehicle}
            onCancel={cancelDeleteVehicle}
            isDeleting={isDeleting}
          />
        </>
      )}
    </div>
  )
}
