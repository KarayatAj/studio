'use client';

import { useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { submitJournalEntry } from '@/app/actions';
import LoadingSpinner from './loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { BookText } from 'lucide-react';

export default function JournalEntryForm() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to save an entry.',
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const text = formData.get('entry') as string;

    if (!text || text.trim().length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Journal entry cannot be empty.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await submitJournalEntry(user.uid, formData);
      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        formRef.current?.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <BookText className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="font-headline text-2xl">Daily Journal</CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </div>
        </div>
      </CardHeader>
      <form ref={formRef} onSubmit={handleSubmit}>
        <CardContent>
          <Textarea
            name="entry"
            placeholder="Let your thoughts flow..."
            className="min-h-[120px] resize-none"
            disabled={isLoading || !user}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isLoading || !user}>
            {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
            Save Entry
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
