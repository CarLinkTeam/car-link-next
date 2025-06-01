import type { Vehicle } from "./vehicle";
import type { User } from "./user";

// Rental type definitions
export interface Rental {
  id: string;
  vehicle_id: string;
  renterId: string;
  initialDate: Date;
  finalDate: Date;
  status: RentalStatus;
  totalCost: number;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt?: Date;
  notes?: string;
  cancellationReason?: string;
}

export type RentalStatus =
  | "pending"
  | "approved"
  | "active"
  | "completed"
  | "cancelled";

export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "PARTIAL";

// Datos para crear una renta
export type CreateRentalData = Pick<
  Rental,
  "vehicle_id" | "initialDate" | "finalDate" | "totalCost" | "status"
>;

// Datos para actualizar una renta
export type UpdateRentalData = Partial<
  Pick<Rental, "status" | "paymentStatus" | "notes" | "cancellationReason">
>;

// Renta con información completa del vehículo y usuario
export interface RentalWithDetails extends Rental {
  vehicle: Vehicle;
  renter: User;
}

// Filtros para búsqueda de rentas
export interface RentalFilters {
  status?: RentalStatus;
  paymentStatus?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
  vehicleId?: string;
  renterId?: string;
}

// Estadísticas de rentas
export interface RentalStats {
  totalRentals: number;
  activeRentals: number;
  completedRentals: number;
  cancelledRentals: number;
  totalRevenue: number;
  averageRentalDuration: number;
}
