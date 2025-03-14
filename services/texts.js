import { supabase } from '@/services/supabase';

export const textsService = {
  /**
   * Obtiene textos según el idioma y nivel máximo
   * @param {string} language - Idioma de los textos (es, en)
   * @param {number} maxLevel - Nivel máximo de los textos
   * @param {number} limit - Número máximo de textos a devolver
   * @returns {Promise<Array>} - Lista de textos
   */
  async getTexts(language, maxLevel, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('texts')
        .select('*')
        .eq('language', language)
        .lte('level', maxLevel)
        .order('level', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching texts:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene un texto aleatorio según el idioma y nivel máximo
   * @param {string} language - Idioma del texto (es, en)
   * @param {number} maxLevel - Nivel máximo del texto
   * @returns {Promise<Object>} - Texto aleatorio
   */
  async getRandomText(language, maxLevel) {
    try {
      const { data, error } = await supabase
        .from('texts')
        .select('*')
        .eq('language', language)
        .lte('level', maxLevel);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No texts found for the specified language and level');
      }
      
      // Seleccionar un texto aleatorio del conjunto de resultados
      const randomIndex = Math.floor(Math.random() * data.length);
      return data[randomIndex];
    } catch (error) {
      console.error('Error fetching random text:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene un texto específico por ID
   * @param {string} id - ID del texto
   * @returns {Promise<Object>} - Texto
   */
  async getTextById(id) {
    try {
      const { data, error } = await supabase
        .from('texts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching text by ID:', error);
      throw error;
    }
  },
  
  /**
   * Añade un nuevo texto
   * @param {Object} text - Datos del texto
   * @returns {Promise<Object>} - Texto creado
   */
  async addText(text) {
    try {
      const { data, error } = await supabase
        .from('texts')
        .insert([text])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding text:', error);
      throw error;
    }
  },
  
  /**
   * Actualiza un texto existente
   * @param {string} id - ID del texto
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} - Texto actualizado
   */
  async updateText(id, updates) {
    try {
      const { data, error } = await supabase
        .from('texts')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating text:', error);
      throw error;
    }
  },
  
  /**
   * Elimina un texto
   * @param {string} id - ID del texto
   * @returns {Promise<void>}
   */
  async deleteText(id) {
    try {
      const { error } = await supabase
        .from('texts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting text:', error);
      throw error;
    }
  }
}; 