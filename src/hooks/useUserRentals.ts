import { useState, useEffect, useCallback } from "react";
import { RentalService } from "@/lib/api/services/rental-service";
import { Rental, CreateReviewData } from "@/lib/types/entities/rental";
import { Review } from "@/lib/types/entities/review";

interface UseUserRentalsState {
  rentals: Rental[];
  isLoading: boolean;
  error: string | null;
  isCreatingReview: boolean;
  reviewError: string | null;
}

export const useUserRentals = () => {
  const [state, setState] = useState<UseUserRentalsState>({
    rentals: [],
    isLoading: false,
    error: null,
    isCreatingReview: false,
    reviewError: null,
  });

  const fetchRentals = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const rentals = await RentalService.getUserRentals();
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

  const createReview = useCallback(
    async (reviewData: CreateReviewData): Promise<Review | null> => {
      setState((prev) => ({
        ...prev,
        isCreatingReview: true,
        reviewError: null,
      }));
      try {
        const review = await RentalService.createReview(reviewData);
        setState((prev) => ({ ...prev, isCreatingReview: false }));
        // Recargar las rentas para actualizar el estado
        await fetchRentals();
        return review;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          reviewError:
            error instanceof Error ? error.message : "Error al crear la review",
          isCreatingReview: false,
        }));
        return null;
      }
    },
    [fetchRentals]
  );

  const checkHasReview = useCallback(
    async (rentalId: string): Promise<boolean> => {
      try {
        return await RentalService.hasReview(rentalId);
      } catch {
        return false;
      }
    },
    []
  );

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  return {
    ...state,
    refetch: fetchRentals,
    createReview,
    checkHasReview,
  };
};
