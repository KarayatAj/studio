import { Timestamp } from 'firebase/firestore';

export interface JournalEntry {
  id: string;
  text: string;
  date: Timestamp;
  reflectionScore: number;
  dominantEmotions: string[];
}

export interface UserQuest {
  id: string;
  questText: string;
  status: 'in_progress' | 'completed';
  createdAt: Timestamp;
  completedAt?: Timestamp;
  pointsEarned?: number;
  badgeEarned?: string;
}
