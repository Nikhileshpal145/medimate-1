'use server';
/**
 * @fileOverview Generates a personalized preventive health plan for a patient.
 *
 * - generatePersonalizedHealthPlan - A function that creates the health plan.
 * - HealthPlanInput - The input type for the function.
 * - HealthPlanOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthPlanInputSchema = z.object({
  age: z.number().describe("The patient's age in years."),
  lifestyle: z.enum(['Sedentary', 'Active', 'Very Active']).describe("The patient's lifestyle."),
  location: z.string().describe("The patient's current city and country."),
  symptomHistory: z.string().describe("A brief summary of the patient's past symptoms or conditions."),
  seasonalDiseaseRisk: z.string().describe("Any known seasonal disease risks for the patient's location (e.g., 'Post-monsoon allergy season')."),
  chatbotSummary: z.string().describe("A summary of the patient's recent interactions with the AI symptom checker chatbot."),
});
export type HealthPlanInput = z.infer<typeof HealthPlanInputSchema>;

const HealthPlanOutputSchema = z.object({
  planTitle: z.string().describe("A catchy, personalized title for the health plan."),
  planDuration: z.string().describe("The duration of the health plan (e.g., '30-Day Plan')."),
  recommendations: z.array(z.object({
    category: z.enum(['Diet', 'Exercise', 'Prevention', 'Mental Wellness', 'Monitoring']).describe("The category of the recommendation."),
    details: z.string().describe("The specific, actionable recommendation for the patient."),
  })).describe("An array of recommendations categorized for easy understanding."),
});
export type HealthPlanOutput = z.infer<typeof HealthPlanOutputSchema>;


export async function generatePersonalizedHealthPlan(input: HealthPlanInput): Promise<HealthPlanOutput> {
    return generatePersonalizedHealthPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedHealthPlanPrompt',
  input: {schema: HealthPlanInputSchema},
  output: {schema: HealthPlanOutputSchema},
  prompt: `You are a proactive AI Health Coach. Your goal is to create a personalized, preventive health plan for a patient based on their unique profile. The tone should be encouraging and empowering.

Patient Profile:
- Age: {{{age}}}
- Lifestyle: {{{lifestyle}}}
- Location: {{{location}}}
- Health History: {{{symptomHistory}}}
- Known Seasonal Risks: {{{seasonalDiseaseRisk}}}
- Recent Chatbot Interaction Summary: {{{chatbotSummary}}}

Based on this complete profile, create a personalized health plan. Your plan must include:
1.  A creative and encouraging title for the plan.
2.  A specified duration for the plan.
3.  A list of actionable recommendations across different categories like 'Diet', 'Exercise', 'Prevention', 'Mental Wellness', and 'Monitoring'. Make the recommendations specific and easy to follow.

For example, if the user has a history of allergies during a specific season, a 'Prevention' tip could be "Start taking your anti-allergy medication one week before the monsoon season begins."
If the user is sedentary, an 'Exercise' tip could be "Start with a 15-minute brisk walk three times a week and gradually increase to 30 minutes."
`,
});

const generatePersonalizedHealthPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedHealthPlanFlow',
    inputSchema: HealthPlanInputSchema,
    outputSchema: HealthPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
