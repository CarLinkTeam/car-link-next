import { cn, getInitials, truncate, calculateRentalDays } from "../utils";

describe("Utilidades", () => {
  describe("cn (Combinador de clases)", () => {
    it("debe combinar clases correctamente", () => {
      expect(cn("text-red-500", "bg-blue-500")).toBe(
        "text-red-500 bg-blue-500"
      );
    });

    it("debe manejar clases condicionales", () => {
      expect(cn("text-red-500", false && "bg-blue-500", "p-4")).toBe(
        "text-red-500 p-4"
      );
    });

    it("debe combinar con objetos", () => {
      expect(cn({ "text-red-500": true, "bg-blue-500": false })).toBe(
        "text-red-500"
      );
    });

    it("debe manejar arrays", () => {
      expect(cn(["text-red-500", "bg-blue-500"])).toBe(
        "text-red-500 bg-blue-500"
      );
    });
  });

  describe("getInitials", () => {
    it("debe obtener iniciales de un nombre completo", () => {
      expect(getInitials("Juan Pérez")).toBe("JP");
    });

    it("debe obtener iniciales de un solo nombre", () => {
      expect(getInitials("Juan")).toBe("J");
    });

    it("debe obtener máximo 2 iniciales", () => {
      expect(getInitials("Juan Carlos Pérez García")).toBe("JC");
    });

    it("debe manejar nombres con acentos", () => {
      expect(getInitials("José María")).toBe("JM");
    });

    it("debe convertir a mayúsculas", () => {
      expect(getInitials("juan pérez")).toBe("JP");
    });

    it("debe manejar string vacío", () => {
      expect(getInitials("")).toBe("");
    });

    it("debe manejar espacios múltiples", () => {
      expect(getInitials("Juan   Pérez")).toBe("JP");
    });
  });

  describe("truncate", () => {
    it("debe truncar texto que excede la longitud", () => {
      expect(truncate("Este es un texto muy largo", 10)).toBe("Este es un...");
    });

    it("debe retornar el texto original si no excede la longitud", () => {
      expect(truncate("Texto corto", 20)).toBe("Texto corto");
    });

    it("debe retornar el texto original si es igual a la longitud", () => {
      expect(truncate("Exacto", 6)).toBe("Exacto");
    });

    it("debe manejar string vacío", () => {
      expect(truncate("", 5)).toBe("");
    });

    it("debe manejar longitud 0", () => {
      expect(truncate("Texto", 0)).toBe("...");
    });
  });

  describe("calculateRentalDays", () => {
    it("debe calcular días de renta correctamente para el mismo día", () => {
      const date = new Date("2024-01-15");
      expect(calculateRentalDays(date, date)).toBe(1);
    });

    it("debe calcular días de renta para diferentes días", () => {
      const startDate = new Date("2024-01-15");
      const endDate = new Date("2024-01-17");
      expect(calculateRentalDays(startDate, endDate)).toBe(3);
    });

    it("debe calcular días de renta a través de meses", () => {
      const startDate = new Date("2024-01-30");
      const endDate = new Date("2024-02-02");
      expect(calculateRentalDays(startDate, endDate)).toBe(4);
    });

    it("debe retornar 0 si startDate es null", () => {
      const endDate = new Date("2024-01-17");
      expect(calculateRentalDays(null, endDate)).toBe(0);
    });

    it("debe retornar 0 si endDate es null", () => {
      const startDate = new Date("2024-01-15");
      expect(calculateRentalDays(startDate, null)).toBe(0);
    });

    it("debe retornar 0 si ambas fechas son null", () => {
      expect(calculateRentalDays(null, null)).toBe(0);
    });

    it("debe manejar fechas con diferentes horas", () => {
      const startDate = new Date("2024-01-15T10:30:00");
      const endDate = new Date("2024-01-16T14:45:00");
      expect(calculateRentalDays(startDate, endDate)).toBe(2);
    });

    it("debe calcular correctamente para una semana", () => {
      const startDate = new Date("2024-01-15");
      const endDate = new Date("2024-01-21");
      expect(calculateRentalDays(startDate, endDate)).toBe(7);
    });
  });
});
