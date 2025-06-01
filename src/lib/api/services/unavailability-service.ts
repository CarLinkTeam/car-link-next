import { apiClient } from "../base/client";

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
  ownerId: string;
}

export interface UnavailabilityPeriod {
  id: string;
  vehicle_id: string;
  unavailable_from: string;
  unavailable_to: string;
  vehicle: Vehicle;
}

export const UnavailabilityService = {
  /**
   * Obtiene todos los períodos de no disponibilidad para un vehículo específico
   */
  getByVehicleId: async (vehicleId: string): Promise<UnavailabilityPeriod[]> => {
    return apiClient.get<UnavailabilityPeriod[]>(`/vehicles/${vehicleId}/unavailability`);
  },

  /**
   * Crea un nuevo período de no disponibilidad
   */
  create: async (data: {
    vehicle_id: string;
    unavailable_from: string;
    unavailable_to: string;
  }): Promise<UnavailabilityPeriod> => {
    return apiClient.post<UnavailabilityPeriod>('/unavailability', data);
  },

  /**
   * Actualiza un período de no disponibilidad existente
   */
  update: async (
    id: string,
    data: {
      unavailable_from?: string;
      unavailable_to?: string;
    }
  ): Promise<UnavailabilityPeriod> => {
    return apiClient.put<UnavailabilityPeriod>(`/unavailability/${id}`, data);
  },

  /**
   * Elimina un período de no disponibilidad
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/unavailability/${id}`);
  },

  /**
   * Verifica si una fecha específica está disponible para un vehículo
   */
  checkAvailability: async (vehicleId: string, date: string): Promise<{
    available: boolean;
    conflictingPeriods?: UnavailabilityPeriod[];
  }> => {
    return apiClient.get(`/vehicles/${vehicleId}/availability?date=${date}`);
  },
};
