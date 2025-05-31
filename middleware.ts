import { NextResponse, NextRequest } from 'next/server'

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard', '/profile', '/vehicles', '/rentals']

// Rutas que solo pueden ser accedidas por usuarios no autenticados
const publicRoutes = ['/', '/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Obtener el token de las cookies
  const authCookie = request.cookies.get('car-link-auth')?.value

  let isAuthenticated = false

  if (authCookie) {
    try {
      // Parsear el token de localStorage persistido por Zustand
      const authData = JSON.parse(authCookie)
      isAuthenticated = authData?.state?.isAuthenticated || false
    } catch {
      // Si hay error parseando, considerar como no autenticado
      isAuthenticated = false
    }
  }

  // Verificar si la ruta actual es protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Verificar si la ruta actual es de autenticación
  const isAuthRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Si el usuario no está autenticado y trata de acceder a una ruta protegida
  if (isProtectedRoute && !isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Si el usuario está autenticado y trata de acceder a rutas de auth
  if (isAuthRoute && isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|.*\\..*|_next).*)',
  ],
}
