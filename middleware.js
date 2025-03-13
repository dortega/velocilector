import createIntlMiddleware from 'next-intl/middleware';

const locales = ['en', 'es'];

// Simplificamos el middleware para que solo maneje la internacionalización
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'es',
  localePrefix: 'always'
});

export default intlMiddleware;

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
} 