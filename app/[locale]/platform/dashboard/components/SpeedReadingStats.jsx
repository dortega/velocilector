'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import StatCard from './ui/StatCard';
import GameTable from './ui/GameTable';
import LineChart from './charts/LineChart';

export default function SpeedReadingStats({ stats, isLoading }) {
  const t = useTranslations('platform.dashboard');
  
  if (isLoading) {
    return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;
  }
  
  if (!stats || !stats.playerStats) {
    return <div className="text-center p-8 text-gray-500">{t('noStatsAvailable')}</div>;
  }
  
  const { playerStats, progressData, recentGames } = stats;
  
  // Columnas para la tabla de juegos recientes
  const columns = [
    { key: 'date', label: t('date') },
    { key: 'level', label: t('level'), render: (game) => t(`levels.${game.level}`) },
    { key: 'wordCount', label: t('wordCount') },
    { 
      key: 'speed', 
      label: t('speed'), 
      render: (game) => `${game.speed} ${t('wpm')}` 
    },
    { 
      key: 'totalTime', 
      label: t('totalTime'), 
      render: (game) => `${(game.totalTime / 1000).toFixed(1)} ${t('seconds')}` 
    }
  ];
  
  // Datos para el gráfico de línea
  const chartData = {
    labels: progressData.map(item => item.date),
    datasets: [
      {
        label: t('speed'),
        data: progressData.map(item => item.speed),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3
      }
    ]
  };
  
  // Formatear tiempo total en minutos
  const totalTimeMinutes = Math.round(playerStats.totalTime / 60000);
  
  return (
    <div className="space-y-8">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={t('totalGames')} 
          value={playerStats.totalGames} 
          icon="🎮" 
          color="green"
        />
        <StatCard 
          title={t('totalWords')} 
          value={playerStats.totalWords} 
          icon="📝" 
          color="blue"
        />
        <StatCard 
          title={t('averageSpeed')} 
          value={`${playerStats.averageSpeed} ${t('wpm')}`} 
          icon="⚡" 
          color="yellow"
        />
        <StatCard 
          title={t('bestSpeed')} 
          value={`${playerStats.bestSpeed} ${t('wpm')}`} 
          icon="🏆" 
          color="purple"
        />
      </div>
      
      {/* Gráfico de progreso */}
      {progressData.length > 1 && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title">{t('speedProgress')}</h3>
            <div className="h-64">
              <LineChart data={chartData} />
            </div>
          </div>
        </div>
      )}
      
      {/* Tabla de juegos recientes */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title">{t('recentGames')}</h3>
          <GameTable 
            games={recentGames} 
            columns={columns} 
            emptyMessage={t('noGamesPlayed')}
          />
        </div>
      </div>
    </div>
  );
} 