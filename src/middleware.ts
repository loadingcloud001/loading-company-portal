import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Let next-intl handle locale routing for all public pages
  // Check if this is an auth-protected or admin route
  const localeMatch = pathname.match(/^\/(en|zh)(\/.*)?$/);
  const subPath = localeMatch ? (localeMatch[2] || '/') : pathname;

  // Protect dashboard/quotations/orders routes (customer auth required)
  const customerProtectedPaths = ['/dashboard', '/quotations', '/orders'];
  const isCustomerProtected = customerProtectedPaths.some(p => subPath.startsWith(p));

  // Protect admin routes
  const isAdminRoute = subPath.startsWith('/admin');

  if (isCustomerProtected || isAdminRoute) {
    const authToken = request.cookies.get('portal-auth-token')?.value;

    if (!authToken) {
      const locale = localeMatch?.[1] || routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    try {
      const user = JSON.parse(authToken);

      if (isAdminRoute && user.role !== 'admin') {
        const locale = localeMatch?.[1] || routing.defaultLocale;
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
      }
    } catch {
      const locale = localeMatch?.[1] || routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|zh)/:path*'],
};
