import { useState } from 'react'
import { VehicleService } from '@/lib/api/services/vehicle-service'
import { CreateVehicleDto } from '@/lib/types/entities/vehicle'
import { Vehicle } from '@/lib/types/entities/vehicle'

interface UseCreateVehicleReturn {
  isLoading: boolean
  error: string | null
  success: boolean
  createVehicle: (data: CreateVehicleDto) => Promise<Vehicle | null>
  clearMessages: () => void
}

export const useCreateVehicle = (): UseCreateVehicleReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const createVehicle = async (data: CreateVehicleDto): Promise<Vehicle | null> => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(false)

      const vehicle = await VehicleService.create(data)
      setSuccess(true)

      return vehicle
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el vehículo'
      setError(errorMessage)
      console.error('Error creating vehicle:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(false)
  }

  return {
    isLoading,
    error,
    success,
    createVehicle,
    clearMessages,
  }
}
