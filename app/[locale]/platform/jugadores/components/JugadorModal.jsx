'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export default function PlayerModal({ 
  isOpen, 
  onClose, 
  onSave, 
  player = null, 
  isEditing = false 
}) {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState({
    name: '',
    age: '',
    reading_level: '',
    gender: '',
    hair_color: '',
    hair_style: '',
    skin_tone: '',
    eye_color: ''
  });

  // Options for selectors
  const skinTones = [
    { value: 'very_light', color: '#FFDBAC', label: t('players.skinVeryLight') },
    { value: 'light', color: '#F1C27D', label: t('players.skinLight') },
    { value: 'medium', color: '#E0AC69', label: t('players.skinMedium') },
    { value: 'tan', color: '#C68642', label: t('players.skinTan') },
    { value: 'dark', color: '#8D5524', label: t('players.skinDark') },
    { value: 'very_dark', color: '#5C3836', label: t('players.skinVeryDark') }
  ];

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

  const eyeColors = [
    { value: 'blue', color: '#5E72EB', label: t('players.eyeBlue') },
    { value: 'green', color: '#20C997', label: t('players.eyeGreen') },
    { value: 'brown', color: '#5A3825', label: t('players.eyeBrown') },
    { value: 'hazel', color: '#A67C52', label: t('players.eyeHazel') },
    { value: 'gray', color: '#AAAAAA', label: t('players.eyeGray') },
    { value: 'amber', color: '#FFBF00', label: t('players.eyeAmber') },
    { value: 'black', color: '#1C1C1C', label: t('players.eyeBlack') }
  ];

  // Update state when player changes
  useEffect(() => {
    if (player) {
      // Convert reading_level from number to text for editing
      let readingLevelText;
      const numericLevel = parseInt(player.reading_level);
      
      if (numericLevel <= 2) {
        readingLevelText = 'principiante';
      } else if (numericLevel <= 4) {
        readingLevelText = 'elemental';
      } else if (numericLevel <= 6) {
        readingLevelText = 'intermedio';
      } else if (numericLevel <= 8) {
        readingLevelText = 'avanzado';
      } else {
        readingLevelText = 'experto';
      }
      
      setCurrentPlayer({
        id: player.id,
        name: player.name,
        age: player.age,
        reading_level: readingLevelText,
        gender: player.gender,
        hair_color: player.hair_color,
        hair_style: player.hair_style,
        skin_tone: player.skin_tone,
        eye_color: player.eye_color
      });
    } else {
      // Reset form if no player (add new)
      setCurrentPlayer({
        name: '',
        age: '',
        reading_level: '',
        gender: '',
        hair_color: '',
        hair_style: '',
        skin_tone: '',
        eye_color: ''
      });
    }
    // Reset to first step when modal opens
    setCurrentStep(1);
  }, [player, isOpen]);

  const nextStep = (e) => {
    e.preventDefault();
    setCurrentStep(currentStep + 1);
  };

  const prevStep = (e) => {
    e.preventDefault();
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Cerrar el modal inmediatamente antes de iniciar el proceso de guardado
      onClose();
      
      // Luego proceder con el guardado
      await onSave(currentPlayer);
    } catch (error) {
      console.error('Error saving player:', error);
      // No es necesario reabrir el modal, ya que el indicador de carga
      // y cualquier mensaje de error se manejarán en el componente padre
    }
  };

  // Color selector component
  const ColorSelector = ({ options, value, onChange, name }) => (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {options.map((option) => (
        <label 
          key={option.value} 
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border-2 ${value === option.value ? 'border-primary' : 'border-transparent'}`}
        >
          <input 
            type="radio" 
            name={name} 
            value={option.value} 
            checked={value === option.value} 
            onChange={onChange}
            className="hidden" 
            required
          />
          <span 
            className="w-6 h-6 rounded-full" 
            style={{ backgroundColor: option.color }}
          ></span>
          <span className="text-sm">{option.label}</span>
        </label>
      ))}
    </div>
  );

  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-open z-50">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-lg mb-4">
          {isEditing ? t('players.editPlayer') : t('players.createPlayer')}
        </h3>
        
        {/* Progress indicator */}
        <div className="w-full flex justify-between mb-6 mt-4">
          <div 
            className={`step-item flex-1 text-center pb-4 relative ${currentStep >= 1 ? 'active' : ''}`}
            style={{ borderBottom: currentStep >= 1 ? '2px solid currentColor' : '2px solid #e5e7eb' }}
          >
            <span className="step-title">{t('players.basicInfo')}</span>
          </div>
          <div 
            className={`step-item flex-1 text-center pb-4 relative ${currentStep >= 2 ? 'active' : ''}`}
            style={{ borderBottom: currentStep >= 2 ? '2px solid currentColor' : '2px solid #e5e7eb' }}
          >
            <span className="step-title">{t('players.appearance')}</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('players.name')}</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered" 
                  value={currentPlayer.name} 
                  onChange={(e) => setCurrentPlayer({...currentPlayer, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('players.age')}</span>
                </label>
                <input 
                  type="number" 
                  className="input input-bordered" 
                  value={currentPlayer.age} 
                  onChange={(e) => setCurrentPlayer({...currentPlayer, age: e.target.value})}
                  required
                  min="1"
                  max="18"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('players.readingLevel')}</span>
                </label>
                <select 
                  className="select select-bordered w-full" 
                  value={currentPlayer.reading_level} 
                  onChange={(e) => setCurrentPlayer({...currentPlayer, reading_level: e.target.value})}
                  required
                >
                  <option value="" disabled>{t('players.selectLevel')}</option>
                  <option value="principiante">{t('players.beginner')}</option>
                  <option value="elemental">{t('players.elementary')}</option>
                  <option value="intermedio">{t('players.intermediate')}</option>
                  <option value="avanzado">{t('players.advanced')}</option>
                  <option value="experto">{t('players.expert')}</option>
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('players.gender')}</span>
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="male" 
                      checked={currentPlayer.gender === 'male'} 
                      onChange={(e) => setCurrentPlayer({...currentPlayer, gender: e.target.value})}
                      className="radio radio-primary" 
                      required
                    />
                    <span>{t('players.boy')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="female" 
                      checked={currentPlayer.gender === 'female'} 
                      onChange={(e) => setCurrentPlayer({...currentPlayer, gender: e.target.value})}
                      className="radio radio-primary" 
                      required
                    />
                    <span>{t('players.girl')}</span>
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('players.skinTone')}</span>
                </label>
                <ColorSelector 
                  options={skinTones} 
                  value={currentPlayer.skin_tone || ''} 
                  onChange={(e) => setCurrentPlayer({...currentPlayer, skin_tone: e.target.value})}
                  name="skin_tone"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('players.hairColor')}</span>
                </label>
                <ColorSelector 
                  options={hairColors} 
                  value={currentPlayer.hair_color || ''} 
                  onChange={(e) => setCurrentPlayer({...currentPlayer, hair_color: e.target.value})}
                  name="hair_color"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('players.hairStyle')}</span>
                </label>
                <select 
                  className="select select-bordered w-full" 
                  value={currentPlayer.hair_style || ''} 
                  onChange={(e) => setCurrentPlayer({...currentPlayer, hair_style: e.target.value})}
                  required
                >
                  <option value="" disabled>{t('players.selectHairStyle')}</option>
                  <option value="short">{t('players.hairShort')}</option>
                  <option value="medium">{t('players.hairMedium')}</option>
                  <option value="long">{t('players.hairLong')}</option>
                  <option value="ponytail">{t('players.hairPonytail')}</option>
                  <option value="pigtails">{t('players.hairPigtails')}</option>
                  <option value="braid">{t('players.hairBraid')}</option>
                  <option value="bald">{t('players.hairBald')}</option>
                  <option value="buzzcut">{t('players.hairBuzzcut')}</option>
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('players.eyeColor')}</span>
                </label>
                <ColorSelector 
                  options={eyeColors} 
                  value={currentPlayer.eye_color || ''} 
                  onChange={(e) => setCurrentPlayer({...currentPlayer, eye_color: e.target.value})}
                  name="eye_color"
                />
              </div>
            </div>
          )}
          
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              {t('cancel')}
            </button>
            
            {currentStep > 1 && (
              <button type="button" className="btn btn-outline" onClick={prevStep}>
                {t('back')}
              </button>
            )}
            
            {currentStep < 2 ? (
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={nextStep}
                disabled={!currentPlayer.name || !currentPlayer.age || !currentPlayer.reading_level || !currentPlayer.gender}
              >
                {t('next')}
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!currentPlayer.skin_tone || !currentPlayer.hair_color || !currentPlayer.hair_style || !currentPlayer.eye_color}
              >
                {isEditing ? t('save') : t('create')}
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
} 