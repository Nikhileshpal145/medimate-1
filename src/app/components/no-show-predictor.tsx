"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { predictNoShow, PredictNoShowOutput } from '@/ai/flows/predict-no-shows';
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
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required.'),
  appointmentDateTime: z.string().min(1, 'Appointment date is required.'),
  pastAppointments: z.coerce.number().min(0),
  pastNoShows: z.coerce.number().min(0),
  patientAge: z.coerce.number().min(0),
  distanceToClinic: z.coerce.number().min(0),
  reminderSent: z.boolean(),
});

export function NoShowPredictor() {
  const [prediction, setPrediction] = useState<PredictNoShowOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: 'PAT006',
      appointmentDateTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0,16),
      pastAppointments: 5,
      pastNoShows: 1,
      patientAge: 34,
      distanceToClinic: 15,
      reminderSent: true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await predictNoShow(values);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI No-Show Predictor</CardTitle>
        <CardDescription>
          Predict the likelihood of a patient missing their appointment.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="patientId" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Patient ID</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="appointmentDateTime" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Appointment</FormLabel>
                    <FormControl><Input type="datetime-local" {...field} /></FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="pastAppointments" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Past Appts</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="pastNoShows" render={({ field }) => (
                    <FormItem>
                    <FormLabel>No-Shows</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="patientAge" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="distanceToClinic" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Distance (km)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                )} />
            </div>
            <FormField control={form.control} name="reminderSent" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <FormLabel>Reminder Sent</FormLabel>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
            )} />
            
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Predict
            </Button>
            {prediction && (
                <div className="mt-4 rounded-lg border bg-secondary/50 p-4 w-full">
                <h4 className="font-semibold text-lg">Prediction Result:</h4>
                <p className={`font-bold text-xl ${prediction.willNoShow ? 'text-destructive' : 'text-green-600'}`}>
                    {prediction.willNoShow ? 'Likely No-Show' : 'Likely to Attend'}
                </p>
                <p>
                    Probability of No-Show: <span className="font-semibold">{Math.round(prediction.noShowProbability * 100)}%</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-semibold">Reasoning:</span> {prediction.reasons}
                </p>
                </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
