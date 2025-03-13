import { supabase } from './supabase';
import { avatarService } from './avatar';

export const jugadoresService = {
  async getJugadores() {
    const { data, error } = await supabase
      .from('jugadores')
      .select('*')
      .order('nombre');
    
    if (error) throw error;
    return data;
  },
  
  async getJugador(id) {
    const { data, error } = await supabase
      .from('jugadores')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async crearJugador(jugador) {
    // Primero generamos el avatar si tenemos todos los datos necesarios
    let avatar_url = null;
    
    if (jugador.gender && jugador.hair_color && jugador.hair_style && jugador.skin_tone) {
      try {
        const avatar = await avatarService.generateAvatar(jugador);
        avatar_url = avatar.url;
      } catch (error) {
        console.error('Error generating avatar:', error);
        // Continuamos sin avatar si hay error
      }
    }
    
    // Añadimos la URL del avatar al jugador
    const jugadorConAvatar = {
      ...jugador,
      avatar_url
    };
    
    const { data, error } = await supabase
      .from('jugadores')
      .insert([jugadorConAvatar])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async actualizarJugador(id, updates) {
    // Si se actualizan los datos de apariencia, regeneramos el avatar
    let avatar_url = updates.avatar_url;
    
    const { data: jugadorActual } = await supabase
      .from('jugadores')
      .select('*')
      .eq('id', id)
      .single();
      
    const cambioApariencia = 
      updates.gender !== undefined || 
      updates.hair_color !== undefined || 
      updates.hair_style !== undefined || 
      updates.skin_tone !== undefined ||
      updates.edad !== undefined;
    
    if (cambioApariencia) {
      const jugadorCompleto = {
        ...jugadorActual,
        ...updates
      };
      
      if (jugadorCompleto.gender && jugadorCompleto.hair_color && 
          jugadorCompleto.hair_style && jugadorCompleto.skin_tone) {
        try {
          const avatar = await avatarService.generateAvatar(jugadorCompleto);
          avatar_url = avatar.url;
        } catch (error) {
          console.error('Error regenerating avatar:', error);
          // Mantenemos el avatar actual si hay error
        }
      }
    }
    
    const updatesConAvatar = {
      ...updates,
      ...(avatar_url ? { avatar_url } : {})
    };
    
    const { data, error } = await supabase
      .from('jugadores')
      .update(updatesConAvatar)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async eliminarJugador(id) {
    const { error } = await supabase
      .from('jugadores')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}; 