'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { authService } from '@/services/auth';

export default function UserProfile({ isModal = false }) {
  const t = useTranslations('platform.profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser({
            email: userData.email,
            createdAt: new Date(userData.created_at).toLocaleDateString(),
            id: userData.id,
            lastSignIn: userData.last_sign_in_at 
              ? new Date(userData.last_sign_in_at).toLocaleDateString() 
              : null
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4">
        <p className="text-gray-600">{t('noUserData')}</p>
      </div>
    );
  }

  // Contenido del perfil
  const profileContent = (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600">{t('email')}</p>
        <p className="font-medium">{user.email}</p>
      </div>
      
      <div>
        <p className="text-sm text-gray-600">{t('memberSince')}</p>
        <p className="font-medium">{user.createdAt}</p>
      </div>
      
      {user.lastSignIn && (
        <div>
          <p className="text-sm text-gray-600">{t('lastLogin')}</p>
          <p className="font-medium">{user.lastSignIn}</p>
        </div>
      )}
      
      <div>
        <p className="text-sm text-gray-600">{t('userId')}</p>
        <p className="font-medium text-xs truncate">{user.id}</p>
      </div>
    </div>
  );

  // Si es un modal, devolvemos solo el contenido
  if (isModal) {
    return profileContent;
  }

  // Si es una página completa, añadimos título y estructura
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
      {profileContent}
    </div>
  );
} 