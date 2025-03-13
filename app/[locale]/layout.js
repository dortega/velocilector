import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import '../globals.css';

const locales = ['en', 'es'];

async function getMessages(locale) {
  try {
    if (!locales.includes(locale)) notFound();
    console.log('🔍 Intentando cargar mensajes para locale:', locale);
    const messages = (await import(`../../messages/${locale}.json`)).default;
    console.log('✅ Mensajes cargados:', JSON.stringify(messages, null, 2));
    return messages;
  } catch (error) {
    console.error('❌ Error cargando mensajes:', error);
    notFound();
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  console.log('📍 Params recibidos:', params);
  const paramsLocale = await params;
  
  if (!paramsLocale) {
    console.log('⚠️ No se encontró paramsLocale');
    notFound();
  }
  const locale = paramsLocale.locale;
  
  console.log('🌐 Locale final:', locale);
  
  if (!locale) {
    console.log('⚠️ No se encontró locale');
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <html lang={locale} data-theme="light">
      <body>
        <NextIntlClientProvider 
          locale={locale} 
          messages={messages}
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 