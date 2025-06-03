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
   * Obtiene las rentas de un owner autenticado
   */
  getOwnerRentals: async (): Promise<Rental[]> => {
    const response = await apiClient.get<Rental[]>("/rentals/owner");
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
      return response;
    } catch {
      return false;
    }
  },

  updateById: async (id: string, data: Partial<Rental>): Promise<Rental> => {
    const response = await apiClient.patch<Rental>(`/rentals/${id}`, data);
    return response;
  },

  /**
   * Confirma una renta pendiente
   */
  confirmRental: async (id: string): Promise<Rental> => {
    const response = await apiClient.patch<Rental>(`/rentals/${id}/confirm`);
    return response;
  },

  /**
   * Rechaza una renta pendiente
   */
  rejectRental: async (id: string): Promise<Rental> => {
    const response = await apiClient.patch<Rental>(`/rentals/${id}/reject`);
    return response;
  },
};
