import React, { useState } from 'react';
import { Star, Calendar, Info, X } from 'lucide-react';

const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ movie }) {
  const [showDetails, setShowDetails] = useState(false);

  
  const toggleDetails = (e) => {
    setShowDetails(!showDetails);
  };

  return (
    <div 
      onClick={toggleDetails}
      className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gray-800 select-none cursor-pointer group"
    >
      <img 
        src={movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Sem+Imagem'} 
        alt={movie.title}
        className={`w-full h-full object-cover pointer-events-none transition-transform duration-500 ${showDetails ? 'scale-110 blur-sm brightness-50' : 'group-hover:scale-105'}`}
      />

      <div className="absolute top-4 right-4 z-20">
        <div className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/20 text-white/80">
          {showDetails ? <X size={20} /> : <Info size={20} />}
        </div>
      </div>

      {showDetails && (
        <div className="absolute inset-0 z-10 flex flex-col justify-center p-6 bg-black/60 animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">{movie.title}</h2>
          
          <div className="flex-grow overflow-y-auto pr-2 scrollbar-hide">
            <p className="text-gray-200 text-lg leading-relaxed text-justify">
              {movie.overview || "Sinopse não disponível para este filme."}
            </p>
          </div>

          <p className="text-center text-gray-400 text-sm mt-4 uppercase tracking-widest">
            Toque para voltar
          </p>
        </div>
      )}

      {!showDetails && (
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-20 pb-6 px-6">
          
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md leading-tight">
            {movie.title}
          </h2>

          <div className="flex items-center gap-4 text-gray-300 font-medium">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={18} fill="#FACC15" />
              <span>{movie.vote_average?.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar size={18} />
              <span>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
            </div>
          </div>

          <p className="text-gray-500 text-xs mt-3 flex items-center gap-1">
            <Info size={12} /> Toque para ler a sinopse
          </p>
        </div>
      )}
    </div>
  );
}