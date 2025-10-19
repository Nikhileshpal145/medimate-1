'use server';
/**
 * @fileOverview Summarizes a patient's medical history from digital records.
 *
 * - summarizePatientHistory - A function that summarizes the patient history.
 * - SummarizePatientHistoryInput - The input type for the summarizePatientHistory function.
 * - SummarizePatientHistoryOutput - The return type for the summarizePatientHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePatientHistoryInputSchema = z.object({
  patientMedicalHistory: z
    .string()
    .describe('The complete medical history of the patient.'),
});
export type SummarizePatientHistoryInput = z.infer<
  typeof SummarizePatientHistoryInputSchema
>;

const SummarizePatientHistoryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the patient medical history.'),
});
export type SummarizePatientHistoryOutput = z.infer<
  typeof SummarizePatientHistoryOutputSchema
>;

export async function summarizePatientHistory(
  input: SummarizePatientHistoryInput
): Promise<SummarizePatientHistoryOutput> {
  return summarizePatientHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePatientHistoryPrompt',
  input: {schema: SummarizePatientHistoryInputSchema},
  output: {schema: SummarizePatientHistoryOutputSchema},
  prompt: `You are an expert medical professional.

  Please summarize the following patient medical history so that a doctor can quickly understand the patient's background and provide more informed care:

  Patient Medical History: {{{patientMedicalHistory}}}`,
});

const summarizePatientHistoryFlow = ai.defineFlow(
  {
    name: 'summarizePatientHistoryFlow',
    inputSchema: SummarizePatientHistoryInputSchema,
    outputSchema: SummarizePatientHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
