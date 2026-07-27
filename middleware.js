import { NextResponse } from 'next/server';

// Pages that do NOT need a token
const PUBLIC_PAGES = [
  '/login',
  '/register',
  '/setup',
];

// API routes that do NOT need a token
const PUBLIC_API = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/setup',
  '/api/departments/public',
  '/api/seed',
];

function decodeJWT(token) {
  try {
    const base64 = token.split('.')[1];
    const json   = atob(
      base64.replace(/-/g, '+').replace(/_/g, '/')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Always allow Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Allow public pages — no token needed
  if (PUBLIC_PAGES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow public API routes — no token needed
  if (PUBLIC_API.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // For protected API routes only — check token
  if (pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('authorization');
    const token      = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    const decoded = decodeJWT(token);

    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, message: 'Invalid token.' },
        { status: 401 }
      );
    }

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return NextResponse.json(
        { success: false, message: 'Token expired. Please login again.' },
        { status: 401 }
      );
    }

    // Attach user info to headers for API routes
    const headers = new Headers(request.headers);
    headers.set('x-user-id',   decoded.id);
    headers.set('x-user-role', decoded.role  || '');
    headers.set('x-user-name', decoded.name  || '');

    return NextResponse.next({
      request: { headers },
    });
  }

  // For all other pages — let AuthGuard handle it client-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
