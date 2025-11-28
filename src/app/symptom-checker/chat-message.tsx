import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, User, Loader2, AlertTriangle, HeartPulse, UserCheck } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type SymptomAnalysis = { 
    potentialConditions: string; 
    recommendedActions: string; 
    diseaseCriticalness: 'Low' | 'Medium' | 'High';
    recommendedDoctorSpecialty: string;
};

type Message = {
    id: number;
    type: 'user' | 'bot';
    content: string | SymptomAnalysis;
};

type ChatMessageProps = {
    message: Message;
    isLoading?: boolean;
}

const getCriticalnessBadge = (criticalness: SymptomAnalysis['diseaseCriticalness']) => {
    switch (criticalness) {
      case 'High':
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> High</Badge>;
      case 'Medium':
        return <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 gap-1"><HeartPulse className="h-3 w-3"/> Medium</Badge>;
      case 'Low':
        return <Badge variant="secondary" className="bg-green-400 text-green-900 gap-1"><UserCheck className="h-3 w-3" /> Low</Badge>;
      default:
        return <Badge>{criticalness}</Badge>;
    }
};

export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
    const isUser = message.type === 'user';

    return (
        <div className={cn("flex items-start gap-3", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
            )}

            <div className={cn(
                "max-w-xl rounded-lg p-3",
                isUser ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin"/>
                        <span>Analyzing...</span>
                    </div>
                ) : typeof message.content === 'string' ? (
                    <p className="text-sm">{message.content}</p>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold">AI Analysis</h4>
                            {getCriticalnessBadge(message.content.diseaseCriticalness)}
                        </div>
                        <div className="prose prose-sm dark:prose-invert text-sm">
                            <h5 className="font-semibold text-foreground">Potential Conditions:</h5>
                            <p>{message.content.potentialConditions}</p>
                        </div>
                         <div className="prose prose-sm dark:prose-invert text-sm">
                            <h5 className="font-semibold text-foreground">Recommended Actions:</h5>
                            <p>{message.content.recommendedActions}</p>
                        </div>
                         <div className="prose prose-sm dark:prose-invert text-sm">
                            <h5 className="font-semibold text-foreground">Suggested Doctor:</h5>
                            <p>Consider seeing a <strong>{message.content.recommendedDoctorSpecialty}</strong> for a professional diagnosis.</p>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
                            Disclaimer: This is not medical advice. Consult a healthcare professional for an accurate diagnosis.
                        </p>
                    </div>
                )}
            </div>

             {isUser && (
                <Avatar className="h-8 w-8">
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
            )}
        </div>
    );
}
