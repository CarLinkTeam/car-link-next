// Vehicle type definitions to match API response
export interface Vehicle {
  id: string;
  vehicleModel: string;
  make: string;
  color: string;
  year: number;
  license_plate: string;
  url_photos: string[];
  daily_price: string;
  rental_conditions: string;
  class: string;
  drive: string;
  fuel_type: string;
  transmission: string;
  createdAt: string;
  updatedAt: string;
  owner: Owner;
  ownerId: string;
}

export interface Owner {
  id: string;
  email: string;
  password: string;
  fullName: string;
  location: string;
  phone: string;
  isActive: boolean;
  roles: string[];
}

// Datos para crear un vehículo
export type CreateVehicleData = Omit<
  Vehicle,
  "id" | "createdAt" | "updatedAt" | "owner"
>;

// Datos para actualizar un vehículo
export type UpdateVehicleData = Partial<
  Omit<Vehicle, "id" | "ownerId" | "createdAt" | "updatedAt" | "owner">
>;

// Filtros para búsqueda de vehículos
export interface VehicleFilters {
  make?: string;
  vehicleModel?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  class?: string;
  fuel_type?: string;
}
