import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter, usePathname } from "next/navigation";
import { AuthGuard } from "../AuthGuard";

// Mock del router de Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock del store de autenticación
jest.mock("@/store/auth-store", () => ({
  useAuthStore: jest.fn(),
}));

// Import del mock después de la declaración
import { useAuthStore } from "@/store/auth-store";

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

describe("AuthGuard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
    (usePathname as jest.Mock).mockReturnValue("/");
  });

  const TestComponent = () => <div>Protected Content</div>;

  describe("Estado de carga", () => {
    it("debe mostrar loading cuando no ha hidratado", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        _hasHydrated: false,
        token: null,
        user: null,
      });
      (usePathname as jest.Mock).mockReturnValue("/dashboard");

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      expect(screen.getByText("CarLink")).toBeInTheDocument();
      expect(
        screen.getByText("Preparando tu experiencia de renta...")
      ).toBeInTheDocument();
      expect(screen.getByText("Restaurando sesión...")).toBeInTheDocument();
    });

    it("debe permitir acceso cuando ha hidratado y está en ruta protegida", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        _hasHydrated: true,
        token: "test-token",
        user: { id: "1" },
      });
      (usePathname as jest.Mock).mockReturnValue("/dashboard");

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });
  });

  describe("Rutas protegidas", () => {
    it("debe permitir acceso cuando el usuario está autenticado", async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        _hasHydrated: true,
        token: "test-token",
        user: { id: "1" },
      });
      (usePathname as jest.Mock).mockReturnValue("/dashboard");

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      await waitFor(() => {
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
      });
    });

    it("debe redirigir a login cuando no hay token", async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        _hasHydrated: true,
        token: null,
        user: null,
      });
      (usePathname as jest.Mock).mockReturnValue("/dashboard");

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(
          "/auth/login?reason=no-token&callbackUrl=%2Fdashboard"
        );
      });
    });

    it("debe redirigir a access-denied cuando hay token pero no user", async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        _hasHydrated: true,
        token: "invalid-token",
        user: null,
      });
      (usePathname as jest.Mock).mockReturnValue("/dashboard");

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(
          "/access-denied?reason=invalid-token"
        );
      });
    });

    it("debe redirigir a access-denied cuando user no está autenticado", async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        _hasHydrated: true,
        token: "test-token",
        user: { id: "1" },
      });
      (usePathname as jest.Mock).mockReturnValue("/dashboard");

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(
          "/access-denied?reason=unauthorized"
        );
      });
    });
  });

  describe("Rutas de autenticación", () => {
    it("debe permitir acceso cuando el usuario no está autenticado", async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        _hasHydrated: true,
        token: null,
        user: null,
      });
      (usePathname as jest.Mock).mockReturnValue("/auth/login");

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      await waitFor(() => {
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
      });
    });

    it("debe redirigir a dashboard cuando el usuario ya está autenticado", async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        _hasHydrated: true,
        token: "test-token",
        user: { id: "1" },
      });
      (usePathname as jest.Mock).mockReturnValue("/auth/login");

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/dashboard/vehicles");
      });
    });
  });

  describe("Rutas públicas", () => {
    it("debe permitir acceso libre a rutas públicas", async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        _hasHydrated: true,
        token: null,
        user: null,
      });
      (usePathname as jest.Mock).mockReturnValue("/");

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      await waitFor(() => {
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
      });
    });

    it("debe permitir acceso a usuarios autenticados en rutas públicas", async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        _hasHydrated: true,
        token: "test-token",
        user: { id: "1" },
      });
      (usePathname as jest.Mock).mockReturnValue("/");

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      await waitFor(() => {
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
      });
    });
  });

  describe("Rutas del sistema", () => {
    it("debe permitir acceso libre a rutas del sistema", async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        _hasHydrated: true,
        token: null,
        user: null,
      });
      (usePathname as jest.Mock).mockReturnValue("/api/auth");

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      await waitFor(() => {
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
      });
    });
  });

  describe("Rutas desconocidas", () => {
    it("debe permitir acceso a rutas no configuradas", async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        _hasHydrated: true,
        token: null,
        user: null,
      });
      (usePathname as jest.Mock).mockReturnValue("/unknown-route");

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      await waitFor(() => {
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
      });
    });
  });

  describe("Estados edge", () => {
    it("debe manejar cambios de ruta mientras está verificando", async () => {
      const { rerender } = render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      // Inicialmente no hidratado
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        _hasHydrated: false,
        token: null,
        user: null,
      });

      // Cambiar a hidratado y autenticado
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        _hasHydrated: true,
        token: "test-token",
        user: { id: "1" },
      });
      (usePathname as jest.Mock).mockReturnValue("/dashboard");

      rerender(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      await waitFor(() => {
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
      });
    });

    it("debe manejar logout durante navegación", async () => {
      // Inicialmente autenticado
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        _hasHydrated: true,
        token: "test-token",
        user: { id: "1" },
      });
      (usePathname as jest.Mock).mockReturnValue("/dashboard");

      const { rerender } = render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      // Simular logout
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        _hasHydrated: true,
        token: null,
        user: null,
      });

      rerender(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      );

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith(
          "/auth/login?reason=no-token&callbackUrl=%2Fdashboard"
        );
      });
    });
  });
});
