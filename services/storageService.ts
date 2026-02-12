
import { JournalEntry, Session } from '../types';

const KEYS = {
  JOURNAL: 'equilibre_journal',
  SESSIONS: 'equilibre_sessions',
  SCORE_HISTORY: 'equilibre_score_history',
};

export const storage = {
  getJournal: (): JournalEntry[] => {
    const data = localStorage.getItem(KEYS.JOURNAL);
    return data ? JSON.parse(data) : [];
  },
  saveJournal: (entries: JournalEntry[]) => {
    localStorage.setItem(KEYS.JOURNAL, JSON.stringify(entries));
  },
  getSessions: (): Session[] => {
    const data = localStorage.getItem(KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  },
  saveSessions: (sessions: Session[]) => {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  },
};
