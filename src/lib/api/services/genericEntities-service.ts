import { apiClient } from "../base/client";
import { User, Rental, Vehicle } from "@/lib/types";

export abstract class EntityService<T> {
  abstract getAll(): Promise<T[]>;
  abstract getById(id: string): Promise<T>;
  abstract updateById(id: string, data: Partial<T>): Promise<T>;
  abstract deleteById(id: string): Promise<void>;
}

export class UserService extends EntityService<User> {
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<User[]>("/users");
    return response;
  }

  async getById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response;
  }

  async updateById(id: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response;
  }

  async deleteById(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }
}

export class VehicleService extends EntityService<Vehicle> {
  async getAll(): Promise<Vehicle[]> {
    const response = await apiClient.get<Vehicle[]>("/vehicles");
    return response;
  }

  async getById(id: string): Promise<Vehicle> {
    const response = await apiClient.get<Vehicle>(`/vehicles/${id}`);
    return response;
  }

  async updateById(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const response = await apiClient.patch<Vehicle>(`/vehicles/${id}`, data);
    return response;
  }

  async deleteById(id: string): Promise<void> {
    await apiClient.delete(`/vehicles/${id}`);
  }
}

export class RentalService extends EntityService<Rental> {
  async getAll(): Promise<Rental[]> {
    const response = await apiClient.get<Rental[]>("/rentals");
    return response;
  }

  async getById(id: string): Promise<Rental> {
    const response = await apiClient.get<Rental>(`/rentals/${id}`);
    return response;
  }

  async updateById(id: string, data: Partial<Rental>): Promise<Rental> {
    const response = await apiClient.patch<Rental>(`/rentals/${id}`, data);
    return response;
  }

  async deleteById(id: string): Promise<void> {
    await apiClient.delete(`/rentals/${id}`);
  }
}