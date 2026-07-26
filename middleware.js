import { NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/departments/public',
];

function decodeJWT(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload       = atob(
      base64Payload.replace(/-/g, '+').replace(/_/g, '/')
    );
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const cookieToken = request.cookies.get('token')?.value;
  const headerToken = request.headers
    .get('authorization')
    ?.split(' ')[1];
  const token = cookieToken || headerToken;

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const decoded = decodeJWT(token);

  if (!decoded || !decoded.id) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Invalid token.' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Token expired. Please login again.' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id',   decoded.id);
  requestHeaders.set('x-user-role', decoded.role  || '');
  requestHeaders.set('x-user-name', decoded.name  || '');

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};                                                            
