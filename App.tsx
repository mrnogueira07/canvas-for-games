import React, { useState, useEffect } from 'react';
import { ScriptForm } from './components/ScriptForm';
import { ScriptDisplay } from './components/ScriptDisplay';
import { ExportActions } from './components/ExportActions';
import { Gallery } from './components/Gallery';
import { generateGameScript } from './services/geminiService';
import { GameDesignDocument, ExportStatus, GenerationParams } from './types';
import { EmptyState } from './components/EmptyState';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'gallery'>('home');
  const [status, setStatus] = useState<ExportStatus>(ExportStatus.IDLE);
  const [gameData, setGameData] = useState<GameDesignDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load from session storage on mount if exists (to persist state across reloads if needed)
  useEffect(() => {
    // Optional: could load last session
  }, []);

  const handleGenerate = async (params: GenerationParams) => {
    setStatus(ExportStatus.GENERATING);
    setError(null);
    setGameData(null);

    try {
      const result = await generateGameScript(params);
      
      // Add ID and timestamp for saving later
      const dataWithId = {
        ...result,
        id: crypto.randomUUID(),
        lastSaved: Date.now()
      };
      
      setGameData(dataWithId);
      setStatus(ExportStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("Falha ao criar o roteiro. Verifique se o PDF não é muito grande ou tente novamente.");
      setStatus(ExportStatus.ERROR);
    }
  };

  const handleUpdateGameData = (newData: GameDesignDocument) => {
    setGameData(newData);
  };

  const handleLoadGame = (data: GameDesignDocument) => {
    setGameData(data);
    setCurrentView('home');
    setStatus(ExportStatus.SUCCESS);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-indigo-500 selection:text-white pb-10 font-sans">
      
      {/* Navbar / Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 no-print">
        <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
               GA
             </div>
             <h1 className="text-xl font-bold tracking-tight text-white">
               GameScript <span className="text-indigo-400">Architect</span>
             </h1>
          </div>

          <div className="flex bg-slate-800 rounded-full p-1 border border-slate-700">
             <button 
               onClick={() => setCurrentView('home')}
               className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${currentView === 'home' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
             >
               Editor
             </button>
             <button 
               onClick={() => setCurrentView('gallery')}
               className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${currentView === 'gallery' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
             >
               Galeria
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-4 md:px-6 py-8">
        
        {currentView === 'gallery' ? (
          <Gallery onLoad={handleLoadGame} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Form (Fixed/Sticky on Large Screens) - Increased to 5 columns */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 h-fit no-print">
               <ScriptForm onGenerate={handleGenerate} status={status} />
               
               {status === ExportStatus.ERROR && (
                <div className="mt-4 bg-red-900/20 border border-red-500/50 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
                    <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-bold text-red-400 text-sm">Erro na Geração</h4>
                      <p className="text-sm text-red-200 mt-1">{error}</p>
                    </div>
                </div>
               )}
            </div>

            {/* Right Column: Result or Empty State - Decreased to 7 columns */}
            <div className="lg:col-span-7 xl:col-span-8">
               {gameData ? (
                 <div className="animate-fade-in-up space-y-6">
                    <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm no-print">
                       <div>
                         <h3 className="text-white font-bold text-lg">{gameData.title}</h3>
                         <p className="text-sm text-slate-400">Roteiro gerado com sucesso</p>
                       </div>
                       <button onClick={() => setGameData(null)} className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition">
                         Limpar / Novo
                       </button>
                    </div>

                    <ScriptDisplay data={gameData} onUpdate={handleUpdateGameData} />
                    <ExportActions data={gameData} />
                 </div>
               ) : (
                 <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-700/50 p-8 transition-all">
                   {status === ExportStatus.GENERATING ? (
                      <div className="text-center">
                        <div className="w-24 h-24 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                        <h3 className="text-3xl font-bold text-white mb-3">Construindo seu Universo...</h3>
                        <p className="text-slate-300 text-lg max-w-lg mx-auto leading-relaxed">A IA está analisando seus parâmetros e o PDF para criar um roteiro gamificado exclusivo para o Construct 3.</p>
                      </div>
                   ) : (
                      <EmptyState />
                   )}
                 </div>
               )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}