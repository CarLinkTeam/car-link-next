import { RentalService } from "../rental-service";
import { apiClient } from "@/lib/api/base/client";
import { CreateRentalData, RentalStatus } from "../../../types/entities/rental";

// Mock del cliente API
jest.mock("@/lib/api/base/client", () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

describe("RentalService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("debe crear una renta exitosamente", async () => {
      const mockRentalData: CreateRentalData = {
        vehicle_id: "vehicle-123",
        initialDate: "2024-01-01",
        finalDate: "2024-01-05",
        totalCost: 500,
      };

      const mockResponse = {
        id: "rental-123",
        ...mockRentalData,
        status: "pending" as RentalStatus,
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await RentalService.create(mockRentalData);

      expect(apiClient.post).toHaveBeenCalledWith("/rentals", mockRentalData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getUserRentals", () => {
    it("debe obtener las rentas del usuario", async () => {
      const mockRentals = [
        { id: "rental-1", status: "active" as RentalStatus },
        { id: "rental-2", status: "completed" as RentalStatus },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue(mockRentals);

      const result = await RentalService.getUserRentals();

      expect(apiClient.get).toHaveBeenCalledWith("/rentals/user");
      expect(result).toEqual(mockRentals);
    });
  });

  describe("getOwnerRentals", () => {
    it("debe obtener las rentas del propietario", async () => {
      const mockRentals = [
        { id: "rental-1", status: "active" as RentalStatus },
        { id: "rental-2", status: "pending" as RentalStatus },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue(mockRentals);

      const result = await RentalService.getOwnerRentals();

      expect(apiClient.get).toHaveBeenCalledWith("/rentals/owner");
      expect(result).toEqual(mockRentals);
    });
  });

  describe("hasReview", () => {
    it("debe verificar si una renta tiene review", async () => {
      const rentalId = "rental-123";
      (apiClient.get as jest.Mock).mockResolvedValue(true);

      const result = await RentalService.hasReview(rentalId);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/rentals/${rentalId}/has-review`
      );
      expect(result).toBe(true);
    });

    it("debe retornar false si hay error", async () => {
      const rentalId = "rental-123";
      (apiClient.get as jest.Mock).mockRejectedValue(new Error("Not found"));

      const result = await RentalService.hasReview(rentalId);

      expect(result).toBe(false);
    });
  });

  describe("updateById", () => {
    it("debe actualizar una renta", async () => {
      const rentalId = "rental-123";
      const updateData = { status: "completed" as RentalStatus };
      const mockResponse = { id: rentalId, ...updateData };

      (apiClient.patch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await RentalService.updateById(rentalId, updateData);

      expect(apiClient.patch).toHaveBeenCalledWith(
        `/rentals/${rentalId}`,
        updateData
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
