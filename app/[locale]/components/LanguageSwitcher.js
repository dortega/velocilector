'use client';
import {useLocale} from 'next-intl';
import Link from 'next/link';

export default function LanguageSwitcher() {
  const locale = useLocale();
  
  return (
    <div className="flex items-center space-x-2">
      <Link 
        href="/es" 
        locale="es" 
        className={`opacity-${locale === 'es' ? '100' : '50'} hover:opacity-100`}
      >
        <span className="text-xl" title="Español">🇪🇸</span>
      </Link>
      <Link 
        href="/en" 
        locale="en" 
        className={`opacity-${locale === 'en' ? '100' : '50'} hover:opacity-100`}
      >
        <span className="text-xl" title="English">🇬🇧</span>
      </Link>
    </div>
  );
} 