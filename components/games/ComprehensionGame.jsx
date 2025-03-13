'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// Textos de ejemplo por nivel
const textsByLevel = {
  'beginner': {
    text: "Mi perro se llama Max. Max es grande y negro. Le gusta jugar en el parque. Corre muy rápido. Come mucha comida. Duerme en su cama. Max es mi mejor amigo.",
    questions: [
      {
        question: "¿Cómo se llama el perro?",
        options: ["Rex", "Max", "Toby", "Luna"],
        correctAnswer: 1
      },
      {
        question: "¿De qué color es el perro?",
        options: ["Blanco", "Marrón", "Negro", "Gris"],
        correctAnswer: 2
      }
    ]
  },
  'elementary': {
    text: "Ana va a la escuela todos los días. Le gusta aprender matemáticas y ciencias. Su maestra se llama Sofía. Ana tiene muchos amigos en la escuela. Después de clase, juega en el patio. Luego, regresa a casa y hace su tarea. Ana disfruta mucho ir a la escuela.",
    questions: [
      {
        question: "¿Qué materias le gusta aprender a Ana?",
        options: ["Historia y Arte", "Matemáticas y Ciencias", "Música y Deporte", "Idiomas"],
        correctAnswer: 1
      },
      {
        question: "¿Qué hace Ana después de clase?",
        options: ["Va a casa", "Juega en el patio", "Va a la biblioteca", "Come helado"],
        correctAnswer: 1
      }
    ]
  },
  // Añadir más textos para otros niveles
};

export default function ComprehensionGame({ level, onExit }) {
  const t = useTranslations();
  const [gameState, setGameState] = useState('intro'); // intro, reading, questions, results
  const [text, setText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  // Inicializar el juego con el texto y preguntas según el nivel
  useEffect(() => {
    const levelData = textsByLevel[level] || textsByLevel.beginner;
    setText(levelData.text);
    setQuestions(levelData.questions);
    setWords(levelData.text.split(' '));
    setAnswers(new Array(levelData.questions.length).fill(null));
  }, [level]);
  
  // Iniciar la lectura
  const startReading = () => {
    setGameState('reading');
    setCurrentWordIndex(0);
  };
  
  // Avanzar a la siguiente palabra
  const nextWord = () => {
    if (currentWordIndex >= words.length - 1) {
      // Lectura completada, pasar a las preguntas
      setGameState('questions');
      setCurrentQuestionIndex(0);
      return;
    }
    
    setCurrentWordIndex(prev => prev + 1);
  };
  
  // Seleccionar una respuesta
  const selectAnswer = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };
  
  // Pasar a la siguiente pregunta
  const nextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      // Calcular puntuación
      let correctCount = 0;
      questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) {
          correctCount++;
        }
      });
      
      setScore(correctCount);
      setGameState('results');
      return;
    }
    
    setCurrentQuestionIndex(prev => prev + 1);
  };
  
  // Calcular el progreso de la lectura
  const readingProgress = ((currentWordIndex + 1) / words.length) * 100;
  
  return (
    <div className="h-full w-full flex flex-col">
      {/* Barra de progreso */}
      {gameState === 'reading' && (
        <div className="w-full bg-base-200 h-4 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300 ease-out"
            style={{ width: `${readingProgress}%` }}
          ></div>
        </div>
      )}
      
      {/* Área principal del juego */}
      <div className="flex-grow flex items-center justify-center p-4">
        {gameState === 'intro' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t('play.comprehension')}</h2>
            <p className="mb-6">{t('play.comprehensionInstructions')}</p>
            <button className="btn btn-primary" onClick={startReading}>
              {t('play.startReading')}
            </button>
          </div>
        )}
        
        {gameState === 'reading' && (
          <div 
            className="text-center"
            onClick={nextWord}
          >
            <div className="text-5xl font-bold mb-8">{words[currentWordIndex]}</div>
            <p className="text-xl opacity-70">{t('play.tapToContinue')}</p>
          </div>
        )}
        
        {gameState === 'questions' && (
          <div className="w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {t('play.question')} {currentQuestionIndex + 1}/{questions.length}
            </h3>
            <p className="text-lg mb-4">{questions[currentQuestionIndex].question}</p>
            
            <div className="space-y-3">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div 
                  key={index}
                  onClick={() => selectAnswer(currentQuestionIndex, index)}
                  className={`p-3 border-2 rounded-lg cursor-pointer ${
                    answers[currentQuestionIndex] === index 
                      ? 'border-primary bg-primary/10' 
                      : 'border-base-300'
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                className="btn btn-primary" 
                onClick={nextQuestion}
                disabled={answers[currentQuestionIndex] === null}
              >
                {currentQuestionIndex < questions.length - 1 
                  ? t('play.nextQuestion') 
                  : t('play.finishQuiz')}
              </button>
            </div>
          </div>
        )}
        
        {gameState === 'results' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t('play.results')}</h2>
            <div className="text-5xl font-bold mb-6">
              {score}/{questions.length}
            </div>
            <p className="mb-6">
              {score === questions.length 
                ? t('play.perfectScore') 
                : score >= questions.length / 2 
                  ? t('play.goodScore') 
                  : t('play.tryAgain')}
            </p>
            <button className="btn btn-primary" onClick={onExit}>
              {t('play.backToMenu')}
            </button>
          </div>
        )}
      </div>
      
      {/* Botón de salida */}
      {gameState !== 'results' && (
        <div className="flex justify-center mb-8">
          <button className="btn btn-circle btn-outline" onClick={onExit}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
} 