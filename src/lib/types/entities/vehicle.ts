// Vehicle type definitions
export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  licensePlate?: string
  color?: string
  price?: number
  ownerId: string
  images?: string[]
  description?: string
  features?: string[]
  availability?: VehicleAvailability[]
  status?: VehicleStatus
  createdAt?: Date
  updatedAt?: Date
}

export interface VehicleAvailability {
  startDate: Date
  endDate: Date
}

export type VehicleStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'INACTIVE'

// Datos para crear un vehículo
export type CreateVehicleData = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>

// Datos para actualizar un vehículo
export type UpdateVehicleData = Partial<Omit<Vehicle, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>>

// Vehículo con información del propietario
export interface VehicleWithOwner extends Vehicle {
  owner?: {
    id: string
    fullName: string
    phone: string
    email: string
  }
}

// Filtros para búsqueda de vehículos
export interface VehicleFilters {
  make?: string
  model?: string
  minYear?: number
  maxYear?: number
  minPrice?: number
  maxPrice?: number
  location?: string
  features?: string[]
  status?: VehicleStatus
}
