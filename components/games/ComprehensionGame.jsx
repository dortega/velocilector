'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { questionsService } from '@/services/questions';
import { scoresService } from '@/services/scores';
import GameResults from './GameResults';

export default function ComprehensionGame({ level, playerId, shouldSaveProgress = false }) {
  const t = useTranslations();
  const { locale } = useParams();
  const [gameState, setGameState] = useState('loading'); // loading, intro, reading, questions, results
  const [text, setText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  
  // Referencias para el seguimiento del tiempo
  const readingStartTimeRef = useRef(null);
  const readingEndTimeRef = useRef(null);
  const wordTimesRef = useRef([]);
  const questionTimesRef = useRef([]);
  const textIdRef = useRef(null);
  
  // Cargar texto y preguntas de la base de datos
  useEffect(() => {
    const fetchTextWithQuestions = async () => {
      try {
        const levelNum = parseInt(level) || 1;
        const data = await questionsService.getRandomTextWithQuestions(locale, levelNum);
        
        setText(data.text.content);
        setWords(data.text.content.split(' '));
        textIdRef.current = data.text.id;
        
        // Transformar las preguntas al formato esperado
        const formattedQuestions = data.questions.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correct_answer
        }));
        
        setQuestions(formattedQuestions);
        setAnswers(new Array(formattedQuestions.length).fill(null));
        setGameState('intro');
        setError(null);
      } catch (error) {
        console.error('Error fetching text with questions:', error);
        setError('Error cargando el contenido. Por favor, intenta de nuevo.');
        setGameState('error');
      }
    };
    
    fetchTextWithQuestions();
  }, [level, locale]);
  
  // Inicializar el juego
  const initializeGame = useCallback(() => {
    setGameState('intro');
    setCurrentWordIndex(0);
    setCurrentQuestionIndex(0);
    setAnswers(new Array(questions.length).fill(null));
    setScore(0);
    
    // Reiniciar referencias de tiempo
    readingStartTimeRef.current = null;
    readingEndTimeRef.current = null;
    wordTimesRef.current = [];
    questionTimesRef.current = [];
  }, [questions.length]);
  
  // Escuchar eventos para reiniciar el juego
  useEffect(() => {
    const handleRestart = () => {
      initializeGame();
    };
    
    window.addEventListener('game:restart', handleRestart);
    
    return () => {
      window.removeEventListener('game:restart', handleRestart);
    };
  }, [initializeGame]);
  
  // Iniciar la lectura
  const startReading = useCallback(() => {
    setGameState('reading');
    setCurrentWordIndex(0);
    
    // Iniciar el tiempo de lectura
    readingStartTimeRef.current = Date.now();
    
    // Registrar el tiempo de la primera palabra
    wordTimesRef.current.push({
      word: words[0],
      startTime: Date.now(),
      endTime: null
    });
  }, [words]);
  
  // Avanzar a la siguiente palabra
  const nextWord = useCallback(() => {
    // Registrar el tiempo de finalización de la palabra actual
    if (wordTimesRef.current.length > 0) {
      const currentWordData = wordTimesRef.current[wordTimesRef.current.length - 1];
      currentWordData.endTime = Date.now();
    }
    
    if (currentWordIndex < words.length - 1) {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      
      // Registrar el tiempo de inicio de la nueva palabra
      wordTimesRef.current.push({
        word: words[nextIndex],
        startTime: Date.now(),
        endTime: null
      });
    } else {
      // Finalizar la lectura
      readingEndTimeRef.current = Date.now();
      setGameState('questions');
      
      // Iniciar el tiempo de la primera pregunta
      questionTimesRef.current.push({
        questionId: questions[0]?.id,
        startTime: Date.now(),
        endTime: null
      });
    }
  }, [currentWordIndex, words, questions]);
  
  // Seleccionar una respuesta
  const selectAnswer = useCallback((questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  }, [answers]);
  
  // Avanzar a la siguiente pregunta o finalizar el cuestionario
  const nextQuestion = useCallback(() => {
    // Registrar el tiempo de finalización de la pregunta actual
    if (questionTimesRef.current.length > 0) {
      const currentQuestionData = questionTimesRef.current[questionTimesRef.current.length - 1];
      currentQuestionData.endTime = Date.now();
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // Registrar el tiempo de inicio de la nueva pregunta
      questionTimesRef.current.push({
        questionId: questions[nextIndex]?.id,
        startTime: Date.now(),
        endTime: null
      });
    } else {
      // Calcular puntuación
      let correctCount = 0;
      for (let i = 0; i < questions.length; i++) {
        if (answers[i] === questions[i].correctAnswer) {
          correctCount++;
        }
      }
      setScore(correctCount);
      
      // Guardar puntuación
      saveGameScore();
      
      // Mostrar resultados
      setGameState('results');
    }
  }, [currentQuestionIndex, questions, answers]);
  
  // Guardar puntuación del juego
  const saveGameScore = useCallback(async () => {
    if (!playerId) return;
    
    try {
      // Calcular estadísticas
      const correctAnswers = answers.filter((answer, index) => 
        answer === questions[index].correctAnswer
      ).length;
      
      const readingTime = readingEndTimeRef.current - readingStartTimeRef.current;
      const averageReadingTime = readingTime / words.length;
      
      // Preparar datos para guardar
      const gameData = {
        player_id: playerId,
        text_id: textIdRef.current,
        level: parseInt(level) || 1,
        language: locale,
        text_content: text,
        word_count: words.length,
        reading_time: readingTime,
        average_reading_time: averageReadingTime,
        questions: questions,
        correct_answers: correctAnswers,
        total_questions: questions.length,
        answer_times: questionTimesRef.current,
        total_answer_time: questionTimesRef.current.reduce((sum, q) => {
          if (q.endTime && q.startTime) {
            return sum + (q.endTime - q.startTime);
          }
          return sum;
        }, 0)
      };
      
      // Guardar puntuación
      await scoresService.saveComprehensionGame(gameData);
      console.log('Comprehension game score saved successfully');
    } catch (error) {
      console.error('Error saving comprehension game score:', error);
    }
  }, [playerId, level, locale, questions, answers, words, text]);
  
  // Calcular progreso de lectura
  const readingProgress = (currentWordIndex / (words.length - 1)) * 100;
  
  // Calcular progreso de preguntas
  const questionProgress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  // Finalizar el juego
  const finishGame = useCallback(() => {
    // Calcular puntuación
    const correctCount = answers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    
    // Calcular porcentaje de aciertos
    const percentage = Math.round((correctCount / questions.length) * 100);
    
    // Actualizar puntuación
    setScore(percentage);
    
    // Cambiar estado del juego
    setGameState('results');
    
    // Guardar puntuación solo si hay un jugador seleccionado
    if (shouldSaveProgress) {
      saveGameScore();
    }
  }, [answers, questions, shouldSaveProgress, saveGameScore]);
  
  // Función para calcular el tamaño de fuente adaptativo
  const calculateFontSize = (word) => {
    if (!word) return 'text-7xl';
    
    const length = word.length;
    
    // Ajustar tamaño según longitud de la palabra
    if (length <= 4) return 'text-7xl'; // Palabras muy cortas
    if (length <= 6) return 'text-7xl'; // Palabras cortas
    if (length <= 8) return 'text-6xl'; // Palabras medias
    if (length <= 10) return 'text-6xl'; // Palabras largas
    if (length <= 12) return 'text-6xl'; // Palabras muy largas
    return 'text-3xl'; // Palabras extremadamente largas
  };
  
  // Renderizar el juego según el estado
  return (
    <div className="h-full w-full flex flex-col">
      {/* Barra de progreso */}
      <div className="w-full bg-base-200 h-4 rounded-full overflow-hidden">
        <div 
          className="bg-green-600 h-full transition-all duration-300 ease-out"
          style={{ 
            width: `${gameState === 'reading' ? readingProgress : 
                    gameState === 'questions' ? questionProgress : 0}%` 
          }}
        ></div>
      </div>
      
      {/* Contador de progreso */}
      <div className="text-center mt-2 text-sm">
        {gameState === 'reading' && (
          <>
            {currentWordIndex + 1} / {words.length}
          </>
        )}
        {gameState === 'questions' && (
          <>
            {t('play.question')} {currentQuestionIndex + 1} / {questions.length}
          </>
        )}
      </div>
      
      {/* Área principal del juego */}
      <div className="flex-grow flex items-center justify-center p-4">
        {gameState === 'loading' && (
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-green-600"></div>
            <p className="mt-4">{t('loading')}</p>
          </div>
        )}
        
        {gameState === 'error' && (
          <div className="text-center">
            <div className="text-error mb-4">{error}</div>
            <button className="btn bg-green-600 hover:bg-green-700 text-white" onClick={() => window.location.reload()}>
              {t('retry')}
            </button>
          </div>
        )}
        
        {gameState === 'intro' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t('play.comprehension')}</h2>
            <p className="mb-6">{t('play.comprehensionInstructions')}</p>
            <button 
              className="btn bg-green-600 hover:bg-green-700 text-white" 
              onClick={startReading}
              disabled={words.length === 0}
            >
              {t('play.startReading')}
            </button>
          </div>
        )}
        
        {gameState === 'reading' && (
          <div 
            className="flex-grow flex items-center justify-center px-4"
            onClick={nextWord}
          >
            <div className="text-center w-full">
              <div className={`font-bold mb-8 break-words max-w-full mx-auto ${calculateFontSize(words[currentWordIndex])}`}>
                {words[currentWordIndex]}
              </div>
              <p className="text-xl opacity-70">{t('play.tapToContinue')}</p>
            </div>
          </div>
        )}
        
        {gameState === 'questions' && (
          <div className="w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">{questions[currentQuestionIndex]?.question}</h3>
            
            <div className="space-y-3 mb-6">
              {questions[currentQuestionIndex]?.options.map((option, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestionIndex] === index 
                      ? 'bg-green-600 text-white' 
                      : 'bg-base-100 hover:bg-green-50 border-green-200'
                  }`}
                  onClick={() => selectAnswer(currentQuestionIndex, index)}
                >
                  {option}
                </div>
              ))}
            </div>
            
            <button 
              className="btn bg-green-600 hover:bg-green-700 text-white w-full"
              onClick={nextQuestion}
              disabled={answers[currentQuestionIndex] === null}
            >
              {currentQuestionIndex < questions.length - 1 
                ? t('play.nextQuestion') 
                : t('play.finishQuiz')}
            </button>
          </div>
        )}
        
        {gameState === 'results' && (
          <GameResults 
            shouldSaveProgress={shouldSaveProgress}
            stats={[
              {
                title: t('play.score'),
                value: `${Math.round((answers.filter((answer, index) => 
                  answer === questions[index].correctAnswer
                ).length / questions.length) * 100)}%`
              },
              {
                title: t('play.correctAnswers'),
                value: `${answers.filter((answer, index) => 
                  answer === questions[index].correctAnswer
                ).length} / ${questions.length}`
              }
            ]}
            onNewGame={() => {
              window.dispatchEvent(new Event('game:newConfig'));
            }}
            onPlayAgain={() => {
              initializeGame();
              startReading();
            }}
          />
        )}
      </div>
    </div>
  );
}
