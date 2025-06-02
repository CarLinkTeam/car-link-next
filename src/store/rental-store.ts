import { create } from "zustand";
import { RentalService } from "@/lib/api/services/rental-service";
import { CreateRentalData } from "@/lib/types/entities/rental";
import { useVehicleDetailsStore } from "./vehicle-details-store";

interface RentalState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  createRental: (data: CreateRentalData) => Promise<void>;
  clearStatus: () => void;
}

export const useRentalStore = create<RentalState>((set) => ({
  isLoading: false,
  error: null,
  success: false,

  createRental: async (data) => {
    set({ isLoading: true, error: null, success: false });
    try {
      await RentalService.create(data);
      set({ isLoading: false, success: true });

      // Invalidar el vehículo para forzar la actualización de disponibilidad
      useVehicleDetailsStore.getState().invalidateVehicle(data.vehicle_id);

      // Re-fetch la disponibilidad inmediatamente
      await useVehicleDetailsStore
        .getState()
        .fetchVehicleUnavailability(data.vehicle_id, true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      set({ isLoading: false, error: message });
    }
  },

  clearStatus: () => {
    set({ error: null, success: false });
  },
}));
