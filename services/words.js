import { supabase } from '@/services/supabase';

export const wordsService = {
  /**
   * Obtiene palabras según el idioma y nivel máximo
   * @param {string} language - Idioma de las palabras (es, en)
   * @param {number} maxLevel - Nivel máximo de las palabras
   * @param {number} limit - Número máximo de palabras a devolver
   * @returns {Promise<Array>} - Lista de palabras
   */
  async getWords(language, maxLevel, limit = 100) {
    try {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .eq('language', language)
        .lte('level', maxLevel)
        .order('level', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching words:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene palabras aleatorias según el idioma y nivel máximo
   * @param {string} language - Idioma de las palabras (es, en)
   * @param {number} maxLevel - Nivel máximo de las palabras
   * @param {number} limit - Número de palabras aleatorias a devolver
   * @returns {Promise<Array>} - Lista de palabras aleatorias
   */
  async getRandomWords(language, maxLevel, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .eq('language', language)
        .lte('level', maxLevel)
        .limit(limit);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        for (let i = data.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [data[i], data[j]] = [data[j], data[i]];
        }
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching random words:', error);
      throw error;
    }
  },
  
  /**
   * Añade una nueva palabra
   * @param {Object} word - Datos de la palabra
   * @returns {Promise<Object>} - Palabra creada
   */
  async addWord(word) {
    try {
      const { data, error } = await supabase
        .from('words')
        .insert([word])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding word:', error);
      throw error;
    }
  },
  
  /**
   * Actualiza una palabra existente
   * @param {string} id - ID de la palabra
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} - Palabra actualizada
   */
  async updateWord(id, updates) {
    try {
      const { data, error } = await supabase
        .from('words')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating word:', error);
      throw error;
    }
  },
  
  /**
   * Elimina una palabra
   * @param {string} id - ID de la palabra
   * @returns {Promise<void>}
   */
  async deleteWord(id) {
    try {
      const { error } = await supabase
        .from('words')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting word:', error);
      throw error;
    }
  }
}; 