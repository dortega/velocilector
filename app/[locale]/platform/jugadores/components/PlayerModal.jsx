'use client';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2Appearance from './steps/Step2Appearance';
import Step3HairStyle from './steps/Step3HairStyle';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SaveIcon from '@mui/icons-material/Save';
import CakeIcon from '@mui/icons-material/Cake';
import SchoolIcon from '@mui/icons-material/School';

export default function PlayerModal({ 
  isOpen, 
  onClose, 
  onSave, 
  player = null, 
  isEditing = false 
}) {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState({
    name: '',
    age: '',
    reading_level: '1',
    gender: '',
    hair_color: '',
    hair_style: '',
    skin_tone: '',
    eye_color: ''
  });

  // Update state when player changes
  useEffect(() => {
    if (player) {
      // Convert reading_level from number to text for editing
      let readingLevelText;
      const numericLevel = parseInt(player.reading_level) || 1; // Valor predeterminado si es NaN
      
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
        ...player,
        reading_level: readingLevelText
      });
    } else {
      // Si estamos creando, usar valores predeterminados
      setCurrentPlayer({
        name: '',
        age: '',
        reading_level: 'principiante', // Valor predeterminado: principiante
        gender: '',
        hair_color: '',
        hair_style: '',
        skin_tone: '',
        eye_color: ''
      });
    }
  }, [player]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPlayer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = (e) => {
    // Importante: prevenir el comportamiento predeterminado para evitar el envío del formulario
    e.preventDefault();
    
    // Prevenir múltiples clics rápidos
    if (isSubmitting) return;
    
    // Validar el paso actual antes de avanzar
    if (currentStep === 1) {
      if (!currentPlayer.name || !currentPlayer.age || !currentPlayer.reading_level || !currentPlayer.gender) {
        return;
      }
    } else if (currentStep === 2) {
      if (!currentPlayer.skin_tone || !currentPlayer.eye_color) {
        return;
      }
    }
    
    // Transición suave entre pasos
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = (e) => {
    // Importante: prevenir el comportamiento predeterminado para evitar el envío del formulario
    e.preventDefault();
    
    // Prevenir múltiples clics rápidos
    if (isSubmitting) return;
    
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Función para manejar el cierre del modal
  const handleClose = () => {
    if (isSubmitting) return;
    
    // Resetear el formulario al cerrar
    setCurrentStep(1);
    if (!isEditing) {
      setCurrentPlayer({
        name: '',
        age: '',
        reading_level: '1',
        gender: '',
        hair_color: '',
        hair_style: '',
        skin_tone: '',
        eye_color: ''
      });
    }
    
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // Solo guardar si estamos en el último paso
      if (currentStep !== 3) {
        setIsSubmitting(false);
        return;
      }
      
      // Convert reading_level from text to number for saving
      let readingLevelNumber;
      
      switch(currentPlayer.reading_level) {
        case 'principiante':
          readingLevelNumber = 1;
          break;
        case 'elemental':
          readingLevelNumber = 3;
          break;
        case 'intermedio':
          readingLevelNumber = 5;
          break;
        case 'avanzado':
          readingLevelNumber = 7;
          break;
        case 'experto':
          readingLevelNumber = 9;
          break;
        default:
          readingLevelNumber = 1;
      }
      
      // Llamar a onSave y esperar a que termine
      await onSave({
        ...currentPlayer,
        reading_level: readingLevelNumber
      });
      
      // Cerrar el modal después de guardar exitosamente
      handleClose();
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    // Usar un key único para cada paso para forzar un re-render completo
    switch(currentStep) {
      case 1:
        return <Step1BasicInfo key="step1" playerData={currentPlayer} onChange={handleChange} />;
      case 2:
        return <Step2Appearance key="step2" playerData={currentPlayer} onChange={handleChange} />;
      case 3:
        return <Step3HairStyle key="step3" playerData={currentPlayer} onChange={handleChange} />;
      default:
        // Asegurarse de devolver siempre un componente válido
        return <Step1BasicInfo key="step1" playerData={currentPlayer} onChange={handleChange} />;
    }
  };

  const renderNavButtons = () => {
    return (
      <div className="flex justify-between mt-6">
        {currentStep > 1 ? (
          <button 
            type="button" // Importante: tipo button para evitar envío del formulario
            className="btn btn-outline"
            onClick={prevStep}
            disabled={isSubmitting}
          >
            <ArrowBackIcon className="mr-1" />
            {t('back')}
          </button>
        ) : (
          <div></div> // Espacio vacío para mantener la alineación
        )}
        
        {currentStep < 3 ? (
          <button 
            type="button" // Importante: tipo button para evitar envío del formulario
            className="btn btn-primary"
            onClick={nextStep}
            disabled={
              isSubmitting || 
              (currentStep === 1 && (!currentPlayer.name || !currentPlayer.age || !currentPlayer.reading_level || !currentPlayer.gender)) ||
              (currentStep === 2 && (!currentPlayer.skin_tone || !currentPlayer.eye_color))
            }
          >
            {t('next')}
            <ArrowForwardIcon className="ml-1" />
          </button>
        ) : (
          <button 
            type="submit" // Este sí debe ser submit para enviar el formulario
            className="btn btn-primary"
            disabled={isSubmitting || !currentPlayer.hair_color || !currentPlayer.hair_style}
          >
            {isSubmitting ? t('players.processing') : (isEditing ? t('save') : t('create'))}
            {isSubmitting ? null : <SaveIcon className="ml-1" />}
          </button>
        )}
      </div>
    );
  };

  // Renderizar indicador de progreso
  const renderProgressIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        <ul className="steps steps-horizontal w-full">
          <li className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>
            {t('players.basicInfo')}
          </li>
          <li className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>
            {t('players.appearance')}
          </li>
          <li className={`step ${currentStep >= 3 ? 'step-primary' : ''}`}>
            {t('players.hairStyle')}
          </li>
        </ul>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <dialog open={isOpen} className="modal modal-open z-50">
      <div className="modal-box max-w-3xl relative">
        {/* Botón de cerrar (X) en la esquina superior derecha */}
        <button 
          type="button"
          onClick={handleClose} 
          className="btn btn-sm btn-circle absolute right-2 top-2"
          disabled={isSubmitting}
        >
          <CloseIcon fontSize="small" />
        </button>
        
        <h3 className="font-bold text-lg mb-4 pr-8">
          {isEditing ? t('players.editPlayer') : t('players.createPlayer')}
        </h3>
        
        {renderProgressIndicator()}
        
        <form onSubmit={handleSubmit} className="player-form">
          <div className="transition-all duration-300 ease-in-out">
            {renderStep()}
          </div>
          {renderNavButtons()}
        </form>
      </div>
      <div className="modal-backdrop" onClick={isSubmitting ? null : handleClose}></div>
    </dialog>
  );
} 