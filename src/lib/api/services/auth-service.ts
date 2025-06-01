import { apiClient } from '../base/client'
import { LoginFormData, RegisterFormData } from '@/lib/validations/auth'
import { User } from '@/lib/types'

interface LoginResponse {
  user: User
  token: string
}

export const AuthService = {
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', data)
  },

  register: async (data: Omit<RegisterFormData, 'confirmPassword'>): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/register', data)
  },
}
