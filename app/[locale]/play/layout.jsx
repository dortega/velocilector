'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SettingsIcon from '@mui/icons-material/Settings';

export default function PlayLayout({ children }) {
  const t = useTranslations();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-base-100 relative">
      {/* Barra superior con contador/progreso y botón de configuración */}
      <div className="w-full p-4 flex justify-between items-center">
        <button 
          onClick={() => setShowSettings(true)}
          className="btn btn-circle btn-ghost"
        >
          <SettingsIcon />
        </button>
        
        <div className="progress-container w-1/2">
          <div className="progress w-full"></div>
        </div>
        
        <div className="w-10"></div> {/* Espacio para equilibrar el layout */}
      </div>
      
      {/* Área principal del juego */}
      <div className="flex-grow flex items-center justify-center">
        {children}
      </div>
      
      {/* Overlay de configuración (se muestra/oculta con showSettings) */}
      {showSettings && (
        <div className="absolute inset-0 bg-base-300 bg-opacity-90 z-50 flex items-center justify-center">
          <div className="bg-base-100 rounded-lg shadow-xl p-6 w-11/12 max-w-md">
            <h2 className="text-2xl font-bold mb-4">{t('play.settings')}</h2>
            {/* El contenido del popup se renderizará en la página */}
          </div>
        </div>
      )}
    </div>
  );
} 