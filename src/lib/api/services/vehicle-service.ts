import { apiClient } from '../base/client'
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '@/lib/types/entities/vehicle'

export interface VehicleListResponse {
  data: Vehicle[]
  total: number
  page: number
  limit: number
}

export const VehicleService = {
  /**
   * Obtiene todos los vehículos disponibles
   */
  getAll: async (): Promise<Vehicle[]> => {
    const response = await apiClient.get<Vehicle[]>('/vehicles')
    return response
  },

  /**
   * Obtiene un vehículo por ID
   */
  getById: async (id: string): Promise<Vehicle> => {
    return apiClient.get<Vehicle>(`/vehicles/${id}`)
  },

  /**
   * Crea un nuevo vehículo
   */
  create: async (data: CreateVehicleDto): Promise<Vehicle> => {
    return apiClient.post<Vehicle>('/vehicles', data)
  },

  /**
   * Actualiza un vehículo existente
   */
  update: async (id: string, data: UpdateVehicleDto): Promise<Vehicle> => {
    return apiClient.patch<Vehicle>(`/vehicles/${id}`, data)
  },

  /**
   * Elimina un vehículo
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/vehicles/${id}`)
  },

  /**
   * Obtiene los vehículos del usuario actual
   */
  getMyVehicles: async (): Promise<Vehicle[]> => {
    return apiClient.get<Vehicle[]>('/vehicles/myVehicles')
  },

  /**
   * Obtiene vehículos con paginación y filtros
   */
  getWithFilters: async (params?: {
    page?: number
    limit?: number
    make?: string
    class?: string
    minPrice?: number
    maxPrice?: number
  }): Promise<VehicleListResponse> => {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.make) queryParams.append('make', params.make)
    if (params?.class) queryParams.append('class', params.class)
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString())
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString())

    const url = `/vehicles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiClient.get<VehicleListResponse>(url)
  },
}
