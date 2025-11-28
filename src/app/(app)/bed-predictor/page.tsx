
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { predictBedOccupancy, PredictBedOccupancyOutput } from '@/ai/flows/predict-bed-occupancy';
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
import { Loader2, Bed, BedDouble, AlertTriangle, Forward, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  currentCondition: z.string().min(1, "Primary diagnosis is required."),
  vitalSigns: z.string().min(1, "Vital signs are required."),
  patientAge: z.coerce.number().min(0, "Age must be a positive number."),
  comorbidities: z.string().min(1, "Comorbidities are required."),
});

export default function BedPredictorPage() {
  const [prediction, setPrediction] = useState<PredictBedOccupancyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentCondition: 'Severe Pneumonia',
      vitalSigns: 'Heart Rate: 120 bpm, O2 Sat: 88% on 4L NC, BP: 95/65 mmHg, Temp: 101.5°F',
      patientAge: 72,
      comorbidities: 'COPD, Type 2 Diabetes',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await predictBedOccupancy(values);
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
    if (percentage < 80) colorClass = 'bg-yellow-500';
    if (percentage < 60) colorClass = 'bg-red-500';

    return <Badge className={`${colorClass} text-white`}>Confidence: {percentage}%</Badge>;
  };

  const PredictionResult = ({ prediction }: { prediction: PredictBedOccupancyOutput }) => {
    const isIcu = prediction.icuNeeded;
    const isBed = prediction.bedNeeded;

    let title = "Monitoring Recommended";
    let Icon = FileText;
    let colorClass = "text-green-600";

    if (isBed && !isIcu) {
        title = "General Bed Admission Recommended";
        Icon = BedDouble;
        colorClass = "text-yellow-600";
    }
    if (isIcu) {
        title = "ICU Admission Recommended";
        Icon = AlertTriangle;
        colorClass = "text-destructive";
    }
    
    return (
      <div className="space-y-6">
        <div className={`p-4 rounded-lg border flex items-center gap-4 ${isIcu ? 'bg-destructive/10 border-destructive' : isBed ? 'bg-yellow-400/10 border-yellow-500' : 'bg-green-500/10 border-green-600'}`}>
            <Icon className={`h-8 w-8 ${colorClass}`} />
            <div>
                <h3 className={`font-bold text-lg ${colorClass}`}>{title}</h3>
                <p className="text-sm text-muted-foreground">{prediction.reasoning}</p>
            </div>
        </div>
        <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2"><Forward /> Recommended Action</h4>
            <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">{prediction.recommendedAction}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
          title="AI Bed Occupancy Predictor"
          description="Predict the need for hospital or ICU admission based on patient data."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Patient Triage Data</CardTitle>
                        <CardDescription>
                            Enter the patient's current clinical information to predict admission needs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="currentCondition" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Admitting Diagnosis</FormLabel>
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
                        <FormField control={form.control} name="vitalSigns" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Vital Signs</FormLabel>
                            <FormControl><Textarea {...field} rows={3} /></FormControl>
                             <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="comorbidities" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Comorbidities</FormLabel>
                            <FormControl><Textarea {...field} rows={2} /></FormControl>
                             <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Predict Need
                        </Button>
                    </CardFooter>
                    </form>
                </Form>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Admission Prediction</CardTitle>
                        {prediction && <ConfidenceBadge score={prediction.predictionConfidence} />}
                    </div>
                    <CardDescription>The AI's recommendation for patient placement.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="h-12 w-12 animate-spin mb-4" />
                            <p>Assessing patient data...</p>
                        </div>
                    )}
                    {prediction && (
                       <PredictionResult prediction={prediction} />
                    )}
                     {!prediction && !isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <Bed className="h-12 w-12 mb-4 text-primary/50"/>
                            <p>Prediction results will appear here once you submit patient data.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
