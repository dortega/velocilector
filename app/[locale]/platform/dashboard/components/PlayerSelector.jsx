'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function PlayerSelector({ players, onSelectPlayer, selectedPlayerId }) {
  const t = useTranslations('platform.dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Jugador seleccionado actualmente
  const selectedPlayer = players.find(p => p.id === selectedPlayerId);
  
  // Filtrar jugadores según el término de búsqueda
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Manejar la selección de un jugador
  const handleSelectPlayer = (playerId) => {
    onSelectPlayer(playerId);
    setIsOpen(false);
    setIsModalOpen(false);
    setSearchTerm('');
  };
  
  // Renderizar el selector de jugador para pantallas grandes
  const renderDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="btn btn-outline border-green-600 text-green-600 hover:bg-green-50 w-full md:w-64 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedPlayer ? (
          <div className="flex items-center gap-2">
            {selectedPlayer.avatar_url && (
              <div className="avatar">
                <div className="w-6 h-6 rounded-full">
                  <Image 
                    src={selectedPlayer.avatar_url} 
                    alt={selectedPlayer.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </div>
              </div>
            )}
            <span>{selectedPlayer.name}</span>
          </div>
        ) : (
          <span>{t('selectPlayer')}</span>
        )}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2">
            <input
              type="text"
              placeholder={t('searchPlayer')}
              className="input input-bordered w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <ul className="py-1">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map(player => (
                <li 
                  key={player.id}
                  className={`px-4 py-2 hover:bg-green-50 cursor-pointer flex items-center gap-2 ${player.id === selectedPlayerId ? 'bg-green-100' : ''}`}
                  onClick={() => handleSelectPlayer(player.id)}
                >
                  {player.avatar_url && (
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full">
                        <Image 
                          src={player.avatar_url} 
                          alt={player.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <div className="text-xs text-gray-500">
                      {t(`levels.${player.reading_level}`)} • {player.age} {t('yearsOld')}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 text-center">{t('noPlayersFound')}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
  
  // Renderizar el modal para dispositivos móviles
  const renderModal = () => (
    <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">{t('selectPlayer')}</h3>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder={t('searchPlayer')}
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="max-h-60 overflow-auto">
          {filteredPlayers.length > 0 ? (
            <ul className="space-y-2">
              {filteredPlayers.map(player => (
                <li 
                  key={player.id}
                  className={`p-3 rounded-lg hover:bg-green-50 cursor-pointer flex items-center gap-3 ${player.id === selectedPlayerId ? 'bg-green-100' : 'bg-base-200'}`}
                  onClick={() => handleSelectPlayer(player.id)}
                >
                  {player.avatar_url && (
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full">
                        <Image 
                          src={player.avatar_url} 
                          alt={player.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-lg">{player.name}</div>
                    <div className="text-sm text-gray-500">
                      {t(`levels.${player.reading_level}`)} • {player.age} {t('yearsOld')}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">{t('noPlayersFound')}</div>
          )}
        </div>
        
        <div className="modal-action">
          <button className="btn" onClick={() => setIsModalOpen(false)}>{t('cancel')}</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
        <button>close</button>
      </form>
    </dialog>
  );
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('selectPlayer')}</h2>
        
        {/* Botón para abrir el modal en dispositivos móviles */}
        <button 
          className="btn btn-sm btn-circle md:hidden"
          onClick={() => setIsModalOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>
      </div>
      
      {/* Dropdown para pantallas medianas y grandes */}
      <div className="hidden md:block">
        {renderDropdown()}
      </div>
      
      {/* Selector compacto para móviles */}
      <div className="md:hidden">
        <button 
          className="btn btn-outline border-green-600 text-green-600 hover:bg-green-50 w-full flex justify-between items-center"
          onClick={() => setIsModalOpen(true)}
        >
          {selectedPlayer ? (
            <div className="flex items-center gap-2">
              {selectedPlayer.avatar_url && (
                <div className="avatar">
                  <div className="w-6 h-6 rounded-full">
                    <Image 
                      src={selectedPlayer.avatar_url} 
                      alt={selectedPlayer.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  </div>
                </div>
              )}
              <span>{selectedPlayer.name}</span>
            </div>
          ) : (
            <span>{t('selectPlayer')}</span>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
      
      {/* Modal para selección en dispositivos móviles */}
      {renderModal()}
    </div>
  );
} 