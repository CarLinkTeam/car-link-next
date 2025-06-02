import { useState } from 'react'
import { EditVehicleFormData } from '@/lib/validations/vehicle'
import { VehicleService } from '@/lib/api/services/vehicle-service'

interface UseUpdateVehicleReturn {
  updateVehicle: (id: string, data: EditVehicleFormData) => Promise<boolean>
  isLoading: boolean
  error: string | null
  success: boolean
  clearMessages: () => void
}

export const useUpdateVehicle = (): UseUpdateVehicleReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const updateVehicle = async (id: string, data: EditVehicleFormData): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(false)

      await VehicleService.update(id, data)

      setSuccess(true)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar vehículo'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(false)
  }

  return {
    updateVehicle,
    isLoading,
    error,
    success,
    clearMessages,
  }
}
