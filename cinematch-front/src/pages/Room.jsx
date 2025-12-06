import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Loader2, Copy, Check } from 'lucide-react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import MatchModal from '../components/MatchModal';

export default function Room() {
  const { code } = useParams();
  
  const [movies, setMovies] = useState([]);
  const [allLoadedMovies, setAllLoadedMovies] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [matchedMovie, setMatchedMovie] = useState(null);
  const [copied, setCopied] = useState(false); 

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await api.get(`/movies?roomCode=${code}&page=1`);
        setMovies(response.data);
        setAllLoadedMovies(response.data); 
      } catch (error) {
        console.error("Erro ao buscar filmes", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [code]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (matchedMovie) return; 

      try {
        const response = await api.get('/rooms/status', {
            params: { code: code }
        }); 
        
        if (response.data.hasMatch) {
          const matchId = response.data.movieId;
          const movieDetails = allLoadedMovies.find(m => m.id === matchId) || { 
             title: 'Carregando detalhes...', 
             id: matchId, 
             poster_path: null 
          };
          setMatchedMovie(movieDetails);
          clearInterval(interval); 
        }
      } catch (error) {
        console.error("Erro no polling:", error);
      }
    }, 3000); 

    return () => clearInterval(interval);
  }, [matchedMovie, movies, code, allLoadedMovies]); 

  const handleVote = async (movie, voteType) => {
    setMovies((prev) => prev.filter((m) => m.id !== movie.id));
    try {
      await api.post('/votes', {
        movieId: movie.id,
        vote: voteType,
        movieTitle: movie.title,
        roomCode: code 
      });
    } catch (error) {
      console.error("Erro ao enviar voto", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden relative">
      
      {matchedMovie && <MatchModal movie={matchedMovie} />}

      <div className="pt-8 pb-4 flex justify-center z-50 bg-gradient-to-b from-gray-900 to-transparent">
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-3 bg-gray-800/80 px-6 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg active:scale-95 transition-all cursor-pointer group hover:border-red-500/50"
          >
            <div className="flex flex-col items-start">
                <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Sala</span>
                <span className="text-white font-mono font-bold text-xl leading-none">{code}</span>
            </div>
            <div className="pl-3 border-l border-white/10 text-gray-400 group-hover:text-white transition-colors">
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </div>
          </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative w-full">
        
        <div className="relative w-full max-w-sm h-[70vh] max-h-[600px] px-4">
            <AnimatePresence>
              {movies.map((movie, index) => {
                if (index > 1) return null;
                const isFront = index === 0;
                return (
                  <DraggableCard 
                    key={movie.id} 
                    movie={movie} 
                    isFront={isFront} 
                    onVote={handleVote} 
                  />
                );
              }).reverse()}
            </AnimatePresence>

            {movies.length === 0 && !matchedMovie && (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 animate-pulse">
                <p className="text-2xl font-bold mb-2">Aguardando...</p>
                <p className="text-sm">Seus amigos ainda estão votando.</p>
              </div>
            )}
        </div>
      </div>

      <div className="pb-8 pt-4 text-center">
        <p className="text-gray-600 text-xs animate-bounce">
          ← Deslize para ignorar | Deslize para curtir →
        </p>
      </div>
    </div>
  );
}

function DraggableCard({ movie, isFront, onVote }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onVote(movie, 'LIKE');
    } else if (info.offset.x < -threshold) {
      onVote(movie, 'DISLIKE');
    }
  };

  return (
    <motion.div
      style={{ x, rotate, zIndex: isFront ? 10 : 0, scale: isFront ? 1 : 0.95 }} 
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: isFront ? 1 : 0.95, opacity: 1 }}
      exit={{ x: x.get() < 0 ? -500 : 500, opacity: 0, transition: { duration: 0.2 } }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      <MovieCard movie={movie} />
      
      <motion.div 
        style={{ opacity: useTransform(x, [50, 150], [0, 1]) }}
        className="absolute top-10 left-10 border-4 border-green-500 text-green-500 font-bold text-4xl p-2 rounded transform -rotate-12 bg-black/40 z-50 pointer-events-none"
      >
        LIKE
      </motion.div>
      <motion.div 
        style={{ opacity: useTransform(x, [-50, -150], [0, 1]) }}
        className="absolute top-10 right-10 border-4 border-red-500 text-red-500 font-bold text-4xl p-2 rounded transform rotate-12 bg-black/40 z-50 pointer-events-none"
      >
        NOPE
      </motion.div>
    </motion.div>
  );
}