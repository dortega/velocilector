'use client';
import { useTranslations } from 'next-intl';
import SpeedIcon from '@mui/icons-material/Speed';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function GameSelector({ onSelect, selectedGame, readingLevel }) {
  const t = useTranslations();
  
  const games = [
    {
      id: 'speed',
      title: t('play.games.speedReading'),
      description: t('play.games.speedReadingDesc'),
      icon: <SpeedIcon style={{ fontSize: 40, color: '#16a34a' }} />,
      bgColor: 'bg-green-100'
    },
    {
      id: 'comprehension',
      title: t('play.games.comprehension'),
      description: t('play.games.comprehensionDesc'),
      icon: <MenuBookIcon style={{ fontSize: 40, color: '#16a34a' }} />,
      bgColor: 'bg-green-100'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 gap-4">
      {games.map(game => (
        <div 
          key={game.id}
          onClick={() => onSelect(game.id)}
          className={`cursor-pointer border-2 rounded-lg p-4 flex items-center ${
            selectedGame === game.id ? 'border-green-600 bg-green-50' : 'border-base-300'
          }`}
        >
          <div className={`w-16 h-16 rounded-full ${game.bgColor} flex items-center justify-center mr-4`}>
            {game.icon}
          </div>
          <div>
            <div className="font-medium text-lg">{game.title}</div>
            <div className="text-sm opacity-70">{game.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 