"use client";

import { useState } from 'react';
import { analyzeLocalDiseaseTrends, LocalDiseaseTrendsOutput } from '@/ai/flows/local-disease-trends-analysis';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Siren } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/firebase/auth/use-user';

export function DiseaseTrends() {
  const { data: user } = useUser();
  const [trend, setTrend] = useState<LocalDiseaseTrendsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setIsLoading(true);
    setTrend(null);
    try {
      // In a real app, this data would come from a database.
      const mockInput = {
        location: 'Mumbai, India',
        timePeriod: 'last 30 days',
        historicalData:
          'Reported cases: Influenza - 150 (up 30% from last month), Dengue - 45 (up 15%), Common Cold - 300 (stable).',
      };
      const result = await analyzeLocalDiseaseTrends(mockInput);
      setTrend(result);
    } catch (error) {
      console.error('Trend analysis failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze trends. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-green-400 text-green-900">Low</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  const isDoctor = user?.role === 'doctor';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isDoctor ? 'AI Disease Trend Analysis' : 'Local Health Alerts'}</CardTitle>
        <CardDescription>
          {isDoctor ? 'Identify potential outbreaks in the local area.' : 'Stay informed about health trends in your community.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!trend && (
          <Button onClick={handleAnalysis} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDoctor ? 'Analyze Local Trends' : 'Check for Alerts'}
          </Button>
        )}
        {trend && (
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-lg border bg-secondary/50 p-4">
                <Siren className="h-8 w-8 text-destructive" />
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{trend.alertType}</h4>
                        {getSeverityBadge(trend.severity)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        <span className="font-semibold">{isDoctor ? 'Provider Recommendations:' : 'Safety Instructions:'}</span> {isDoctor ? trend.providerRecommendations : trend.communityPrecautions}
                    </p>
                </div>
            </div>
            <Button onClick={handleAnalysis} disabled={isLoading} variant="outline" size="sm">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isDoctor ? 'Re-analyze' : 'Refresh Alerts'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
