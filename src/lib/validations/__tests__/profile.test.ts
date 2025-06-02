import { editProfileSchema } from "../profile";

describe("Validaciones de Perfil", () => {
  describe("editProfileSchema", () => {
    it("debe validar un perfil válido sin contraseña", () => {
      const validData = {
        fullName: "Juan Pérez",
        phone: "+573001234567",
        location: "Bogotá, Colombia",
      };

      const result = editProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("debe validar un perfil válido con contraseña", () => {
      const validData = {
        fullName: "Juan Pérez",
        phone: "+573001234567",
        location: "Bogotá, Colombia",
        password: "nuevaPassword123",
      };

      const result = editProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("debe validar un perfil válido con contraseña vacía", () => {
      const validData = {
        fullName: "Juan Pérez",
        phone: "+573001234567",
        location: "Bogotá, Colombia",
        password: "",
      };

      const result = editProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("debe fallar con nombre muy corto", () => {
      const invalidData = {
        fullName: "Ana",
        phone: "+573001234567",
        location: "Bogotá, Colombia",
      };

      const result = editProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "El nombre debe tener al menos 4 caracteres"
        );
      }
    });

    it("debe fallar con nombre muy largo", () => {
      const invalidData = {
        fullName: "Juan Carlos Alberto Pérez García",
        phone: "+573001234567",
        location: "Bogotá, Colombia",
      };

      const result = editProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "El nombre no puede exceder 20 caracteres"
        );
      }
    });

    it("debe fallar con nombre que contiene números", () => {
      const invalidData = {
        fullName: "Juan123 Pérez",
        phone: "+573001234567",
        location: "Bogotá, Colombia",
      };

      const result = editProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Solo se permiten letras y espacios"
        );
      }
    });

    it("debe fallar con teléfono sin código de país", () => {
      const invalidData = {
        fullName: "Juan Pérez",
        phone: "3001234567",
        location: "Bogotá, Colombia",
      };

      const result = editProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "El teléfono debe incluir código de país (ej: +57 300 123 4567)"
        );
      }
    });

    it("debe fallar con teléfono muy corto", () => {
      const invalidData = {
        fullName: "Juan Pérez",
        phone: "+5730012",
        location: "Bogotá, Colombia",
      };

      const result = editProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "El teléfono debe tener al menos 10 dígitos"
        );
      }
    });

    it("debe fallar con ubicación muy corta", () => {
      const invalidData = {
        fullName: "Juan Pérez",
        phone: "+573001234567",
        location: "BO",
      };

      const result = editProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "La ubicación debe tener al menos 3 caracteres"
        );
      }
    });

    it("debe fallar con ubicación muy larga", () => {
      const invalidData = {
        fullName: "Juan Pérez",
        phone: "+573001234567",
        location:
          "Una ubicación extremadamente larga que supera los 100 caracteres permitidos en este campo para validación",
      };

      const result = editProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "La ubicación no puede exceder 100 caracteres"
        );
      }
    });

    it("debe fallar con contraseña muy corta", () => {
      const invalidData = {
        fullName: "Juan Pérez",
        phone: "+573001234567",
        location: "Bogotá, Colombia",
        password: "123",
      };

      const result = editProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "La contraseña debe tener entre 6 y 50 caracteres"
        );
      }
    });

    it("debe fallar con contraseña muy larga", () => {
      const invalidData = {
        fullName: "Juan Pérez",
        phone: "+573001234567",
        location: "Bogotá, Colombia",
        password:
          "una_contraseña_extremadamente_larga_que_supera_los_50_caracteres_permitidos",
      };

      const result = editProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "La contraseña debe tener entre 6 y 50 caracteres"
        );
      }
    });

    it("debe validar nombres con acentos y espacios múltiples", () => {
      const validData = {
        fullName: "José María García",
        phone: "+573001234567",
        location: "Medellín, Antioquia",
      };

      const result = editProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("debe fallar con nombre vacío", () => {
      const invalidData = {
        fullName: "",
        phone: "+573001234567",
        location: "Bogotá, Colombia",
      };

      const result = editProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "El nombre completo es requerido"
        );
      }
    });

    it("debe fallar con teléfono vacío", () => {
      const invalidData = {
        fullName: "Juan Pérez",
        phone: "",
        location: "Bogotá, Colombia",
      };

      const result = editProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("El teléfono es requerido");
      }
    });

    it("debe fallar con ubicación vacía", () => {
      const invalidData = {
        fullName: "Juan Pérez",
        phone: "+573001234567",
        location: "",
      };

      const result = editProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "La ubicación es requerida"
        );
      }
    });
  });
});
