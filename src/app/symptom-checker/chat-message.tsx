import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, User, Loader2, AlertTriangle, HeartPulse, UserCheck, Stethoscope } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Doctor } from "@/lib/doctors";
import { Button } from "@/components/ui/button";

type SymptomAnalysis = { 
    potentialConditions: string; 
    recommendedActions: string; 
    diseaseCriticalness: 'Low' | 'Medium' | 'High';
    recommendedDoctorSpecialty: string;
    recommendedDoctors?: Doctor[];
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

const DoctorRecCard = ({ doctor }: { doctor: Doctor }) => (
    <Card className="overflow-hidden">
        <CardContent className="p-3 flex gap-3 items-center">
            <Avatar className="h-12 w-12">
                <AvatarImage src={doctor.avatar} alt={doctor.name} />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="font-semibold">{doctor.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Stethoscope className="h-3 w-3" /> {doctor.specialty}
                </p>
                 <p className="text-xs text-muted-foreground">{doctor.location}</p>
            </div>
            <Button size="sm" variant="outline">Book</Button>
        </CardContent>
    </Card>
);


export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
    const isUser = message.type === 'user';
    const analysis = typeof message.content !== 'string' ? message.content : null;

    return (
        <div className={cn("flex items-start gap-3", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
            )}

            <div className={cn(
                "max-w-xl w-full rounded-lg p-3 space-y-4",
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
                    <>
                        <div>
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">AI Analysis</h4>
                                {getCriticalnessBadge(message.content.diseaseCriticalness)}
                            </div>
                            <div className="prose prose-sm dark:prose-invert text-sm mt-2">
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
                    </>
                )}
            </div>

             {isUser && (
                <Avatar className="h-8 w-8">
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
            )}

            {analysis && analysis.recommendedDoctors && analysis.recommendedDoctors.length > 0 && (
                 <div className="flex items-start gap-3 justify-start w-full">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-xl w-full space-y-2">
                        <p className="text-sm font-semibold">Here are some {analysis.recommendedDoctorSpecialty}s near you:</p>
                        <div className="space-y-3">
                        {analysis.recommendedDoctors.map(doctor => (
                            <DoctorRecCard key={doctor.id} doctor={doctor} />
                        ))}
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
}
