'use server';
/**
 * @fileOverview Summarizes a patient's medical report.
 *
 * - summarizeMedicalReport - A function that summarizes the medical report.
 * - SummarizeMedicalReportInput - The input type for the function.
 * - SummarizeMedicalReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SummarizeMedicalReportInputSchema = z.object({
  reportText: z.string().describe("The full text of the medical report to be summarized."),
});
export type SummarizeMedicalReportInput = z.infer<typeof SummarizeMedicalReportInputSchema>;

export const SummarizeMedicalReportOutputSchema = z.object({
  summary: z.string().describe("A concise, well-structured summary of the key findings from the medical report. Use Markdown for lists and emphasis."),
});
export type SummarizeMedicalReportOutput = z.infer<typeof SummarizeMedicalReportOutputSchema>;

export async function summarizeMedicalReport(input: SummarizeMedicalReportInput): Promise<SummarizeMedicalReportOutput> {
  return summarizeMedicalReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMedicalReportPrompt',
  input: {schema: SummarizeMedicalReportInputSchema},
  output: {schema: SummarizeMedicalReportOutputSchema},
  prompt: `You are an expert AI medical assistant. Your task is to summarize a given medical report for a healthcare professional.

The summary should be clear, concise, and highlight the most critical information, such as:
- Patient's primary diagnosis
- Key findings from tests or examinations
- Important trends in vital signs or lab results
- Mention of acute or chronic conditions

Structure the output using Markdown for better readability (e.g., use bullet points for lists).

Medical Report Text:
{{{reportText}}}
`,
});

const summarizeMedicalReportFlow = ai.defineFlow(
  {
    name: 'summarizeMedicalReportFlow',
    inputSchema: SummarizeMedicalReportInputSchema,
    outputSchema: SummarizeMedicalReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
