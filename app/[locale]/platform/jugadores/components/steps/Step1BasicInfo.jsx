'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import React from 'react';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';

export default function Step1BasicInfo({ playerData, onChange }) {
  const t = useTranslations();
  const [readingLevel, setReadingLevel] = useState('');
  
  // Mapeo de niveles de lectura con colores progresivos
  const readingLevels = [
    { 
      value: 'principiante', 
      label: t('players.beginner'), 
      icon: <MenuBookIcon style={{ fontSize: 40 }} />,
      bgColor: 'bg-blue-100',
      iconColor: '#3b82f6' // blue-500
    },
    { 
      value: 'elemental', 
      label: t('players.elementary'), 
      icon: <AutoStoriesIcon style={{ fontSize: 40 }} />,
      bgColor: 'bg-blue-200',
      iconColor: '#2563eb' // blue-600
    },
    { 
      value: 'intermedio', 
      label: t('players.intermediate'), 
      icon: <SchoolIcon style={{ fontSize: 40 }} />,
      bgColor: 'bg-blue-300',
      iconColor: '#1d4ed8' // blue-700
    },
    { 
      value: 'avanzado', 
      label: t('players.advanced'), 
      icon: <PsychologyIcon style={{ fontSize: 40 }} />,
      bgColor: 'bg-indigo-300',
      iconColor: '#4f46e5' // indigo-600
    },
    { 
      value: 'experto', 
      label: t('players.expert'), 
      icon: <EmojiObjectsIcon style={{ fontSize: 40 }} />,
      bgColor: 'bg-indigo-400',
      iconColor: '#4338ca' // indigo-700
    }
  ];
  
  // Sincronizar el estado local con playerData
  useEffect(() => {
    setReadingLevel(playerData.reading_level);
  }, [playerData.reading_level]);
  
  // Encontrar el índice del nivel actual
  const currentLevelIndex = readingLevels.findIndex(level => level.value === readingLevel);
  
  // Manejar incremento/decremento del nivel
  const handleLevelChange = (direction) => {
    let newIndex;
    
    if (direction === 'decrease') {
      newIndex = Math.max(0, currentLevelIndex - 1);
    } else {
      newIndex = Math.min(readingLevels.length - 1, currentLevelIndex + 1);
    }
    
    const newLevel = readingLevels[newIndex].value;
    setReadingLevel(newLevel);
    
    // Actualizar el estado del padre
    onChange({
      target: {
        name: 'reading_level',
        value: newLevel
      }
    });
  };
  
  // Obtener el nivel actual para mostrar
  const currentLevel = readingLevels.find(level => level.value === readingLevel) || { 
    bgColor: 'bg-gray-100', 
    iconColor: '#9ca3af' // gray-400
  };
  
  return (
    <div className="space-y-6">
      {/* Nombre con estilo mejorado */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">{t('players.name')}</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <PersonIcon style={{ fontSize: 24, color: '#8b5cf6' }} />
            </div>
          </div>
          <input 
            type="text" 
            name="name"
            value={playerData.name}
            onChange={onChange}
            className="input input-bordered w-full pl-16 h-14 text-lg" 
            placeholder={t('players.enterName')}
            required
          />
        </div>
      </div>
      
      {/* Edad con estilo mejorado */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">{t('players.age')}</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <CakeIcon style={{ fontSize: 24, color: '#d97706' }} />
            </div>
          </div>
          <input 
            type="number" 
            name="age"
            min="3"
            max="18"
            value={playerData.age}
            onChange={onChange}
            className="input input-bordered w-full pl-16 h-14 text-lg" 
            placeholder={t('players.enterAge')}
            required
          />
        </div>
      </div>
      
      {/* Nivel de lectura */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">{t('players.readingLevel')}</span>
        </label>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-full mb-2">
            <button 
              type="button"
              onClick={() => handleLevelChange('decrease')}
              disabled={currentLevelIndex <= 0}
              className="btn btn-circle btn-outline"
            >
              <RemoveIcon />
            </button>
            
            <div className="flex flex-col items-center mx-8">
              <div className={`w-20 h-20 rounded-full ${readingLevel ? currentLevel.bgColor : 'bg-gray-100'} flex items-center justify-center mb-2 transition-colors duration-300`}>
                {readingLevel ? 
                  React.cloneElement(currentLevel.icon, { style: { fontSize: 40, color: currentLevel.iconColor } }) : 
                  <MenuBookIcon style={{ fontSize: 40, color: '#9ca3af' }} />
                }
              </div>
              <span className="font-medium text-center">
                {readingLevel ? currentLevel.label : t('players.selectReadingLevel')}
              </span>
            </div>
            
            <button 
              type="button"
              onClick={() => handleLevelChange('increase')}
              disabled={currentLevelIndex >= readingLevels.length - 1 || currentLevelIndex === -1}
              className="btn btn-circle btn-outline"
            >
              <AddIcon />
            </button>
          </div>
          
          {/* Indicador visual de nivel */}
          <div className="w-full max-w-xs flex justify-between mt-2 px-2">
            {readingLevels.map((level, index) => (
              <div 
                key={level.value}
                className={`w-8 h-2 rounded-full ${
                  index <= currentLevelIndex ? level.bgColor : 'bg-gray-200'
                } transition-colors duration-300`}
              />
            ))}
          </div>
          
          {/* Input oculto para mantener la compatibilidad con el formulario */}
          <input 
            type="hidden" 
            name="reading_level"
            value={readingLevel}
            required
          />
        </div>
      </div>
      
      {/* Género */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">{t('players.gender')}</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label 
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
              playerData.gender === 'male' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                : 'border-base-300 hover:border-blue-300'
            }`}
          >
            <input 
              type="radio" 
              name="gender"
              value="male"
              checked={playerData.gender === 'male'}
              onChange={onChange}
              className="hidden" 
            />
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <MaleIcon style={{ fontSize: 40, color: '#3b82f6' }} />
            </div>
            <span className="font-medium">{t('players.male')}</span>
          </label>
          
          <label 
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
              playerData.gender === 'female' 
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30' 
                : 'border-base-300 hover:border-pink-300'
            }`}
          >
            <input 
              type="radio" 
              name="gender"
              value="female"
              checked={playerData.gender === 'female'}
              onChange={onChange}
              className="hidden" 
            />
            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-2">
              <FemaleIcon style={{ fontSize: 40, color: '#ec4899' }} />
            </div>
            <span className="font-medium">{t('players.female')}</span>
          </label>
        </div>
      </div>
    </div>
  );
} 