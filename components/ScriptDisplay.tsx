
import React, { useEffect, useRef } from 'react';
import { GameDesignDocument, EducationContext, ProgrammaticContent } from '../types';

interface ScriptDisplayProps {
  data: GameDesignDocument;
  onUpdate: (data: GameDesignDocument) => void;
}

interface CanvasSectionProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}

// Helper for auto-resizing textareas
const AutoResizeTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [props.value]);

  return (
    <textarea
      ref={textareaRef}
      {...props}
      rows={1}
      className={`w-full bg-transparent border-b border-dashed border-slate-300 hover:border-purple-400 focus:border-purple-600 focus:bg-purple-50 rounded-sm px-1 py-1 outline-none transition-all resize-none text-slate-700 leading-relaxed overflow-hidden ${props.className || ''}`}
    />
  );
};

const CanvasSection: React.FC<CanvasSectionProps> = ({ title, icon, color, children }) => (
  <div className="border-2 border-[#a855f7] rounded-2xl p-6 relative mt-10 bg-white hover:shadow-lg transition-shadow duration-300">
    <div className="absolute -top-6 left-6 bg-white px-2 z-10">
      <div className="flex items-center gap-3 border-2 border-[#a855f7] text-gray-800 px-2 py-1.5 rounded-full font-bold bg-white shadow-sm min-w-[280px]">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md ${color}`}>
          {icon}
        </div>
        <span className="text-sm uppercase tracking-wide text-slate-800">{title}</span>
      </div>
    </div>
    <div className="mt-4">
      {children}
    </div>
  </div>
);

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ data, onUpdate }) => {

  const updateField = (field: keyof GameDesignDocument, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const updateEdu = (field: keyof EducationContext, value: string) => {
    onUpdate({
      ...data,
      educationContext: { ...data.educationContext, [field]: value }
    });
  };

  const updateProg = (field: keyof ProgrammaticContent, value: string) => {
    onUpdate({
      ...data,
      programmaticContent: { ...data.programmaticContent, [field]: value }
    });
  };

  const updateMechanic = (index: number, value: string) => {
    const newMechanics = [...data.gameplayMechanics];
    newMechanics[index] = value;
    updateField('gameplayMechanics', newMechanics);
  };

  const updateCharacter = (index: number, field: 'name' | 'role' | 'description', value: string) => {
    const newChars = [...data.characters];
    newChars[index] = { ...newChars[index], [field]: value };
    updateField('characters', newChars);
  };

  const updateLevel = (index: number, field: 'name' | 'objective' | 'environment', value: string) => {
    const newLevels = [...data.levels];
    newLevels[index] = { ...newLevels[index], [field]: value };
    updateField('levels', newLevels);
  };

  const labelClass = "font-bold text-xs uppercase text-slate-500 mb-1 block tracking-wider";

  return (
    <div id="canvas-content" className="bg-white text-slate-800 shadow-2xl overflow-hidden animate-fade-in font-sans max-w-[210mm] mx-auto min-h-[297mm] mb-10 rounded-lg">
      
      {/* Header */}
      <div className="bg-[#9333ea] text-white py-6 px-8 text-center border-b-4 border-purple-800">
        <h1 className="text-3xl font-extrabold tracking-widest uppercase mb-2 drop-shadow-md">CANVAS DE GAMIFICAÇÃO</h1>
        <div className="max-w-3xl mx-auto">
          <AutoResizeTextarea 
            value={data.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="!bg-transparent !border-b-2 !border-purple-300/50 hover:!border-white focus:!border-white text-center !text-white !font-bold !text-2xl placeholder-purple-200 !p-2"
            placeholder="Título do Jogo"
          />
        </div>
      </div>

      <div className="p-8 space-y-8 bg-slate-50/50">
        
        {/* 1. RELAÇÃO COM O CURRÍCULO */}
        <CanvasSection 
          title="1. RELAÇÃO COM O CURRÍCULO"
          color="bg-gradient-to-br from-blue-400 to-indigo-500"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
             <div><span className={labelClass}>Área de Conhecimento:</span> <AutoResizeTextarea value={data.educationContext.area} onChange={(e) => updateEdu('area', e.target.value)} /></div>
             <div><span className={labelClass}>Ano/Bimestre:</span> <AutoResizeTextarea value={data.educationContext.gradeLevel} onChange={(e) => updateEdu('gradeLevel', e.target.value)} /></div>
             <div><span className={labelClass}>Disciplina/Matéria:</span> <AutoResizeTextarea value={data.educationContext.discipline} onChange={(e) => updateEdu('discipline', e.target.value)} /></div>
             <div><span className={labelClass}>Tema Transversal:</span> <AutoResizeTextarea value={data.educationContext.theme} onChange={(e) => updateEdu('theme', e.target.value)} /></div>
             
             <div className="md:col-span-2 pt-2 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
               <span className={`${labelClass} text-blue-800`}>Habilidades da BNCC:</span> 
               <AutoResizeTextarea value={data.educationContext.bnccSkills} onChange={(e) => updateEdu('bnccSkills', e.target.value)} className="min-h-[60px]" />
             </div>
             
             <div className="md:col-span-2">
               <span className={labelClass}>Referências Bibliográficas:</span> 
               <AutoResizeTextarea value={data.educationContext.bibliography} onChange={(e) => updateEdu('bibliography', e.target.value)} className="italic text-slate-600" />
             </div>
          </div>
        </CanvasSection>

        {/* 2. ESTILO DO JOGO */}
        <CanvasSection
           title="2. ESTILO DO JOGO"
           color="bg-gradient-to-br from-purple-400 to-fuchsia-500"
           icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>}
        >
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
             <div className="space-y-4">
               <div><span className={labelClass}>Gênero do Jogo:</span> <AutoResizeTextarea value={data.genre} onChange={(e) => updateField('genre', e.target.value)} /></div>
               <div><span className={labelClass}>Plataforma:</span> <AutoResizeTextarea value={data.platform} onChange={(e) => updateField('platform', e.target.value)} /></div>
               <div><span className={labelClass}>Público Alvo:</span> <AutoResizeTextarea value={data.targetAudience} onChange={(e) => updateField('targetAudience', e.target.value)} /></div>
             </div>
             <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                <span className={`${labelClass} text-purple-800`}>Requisitos Técnicos (Construct 3):</span>
                <AutoResizeTextarea value={data.technicalRequirements} onChange={(e) => updateField('technicalRequirements', e.target.value)} className="min-h-[80px]" />
             </div>
           </div>
        </CanvasSection>

        {/* 3. NARRATIVA DO JOGO */}
        <CanvasSection
          title="3. NARRATIVA DO JOGO"
          color="bg-gradient-to-br from-pink-400 to-rose-500"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
        >
          <div className="space-y-6 text-sm">
            <div>
              <span className={labelClass}>Sinopse e Enredo:</span>
              <AutoResizeTextarea value={data.synopsis} onChange={(e) => updateField('synopsis', e.target.value)} className="min-h-[80px]" placeholder="Sinopse..." />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold border-b border-slate-300 pb-2 mb-3 text-xs uppercase text-slate-600">Personagens</h4>
                {data.characters.map((c, i) => (
                  <div key={i} className="mb-4 last:mb-0 border-b border-slate-100 last:border-0 pb-2">
                    <div className="flex gap-2 mb-1">
                      <AutoResizeTextarea value={c.name} onChange={(e)=>updateCharacter(i,'name',e.target.value)} className="font-bold w-1/2 !border-none !p-0" placeholder="Nome" />
                      <AutoResizeTextarea value={c.role} onChange={(e)=>updateCharacter(i,'role',e.target.value)} className="italic w-1/2 text-right text-slate-500 !border-none !p-0" placeholder="Papel" />
                    </div>
                    <AutoResizeTextarea value={c.description} onChange={(e)=>updateCharacter(i,'description',e.target.value)} className="w-full text-xs text-slate-600 !border-none !p-0" placeholder="Descrição" />
                  </div>
                ))}
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold border-b border-slate-300 pb-2 mb-3 text-xs uppercase text-slate-600">Níveis / Fases</h4>
                {data.levels.map((l, i) => (
                  <div key={i} className="mb-4 last:mb-0 border-b border-slate-100 last:border-0 pb-2">
                     <AutoResizeTextarea value={l.name} onChange={(e)=>updateLevel(i,'name',e.target.value)} className="font-bold w-full !border-none !p-0 mb-1" placeholder="Nome do Nível" />
                     <AutoResizeTextarea value={l.objective} onChange={(e)=>updateLevel(i,'objective',e.target.value)} className="text-xs text-slate-600 !border-none !p-0" placeholder="Objetivo" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CanvasSection>

        {/* 4. FLUXO DO JOGO */}
        <CanvasSection
          title="4. FLUXO DO JOGO"
          color="bg-gradient-to-br from-violet-400 to-purple-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>}
        >
          <AutoResizeTextarea value={data.gameFlow} onChange={(e) => updateField('gameFlow', e.target.value)} className="min-h-[100px]" placeholder="Descreva o fluxo de telas e navegação..." />
        </CanvasSection>

        {/* 5. CHEFES E INIMIGOS */}
        <CanvasSection
          title="5. CHEFES E INIMIGOS/OBSTÁCULOS"
          color="bg-gradient-to-br from-teal-400 to-emerald-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        >
          <AutoResizeTextarea value={data.enemiesAndObstacles} onChange={(e) => updateField('enemiesAndObstacles', e.target.value)} className="min-h-[100px]" placeholder="Descreva os inimigos, chefes e obstáculos..." />
        </CanvasSection>

        {/* MECÂNICAS */}
        <CanvasSection
          title="MECÂNICAS E TAREFAS"
          color="bg-gradient-to-br from-indigo-400 to-blue-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
        >
          <ul className="space-y-3 text-sm pl-2">
            {data.gameplayMechanics.map((mech, i) => (
              <li key={i} className="flex items-start gap-2">
                 <span className="text-indigo-500 mt-1.5">•</span>
                 <AutoResizeTextarea value={mech} onChange={(e) => updateMechanic(i, e.target.value)} />
              </li>
            ))}
          </ul>
        </CanvasSection>
        
        {/* CONTEÚDO PROGRAMÁTICO */}
        <div className="mt-16 mb-8">
          <div className="bg-[#9333ea] text-white py-3 px-8 text-center rounded-xl shadow-lg mx-auto max-w-2xl transform -skew-x-6">
             <h3 className="text-xl font-extrabold uppercase skew-x-6 tracking-wider">CONTEÚDO PROGRAMÁTICO</h3>
          </div>
        </div>

        <div className="space-y-8 mt-6">
           {/* Intro */}
           <div className="border-l-4 border-fuchsia-500 bg-white rounded-r-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/5 rounded-full -mr-8 -mt-8"></div>
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl flex-shrink-0 bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white shadow-lg transform rotate-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="flex-grow">
                   <h4 className="font-bold text-sm uppercase mb-2 text-fuchsia-700">INTRODUÇÃO DO JOGO</h4>
                   <AutoResizeTextarea value={data.programmaticContent.intro} onChange={(e) => updateProg('intro', e.target.value)} className="min-h-[60px]" />
                </div>
              </div>
           </div>
           
           {/* Victory */}
           <div className="border-l-4 border-green-500 bg-white rounded-r-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mr-8 -mt-8"></div>
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl flex-shrink-0 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg transform -rotate-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                </div>
                <div className="flex-grow">
                   <h4 className="font-bold text-sm uppercase mb-2 text-green-700">INFORMAÇÃO VITÓRIA</h4>
                   <AutoResizeTextarea value={data.programmaticContent.victoryCondition} onChange={(e) => updateProg('victoryCondition', e.target.value)} className="min-h-[60px]" />
                </div>
              </div>
           </div>

           {/* Defeat */}
           <div className="border-l-4 border-red-500 bg-white rounded-r-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-8 -mt-8"></div>
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl flex-shrink-0 bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center text-white shadow-lg transform rotate-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="flex-grow">
                   <h4 className="font-bold text-sm uppercase mb-2 text-red-700">INFORMAÇÃO DERROTA</h4>
                   <AutoResizeTextarea value={data.programmaticContent.defeatCondition} onChange={(e) => updateProg('defeatCondition', e.target.value)} className="min-h-[60px]" />
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
