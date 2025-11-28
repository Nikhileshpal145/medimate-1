'use server';
/**
 * @fileOverview Generates a patient-friendly email from a doctor's prescription and advice.
 *
 * - composePrescriptionEmail - A function that generates the email content.
 * - ComposeEmailInput - The input type for the composePrescriptionEmail function.
 * - ComposeEmailOutput - The return type for the composePrescriptionEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComposeEmailInputSchema = z.object({
  doctorName: z.string().describe("The name of the doctor."),
  patientName: z.string().describe("The name of the patient."),
  prescription: z.string().describe("The prescribed medicines, including dosage and frequency."),
  advice: z.string().describe("Additional advice or instructions from the doctor."),
});
export type ComposeEmailInput = z.infer<typeof ComposeEmailInputSchema>;

const ComposeEmailOutputSchema = z.object({
  emailSubject: z.string().describe("A suitable subject line for the email."),
  emailBody: z.string().describe("The full, formatted email body in a professional and friendly tone. Use Markdown for formatting (e.g., lists, bold text)."),
});
export type ComposeEmailOutput = z.infer<typeof ComposeEmailOutputSchema>;


export async function composePrescriptionEmail(input: ComposeEmailInput): Promise<ComposeEmailOutput> {
    return composePrescriptionEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'composePrescriptionEmailPrompt',
  input: {schema: ComposeEmailInputSchema},
  output: {schema: ComposeEmailOutputSchema},
  prompt: `You are an AI assistant for a medical clinic. Your task is to compose an email to a patient with their prescription and the doctor's advice.

The email should be clear, friendly, and professional. It must be formatted in Markdown.

- Start with a polite greeting to the patient.
- Clearly list the prescribed medications with their dosage and frequency. Use a Markdown list.
- Clearly state the doctor's advice.
- End with a warm closing and mention the doctor's name.

Doctor's Name: {{{doctorName}}}
Patient's Name: {{{patientName}}}
Prescription: {{{prescription}}}
Advice: {{{advice}}}
`,
});

const composePrescriptionEmailFlow = ai.defineFlow(
  {
    name: 'composePrescriptionEmailFlow',
    inputSchema: ComposeEmailInputSchema,
    outputSchema: ComposeEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
