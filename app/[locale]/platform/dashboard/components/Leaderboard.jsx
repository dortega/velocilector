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
  function renderLeaderTable(leaders, type) {
    if (!leaders || leaders.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {t('noLeadersYet')}
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="w-16">{t('position')}</th>
              <th>{t('player')}</th>
              <th className="text-right">
                {type === 'speed' ? t('averageSpeed') : t('bestScore')}
              </th>
              <th className="text-right">{t('gamesPlayed')}</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader) => (
              <tr key={leader.playerId} className={leader.position === 1 ? "bg-amber-50 hover:bg-amber-100" : "hover"}>
                <td className="font-bold">
                  {leader.position === 1 ? (
                    <div className="flex items-center">
                      <span className="text-amber-500 mr-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                        </svg>
                      </span>
                      {leader.position}
                    </div>
                  ) : (
                    leader.position
                  )}
                </td>
                <td>{leader.playerName}</td>
                <td className="text-right font-medium">
                  {type === 'speed' 
                    ? `${leader.averageSpeed} ${t('wpm')}` 
                    : `${leader.bestScore}%`
                  }
                </td>
                <td className="text-right">{leader.totalGames}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
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