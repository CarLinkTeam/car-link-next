"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { RouteUtils, AUTH_ROUTES_CONFIG } from "@/lib/routes/routes";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, _hasHydrated, token, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Solo verificar después de hidratación completa
    if (!_hasHydrated) {
      setIsVerifying(true);
      return;
    }

    const routeType = RouteUtils.getRouteType(pathname);
    const hasValidSession = !!(token && user && isAuthenticated);

    // Verificación de rutas protegidas
    if (routeType === "protected") {
      if (!hasValidSession) {
        // Determinar si es falta de token o problema de permisos/token inválido
        if (!token) {
          router.replace(
            `${
              AUTH_ROUTES_CONFIG.DEFAULTS.LOGIN
            }?reason=no-token&callbackUrl=${encodeURIComponent(pathname)}`
          );
          return;
        } else if (token && !user) {
          router.replace(
            `${AUTH_ROUTES_CONFIG.DEFAULTS.ACCESS_DENIED}?reason=invalid-token`
          );
          return;
        } else if (!isAuthenticated) {
          router.replace(
            `${AUTH_ROUTES_CONFIG.DEFAULTS.ACCESS_DENIED}?reason=unauthorized`
          );
          return;
        } else {
          router.replace(
            `${AUTH_ROUTES_CONFIG.DEFAULTS.ACCESS_DENIED}?reason=session-invalid`
          );
          return;
        }
      }
    }

    // Verificación de rutas de auth
    if (routeType === "auth") {
      if (hasValidSession) {
        router.replace(AUTH_ROUTES_CONFIG.DEFAULTS.DASHBOARD);
        return;
      }
    }

    const requiredRoles = RouteUtils.getRequiredRoles(pathname);
    if (requiredRoles.length > 0) {
      const userRoles = user?.roles ?? [];
      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role)
      );

      if (!hasRequiredRole) {
        router.replace(
          `${AUTH_ROUTES_CONFIG.DEFAULTS.ACCESS_DENIED}?reason=insufficient-role`
        );
        return;
      }
    }

    // Si llegamos aquí, la verificación está completa
    setIsVerifying(false);
  }, [_hasHydrated, isAuthenticated, token, user, pathname, router]);

  // Loading state - Durante hidratación o verificación
  if (!_hasHydrated || isVerifying) {
    const routeType = _hasHydrated
      ? RouteUtils.getRouteType(pathname)
      : "unknown";
    const isProtectedRoute = routeType === "protected";

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="text-center max-w-md mx-auto px-4">
          {/* Loading Animation */}
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
            <div className="w-12 h-12 border-4 border-accent-200 border-t-accent-600 rounded-full animate-reverse-spin absolute top-2 left-1/2 transform -translate-x-1/2"></div>
          </div>

          {/* Brand */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold gradient-text mb-2">
              CarLink
            </h2>
            <p className="text-secondary-600">
              {!_hasHydrated
                ? "Preparando tu experiencia de renta..."
                : isProtectedRoute
                ? "Verificando permisos de acceso..."
                : "Cargando página..."}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="space-y-4">
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-200"></div>
            </div>

            {/* Status */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-secondary-600">
                <div className="w-3 h-3 border border-primary-400 border-t-primary-600 rounded-full animate-spin"></div>
                <span>
                  {!_hasHydrated
                    ? "Restaurando sesión..."
                    : "Verificando acceso..."}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-xs text-secondary-400">
            <p>
              {!_hasHydrated
                ? "Verificando credenciales almacenadas"
                : "Validando permisos de usuario"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
