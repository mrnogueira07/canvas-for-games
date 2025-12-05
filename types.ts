
export interface Character {
  name: string;
  role: string;
  description: string;
}

export interface Level {
  name: string;
  objective: string;
  environment: string;
}

export interface EducationContext {
  area: string;
  gradeLevel: string;
  discipline: string;
  theme: string;
  bnccSkills: string;
  bibliography: string;
}

export interface ProgrammaticContent {
  intro: string;
  victoryCondition: string;
  defeatCondition: string;
}

export interface GameDesignDocument {
  id?: string;
  lastSaved?: number;
  title: string;
  
  // Section 1
  educationContext: EducationContext;
  
  // Section 2
  genre: string;
  targetAudience: string;
  platform: string;
  technicalRequirements: string;
  
  // Section 3
  synopsis: string;
  characters: Character[];
  levels: Level[];

  // Section 4 & 5
  gameFlow: string;
  enemiesAndObstacles: string;

  // Mechanics (Bottom)
  gameplayMechanics: string[];
  
  // Extra Programmatic
  programmaticContent: ProgrammaticContent;
}

export interface GenerationParams {
  prompt: string;
  educationLevel: string;
  subject: string;
  grade: string;
  term: string; // Added Bimestre
  pdfFile: File | null;
}

export enum ExportStatus {
  IDLE,
  GENERATING,
  SUCCESS,
  ERROR
}
