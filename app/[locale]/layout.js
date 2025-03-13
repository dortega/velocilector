import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import '../globals.css';

const locales = ['en', 'es'];

async function getMessages(locale) {
  try {
    if (!locales.includes(locale)) notFound();
    const messages = (await import(`../../messages/${locale}.json`)).default;
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
  const paramsLocale = await params;
  
  if (!paramsLocale) {
    notFound();
  }
  const locale = paramsLocale.locale;
  
  
  if (!locale) {
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