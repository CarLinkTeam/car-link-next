import { AUTH_ROUTES_CONFIG, RouteUtils } from "../routes";

describe("Configuración de Rutas", () => {
  describe("AUTH_ROUTES_CONFIG", () => {
    it("debe tener todas las configuraciones de rutas definidas", () => {
      expect(AUTH_ROUTES_CONFIG.PROTECTED).toBeDefined();
      expect(AUTH_ROUTES_CONFIG.AUTH).toBeDefined();
      expect(AUTH_ROUTES_CONFIG.PUBLIC).toBeDefined();
      expect(AUTH_ROUTES_CONFIG.SYSTEM).toBeDefined();
      expect(AUTH_ROUTES_CONFIG.DEFAULTS).toBeDefined();
    });

    it("debe tener rutas protegidas correctas", () => {
      expect(AUTH_ROUTES_CONFIG.PROTECTED).toContain("/dashboard");
    });

    it("debe tener rutas de autenticación correctas", () => {
      expect(AUTH_ROUTES_CONFIG.AUTH).toContain("/auth/login");
      expect(AUTH_ROUTES_CONFIG.AUTH).toContain("/auth/register");
    });

    it("debe tener rutas públicas correctas", () => {
      expect(AUTH_ROUTES_CONFIG.PUBLIC).toContain("/");
    });

    it("debe tener rutas del sistema correctas", () => {
      expect(AUTH_ROUTES_CONFIG.SYSTEM).toContain("/not-found");
      expect(AUTH_ROUTES_CONFIG.SYSTEM).toContain("/loading");
      expect(AUTH_ROUTES_CONFIG.SYSTEM).toContain("/access-denied");
      expect(AUTH_ROUTES_CONFIG.SYSTEM).toContain("/_next");
      expect(AUTH_ROUTES_CONFIG.SYSTEM).toContain("/api");
    });

    it("debe tener configuraciones por defecto correctas", () => {
      expect(AUTH_ROUTES_CONFIG.DEFAULTS.LOGIN).toBe("/auth/login");
      expect(AUTH_ROUTES_CONFIG.DEFAULTS.DASHBOARD).toBe("/dashboard/vehicles");
      expect(AUTH_ROUTES_CONFIG.DEFAULTS.HOME).toBe("/");
      expect(AUTH_ROUTES_CONFIG.DEFAULTS.ACCESS_DENIED).toBe("/access-denied");
    });
  });

  describe("RouteUtils", () => {
    describe("isProtected", () => {
      it("debe identificar rutas protegidas correctamente", () => {
        expect(RouteUtils.isProtected("/dashboard")).toBe(true);
        expect(RouteUtils.isProtected("/dashboard/vehicles")).toBe(true);
        expect(RouteUtils.isProtected("/dashboard/rentals")).toBe(true);
        expect(RouteUtils.isProtected("/dashboard/profile")).toBe(true);
      });

      it("debe retornar false para rutas no protegidas", () => {
        expect(RouteUtils.isProtected("/")).toBe(false);
        expect(RouteUtils.isProtected("/auth/login")).toBe(false);
        expect(RouteUtils.isProtected("/public")).toBe(false);
        expect(RouteUtils.isProtected("/api/auth")).toBe(false);
      });
    });

    describe("isAuth", () => {
      it("debe identificar rutas de autenticación correctamente", () => {
        expect(RouteUtils.isAuth("/auth/login")).toBe(true);
        expect(RouteUtils.isAuth("/auth/register")).toBe(true);
      });

      it("debe retornar false para rutas que no son de autenticación", () => {
        expect(RouteUtils.isAuth("/dashboard")).toBe(false);
        expect(RouteUtils.isAuth("/")).toBe(false);
        expect(RouteUtils.isAuth("/api/auth")).toBe(false);
        expect(RouteUtils.isAuth("/auth")).toBe(false); // Solo debe coincidir con rutas exactas o que empiecen con la ruta
      });
    });

    describe("isPublic", () => {
      it("debe identificar rutas públicas correctamente", () => {
        expect(RouteUtils.isPublic("/")).toBe(true);
      });

      it("debe retornar false para rutas que no son públicas", () => {
        expect(RouteUtils.isPublic("/dashboard")).toBe(false);
        expect(RouteUtils.isPublic("/auth/login")).toBe(false);
        expect(RouteUtils.isPublic("/public")).toBe(false);
        expect(RouteUtils.isPublic("/home")).toBe(false);
      });
    });

    describe("isSystem", () => {
      it("debe identificar rutas del sistema correctamente", () => {
        expect(RouteUtils.isSystem("/not-found")).toBe(true);
        expect(RouteUtils.isSystem("/loading")).toBe(true);
        expect(RouteUtils.isSystem("/access-denied")).toBe(true);
        expect(RouteUtils.isSystem("/_next/static/css/app.css")).toBe(true);
        expect(RouteUtils.isSystem("/api/auth/login")).toBe(true);
        expect(RouteUtils.isSystem("/api/vehicles")).toBe(true);
      });

      it("debe retornar false para rutas que no son del sistema", () => {
        expect(RouteUtils.isSystem("/dashboard")).toBe(false);
        expect(RouteUtils.isSystem("/auth/login")).toBe(false);
        expect(RouteUtils.isSystem("/")).toBe(false);
        expect(RouteUtils.isSystem("/public")).toBe(false);
      });
    });

    describe("getRouteType", () => {
      it("debe identificar correctamente rutas del sistema", () => {
        expect(RouteUtils.getRouteType("/api/auth")).toBe("system");
        expect(RouteUtils.getRouteType("/_next/static")).toBe("system");
        expect(RouteUtils.getRouteType("/not-found")).toBe("system");
        expect(RouteUtils.getRouteType("/loading")).toBe("system");
        expect(RouteUtils.getRouteType("/access-denied")).toBe("system");
      });

      it("debe identificar correctamente rutas protegidas", () => {
        expect(RouteUtils.getRouteType("/dashboard")).toBe("protected");
        expect(RouteUtils.getRouteType("/dashboard/vehicles")).toBe(
          "protected"
        );
        expect(RouteUtils.getRouteType("/dashboard/rentals")).toBe("protected");
        expect(RouteUtils.getRouteType("/dashboard/profile")).toBe("protected");
      });

      it("debe identificar correctamente rutas de autenticación", () => {
        expect(RouteUtils.getRouteType("/auth/login")).toBe("auth");
        expect(RouteUtils.getRouteType("/auth/register")).toBe("auth");
      });

      it("debe identificar correctamente rutas públicas", () => {
        expect(RouteUtils.getRouteType("/")).toBe("public");
      });

      it("debe retornar 'unknown' para rutas no configuradas", () => {
        expect(RouteUtils.getRouteType("/unknown-route")).toBe("unknown");
        expect(RouteUtils.getRouteType("/contact")).toBe("unknown");
        expect(RouteUtils.getRouteType("/about")).toBe("unknown");
        expect(RouteUtils.getRouteType("/help")).toBe("unknown");
      });
    });

    describe("Casos edge", () => {
      it("debe manejar rutas vacías", () => {
        expect(RouteUtils.isProtected("")).toBe(false);
        expect(RouteUtils.isAuth("")).toBe(false);
        expect(RouteUtils.isPublic("")).toBe(false);
        expect(RouteUtils.isSystem("")).toBe(false);
        expect(RouteUtils.getRouteType("")).toBe("unknown");
      });

      it("debe manejar rutas con query parameters", () => {
        expect(RouteUtils.isProtected("/dashboard?tab=vehicles")).toBe(true);
        expect(RouteUtils.isAuth("/auth/login?redirect=/dashboard")).toBe(true);
        expect(RouteUtils.isSystem("/api/vehicles?search=toyota")).toBe(true);
      });

      it("debe manejar rutas con fragmentos", () => {
        expect(RouteUtils.isProtected("/dashboard#vehicles")).toBe(true);
        expect(RouteUtils.isAuth("/auth/login#form")).toBe(true);
        expect(RouteUtils.isSystem("/api/auth#token")).toBe(true);
      });

      it("debe ser case-sensitive", () => {
        expect(RouteUtils.isProtected("/Dashboard")).toBe(false);
        expect(RouteUtils.isAuth("/Auth/login")).toBe(false);
        expect(RouteUtils.isSystem("/API/auth")).toBe(false);
      });
    });

    describe("Prioridades de rutas", () => {
      it("debe priorizar rutas del sistema sobre otras", () => {
        // Si una ruta podría ser tanto sistema como otra cosa, debe ser sistema
        expect(RouteUtils.getRouteType("/api/dashboard")).toBe("system");
        expect(RouteUtils.getRouteType("/_next/dashboard")).toBe("system");
      });

      it("debe manejar rutas que podrían estar en múltiples categorías", () => {
        // Estas pruebas verifican el orden de evaluación en getRouteType
        expect(RouteUtils.getRouteType("/dashboard")).toBe("protected");
        expect(RouteUtils.getRouteType("/auth/login")).toBe("auth");
        expect(RouteUtils.getRouteType("/")).toBe("public");
      });
    });
  });
});
