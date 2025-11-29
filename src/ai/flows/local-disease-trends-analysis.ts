'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing local disease trends and generating alerts for potential outbreaks.
 *
 * - analyzeLocalDiseaseTrends - A function that analyzes disease trends and generates alerts.
 * - LocalDiseaseTrendsInput - The input type for the analyzeLocalDiseaseTrends function.
 * - LocalDiseaseTrendsOutput - The return type for the analyzeLocalDiseaseTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LocalDiseaseTrendsInputSchema = z.object({
  location: z.string().describe('The location for which to analyze disease trends.'),
  timePeriod: z.string().describe('The time period for which to analyze trends (e.g., last month, last year).'),
  historicalData: z.string().describe('Historical data on disease cases in the specified location and time period.'),
});
export type LocalDiseaseTrendsInput = z.infer<typeof LocalDiseaseTrendsInputSchema>;

const LocalDiseaseTrendsOutputSchema = z.object({
  alertType: z.string().describe('The type of alert (e.g., flu outbreak, dengue surge).'),
  severity: z.string().describe('The severity of the alert (e.g., low, medium, high).'),
  providerRecommendations: z.string().describe('Recommendations for healthcare providers.'),
  communityPrecautions: z.string().describe('Safety instructions and precaution steps for the general public/community.'),
});
export type LocalDiseaseTrendsOutput = z.infer<typeof LocalDiseaseTrendsOutputSchema>;

export async function analyzeLocalDiseaseTrends(input: LocalDiseaseTrendsInput): Promise<LocalDiseaseTrendsOutput> {
  return analyzeLocalDiseaseTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'localDiseaseTrendsPrompt',
  input: {schema: LocalDiseaseTrendsInputSchema},
  output: {schema: LocalDiseaseTrendsOutputSchema},
  prompt: `You are an expert in analyzing local disease trends and generating alerts for potential outbreaks.

  Analyze the following data to identify potential outbreaks and generate appropriate alerts and recommendations.

  Location: {{{location}}}
  Time Period: {{{timePeriod}}}
  Historical Data: {{{historicalData}}}

  Based on this information, determine the type of alert and its severity. Then, provide two sets of recommendations:
  1.  **providerRecommendations**: Specific advice for healthcare providers and clinics.
  2.  **communityPrecautions**: Clear, simple, and actionable safety instructions for the general public.
  `,
});

const analyzeLocalDiseaseTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeLocalDiseaseTrendsFlow',
    inputSchema: LocalDiseaseTrendsInputSchema,
    outputSchema: LocalDiseaseTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
