'use client';
import { useTranslations } from 'next-intl';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

export default function ReadingLevelSelector({ value, onChange }) {
  const t = useTranslations();
  
  // Mapeo de niveles de lectura con iconos y colores
  const readingLevels = [
    { 
      value: 'beginner', 
      label: t('players.readingLevels.beginner'), 
      icon: <MenuBookIcon />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    { 
      value: 'elementary', 
      label: t('players.readingLevels.elementary'), 
      icon: <AutoStoriesIcon />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-200'
    },
    { 
      value: 'intermediate', 
      label: t('players.readingLevels.intermediate'), 
      icon: <SchoolIcon />,
      color: 'text-blue-700',
      bgColor: 'bg-blue-300'
    },
    { 
      value: 'advanced', 
      label: t('players.readingLevels.advanced'), 
      icon: <PsychologyIcon />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-300'
    },
    { 
      value: 'expert', 
      label: t('players.readingLevels.expert'), 
      icon: <EmojiObjectsIcon />,
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-400'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 gap-3">
      {readingLevels.map(level => {
        const isSelected = value === level.value;
        
        return (
          <div 
            key={level.value}
            onClick={() => onChange(level.value)}
            className={`cursor-pointer border-2 rounded-lg p-3 flex items-center ${
              isSelected ? 'border-primary bg-primary/10' : 'border-base-300'
            }`}
          >
            <div className={`w-12 h-12 rounded-full ${level.bgColor} flex items-center justify-center mr-4`}>
              <span className={level.color}>
                {level.icon}
              </span>
            </div>
            <div>
              <div className="font-medium">{level.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 