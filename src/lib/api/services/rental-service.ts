import {
  CreateRentalData,
  Rental,
  CreateReviewData,
} from "../../types/entities/rental";
import { apiClient } from "../base/client";
import { Review } from "../../types/entities/review";

export const RentalService = {
  create: async (data: CreateRentalData): Promise<Rental> => {
    const response = await apiClient.post<Rental>("/rentals", data);
    return response;
  },

  /**
   * Obtiene las rentas del usuario autenticado
   */
  getUserRentals: async (): Promise<Rental[]> => {
    const response = await apiClient.get<Rental[]>("/rentals/user");
    return response;
  },

  /**
   * Crea una review para una renta
   */
  createReview: async (data: CreateReviewData): Promise<Review> => {
    const response = await apiClient.post<Review>("/reviews", data);
    return response;
  },

  /**
   * Verifica si una renta ya tiene review
   */
  hasReview: async (rentalId: string): Promise<boolean> => {
    try {
      const response = await apiClient.get<boolean>(
        `/rentals/${rentalId}/has-review`
      );
      console.log("Esta es la rese de la review:", response);
      return response;
    } catch {
      return false;
    }
  },
};
