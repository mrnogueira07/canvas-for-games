
import React, { useState } from 'react';
import { GameDesignDocument } from '../types';

interface ExportActionsProps {
  data: GameDesignDocument;
}

export const ExportActions: React.FC<ExportActionsProps> = ({ data }) => {
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'generating'>('idle');

  const handleSaveToGallery = () => {
    if (!window.confirm("Deseja realmente salvar este projeto na Galeria?")) {
      return;
    }

    try {
      const savedGamesRaw = localStorage.getItem('canvas_games');
      const savedGames: GameDesignDocument[] = savedGamesRaw && Array.isArray(JSON.parse(savedGamesRaw)) ? JSON.parse(savedGamesRaw) : [];
      
      const newEntry = { ...data, lastSaved: Date.now() };
      
      // Update if ID exists, else push
      const existingIndex = savedGames.findIndex((g) => g.id === data.id);
      
      if (existingIndex >= 0) {
        savedGames[existingIndex] = newEntry;
      } else {
        savedGames.push(newEntry);
      }
      
      localStorage.setItem('canvas_games', JSON.stringify(savedGames));
      alert("✅ Projeto salvo na Galeria com sucesso!");
    } catch (e) {
      console.error("Erro ao salvar:", e);
      alert("❌ Erro ao salvar o projeto. Tente novamente.");
    }
  };

  // Download PDF using html2pdf.js with Input Clone Fix
  const downloadPDF = () => {
    setPdfStatus('generating');
    const element = document.getElementById('canvas-content');
    
    if (element && (window as any).html2pdf) {
      // 1. Clone the node to avoid messing up the UI
      const clone = element.cloneNode(true) as HTMLElement;
      
      // 2. Replace all inputs and textareas with DIVs containing their values
      const inputs = clone.querySelectorAll('input');
      inputs.forEach(input => {
        const div = document.createElement('div');
        div.textContent = input.value;
        div.className = input.className;
        div.style.borderBottom = 'none';
        div.style.padding = '2px 0';
        input.parentNode?.replaceChild(div, input);
      });

      const textareas = clone.querySelectorAll('textarea');
      textareas.forEach(textarea => {
        const div = document.createElement('div');
        div.textContent = textarea.value;
        div.className = textarea.className;
        div.style.whiteSpace = 'pre-wrap'; 
        div.style.border = 'none';
        div.style.height = 'auto'; // ensure full height shows
        textarea.parentNode?.replaceChild(div, textarea);
      });
      
      // Inject CSS for printing to ensure containers don't break awkwardly
      const style = document.createElement('style');
      style.innerHTML = `
        .break-inside-avoid { page-break-inside: avoid !important; }
        .canvas-section { page-break-inside: avoid !important; }
      `;
      clone.appendChild(style);

      // 3. Render off-screen container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '210mm'; // Enforce A4 width on the container
      container.appendChild(clone);
      document.body.appendChild(container);

      // Force white background for PDF
      clone.style.backgroundColor = '#ffffff';
      clone.style.color = '#000000';
      clone.style.width = '100%'; 
      clone.style.height = 'auto'; // Let it grow
      
      const sections = clone.querySelectorAll('.bg-slate-50\\/50');
      sections.forEach((sec) => ((sec as HTMLElement).style.backgroundColor = '#f8fafc'));

      const opt = {
        margin:       [0, 0, 0, 0], // Zero margin because CSS handles the padding inside A4 div
        filename:     `Canvas_${data.title.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true, scrollY: 0, windowWidth: 794 }, // 794px is approx 210mm at 96DPI
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      (window as any).html2pdf().set(opt).from(clone).save().then(() => {
        document.body.removeChild(container);
        setPdfStatus('idle');
      }).catch((err: any) => {
        console.error(err);
        document.body.removeChild(container);
        setPdfStatus('idle');
        alert("Erro ao gerar PDF.");
      });
    } else {
      console.error("Library html2pdf not found or element missing");
      setPdfStatus('idle');
      alert("Erro ao gerar PDF. A biblioteca pode não ter carregado.");
    }
  };

  // Convert data to HTML Doc (Word compatible)
  const downloadDoc = () => {
    try {
      const purple = '#9333ea';
      const borderStyle = `2px solid ${purple}`;
      const cellPadding = 'padding: 8px; vertical-align: top;';
      const labelStyle = 'font-size: 10px; font-weight: bold; text-transform: uppercase; color: #555; display: block; margin-bottom: 4px;';
      const inputStyle = 'border-bottom: 1px solid #ddd; padding-bottom: 2px; display: block; min-height: 20px; width: 100%; font-family: Arial, sans-serif; white-space: pre-wrap; word-wrap: break-word; font-size: 11px;';
      
      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${data.title}</title>
          <style>
            body { font-family: 'Arial', sans-serif; font-size: 11px; color: #333; line-height: 1.4; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed; }
            .box { border: ${borderStyle}; border-radius: 8px; padding: 15px; margin-bottom: 25px; page-break-inside: avoid; }
            .header-tag { 
              background: white; 
              color: ${purple}; 
              border: ${borderStyle}; 
              padding: 5px 15px; 
              border-radius: 20px; 
              font-weight: bold; 
              display: inline-block;
              font-size: 14px;
            }
            h1 { background-color: ${purple}; color: white; text-align: center; padding: 20px; margin: 0; font-size: 24px; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <h1>Canvas de Gamificação: ${data.title}</h1>
          <br/>

          <!-- 1. CURRICULO -->
          <div class="box">
            <div style="margin-top: -28px; margin-bottom: 10px;"><span class="header-tag">1. RELAÇÃO COM O CURRÍCULO</span></div>
            <table style="width: 100%;">
              <tr>
                <td width="50%" style="${cellPadding}"><span style="${labelStyle}">Área:</span><div style="${inputStyle}">${data.educationContext.area || ''}</div></td>
                <td width="50%" style="${cellPadding}"><span style="${labelStyle}">Ano/Bimestre:</span><div style="${inputStyle}">${data.educationContext.gradeLevel || ''}</div></td>
              </tr>
              <tr>
                <td width="50%" style="${cellPadding}"><span style="${labelStyle}">Disciplina:</span><div style="${inputStyle}">${data.educationContext.discipline || ''}</div></td>
                <td width="50%" style="${cellPadding}"><span style="${labelStyle}">Tema:</span><div style="${inputStyle}">${data.educationContext.theme || ''}</div></td>
              </tr>
              <tr>
                 <td colspan="2" style="${cellPadding}"><span style="${labelStyle}">Habilidades BNCC:</span><div style="${inputStyle}">${data.educationContext.bnccSkills || ''}</div></td>
              </tr>
               <tr>
                 <td colspan="2" style="${cellPadding}"><span style="${labelStyle}">Ref. Bibliográfica:</span><div style="${inputStyle}">${data.educationContext.bibliography || ''}</div></td>
              </tr>
            </table>
          </div>

          <!-- 2. ESTILO -->
          <div class="box">
            <div style="margin-top: -28px; margin-bottom: 10px;"><span class="header-tag">2. ESTILO DO JOGO</span></div>
            <table style="width: 100%;">
              <tr>
                 <td style="${cellPadding}"><span style="${labelStyle}">Gênero:</span><div style="${inputStyle}">${data.genre || ''}</div></td>
                 <td style="${cellPadding}"><span style="${labelStyle}">Plataforma:</span><div style="${inputStyle}">${data.platform || ''}</div></td>
              </tr>
              <tr>
                 <td colspan="2" style="${cellPadding}"><span style="${labelStyle}">Público Alvo:</span><div style="${inputStyle}">${data.targetAudience || ''}</div></td>
              </tr>
              <tr>
                 <td colspan="2" style="${cellPadding}"><span style="${labelStyle}">Requisitos Técnicos:</span><div style="${inputStyle}">${data.technicalRequirements || ''}</div></td>
              </tr>
            </table>
          </div>

          <!-- 3. NARRATIVA -->
          <div class="box">
            <div style="margin-top: -28px; margin-bottom: 10px;"><span class="header-tag">3. NARRATIVA DO JOGO</span></div>
            <div style="${cellPadding} margin-bottom: 10px;"><span style="${labelStyle}">Sinopse:</span><div style="${inputStyle}">${data.synopsis || ''}</div></div>
            
            <table style="width: 100%; margin-top: 10px;">
              <tr>
                <td width="50%" style="vertical-align: top; padding-right: 10px; border-right: 1px solid #eee;">
                   <strong style="text-transform: uppercase; font-size: 10px;">Personagens</strong>
                   ${data.characters.map(c => `<div style="border-bottom: 1px solid #eee; padding: 4px 0; white-space: pre-wrap;"><strong>${c.name}</strong> (${c.role}):<br/>${c.description}</div>`).join('')}
                </td>
                <td width="50%" style="vertical-align: top; padding-left: 10px;">
                   <strong style="text-transform: uppercase; font-size: 10px;">Níveis</strong>
                   ${data.levels.map(l => `<div style="border-bottom: 1px solid #eee; padding: 4px 0; white-space: pre-wrap;"><strong>${l.name}</strong>:<br/>${l.objective}</div>`).join('')}
                </td>
              </tr>
            </table>
          </div>

          <!-- 4. FLUXO -->
          <div class="box">
            <div style="margin-top: -28px; margin-bottom: 10px;"><span class="header-tag">4. FLUXO DO JOGO</span></div>
            <div style="${cellPadding} ${inputStyle}">${data.gameFlow || ''}</div>
          </div>

          <!-- 5. INIMIGOS -->
          <div class="box">
            <div style="margin-top: -28px; margin-bottom: 10px;"><span class="header-tag">5. CHEFES E INIMIGOS</span></div>
            <div style="${cellPadding} ${inputStyle}">${data.enemiesAndObstacles || ''}</div>
          </div>

           <!-- MECANICAS -->
          <div class="box">
            <div style="margin-top: -28px; margin-bottom: 10px;"><span class="header-tag">MECÂNICAS E TAREFAS</span></div>
            <ul>${data.gameplayMechanics.map(m => `<li>${m}</li>`).join('')}</ul>
          </div>

           <!-- PROGRAMATICO -->
          <h2 style="background: ${purple}; color: white; text-align: center; padding: 10px; margin-top: 20px;">CONTEÚDO PROGRAMÁTICO</h2>
          <div style="border: 1px solid #ccc; padding: 15px; margin-top: 10px;">
             <p style="margin-bottom: 10px;"><strong>INTRODUÇÃO DO JOGO:</strong><br/><span style="white-space: pre-wrap;">${data.programmaticContent?.intro || ''}</span></p>
             <p style="margin-bottom: 10px;"><strong>INFORMAÇÃO VITÓRIA:</strong><br/><span style="white-space: pre-wrap;">${data.programmaticContent?.victoryCondition || ''}</span></p>
             <p><strong>INFORMAÇÃO DERROTA:</strong><br/><span style="white-space: pre-wrap;">${data.programmaticContent?.defeatCondition || ''}</span></p>
          </div>

        </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Canvas_Gamificacao_${data.title.replace(/\s+/g, '_')}.doc`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Erro ao exportar arquivo DOCX.");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 mt-8 no-print transition-colors">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Ações e Exportação
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <button 
          onClick={handleSaveToGallery}
          className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-lg hover:shadow-emerald-500/20 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Salvar na Galeria
        </button>

        <button 
          onClick={downloadDoc}
          className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-lg hover:shadow-blue-500/20 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Baixar DOCX
        </button>

        <button 
          onClick={downloadPDF}
          disabled={pdfStatus === 'generating'}
          className="flex items-center justify-center gap-2 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-lg hover:shadow-red-500/20 disabled:opacity-50 active:scale-95"
        >
          {pdfStatus === 'generating' ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          )}
          Baixar PDF
        </button>
      </div>
    </div>
  );
};
