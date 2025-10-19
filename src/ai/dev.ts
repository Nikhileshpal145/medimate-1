import { config } from 'dotenv';
config();

import '@/ai/flows/predict-no-shows.ts';
import '@/ai/flows/summarize-patient-history.ts';
import '@/ai/flows/ai-symptom-checker.ts';
import '@/ai/flows/local-disease-trends-analysis.ts';