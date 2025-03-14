'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import SettingsIcon from '@mui/icons-material/Settings';

// Crear un contexto para compartir el estado del juego entre componentes
export const GameContext = createContext();

export default function PlayLayout({ children }) {
  const t = useTranslations();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [gameConfig, setGameConfig] = useState(null);
  
  // Función para salir del juego
  const exitGame = () => {
    router.push('/platform');
  };
  
  // Función para reiniciar el juego actual
  const restartGame = () => {
    // Cerrar el modal de configuración
    setShowSettings(false);
    
    // Enviar evento para reiniciar el juego (será capturado por el componente del juego)
    window.dispatchEvent(new CustomEvent('game:restart'));
  };
  
  // Función para iniciar un nuevo juego
  const newGame = () => {
    setIsConfiguring(true);
    setShowSettings(false);
    
    // Enviar evento para volver a la configuración
    window.dispatchEvent(new CustomEvent('game:newConfig'));
  };
  
  // Valores del contexto
  const contextValue = {
    isConfiguring,
    setIsConfiguring,
    gameConfig,
    setGameConfig
  };

  return (
    <GameContext.Provider value={contextValue}>
      <div className="h-screen w-screen flex flex-col bg-base-100 relative">
        {/* Barra superior con botón de configuración (solo visible durante el juego) */}
        <div className="w-full p-4 flex justify-between items-center">
          {!isConfiguring && (
            <button 
              onClick={() => setShowSettings(true)}
              className="btn btn-circle bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <SettingsIcon />
            </button>
          )}
          
          <div className="flex-grow"></div>
          
          <div className="w-10"></div> {/* Espacio para equilibrar el layout */}
        </div>
        
        {/* Área principal del juego */}
        <div className="flex-grow flex items-center justify-center">
          {children}
        </div>
        
        {/* Overlay de configuración (se muestra/oculta con showSettings) */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">{t('play.settings')}</h2>
              
              <div className="space-y-4">
                <button 
                  className="btn bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={restartGame}
                >
                  {t('play.restartGame')}
                </button>
                
                <button 
                  className="btn bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={newGame}
                >
                  {t('play.newGame')}
                </button>
                
                <button 
                  className="btn btn-outline border-green-600 text-green-600 hover:bg-green-50 w-full"
                  onClick={() => setShowSettings(false)}
                >
                  {t('play.back')}
                </button>
                
                <button 
                  className="btn btn-outline border-red-600 text-red-600 hover:bg-red-50 w-full"
                  onClick={exitGame}
                >
                  {t('play.exit')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameContext.Provider>
  );
} 