import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] p-8 text-center animate-fade-in-up">
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
         <div className="relative text-8xl md:text-9xl filter drop-shadow-2xl transform hover:scale-110 transition-transform duration-300 cursor-default select-none">
           ✨
         </div>
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
        É aqui que a mágica acontece
      </h2>
      
      <p className="text-slate-400 max-w-md text-lg leading-relaxed">
        Preencha as definições do projeto à esquerda e clique em 
        <span className="text-indigo-400 font-semibold"> Gerar Roteiro </span> 
        para ver sua ideia ganhar vida.
      </p>

      <div className="mt-10 flex gap-2 justify-center opacity-50">
        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></span>
        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></span>
      </div>
    </div>
  );
};