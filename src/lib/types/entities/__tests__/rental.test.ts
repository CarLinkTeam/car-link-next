import {
  Rental,
  RentalStatus,
  PaymentStatus,
  CreateRentalData,
  UpdateRentalData,
  CreateReviewData,
  RentalFilters,
  RentalStats,
  rentalStatusLabels,
} from "../rental";

describe("Rental Types", () => {
  describe("Rental interface", () => {
    it("debe crear un objeto Rental válido", () => {
      const rental: Rental = {
        id: "rental-123",
        initialDate: "2024-01-01",
        finalDate: "2024-01-05",
        totalCost: "500000",
        status: "pending",
        client: {
          id: "user-123",
          email: "client@test.com",
          password: "hashed-password",
          fullName: "Cliente Test",
          location: "Bogotá",
          phone: "+57 300 123 4567",
          roles: ["TENANT"],
          isActive: true,
        },
        client_id: "user-123",
        vehicle: {
          id: "vehicle-123",
          vehicleModel: "Corolla",
          make: "Toyota",
          color: "Blanco",
          year: 2023,
          license_plate: "ABC123",
          url_photos: ["https://example.com/photo1.jpg"],
          daily_price: 150000,
          rental_conditions: "Condiciones de prueba",
          userId: "owner-123",
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
          owner: {
            id: "owner-123",
            email: "owner@test.com",
            password: "hashed-password",
            fullName: "Owner Test",
            location: "Bogotá",
            phone: "+57 300 123 4567",
            roles: ["OWNER"],
            isActive: true,
          },
          ownerId: "owner-123",
        },
        vehicle_id: "vehicle-123",
      };

      expect(rental.id).toBe("rental-123");
      expect(rental.status).toBe("pending");
      expect(rental.totalCost).toBe("500000");
      expect(rental.client_id).toBe("user-123");
      expect(rental.vehicle_id).toBe("vehicle-123");
    });
  });

  describe("RentalStatus type", () => {
    it("debe aceptar solo valores válidos de estado", () => {
      const pending: RentalStatus = "pending";
      const confirmed: RentalStatus = "confirmed";
      const active: RentalStatus = "active";
      const completed: RentalStatus = "completed";
      const cancelled: RentalStatus = "cancelled";

      expect(pending).toBe("pending");
      expect(confirmed).toBe("confirmed");
      expect(active).toBe("active");
      expect(completed).toBe("completed");
      expect(cancelled).toBe("cancelled");
    });
  });

  describe("PaymentStatus type", () => {
    it("debe aceptar solo valores válidos de pago", () => {
      const pending: PaymentStatus = "PENDING";
      const paid: PaymentStatus = "PAID";
      const refunded: PaymentStatus = "REFUNDED";
      const partial: PaymentStatus = "PARTIAL";

      expect(pending).toBe("PENDING");
      expect(paid).toBe("PAID");
      expect(refunded).toBe("REFUNDED");
      expect(partial).toBe("PARTIAL");
    });
  });

  describe("CreateRentalData", () => {
    it("debe crear datos válidos para crear renta", () => {
      const createData: CreateRentalData = {
        vehicle_id: "vehicle-123",
        initialDate: "2024-01-01",
        finalDate: "2024-01-05",
        totalCost: 500000,
      };

      expect(createData.vehicle_id).toBe("vehicle-123");
      expect(createData.totalCost).toBe(500000);
    });

    it("debe aceptar status opcional", () => {
      const createData: CreateRentalData = {
        vehicle_id: "vehicle-123",
        initialDate: "2024-01-01",
        finalDate: "2024-01-05",
        totalCost: 500000,
        status: "confirmed",
      };

      expect(createData.status).toBe("confirmed");
    });
  });

  describe("UpdateRentalData", () => {
    it("debe permitir actualizaciones parciales", () => {
      const updateData: UpdateRentalData = {
        status: "completed",
        notes: "Renta completada exitosamente",
      };

      expect(updateData.status).toBe("completed");
      expect(updateData.notes).toBe("Renta completada exitosamente");
      expect(updateData.paymentStatus).toBeUndefined();
    });
  });

  describe("CreateReviewData", () => {
    it("debe crear datos válidos para review", () => {
      const reviewData: CreateReviewData = {
        rental_id: "rental-123",
        rating: 5,
        comment: "Excelente servicio",
        createdAt: "2024-01-01T00:00:00Z",
      };

      expect(reviewData.rental_id).toBe("rental-123");
      expect(reviewData.rating).toBe(5);
      expect(reviewData.comment).toBe("Excelente servicio");
    });

    it("debe permitir comment opcional", () => {
      const reviewData: CreateReviewData = {
        rental_id: "rental-123",
        rating: 4,
        createdAt: "2024-01-01T00:00:00Z",
      };

      expect(reviewData.rating).toBe(4);
      expect(reviewData.comment).toBeUndefined();
    });
  });

  describe("RentalFilters", () => {
    it("debe crear filtros válidos para búsqueda", () => {
      const filters: RentalFilters = {
        status: "active",
        paymentStatus: "PAID",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        vehicleId: "vehicle-123",
        renterId: "user-123",
      };

      expect(filters.status).toBe("active");
      expect(filters.paymentStatus).toBe("PAID");
      expect(filters.vehicleId).toBe("vehicle-123");
    });
  });

  describe("RentalStats", () => {
    it("debe crear estadísticas válidas", () => {
      const stats: RentalStats = {
        totalRentals: 100,
        activeRentals: 10,
        completedRentals: 80,
        cancelledRentals: 10,
        totalRevenue: 5000000,
        averageRentalDuration: 3.5,
      };

      expect(stats.totalRentals).toBe(100);
      expect(stats.totalRevenue).toBe(5000000);
      expect(stats.averageRentalDuration).toBe(3.5);
    });
  });

  describe("rentalStatusLabels", () => {
    it("debe contener etiquetas en español para los estados", () => {
      expect(rentalStatusLabels.PENDING).toBe("Pendiente");
      expect(rentalStatusLabels.APPROVED).toBe("Aprobada");
      expect(rentalStatusLabels.ACTIVE).toBe("Activa");
      expect(rentalStatusLabels.COMPLETED).toBe("Completada");
      expect(rentalStatusLabels.CANCELLED).toBe("Cancelada");
    });
  });
});
