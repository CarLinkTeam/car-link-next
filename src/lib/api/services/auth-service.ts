import { apiClient } from '../base/client'
import { LoginFormData, RegisterFormData } from '@/lib/validations/auth'
import { User, AuthUser } from '@/lib/types/entities/user'

interface LoginResponse {
  user: User
  token: string
}

export interface PromoteToResponse {
  message: string
  user: AuthUser
}

export const AuthService = {
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', data)
  },

  register: async (data: Omit<RegisterFormData, 'confirmPassword'>): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/register', data)
  },

  promoteToOwner: async (userId: string): Promise<PromoteToResponse> => {
    return apiClient.post<PromoteToResponse>(`/auth/promoteToOwner/${userId}`, {})
  },

  promoteToAdmin: async (userId: string): Promise<PromoteToResponse> => {
    return apiClient.post<PromoteToResponse>(`/auth/promoteToAdmin/${userId}`, {})
  },
}

