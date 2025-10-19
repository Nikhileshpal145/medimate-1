"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { symptomChecker } from '@/ai/flows/ai-symptom-checker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Send, Mic } from 'lucide-react';
import { ChatMessage } from './chat-message';
import { PageHeader } from '@/components/page-header';

const formSchema = z.object({
  symptoms: z.string().min(1, 'Please describe your symptoms.'),
});

type Message = {
  id: number;
  type: 'user' | 'bot';
  content: string | { potentialConditions: string; recommendedActions: string };
};

export default function SymptomCheckerPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to scroll to the bottom.
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const userMessage: Message = { id: Date.now(), type: 'user', content: values.symptoms };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const result = await symptomChecker({ symptoms: values.symptoms });
      const botMessage: Message = { id: Date.now() + 1, type: 'bot', content: result };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Symptom check failed:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, but I was unable to process your request. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
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
                <ChatMessage message={{id: 0, type: 'bot', content: "Hello! How can I help you today? Please describe your symptoms."}} />
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
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
             <Button type="button" variant="outline" size="icon" disabled={isLoading}>
              <Mic className="h-4 w-4" />
              <span className="sr-only">Use Voice</span>
            </Button>
            <Button type="submit" size="icon" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
