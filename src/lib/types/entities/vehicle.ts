import { User } from './user'

// Vehicle type definitions to match API response
export interface Vehicle {
  id: string
  vehicleModel: string
  make: string
  color: string
  year: number
  license_plate: string
  url_photos: string[]
  daily_price: number
  rental_conditions: string
  class?: string
  drive?: string
  fuel_type?: string
  transmission?: string
  userId: string
  created_at: string
  updated_at: string
  owner: User
  ownerId: string
}

// DTOs para operaciones CRUD
export interface CreateVehicleDto {
  vehicleModel: string
  make: string
  color: string
  year: number
  license_plate: string
  url_photos: string[]
  daily_price: number
  rental_conditions: string
  class?: string
  drive?: string
  fuel_type?: string
  transmission?: string
}

export type UpdateVehicleDto = Partial<CreateVehicleDto>

// Filtros para búsqueda de vehículos
export interface VehicleFilters {
  make?: string
  vehicleModel?: string
  minYear?: number
  maxYear?: number
  minPrice?: number
  maxPrice?: number
  location?: string
  class?: string
  fuel_type?: string
}
