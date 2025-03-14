'use client';
import { useState, useEffect, useContext } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { playersService } from '@/services/players';
import ReadingLevelSelector from '@/components/players/ReadingLevelSelector';
import PlayerSelector from '@/components/players/PlayerSelector';
import GameSelector from '@/components/games/GameSelector';
import SpeedReadingGame from '@/components/games/SpeedReadingGame';
import ComprehensionGame from '@/components/games/ComprehensionGame';
import { GameContext } from './layout';

export default function PlayPage() {
  const t = useTranslations();
  const router = useRouter();
  const { isConfiguring, setIsConfiguring } = useContext(GameContext);
  
  // Estados de autenticación
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPlayers, setHasPlayers] = useState(false);
  
  // Estados para la configuración del juego
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [readingLevel, setReadingLevel] = useState('beginner');
  const [selectedGame, setSelectedGame] = useState('');
  const [configStep, setConfigStep] = useState(1); // 1: Jugador/Nivel, 2: Juego
  
  // Verificar sesión de usuario y jugadores disponibles
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        // Intentar obtener el usuario actual
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        
        // Si hay usuario, verificar si tiene jugadores
        if (currentUser) {
          const playersList = await playersService.getPlayers();
          setHasPlayers(playersList && playersList.length > 0);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Si hay un error, simplemente establecer el usuario como null
        // No es un error crítico, solo significa que no hay sesión
        setUser(null);
        setHasPlayers(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Escuchar eventos para reiniciar la configuración
  useEffect(() => {
    const handleNewConfig = () => {
      setIsConfiguring(true);
      setConfigStep(1);
      setSelectedGame('');
    };
    
    window.addEventListener('game:newConfig', handleNewConfig);
    
    return () => {
      window.removeEventListener('game:newConfig', handleNewConfig);
    };
  }, [setIsConfiguring]);
  
  // Función para iniciar el juego
  const startGame = () => {
    setIsConfiguring(false);
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
              {user && hasPlayers ? t('play.selectPlayer') : t('play.selectLevel')}
            </h3>
            
            {user && hasPlayers ? (
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
                className="btn btn-outline border-red-600 text-red-600 hover:bg-red-50" 
                onClick={exitGame}
              >
                {t('play.exit')}
              </button>
              <button 
                className="btn bg-green-600 hover:bg-green-700 text-white" 
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
              <button className="btn btn-outline border-green-600 text-green-600 hover:bg-green-50" onClick={prevStep}>
                {t('back')}
              </button>
              <button 
                className="btn bg-green-600 hover:bg-green-700 text-white" 
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
    const playerId = selectedPlayer?.id || null;
    const shouldSaveProgress = !!user && !!playerId;
    
    switch (selectedGame) {
      case 'speed':
        return <SpeedReadingGame 
          level={level} 
          playerId={playerId} 
          shouldSaveProgress={shouldSaveProgress} 
        />;
      case 'comprehension':
        return <ComprehensionGame 
          level={level} 
          playerId={playerId} 
          shouldSaveProgress={shouldSaveProgress} 
        />;
      default:
        return (
          <div className="text-center">
            <div className="text-2xl">{t('play.noGameSelected')}</div>
            <button 
              className="btn bg-green-600 hover:bg-green-700 text-white mt-4" 
              onClick={() => setIsConfiguring(true)}
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
        <span className="loading loading-spinner loading-lg text-green-600"></span>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full flex items-center justify-center">
      {isConfiguring ? (
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