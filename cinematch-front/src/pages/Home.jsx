import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Users, LogIn } from 'lucide-react';
import api from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const response = await api.post('/rooms');
      const { roomCode } = response.data;
      navigate(`/room/${roomCode}`);
    } catch (error) {
      alert('Erro ao criar sala. O servidor está rodando?');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomCode) return;

    setLoading(true);
    try {
      
      await api.post('/rooms/join', { code: roomCode });
      navigate(`/room/${roomCode}`);
    } catch (error) {
      alert('Sala não encontrada ou encerrada.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      
      <div className="mb-12 animate-fade-in-down">
        <div className="bg-red-600 p-4 rounded-full inline-block mb-4 shadow-lg shadow-red-500/30">
          <Film size={48} className="text-white" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-2">
          Cine<span className="text-red-500">Match</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Acabe com a indecisão. Dê match no filme perfeito com seus amigos.
        </p>
      </div>

      <div className="w-full max-w-md space-y-6">
        
        <button
          onClick={handleCreateRoom}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl disabled:opacity-50"
        >
          <Users size={24} />
          {loading ? 'Criando...' : 'Criar Nova Sala'}
        </button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">OU ENTRE EM UMA</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <form onSubmit={handleJoinRoom} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Código da sala (ex: XJ9-22)"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            className="w-full bg-gray-800 border border-gray-700 text-white p-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-center tracking-widest text-xl uppercase placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading || !roomCode}
            className="w-full bg-gray-800 hover:bg-gray-700 border-2 border-gray-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <LogIn size={20} />
            Entrar Agora
          </button>
        </form>
      </div>
      
      <p className="mt-12 text-gray-600 text-sm">
        Desenvolvido com React + Node + Prisma
      </p>
    </div>
  );
}