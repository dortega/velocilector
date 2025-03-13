'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import ProtectedRoute from '../components/ProtectedRoute';
import LanguageDropdown from '../components/LanguageDropdown';
import UserProfile from './profile/components/UserProfile';
import SidebarMenu from './components/SidebarMenu';
import LogoutIcon from '@mui/icons-material/Logout';

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
      <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
        {/* Navbar - adaptado para móvil */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-10 lg:left-64">
          <div className="flex justify-between items-center h-full px-4">
            {/* Logo en móvil */}
            <div className="text-xl font-light tracking-wide text-green-800">
              velocilector
            </div>
            
            {/* Selector de idioma */}
            <LanguageDropdown />
          </div>
        </div>

        {/* Sidebar Menu Component */}
        <SidebarMenu 
          onLogout={handleLogout}
          onProfileClick={() => setIsProfileOpen(true)}
        />

        {/* Main Content - adaptado para móvil */}
        <div className="pt-16 px-4 pb-8 lg:ml-64 lg:px-8">
          {children}
        </div>

        {/* Profile Modal */}
        <dialog id="profile_modal" className={`modal ${isProfileOpen ? 'modal-open' : ''}`}>
          <div className="modal-box max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{t('profile.title')}</h3>
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="py-4">
              <UserProfile isModal={true} />
            </div>
            <div className="mt-6">
              <button 
                className="btn bg-red-500 hover:bg-red-600 text-white border-none w-full"
                onClick={() => {
                  setIsProfileOpen(false);
                  handleLogout();
                }}
              >
                <LogoutIcon className="mr-2" />
                {t('nav.logout')}
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