import { useState, useEffect, useCallback } from 'react'
import { Vehicle } from '@/lib/types/entities/vehicle'
import { VehicleService } from '@/lib/api/services/vehicle-service'
import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/lib/types/entities/user'

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
  const { user } = useAuthStore()

  const isOwner = user?.roles?.includes('OWNER' as UserRole)

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
      if (axiosError.response?.status === 404) {
        setVehicles([])
        setError(null)
        console.info('No vehicles found for user (404) - treating as empty list')
        return
      }

      const errorMessage = err instanceof Error ? err.message : 'Error al cargar vehículos'
      setError(errorMessage)
      setVehicles([])
      console.error('Error fetching my vehicles:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isOwner])

  useEffect(() => {
    if (user) {
      fetchMyVehicles()
    }
  }, [user, fetchMyVehicles])

  return {
    vehicles,
    isLoading,
    error,
    refetch: fetchMyVehicles,
  }
}
