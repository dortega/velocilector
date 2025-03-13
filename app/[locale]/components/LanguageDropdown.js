'use client';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function LanguageDropdown({ isDark = false }) {
  const t = useTranslations('platform.language');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Determinar el idioma actual basado en la URL
  const currentLocale = pathname.startsWith('/es') ? 'es' : 'en';
  
  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Obtener la URL para el cambio de idioma
  const getLanguageUrl = (locale) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  // Color del texto basado en si es oscuro o claro
  const textColor = isDark ? 'text-white' : 'text-gray-700';
  const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100';
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className={`flex items-center gap-2 p-2 rounded-md ${hoverBg} ${textColor}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('select')}
      >
        <span className="text-lg font-medium">
          {currentLocale === 'es' ? '🇪🇸' : '🇬🇧'}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-50">
          <div className="py-1">
            <Link 
              href={getLanguageUrl('es')}
              className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 ${currentLocale === 'es' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg">🇪🇸</span>
              <span>Español</span>
            </Link>
            <Link 
              href={getLanguageUrl('en')}
              className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 ${currentLocale === 'en' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg">🇬🇧</span>
              <span>English</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 