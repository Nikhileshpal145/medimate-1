
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/predict-no-shows.ts';
import '@/ai/flows/summarize-patient-history.ts';
import '@/ai/flows/ai-symptom-checker.ts';
import '@/ai/flows/local-disease-trends-analysis.ts';
import '@/ai/flows/compose-prescription-email.ts';
import '@/ai/flows/predict-disease-progression.ts';
import '@/ai/flows/predict-bed-occupancy.ts';
import '@/ai/flows/summarize-medical-report.ts';
import '@/ai/flows/analyze-community-health.ts';
import '@/ai/flows/analyze-family-health.ts';
import '@/ai/flows/generate-personalized-health-plan.ts';
