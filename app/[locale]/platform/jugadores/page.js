'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/services/supabase';
import Image from 'next/image';
import { avatarService } from '@/services/avatar';
import PlayerModal from './components/JugadorModal';

export default function PlayersPage() {
  const t = useTranslations();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regeneratingAvatars, setRegeneratingAvatars] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const toastRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Function to show a toast
  const showToast = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    
    if (toastRef.current) {
      toastRef.current.classList.remove('hidden');
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        if (toastRef.current) {
          toastRef.current.classList.add('hidden');
        }
      }, 3000);
    }
  };

  async function fetchPlayers() {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }
      
      // Usar la nueva tabla "players"
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      console.log("Players fetched:", data);
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
      showToast(t('errorFetchingData'), 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleAddPlayer = () => {
    setCurrentPlayer(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditPlayer = (player) => {
    setCurrentPlayer(player);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeletePlayer = async (player) => {
    if (window.confirm(t('players.confirmDelete'))) {
      try {
        setIsProcessing(true);
        const { error } = await supabase
          .from('players') // Usar la nueva tabla
          .delete()
          .eq('id', player.id);
          
        if (error) throw error;
        
        fetchPlayers();
        showToast(t('players.playerDeleted'), 'success');
      } catch (error) {
        console.error('Error deleting player:', error);
        showToast(t('players.errorDeleting'), 'error');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSavePlayer = async (playerData) => {
    try {
      console.log("Player data to save:", playerData);
      setIsProcessing(true); // Bloquear la pantalla mientras se procesa
      
      // El modal ya se ha cerrado en este punto
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }
      
      // Convert reading_level from text to number
      let readingLevelNumeric;
      switch (playerData.reading_level) {
        case 'principiante':
          readingLevelNumeric = 2;
          break;
        case 'elemental':
          readingLevelNumeric = 4;
          break;
        case 'intermedio':
          readingLevelNumeric = 6;
          break;
        case 'avanzado':
          readingLevelNumeric = 8;
          break;
        case 'experto':
          readingLevelNumeric = 10;
          break;
        default:
          readingLevelNumeric = 5; // Default value
      }
      
      // Create object with processed data using the new field names
      const processedPlayer = {
        name: playerData.name,
        age: playerData.age,
        reading_level: readingLevelNumeric,
        gender: playerData.gender,
        hair_color: playerData.hair_color,
        hair_style: playerData.hair_style,
        skin_tone: playerData.skin_tone,
        eye_color: playerData.eye_color,
        user_id: session.user.id
      };
      
      console.log("Processed data to save:", processedPlayer);
      
      let savedPlayer;
      
      if (isEditing && playerData.id) {
        console.log("Edit mode - Updating existing player");
        // Update existing player
        const { data, error } = await supabase
          .from('players')
          .update(processedPlayer)
          .eq('id', playerData.id)
          .select();
          
        if (error) {
          console.error("Supabase error when updating:", error);
          throw error;
        }
        
        savedPlayer = data[0];
        console.log("Player updated:", savedPlayer);
        
        // If physical characteristics were updated, regenerate the avatar
        const characteristicsChanged = 
          playerData.gender !== currentPlayer.gender ||
          playerData.hair_color !== currentPlayer.hair_color ||
          playerData.hair_style !== currentPlayer.hair_style ||
          playerData.skin_tone !== currentPlayer.skin_tone ||
          playerData.eye_color !== currentPlayer.eye_color;
        
        if (characteristicsChanged) {
          console.log("Physical characteristics changed, regenerating avatar...");
          await generateAvatarForPlayer(savedPlayer);
        }
        
        showToast(t('players.playerUpdated'), 'success');
      } else {
        console.log("Create mode - Adding new player");
        // Add new player
        const { data, error } = await supabase
          .from('players')
          .insert([processedPlayer])
          .select();
          
        if (error) {
          console.error("Supabase error when inserting:", error);
          throw error;
        }
        
        savedPlayer = data[0];
        console.log("Player added:", savedPlayer);
        
        // Generate avatar for the new player
        console.log("Generating avatar for new player...");
        await generateAvatarForPlayer(savedPlayer);
        
        showToast(t('players.playerAdded'), 'success');
      }
      
      // Close the modal and update the list
      setIsModalOpen(false);
      fetchPlayers();
    } catch (error) {
      console.error('Error saving player:', error);
      showToast(t('players.errorSaving'), 'error');
    } finally {
      setIsProcessing(false); // Desbloquear la pantalla
    }
  };

  // Function to generate avatar for a player
  const generateAvatarForPlayer = async (player) => {
    try {
      console.log("Calling avatarService.generateAvatar with:", player);
      
      // Show a loading toast
      showToast(t('players.generatingAvatar'), 'info');
      
      // Call the service to generate a new avatar
      const { url } = await avatarService.generateAvatar(player);
      
      console.log("Generated avatar URL:", url);
      
      if (!url) {
        throw new Error("No avatar URL received");
      }
      
      // Update the player with the new avatar URL
      const { error } = await supabase
        .from('players')
        .update({ avatar_url: url })
        .eq('id', player.id);
        
      if (error) {
        console.error("Error updating avatar URL:", error);
        throw error;
      }
      
      console.log("Avatar updated in database");
      return url;
    } catch (error) {
      console.error('Error generating avatar:', error);
      showToast(t('players.errorRegeneratingAvatar'), 'warning');
      return null;
    }
  };

  const handleRegenerateAvatar = async (player) => {
    try {
      setIsProcessing(true);
      // Mark this player as being regenerated
      setRegeneratingAvatars(prev => ({ ...prev, [player.id]: true }));
      
      showToast(t('players.generatingAvatar'), 'info');
      
      // Call the service to generate a new avatar
      const { url } = await avatarService.generateAvatar(player);
      
      // Update the player with the new avatar URL
      const { error } = await supabase
        .from('players')
        .update({ avatar_url: url })
        .eq('id', player.id);
        
      if (error) throw error;
      
      // Update only this player in the local state
      setPlayers(prevPlayers => 
        prevPlayers.map(p => 
          p.id === player.id ? { ...p, avatar_url: url } : p
        )
      );
      
      // Show a success toast
      showToast(t('players.avatarRegenerated'), 'success');
    } catch (error) {
      console.error('Error regenerating avatar:', error);
      showToast(t('players.errorRegeneratingAvatar'), 'error');
    } finally {
      // Unmark this player as being regenerated
      setRegeneratingAvatars(prev => ({ ...prev, [player.id]: false }));
      setIsProcessing(false);
    }
  };

  // Player card component with specific loading indicator
  const PlayerCard = ({ player, onEdit, onDelete, onRegenerateAvatar }) => {
    const isRegenerating = regeneratingAvatars[player.id];
    
    return (
      <div className="card bg-base-100 shadow-xl h-full">
        <figure className="relative pt-4 px-4 pb-0">
          {player.avatar_url ? (
            <div className="w-full aspect-square rounded-xl overflow-hidden relative group">
              {isRegenerating ? (
                <div className="absolute inset-0 flex items-center justify-center bg-base-200 bg-opacity-70 z-20">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : null}
              <Image
                src={player.avatar_url}
                alt={player.name}
                width={300}
                height={300}
                className="w-full h-full object-cover"
                onClick={() => onEdit(player)}
                style={{ cursor: 'pointer' }}
              />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRegenerateAvatar(player);
                }}
                className="absolute bottom-2 right-2 btn btn-circle btn-sm bg-base-100 bg-opacity-70 hover:bg-opacity-100 text-primary border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title={t('players.regenerateAvatar')}
                disabled={isRegenerating || isProcessing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-full aspect-square rounded-xl bg-base-200 flex items-center justify-center">
              {isRegenerating ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-base-content opacity-20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              )}
            </div>
          )}
        </figure>
        <div className="card-body">
          <h2 className="card-title">{player.name}</h2>
          <div className="flex flex-col gap-1 text-sm">
            <p>
              <span className="font-semibold">{t('players.age')}:</span>{' '}
              {player.age || t('noEspecificada')}
            </p>
            <p>
              <span className="font-semibold">{t('players.readingLevel')}:</span>{' '}
              {player.reading_level || t('noEspecificada')}
            </p>
          </div>
          <div className="card-actions justify-end mt-2">
            <button
              className="btn btn-sm btn-outline"
              onClick={() => onEdit(player)}
              disabled={isRegenerating || isProcessing}
            >
              {t('players.edit')}
            </button>
            <button
              className="btn btn-sm btn-error btn-outline"
              onClick={() => onDelete(player)}
              disabled={isRegenerating || isProcessing}
            >
              {t('players.delete')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 relative">
      {/* Overlay de carga para bloquear la pantalla */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-lg shadow-xl flex flex-col items-center">
            <span className="loading loading-spinner loading-lg mb-4"></span>
            <p className="text-lg font-medium">{t('players.processing')}</p>
          </div>
        </div>
      )}
      
      {/* DaisyUI Toast */}
      <div className="toast toast-top toast-end z-50">
        <div 
          ref={toastRef}
          className={`alert ${
            toastType === 'success' ? 'alert-success' : 
            toastType === 'error' ? 'alert-error' : 
            toastType === 'warning' ? 'alert-warning' : 
            'alert-info'
          } hidden`}
        >
          <span>{toastMessage}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('players.title')}</h1>
        <button
          className="btn btn-primary"
          onClick={handleAddPlayer}
          disabled={loading}
        >
          {t('players.addNew')}
        </button>
      </div>
      
      {loading && players.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          {players.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onEdit={handleEditPlayer}
                  onDelete={handleDeletePlayer}
                  onRegenerateAvatar={handleRegenerateAvatar}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg mb-4">{t('players.noPlayersYet')}</p>
              <button
                className="btn btn-primary"
                onClick={handleAddPlayer}
              >
                {t('players.addFirst')}
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Player modal */}
      <PlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlayer}
        player={currentPlayer}
        isEditing={isEditing}
      />
    </div>
  );
} 