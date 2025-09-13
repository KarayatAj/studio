'use server';

import { auth } from '@/lib/firebase';
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

export async function submitJournalEntry(formData: FormData) {
  const text = formData.get('entry') as string;
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error('User not authenticated');
  }
  if (!text || text.trim().length === 0) {
    throw new Error('Journal entry cannot be empty');
  }

  try {
    const analysis = await analyzeJournalEntry({ text, userId });
    
    await addDoc(collection(db, 'users', userId, 'journal_entries'), {
      text,
      date: serverTimestamp(),
      ...analysis,
    });

    revalidatePath('/');
    return { success: true, message: 'Journal entry saved.' };
  } catch (error) {
    console.error('Error submitting journal entry:', error);
    return { success: false, message: 'Failed to save journal entry.' };
  }
}

export async function generateNewQuest() {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  try {
    // Mark any existing in_progress quests as completed
    const questsQuery = query(
      collection(db, 'users', userId, 'user_quests'),
      where('status', '==', 'in_progress')
    );
    const inProgressQuests = await getDocs(questsQuery);
    const batch = [];
    for (const questDoc of inProgressQuests.docs) {
      batch.push(updateDoc(doc(db, 'users', userId, 'user_quests', questDoc.id), { status: 'completed' }));
    }
    await Promise.all(batch);


    const entriesQuery = query(
      collection(db, 'users', userId, 'journal_entries'),
      orderBy('date', 'desc'),
      limit(7)
    );
    const entryDocs = await getDocs(entriesQuery);
    const journalEntries = entryDocs.docs.map(d => ({
        text: d.data().text,
        date: (d.data().date as Timestamp).toDate().toISOString()
    }));

    if (journalEntries.length === 0) {
      return { success: false, message: 'Not enough journal entries to generate a quest.' };
    }

    const result = await generateWeeklyQuest({ userId, journalEntries });

    await addDoc(collection(db, 'users', userId, 'user_quests'), {
      questText: result.questText,
      status: 'in_progress',
      createdAt: serverTimestamp(),
    });

    revalidatePath('/');
    return { success: true, message: 'New quest generated!' };
  } catch (error) {
    console.error('Error generating new quest:', error);
    return { success: false, message: 'Failed to generate new quest.' };
  }
}

export async function completeQuest(questId: string) {
  const userId = auth.currentUser?.uid;
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
