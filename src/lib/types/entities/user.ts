// User type definitions
export type UserRole = 'ADMIN' | 'OWNER' | 'TENANT'

export interface User {
  id: string
  email: string
  password: string
  fullName: string
  location: string
  phone: string
  roles: UserRole[]
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Auth related types - Usuario sin contraseña para el estado de autenticación
export type AuthUser = Omit<User, 'password'>
