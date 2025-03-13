import { supabase } from './supabase';

export const juegosService = {
  async getJuegos() {
    const { data, error } = await supabase
      .from('juegos')
      .select('*')
      .order('nombre');
    
    if (error) throw error;
    return data;
  },
  
  async getJuego(id) {
    const { data, error } = await supabase
      .from('juegos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async getPalabras(dificultadMin, dificultadMax, limite = 100) {
    const { data, error } = await supabase
      .from('palabras')
      .select('*')
      .gte('dificultad', dificultadMin)
      .lte('dificultad', dificultadMax)
      .limit(limite);
    
    if (error) throw error;
    return data;
  },
  
  async getTexto(nivel) {
    const { data, error } = await supabase
      .from('textos')
      .select('*, preguntas(*)')
      .eq('nivel', nivel)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async registrarSesion(sesion) {
    const { data, error } = await supabase
      .from('sesiones_juego')
      .insert([sesion])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async getSesionesJugador(jugadorId) {
    const { data, error } = await supabase
      .from('sesiones_juego')
      .select(`
        *,
        juego:juegos(*),
        texto:textos(*)
      `)
      .eq('jugador_id', jugadorId)
      .order('fecha', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}; 