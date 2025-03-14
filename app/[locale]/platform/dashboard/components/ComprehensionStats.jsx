'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import StatCard from './ui/StatCard';
import GameTable from './ui/GameTable';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';

export default function ComprehensionStats({ stats, isLoading }) {
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
    { 
      key: 'score', 
      label: t('score'), 
      render: (game) => `${game.score}%` 
    },
    { 
      key: 'correctAnswers', 
      label: t('correctAnswers'), 
      render: (game) => `${game.correctAnswers}/${game.totalQuestions}` 
    },
    { 
      key: 'readingTime', 
      label: t('readingTime'), 
      render: (game) => `${(game.readingTime / 1000).toFixed(1)} ${t('seconds')}` 
    }
  ];
  
  // Datos para el gráfico de línea
  const chartData = {
    labels: progressData.map(item => item.date),
    datasets: [
      {
        label: t('score'),
        data: progressData.map(item => item.score),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3
      }
    ]
  };
  
  // Datos para el gráfico circular
  const pieData = {
    labels: [t('correctAnswers'), t('incorrectAnswers')],
    datasets: [
      {
        data: [
          playerStats.averageScore, 
          100 - playerStats.averageScore
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Formatear tiempo total en minutos
  const totalReadingTimeMinutes = Math.round(playerStats.totalReadingTime / 60000);
  
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
          title={t('totalQuestions')} 
          value={playerStats.totalQuestions} 
          icon="❓" 
          color="blue"
        />
        <StatCard 
          title={t('averageScore')} 
          value={`${playerStats.averageScore}%`} 
          icon="📊" 
          color="yellow"
        />
        <StatCard 
          title={t('bestScore')} 
          value={`${playerStats.bestScore}%`} 
          icon="🏆" 
          color="purple"
        />
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de progreso */}
        {progressData.length > 1 && (
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h3 className="card-title">{t('scoreProgress')}</h3>
              <div className="h-64">
                <LineChart data={chartData} />
              </div>
            </div>
          </div>
        )}
        
        {/* Gráfico circular de aciertos */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title">{t('accuracyDistribution')}</h3>
            <div className="h-64 flex items-center justify-center">
              <PieChart data={pieData} />
            </div>
          </div>
        </div>
      </div>
      
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