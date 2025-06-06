import { useState, useEffect, useCallback } from 'react'
import { Vehicle } from '@/lib/types/entities/vehicle'
import { VehicleService } from '@/lib/api/services/vehicle-service'
import { useIsOwner } from '@/store/auth-store'

interface UseMyVehiclesReturn {
  vehicles: Vehicle[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface AxiosError {
  response?: {
    status: number
  }
}

export const useMyVehicles = (): UseMyVehiclesReturn => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isOwner = useIsOwner()

  const fetchMyVehicles = useCallback(async () => {
    if (!isOwner) {
      setVehicles([])
      setIsLoading(false)
      setError(null)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await VehicleService.getMyVehicles()
      setVehicles(data)
    } catch (err) {
      const axiosError = err as AxiosError
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar vehículos'

      // Manejar caso específico cuando un owner no tiene vehículos (esto es normal, no un error)
      if (
        axiosError.response?.status === 404 ||
        errorMessage.includes('not found') ||
        errorMessage.includes('Vehicles for owner') ||
        errorMessage.includes('El recurso solicitado no existe')
      ) {
        setVehicles([])
        setError(null)
        return
      }
      
      setError(errorMessage)
      setVehicles([])
    } finally {
      setIsLoading(false)
    }
  }, [isOwner])

  useEffect(() => {
    fetchMyVehicles()
  }, [fetchMyVehicles])

  return {
    vehicles,
    isLoading,
    error,
    refetch: fetchMyVehicles,
  }
}
