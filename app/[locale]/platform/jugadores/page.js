'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { avatarService } from '@/services/avatar';
import { playersService } from '@/services/players';
import PlayerCard from './components/PlayerCard';
import PlayerModal from './components/PlayerModal';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AddIcon from '@mui/icons-material/Add';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const toastRef = useRef(null);
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(false);

  // Función para mostrar toast
  const showToast = useCallback((message, type = 'info') => {
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
  }, []);

  // Función para obtener jugadores
  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await playersService.getPlayers();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
      showToast(t('errorFetchingData'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  // Cargar jugadores al montar el componente
  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  // Función para abrir el modal de creación
  const handleAddPlayer = () => {
    setCurrentPlayer(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Función para abrir el modal de edición
  const handleEditPlayer = (player) => {
    setCurrentPlayer(player);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Función para guardar un jugador (crear o actualizar)
  const handleSavePlayer = async (playerData) => {
    try {
      console.log("Player data to save:", playerData);
      setIsProcessing(true);
      
      let savedPlayer;
      
      if (isEditing) {
        // Actualizar jugador existente
        savedPlayer = await playersService.updatePlayer(playerData.id, playerData);
        showToast(t('players.playerUpdated'), 'success');
      } else {
        // Crear nuevo jugador
        savedPlayer = await playersService.createPlayer(playerData);
        showToast(t('players.playerCreated'), 'success');
        
        // Generar avatar para el nuevo jugador
        try {
          const { url } = await avatarService.regenerateAndSaveAvatar(savedPlayer);
          savedPlayer.avatar_url = url;
        } catch (avatarError) {
          console.error('Error generating initial avatar:', avatarError);
          // No mostramos error aquí, el jugador se creó correctamente
        }
      }
      
      // Actualizar la lista de jugadores
      await fetchPlayers();
      
    } catch (error) {
      console.error('Error saving player:', error);
      showToast(t('players.errorSaving'), 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Función para eliminar un jugador
  const handleDeletePlayer = async (player) => {
    try {
      if (!confirm(t('players.confirmDelete'))) {
        return;
      }
      
      setIsProcessing(true);
      await playersService.deletePlayer(player.id);
      
      // Actualizar la lista de jugadores
      setPlayers(players.filter(p => p.id !== player.id));
      showToast(t('players.playerDeleted'), 'success');
    } catch (error) {
      console.error('Error deleting player:', error);
      showToast(t('players.errorDeleting'), 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Función para regenerar el avatar de un jugador
  const handleRegenerateAvatar = async (player) => {
    try {
      setIsProcessing(true);
      // Marcar este jugador como en regeneración
      setRegeneratingAvatars(prev => ({ ...prev, [player.id]: true }));
      
      showToast(t('players.generatingAvatar'), 'info');
      
      // Llamar al servicio para regenerar y guardar el avatar
      const { url, updatedPlayer } = await avatarService.regenerateAndSaveAvatar(player);
      
      // Actualizar solo este jugador en el estado local
      setPlayers(prevPlayers => 
        prevPlayers.map(p => 
          p.id === player.id ? { ...p, avatar_url: url } : p
        )
      );
      
      // Mostrar un toast de éxito
      showToast(t('players.avatarRegenerated'), 'success');
    } catch (error) {
      console.error('Error regenerating avatar:', error);
      showToast(t('players.errorRegeneratingAvatar'), 'error');
    } finally {
      // Desmarcar este jugador como en regeneración
      setRegeneratingAvatars(prev => ({ ...prev, [player.id]: false }));
      setIsProcessing(false);
    }
  };

  // Función para manejar el toggle del candado
  const handleToggleEditLock = () => {
    if (!isEditingEnabled) {
      setShowUnlockConfirm(true);
    } else {
      setIsEditingEnabled(false);
    }
  };

  // Función para confirmar el desbloqueo
  const confirmUnlock = () => {
    setIsEditingEnabled(true);
    setShowUnlockConfirm(false);
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
      
      {/* Toast para mensajes - adaptado para móvil */}
      <div 
        ref={toastRef}
        className={`toast toast-top toast-center z-50 hidden transition-all duration-300 w-auto max-w-[90vw] sm:max-w-md ${
          toastType === 'error' ? 'alert-error' : 
          toastType === 'success' ? 'alert-success' : 
          toastType === 'warning' ? 'alert-warning' : 'bg-green-100 text-green-800'
        }`}
      >
        <div className="alert">
          <span>{toastMessage}</span>
        </div>
      </div>
      
      {/* Encabezado adaptado para móvil */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{t('players.title')}</h1>
          <button 
            onClick={handleToggleEditLock}
            className={`btn btn-circle btn-sm ${isEditingEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white border-none`}
            aria-label={isEditingEnabled ? t('players.lockEditing') : t('players.unlockEditing')}
          >
            {isEditingEnabled ? <LockOpenIcon fontSize="small" /> : <LockIcon fontSize="small" />}
          </button>
        </div>
        <button 
          className="btn bg-green-500 hover:bg-green-600 text-white border-none w-full sm:w-auto"
          onClick={handleAddPlayer}
          disabled={isProcessing}
        >
          <AddIcon className="mr-2" />
          {t('players.addPlayer')}
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : players.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-base-content opacity-20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">{t('players.noPlayersYet')}</h2>
          <p className="text-base-content opacity-70 mb-6">{t('players.createYourFirstPlayer')}</p>
          <button 
            className="btn bg-green-500 hover:bg-green-600 text-white border-none"
            onClick={handleAddPlayer}
            disabled={isProcessing}
          >
            <AddIcon className="mr-2" />
            {t('players.addPlayer')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {players.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              onEdit={handleEditPlayer}
              onDelete={handleDeletePlayer}
              onRegenerateAvatar={handleRegenerateAvatar}
              isRegenerating={regeneratingAvatars[player.id]}
              isProcessing={isProcessing}
              isEditingEnabled={isEditingEnabled}
            />
          ))}
        </div>
      )}
      
      {/* Player modal */}
      <PlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlayer}
        player={currentPlayer}
        isEditing={isEditing}
      />
      
      {/* Modal de confirmación para desbloquear edición */}
      <dialog id="unlock_confirm_modal" className={`modal ${showUnlockConfirm ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-sm mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">{t('players.unlockEditingTitle')}</h3>
            <button 
              onClick={() => setShowUnlockConfirm(false)}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="py-4">{t('players.unlockEditingDescription')}</p>
          <div className="mt-6">
            <button 
              className="btn bg-green-500 hover:bg-green-600 text-white border-none w-full"
              onClick={confirmUnlock}
            >
              <LockOpenIcon className="mr-2" />
              {t('players.unlockEditing')}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowUnlockConfirm(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
} 