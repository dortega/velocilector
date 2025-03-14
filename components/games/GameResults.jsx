'use client';
import { useTranslations } from 'next-intl';

export default function GameResults({
  shouldSaveProgress,
  stats,
  onNewGame,
  onPlayAgain
}) {
  const t = useTranslations();
  
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">{t('play.gameCompleted')}</h2>
      
      <div className="stats bg-base-200 shadow mb-6">
        {stats.map((stat, index) => (
          <div className="stat" key={index}>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>
      
      {/* CTA para usuarios no registrados */}
      {!shouldSaveProgress && (
        <div className="alert bg-green-50 border-green-200 mb-6 w-full max-w-md">
          <div className="flex flex-col items-center text-center w-full">
            <span className="font-bold text-lg">{t('play.enjoyedGame')}</span>
            <span>{t('play.registerToSave')}</span>
            <a href="/auth/register" className="btn bg-green-600 hover:bg-green-700 text-white mt-3">
              {t('auth.registerAction')}
            </a>
          </div>
        </div>
      )}
      
      <div className="flex gap-3">
        <button 
          className="btn btn-outline border-green-600 text-green-600 hover:bg-green-50" 
          onClick={onNewGame}
        >
          {t('play.newGame')}
        </button>
        
        <button 
          className="btn bg-green-600 hover:bg-green-700 text-white" 
          onClick={onPlayAgain}
        >
          {t('play.playAgain')}
        </button>
      </div>
    </div>
  );
} 