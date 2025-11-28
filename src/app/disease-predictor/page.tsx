'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { predictDiseaseProgression, PredictDiseaseProgressionOutput } from '@/ai/flows/predict-disease-progression';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, TrendingUp, ShieldCheck, TestTube2, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';

const PredictDiseaseProgressionInputSchema = z.object({
  currentCondition: z.string().describe("The patient's current medical condition (e.g., 'Type 2 Diabetes')."),
  patientAge: z.coerce.number().describe("The patient's age in years."),
  biomarkers: z.string().describe("Key biomarkers and their values (e.g., 'A1C: 7.5%, Blood Pressure: 140/90 mmHg')."),
  treatmentPlan: z.string().describe("The current treatment plan (e.g., 'Metformin 500mg daily, dietary changes')."),
  lifestyleFactors: z.string().describe("Relevant lifestyle factors (e.g., 'Sedentary, smoker')."),
  timeframe: z.string().describe("The time frame for the prediction (e.g., '6 months', '1 year').")
});

export default function DiseasePredictorPage() {
  const [prediction, setPrediction] = useState<PredictDiseaseProgressionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof PredictDiseaseProgressionInputSchema>>({
    resolver: zodResolver(PredictDiseaseProgressionInputSchema),
    defaultValues: {
      currentCondition: 'Type 2 Diabetes',
      patientAge: 58,
      biomarkers: 'A1C: 8.1%, Blood Pressure: 150/95 mmHg, LDL Cholesterol: 160 mg/dL',
      treatmentPlan: 'Metformin 1000mg daily, Atorvastatin 20mg daily',
      lifestyleFactors: 'Sedentary lifestyle, high-carb diet, non-smoker',
      timeframe: '1 year',
    },
  });

  async function onSubmit(values: z.infer<typeof PredictDiseaseProgressionInputSchema>) {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await predictDiseaseProgression(values);
      setPrediction(result);
    } catch (error) {
      console.error('Prediction failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to get prediction. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const ConfidenceBadge = ({ score }: { score: number }) => {
    const percentage = Math.round(score * 100);
    let colorClass = 'bg-green-500';
    if (percentage < 75) colorClass = 'bg-yellow-500';
    if (percentage < 50) colorClass = 'bg-red-500';

    return <Badge className={`${colorClass} text-white`}>Confidence: {percentage}%</Badge>;
  };

  return (
    <div className="flex flex-col gap-6">
       <PageHeader 
          title="AI Disease Progression Predictor"
          description="Forecast the potential progression of a disease based on patient data."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Enter Patient Data</CardTitle>
                        <CardDescription>
                            Provide the necessary details to generate a disease progression forecast.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="currentCondition" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Current Condition</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="patientAge" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Patient Age</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="biomarkers" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Biomarkers</FormLabel>
                            <FormControl><Textarea {...field} rows={3} /></FormControl>
                             <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="treatmentPlan" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Current Treatment Plan</FormLabel>
                            <FormControl><Textarea {...field} rows={2} /></FormControl>
                             <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="lifestyleFactors" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Lifestyle Factors</FormLabel>
                            <FormControl><Textarea {...field} rows={2} /></FormControl>
                             <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="timeframe" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Prediction Timeframe</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Predict Progression
                        </Button>
                    </CardFooter>
                    </form>
                </Form>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Prediction Results</CardTitle>
                        {prediction && <ConfidenceBadge score={prediction.confidenceScore} />}
                    </div>
                    <CardDescription>The AI's forecast of the disease progression.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="h-12 w-12 animate-spin mb-4" />
                            <p>Analyzing patient data...</p>
                        </div>
                    )}
                    {prediction && (
                        <div className="space-y-6">
                             <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2 text-primary"><TrendingUp /> Predicted Progression</h4>
                                <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">{prediction.predictedProgression}</p>
                            </div>
                             <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2"><TestTube2 /> Key Influencing Factors</h4>
                                <p className="text-sm text-muted-foreground">{prediction.keyFactors}</p>
                            </div>
                             <div className="space-y-3">
                                <h4 className="font-semibold flex items-center gap-2"><ShieldCheck /> Preventative Recommendations</h4>
                                <p className="text-sm text-muted-foreground">{prediction.preventativeRecommendations}</p>
                            </div>
                        </div>
                    )}
                     {!prediction && !isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <Stethoscope className="h-12 w-12 mb-4 text-primary/50"/>
                            <p>Prediction results will appear here once you submit patient data.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
