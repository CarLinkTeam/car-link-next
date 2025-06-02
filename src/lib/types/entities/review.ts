// Review type definitions to match API response
import { Rental } from "./rental";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  rental_id: string;
  rental: Rental;
}
