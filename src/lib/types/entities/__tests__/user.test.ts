import { User, AuthUser, UserRole } from "../user";

describe("User Types", () => {
  describe("User interface", () => {
    it("debe crear un objeto User válido", () => {
      const user: User = {
        id: "user-123",
        email: "test@example.com",
        password: "hashed-password",
        fullName: "Usuario Test",
        location: "Bogotá",
        phone: "+57 300 123 4567",
        roles: ["TENANT"],
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      expect(user.id).toBe("user-123");
      expect(user.email).toBe("test@example.com");
      expect(user.roles).toContain("TENANT");
      expect(user.isActive).toBe(true);
    });

    it("debe aceptar múltiples roles", () => {
      const user: User = {
        id: "user-123",
        email: "test@example.com",
        password: "hashed-password",
        fullName: "Usuario Test",
        location: "Bogotá",
        phone: "+57 300 123 4567",
        roles: ["TENANT", "OWNER"],
        isActive: true,
      };

      expect(user.roles).toHaveLength(2);
      expect(user.roles).toContain("TENANT");
      expect(user.roles).toContain("OWNER");
    });

    it("debe aceptar campos opcionales como undefined", () => {
      const user: User = {
        id: "user-123",
        email: "test@example.com",
        password: "hashed-password",
        fullName: "Usuario Test",
        location: "Bogotá",
        phone: "+57 300 123 4567",
        roles: ["ADMIN"],
        isActive: true,
        // createdAt y updatedAt son opcionales
      };

      expect(user.createdAt).toBeUndefined();
      expect(user.updatedAt).toBeUndefined();
    });
  });

  describe("AuthUser type", () => {
    it("debe crear un AuthUser sin campo password", () => {
      const authUser: AuthUser = {
        id: "user-123",
        email: "test@example.com",
        fullName: "Usuario Test",
        location: "Bogotá",
        phone: "+57 300 123 4567",
        roles: ["TENANT"],
        isActive: true,
      };

      expect(authUser.id).toBe("user-123");
      expect(authUser.email).toBe("test@example.com");
      // password no debe existir en AuthUser
      expect("password" in authUser).toBe(false);
    });
  });

  describe("UserRole type", () => {
    it("debe aceptar solo valores válidos de rol", () => {
      const adminRole: UserRole = "ADMIN";
      const ownerRole: UserRole = "OWNER";
      const tenantRole: UserRole = "TENANT";

      expect(adminRole).toBe("ADMIN");
      expect(ownerRole).toBe("OWNER");
      expect(tenantRole).toBe("TENANT");
    });
  });

  describe("Type conversions", () => {
    it("debe convertir User a AuthUser eliminando password", () => {
      const user: User = {
        id: "user-123",
        email: "test@example.com",
        password: "secret-password",
        fullName: "Usuario Test",
        location: "Bogotá",
        phone: "+57 300 123 4567",
        roles: ["TENANT"],
        isActive: true,
      };

      // Simulando la conversión que haría el código de la aplicación
      const { password, ...authUser } = user;
      const typedAuthUser: AuthUser = authUser;

      expect(typedAuthUser.id).toBe(user.id);
      expect(typedAuthUser.email).toBe(user.email);
      expect("password" in typedAuthUser).toBe(false);
      expect(password).toBe("secret-password"); // Se extrajo correctamente
    });
  });
});
