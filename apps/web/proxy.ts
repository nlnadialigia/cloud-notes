import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/', '/login', '/signup', '/confirm', '/auth/callback']
const protectedRoutes = ['/dashboard', '/settings', '/profile']

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value || getTokenFromHeader(request)

  // Verificar se é rota protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname)

  // Redirecionar para login se tentar acessar rota protegida sem token
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }

  // Redirecionar para dashboard se já autenticado e tentar acessar rota pública
  if (isPublicRoute && token && pathname !== '/') {
    const url = new URL('/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

function getTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
