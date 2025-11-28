
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
import { Loader2, ClipboardCopy, FileText } from 'lucide-react';
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
      reportText: '',
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
        title: 'Summary Copied!',
        description: 'The summary has been copied to your clipboard.',
    });
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
                    <div className="flex justify-between items-center">
                        <CardTitle>AI Generated Summary</CardTitle>
                        {summary && (
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(summary.summary)}>
                                <ClipboardCopy className="h-4 w-4" />
                                <span className="sr-only">Copy Summary</span>
                            </Button>
                        )}
                    </div>
                    <CardDescription>A concise summary of the key points from the report.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="h-12 w-12 animate-spin mb-4" />
                            <p>Generating summary...</p>
                        </div>
                    )}
                    {summary && (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-muted-foreground bg-secondary/50 p-4 rounded-md" dangerouslySetInnerHTML={{ __html: summary.summary.replace(/\n/g, '<br />') }} />
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
