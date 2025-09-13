'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import type { JournalEntry } from '@/lib/types';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { History } from 'lucide-react';
import LoadingSpinner from './loading-spinner';

export default function JournalHistory() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const entriesQuery = query(
      collection(db, 'users', user.uid, 'journal_entries'),
      orderBy('date', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(entriesQuery, (querySnapshot) => {
      const entryList = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as JournalEntry)
      );
      setEntries(entryList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <History className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="font-headline text-2xl">Recent Entries</CardTitle>
            <CardDescription>A look back at your recent reflections.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : entries.length > 0 ? (
          entries.map((entry) => (
            <div key={entry.id} className="rounded-lg border p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">
                    {format((entry.date as Timestamp).toDate(), 'MMMM d, yyyy')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Reflection Score: {entry.reflectionScore}
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-3 line-clamp-2">
                {entry.text}
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.dominantEmotions.map((emotion) => (
                  <Badge variant="secondary" key={emotion} className="capitalize">
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>You haven't written any journal entries yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
