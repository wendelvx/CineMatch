import React from 'react';
import { Star, Calendar } from 'lucide-react';

const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ movie }) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gray-800 select-none">
      <img 
        src={movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Sem+Imagem'} 
        alt={movie.title}
        className="w-full h-full object-cover pointer-events-none" // pointer-events-none evita arrastar a imagem em vez do card
      />

      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-20 pb-6 px-6">
        
        {/* Título */}
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
            <span>{movie.release_date || 'N/A'}</span>
          </div>
        </div>

        <p className="text-gray-400 text-sm mt-3 line-clamp-2">
          {movie.overview}
        </p>
      </div>
    </div>
  );
}