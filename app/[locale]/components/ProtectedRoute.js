'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { user, error } = await authService.getCurrentUser();
      
      console.log('Auth check result:', { user, error });
      
      if (user) {
        setIsAuthenticated(true);
      } else {
        // Redirigir a login si no hay usuario
        router.push('/auth/login');
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router]);

  // Mostrar un indicador de carga mientras verificamos la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido
  return isAuthenticated ? children : null;
} 