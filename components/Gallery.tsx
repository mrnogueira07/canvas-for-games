import React, { useEffect, useState } from 'react';
import { GameDesignDocument } from '../types';

interface GalleryProps {
  onLoad: (data: GameDesignDocument) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onLoad }) => {
  const [games, setGames] = useState<GameDesignDocument[]>([]);

  useEffect(() => {
    const loadGames = () => {
      const saved = localStorage.getItem('canvas_games');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Sort by newest first
          parsed.sort((a: GameDesignDocument, b: GameDesignDocument) => (b.lastSaved || 0) - (a.lastSaved || 0));
          setGames(parsed);
        } catch (e) {
          console.error("Failed to parse games", e);
        }
      }
    };
    loadGames();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja excluir este projeto?")) {
      const newGames = games.filter(g => g.id !== id);
      setGames(newGames);
      localStorage.setItem('canvas_games', JSON.stringify(newGames));
    }
  };

  if (games.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-bold text-slate-400">Nenhum projeto salvo</h3>
        <p className="text-slate-500 mt-2">Crie um novo roteiro e clique em "Salvar na Galeria".</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {games.map((game) => (
        <div 
          key={game.id} 
          onClick={() => onLoad(game)}
          className="bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500 rounded-xl p-6 cursor-pointer transition-all group relative hover:-translate-y-1 hover:shadow-xl shadow-slate-900/50"
        >
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => handleDelete(game.id!, e)}
              className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-colors"
              title="Excluir"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 truncate pr-8">{game.title}</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-xs text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded w-fit">
              <span className="font-semibold mr-1">Nível:</span> {game.educationContext.area}
            </div>
            <div className="flex items-center text-xs text-purple-300 bg-purple-500/10 px-2 py-1 rounded w-fit">
              <span className="font-semibold mr-1">Matéria:</span> {game.educationContext.discipline}
            </div>
          </div>

          <div className="text-xs text-slate-500 border-t border-slate-700 pt-4 flex justify-between items-center">
            <span>Editado em: {new Date(game.lastSaved || 0).toLocaleDateString('pt-BR')}</span>
            <span className="text-indigo-400 font-medium group-hover:underline">Abrir Projeto &rarr;</span>
          </div>
        </div>
      ))}
    </div>
  );
};