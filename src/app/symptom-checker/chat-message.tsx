import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, User, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

type Message = {
    id: number;
    type: 'user' | 'bot';
    content: string | { potentialConditions: string; recommendedActions: string };
};

type ChatMessageProps = {
    message: Message;
    isLoading?: boolean;
}

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
                "max-w-md rounded-lg p-3",
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
                        <div className="prose prose-sm dark:prose-invert">
                            <h4 className="font-semibold">Potential Conditions:</h4>
                            <p>{message.content.potentialConditions}</p>
                        </div>
                         <div className="prose prose-sm dark:prose-invert">
                            <h4 className="font-semibold">Recommended Actions:</h4>
                            <p>{message.content.recommendedActions}</p>
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
