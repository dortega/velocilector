'use client';
import { useTranslations } from 'next-intl';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import LockIcon from '@mui/icons-material/Lock';

export default function ReadingLevelSelector({ value, onChange }) {
  const t = useTranslations();
  
  // Mapeo de niveles de lectura con iconos y colores
  const readingLevels = [
    { 
      value: 'beginner', 
      label: t('players.readingLevels.beginner'), 
      icon: <MenuBookIcon />,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      enabled: true
    },
    { 
      value: 'elementary', 
      label: t('players.readingLevels.elementary'), 
      icon: <AutoStoriesIcon />,
      color: 'text-green-600',
      bgColor: 'bg-green-200',
      enabled: true
    },
    { 
      value: 'intermediate', 
      label: t('players.readingLevels.intermediate'), 
      icon: <SchoolIcon />,
      color: 'text-green-700',
      bgColor: 'bg-green-300',
      enabled: false
    },
    { 
      value: 'advanced', 
      label: t('players.readingLevels.advanced'), 
      icon: <PsychologyIcon />,
      color: 'text-green-600',
      bgColor: 'bg-green-300',
      enabled: false
    },
    { 
      value: 'expert', 
      label: t('players.readingLevels.expert'), 
      icon: <EmojiObjectsIcon />,
      color: 'text-green-700',
      bgColor: 'bg-green-400',
      enabled: false
    }
  ];
  
  return (
    <div className="grid grid-cols-1 gap-3">
      {readingLevels.map(level => {
        const isSelected = value === level.value;
        const isDisabled = !level.enabled;
        
        return (
          <div 
            key={level.value}
            onClick={() => level.enabled && onChange(level.value)}
            className={`cursor-pointer border-2 rounded-lg p-3 flex items-center ${
              isDisabled ? 'opacity-60 cursor-not-allowed' : 
              isSelected ? 'border-green-600 bg-green-50' : 'border-base-300 hover:bg-green-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-full ${level.bgColor} flex items-center justify-center mr-4`}>
              <span className={level.color}>
                {isDisabled ? <LockIcon /> : level.icon}
              </span>
            </div>
            <div className="flex-1">
              <div className="font-medium">{level.label}</div>
              {isDisabled && (
                <div className="text-xs text-gray-500">
                  {t('players.levelLocked')}
                </div>
              )}
            </div>
            {isDisabled && (
              <div className="ml-2 text-gray-400">
                <LockIcon fontSize="small" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 