import React, { useState, useRef } from 'react';
import { ExportStatus, GenerationParams } from '../types';

interface ScriptFormProps {
  onGenerate: (params: GenerationParams) => void;
  status: ExportStatus;
}

export const ScriptForm: React.FC<ScriptFormProps> = ({ onGenerate, status }) => {
  const [prompt, setPrompt] = useState('');
  const [educationLevel, setEducationLevel] = useState('Ensino Fundamental 1');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [term, setTerm] = useState(''); // State for Bimestre
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === ExportStatus.GENERATING) return;
    
    onGenerate({
      prompt,
      educationLevel,
      subject,
      grade,
      term,
      pdfFile: file
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        alert('Por favor, selecione apenas arquivos PDF.');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <span className="bg-indigo-100 text-indigo-600 p-2.5 rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </span>
          Definições do Projeto
        </h2>
        
        {/* Helper/Badge */}
        <span className="hidden xl:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          Modo Criativo
        </span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Context Definition Grid (Responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
              Nível de Ensino <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer font-medium text-base shadow-sm"
              >
                <option value="Ensino Fundamental 1">Fund. 1 (1º ao 5º Ano)</option>
                <option value="Ensino Fundamental 2">Fund. 2 (6º ao 9º Ano)</option>
                <option value="Ensino Médio">Ensino Médio</option>
                <option value="Ensino Superior">Ensino Superior</option>
              </select>
              <div className="absolute right-4 top-4.5 pointer-events-none text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
              Matéria <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: História"
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-slate-400 font-medium text-base shadow-sm"
              required
            />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
               Ano Escolar <span className="text-red-500">*</span>
             </label>
             <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Ex: 5º Ano"
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-slate-400 font-medium text-base shadow-sm"
              required
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
             <label className="text-sm font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
               Bimestre <span className="text-red-500">*</span>
             </label>
             <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Ex: 1º Bimestre"
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-slate-400 font-medium text-base shadow-sm"
              required
            />
          </div>
        </div>

        {/* Row 2: Advanced Settings Container */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-inner">
          <div className="flex items-center gap-2 mb-5 text-indigo-900 font-bold text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Configurações Avançadas
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                Ideia / Contexto (Opcional)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Descreva brevemente a ideia do jogo ou deixe em branco para a IA criar baseada no PDF..."
                className="w-full h-28 bg-white text-slate-700 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none resize-none transition-all placeholder-slate-400 text-base shadow-sm"
                disabled={status === ExportStatus.GENERATING}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                Anexar Material Didático (PDF)
              </label>
              <div 
                className={`relative group border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer bg-white hover:bg-indigo-50/50 hover:border-indigo-400 ${file ? 'border-indigo-500 bg-indigo-50/60' : 'border-slate-300'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                   {file ? (
                     <>
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-bold text-indigo-700 truncate max-w-[250px]">{file.name}</span>
                      <span className="text-xs text-indigo-400 bg-white px-2 py-1 rounded-md border border-indigo-100">Clique para alterar</span>
                     </>
                   ) : (
                     <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div>
                        <span className="block text-slate-600 font-semibold">Clique para enviar PDF</span>
                        <span className="text-xs text-slate-400">Até 10MB</span>
                      </div>
                     </>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Action Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={status === ExportStatus.GENERATING}
            className={`
              w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-white text-lg shadow-xl shadow-indigo-500/30 transition-all transform duration-200
              ${status === ExportStatus.GENERATING 
                ? 'bg-slate-400 cursor-not-allowed scale-[0.98]' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:scale-[1.01] hover:shadow-2xl'}
            `}
          >
            {status === ExportStatus.GENERATING ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white/90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="tracking-wide">Construindo Roteiro...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Gerar Roteiro Mágico
              </>
            )}
          </button>
          
          <div className="text-center mt-4">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-xs text-slate-500 font-medium">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               IA Google Gemini 2.5 Flash Conectada
             </div>
          </div>
        </div>
      </form>
    </div>
  );
};