import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LoginFormData, RegisterFormData } from "@/lib/validations/auth";
import { AuthUser, UserRole } from "@/lib/types";
import { auth, users } from "@/lib/api";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;

  // Actions
  login: (data: LoginFormData) => Promise<void>;
  register: (data: Omit<RegisterFormData, "confirmPassword">) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  ensureUserFullName: () => Promise<void>;
}

// Selectores optimizados
export const authSelectors = {
  // Selecciona solo si el usuario está autenticado
  isAuthenticated: (state: AuthState) => state.isAuthenticated,

  // Selecciona solo el usuario
  user: (state: AuthState) => state.user,

  // Selecciona solo los roles del usuario
  userRoles: (state: AuthState) => state.user?.roles || [],

  // Selecciona si el usuario tiene un rol específico
  hasRole: (role: UserRole) => (state: AuthState) =>
    state.user?.roles?.includes(role) || false,

  // Selecciona si el usuario es owner
  isOwner: (state: AuthState) => state.user?.roles?.includes("OWNER") || false,

  // Selecciona si el usuario es admin
  isAdmin: (state: AuthState) => state.user?.roles?.includes("ADMIN") || false,

  // Selecciona el estado de loading
  isLoading: (state: AuthState) => state.isLoading,

  // Selecciona el error
  error: (state: AuthState) => state.error,

  // Selecciona si la app ha hidratado
  hasHydrated: (state: AuthState) => state._hasHydrated,

  // Selecciona información básica del usuario
  userInfo: (state: AuthState) =>
    state.user
      ? {
        id: state.user.id,
        fullName: state.user.fullName,
        email: state.user.email,
        roles: state.user.roles,
      }
      : null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      /**
       * Maneja el proceso de login
       */
      login: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await auth.login(data);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          if (!user.fullName) {
            await get().ensureUserFullName();
          }

        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Error desconocido";
          set({
            error: message,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          // Siempre lanzar una instancia de Error
          throw error instanceof Error ? error : new Error(message);
        }
      },

      /**
       * Maneja el proceso de registro
       */
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await auth.register(data);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Error desconocido";
          set({
            error: message,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          // Siempre lanzar una instancia de Error
          throw error instanceof Error ? error : new Error(message);
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
        });

        // Limpiar otros stores relacionados
        if (typeof window !== "undefined") {
          // Limpiar localStorage de otros stores
          localStorage.removeItem("user-rentals-store");
          localStorage.removeItem("vehicle-details-store");
        }
      },

      /**
       * Actualiza los datos del usuario (para promociones de rol, etc.)
       */
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      /**
       * Limpia los errores del store
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Establece el estado de loading
       */
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      /**
       * Establece el estado de hidratación
       */
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      ensureUserFullName: async () => {
        const currentUser = get().user;
        if (!currentUser || currentUser.fullName) return;

        set({ isLoading: true });
        try {
          const fetchedUser = await users.getById(currentUser.id);
          set((state) => ({
            user: { ...state.user, ...fetchedUser },
            isLoading: false,
          }));
        } catch (error) {
          console.error("Error fetching full user info:", error);
          set({ isLoading: false });
        }
      },


    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      // Incluir isAuthenticated en la persistencia y agregar hidratación
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Hidratación automática
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Si hay token y user, el usuario está autenticado
          const isAuth = !!(state.token && state.user);
          state.isAuthenticated = isAuth;
          state._hasHydrated = true;
        }
      },
    }
  )
);

// Hooks personalizados para selectores comunes
export const useIsAuthenticated = () =>
  useAuthStore(authSelectors.isAuthenticated);
export const useUser = () => useAuthStore(authSelectors.user);
export const useUserRoles = () => useAuthStore(authSelectors.userRoles);
export const useIsOwner = () => useAuthStore(authSelectors.isOwner);
export const useIsAdmin = () => useAuthStore(authSelectors.isAdmin);
export const useAuthLoading = () => useAuthStore(authSelectors.isLoading);
export const useAuthError = () => useAuthStore(authSelectors.error);
export const useHasHydrated = () => useAuthStore(authSelectors.hasHydrated);
export const useUserInfo = () => useAuthStore(authSelectors.userInfo);
