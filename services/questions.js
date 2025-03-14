import { supabase } from '@/services/supabase';
import { textsService } from '@/services/texts';

export const questionsService = {
  /**
   * Obtiene preguntas para un texto específico según el nivel máximo
   * @param {string} textId - ID del texto
   * @param {number} maxLevel - Nivel máximo de las preguntas
   * @returns {Promise<Array>} - Lista de preguntas
   */
  async getQuestionsByTextId(textId, maxLevel) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('text_id', textId)
        .lte('level', maxLevel)
        .order('level', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching questions by text ID:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene un texto con sus preguntas según el idioma y nivel máximo
   * @param {string} language - Idioma del texto (es, en)
   * @param {number} maxLevel - Nivel máximo del texto y preguntas
   * @returns {Promise<Object>} - Texto con preguntas
   */
  async getRandomTextWithQuestions(language, maxLevel) {
    try {
      // Primero obtenemos un texto aleatorio
      const text = await textsService.getRandomText(language, maxLevel);
      
      if (!text) {
        throw new Error('No text found for the specified language and level');
      }
      
      // Luego obtenemos las preguntas para ese texto
      const questions = await this.getQuestionsByTextId(text.id, maxLevel);
      
      return {
        text,
        questions
      };
    } catch (error) {
      console.error('Error fetching random text with questions:', error);
      throw error;
    }
  },
  
  /**
   * Añade una nueva pregunta
   * @param {Object} question - Datos de la pregunta
   * @returns {Promise<Object>} - Pregunta creada
   */
  async addQuestion(question) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([question])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  },
  
  /**
   * Actualiza una pregunta existente
   * @param {string} id - ID de la pregunta
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} - Pregunta actualizada
   */
  async updateQuestion(id, updates) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },
  
  /**
   * Elimina una pregunta
   * @param {string} id - ID de la pregunta
   * @returns {Promise<void>}
   */
  async deleteQuestion(id) {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }
}; 