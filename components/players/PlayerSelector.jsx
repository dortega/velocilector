'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { playersService } from '@/services/players';

export default function PlayerSelector({ onSelect, selectedPlayer }) {
  const t = useTranslations();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Función para convertir el nivel numérico a texto
  const getLevelText = (numericLevel) => {
    const level = parseInt(numericLevel) || 1;
    
    if (level <= 2) {
      return 'beginner';
    } else if (level <= 4) {
      return 'elementary';
    } else if (level <= 6) {
      return 'intermediate';
    } else if (level <= 8) {
      return 'advanced';
    } else {
      return 'expert';
    }
  };
  
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const playersList = await playersService.getPlayers();
        setPlayers(playersList);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayers();
  }, []);
  
  if (loading) {
    return <div className="flex justify-center p-4"><span className="loading loading-spinner"></span></div>;
  }
  
  if (players.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="mb-4">{t('players.noPlayersYet')}</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = '/platform/jugadores'}
        >
          {t('players.createPlayer')}
        </button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {players.map(player => {
        const levelText = getLevelText(player.reading_level);
        
        return (
          <div 
            key={player.id}
            onClick={() => onSelect(player)}
            className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center ${
              selectedPlayer?.id === player.id ? 'border-primary bg-primary/10' : 'border-base-300'
            }`}
          >
            <div className="avatar">
              <div className="w-16 h-16 rounded-full">
                <img src={player.avatar_url || '/images/default-avatar.png'} alt={player.name} />
              </div>
            </div>
            <div className="mt-2 text-center">
              <div className="font-medium">{player.name}</div>
              <div className="text-sm opacity-70">
                {t(`players.readingLevels.${levelText}`)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 