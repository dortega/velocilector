'use client';
import { useTranslations } from 'next-intl';
import RectangleColorSelector from '../selectors/RectangleColorSelector';
import BaseSelector from '../selectors/BaseSelector';

export default function Step3HairStyle({ playerData, onChange }) {
  const t = useTranslations();
  
  // Options for selectors
  const hairColors = [
    { value: 'blonde', color: '#FFF5E1', label: t('players.hairBlonde') },
    { value: 'light_brown', color: '#A67C52', label: t('players.hairLightBrown') },
    { value: 'dark_brown', color: '#5A3825', label: t('players.hairDarkBrown') },
    { value: 'red', color: '#B7472A', label: t('players.hairRed') },
    { value: 'black', color: '#1C1C1C', label: t('players.hairBlack') },
    { value: 'gray', color: '#AAAAAA', label: t('players.hairGray') },
    { value: 'white', color: '#FFFFFF', label: t('players.hairWhite') },
    { value: 'blue', color: '#5E72EB', label: t('players.hairBlue') },
    { value: 'green', color: '#20C997', label: t('players.hairGreen') },
    { value: 'pink', color: '#FF6B6B', label: t('players.hairPink') },
    { value: 'purple', color: '#845EF7', label: t('players.hairPurple') }
  ];

  const hairStyles = [
    { value: 'short', label: t('players.hairShort') },
    { value: 'medium', label: t('players.hairMedium') },
    { value: 'long', label: t('players.hairLong') },
    { value: 'ponytail', label: t('players.hairPonytail') },
    { value: 'pigtails', label: t('players.hairPigtails') },
    { value: 'braid', label: t('players.hairBraid') },
    { value: 'bald', label: t('players.hairBald') }
  ];

  // Preparar las opciones de estilo de pelo con contenido personalizado
  const hairStylesWithContent = hairStyles.map(style => ({
    ...style,
    content: (
      <div className="flex flex-col items-center">
        <span className="text-sm">{style.label}</span>
      </div>
    )
  }));
  
  return (
    <div className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">{t('players.hairColor')}</span>
        </label>
        <RectangleColorSelector 
          options={hairColors}
          value={playerData.hair_color}
          onChange={onChange}
          name="hair_color"
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">{t('players.hairStyle')}</span>
        </label>
        <BaseSelector 
          options={hairStylesWithContent}
          value={playerData.hair_style}
          onChange={onChange}
          name="hair_style"
        />
      </div>
    </div>
  );
} 