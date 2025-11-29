
'use client';

import { useState } from 'react';
import { analyzeCommunityHealth, CommunityHealthOutput } from '@/ai/flows/analyze-community-health';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, AreaChart, ShieldAlert, Siren, ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function CommunityHealthPage() {
  const [analysis, setAnalysis] = useState<CommunityHealthOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleAnalysis() {
    setIsLoading(true);
    setAnalysis(null);
    try {
      // In a real app, this data would be fetched from your database of survey responses.
      const mockSurveyData = [
        { village: 'Rampur', feverish: true, mosquitoSpots: true },
        { village: 'Rampur', feverish: true, mosquitoSpots: false },
        { village: 'Rampur', feverish: false, mosquitoSpots: true },
        { village: 'Sitapur', feverish: false, mosquitoSpots: false },
        { village: 'Sitapur', feverish: false, mosquitoSpots: false },
        { village: 'Mohanpur', feverish: true, mosquitoSpots: true },
        { village: 'Mohanpur', feverish: true, mosquitoSpots: true },
        { village: 'Mohanpur', feverish: true, mosquitoSpots: true },
        { village: 'Mohanpur', feverish: true, mosquitoSpots: true },
      ];
      const result = await analyzeCommunityHealth({ surveyData: JSON.stringify(mockSurveyData) });
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

  const RiskBadge = ({ riskLevel }: { riskLevel: 'Low' | 'Medium' | 'High' }) => {
    let colorClass = 'bg-green-500';
    if (riskLevel === 'Medium') colorClass = 'bg-yellow-500';
    if (riskLevel === 'High') colorClass = 'bg-red-500';

    return <Badge className={`${colorClass} text-white`}>{riskLevel} Risk</Badge>;
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
          title="AI Community Health Dashboard"
          description="Analyze micro-survey data to generate a community health index and identify at-risk areas."
      />
      
      <Card>
        <CardHeader>
            <CardTitle>Health Index Analysis</CardTitle>
            <CardDescription>
                Click the button to process the latest community survey data and generate insights.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={handleAnalysis} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {analysis ? 'Re-analyze Data' : 'Analyze Community Data'}
            </Button>
        </CardContent>
      </Card>
      
        {isLoading && (
            <div className="flex flex-col items-center justify-center text-muted-foreground p-8">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p>Compiling survey data and generating insights...</p>
            </div>
        )}

        {analysis && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Siren className="text-destructive"/> High-Priority Alert</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg">{analysis.overallAssessment}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldAlert /> Intervention Areas</CardTitle>
                        <CardDescription>Villages identified for immediate action.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                           {analysis.areasForIntervention.map(area => (
                             <li key={area} className="font-semibold p-2 bg-secondary rounded-md">{area}</li>
                           ))}
                        </ul>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ListChecks /> Recommended Actions</CardTitle>
                        <CardDescription>Suggested steps for health workers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                           {analysis.recommendedActions.map((action, i) => (
                             <li key={i}>{action}</li>
                           ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><AreaChart /> Village Risk Ranking</CardTitle>
                        <CardDescription>Health scores and risk levels per village.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {analysis.villageRankings.map(village => (
                            <div key={village.villageName}>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-medium">{village.villageName}</p>
                                    <RiskBadge riskLevel={village.riskLevel} />
                                </div>
                                <Progress value={village.healthScore} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-1 text-right">Health Score: {village.healthScore}/100</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        )}
    </div>
  );
}

