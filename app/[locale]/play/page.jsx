'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { playersService } from '@/services/players';
import ReadingLevelSelector from '@/components/players/ReadingLevelSelector';
import PlayerSelector from '@/components/players/PlayerSelector';
import GameSelector from '@/components/games/GameSelector';
import SpeedReadingGame from '@/components/games/SpeedReadingGame';
import ComprehensionGame from '@/components/games/ComprehensionGame';

export default function PlayPage() {
  const t = useTranslations();
  const router = useRouter();
  
  // Estados de autenticación
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para la configuración del juego
  const [showConfig, setShowConfig] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [readingLevel, setReadingLevel] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [configStep, setConfigStep] = useState(1); // 1: Jugador/Nivel, 2: Juego
  
  // Verificar sesión de usuario
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Función para iniciar el juego
  const startGame = () => {
    setShowConfig(false);
  };
  
  // Función para volver a la configuración
  const backToConfig = () => {
    setShowConfig(true);
  };
  
  // Función para salir del juego y volver al dashboard
  const exitGame = () => {
    router.push('/platform');
  };
  
  // Avanzar al siguiente paso de configuración
  const nextStep = () => {
    if (configStep < 2) {
      setConfigStep(configStep + 1);
    } else {
      startGame();
    }
  };
  
  // Retroceder al paso anterior
  const prevStep = () => {
    if (configStep > 1) {
      setConfigStep(configStep - 1);
    }
  };
  
  // Renderizar el contenido según el paso actual
  const renderConfigStep = () => {
    switch (configStep) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {user ? t('play.selectPlayer') : t('play.selectLevel')}
            </h3>
            
            {user ? (
              <PlayerSelector 
                onSelect={(player) => setSelectedPlayer(player)} 
                selectedPlayer={selectedPlayer}
              />
            ) : (
              <ReadingLevelSelector 
                value={readingLevel} 
                onChange={(level) => setReadingLevel(level)} 
              />
            )}
            
            <div className="mt-6 flex justify-between">
              <button 
                className="btn btn-outline btn-error" 
                onClick={exitGame}
              >
                {t('play.exit')}
              </button>
              <button 
                className="btn btn-primary" 
                onClick={nextStep}
                disabled={!selectedPlayer && !readingLevel}
              >
                {t('next')}
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('play.selectGame')}</h3>
            
            <GameSelector 
              onSelect={(game) => setSelectedGame(game)}
              selectedGame={selectedGame}
              readingLevel={selectedPlayer?.reading_level || readingLevel}
            />
            
            <div className="mt-6 flex justify-between">
              <button className="btn btn-outline" onClick={prevStep}>
                {t('back')}
              </button>
              <button 
                className="btn btn-primary" 
                onClick={startGame}
                disabled={!selectedGame}
              >
                {t('play.start')}
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Renderizar el juego seleccionado
  const renderGame = () => {
    const level = selectedPlayer?.reading_level || readingLevel;
    
    switch (selectedGame) {
      case 'speed':
        return <SpeedReadingGame level={level} onExit={backToConfig} />;
      case 'comprehension':
        return <ComprehensionGame level={level} onExit={backToConfig} />;
      default:
        return (
          <div className="text-center">
            <div className="text-2xl">{t('play.noGameSelected')}</div>
            <button 
              className="btn btn-primary mt-4" 
              onClick={backToConfig}
            >
              {t('back')}
            </button>
          </div>
        );
    }
  };
  
  // Mostrar indicador de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full flex items-center justify-center">
      {showConfig ? (
        <div className="bg-base-100 rounded-lg shadow-xl p-6 w-11/12 max-w-md">
          <h2 className="text-2xl font-bold mb-4">{t('play.gameSetup')}</h2>
          {renderConfigStep()}
        </div>
      ) : (
        renderGame()
      )}
    </div>
  );
} 