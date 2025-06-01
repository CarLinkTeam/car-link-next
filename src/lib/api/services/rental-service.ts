import { CreateRentalData, Rental } from "../../types/entities/rental";
import { apiClient } from "../base/client";

export const RentalService = {
  create: async (data: CreateRentalData): Promise<Rental> => {
    const response = await apiClient.post<Rental>("/rentals", data);
    return response;
  },
};
