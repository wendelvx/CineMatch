import React from 'react';

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-red-500 mb-4">
        CineMatch 🎬
      </h1>
      <p className="text-gray-400 mb-6">
        Se este texto for cinza e o título vermelho, o Tailwind está 100%.
      </p>
      
      <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full transition-all shadow-lg shadow-blue-500/50">
        Botão Teste
      </button>
    </div>
  );
}

export default App;