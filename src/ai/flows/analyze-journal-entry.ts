'use server';

/**
 * @fileOverview Analyzes a user's journal entry to provide a reflection score and dominant emotions.
 *
 * - analyzeJournalEntry - A function that handles the journal entry analysis process.
 * - AnalyzeJournalEntryInput - The input type for the analyzeJournalEntry function.
 * - AnalyzeJournalEntryOutput - The return type for the analyzeJournalEntry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeJournalEntryInputSchema = z.object({
  text: z.string().describe('The user\'s journal entry text.'),
  userId: z.string().describe('The ID of the user submitting the journal entry.'),
});
export type AnalyzeJournalEntryInput = z.infer<typeof AnalyzeJournalEntryInputSchema>;

const AnalyzeJournalEntryOutputSchema = z.object({
  reflectionScore: z
    .number()
    .describe('The reflection score (0-100) calculated by the AI.'),
  dominantEmotions: z
    .array(z.string())
    .describe('Key emotions identified by the AI.'),
});
export type AnalyzeJournalEntryOutput = z.infer<typeof AnalyzeJournalEntryOutputSchema>;

export async function analyzeJournalEntry(
  input: AnalyzeJournalEntryInput
): Promise<AnalyzeJournalEntryOutput> {
  return analyzeJournalEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeJournalEntryPrompt',
  input: {schema: AnalyzeJournalEntryInputSchema},
  output: {schema: AnalyzeJournalEntryOutputSchema},
  prompt: `Analyze the following journal entry text and provide a reflection score (0-100) and a list of dominant emotions.

Journal Entry Text:
{{{text}}}

User ID:
{{{userId}}}

Respond in JSON format.
Reflection Score: 
Dominant Emotions:`, 
});

const analyzeJournalEntryFlow = ai.defineFlow(
  {
    name: 'analyzeJournalEntryFlow',
    inputSchema: AnalyzeJournalEntryInputSchema,
    outputSchema: AnalyzeJournalEntryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
