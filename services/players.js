import { supabase } from './supabase';

export const playersService = {
  // Obtener todos los jugadores del usuario actual
  getPlayers: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }
      
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  },
  
  // Crear un nuevo jugador
  createPlayer: async (playerData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }
      
      // Añadir el ID del usuario
      const playerWithUserId = {
        ...playerData,
        user_id: session.user.id
      };
      
      const { data, error } = await supabase
        .from('players')
        .insert([playerWithUserId])
        .select();
        
      if (error) throw error;
      
      return data[0];
    } catch (error) {
      console.error('Error creating player:', error);
      throw error;
    }
  },
  
  // Actualizar un jugador existente
  updatePlayer: async (playerId, playerData) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .update(playerData)
        .eq('id', playerId)
        .select();
        
      if (error) throw error;
      
      return data[0];
    } catch (error) {
      console.error('Error updating player:', error);
      throw error;
    }
  },
  
  // Eliminar un jugador
  deletePlayer: async (playerId) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting player:', error);
      throw error;
    }
  }
}; 