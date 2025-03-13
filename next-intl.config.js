// Definimos los idiomas soportados
const locales = ['en', 'es'];

export default async function config() {
  return {
    defaultLocale: 'es',
    locales: locales,
    messages: {
      es: (await import('./messages/es.json')).default,
      en: (await import('./messages/en.json')).default
    },
    locale: 'es', // Cambiado a español
    timeZone: 'Europe/Madrid',
    now: new Date()
  };
} 