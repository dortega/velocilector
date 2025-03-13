'use client';
import { useTranslations } from 'next-intl';
import RectangleColorSelector from '../selectors/RectangleColorSelector';
import EyeColorSelector from '../selectors/EyeColorSelector';

export default function Step2Appearance({ playerData, onChange }) {
  const t = useTranslations();
  
  // Options for selectors
  const skinTones = [
    { value: 'very_light', color: '#FFDBAC', label: t('players.skinVeryLight') },
    { value: 'light', color: '#F1C27D', label: t('players.skinLight') },
    { value: 'medium', color: '#E0AC69', label: t('players.skinMedium') },
    { value: 'tan', color: '#C68642', label: t('players.skinTan') },
    { value: 'dark', color: '#8D5524', label: t('players.skinDark') },
    { value: 'very_dark', color: '#5C3836', label: t('players.skinVeryDark') }
  ];

  const eyeColors = [
    { value: 'blue', color: '#5E72EB', label: t('players.eyeBlue') },
    { value: 'green', color: '#20C997', label: t('players.eyeGreen') },
    { value: 'brown', color: '#5A3825', label: t('players.eyeBrown') },
    { value: 'hazel', color: '#A67C52', label: t('players.eyeHazel') },
    { value: 'gray', color: '#AAAAAA', label: t('players.eyeGray') },
    { value: 'amber', color: '#FFBF00', label: t('players.eyeAmber') },
    { value: 'black', color: '#36454F', label: t('players.eyeBlack') }
  ];
  
  return (
    <div className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">{t('players.skinTone')}</span>
        </label>
        <RectangleColorSelector 
          options={skinTones}
          value={playerData.skin_tone}
          onChange={onChange}
          name="skin_tone"
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">{t('players.eyeColor')}</span>
        </label>
        <EyeColorSelector 
          options={eyeColors}
          value={playerData.eye_color}
          onChange={onChange}
          name="eye_color"
        />
      </div>
    </div>
  );
} 