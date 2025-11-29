
"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';

export function HealthSurvey() {
  const [feverish, setFeverish] = useState<string | undefined>();
  const [mosquito, setMosquito] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!feverish || !mosquito) {
        toast({
            title: 'Please answer all questions',
            variant: 'destructive'
        });
        return;
    }
    // In a real app, this would submit the data to a Firestore database.
    console.log({ feverish, mosquito });
    setSubmitted(true);
    toast({
        title: 'Thank you for your response!',
        description: 'Your survey has been submitted.'
    });
  };
  
  if (submitted) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Daily Health Check-in</CardTitle>
                <CardDescription>
                A quick 30-second survey to help us monitor community health.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center p-8 gap-4">
                <CheckCircle className="h-16 w-16 text-green-500"/>
                <h3 className="text-lg font-semibold">Survey Submitted!</h3>
                <p className="text-muted-foreground">Thank you for helping keep your community safe.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Health Check-in</CardTitle>
        <CardDescription>
          A quick 30-second survey to help us monitor community health.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
            <Label className="font-semibold">Do you feel feverish today?</Label>
            <RadioGroup value={feverish} onValueChange={setFeverish} className="flex gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="fever-yes" />
                    <Label htmlFor="fever-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="fever-no" />
                    <Label htmlFor="fever-no">No</Label>
                </div>
            </RadioGroup>
        </div>
         <div className="space-y-3">
            <Label className="font-semibold">Have you noticed any mosquito breeding spots (e.g., stagnant water) near your home?</Label>
             <RadioGroup value={mosquito} onValueChange={setMosquito} className="flex gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="mosquito-yes" />
                    <Label htmlFor="mosquito-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="mosquito-no" />
                    <Label htmlFor="mosquito-no">No</Label>
                </div>
            </RadioGroup>
        </div>
        <Button onClick={handleSubmit}>Submit Survey</Button>
      </CardContent>
    </Card>
  );
}
