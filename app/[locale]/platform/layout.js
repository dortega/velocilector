'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import ProtectedRoute from '../components/ProtectedRoute';
import LanguageDropdown from '../components/LanguageDropdown';
import UserProfile from './profile/components/UserProfile';

export default function PlatformLayout({ children }) {
  const t = useTranslations('platform');
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await authService.logout();
    if (!error) {
      router.push('/');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <div className="fixed top-0 right-0 left-64 h-16 bg-white border-b z-10">
          <div className="flex justify-end items-center h-full px-4">
            <LanguageDropdown />
          </div>
        </div>

        {/* Sidebar */}
        <div className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b">
              <Link href="/platform" className="text-xl font-light tracking-wide text-green-800">
                velocilector
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/platform/dashboard" 
                    className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    {t('nav.progress')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/platform/jugadores" 
                    className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {t('nav.jugadores')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/play" 
                    className="flex items-center p-2 text-gray-700 rounded hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('nav.play')}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* User Section */}
            <div className="border-t p-4">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center w-full p-2 text-gray-700 rounded hover:bg-gray-100"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t('nav.profile')}
              </button>

              <button 
                onClick={handleLogout}
                className="flex items-center w-full p-2 text-gray-700 rounded hover:bg-gray-100 mt-2"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 pt-16 p-8">
          {children}
        </div>

        {/* Profile Modal */}
        <dialog id="profile_modal" className={`modal ${isProfileOpen ? 'modal-open' : ''}`}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">{t('profile.title')}</h3>
            <div className="py-4">
              <UserProfile isModal={true} />
            </div>
            <div className="modal-action">
              <button 
                className="btn"
                onClick={() => setIsProfileOpen(false)}
              >
                {t('profile.close')}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsProfileOpen(false)}>close</button>
          </form>
        </dialog>
      </div>
    </ProtectedRoute>
  );
} 