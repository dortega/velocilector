'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { authService } from '@/services/auth';
import { playersService } from '@/services/players';
import { dashboardService } from '@/services/dashboard';
import PlayerSelector from './components/PlayerSelector';
import PlayerSummary from './components/PlayerSummary';
import SpeedReadingStats from './components/SpeedReadingStats';
import ComprehensionStats from './components/ComprehensionStats';
import Leaderboard from './components/Leaderboard';
import TabPanel from './components/ui/TabPanel';

export default function DashboardPage() {
  const t = useTranslations('platform.dashboard');
  
  // Estados
  const [user, setUser] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [speedStats, setSpeedStats] = useState(null);
  const [compStats, setCompStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Cargar usuario y jugadores
  useEffect(() => {
    const loadUserAndPlayers = async () => {
      try {
        setLoading(true);
        
        // Obtener usuario actual
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          window.location.href = '/signin';
          return;
        }
        
        setUser(currentUser);
        
        // Obtener jugadores
        const playersList = await playersService.getPlayers();
        setPlayers(playersList);
        
        // Seleccionar el primer jugador por defecto
        if (playersList.length > 0) {
          setSelectedPlayer(playersList[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading user and players:', error);
        setLoading(false);
      }
    };
    
    loadUserAndPlayers();
  }, []);
  
  // Cargar estadísticas cuando se selecciona un jugador
  useEffect(() => {
    const loadPlayerStats = async () => {
      if (!selectedPlayer) return;
      
      try {
        setStatsLoading(true);
        
        // Cargar estadísticas de lectura rápida
        const speedStatsData = await dashboardService.getSpeedReadingStats(selectedPlayer.id);
        setSpeedStats(speedStatsData);
        
        // Cargar estadísticas de comprensión
        const compStatsData = await dashboardService.getComprehensionStats(selectedPlayer.id);
        setCompStats(compStatsData);
        
        // Cargar leaderboard para el nivel del jugador
        const leaderboardData = await dashboardService.getLeaderboard(
          selectedPlayer.reading_level || 1,
          selectedPlayer.language || 'es'
        );
        setLeaderboard(leaderboardData);
        
        setStatsLoading(false);
      } catch (error) {
        console.error('Error loading player stats:', error);
        setStatsLoading(false);
      }
    };
    
    loadPlayerStats();
  }, [selectedPlayer]);
  
  // Manejar selección de jugador
  const handleSelectPlayer = useCallback((playerId) => {
    const player = players.find(p => p.id === playerId);
    setSelectedPlayer(player);
  }, [players]);
  
  // Mostrar indicador de carga mientras se cargan los datos iniciales
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  // Contenido de las pestañas
  const tabs = [
    {
      label: t('speedReading'),
      content: <SpeedReadingStats stats={speedStats} isLoading={statsLoading} />
    },
    {
      label: t('comprehension'),
      content: <ComprehensionStats stats={compStats} isLoading={statsLoading} />
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      
      {/* Selector de jugador */}
      <PlayerSelector 
        players={players} 
        onSelectPlayer={handleSelectPlayer} 
        selectedPlayerId={selectedPlayer?.id}
      />
      
      {selectedPlayer ? (
        <>
          {/* Resumen del jugador */}
          <PlayerSummary 
            player={selectedPlayer} 
            speedStats={speedStats} 
            compStats={compStats}
          />
          
          {/* Pestañas de estadísticas */}
          <div className="mb-8">
            <TabPanel tabs={tabs} />
          </div>
          
          {/* Leaderboard */}
          <Leaderboard 
            leaderboardData={leaderboard} 
            isLoading={statsLoading}
          />
        </>
      ) : (
        <div className="text-center p-8 bg-base-100 shadow-md rounded-lg">
          <p className="text-xl text-gray-500">{t('selectPlayerToViewStats')}</p>
        </div>
      )}
    </div>
  );
} 