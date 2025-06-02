import { loginSchema, registerSchema } from "../auth";

describe("Validaciones de Autenticación", () => {
  describe("loginSchema", () => {
    it("debe validar un login correcto", () => {
      const validData = {
        email: "usuario@ejemplo.com",
        password: "password123",
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("debe fallar con email inválido", () => {
      const invalidData = {
        email: "email-invalido",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Formato de correo inválido"
        );
      }
    });

    it("debe fallar con email vacío", () => {
      const invalidData = {
        email: "",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "El correo electrónico es requerido"
        );
      }
    });

    it("debe fallar con contraseña vacía", () => {
      const invalidData = {
        email: "usuario@ejemplo.com",
        password: "",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "La contraseña es requerida"
        );
      }
    });

    it("debe fallar con contraseña muy corta", () => {
      const invalidData = {
        email: "usuario@ejemplo.com",
        password: "123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "La contraseña debe tener al menos 6 caracteres"
        );
      }
    });
  });

  describe("registerSchema", () => {
    it("debe validar un registro correcto", () => {
      const validData = {
        fullName: "Juan Pérez",
        email: "juan@ejemplo.com",
        password: "Password123",
        confirmPassword: "Password123",
        location: "Bogotá, Colombia",
        phone: "+573001234567",
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("debe fallar cuando las contraseñas no coinciden", () => {
      const invalidData = {
        fullName: "Juan Pérez",
        email: "juan@ejemplo.com",
        password: "Password123",
        confirmPassword: "Password456",
        location: "Bogotá, Colombia",
        phone: "+573001234567",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Las contraseñas no coinciden"
        );
      }
    });

    it("debe fallar con nombre muy corto", () => {
      const invalidData = {
        fullName: "Ana",
        email: "ana@ejemplo.com",
        password: "Password123",
        confirmPassword: "Password123",
        location: "Bogotá, Colombia",
        phone: "+573001234567",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "El nombre debe tener al menos 4 caracteres"
        );
      }
    });

    it("debe fallar con nombre muy largo", () => {
      const invalidData = {
        fullName: "Juan Carlos Alberto Pérez",
        email: "juan@ejemplo.com",
        password: "Password123",
        confirmPassword: "Password123",
        location: "Bogotá, Colombia",
        phone: "+573001234567",
      };

      const result = registerSchema.safeParse(invalidData);
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
        email: "juan@ejemplo.com",
        password: "Password123",
        confirmPassword: "Password123",
        location: "Bogotá, Colombia",
        phone: "+573001234567",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "Solo se permiten letras y espacios"
        );
      }
    });

    it("debe fallar con contraseña sin mayúscula", () => {
      const invalidData = {
        fullName: "Juan Pérez",
        email: "juan@ejemplo.com",
        password: "password123",
        confirmPassword: "password123",
        location: "Bogotá, Colombia",
        phone: "+573001234567",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
        );
      }
    });

    it("debe fallar con contraseña sin minúscula", () => {
      const invalidData = {
        fullName: "Juan Pérez",
        email: "juan@ejemplo.com",
        password: "PASSWORD123",
        confirmPassword: "PASSWORD123",
        location: "Bogotá, Colombia",
        phone: "+573001234567",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
        );
      }
    });

    it("debe fallar con contraseña sin número", () => {
      const invalidData = {
        fullName: "Juan Pérez",
        email: "juan@ejemplo.com",
        password: "Password",
        confirmPassword: "Password",
        location: "Bogotá, Colombia",
        phone: "+573001234567",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
        );
      }
    });

    it("debe fallar con teléfono sin código de país", () => {
      const invalidData = {
        fullName: "Juan Pérez",
        email: "juan@ejemplo.com",
        password: "Password123",
        confirmPassword: "Password123",
        location: "Bogotá, Colombia",
        phone: "3001234567",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "El teléfono debe incluir código de país (ej: +57 300 123 4567)"
        );
      }
    });

    it("debe fallar con ubicación muy corta", () => {
      const invalidData = {
        fullName: "Juan Pérez",
        email: "juan@ejemplo.com",
        password: "Password123",
        confirmPassword: "Password123",
        location: "BO",
        phone: "+573001234567",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "La ubicación debe tener al menos 3 caracteres"
        );
      }
    });

    it("debe validar nombres con acentos", () => {
      const validData = {
        fullName: "José María García",
        email: "jose@ejemplo.com",
        password: "Password123",
        confirmPassword: "Password123",
        location: "Medellín, Colombia",
        phone: "+573001234567",
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
