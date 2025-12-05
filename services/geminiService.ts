
import { GoogleGenAI, Type } from "@google/genai";
import { GameDesignDocument, GenerationParams } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "O título do jogo." },
    
    // 1. Contexto Educacional
    educationContext: {
      type: Type.OBJECT,
      properties: {
        area: { type: Type.STRING, description: "Área de conhecimento." },
        gradeLevel: { type: Type.STRING, description: "Ano e Bimestre." },
        discipline: { type: Type.STRING, description: "Disciplina." },
        theme: { type: Type.STRING, description: "Tema central." },
        bnccSkills: { type: Type.STRING, description: "Habilidades BNCC." },
        bibliography: { type: Type.STRING, description: "Referências." }
      },
      required: ["area", "gradeLevel", "discipline", "theme", "bnccSkills"]
    },

    // 2. Estilo
    genre: { type: Type.STRING, description: "Gênero." },
    targetAudience: { type: Type.STRING, description: "Público alvo." },
    platform: { type: Type.STRING, description: "Plataforma (Construct 3)." },
    technicalRequirements: { type: Type.STRING, description: "Requisitos técnicos Construct 3." },

    // 3. Narrativa
    synopsis: { type: Type.STRING, description: "Sinopse do jogo." },
    characters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    },
    levels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          objective: { type: Type.STRING },
          environment: { type: Type.STRING }
        }
      }
    },

    // 4. Fluxo
    gameFlow: { type: Type.STRING, description: "Descrição do fluxo do jogo (telas, navegação)." },

    // 5. Inimigos
    enemiesAndObstacles: { type: Type.STRING, description: "Descrição dos chefes, inimigos e obstáculos." },

    // Mecânicas
    gameplayMechanics: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de mecânicas e tarefas."
    },

    // Conteúdo Programático
    programmaticContent: {
      type: Type.OBJECT,
      properties: {
        intro: { type: Type.STRING, description: "Texto de introdução do jogo." },
        victoryCondition: { type: Type.STRING, description: "Mensagem ou condição de vitória." },
        defeatCondition: { type: Type.STRING, description: "Mensagem ou condição de derrota." }
      },
      required: ["intro", "victoryCondition", "defeatCondition"]
    }
  },
  required: ["title", "educationContext", "genre", "gameFlow", "enemiesAndObstacles", "programmaticContent"]
};

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:application/pdf;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateGameScript = async (params: GenerationParams): Promise<GameDesignDocument> => {
  try {
    const parts: any[] = [];

    // Construct the text prompt
    let promptText = `Atue como um Especialista em Gamificação Educacional e Construct 3.
      
    Tarefa: Preencher um "Canvas de Gamificação" completo.
    Engine: Construct 3.
    
    INFORMAÇÕES FORNECIDAS PELO USUÁRIO:
    - Nível de Ensino: ${params.educationLevel}
    - Matéria/Disciplina: ${params.subject}
    - Ano Escolar: ${params.grade}
    - Bimestre: ${params.term}
    - Detalhes Adicionais: "${params.prompt}"
    `;

    if (params.pdfFile) {
      promptText += `\n\nAnalise o arquivo PDF anexo como material de referência base para o conteúdo do jogo, tema e perguntas.`;
      
      const pdfBase64 = await fileToGenerativePart(params.pdfFile);
      parts.push({
        inlineData: {
          mimeType: "application/pdf",
          data: pdfBase64
        }
      });
    }

    promptText += `
    
    Preencha TODAS as seções do Canvas JSON:
    1. Relação com Currículo:
       - No campo 'gradeLevel', combine o Ano e o Bimestre (Ex: "5º Ano - 2º Bimestre").
       - Preencha 'discipline' com '${params.subject}'.
       - Preencha 'area' com '${params.educationLevel}'.
    2. Estilo do Jogo
    3. Narrativa
    4. Fluxo do Jogo
    5. Chefes e Inimigos
    - Mecânicas
    - Conteúdo Programático (Intro, Vitória, Derrota)

    Responda EXATAMENTE no formato JSON solicitado.`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: parts }],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "Responda em formato JSON compatível com o schema. Seja conciso, técnico e criativo. Formato estilo 'Bullet points' curtos e diretos."
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta do Gemini");
    
    return JSON.parse(text) as GameDesignDocument;
  } catch (error) {
    console.error("Erro ao gerar roteiro:", error);
    throw error;
  }
};
