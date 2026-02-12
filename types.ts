
export interface JournalEntry {
  date: string;
  stress: number;
  energy: number;
  sleep: number;
  mood: number;
  notes: string;
}

export interface Session {
  id: string;
  date: string;
  objective: string;
  advice: string;
  completed: boolean;
}

export type ModuleType = 'home' | 'journal' | 'program' | 'score' | 'followup' | 'breathing';

export interface Question {
  id: number;
  text: string;
}
