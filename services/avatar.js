import { supabase } from './supabase';

export const avatarService = {
  generateAvatar: async (player) => {
    try {
      console.log("Avatar service received:", player);
      
      // Construir la URL de la API con los parámetros del jugador
      const apiUrl = `/api/generate-avatar?gender=${player.gender}&hairColor=${player.hair_color}&hairStyle=${player.hair_style}&skinTone=${player.skin_tone}&eyeColor=${player.eye_color}&age=${player.age || '10'}`;
      
      console.log("Calling API:", apiUrl);
      
      const response = await fetch(apiUrl);
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      // Intentar analizar la respuesta como JSON con manejo de errores
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        const responseText = await response.text();
        console.error("Raw response:", responseText);
        throw new Error("Invalid JSON response from avatar API");
      }
      
      console.log("API response:", data);
      
      if (!data.avatarUrl) {
        throw new Error("No avatar URL in response");
      }
      
      return { url: data.avatarUrl };
    } catch (error) {
      console.error("Error in avatarService.generateAvatar:", error);
      throw error;
    }
  }
}; 