'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import type { UserQuest } from '@/lib/types';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { completeQuest } from '@/app/actions';
import LoadingSpinner from './loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { Compass } from 'lucide-react';

export default function ActiveQuest() {
  const { user } = useAuth();
  const [activeQuest, setActiveQuest] = useState<UserQuest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const questsQuery = query(
      collection(db, 'users', user.uid, 'user_quests'),
      where('status', '==', 'in_progress'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(questsQuery, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const questDoc = querySnapshot.docs[0];
        setActiveQuest({ id: questDoc.id, ...questDoc.data() } as UserQuest);
      } else {
        setActiveQuest(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleComplete = async () => {
    if (!activeQuest || !user) return;
    setIsCompleting(true);
    const result = await completeQuest(activeQuest.id, user.uid);
    toast({ title: result.success ? 'Success' : 'Error', description: result.message, variant: result.success ? 'default' : 'destructive'});
    setIsCompleting(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="font-headline text-2xl">Your Weekly Quest</CardTitle>
            <CardDescription>A personalized goal for your growth.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-h-[60px]">
        {loading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : activeQuest ? (
          <p className="text-lg text-foreground italic">"{activeQuest.questText}"</p>
        ) : (
          <p className="text-muted-foreground">
            Complete a journal entry to generate your first quest!
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {activeQuest && (
          <Button onClick={handleComplete} disabled={isCompleting || !user}>
            {isCompleting && <LoadingSpinner className="mr-2 h-4 w-4" />}
            Complete Quest
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
