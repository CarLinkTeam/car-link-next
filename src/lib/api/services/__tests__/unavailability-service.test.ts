import { UnavailabilityService } from "../unavailability-service";
import { apiClient } from "@/lib/api/base/client";

// Mock del cliente API
jest.mock("@/lib/api/base/client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("UnavailabilityService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getByVehicleId", () => {
    it("debe obtener los períodos de no disponibilidad de un vehículo", async () => {
      const vehicleId = "vehicle-123";
      const mockPeriods = [
        {
          id: "period-1",
          vehicle_id: vehicleId,
          unavailable_from: "2024-01-01",
          unavailable_to: "2024-01-05",
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue(mockPeriods);

      const result = await UnavailabilityService.getByVehicleId(vehicleId);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/vehicles/${vehicleId}/unavailability`
      );
      expect(result).toEqual(mockPeriods);
    });
  });

  describe("create", () => {
    it("debe crear un período de no disponibilidad", async () => {
      const unavailabilityData = {
        vehicle_id: "vehicle-123",
        unavailable_from: "2024-01-01",
        unavailable_to: "2024-01-05",
      };

      const mockResponse = { id: "period-123", ...unavailabilityData };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await UnavailabilityService.create(unavailabilityData);

      expect(apiClient.post).toHaveBeenCalledWith(
        "/unavailability",
        unavailabilityData
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("update", () => {
    it("debe actualizar un período de no disponibilidad", async () => {
      const periodId = "period-123";
      const updateData = {
        unavailable_from: "2024-01-02",
        unavailable_to: "2024-01-06",
      };
      const mockResponse = { id: periodId, ...updateData };

      (apiClient.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await UnavailabilityService.update(periodId, updateData);

      expect(apiClient.put).toHaveBeenCalledWith(
        `/unavailability/${periodId}`,
        updateData
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("delete", () => {
    it("debe eliminar un período de no disponibilidad", async () => {
      const periodId = "period-123";

      (apiClient.delete as jest.Mock).mockResolvedValue(undefined);

      await UnavailabilityService.delete(periodId);

      expect(apiClient.delete).toHaveBeenCalledWith(
        `/unavailability/${periodId}`
      );
    });
  });

  describe("checkAvailability", () => {
    it("debe verificar la disponibilidad de un vehículo en una fecha", async () => {
      const vehicleId = "vehicle-123";
      const date = "2024-01-01";
      const mockResponse = {
        available: false,
        conflictingPeriods: [
          {
            id: "period-1",
            vehicle_id: vehicleId,
            unavailable_from: "2024-01-01",
            unavailable_to: "2024-01-05",
          },
        ],
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await UnavailabilityService.checkAvailability(
        vehicleId,
        date
      );

      expect(apiClient.get).toHaveBeenCalledWith(
        `/vehicles/${vehicleId}/availability?date=${date}`
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
