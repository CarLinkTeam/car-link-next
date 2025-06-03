import { apiClient } from '../base/client'
import { AuthUser, User } from '@/lib/types/entities/user'

export interface UpdateUserDto {
  fullName?: string
  phone?: string
  location?: string
  password?: string
}

export const UserService = {

  /**
   * Obtiene todos los usuarios
   */

  async getAll(): Promise<User[]> {
    return await apiClient.get<User[]>("/users");
  },

  /**
   * Obtiene los datos completos de un usuario por ID
   */
  getById: async (id: string): Promise<AuthUser> => {
    return apiClient.get<AuthUser>(`/users/${id}`)
  },

  /**
   * Actualiza los datos del usuario
   */
  update: async (id: string, data: UpdateUserDto): Promise<AuthUser> => {
    return apiClient.patch<AuthUser>(`/users/${id}`, data)
  },

  /**
   * Elimina un usuario por ID
   */
  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/users/${id}`)
  },

  updatePartial: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response;
  },

  getByIdUser: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response;
  }
}
