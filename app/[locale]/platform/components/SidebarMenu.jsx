'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

export default function SidebarMenu({ onLogout, onProfileClick, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const t = useTranslations('platform');
  const pathname = usePathname();
  
  // Cerrar el menú móvil cuando se cambia de ruta
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname, isMobileMenuOpen, setIsMobileMenuOpen]);

  // Determinar si un enlace está activo
  const isActive = (path) => {
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Sidebar para escritorio */}
      <div className="fixed top-0 left-0 h-full bg-white shadow-lg z-30 w-64 hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <Link href="/platform" className="text-xl font-light tracking-wide text-green-800">
              velocilector
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/platform" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    pathname === '/platform' 
                      ? 'bg-green-50 text-green-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <HomeIcon className="mr-3" />
                  {t('nav.dashboard')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/platform/jugadores" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive('/platform/jugadores') 
                      ? 'bg-green-50 text-green-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <PeopleIcon className="mr-3" />
                  {t('nav.players')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/platform/jugar" 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive('/platform/jugar') 
                      ? 'bg-green-50 text-green-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <SportsEsportsIcon className="mr-3" />
                  {t('nav.play')}
                </Link>
              </li>
            </ul>
          </nav>

          {/* User Section */}
          <div className="border-t p-4">
            <button 
              onClick={onProfileClick}
              className="flex items-center w-full p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <AccountCircleIcon className="mr-3" />
              {t('nav.profile')}
            </button>

            <button 
              onClick={onLogout}
              className="flex items-center w-full p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors mt-2"
            >
              <LogoutIcon className="mr-3" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Tabbar para móvil */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-30 lg:hidden">
        <div className="flex justify-around items-center h-16">
          <Link 
            href="/platform" 
            className={`flex flex-col items-center justify-center flex-1 py-2 ${
              pathname === '/platform' ? 'text-green-600' : 'text-gray-600'
            }`}
          >
            <HomeIcon fontSize="small" />
            <span className="text-xs mt-1">{t('nav.dashboard')}</span>
          </Link>
          
          <Link 
            href="/platform/jugadores" 
            className={`flex flex-col items-center justify-center flex-1 py-2 ${
              isActive('/platform/jugadores') ? 'text-green-600' : 'text-gray-600'
            }`}
          >
            <PeopleIcon fontSize="small" />
            <span className="text-xs mt-1">{t('nav.players')}</span>
          </Link>
          
          <Link 
            href="/platform/jugar" 
            className={`flex flex-col items-center justify-center flex-1 py-2 ${
              isActive('/platform/jugar') ? 'text-green-600' : 'text-gray-600'
            }`}
          >
            <SportsEsportsIcon fontSize="small" />
            <span className="text-xs mt-1">{t('nav.play')}</span>
          </Link>
          
          <button 
            onClick={onProfileClick}
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600"
          >
            <AccountCircleIcon fontSize="small" />
            <span className="text-xs mt-1">{t('nav.profile')}</span>
          </button>
        </div>
      </div>
    </>
  );
} 