import type { Vehicle } from './vehicle'
import type { User } from './user'

// Rental type definitions
export interface Rental {
  id: string
  vehicleId: string
  vehicle?: Vehicle
  renterId: string
  renter?: User
  startDate: Date
  endDate: Date
  status: RentalStatus
  totalPrice: number
  paymentStatus: PaymentStatus
  createdAt: Date
  updatedAt?: Date
  notes?: string
  cancellationReason?: string
}

export type RentalStatus = 'PENDING' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'PARTIAL'

// Datos para crear una renta
export type CreateRentalData = Pick<Rental, 'vehicleId' | 'startDate' | 'endDate' | 'notes'>

// Datos para actualizar una renta
export type UpdateRentalData = Partial<Pick<Rental, 'status' | 'paymentStatus' | 'notes' | 'cancellationReason'>>

// Renta con información completa del vehículo y usuario
export interface RentalWithDetails extends Rental {
  vehicle: Vehicle
  renter: User
}

// Filtros para búsqueda de rentas
export interface RentalFilters {
  status?: RentalStatus
  paymentStatus?: PaymentStatus
  startDate?: Date
  endDate?: Date
  vehicleId?: string
  renterId?: string
}

// Estadísticas de rentas
export interface RentalStats {
  totalRentals: number
  activeRentals: number
  completedRentals: number
  cancelledRentals: number
  totalRevenue: number
  averageRentalDuration: number
}
