'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

// Lista de palabras de ejemplo (deberías tener una lista más grande según el nivel)
const wordsByLevel = {
  'beginner': ['casa', 'perro', 'gato', 'sol', 'luna', 'agua', 'pan', 'niño', 'flor', 'árbol'],
  'elementary': ['familia', 'escuela', 'amigo', 'ciudad', 'tiempo', 'comida', 'juego', 'libro', 'calle', 'parque'],
  'intermediate': ['libertad', 'conocimiento', 'experiencia', 'desarrollo', 'comunicación', 'tecnología', 'educación', 'naturaleza', 'sociedad', 'economía'],
  'advanced': ['sostenibilidad', 'biodiversidad', 'infraestructura', 'globalización', 'investigación', 'perspectiva', 'metodología', 'implementación', 'innovación', 'colaboración'],
  'expert': ['epistemología', 'paradigma', 'idiosincrasia', 'interdisciplinariedad', 'contextualización', 'conceptualización', 'multidimensionalidad', 'interoperabilidad', 'descentralización', 'democratización']
};

export default function SpeedReadingGame({ level, onExit }) {
  const t = useTranslations();
  const [currentWord, setCurrentWord] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [totalWords, setTotalWords] = useState(50); // Número total de palabras a mostrar
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [wordSpeed, setWordSpeed] = useState(2000); // Tiempo en ms entre palabras
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Determinar si se debe usar avance automático basado en el nivel
  useEffect(() => {
    // Niveles 3-5 (intermediate, advanced, expert) usan avance automático
    setAutoAdvance(['intermediate', 'advanced', 'expert'].includes(level));
    
    // Ajustar velocidad según el nivel
    if (level === 'intermediate') setWordSpeed(1500);
    if (level === 'advanced') setWordSpeed(1000);
    if (level === 'expert') setWordSpeed(800);
  }, [level]);
  
  // Función para obtener una palabra aleatoria del nivel actual
  const getRandomWord = useCallback(() => {
    const words = wordsByLevel[level] || wordsByLevel.beginner;
    return words[Math.floor(Math.random() * words.length)];
  }, [level]);
  
  // Iniciar el juego
  const startGame = () => {
    setCurrentWord(getRandomWord());
    setWordCount(0);
    setIsPlaying(true);
    setIsPaused(false);
  };
  
  // Pausar/reanudar el juego
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Avanzar a la siguiente palabra
  const nextWord = useCallback(() => {
    if (wordCount >= totalWords - 1) {
      // Juego completado
      setIsPlaying(false);
      return;
    }
    
    setCurrentWord(getRandomWord());
    setWordCount(prev => prev + 1);
  }, [wordCount, totalWords, getRandomWord]);
  
  // Efecto para avance automático
  useEffect(() => {
    if (!isPlaying || isPaused || !autoAdvance) return;
    
    const timer = setTimeout(() => {
      nextWord();
    }, wordSpeed);
    
    return () => clearTimeout(timer);
  }, [isPlaying, isPaused, autoAdvance, nextWord, wordSpeed, currentWord]);
  
  // Manejar clic/tap para avanzar manualmente
  const handleTap = () => {
    if (!isPlaying) {
      startGame();
      return;
    }
    
    if (isPaused) {
      setIsPaused(false);
      return;
    }
    
    if (!autoAdvance) {
      nextWord();
    }
  };
  
  // Calcular el progreso
  const progress = (wordCount / totalWords) * 100;
  
  return (
    <div className="h-full w-full flex flex-col">
      {/* Barra de progreso */}
      <div className="w-full bg-base-200 h-4 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Contador de palabras */}
      <div className="text-center mt-2 text-sm">
        {wordCount} / {totalWords}
      </div>
      
      {/* Área principal del juego */}
      <div 
        className="flex-grow flex items-center justify-center"
        onClick={handleTap}
      >
        {!isPlaying ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t('play.speedReading')}</h2>
            <p className="mb-6">
              {autoAdvance 
                ? t('play.speedInstructions.auto', { speed: wordSpeed / 1000 })
                : t('play.speedInstructions.manual')}
            </p>
            <button className="btn btn-primary" onClick={startGame}>
              {t('play.startGame')}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-7xl font-bold mb-8">{currentWord}</div>
            {!autoAdvance && (
              <p className="text-xl opacity-70">{t('play.tapToContinue')}</p>
            )}
          </div>
        )}
      </div>
      
      {/* Controles */}
      {isPlaying && (
        <div className="flex justify-center gap-4 mb-8">
          {autoAdvance && (
            <button className="btn btn-circle btn-outline" onClick={togglePause}>
              {isPaused ? '▶' : '⏸'}
            </button>
          )}
          <button className="btn btn-circle btn-outline" onClick={onExit}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
} 