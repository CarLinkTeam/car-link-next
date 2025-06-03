import { ReviewService } from "../review-service";
import { apiClient } from "@/lib/api/base/client";

// Mock del cliente API
jest.mock("@/lib/api/base/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("ReviewService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getByVehicleId", () => {
    it("debe obtener las reviews de un vehículo", async () => {
      const vehicleId = "vehicle-123";
      const mockReviews = [
        {
          id: "review-1",
          rating: 5,
          comment: "Excelente vehículo",
          vehicleId,
        },
        {
          id: "review-2",
          rating: 4,
          comment: "Muy bueno",
          vehicleId,
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue(mockReviews);

      const result = await ReviewService.getByVehicleId(vehicleId);

      expect(apiClient.get).toHaveBeenCalledWith(
        `/reviews/vehicle/${vehicleId}`
      );
      expect(result).toEqual(mockReviews);
    });
  });
});
