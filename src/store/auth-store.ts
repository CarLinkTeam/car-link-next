import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { LoginFormData, RegisterFormData } from '@/lib/validations/auth'
import { User } from '@/lib/types'
import { auth } from '@/lib/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (data: LoginFormData) => Promise<void>
  register: (data: Omit<RegisterFormData, 'confirmPassword'>) => Promise<void>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Maneja el proceso de login
       */
      login: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const { user, token } = await auth.login(data)
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Error desconocido'
          set({
            error: message,
            isLoading: false,
            isAuthenticated: false,
          })
          throw error
        }
      },

      /**
       * Maneja el proceso de registro
       */
      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const { user, token } = await auth.register(data)
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Error desconocido'
          set({
            error: message,
            isLoading: false,
            isAuthenticated: false,
          })
          throw error
        }
      },

      /**
       * Cierra la sesión del usuario
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      /**
       * Limpia los errores del store
       */
      clearError: () => {
        set({ error: null })
      },

      /**
       * Establece el estado de loading
       */
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
)
