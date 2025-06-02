import type { Vehicle } from "./vehicle";
import type { User } from "./user";

// Rental type definitions que coinciden con la respuesta de la API
export interface Rental {
  id: string;
  initialDate: string; // ISO string format
  finalDate: string; // ISO string format
  totalCost: string; // Decimal as string
  status: RentalStatus;
  client: User; // Usuario completo
  client_id: string;
  vehicle: Vehicle; // Vehículo completo
  vehicle_id: string;
}

export type RentalStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "PARTIAL";

// Datos para crear una renta
export type CreateRentalData = {
  vehicle_id: string;
  initialDate: string;
  finalDate: string;
  totalCost: number;
  status?: RentalStatus;
};

// Datos para actualizar una renta
export type UpdateRentalData = Partial<{
  status: RentalStatus;
  paymentStatus: PaymentStatus;
  notes: string;
  cancellationReason: string;
}>;

// Datos para crear una review
export interface CreateReviewData {
  rental_id: string;
  rating: number;
  comment?: string;
  createdAt: string;
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

export const rentalStatusLabels: Record<string, string> = {
  "PENDING": 'Pendiente',
  "APPROVED": 'Aprobada',
  "ACTIVE": 'Activa',
  "COMPLETED": 'Completada',
  "CANCELLED": 'Cancelada',
};
