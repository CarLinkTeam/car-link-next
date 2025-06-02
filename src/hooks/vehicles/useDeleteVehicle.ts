import { useState } from 'react'
import { VehicleService } from '@/lib/api/services/vehicle-service'

interface UseDeleteVehicleReturn {
  deleteVehicle: (id: string) => Promise<boolean>
  isLoading: boolean
  error: string | null
  success: boolean
  clearMessages: () => void
}

export const useDeleteVehicle = (): UseDeleteVehicleReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const deleteVehicle = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(false)

      await VehicleService.delete(id)

      setSuccess(true)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar vehículo'
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
    deleteVehicle,
    isLoading,
    error,
    success,
    clearMessages,
  }
}
