import {
  useAuthStore,
  authSelectors,
  useIsAuthenticated,
  useUser,
  useUserRoles,
  useIsOwner,
  useIsAdmin,
  useAuthLoading,
  useAuthError,
  useHasHydrated,
  useUserInfo,
} from "../auth-store";
import { AuthUser, UserRole } from "@/lib/types";
import { auth } from "@/lib/api";

// Mock del módulo de API
jest.mock("@/lib/api", () => ({
  auth: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));

const mockAuthUser: AuthUser = {
  id: "1",
  email: "test@ejemplo.com",
  fullName: "Usuario Test",
  location: "Bogotá, Colombia",
  phone: "+573001234567",
  roles: ["TENANT"],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Auth Store", () => {
  beforeEach(() => {
    // Reset del store antes de cada prueba
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("Estado inicial", () => {
    it("debe tener el estado inicial correcto", () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state._hasHydrated).toBe(false);
    });
  });

  describe("Selectores", () => {
    beforeEach(() => {
      useAuthStore.setState({
        user: mockAuthUser,
        token: "test-token",
        isAuthenticated: true,
        isLoading: false,
        error: null,
        _hasHydrated: true,
      });
    });

    it("debe seleccionar isAuthenticated correctamente", () => {
      const state = useAuthStore.getState();
      expect(authSelectors.isAuthenticated(state)).toBe(true);
    });

    it("debe seleccionar user correctamente", () => {
      const state = useAuthStore.getState();
      expect(authSelectors.user(state)).toEqual(mockAuthUser);
    });

    it("debe seleccionar userRoles correctamente", () => {
      const state = useAuthStore.getState();
      expect(authSelectors.userRoles(state)).toEqual(["TENANT"]);
    });

    it("debe verificar hasRole correctamente", () => {
      const state = useAuthStore.getState();
      expect(authSelectors.hasRole("TENANT" as UserRole)(state)).toBe(true);
      expect(authSelectors.hasRole("ADMIN" as UserRole)(state)).toBe(false);
    });

    it("debe verificar isOwner correctamente", () => {
      const state = useAuthStore.getState();
      expect(authSelectors.isOwner(state)).toBe(false);

      // Probar con usuario OWNER
      useAuthStore.setState({
        user: { ...mockAuthUser, roles: ["OWNER"] },
      });
      const newState = useAuthStore.getState();
      expect(authSelectors.isOwner(newState)).toBe(true);
    });

    it("debe verificar isAdmin correctamente", () => {
      const state = useAuthStore.getState();
      expect(authSelectors.isAdmin(state)).toBe(false);

      // Probar con usuario ADMIN
      useAuthStore.setState({
        user: { ...mockAuthUser, roles: ["ADMIN"] },
      });
      const newState = useAuthStore.getState();
      expect(authSelectors.isAdmin(newState)).toBe(true);
    });

    it("debe seleccionar userInfo correctamente", () => {
      const state = useAuthStore.getState();
      const userInfo = authSelectors.userInfo(state);

      expect(userInfo).toEqual({
        id: mockAuthUser.id,
        fullName: mockAuthUser.fullName,
        email: mockAuthUser.email,
        roles: mockAuthUser.roles,
      });
    });

    it("debe retornar null para userInfo cuando no hay usuario", () => {
      useAuthStore.setState({ user: null });
      const state = useAuthStore.getState();
      expect(authSelectors.userInfo(state)).toBeNull();
    });

    it("debe manejar roles vacíos correctamente", () => {
      useAuthStore.setState({
        user: { ...mockAuthUser, roles: [] },
      });
      const state = useAuthStore.getState();

      expect(authSelectors.userRoles(state)).toEqual([]);
      expect(authSelectors.isOwner(state)).toBe(false);
      expect(authSelectors.isAdmin(state)).toBe(false);
      expect(authSelectors.hasRole("TENANT" as UserRole)(state)).toBe(false);
    });
  });

  describe("Acciones", () => {
    describe("updateUser", () => {
      it("debe actualizar los datos del usuario", () => {
        // Establecer usuario inicial
        useAuthStore.setState({
          user: mockAuthUser,
          isAuthenticated: true,
        });

        const updatedData: Partial<AuthUser> = { fullName: "Nuevo Nombre" };
        useAuthStore.getState().updateUser(updatedData);

        const state = useAuthStore.getState();
        expect(state.user?.fullName).toBe("Nuevo Nombre");
        expect(state.user?.email).toBe(mockAuthUser.email); // No debe cambiar otros campos
      });

      it("no debe hacer nada si no hay usuario", () => {
        const updatedData: Partial<AuthUser> = { fullName: "Nuevo Nombre" };
        useAuthStore.getState().updateUser(updatedData);

        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
      });
    });

    describe("clearError", () => {
      it("debe limpiar el error", () => {
        useAuthStore.setState({ error: "Error de prueba" });

        useAuthStore.getState().clearError();

        const state = useAuthStore.getState();
        expect(state.error).toBeNull();
      });
    });

    describe("setLoading", () => {
      it("debe establecer el estado de loading", () => {
        useAuthStore.getState().setLoading(true);

        let state = useAuthStore.getState();
        expect(state.isLoading).toBe(true);

        useAuthStore.getState().setLoading(false);

        state = useAuthStore.getState();
        expect(state.isLoading).toBe(false);
      });
    });

    describe("setHasHydrated", () => {
      it("debe establecer el estado de hidratación", () => {
        useAuthStore.getState().setHasHydrated(true);

        const state = useAuthStore.getState();
        expect(state._hasHydrated).toBe(true);
      });
    });

    describe("logout", () => {
      beforeEach(() => {
        // Mock window y localStorage
        Object.defineProperty(window, "localStorage", {
          value: {
            removeItem: jest.fn(),
          },
          writable: true,
        });
      });

      it("debe limpiar todo el estado de autenticación", () => {
        // Establecer estado autenticado
        useAuthStore.setState({
          user: mockAuthUser,
          token: "test-token",
          isAuthenticated: true,
          isLoading: false,
          error: "algún error",
        });

        useAuthStore.getState().logout();

        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });

      it("debe limpiar localStorage de otros stores cuando está en el navegador", () => {
        const mockRemoveItem = jest.fn();
        Object.defineProperty(window, "localStorage", {
          value: {
            removeItem: mockRemoveItem,
          },
          writable: true,
        });

        useAuthStore.getState().logout();

        expect(mockRemoveItem).toHaveBeenCalledWith("user-rentals-store");
        expect(mockRemoveItem).toHaveBeenCalledWith("vehicle-details-store");
      });
    });

    describe("login", () => {
      it("debe manejar login exitoso", async () => {
        const mockLoginData = {
          email: "test@test.com",
          password: "password123",
        };
        const mockResponse = { user: mockAuthUser, token: "test-token" };

        (auth.login as jest.Mock).mockResolvedValue(mockResponse);

        await useAuthStore.getState().login(mockLoginData);

        const state = useAuthStore.getState();
        expect(state.user).toEqual(mockAuthUser);
        expect(state.token).toBe("test-token");
        expect(state.isAuthenticated).toBe(true);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });

      it("debe manejar error en login", async () => {
        const mockLoginData = { email: "test@test.com", password: "wrong" };
        const mockError = new Error("Credenciales inválidas");

        (auth.login as jest.Mock).mockRejectedValue(mockError);

        await expect(
          useAuthStore.getState().login(mockLoginData)
        ).rejects.toThrow("Credenciales inválidas");

        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe("Credenciales inválidas");
      });

      it("debe manejar error desconocido en login", async () => {
        const mockLoginData = { email: "test@test.com", password: "wrong" };

        (auth.login as jest.Mock).mockRejectedValue("Error extraño");

        await expect(
          useAuthStore.getState().login(mockLoginData)
        ).rejects.toThrow();

        const state = useAuthStore.getState();
        expect(state.error).toBe("Error desconocido");
      });

      it("debe establecer loading durante el proceso de login", async () => {
        const mockLoginData = {
          email: "test@test.com",
          password: "password123",
        };

        // Mock para que el login tarde en resolverse
        (auth.login as jest.Mock).mockImplementation(
          () =>
            new Promise((resolve) =>
              setTimeout(
                () => resolve({ user: mockAuthUser, token: "test-token" }),
                100
              )
            )
        );

        const loginPromise = useAuthStore.getState().login(mockLoginData);

        // Verificar que loading está en true inmediatamente
        let state = useAuthStore.getState();
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();

        await loginPromise;

        // Verificar que loading vuelve a false
        state = useAuthStore.getState();
        expect(state.isLoading).toBe(false);
      });
    });

    describe("register", () => {
      it("debe manejar registro exitoso", async () => {
        const mockRegisterData = {
          email: "test@test.com",
          password: "password123",
          fullName: "Test User",
          phone: "+573001234567",
          location: "Bogotá, Colombia",
        };
        const mockResponse = { user: mockAuthUser, token: "test-token" };

        (auth.register as jest.Mock).mockResolvedValue(mockResponse);

        await useAuthStore.getState().register(mockRegisterData);

        const state = useAuthStore.getState();
        expect(state.user).toEqual(mockAuthUser);
        expect(state.token).toBe("test-token");
        expect(state.isAuthenticated).toBe(true);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });

      it("debe manejar error en registro", async () => {
        const mockRegisterData = {
          email: "test@test.com",
          password: "password123",
          fullName: "Test User",
          phone: "+573001234567",
          location: "Bogotá, Colombia",
        };
        const mockError = new Error("Email ya existe");

        (auth.register as jest.Mock).mockRejectedValue(mockError);

        await expect(
          useAuthStore.getState().register(mockRegisterData)
        ).rejects.toThrow("Email ya existe");

        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe("Email ya existe");
      });

      it("debe manejar error desconocido en registro", async () => {
        const mockRegisterData = {
          email: "test@test.com",
          password: "password123",
          fullName: "Test User",
          phone: "+573001234567",
          location: "Bogotá, Colombia",
        };

        (auth.register as jest.Mock).mockRejectedValue("Error extraño");

        await expect(
          useAuthStore.getState().register(mockRegisterData)
        ).rejects.toThrow();

        const state = useAuthStore.getState();
        expect(state.error).toBe("Error desconocido");
      });

      it("debe establecer loading durante el proceso de registro", async () => {
        const mockRegisterData = {
          email: "test@test.com",
          password: "password123",
          fullName: "Test User",
          phone: "+573001234567",
          location: "Bogotá, Colombia",
        };

        // Mock para que el registro tarde en resolverse
        (auth.register as jest.Mock).mockImplementation(
          () =>
            new Promise((resolve) =>
              setTimeout(
                () => resolve({ user: mockAuthUser, token: "test-token" }),
                100
              )
            )
        );

        const registerPromise = useAuthStore
          .getState()
          .register(mockRegisterData);

        // Verificar que loading está en true inmediatamente
        let state = useAuthStore.getState();
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();

        await registerPromise;

        // Verificar que loading vuelve a false
        state = useAuthStore.getState();
        expect(state.isLoading).toBe(false);
      });
    });
  });

  describe("Selectores con estado nulo", () => {
    beforeEach(() => {
      useAuthStore.setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        _hasHydrated: false,
      });
    });

    it("debe manejar userRoles cuando user es null", () => {
      const state = useAuthStore.getState();
      expect(authSelectors.userRoles(state)).toEqual([]);
    });

    it("debe manejar hasRole cuando user es null", () => {
      const state = useAuthStore.getState();
      expect(authSelectors.hasRole("TENANT" as UserRole)(state)).toBe(false);
    });

    it("debe manejar isOwner cuando user es null", () => {
      const state = useAuthStore.getState();
      expect(authSelectors.isOwner(state)).toBe(false);
    });

    it("debe manejar isAdmin cuando user es null", () => {
      const state = useAuthStore.getState();
      expect(authSelectors.isAdmin(state)).toBe(false);
    });
  });

  describe("Hooks personalizados", () => {
    it("debe exportar todos los hooks personalizados", () => {
      expect(typeof useIsAuthenticated).toBe("function");
      expect(typeof useUser).toBe("function");
      expect(typeof useUserRoles).toBe("function");
      expect(typeof useIsOwner).toBe("function");
      expect(typeof useIsAdmin).toBe("function");
      expect(typeof useAuthLoading).toBe("function");
      expect(typeof useAuthError).toBe("function");
      expect(typeof useHasHydrated).toBe("function");
      expect(typeof useUserInfo).toBe("function");
    });
  });
});
