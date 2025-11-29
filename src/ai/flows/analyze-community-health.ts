
'use server';
/**
 * @fileOverview Analyzes community health data from micro-surveys to identify at-risk areas.
 *
 * - analyzeCommunityHealth - A function that processes survey data to generate health insights.
 * - CommunityHealthInput - The input type for the function.
 * - CommunityHealthOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommunityHealthInputSchema = z.object({
  surveyData: z.string().describe("A JSON string representing an array of survey responses. Each response contains 'village', 'feverish' (boolean), and 'mosquitoSpots' (boolean)."),
});
export type CommunityHealthInput = z.infer<typeof CommunityHealthInputSchema>;

const CommunityHealthOutputSchema = z.object({
  overallAssessment: z.string().describe("A brief, one-sentence overall assessment of the community's health status based on the data."),
  areasForIntervention: z.array(z.string()).describe("A list of village names that require immediate public health intervention."),
  recommendedActions: z.array(z.string()).describe("A list of concrete, actionable recommendations for health workers (e.g., 'Deploy fogging machines in Rampur', 'Distribute fever medication in Mohanpur')."),
  villageRankings: z.array(z.object({
    villageName: z.string(),
    healthScore: z.number().min(0).max(100).describe("A calculated health score from 0 (worst) to 100 (best)."),
    riskLevel: z.enum(['Low', 'Medium', 'High']),
  })).describe("An array of objects, each representing a village with its calculated health score and risk level, ranked from highest risk to lowest risk."),
});
export type CommunityHealthOutput = z.infer<typeof CommunityHealthOutputSchema>;


export async function analyzeCommunityHealth(input: CommunityHealthInput): Promise<CommunityHealthOutput> {
    return analyzeCommunityHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCommunityHealthPrompt',
  input: {schema: CommunityHealthInputSchema},
  output: {schema: CommunityHealthOutputSchema},
  prompt: `You are a public health AI expert. Your task is to analyze raw data from micro-health surveys to identify potential disease outbreaks and guide public health interventions.

Analyze the provided survey data. Based on the data, you must:
1.  **Calculate a 'Health Score' for each village (0-100)**: A lower score indicates a higher health risk. Factor in the percentage of 'feverish' reports and 'mosquito breeding spots'. Fever is a stronger indicator of risk than mosquito spots.
2.  **Determine a 'Risk Level' ('Low', 'Medium', 'High')** for each village based on its Health Score.
3.  **Create 'Village Rankings'**: Rank the villages from highest risk (lowest score) to lowest risk (highest score).
4.  **Identify 'Areas for Intervention'**: List the names of all villages with a 'High' risk level.
5.  **Provide 'Recommended Actions'**: Suggest specific, practical actions for health workers based on the highest-risk villages. For example, if a village has high fever and mosquito reports, recommend both medical camps and fogging.
6.  **Formulate an 'Overall Assessment'**: Write a single, concise sentence summarizing the most critical finding from your analysis (e.g., "Immediate intervention is required in Mohanpur due to a high concentration of fever cases and reported mosquito breeding sites.").

Survey Data:
{{{surveyData}}}
`,
});

const analyzeCommunityHealthFlow = ai.defineFlow(
  {
    name: 'analyzeCommunityHealthFlow',
    inputSchema: CommunityHealthInputSchema,
    outputSchema: CommunityHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
