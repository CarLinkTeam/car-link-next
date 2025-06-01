import { NextResponse, type NextRequest } from 'next/server'
import { RouteUtils } from '@/lib/routes/routes'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const routeType = RouteUtils.getRouteType(pathname)

  // Rutas del sistema pasan directamente
  if (routeType === 'system') {
    return NextResponse.next()
  }

  // Respuesta base con headers de seguridad
  const response = NextResponse.next()

  // Headers de seguridad estándar
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-Route-Type', routeType)

  // Rutas públicas no necesitan verificación
  if (routeType === 'public') {
    return response
  }

  // Para rutas protegidas, marcar que requieren verificación en AuthGuard
  if (routeType === 'protected') {
    response.headers.set('X-Auth-Required', 'true')
    return response
  }

  // Para rutas de auth, marcar tipo
  if (routeType === 'auth') {
    response.headers.set('X-Auth-Route', 'true')
    return response
  }

  // Rutas desconocidas pasan normalmente
  return response
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto:
     * - API routes (/api/*)
     * - Archivos estáticos de Next.js (/_next/*)
     * - Archivos de imagen y recursos (/.*\..*)
     * - Favicon
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
}
