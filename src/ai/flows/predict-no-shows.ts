'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting patient no-shows.
 *
 * - predictNoShow - Predicts whether a patient will no-show for their appointment.
 * - PredictNoShowInput - The input type for the predictNoShow function.
 * - PredictNoShowOutput - The return type for the predictNoShow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictNoShowInputSchema = z.object({
  patientId: z.string().describe('The unique identifier for the patient.'),
  appointmentDateTime: z.string().describe('The date and time of the appointment (ISO format).'),
  pastAppointments: z
    .number()
    .describe('The number of past appointments the patient has had.'),
  pastNoShows: z.number().describe('The number of past no-shows the patient has had.'),
  patientAge: z.number().describe('The age of the patient in years.'),
  distanceToClinic: z
    .number()
    .describe('The distance from the patient to the clinic in kilometers.'),
  reminderSent: z.boolean().describe('Whether a reminder was sent to the patient.'),
});
export type PredictNoShowInput = z.infer<typeof PredictNoShowInputSchema>;

const PredictNoShowOutputSchema = z.object({
  willNoShow: z.boolean().describe('A prediction of whether the patient will no-show.'),
  noShowProbability: z
    .number()
    .min(0)
    .max(1)
    .describe('The probability (0 to 1) that the patient will no-show.'),
  reasons: z
    .string()
    .optional()
    .describe('Possible reasons why the patient might no-show.'),
});
export type PredictNoShowOutput = z.infer<typeof PredictNoShowOutputSchema>;

export async function predictNoShow(input: PredictNoShowInput): Promise<PredictNoShowOutput> {
  return predictNoShowFlow(input);
}

const predictNoShowPrompt = ai.definePrompt({
  name: 'predictNoShowPrompt',
  input: {schema: PredictNoShowInputSchema},
  output: {schema: PredictNoShowOutputSchema},
  prompt: `You are an AI assistant for predicting patient no-shows for clinic appointments.
  Given the following information about a patient and their appointment, predict whether they will no-show.
  Provide the probability of no-show and the top reasons for your prediction.

  Patient ID: {{{patientId}}}
  Appointment Date/Time: {{{appointmentDateTime}}}
  Past Appointments: {{{pastAppointments}}}
  Past No-Shows: {{{pastNoShows}}}
  Age: {{{patientAge}}}
  Distance to Clinic: {{{distanceToClinic}}} km
  Reminder Sent: {{{reminderSent}}}

  Consider factors like past behavior, demographics, and appointment details.
  Format your response according to the PredictNoShowOutputSchema.
  Be concise and only use information provided in the input.
  `,
});

const predictNoShowFlow = ai.defineFlow(
  {
    name: 'predictNoShowFlow',
    inputSchema: PredictNoShowInputSchema,
    outputSchema: PredictNoShowOutputSchema,
  },
  async input => {
    const {output} = await predictNoShowPrompt(input);
    return output!;
  }
);
