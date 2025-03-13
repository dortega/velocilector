'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import CreateIcon from '@mui/icons-material/Create';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';
import CakeIcon from '@mui/icons-material/Cake';

export default function PlayerCard({ 
  player, 
  onEdit, 
  onDelete, 
  onRegenerateAvatar, 
  isRegenerating, 
  isProcessing,
  isEditingEnabled = false
}) {
  const t = useTranslations();
  
  // Función para obtener el color de fondo según el nivel de lectura
  const getReadingLevelColor = (level) => {
    const levelNum = parseInt(level);
    if (levelNum <= 2) return 'bg-emerald-100 text-emerald-800'; // Principiante
    if (levelNum <= 4) return 'bg-blue-100 text-blue-800';       // Elemental
    if (levelNum <= 6) return 'bg-purple-100 text-purple-800';   // Intermedio
    if (levelNum <= 8) return 'bg-amber-100 text-amber-800';     // Avanzado
    return 'bg-rose-100 text-rose-800';                          // Experto
  };

  // Función para obtener el nombre del nivel de lectura
  const getReadingLevelName = (level) => {
    const levelNum = parseInt(level);
    if (levelNum <= 2) return t('players.beginner');
    if (levelNum <= 4) return t('players.elementary');
    if (levelNum <= 6) return t('players.intermediate');
    if (levelNum <= 8) return t('players.advanced');
    return t('players.expert');
  };
  
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
            />
            {isEditingEnabled && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRegenerateAvatar(player);
                }}
                className="absolute bottom-2 right-2 btn btn-circle btn-sm bg-base-100 bg-opacity-70 hover:bg-opacity-100 text-green-600 border-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title={t('players.regenerateAvatar')}
                disabled={isRegenerating || isProcessing}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            )}
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
      <div className="card-body p-4">
        {/* Nombre con estilo mejorado */}
        <h2 className="card-title text-xl font-bold text-green-600 mb-2">{player.name}</h2>
        
        {/* Información con iconos y mejor formato */}
        <div className="flex flex-col gap-3">
          {/* Edad con icono de pastel */}
          <div className="flex items-center gap-2">
            <div className="bg-green-50 p-2 rounded-full">
              <CakeIcon className="text-green-500" fontSize="small" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">{t('players.age')}</div>
              <div className="font-semibold">{player.age || t('noEspecificada')}</div>
            </div>
          </div>
          
          {/* Nivel de lectura con icono de escuela y badge de color */}
          <div className="flex items-center gap-2">
            <div className="bg-green-50 p-2 rounded-full">
              <SchoolIcon className="text-green-500" fontSize="small" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 font-medium">{t('players.readingLevel')}</div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{player.reading_level || t('noEspecificada')}</span>
                {player.reading_level && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getReadingLevelColor(player.reading_level)}`}>
                    {getReadingLevelName(player.reading_level)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Botones de editar/eliminar solo visibles si isEditingEnabled es true */}
        {isEditingEnabled && (
          <div className="flex gap-3 mt-4">
            <button
              className="btn h-12 bg-green-500 hover:bg-green-600 text-white flex-1 flex items-center justify-center transition-all border-none shadow-md hover:shadow-lg"
              onClick={() => onEdit(player)}
              disabled={isRegenerating || isProcessing}
              aria-label={t('players.edit')}
            >
              <CreateIcon style={{ fontSize: 28 }} />
            </button>
            <button
              className="btn h-12 bg-rose-500 hover:bg-rose-600 text-white flex-1 flex items-center justify-center transition-all border-none shadow-md hover:shadow-lg"
              onClick={() => onDelete(player)}
              disabled={isRegenerating || isProcessing}
              aria-label={t('players.delete')}
            >
              <CancelIcon style={{ fontSize: 28 }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 