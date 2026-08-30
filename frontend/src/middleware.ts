import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['ar', 'fr', 'en'];
const DEFAULT_LOCALE = 'ar';

const SUBDOMAIN_ROUTE_MAP: Record<string, string> = {
  admin: 'admin',
  teacher: 'teacher',
  student: 'student',
  ambassador: 'ambassador',
};

function resolveLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('dz_prime_locale')?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale)) return cookieLocale;
  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|css|js|map)$/)
  ) {
    return NextResponse.next();
  }

  const pathSegments = pathname.split('/').filter(Boolean);
  const existingLocale = LOCALES.includes(pathSegments[0]) ? pathSegments[0] : null;
  const locale = existingLocale || resolveLocale(request);

  const subdomainPrefix = hostname.split('.')[0];
  const targetRoute = SUBDOMAIN_ROUTE_MAP[subdomainPrefix];

  if (targetRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/${targetRoute}`;
    const res = NextResponse.rewrite(url);
    res.headers.set('x-dz-subdomain-role', targetRoute);
    return res;
  }

  if (!existingLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
