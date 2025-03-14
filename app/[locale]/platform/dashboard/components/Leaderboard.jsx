import { useTranslations } from 'next-intl';
import TabPanel from './ui/TabPanel';

export default function Leaderboard({ leaderboardData, isLoading }) {
  const t = useTranslations('platform.dashboard');
  
  if (isLoading) {
    return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;
  }
  
  if (!leaderboardData) {
    return <div className="text-center p-8 text-gray-500">{t('noLeaderboardData')}</div>;
  }
  
  const { level, speedLeaders, comprehensionLeaders } = leaderboardData;
  
  // Renderizar tabla de líderes
  const renderLeaderTable = (leaders, type) => {
    if (leaders.length === 0) {
      return <div className="text-center py-4 text-gray-500">{t('noLeadersYet')}</div>;
    }
    
    return (
      <table className="table w-full">
        <thead>
          <tr>
            <th className="w-16">{t('position')}</th>
            <th>{t('player')}</th>
            <th>
              {type === 'speed' ? t('bestSpeed') : t('bestScore')}
            </th>
            <th>{t('gamesPlayed')}</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader) => (
            <tr key={leader.playerId} className={leader.position === 1 ? 'font-bold bg-green-50' : ''}>
              <td>
                {leader.position === 1 ? '🏆' : `#${leader.position}`}
              </td>
              <td>{leader.playerName}</td>
              <td>
                {type === 'speed' 
                  ? `${leader.bestSpeed} ${t('wpm')}` 
                  : `${leader.bestScore}%`
                }
              </td>
              <td>{leader.totalGames}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  // Contenido de las pestañas
  const tabs = [
    {
      label: t('speedReading'),
      content: renderLeaderTable(speedLeaders, 'speed')
    },
    {
      label: t('comprehension'),
      content: renderLeaderTable(comprehensionLeaders, 'comprehension')
    }
  ];
  
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h3 className="card-title">
          {t('leaderboard')} - {t(`levels.${level}`)}
        </h3>
        <TabPanel tabs={tabs} />
      </div>
    </div>
  );
} 