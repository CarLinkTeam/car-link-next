import { useState } from 'react'
import { VehicleService } from '@/lib/api/services/vehicle-service'
import { UpdateVehicleDto } from '@/lib/types/entities/vehicle'
import { Vehicle } from '@/lib/types/entities/vehicle'

interface UseUpdateVehicleReturn {
  isLoading: boolean
  error: string | null
  success: boolean
  updateVehicle: (id: string, data: UpdateVehicleDto) => Promise<Vehicle | null>
  clearMessages: () => void
}

export const useUpdateVehicle = (): UseUpdateVehicleReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const updateVehicle = async (id: string, data: UpdateVehicleDto): Promise<Vehicle | null> => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(false)

      const vehicle = await VehicleService.update(id, data)
      setSuccess(true)

      return vehicle
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el vehículo'
      setError(errorMessage)
      console.error('Error updating vehicle:', err)
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
    updateVehicle,
    clearMessages,
  }
}
