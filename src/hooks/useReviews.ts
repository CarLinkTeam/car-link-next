import { useState, useEffect } from "react";
import { ReviewService } from "@/lib/api/services/review-service";
import { Review } from "@/lib/types/entities/review";

interface UseReviewsState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

interface UseReviewsParams {
  vehicleId: string;
  autoFetch?: boolean;
}

export function useReviews({ vehicleId, autoFetch = true }: UseReviewsParams) {
  const [state, setState] = useState<UseReviewsState>({
    reviews: [],
    isLoading: false,
    error: null,
  });

  const fetchReviews = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const reviewsList = await ReviewService.getByVehicleId(vehicleId);
      setState({
        reviews: reviewsList,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al cargar reviews";
      setState({
        reviews: [],
        isLoading: false,
        error: errorMessage,
      });
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchReviews();
    }
  }, [autoFetch, vehicleId]);

  return {
    ...state,
    fetchReviews,
  };
}
