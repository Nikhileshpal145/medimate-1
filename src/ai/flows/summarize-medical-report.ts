'use server';
/**
 * @fileOverview Summarizes a patient's medical report into structured categories.
 *
 * - summarizeMedicalReport - A function that summarizes the medical report.
 * - SummarizeMedicalReportInput - The input type for the function.
 * - SummarizeMedicalReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export type SummarizeMedicalReportInput = z.infer<typeof SummarizeMedicalReportInputSchema>;
const SummarizeMedicalReportInputSchema = z.object({
  reportText: z.string().describe("The full text of the medical report to be summarized."),
});

export type SummarizeMedicalReportOutput = z.infer<typeof SummarizeMedicalReportOutputSchema>;
const SummarizeMedicalReportOutputSchema = z.object({
  primaryDiagnosis: z.string().describe("A concise summary of the patient's primary diagnosis."),
  keyFindings: z.string().describe("A bulleted list of the most critical findings from the entire report. Use Markdown."),
  bloodReportSummary: z.string().optional().describe("A summary of findings from blood reports, if present. Use Markdown."),
  imagingReportSummary: z.string().optional().describe("A summary of findings from imaging reports like X-rays or sonography, if present. Use Markdown."),
});

export async function summarizeMedicalReport(input: SummarizeMedicalReportInput): Promise<SummarizeMedicalReportOutput> {
  return summarizeMedicalReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMedicalReportPrompt',
  input: {schema: SummarizeMedicalReportInputSchema},
  output: {schema: SummarizeMedicalReportOutputSchema},
  prompt: `You are an expert AI medical assistant. Your task is to summarize a given medical report for a healthcare professional.

Analyze the report and structure your summary into the following categories:
- **Primary Diagnosis**: A concise statement of the main diagnosis.
- **Key Findings**: A bulleted list of the most critical information, such as vital signs, acute conditions, or significant lab results.
- **Blood Report Summary**: If blood work results are present, summarize them here. If not, omit this field.
- **Imaging Report Summary**: If X-ray, sonography, CT, or MRI findings are present, summarize them here. If not, omit this field.

Format lists using Markdown bullet points.

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
