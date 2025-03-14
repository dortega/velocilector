import { NextResponse } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'es'];
const defaultLocale = 'es';

// Función para obtener el locale preferido
function getLocale(request) {
  const negotiatorHeaders = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, locales, defaultLocale);
}

// Rutas de archivos estáticos que deben ser accesibles sin modificación
const staticPaths = [
  '/images',
  '/fonts',
  '/favicon.ico',
  '/_next',
  '/api',
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Verificar si es una ruta de archivo estático
  if (staticPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Verificar si la URL ya tiene un locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // Redirigir si no tiene locale
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    
    // Mantener los parámetros de búsqueda
    newUrl.search = request.nextUrl.search;
    
    return NextResponse.redirect(newUrl);
  }
  
  // Si ya tiene locale, continuar con la solicitud
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 