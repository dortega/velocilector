import createIntlMiddleware from 'next-intl/middleware';

const locales = ['en', 'es'];

// Middleware de internacionalización
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'es'
});

export function middleware(request) {
  // Aplicar el middleware de internacionalización a todas las rutas
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Excluir archivos estáticos y API routes
    '/((?!api|_next/static|_next/image|favicon.ico|icons|apple-touch-icon.png|manifest.json).*)',
  ],
}; 