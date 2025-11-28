'use server';

/**
 * @fileOverview An AI agent that checks symptoms and provides potential conditions, recommended actions, disease criticality, and suggests a doctor specialty.
 *
 * - symptomChecker - A function that handles the symptom checking process.
 * - SymptomCheckerInput - The input type for the symptomChecker function.
 * - SymptomCheckerOutput - The return type for the symptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe("A description of the patient's symptoms."),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
  potentialConditions: z
    .string()
    .describe('A summary of potential medical conditions based on the symptoms provided.'),
  recommendedActions: z
    .string()
    .describe('Recommended actions for the patient to take based on the potential conditions.'),
  diseaseCriticalness: z
    .enum(['Low', 'Medium', 'High'])
    .describe("The criticalness of the potential condition. Can be 'Low', 'Medium', or 'High'."),
  recommendedDoctorSpecialty: z
    .string()
    .describe('The specialty of a doctor recommended for the symptoms (e.g., "General Physician", "Cardiologist").'),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are an AI Health Assistant that helps users understand their health better. Based on the symptoms provided, you will provide:
1. A summary of potential conditions.
2. Recommended actions.
3. An assessment of the disease criticalness ('Low', 'Medium', 'High').
4. A recommendation for a doctor's specialty (e.g., "General Physician", "Cardiologist").

Symptoms: {{{symptoms}}}
`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
