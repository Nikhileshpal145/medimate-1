'use server';
/**
 * @fileOverview Analyzes family health data to identify hereditary risks and cross-infection alerts.
 *
 * - analyzeFamilyHealth - A function that processes family health data to generate insights.
 * - FamilyHealthInput - The input type for the function.
 * - FamilyHealthOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FamilyHealthInputSchema = z.object({
  familyHealthData: z.string().describe("A semicolon-separated string of family members' health data. Each entry includes name, age, and a list of current or past medical conditions. Recent acute symptoms should be noted."),
});
export type FamilyHealthInput = z.infer<typeof FamilyHealthInputSchema>;

const FamilyHealthOutputSchema = z.object({
  hereditaryRiskAlerts: z.array(z.string()).describe("A list of potential hereditary health risks based on conditions present in multiple family members (e.g., 'Hypertension and high cholesterol in the father may indicate a genetic predisposition to cardiovascular issues for the children.')."),
  crossInfectionAlerts: z.array(z.string()).describe("A list of alerts for potential cross-infection within the household, based on communicable diseases (e.g., 'Fever and cough in one member could spread. Recommend monitoring other family members for similar symptoms.'). Omit if no communicable diseases are present."),
  familyHealthTips: z.array(z.string()).describe("A list of actionable health and awareness tips for the entire family, based on the identified risks (e.g., 'Consider heart-healthy diets for the whole family.', 'Encourage regular hand-washing to prevent spread of illness.')."),
});
export type FamilyHealthOutput = z.infer<typeof FamilyHealthOutputSchema>;


export async function analyzeFamilyHealth(input: FamilyHealthInput): Promise<FamilyHealthOutput> {
    return analyzeFamilyHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFamilyHealthPrompt',
  input: {schema: FamilyHealthInputSchema},
  output: {schema: FamilyHealthOutputSchema},
  prompt: `You are an AI medical analyst specializing in family health and genetics.

Your task is to analyze the provided family health data to identify potential hereditary risks, communicable disease spread, and provide relevant advice.

Family Health Data:
{{{familyHealthData}}}

Based on the data, you must:
1.  **Identify Hereditary Risks**: Look for chronic conditions (like hypertension, diabetes, heart disease, certain cancers) present in parents or across multiple members. Generate alerts about potential genetic predispositions for other family members.
2.  **Identify Cross-Infection Risks**: Look for acute, communicable symptoms (like fever, cough, flu, stomach virus) in any family member. Generate alerts about the risk of it spreading to others in the household. If no such symptoms are present, this output array should be empty.
3.  **Provide Family Health Tips**: Based on the identified risks, provide concrete, actionable tips for the entire family to improve their collective health and mitigate risks.

Be concise and professional in your analysis.
`,
});

const analyzeFamilyHealthFlow = ai.defineFlow(
  {
    name: 'analyzeFamilyHealthFlow',
    inputSchema: FamilyHealthInputSchema,
    outputSchema: FamilyHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
