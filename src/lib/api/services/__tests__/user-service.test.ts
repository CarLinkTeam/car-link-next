import { UserService } from "../user-service";
import { apiClient } from "@/lib/api/base/client";

// Mock del cliente API
jest.mock("@/lib/api/base/client", () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getById", () => {
    it("debe obtener un usuario por ID", async () => {
      const userId = "user-123";
      const mockUser = {
        id: userId,
        email: "test@test.com",
        fullName: "Test User",
        phone: "+573001234567",
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.getById(userId);

      expect(apiClient.get).toHaveBeenCalledWith(`/users/${userId}`);
      expect(result).toEqual(mockUser);
    });
  });

  describe("update", () => {
    it("debe actualizar un usuario", async () => {
      const userId = "user-123";
      const updateData = {
        fullName: "Nuevo Nombre",
        phone: "+573009876543",
      };
      const mockResponse = { id: userId, ...updateData };

      (apiClient.patch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await UserService.update(userId, updateData);

      expect(apiClient.patch).toHaveBeenCalledWith(
        `/users/${userId}`,
        updateData
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("delete", () => {
    it("debe eliminar un usuario", async () => {
      const userId = "user-123";

      (apiClient.delete as jest.Mock).mockResolvedValue(undefined);

      await UserService.delete(userId);

      expect(apiClient.delete).toHaveBeenCalledWith(`/users/${userId}`);
    });
  });
});
