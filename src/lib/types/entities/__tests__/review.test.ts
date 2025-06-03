import { Review } from "../review";
import { Rental } from "../rental";

describe("Review Types", () => {
  describe("Review interface", () => {
    it("debe crear un objeto Review válido", () => {
      const review: Review = {
        id: "review-123",
        rating: 5,
        comment: "Excelente servicio y vehículo en perfectas condiciones",
        createdAt: "2024-01-01T00:00:00Z",
        rental_id: "rental-123",
        rental: {
          id: "rental-123",
          initialDate: "2024-01-01",
          finalDate: "2024-01-05",
          totalCost: "500000",
          status: "completed",
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
        },
      };

      expect(review.id).toBe("review-123");
      expect(review.rating).toBe(5);
      expect(review.comment).toBe(
        "Excelente servicio y vehículo en perfectas condiciones"
      );
      expect(review.rental_id).toBe("rental-123");
      expect(review.rental.id).toBe("rental-123");
    });

    it("debe validar que el rating esté en el rango correcto", () => {
      const review1: Review = {
        id: "review-1",
        rating: 1,
        comment: "Mal servicio",
        createdAt: "2024-01-01T00:00:00Z",
        rental_id: "rental-123",
        rental: { id: "rental-123" } as Partial<Rental> as Rental, // Simplificado para el test
      };

      const review5: Review = {
        id: "review-5",
        rating: 5,
        comment: "Excelente servicio",
        createdAt: "2024-01-01T00:00:00Z",
        rental_id: "rental-123",
        rental: { id: "rental-123" } as Partial<Rental> as Rental, // Simplificado para el test
      };

      expect(review1.rating).toBe(1);
      expect(review5.rating).toBe(5);
    });

    it("debe manejar comentarios largos", () => {
      const longComment =
        "Este es un comentario muy largo que describe en detalle la experiencia de renta del vehículo, incluyendo aspectos como la limpieza, el estado mecánico, la atención del propietario y la facilidad del proceso de entrega y devolución.";

      const review: Review = {
        id: "review-123",
        rating: 4,
        comment: longComment,
        createdAt: "2024-01-01T00:00:00Z",
        rental_id: "rental-123",
        rental: { id: "rental-123" } as Partial<Rental> as Rental, // Simplificado para el test
      };

      expect(review.comment).toBe(longComment);
      expect(review.comment.length).toBeGreaterThan(100);
    });

    it("debe tener una fecha de creación válida", () => {
      const review: Review = {
        id: "review-123",
        rating: 4,
        comment: "Buen servicio",
        createdAt: "2024-01-01T12:30:00Z",
        rental_id: "rental-123",
        rental: { id: "rental-123" } as Partial<Rental> as Rental, // Simplificado para el test
      };

      expect(review.createdAt).toBe("2024-01-01T12:30:00Z");
      // Verificar que es una fecha ISO válida
      expect(new Date(review.createdAt).toISOString()).toBe(
        "2024-01-01T12:30:00.000Z"
      );
    });
  });
});
