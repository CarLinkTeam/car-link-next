import { apiClient } from "../base/client";
import { Review } from "@/lib/types/entities/review";

export const ReviewService = {
  /**
   * Obtiene todas las reviews de un vehículo por ID
   */
  getByVehicleId: async (vehicleId: string): Promise<Review[]> => {
    return apiClient.get<Review[]>(`/reviews/vehicle/${vehicleId}`);
  },
};
