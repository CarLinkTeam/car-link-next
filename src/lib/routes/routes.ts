/**
 * Configuración centralizada de rutas
 */
export const AUTH_ROUTES_CONFIG = {

  ROLE_PROTECTED: {
    ADMIN: ['/dashboard/admin'],
    OWNER: ['/dashboard/requests']
  } as const,

  // Rutas que requieren autenticación
  PROTECTED: ['/dashboard'] as const,

  // Rutas de autenticación que redirigen si ya está logueado
  AUTH: ['/auth/login', '/auth/register'] as const,

  // Rutas públicas
  PUBLIC: ['/'] as const,

  // Rutas del sistema (API, archivos estáticos, etc.)
  SYSTEM: ['/not-found', '/loading', '/access-denied', '/_next', '/api'] as const,

  // Rutas de redirección por defecto
  DEFAULTS: {
    LOGIN: '/auth/login',
    DASHBOARD: '/dashboard/vehicles',
    HOME: '/',
    ACCESS_DENIED: '/access-denied',
  } as const,
} as const

/**
 * Utilidades para verificación de rutas
 */
export const RouteUtils = {
  isProtected: (pathname: string): boolean => AUTH_ROUTES_CONFIG.PROTECTED.some((route) => pathname.startsWith(route)),

  isAuth: (pathname: string): boolean => AUTH_ROUTES_CONFIG.AUTH.some((route) => pathname.startsWith(route)),

  isPublic: (pathname: string): boolean => AUTH_ROUTES_CONFIG.PUBLIC.some((route) => pathname === route),

  isSystem: (pathname: string): boolean => AUTH_ROUTES_CONFIG.SYSTEM.some((route) => pathname.startsWith(route)),

  getRequiredRoles: (pathname: string): ('ADMIN' | 'OWNER')[] => {
    return Object.entries(AUTH_ROUTES_CONFIG.ROLE_PROTECTED)
      .filter(([, prefixes]) =>
        prefixes.some((prefix) => pathname.startsWith(prefix))
      )
      .map(([role]) => role as 'ADMIN' | 'OWNER');
  },

  isRoleProtected: (pathname: string): boolean => {
    return RouteUtils.getRequiredRoles(pathname).length > 0;
  },

  /**
   * Determina el tipo de ruta
   */
  getRouteType: (pathname: string): 'protected' | 'auth' | 'public' | 'system' | 'unknown' => {
    if (RouteUtils.isSystem(pathname)) return 'system'
    if (RouteUtils.isProtected(pathname)) return 'protected'
    if (RouteUtils.isAuth(pathname)) return 'auth'
    if (RouteUtils.isPublic(pathname)) return 'public'
    return 'unknown'
  },
} as const

export type RouteType = ReturnType<typeof RouteUtils.getRouteType>
