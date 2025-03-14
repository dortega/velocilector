import { supabase } from '@/services/supabase';

export const scoresService = {
  /**
   * Guarda un registro de juego de velocidad de lectura
   * @param {Object} gameData - Datos del juego
   * @returns {Promise<Object>} - Registro guardado
   */
  async saveSpeedReadingGame(gameData) {
    try {
      const { data, error } = await supabase
        .from('speed_reading_games')
        .insert([gameData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error saving speed reading game:', error);
      throw error;
    }
  },
  
  /**
   * Guarda un registro de juego de comprensión lectora
   * @param {Object} gameData - Datos del juego
   * @returns {Promise<Object>} - Registro guardado
   */
  async saveComprehensionGame(gameData) {
    try {
      const { data, error } = await supabase
        .from('comprehension_games')
        .insert([gameData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error saving comprehension game:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene los registros de juegos de velocidad de lectura para un jugador
   * @param {string} userId - ID del usuario
   * @param {string} playerId - ID del jugador
   * @param {number} limit - Número máximo de registros a devolver
   * @returns {Promise<Array>} - Lista de registros
   */
  async getSpeedReadingGames(userId, playerId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('speed_reading_games')
        .select('*')
        .eq('user_id', userId)
        .eq('player_id', playerId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching speed reading games:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene los registros de juegos de comprensión lectora para un jugador
   * @param {string} userId - ID del usuario
   * @param {string} playerId - ID del jugador
   * @param {number} limit - Número máximo de registros a devolver
   * @returns {Promise<Array>} - Lista de registros
   */
  async getComprehensionGames(userId, playerId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('comprehension_games')
        .select('*')
        .eq('user_id', userId)
        .eq('player_id', playerId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching comprehension games:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene estadísticas de juegos de velocidad de lectura para un jugador
   * @param {string} userId - ID del usuario
   * @param {string} playerId - ID del jugador
   * @returns {Promise<Object>} - Estadísticas
   */
  async getSpeedReadingStats(userId, playerId) {
    try {
      const { data, error } = await supabase
        .from('speed_reading_games')
        .select('*')
        .eq('user_id', userId)
        .eq('player_id', playerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return {
          gamesPlayed: 0,
          totalWords: 0,
          averageTime: 0,
          bestTime: 0,
          lastGameDate: null
        };
      }
      
      // Calcular estadísticas
      const gamesPlayed = data.length;
      const totalWords = data.reduce((sum, game) => sum + game.word_count, 0);
      const averageTime = data.reduce((sum, game) => sum + game.average_time, 0) / gamesPlayed;
      const bestTime = Math.min(...data.map(game => game.average_time));
      const lastGameDate = new Date(data[0].created_at);
      
      return {
        gamesPlayed,
        totalWords,
        averageTime,
        bestTime,
        lastGameDate
      };
    } catch (error) {
      console.error('Error fetching speed reading stats:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene estadísticas de juegos de comprensión lectora para un jugador
   * @param {string} userId - ID del usuario
   * @param {string} playerId - ID del jugador
   * @returns {Promise<Object>} - Estadísticas
   */
  async getComprehensionStats(userId, playerId) {
    try {
      const { data, error } = await supabase
        .from('comprehension_games')
        .select('*')
        .eq('user_id', userId)
        .eq('player_id', playerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return {
          gamesPlayed: 0,
          totalTexts: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          accuracy: 0,
          averageReadingTime: 0,
          averageAnswerTime: 0,
          lastGameDate: null
        };
      }
      
      // Calcular estadísticas
      const gamesPlayed = data.length;
      const totalTexts = gamesPlayed;
      const totalQuestions = data.reduce((sum, game) => sum + game.total_questions, 0);
      const correctAnswers = data.reduce((sum, game) => sum + game.correct_answers, 0);
      const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      const averageReadingTime = data.reduce((sum, game) => sum + game.average_reading_time, 0) / gamesPlayed;
      const averageAnswerTime = data.reduce((sum, game) => sum + (game.total_answer_time / game.total_questions), 0) / gamesPlayed;
      const lastGameDate = new Date(data[0].created_at);
      
      return {
        gamesPlayed,
        totalTexts,
        totalQuestions,
        correctAnswers,
        accuracy,
        averageReadingTime,
        averageAnswerTime,
        lastGameDate
      };
    } catch (error) {
      console.error('Error fetching comprehension stats:', error);
      throw error;
    }
  }
}; 