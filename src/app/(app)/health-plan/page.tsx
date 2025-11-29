'use client';

import { useState } from 'react';
import { generatePersonalizedHealthPlan, HealthPlanOutput } from '@/ai/flows/generate-personalized-health-plan';
import { useUser } from '@/firebase/auth/use-user';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, ClipboardCheck, Salad, Dumbbell, Shield, Brain, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';

export default function HealthPlanPage() {
  const { data: user } = useUser();
  const [plan, setPlan] = useState<HealthPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleGeneratePlan() {
    if (!user) {
      toast({ title: 'Please log in to generate a plan.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setPlan(null);
    try {
      // In a real app, this data would be dynamically fetched from the user's records.
      const mockInput = {
        age: 28,
        lifestyle: 'Active' as const,
        location: 'Mumbai, India',
        symptomHistory: 'History of seasonal allergies, occasional migraines.',
        seasonalDiseaseRisk: 'Post-monsoon, high pollen count.',
        chatbotSummary: 'User recently inquired about managing allergy symptoms and asked for nearby parks for jogging.'
      };
      const result = await generatePersonalizedHealthPlan(mockInput);
      setPlan(result);
    } catch (error) {
      console.error('Plan generation failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate your health plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Diet': return <Salad className="h-5 w-5 text-primary" />;
      case 'Exercise': return <Dumbbell className="h-5 w-5 text-primary" />;
      case 'Prevention': return <Shield className="h-5 w-5 text-primary" />;
      case 'Mental Wellness': return <Brain className="h-5 w-5 text-primary" />;
      case 'Monitoring': return <Activity className="h-5 w-5 text-primary" />;
      default: return <ClipboardCheck className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
          title="Your AI Health Coach"
          description="Generate a personalized preventive care plan to stay ahead of your health."
      />
      
      {!plan && !isLoading && (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Ready for Your Personalized Health Plan?</CardTitle>
                <CardDescription>
                   Let our AI analyze your health profile to create a custom preventive care plan just for you.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleGeneratePlan} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate My Plan
                </Button>
            </CardContent>
        </Card>
      )}

      {isLoading && (
          <div className="flex flex-col items-center justify-center text-muted-foreground p-8">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p>Curating your personalized health plan...</p>
          </div>
      )}

      {plan && (
          <div className="space-y-6">
            <Card className="bg-primary/10 border-primary">
                <CardHeader>
                    <CardTitle>{plan.planTitle}</CardTitle>
                    <CardDescription>Your {plan.planDuration} to better health.</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plan.recommendations.map((rec, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                {getCategoryIcon(rec.category)}
                                {rec.category}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{rec.details}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="text-center">
                <Button variant="outline" onClick={handleGeneratePlan} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Regenerate Plan
                </Button>
            </div>
          </div>
      )}
    </div>
  );
}
