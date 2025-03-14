'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { wordsService } from '@/services/words';
import { scoresService } from '@/services/scores';
import GameResults from './GameResults';

export default function SpeedReadingGame({ level, playerId, shouldSaveProgress = false }) {
  const t = useTranslations();
  const { locale } = useParams();
  const [currentWord, setCurrentWord] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [totalWords, setTotalWords] = useState(50); // Número total de palabras a mostrar
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [wordSpeed, setWordSpeed] = useState(2000); // Tiempo en ms entre palabras
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameFinished, setGameFinished] = useState(false);
  
  // Referencias para el seguimiento del tiempo
  const startTimeRef = useRef(null);
  const wordTimesRef = useRef([]);
  const usedWordsRef = useRef([]);
  const wordTimerRef = useRef(null);
  const wordCountRef = useRef(0); // Referencia para el contador de palabras
  
  // Calcular progreso
  const progress = Math.min((wordCount / totalWords) * 100, 100);
  
  // Cargar palabras de la base de datos
  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        const levelNum = parseInt(level) || 1;
        const fetchedWords = await wordsService.getRandomWords(locale, levelNum, 100);
        setWords(fetchedWords.map(w => w.word));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching words:', error);
        setLoading(false);
        // Usar palabras de respaldo en caso de error
        setWords(['error', 'cargando', 'palabras', 'intenta', 'más', 'tarde']);
      }
    };
    
    fetchWords();
  }, [level, locale]);
  
  // Determinar si se debe usar avance automático basado en el nivel
  useEffect(() => {
    const levelNum = parseInt(level) || 1;
    
    // Niveles 1-2: Manual, 3+: Automático
    setAutoAdvance(levelNum >= 3);
    
    // Ajustar velocidad según nivel
    if (levelNum <= 2) {
      setWordSpeed(2000); // 2 segundos para principiantes
    } else if (levelNum <= 4) {
      setWordSpeed(1500); // 1.5 segundos para elementales
    } else if (levelNum <= 6) {
      setWordSpeed(1000); // 1 segundo para intermedios
    } else if (levelNum <= 8) {
      setWordSpeed(750); // 0.75 segundos para avanzados
    } else {
      setWordSpeed(500); // 0.5 segundos para expertos
    }
    
    // Ajustar número total de palabras según nivel
    if (levelNum <= 2) {
      setTotalWords(30);
    } else if (levelNum <= 4) {
      setTotalWords(40);
    } else if (levelNum <= 6) {
      setTotalWords(50);
    } else if (levelNum <= 8) {
      setTotalWords(60);
    } else {
      setTotalWords(70);
    }
  }, [level]);
  
  // Guardar puntuación del juego
  const saveGameScore = useCallback(async () => {
    if (!playerId) return;
    
    try {
      // Calcular estadísticas del juego
      const totalTime = wordTimesRef.current.reduce((sum, word) => {
        if (word.endTime && word.startTime) {
          return sum + (word.endTime - word.startTime);
        }
        return sum;
      }, 0);
      
      const averageTime = totalTime / wordCountRef.current;
      
      // Preparar datos para guardar
      const gameData = {
        player_id: playerId,
        level: parseInt(level) || 1,
        language: locale,
        word_count: wordCountRef.current,
        words_used: usedWordsRef.current, // Array de palabras usadas
        total_time: totalTime,
        average_time: averageTime,
        errors: 0 // No hay errores en este juego
      };
      
      // Guardar puntuación
      await scoresService.saveSpeedReadingGame(gameData);
      console.log('Game score saved successfully');
    } catch (error) {
      console.error('Error saving game score:', error);
    }
  }, [playerId, level, locale]);
  
  // Finalizar el juego
  const finishGame = useCallback(() => {
    // Limpiar cualquier temporizador existente
    if (wordTimerRef.current) {
      clearTimeout(wordTimerRef.current);
      wordTimerRef.current = null;
    }
    
    // Registrar tiempo para la última palabra
    if (wordTimesRef.current.length > 0) {
      const lastWordIndex = wordTimesRef.current.length - 1;
      if (!wordTimesRef.current[lastWordIndex].endTime) {
        wordTimesRef.current[lastWordIndex].endTime = Date.now();
      }
    }
    
    setIsPlaying(false);
    setGameFinished(true);
    
    // Guardar puntuación solo si hay un jugador seleccionado
    if (shouldSaveProgress) {
      saveGameScore();
    }
  }, [shouldSaveProgress, saveGameScore]);
  
  // Función para mostrar la siguiente palabra
  const showNextWord = useCallback(() => {
    // Verificar si hemos alcanzado el límite de palabras
    if (wordCountRef.current >= totalWords) {
      finishGame();
      return;
    }
    
    // Obtener una palabra aleatoria que no se haya usado recientemente
    let randomIndex;
    let attempts = 0;
    let wordToShow;
    
    do {
      randomIndex = Math.floor(Math.random() * words.length);
      wordToShow = words[randomIndex];
      attempts++;
    } while (
      usedWordsRef.current.includes(wordToShow) && 
      attempts < 20 && 
      usedWordsRef.current.length < words.length
    );
    
    // Registrar tiempo de inicio para esta palabra
    const wordStartTime = Date.now();
    
    // Actualizar palabra actual
    setCurrentWord(wordToShow);
    
    // Registrar palabra usada
    usedWordsRef.current.push(wordToShow);
    
    // Incrementar contador de palabras (usando la referencia)
    wordCountRef.current += 1;
    setWordCount(wordCountRef.current);
    
    // Registrar tiempo para la palabra anterior si existe
    if (wordTimesRef.current.length > 0) {
      const lastWordIndex = wordTimesRef.current.length - 1;
      wordTimesRef.current[lastWordIndex].endTime = wordStartTime;
    }
    
    // Añadir nueva palabra al registro de tiempos
    wordTimesRef.current.push({
      word: wordToShow,
      startTime: wordStartTime,
      endTime: null
    });
    
    // Si está en modo automático, programar la siguiente palabra
    if (autoAdvance && !isPaused) {
      wordTimerRef.current = setTimeout(() => {
        // Verificar nuevamente si hemos alcanzado el límite antes de mostrar la siguiente
        if (wordCountRef.current < totalWords) {
          showNextWord();
        } else {
          finishGame();
        }
      }, wordSpeed);
    }
  }, [words, totalWords, autoAdvance, isPaused, wordSpeed, finishGame]);
  
  // Función para manejar tap/click
  const handleTap = useCallback(() => {
    if (!isPlaying) return;
    
    // Si está en modo manual, mostrar siguiente palabra
    if (!autoAdvance) {
      // Limpiar cualquier temporizador existente
      if (wordTimerRef.current) {
        clearTimeout(wordTimerRef.current);
        wordTimerRef.current = null;
      }
      
      // Verificar si hemos alcanzado el límite de palabras
      if (wordCountRef.current >= totalWords) {
        finishGame();
      } else {
        showNextWord();
      }
    }
  }, [isPlaying, autoAdvance, totalWords, showNextWord, finishGame]);
  
  // Función para pausar/reanudar el juego
  const togglePause = useCallback(() => {
    if (isPaused) {
      // Reanudar juego
      setIsPaused(false);
      
      // Programar siguiente palabra
      wordTimerRef.current = setTimeout(showNextWord, wordSpeed);
    } else {
      // Pausar juego
      setIsPaused(true);
      
      // Limpiar temporizador
      if (wordTimerRef.current) {
        clearTimeout(wordTimerRef.current);
        wordTimerRef.current = null;
      }
    }
  }, [isPaused, wordSpeed, showNextWord]);
  
  // Función para iniciar el juego
  const startGame = useCallback(() => {
    // Reiniciar estado del juego
    setIsPlaying(true);
    setIsPaused(false);
    setGameFinished(false);
    setWordCount(0);
    wordCountRef.current = 0;
    usedWordsRef.current = [];
    wordTimesRef.current = [];
    startTimeRef.current = Date.now();
    
    // Mostrar primera palabra
    showNextWord();
  }, [showNextWord]);
  
  // Limpiar temporizadores al desmontar
  useEffect(() => {
    return () => {
      if (wordTimerRef.current) {
        clearTimeout(wordTimerRef.current);
      }
    };
  }, []);
  
  // Escuchar eventos para reiniciar configuración
  useEffect(() => {
    const handleNewConfig = () => {
      // Limpiar temporizadores
      if (wordTimerRef.current) {
        clearTimeout(wordTimerRef.current);
        wordTimerRef.current = null;
      }
      
      // Reiniciar estado
      setIsPlaying(false);
      setIsPaused(false);
      setGameFinished(false);
      setWordCount(0);
      wordCountRef.current = 0;
      usedWordsRef.current = [];
      wordTimesRef.current = [];
      startTimeRef.current = null;
    };
    
    window.addEventListener('game:newConfig', handleNewConfig);
    
    return () => {
      window.removeEventListener('game:newConfig', handleNewConfig);
    };
  }, []);
  
  // Función para calcular el tamaño de fuente adaptativo
  const calculateFontSize = (word) => {
    if (!word) return 'text-8xl'; // Tamaño base aumentado
    
    const length = word.length;
    
    // Ajustar tamaño según longitud de la palabra (todos aumentados)
    if (length <= 4) return 'text-8xl'; // Palabras muy cortas
    if (length <= 6) return 'text-7xl'; // Palabras cortas
    if (length <= 8) return 'text-6xl'; // Palabras medias
    if (length <= 10) return 'text-5xl'; // Palabras largas
    if (length <= 12) return 'text-4xl'; // Palabras muy largas
    return 'text-3xl'; // Palabras extremadamente largas
  };
  
  // Si el juego ha terminado, mostrar resultados
  if (gameFinished) {
    // Calcular estadísticas para mostrar
    const averageSpeed = Math.round(60000 / (wordTimesRef.current.reduce((sum, word) => {
      if (word.endTime && word.startTime) {
        return sum + (word.endTime - word.startTime);
      }
      return sum;
    }, 0) / wordCount));
    
    const stats = [
      {
        title: t('play.wordsRead'),
        value: wordCount
      },
      {
        title: t('play.averageSpeed'),
        value: `${averageSpeed} ${t('play.wpm')}`
      }
    ];
    
    return (
      <div className="h-full w-full flex flex-col">
        {/* Barra de progreso */}
        <div className="w-full bg-base-200 h-4 rounded-full overflow-hidden">
          <div 
            className="bg-green-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Contador de palabras */}
        <div className="text-center mt-2 text-sm">
          {wordCount} / {totalWords}
        </div>
        
        <GameResults 
          shouldSaveProgress={shouldSaveProgress}
          stats={stats}
          onNewGame={() => {
            // Reiniciar el juego
            setGameFinished(false);
            setWordCount(0);
            wordCountRef.current = 0;
            setCurrentWord('');
            wordTimesRef.current = [];
            usedWordsRef.current = [];
            window.dispatchEvent(new Event('game:newConfig'));
          }}
          onPlayAgain={() => {
            // Reiniciar el mismo juego
            setGameFinished(false);
            setWordCount(0);
            wordCountRef.current = 0;
            setCurrentWord('');
            wordTimesRef.current = [];
            usedWordsRef.current = [];
            startGame();
          }}
        />
      </div>
    );
  }
  
  // Renderizar el juego en curso
  return (
    <div className="h-full w-full flex flex-col">
      {/* Barra de progreso */}
      <div className="w-full bg-base-200 h-4 rounded-full overflow-hidden">
        <div 
          className="bg-green-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Contador de palabras */}
      <div className="text-center mt-2 text-sm">
        {wordCount} / {totalWords}
      </div>
      
      {/* Área principal del juego */}
      <div 
        className="flex-grow flex items-center justify-center px-4"
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
            <button 
              className="btn bg-green-600 hover:bg-green-700 text-white" 
              onClick={startGame}
              disabled={loading}
            >
              {t('play.startGame')}
            </button>
          </div>
        ) : (
          <div className="text-center w-full">
            <div className={`font-bold mb-8 break-words max-w-full mx-auto ${calculateFontSize(currentWord)}`}>
              {currentWord}
            </div>
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
            <button className="btn btn-circle border-green-600 text-green-600 hover:bg-green-100" onClick={togglePause}>
              {isPaused ? '▶' : '⏸'}
            </button>
          )}
        </div>
      )}
    </div>
  );
} 