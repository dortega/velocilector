import { supabase } from './supabase'

export const authService = {
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  async register(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  /**
   * Obtiene el usuario actual
   * @returns {Promise<Object|null>} - Usuario actual o null si no hay sesión
   */
  async getCurrentUser() {
    try {
      // Obtener la sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      
      // Si no hay sesión, devolver null
      if (!session) {
        return null;
      }
      
      // Devolver el usuario de la sesión
      return session.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
} 