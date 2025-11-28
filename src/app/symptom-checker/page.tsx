
"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { symptomChecker, SymptomCheckerOutput } from '@/ai/flows/ai-symptom-checker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Send, Mic, MapPin, Square } from 'lucide-react';
import { ChatMessage } from './chat-message';
import { PageHeader } from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  symptoms: z.string().min(1, 'Please describe your symptoms.'),
  location: z.string().min(1, 'Please provide your location.'),
});

type Message = {
  id: number;
  type: 'user' | 'bot';
  content: string | SymptomCheckerOutput;
};

// Add a global SpeechRecognition type
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export default function SymptomCheckerPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
      location: 'Mumbai, India',
    },
  });

   useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          form.setValue('symptoms', transcript);
          setIsListening(false);
          form.handleSubmit(onSubmit)();
        };
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          toast({ title: 'Voice Error', description: `Could not recognize speech: ${event.error}`, variant: 'destructive'});
          setIsListening(false);
        };
      } else {
        toast({ title: 'Voice Not Supported', description: 'Your browser does not support voice recognition.', variant: 'destructive' });
      }
    }
  }, [form, toast]);

  useEffect(() => {
    if (recognitionRef.current) {
        recognitionRef.current.lang = language;
    }
  }, [language]);


  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
    } else {
        recognitionRef.current?.start();
        setIsListening(true);
    }
  }

  const getAnalysisAsText = (analysis: SymptomCheckerOutput) => {
    let text = `Based on your symptoms, here is my analysis. `;
    text += `The criticality is ${analysis.diseaseCriticalness}. `;
    text += `Potential conditions include: ${analysis.potentialConditions}. `;
    text += `I recommend the following actions: ${analysis.recommendedActions}. `;
    text += `You should consider seeing a ${analysis.recommendedDoctorSpecialty}.`;
    return text;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const userMessageContent = `Symptoms: ${values.symptoms} | Location: ${values.location}`;
    const userMessage: Message = { id: Date.now(), type: 'user', content: userMessageContent };
    setMessages((prev) => [...prev, userMessage]);
    form.reset({ ...values, symptoms: '' });

    try {
      const result = await symptomChecker({ symptoms: values.symptoms, location: values.location });
      const botMessage: Message = { id: Date.now() + 1, type: 'bot', content: result };
      setMessages((prev) => [...prev, botMessage]);
      const analysisText = getAnalysisAsText(result);
      speak(analysisText);
    } catch (error) {
      console.error('Symptom check failed:', error);
      const errorText = "I'm sorry, but I was unable to process your request. Please try again later.";
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: errorText,
      };
      setMessages((prev) => [...prev, errorMessage]);
      speak(errorText);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <PageHeader
        title="AI Symptom Checker"
        description="Get initial insights based on symptoms. This is not a substitute for professional medical advice."
      />
      <div className="flex-1 overflow-hidden rounded-lg border shadow-sm">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.length === 0 && (
                <ChatMessage message={{id: 0, type: 'bot', content: "Hello! Please describe your symptoms and provide your location (e.g., city) so I can help find nearby doctors."}} />
            )}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
                 <ChatMessage message={{id: -1, type: 'bot', content: ""}} isLoading={true} />
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="flex items-start gap-2">
                 <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormControl>
                            <Input
                            placeholder="e.g., 'I have a fever, cough, and a headache.'"
                            autoComplete="off"
                            {...field}
                            disabled={isLoading}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <Select onValueChange={setLanguage} defaultValue={language} disabled={isLoading || isListening}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en-US">English</SelectItem>
                        <SelectItem value="hi-IN">Hindi</SelectItem>
                        <SelectItem value="bn-IN">Bengali</SelectItem>
                        <SelectItem value="te-IN">Telugu</SelectItem>
                        <SelectItem value="mr-IN">Marathi</SelectItem>
                    </SelectContent>
                </Select>
                <Button type="button" variant={isListening ? "destructive" : "outline"} size="icon" onClick={handleVoiceToggle} disabled={isLoading}>
                    {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    <span className="sr-only">{isListening ? "Stop Listening" : "Use Voice"}</span>
                </Button>
                <Button type="submit" size="icon" disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
                </Button>
            </div>
             <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        placeholder="Your location (e.g., Mumbai, India)"
                        autoComplete="off"
                        {...field}
                        disabled={isLoading}
                        className="pl-10"
                        />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
