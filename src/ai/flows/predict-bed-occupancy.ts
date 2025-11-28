'use server';
/**
 * @fileOverview Predicts the need for hospital or ICU bed based on patient data.
 *
 * - predictBedOccupancy - A function that handles the bed occupancy prediction.
 * - PredictBedOccupancyInput - The input type for the function.
 * - PredictBedOccupancyOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictBedOccupancyInputSchema = z.object({
    currentCondition: z.string().describe("The patient's primary diagnosis (e.g., 'Pneumonia', 'Acute Myocardial Infarction')."),
    vitalSigns: z.string().describe("The patient's latest vital signs (e.g., 'Heart Rate: 110 bpm, O2 Sat: 92%, BP: 90/60 mmHg')."),
    patientAge: z.coerce.number().describe("The patient's age in years."),
    comorbidities: z.string().describe("A list of the patient's significant pre-existing conditions (e.g., 'Diabetes, Hypertension, COPD')."),
});
export type PredictBedOccupancyInput = z.infer<typeof PredictBedOccupancyInputSchema>;

const PredictBedOccupancyOutputSchema = z.object({
  bedNeeded: z.boolean().describe("Whether a general hospital bed is likely required."),
  icuNeeded: z.boolean().describe("Whether an ICU bed is likely required. This takes precedence over a general bed."),
  predictionConfidence: z.number().min(0).max(1).describe("The confidence score (0 to 1) for the overall prediction."),
  reasoning: z.string().describe("A brief explanation of the factors leading to the prediction."),
  recommendedAction: z.string().describe("The recommended immediate action (e.g., 'Admit to general ward', 'Prepare for ICU transfer', 'Continue outpatient monitoring')."),
});
export type PredictBedOccupancyOutput = z.infer<typeof PredictBedOccupancyOutputSchema>;


export async function predictBedOccupancy(input: PredictBedOccupancyInput): Promise<PredictBedOccupancyOutput> {
    return predictBedOccupancyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictBedOccupancyPrompt',
  input: {schema: PredictBedOccupancyInputSchema},
  output: {schema: PredictBedOccupancyOutputSchema},
  prompt: `You are an expert AI triage assistant for a hospital. Your role is to predict the need for hospital bed or ICU admission based on patient data.

Analyze the following patient information to determine the appropriate level of care required.

Patient Data:
- Admitting Diagnosis: {{{currentCondition}}}
- Age: {{{patientAge}}}
- Vital Signs: {{{vitalSigns}}}
- Comorbidities: {{{comorbidities}}}

Your task is to:
1.  Determine if the patient requires a general hospital bed or an ICU bed. An ICU requirement supersedes a general bed requirement.
2.  Provide a confidence score for your prediction.
3.  Give a concise reason for your decision based on the provided data.
4.  Suggest a clear, actionable recommendation for the care team.`,
});

const predictBedOccupancyFlow = ai.defineFlow(
  {
    name: 'predictBedOccupancyFlow',
    inputSchema: PredictBedOccupancyInputSchema,
    outputSchema: PredictBedOccupancyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
