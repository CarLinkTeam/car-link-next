import { useState, useEffect, useCallback } from "react";
import { RentalService } from "@/lib/api/services/rental-service";
import { Rental } from "@/lib/types/entities/rental";
import { useVehicleDetailsStore } from "@/store/vehicle-details-store";

interface UseOwnerRentalsState {
  rentals: Rental[];
  isLoading: boolean;
  error: string | null;
}

export const useOwnerRentals = () => {
  const [state, setState] = useState<UseOwnerRentalsState>({
    rentals: [],
    isLoading: false,
    error: null,
  });

  const fetchRentals = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const rentals = await RentalService.getOwnerRentals();
      console.log("Rentas obtenidas:", rentals);
      setState((prev) => ({ ...prev, rentals, isLoading: false }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setState((s) => ({ ...s, error: errorMessage }));
    }
  }, []);

  const updateRentalStatus = async (
    rentalId: string,
    status: Rental["status"]
  ) => {
    try {
      let updatedRental: Rental;

      if (status === "confirmed") {
        updatedRental = await RentalService.confirmRental(rentalId);
      } else if (status === "cancelled") {
        updatedRental = await RentalService.rejectRental(rentalId);

        // Encontrar la renta para obtener el vehicle_id
        const rental = state.rentals.find((r) => r.id === rentalId);
        if (rental) {
          // Invalidar el cache del vehículo para forzar actualización
          useVehicleDetailsStore
            .getState()
            .invalidateVehicle(rental.vehicle.id);

          // Re-fetch la disponibilidad inmediatamente
          await useVehicleDetailsStore
            .getState()
            .fetchVehicleUnavailability(rental.vehicle.id, true);
        }
      } else {
        throw new Error(`Unsupported status: ${status}`);
      }

      setState((s) => ({
        ...s,
        rentals: s.rentals.map((r) =>
          r.id === rentalId ? { ...r, status: updatedRental.status } : r
        ),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setState((s) => ({ ...s, error: errorMessage }));
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  return {
    ...state,
    refetch: fetchRentals,
    updateRentalStatus,
  };
};
