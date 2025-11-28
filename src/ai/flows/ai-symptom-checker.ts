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
import { doctors, Doctor } from '@/lib/doctors';

const SymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe("A description of the patient's symptoms."),
    location: z.string().describe("The user's current location (e.g., city, state)."),
    language: z.string().describe("The language for the response (e.g., 'en-US', 'hi-IN')."),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const DoctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
  location: z.string(),
  avatar: z.string(),
});

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
  recommendedDoctors: z.array(DoctorSchema).optional().describe("A list of recommended doctors near the user's location."),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

const getNearbyDoctors = ai.defineTool(
  {
    name: 'getNearbyDoctors',
    description: 'Get a list of doctors near a specified location for a given specialty.',
    inputSchema: z.object({
      specialty: z.string().describe("The doctor's specialty to search for."),
      location: z.string().describe('The location to search for doctors in.'),
    }),
    outputSchema: z.array(DoctorSchema),
  },
  async (input) => {
    console.log(`Searching for ${input.specialty} in ${input.location}`);
    // In a real app, this would query a database. Here we filter mock data.
    // We will do a case-insensitive, partial match on location.
    const lowerCaseLocation = input.location.toLowerCase();
    const matchingDoctors = doctors.filter(doctor => 
        doctor.specialty.toLowerCase() === input.specialty.toLowerCase() &&
        doctor.location.toLowerCase().includes(lowerCaseLocation)
    );
    return matchingDoctors;
  }
);


export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  tools: [getNearbyDoctors],
  prompt: `You are an AI Health Assistant. Your response must be in the language specified in the 'language' field.

Based on the symptoms and location provided, you will:
1.  Provide a summary of potential conditions.
2.  Provide recommended actions.
3.  Assess the disease criticalness ('Low', 'Medium', 'High').
4.  Determine the appropriate doctor's specialty.
5.  Use the getNearbyDoctors tool to find doctors of that specialty in the user's location. The tool will return doctor information in English. Do not translate doctor names, specialties, or locations.
6.  Translate all other text fields in your final response (potentialConditions, recommendedActions, and recommendedDoctorSpecialty) to the requested language.

Symptoms: {{{symptoms}}}
Location: {{{location}}}
Language: {{{language}}}
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
