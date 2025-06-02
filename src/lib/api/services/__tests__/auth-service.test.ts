import { AuthService } from "../auth-service";
import { apiClient } from "@/lib/api/base/client";

// Mock del cliente API
jest.mock("@/lib/api/base/client", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("debe realizar login exitosamente", async () => {
      const mockLoginData = {
        email: "test@test.com",
        password: "password123",
      };

      const mockResponse = {
        user: {
          id: "1",
          email: "test@test.com",
          fullName: "Test User",
          roles: ["TENANT"],
        },
        token: "test-token",
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.login(mockLoginData);

      expect(apiClient.post).toHaveBeenCalledWith("/auth/login", mockLoginData);
      expect(result).toEqual(mockResponse);
    });

    it("debe manejar errores de login", async () => {
      const mockLoginData = {
        email: "test@test.com",
        password: "wrongpassword",
      };

      const mockError = new Error("Credenciales inválidas");
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.login(mockLoginData)).rejects.toThrow(
        "Credenciales inválidas"
      );
    });
  });

  describe("register", () => {
    it("debe realizar registro exitosamente", async () => {
      const mockRegisterData = {
        email: "test@test.com",
        password: "password123",
        fullName: "Test User",
        phone: "+573001234567",
        location: "Bogotá, Colombia",
      };

      const mockResponse = {
        user: {
          id: "1",
          email: "test@test.com",
          fullName: "Test User",
          roles: ["TENANT"],
        },
        token: "test-token",
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.register(mockRegisterData);

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/register",
        mockRegisterData
      );
      expect(result).toEqual(mockResponse);
    });

    it("debe manejar errores de registro", async () => {
      const mockRegisterData = {
        email: "existing@test.com",
        password: "password123",
        fullName: "Test User",
        phone: "+573001234567",
        location: "Bogotá, Colombia",
      };

      const mockError = new Error("El email ya está registrado");
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.register(mockRegisterData)).rejects.toThrow(
        "El email ya está registrado"
      );
    });
  });

  describe("promoteToOwner", () => {
    it("debe promover a owner exitosamente", async () => {
      const userId = "user-123";
      const mockResponse = {
        message: "Usuario promovido a propietario exitosamente",
        user: {
          id: "1",
          email: "test@test.com",
          fullName: "Test User",
          roles: ["TENANT", "OWNER"],
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.promoteToOwner(userId);

      expect(apiClient.post).toHaveBeenCalledWith(
        `/auth/promoteToOwner/${userId}`,
        {}
      );
      expect(result).toEqual(mockResponse);
    });

    it("debe manejar errores de promoción", async () => {
      const userId = "user-123";
      const mockError = new Error("Ya eres propietario");
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(AuthService.promoteToOwner(userId)).rejects.toThrow(
        "Ya eres propietario"
      );
    });
  });
});
