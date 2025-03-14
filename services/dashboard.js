import { supabase } from './supabase';

export const dashboardService = {
  /**
   * Obtiene todos los jugadores de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} - Lista de jugadores
   */
  async getPlayersByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching players:', error);
      return [];
    }
  },
  
  /**
   * Obtiene estadísticas de lectura rápida para un jugador
   * @param {string} playerId - ID del jugador
   * @returns {Promise<Object>} - Estadísticas del jugador
   */
  async getSpeedReadingStats(playerId) {
    try {
      // Obtener todos los juegos de lectura rápida del jugador
      const { data: games, error } = await supabase
        .from('speed_reading_games')
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!games || games.length === 0) {
        return {
          playerStats: {
            totalGames: 0,
            totalWords: 0,
            averageSpeed: 0,
            bestSpeed: 0,
            totalTime: 0
          },
          progressData: [],
          recentGames: []
        };
      }
      
      // Calcular estadísticas
      const totalGames = games.length;
      const totalWords = games.reduce((sum, game) => sum + game.word_count, 0);
      const totalTime = games.reduce((sum, game) => sum + game.total_time, 0);
      
      // Calcular velocidades en WPM (palabras por minuto)
      const speeds = games.map(game => {
        const minutes = game.total_time / 60000; // convertir ms a minutos
        return Math.round(game.word_count / minutes);
      });
      
      const averageSpeed = Math.round(
        speeds.reduce((sum, speed) => sum + speed, 0) / totalGames
      );
      
      const bestSpeed = Math.max(...speeds);
      
      // Preparar datos para gráfico de progreso
      const progressData = games.map((game, index) => {
        const minutes = game.total_time / 60000;
        const speed = Math.round(game.word_count / minutes);
        
        return {
          date: new Date(game.created_at).toISOString().split('T')[0],
          speed,
          wordCount: game.word_count,
          level: game.level
        };
      }).reverse(); // Ordenar cronológicamente
      
      // Preparar datos para tabla de juegos recientes
      const recentGames = games.slice(0, 5).map((game, index) => {
        const minutes = game.total_time / 60000;
        const speed = Math.round(game.word_count / minutes);
        
        return {
          id: game.id,
          date: new Date(game.created_at).toLocaleDateString(),
          level: game.level,
          wordCount: game.word_count,
          speed,
          totalTime: game.total_time,
          averageTime: game.average_time
        };
      });
      
      return {
        playerStats: {
          totalGames,
          totalWords,
          averageSpeed,
          bestSpeed,
          totalTime
        },
        progressData,
        recentGames
      };
    } catch (error) {
      console.error('Error fetching speed reading stats:', error);
      return {
        playerStats: {
          totalGames: 0,
          totalWords: 0,
          averageSpeed: 0,
          bestSpeed: 0,
          totalTime: 0
        },
        progressData: [],
        recentGames: []
      };
    }
  },
  
  /**
   * Obtiene estadísticas de comprensión lectora para un jugador
   * @param {string} playerId - ID del jugador
   * @returns {Promise<Object>} - Estadísticas del jugador
   */
  async getComprehensionStats(playerId) {
    try {
      // Obtener todos los juegos de comprensión del jugador
      const { data: games, error } = await supabase
        .from('comprehension_games')
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!games || games.length === 0) {
        return {
          playerStats: {
            totalGames: 0,
            totalQuestions: 0,
            averageScore: 0,
            bestScore: 0,
            totalReadingTime: 0
          },
          progressData: [],
          recentGames: []
        };
      }
      
      // Calcular estadísticas
      const totalGames = games.length;
      const totalQuestions = games.reduce((sum, game) => sum + game.total_questions, 0);
      const totalReadingTime = games.reduce((sum, game) => sum + game.reading_time, 0);
      
      // Calcular puntuaciones en porcentaje
      const scores = games.map(game => 
        Math.round((game.correct_answers / game.total_questions) * 100)
      );
      
      const averageScore = Math.round(
        scores.reduce((sum, score) => sum + score, 0) / totalGames
      );
      
      const bestScore = Math.max(...scores);
      
      // Preparar datos para gráfico de progreso
      const progressData = games.map((game, index) => {
        const score = Math.round((game.correct_answers / game.total_questions) * 100);
        
        return {
          date: new Date(game.created_at).toISOString().split('T')[0],
          score,
          questionCount: game.total_questions,
          level: game.level
        };
      }).reverse(); // Ordenar cronológicamente
      
      // Preparar datos para tabla de juegos recientes
      const recentGames = games.slice(0, 5).map((game, index) => {
        const score = Math.round((game.correct_answers / game.total_questions) * 100);
        
        return {
          id: game.id,
          date: new Date(game.created_at).toLocaleDateString(),
          level: game.level,
          score,
          correctAnswers: game.correct_answers,
          totalQuestions: game.total_questions,
          readingTime: game.reading_time,
          answerTime: game.total_answer_time
        };
      });
      
      return {
        playerStats: {
          totalGames,
          totalQuestions,
          averageScore,
          bestScore,
          totalReadingTime
        },
        progressData,
        recentGames
      };
    } catch (error) {
      console.error('Error fetching comprehension stats:', error);
      return {
        playerStats: {
          totalGames: 0,
          totalQuestions: 0,
          averageScore: 0,
          bestScore: 0,
          totalReadingTime: 0
        },
        progressData: [],
        recentGames: []
      };
    }
  },
  
  /**
   * Obtiene el leaderboard para un nivel específico
   * @param {number} level - Nivel del jugador
   * @param {string} language - Idioma del jugador
   * @returns {Promise<Object>} - Datos del leaderboard
   */
  async getLeaderboard(level, language) {
    try {
      // Obtener los mejores jugadores de lectura rápida
      const { data: speedGames, error: speedError } = await supabase
        .from('speed_reading_games')
        .select(`
          id,
          player_id,
          players:player_id(name),
          level,
          language,
          word_count,
          total_time
        `)
        .eq('level', level)
        .eq('language', language)
        .order('created_at', { ascending: false });
      
      if (speedError) throw speedError;
      
      // Obtener los mejores jugadores de comprensión
      const { data: compGames, error: compError } = await supabase
        .from('comprehension_games')
        .select(`
          id,
          player_id,
          players:player_id(name),
          level,
          language,
          correct_answers,
          total_questions
        `)
        .eq('level', level)
        .eq('language', language)
        .order('created_at', { ascending: false });
      
      if (compError) throw compError;
      
      // Procesar datos para el leaderboard de velocidad
      const speedPlayers = {};
      speedGames.forEach(game => {
        const playerId = game.player_id;
        const playerName = game.players?.name || 'Unknown';
        const minutes = game.total_time / 60000;
        const speed = Math.round(game.word_count / minutes);
        
        if (!speedPlayers[playerId] || speed > speedPlayers[playerId].bestSpeed) {
          speedPlayers[playerId] = {
            playerName,
            bestSpeed: speed,
            totalGames: speedPlayers[playerId]?.totalGames + 1 || 1
          };
        } else {
          speedPlayers[playerId].totalGames += 1;
        }
      });
      
      // Procesar datos para el leaderboard de comprensión
      const compPlayers = {};
      compGames.forEach(game => {
        const playerId = game.player_id;
        const playerName = game.players?.name || 'Unknown';
        const score = Math.round((game.correct_answers / game.total_questions) * 100);
        
        if (!compPlayers[playerId] || score > compPlayers[playerId].bestScore) {
          compPlayers[playerId] = {
            playerName,
            bestScore: score,
            totalGames: compPlayers[playerId]?.totalGames + 1 || 1
          };
        } else {
          compPlayers[playerId].totalGames += 1;
        }
      });
      
      // Convertir a arrays y ordenar
      const speedLeaders = Object.entries(speedPlayers)
        .map(([playerId, data]) => ({
          playerId,
          playerName: data.playerName,
          bestSpeed: data.bestSpeed,
          totalGames: data.totalGames
        }))
        .sort((a, b) => b.bestSpeed - a.bestSpeed)
        .slice(0, 5)
        .map((player, index) => ({ ...player, position: index + 1 }));
      
      const comprehensionLeaders = Object.entries(compPlayers)
        .map(([playerId, data]) => ({
          playerId,
          playerName: data.playerName,
          bestScore: data.bestScore,
          totalGames: data.totalGames
        }))
        .sort((a, b) => b.bestScore - a.bestScore)
        .slice(0, 5)
        .map((player, index) => ({ ...player, position: index + 1 }));
      
      return {
        level,
        speedLeaders,
        comprehensionLeaders
      };
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return {
        level,
        speedLeaders: [],
        comprehensionLeaders: []
      };
    }
  }
}; 