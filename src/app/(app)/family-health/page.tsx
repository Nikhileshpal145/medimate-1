'use client';

import { useState } from 'react';
import { analyzeFamilyHealth, FamilyHealthOutput } from '@/ai/flows/analyze-family-health';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Users, ShieldAlert, GitBranch, Lightbulb, TriangleAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// Mock Data representing a family structure
const mockFamilyData = {
  familyName: 'The Sharma Family',
  members: [
    { name: 'Rohan (Father)', age: 45, conditions: ['Hypertension', 'High Cholesterol'] },
    { name: 'Priya (Mother)', age: 42, conditions: ['Migraines'] },
    { name: 'Aarav (Son)', age: 16, conditions: ['Asthma (Mild)'] },
    { name: 'Meera (Daughter)', age: 14, conditions: ['None Reported', 'Seasonal Allergies', 'Recent: Fever, Cough'] },
  ],
};

export default function FamilyHealthPage() {
  const [analysis, setAnalysis] = useState<FamilyHealthOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleAnalysis() {
    setIsLoading(true);
    setAnalysis(null);
    try {
      // Convert the mock data to the string format expected by the AI flow
      const healthDataString = mockFamilyData.members.map(m => 
        `${m.name} (Age ${m.age}): Conditions - [${m.conditions.join(', ')}]`
      ).join('; ');

      const result = await analyzeFamilyHealth({ familyHealthData: healthDataString });
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to get analysis. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const AlertCard = ({ title, alerts, icon, variant }: { title: string, alerts: string[], icon: React.ReactNode, variant: 'default' | 'destructive' }) => {
    const cardBorderColor = variant === 'destructive' ? 'border-destructive' : 'border-yellow-500';
    const bgColor = variant === 'destructive' ? 'bg-destructive/10' : 'bg-yellow-400/10';
    
    return (
        <Card className={`${cardBorderColor} ${bgColor}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">{icon} {title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 list-disc list-inside text-sm">
                    {alerts.map((alert, index) => (
                        <li key={index}>{alert}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
          title="Family Health Graph"
          description="Track family disease patterns, hereditary risks, and get personalized health tips."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users /> The Sharma Family</CardTitle>
                    <CardDescription>A summary of your linked family members and their primary health conditions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {mockFamilyData.members.map(member => (
                            <li key={member.name} className="flex items-center gap-3">
                                <Image src={`https://picsum.photos/seed/${member.name}/40/40`} alt={member.name} width={40} height={40} className="rounded-full" />
                                <div>
                                    <p className="font-semibold">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.conditions[0]}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Generate AI Health Insights</CardTitle>
                    <CardDescription>
                        Analyze your family's data to get personalized health alerts and recommendations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleAnalysis} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {analysis ? 'Re-analyze Data' : 'Analyze Family Health'}
                    </Button>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2 flex flex-col">
            {isLoading && (
                <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground p-8">
                    <Loader2 className="h-12 w-12 animate-spin mb-4" />
                    <p>Analyzing family health data...</p>
                </div>
            )}

            {analysis && (
                <div className="space-y-6">
                    <AlertCard 
                        title="Hereditary Risk Alerts"
                        alerts={analysis.hereditaryRiskAlerts}
                        icon={<GitBranch className="text-yellow-600"/>}
                        variant="default"
                    />

                    <AlertCard 
                        title="Cross-Infection Alerts"
                        alerts={analysis.crossInfectionAlerts}
                        icon={<TriangleAlert className="text-destructive"/>}
                        variant="destructive"
                    />
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Lightbulb /> Family-Wide Health Tips</CardTitle>
                        </CardHeader>
                         <CardContent>
                            <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                                {analysis.familyHealthTips.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            )}
            
            {!analysis && !isLoading && (
                 <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                    <Users className="h-12 w-12 mb-4 text-primary/50"/>
                    <h3 className="font-semibold text-lg">Your Family Health Insights</h3>
                    <p>Click "Analyze Family Health" to generate AI-powered insights and alerts based on your family's linked health data.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
