'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { summarizeMedicalReport, SummarizeMedicalReportOutput } from '@/ai/flows/summarize-medical-report';
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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ClipboardCopy, FileText, Beaker, Scan } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';

const formSchema = z.object({
  reportText: z.string().min(50, "Report text must be at least 50 characters."),
});

export default function ReportSummarizerPage() {
  const [summary, setSummary] = useState<SummarizeMedicalReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportText: 'Patient Name: Rohan Gupta\nAge: 53\nDate: 2024-05-20\n\nCHIEF COMPLAINT: Chest Pain\n\nHISTORY: Patient presents with intermittent chest pain for the last 2 days. Describes the pain as a pressure-like sensation. No radiation of pain reported. Mild shortness of breath on exertion.\n\nPAST MEDICAL HISTORY: Hypertension, Hyperlipidemia.\n\nVITALS: BP 145/90, HR 88, O2 Sat 98% on room air, Temp 98.6F.\n\nLABORATORY DATA:\n- CBC: WBC 8.5, Hgb 14.2, Plt 250k\n- Troponin-I: <0.02 ng/mL (Negative)\n- D-Dimer: 0.4 ug/mL (Normal)\n- Basic Metabolic Panel: Sodium 140, Potassium 4.1, Creatinine 0.9\n\nIMAGING:\n- Chest X-Ray: Lungs are clear. No evidence of pneumonia or effusion. Cardiomediastinal silhouette is within normal limits.\n- Ultrasound (Sonography) of Heart: Echocardiogram shows normal left ventricular function. Ejection Fraction estimated at 55%. No significant valvular abnormalities noted.\n\nASSESSMENT/PLAN:\n1. Chest pain, likely non-cardiac in origin given negative troponins and normal ECG.\n2. Continue management for hypertension.\n3. Advised patient on lifestyle modifications.\n4. Follow-up in 1 week or sooner if symptoms worsen.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeMedicalReport(values);
      setSummary(result);
    } catch (error) {
      console.error('Summarization failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: 'Copied to clipboard!',
    });
  }

  const SummarySection = ({ title, content, icon, onCopy }: { title: string, content?: string, icon: React.ReactNode, onCopy: (content: string) => void }) => {
    if (!content) return null;
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold flex items-center gap-2">{icon} {title}</h4>
                <Button variant="ghost" size="icon" onClick={() => onCopy(content)}>
                    <ClipboardCopy className="h-4 w-4" />
                </Button>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
       <PageHeader 
          title="AI Medical Report Summarizer"
          description="Generate a concise summary of a patient's medical report."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Paste Medical Report</CardTitle>
                        <CardDescription>
                            Enter the full text of the medical report below to generate a summary.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField control={form.control} name="reportText" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Report Text</FormLabel>
                            <FormControl>
                                <Textarea 
                                    {...field} 
                                    placeholder="Paste the patient's medical report here..." 
                                    rows={15} 
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Summarize Report
                        </Button>
                    </CardFooter>
                    </form>
                </Form>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>AI Generated Summary</CardTitle>
                    <CardDescription>A structured summary of the key points from the report.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="h-12 w-12 animate-spin mb-4" />
                            <p>Generating summary...</p>
                        </div>
                    )}
                    {summary && (
                        <div className="space-y-4">
                           <SummarySection title="Primary Diagnosis" content={summary.primaryDiagnosis} icon={<FileText className="text-primary"/>} onCopy={copyToClipboard} />
                           <SummarySection title="Key Findings" content={summary.keyFindings} icon={<FileText className="text-primary"/>} onCopy={copyToClipboard} />
                           <SummarySection title="Blood Reports" content={summary.bloodReportSummary} icon={<Beaker className="text-primary"/>} onCopy={copyToClipboard} />
                           <SummarySection title="Imaging Reports" content={summary.imagingReportSummary} icon={<Scan className="text-primary"/>} onCopy={copyToClipboard} />
                        </div>
                    )}
                     {!summary && !isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <FileText className="h-12 w-12 mb-4 text-primary/50"/>
                            <p>The generated summary will appear here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
