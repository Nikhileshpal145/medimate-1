"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { composePrescriptionEmail, ComposeEmailOutput, ComposeEmailInputSchema } from '@/ai/flows/compose-prescription-email';
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
import { Loader2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';

export default function PrescriptionEmailerPage() {
  const [emailContent, setEmailContent] = useState<ComposeEmailOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ComposeEmailInputSchema>>({
    resolver: zodResolver(ComposeEmailInputSchema),
    defaultValues: {
      doctorName: 'Dr. Sharma',
      patientName: '',
      prescription: '',
      advice: '',
    },
  });

  async function onSubmit(values: z.infer<typeof ComposeEmailInputSchema>) {
    setIsLoading(true);
    setEmailContent(null);
    try {
      const result = await composePrescriptionEmail(values);
      setEmailContent(result);
    } catch (error) {
      console.error('Email generation failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate email. Please try again.',
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

  return (
    <div className="flex flex-col gap-6">
       <PageHeader 
          title="AI Prescription Emailer"
          description="Generate patient-friendly emails for prescriptions and medical advice."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Enter Details</CardTitle>
                        <CardDescription>
                        Fill in the prescription and advice to generate an email.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="patientName" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Patient Name</FormLabel>
                                <FormControl><Input {...field} placeholder="e.g., Aarav Sharma" /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="doctorName" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Doctor Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                         <FormField control={form.control} name="prescription" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Prescription</FormLabel>
                            <FormControl><Textarea {...field} placeholder="e.g., Paracetamol 500mg - 1 tablet twice a day for 3 days" rows={4} /></FormControl>
                             <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="advice" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Doctor's Advice</FormLabel>
                            <FormControl><Textarea {...field} placeholder="e.g., Drink plenty of fluids and get adequate rest." rows={3} /></FormControl>
                             <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Email
                        </Button>
                    </CardFooter>
                    </form>
                </Form>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Generated Email</CardTitle>
                    <CardDescription>Review the generated email below. You can copy the content.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading && (
                        <div className="flex items-center justify-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    )}
                    {emailContent && (
                        <div className="space-y-4">
                             <div>
                                <div className="flex justify-between items-center">
                                    <Label htmlFor='subject'>Subject</Label>
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(emailContent.emailSubject)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Input id="subject" readOnly value={emailContent.emailSubject} />
                            </div>
                             <div>
                                <div className="flex justify-between items-center">
                                    <Label htmlFor='body'>Body</Label>
                                     <Button variant="ghost" size="icon" onClick={() => copyToClipboard(emailContent.emailBody)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Textarea id="body" readOnly value={emailContent.emailBody} className="h-64 font-mono text-sm" />
                            </div>
                        </div>
                    )}
                     {!emailContent && !isLoading && (
                        <div className="flex items-center justify-center h-48">
                            <p className="text-muted-foreground">Email content will appear here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
