'use server';
/**
 * @fileOverview Predicts the progression of a patient's disease based on various health factors.
 *
 * - predictDiseaseProgression - A function that handles the disease progression prediction.
 * - PredictDiseaseProgressionInput - The input type for the function.
 * - PredictDiseaseProgressionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const PredictDiseaseProgressionInputSchema = z.object({
  currentCondition: z.string().describe("The patient's current medical condition (e.g., 'Type 2 Diabetes')."),
  patientAge: z.coerce.number().describe("The patient's age in years."),
  biomarkers: z.string().describe("Key biomarkers and their values (e.g., 'A1C: 7.5%, Blood Pressure: 140/90 mmHg')."),
  treatmentPlan: z.string().describe("The current treatment plan (e.g., 'Metformin 500mg daily, dietary changes')."),
  lifestyleFactors: z.string().describe("Relevant lifestyle factors (e.g., 'Sedentary, smoker')."),
  timeframe: z.string().describe("The time frame for the prediction (e.g., '6 months', '1 year').")
});
export type PredictDiseaseProgressionInput = z.infer<typeof PredictDiseaseProgressionInputSchema>;

export const PredictDiseaseProgressionOutputSchema = z.object({
  predictedProgression: z.string().describe("A detailed description of the likely disease progression over the specified timeframe."),
  confidenceScore: z.number().min(0).max(1).describe("The confidence score (0 to 1) for the prediction."),
  keyFactors: z.string().describe("The key factors influencing the predicted outcome."),
  preventativeRecommendations: z.string().describe("Recommendations for preventative actions to alter the predicted course."),
});
export type PredictDiseaseProgressionOutput = z.infer<typeof PredictDiseaseProgressionOutputSchema>;


export async function predictDiseaseProgression(input: PredictDiseaseProgressionInput): Promise<PredictDiseaseProgressionOutput> {
    return predictDiseaseProgressionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictDiseaseProgressionPrompt',
  input: {schema: PredictDiseaseProgressionInputSchema},
  output: {schema: PredictDiseaseProgressionOutputSchema},
  prompt: `You are an AI medical expert specializing in predictive health analytics.

Based on the patient's data, predict the progression of their disease over the specified timeframe. Your analysis should be comprehensive and evidence-based.

Patient Data:
- Current Condition: {{{currentCondition}}}
- Age: {{{patientAge}}}
- Biomarkers: {{{biomarkers}}}
- Current Treatment Plan: {{{treatmentPlan}}}
- Lifestyle Factors: {{{lifestyleFactors}}}

Prediction Timeframe: {{{timeframe}}}

Your prediction must include:
1.  A detailed narrative of the likely disease progression.
2.  A confidence score for your prediction.
3.  The key factors influencing the outcome.
4.  Actionable preventative recommendations to improve the patient's prognosis.`,
});

const predictDiseaseProgressionFlow = ai.defineFlow(
  {
    name: 'predictDiseaseProgressionFlow',
    inputSchema: PredictDiseaseProgressionInputSchema,
    outputSchema: PredictDiseaseProgressionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
