'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LanguageDropdown from './LanguageDropdown';
import { useState } from 'react';

export default function Navbar() {
  const t = useTranslations('nav');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="navbar bg-transparent absolute top-0 z-10 text-white px-4">
        {/* Desktop Menu */}
        <div className="hidden md:flex w-full items-center">
          <div className="flex-1">
            <Link href="/" className="text-xl font-light tracking-wide hover:text-green-100">
              velocilector
            </Link>
          </div>
          
          <div className="flex-none mx-auto">
            <ul className="menu menu-horizontal px-1 space-x-4">
              <li><Link href="#about">{t('about')}</Link></li>
              <li><Link href="#benefits">{t('benefits')}</Link></li>
            </ul>
          </div>
          
          <div className="flex-1 flex justify-end items-center gap-4">
            <LanguageDropdown isDark={true} />
            <Link 
              href="/platform/dashboard" 
              className="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-green-800"
            >
              {t('dashboard')}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex w-full items-center">
          <div className="flex-1">
            <Link href="/" className="text-xl font-light tracking-wide">
              velocilector
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageDropdown isDark={true} />
            <button 
              className="btn btn-ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 bg-green-800 z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-200 ease-in-out`}>
        <div className="flex justify-end p-4">
          <button 
            className="btn btn-ghost text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col items-center space-y-4 p-4 text-white">
          <li><Link href="#about" onClick={() => setIsMenuOpen(false)}>{t('about')}</Link></li>
          <li><Link href="#benefits" onClick={() => setIsMenuOpen(false)}>{t('benefits')}</Link></li>
          <li>
            <Link 
              href="/platform/dashboard" 
              className="btn btn-outline border-white text-white hover:bg-white hover:text-green-800"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('dashboard')}
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
} 