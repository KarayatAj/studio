'use server';

/**
 * @fileOverview Generates a personalized weekly quest based on the user's past journal entries.
 *
 * - generateWeeklyQuest - A function that generates the weekly quest.
 * - GenerateWeeklyQuestInput - The input type for the generateWeeklyQuest function.
 * - GenerateWeeklyQuestOutput - The return type for the generateWeeklyQuest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWeeklyQuestInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  formattedJournalEntries: z.string().describe('A formatted string of the user\'s journal entries from the past week.'),
});
export type GenerateWeeklyQuestInput = z.infer<typeof GenerateWeeklyQuestInputSchema>;

const GenerateWeeklyQuestOutputSchema = z.object({
  questText: z.string().describe('The personalized quest for the week.'),
});
export type GenerateWeeklyQuestOutput = z.infer<typeof GenerateWeeklyQuestOutputSchema>;

export async function generateWeeklyQuest(input: GenerateWeeklyQuestInput): Promise<GenerateWeeklyQuestOutput> {
  return generateWeeklyQuestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeeklyQuestPrompt',
  input: {schema: GenerateWeeklyQuestInputSchema},
  output: {schema: GenerateWeeklyQuestOutputSchema},
  prompt: `You are a personal growth coach. Analyze the following journal entries from the past week to identify recurring patterns and generate a single, actionable "quest" to help the user grow.\n\nJournal Entries:\n{{{formattedJournalEntries}}}\n\nQuest:`,
});

const generateWeeklyQuestFlow = ai.defineFlow(
  {
    name: 'generateWeeklyQuestFlow',
    inputSchema: GenerateWeeklyQuestInputSchema,
    outputSchema: GenerateWeeklyQuestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
