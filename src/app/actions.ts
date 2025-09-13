'use server';

import { analyzeJournalEntry } from '@/ai/flows/analyze-journal-entry';
import { generateWeeklyQuest } from '@/ai/flows/generate-weekly-quest';
import { revalidatePath } from 'next/cache';
import { 
  addDoc, 
  collection, 
  serverTimestamp, 
  doc, 
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

export async function submitJournalEntry(userId: string, formData: FormData) {
  const text = formData.get('entry') as string;

  if (!userId) {
    return { success: false, message: 'User not authenticated' };
  }
  if (!text || text.trim().length === 0) {
    return { success: false, message: 'Journal entry cannot be empty' };
  }

  try {
    const analysis = await analyzeJournalEntry({ text, userId });
    
    await addDoc(collection(db, 'users', userId, 'journal_entries'), {
      text,
      date: serverTimestamp(),
      ...analysis,
    });
    
    const questsQuery = query(
      collection(db, 'users', userId, 'user_quests'),
      where('status', '==', 'in_progress')
    );
    const inProgressQuests = await getDocs(questsQuery);

    if (inProgressQuests.empty) {
      await generateNewQuest(userId);
    }

    revalidatePath('/');
    return { success: true, message: 'Journal entry saved.' };
  } catch (error) {
    console.error('Error submitting journal entry:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, message: `Failed to save journal entry. ${errorMessage}` };
  }
}

export async function generateNewQuest(userId: string) {
  if (!userId) throw new Error('User not authenticated');

  try {
    const entriesQuery = query(
      collection(db, 'users', userId, 'journal_entries'),
      orderBy('date', 'desc'),
      limit(7)
    );
    const entryDocs = await getDocs(entriesQuery);
    if (entryDocs.docs.length === 0) {
      return; 
    }
    
    const formattedJournalEntries = entryDocs.docs.map(d => {
        const entryData = d.data();
        const date = (entryData.date as Timestamp).toDate();
        return `Date: ${format(date, 'yyyy-MM-dd')}\nEntry: ${entryData.text}`;
    }).join('\n\n');


    const result = await generateWeeklyQuest({ userId, formattedJournalEntries });

    if (result.questText) {
      await addDoc(collection(db, 'users', userId, 'user_quests'), {
        questText: result.questText,
        status: 'in_progress',
        createdAt: serverTimestamp(),
      });
    }

    revalidatePath('/');
  } catch (error) {
    console.error('Error generating new quest:', error);
    // We don't want to throw an error here that would fail the whole submission
  }
}

export async function completeQuest(questId: string, userId: string) {
  if (!userId) throw new Error('User not authenticated');

  try {
    const questRef = doc(db, 'users', userId, 'user_quests', questId);
    await updateDoc(questRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
    });

    revalidatePath('/');
    return { success: true, message: 'Quest completed!' };
  } catch (error) {
    console.error('Error completing quest:', error);
    return { success: false, message: 'Failed to complete quest.' };
  }
}
