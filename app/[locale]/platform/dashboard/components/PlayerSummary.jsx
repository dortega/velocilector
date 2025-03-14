import { useTranslations } from 'next-intl';

export default function PlayerSummary({ player, speedStats, compStats }) {
  const t = useTranslations('platform.dashboard');
  
  if (!player) {
    return null;
  }
  
  // Obtener el nivel textual
  const getLevelText = (level) => {
    switch(level) {
      case 1:
      case 2:
        return 'beginner';
      case 3:
      case 4:
        return 'elementary';
      case 5:
      case 6:
        return 'intermediate';
      case 7:
      case 8:
        return 'advanced';
      case 9:
      case 10:
        return 'expert';
      default:
        return 'beginner';
    }
  };
  
  const levelText = getLevelText(player.reading_level || 1);
  
  // Calcular estadísticas generales
  const totalGames = 
    (speedStats?.playerStats?.totalGames || 0) + 
    (compStats?.playerStats?.totalGames || 0);
  
  const totalTime = 
    (speedStats?.playerStats?.totalTime || 0) + 
    (compStats?.playerStats?.totalReadingTime || 0);
  
  // Formatear tiempo total
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    
    return minutes > 0 
      ? `${minutes}m ${seconds}s` 
      : `${seconds}s`;
  };
  
  return (
    <div className="card bg-base-100 shadow-md mb-8">
      <div className="card-body">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Avatar o inicial */}
          <div className="avatar">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-3xl font-bold text-green-600">
              {player.avatar_url ? (
                <img src={player.avatar_url} alt={player.name} />
              ) : (
                player.name.charAt(0).toUpperCase()
              )}
            </div>
          </div>
          
          {/* Información del jugador */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{player.name}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="badge badge-lg bg-green-100 text-green-800 font-medium">
                {t(`levels.${levelText}`)}
              </span>
              {player.age && (
                <span className="badge badge-lg bg-blue-100 text-blue-800 font-medium">
                  {player.age} {t('yearsOld')}
                </span>
              )}
              <span className="badge badge-lg bg-purple-100 text-purple-800 font-medium">
                {player.language || 'es'}
              </span>
            </div>
          </div>
          
          {/* Estadísticas generales */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 md:mt-0">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totalGames}</div>
              <div className="text-sm text-gray-500">{t('totalGames')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {speedStats?.playerStats?.totalWords || 0}
              </div>
              <div className="text-sm text-gray-500">{t('wordsRead')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {formatTime(totalTime)}
              </div>
              <div className="text-sm text-gray-500">{t('totalTime')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 