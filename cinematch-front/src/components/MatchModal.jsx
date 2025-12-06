import React from 'react';
import { PartyPopper, Calendar, Star, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MatchModal({ movie }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-red-500/50 flex flex-col items-center text-center pb-8">
        
        {/* Cabeçalho de Celebração */}
        <div className="w-full bg-gradient-to-r from-red-600 to-red-800 p-6 mb-6">
          <div className="flex justify-center mb-2">
            <PartyPopper size={48} className="text-yellow-300 animate-bounce" />
          </div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider">
            É um Match!
          </h1>
          <p className="text-red-100 text-sm">Prepare a pipoca 🍿</p>
        </div>

        {/* Poster do Filme */}
        <div className="relative w-48 rounded-lg shadow-xl mb-6 transform hover:scale-105 transition-transform duration-300">
           <img 
            src={movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/200x300'} 
            alt={movie.title}
            className="rounded-lg object-cover"
          />
        </div>

        {/* Detalhes */}
        <h2 className="text-2xl font-bold text-white px-4 mb-2">{movie.title}</h2>
        
        <div className="flex items-center gap-4 text-gray-400 text-sm mb-8">
          <div className="flex items-center gap-1">
             <Calendar size={16} /> <span>{movie.release_date?.split('-')[0]}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
             <Star size={16} fill="currentColor"/> <span>{movie.vote_average?.toFixed(1)}</span>
          </div>
        </div>

        {/* Botão de Sair */}
        <button 
          onClick={() => navigate('/')}
          className="bg-white text-red-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all"
        >
          <Home size={20} />
          Voltar ao Início
        </button>

      </div>
    </div>
  );
}