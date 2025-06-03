import { useState, useEffect, useCallback } from "react";
import { RentalService } from "@/lib/api/services/rental-service";
import { Rental } from "@/lib/types/entities/rental";

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
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Error al cargar las rentas",
        isLoading: false,
      }));
    }
  }, []);

  const updateRentalStatus = async (rentalId: string, status: Rental['status']) => {
    try {
      let updatedRental: Rental;

      if (status === 'confirmed') {
        updatedRental = await RentalService.confirmRental(rentalId);
      } else if (status === 'cancelled') {
        updatedRental = await RentalService.rejectRental(rentalId);
      } else {
        throw new Error(`Unsupported status: ${status}`);
      }

      setState((s) => ({
        ...s,
        rentals: s.rentals.map((r) =>
          r.id === rentalId ? { ...r, status: updatedRental.status } : r
        ),
      }));
    } catch (error: any) {
      setState((s) => ({ ...s, error: error.message }));
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
