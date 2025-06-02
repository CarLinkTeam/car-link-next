import { useState } from 'react'
import { VehicleService } from '@/lib/api/services/vehicle-service'

interface UseDeleteVehicleReturn {
  isLoading: boolean
  error: string | null
  deleteVehicle: (id: string) => Promise<boolean>
  clearError: () => void
}

export const useDeleteVehicle = (): UseDeleteVehicleReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteVehicle = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      await VehicleService.delete(id)

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el vehículo'
      setError(errorMessage)
      console.error('Error deleting vehicle:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    isLoading,
    error,
    deleteVehicle,
    clearError,
  }
}
