
'use client';

import { Bot, User, AlertTriangle, Lightbulb, MapPin, Stethoscope, Loader2, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SymptomCheckerOutput } from '@/ai/flows/ai-symptom-checker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


type Message = {
    id: number;
    type: 'user' | 'bot';
    content: string | SymptomCheckerOutput;
};

interface ChatMessageProps {
    message: Message;
    isLoading?: boolean;
    speak: (text: string) => void;
}


const CriticalityBadge = ({ criticality }: { criticality: string }) => {
  switch (criticality.toLowerCase()) {
    case 'high':
      return <Badge variant="destructive" className="gap-1.5"><AlertTriangle className="h-3 w-3"/> High</Badge>;
    case 'medium':
      return <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 gap-1.5"><AlertTriangle className="h-3 w-3"/> Medium</Badge>;
    case 'low':
       return <Badge variant="secondary" className="bg-green-400 text-green-900 gap-1.5"><AlertTriangle className="h-3 w-3"/> Low</Badge>;
    default:
      return <Badge>{criticality}</Badge>;
  }
};

const getAnalysisAsText = (analysis: SymptomCheckerOutput) => {
    let text = `Based on your symptoms, here is my analysis. `;
    text += `The criticality is ${analysis.diseaseCriticalness}. `;
    text += `Potential conditions include: ${analysis.potentialConditions}. `;
    text += `I recommend the following actions: ${analysis.recommendedActions}. `;
    text += `You should consider seeing a ${analysis.recommendedDoctorSpecialty}.`;
    return text;
}


export function ChatMessage({ message, isLoading, speak }: ChatMessageProps) {
  const isBot = message.type === 'bot';

  if (isLoading) {
    return (
        <div className="flex items-start gap-3">
            <Avatar className="h-9 w-9">
                <AvatarFallback><Bot /></AvatarFallback>
            </Avatar>
            <div className="rounded-lg bg-secondary p-3 text-sm flex items-center">
               <Loader2 className="h-5 w-5 animate-spin"/>
            </div>
        </div>
    )
  }

  return (
    <div className={`flex items-start gap-3 ${isBot ? '' : 'justify-end'}`}>
      {isBot && (
        <Avatar className="h-9 w-9">
          <AvatarFallback><Bot /></AvatarFallback>
        </Avatar>
      )}
      
        <div className={`max-w-md rounded-lg p-3 text-sm ${isBot ? 'bg-secondary' : 'bg-primary text-primary-foreground'}`}>
           {typeof message.content === 'string' ? (
                <p>{message.content}</p>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <h3 className="font-semibold text-base">AI Health Assistant Analysis</h3>
                        <CriticalityBadge criticality={message.content.diseaseCriticalness} />
                    </div>

                    <Button variant="outline" size="sm" onClick={() => speak(getAnalysisAsText(message.content))} className="gap-2">
                        <Volume2 className="h-4 w-4"/>
                        Read Aloud
                    </Button>
                    
                    <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2"><Stethoscope className="h-4 w-4"/> Potential Conditions</h4>
                        <p className="text-muted-foreground">{message.content.potentialConditions}</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4"/> Recommended Actions</h4>
                        <p className="text-muted-foreground">{message.content.recommendedActions}</p>
                    </div>

                     {message.content.recommendedDoctors && message.content.recommendedDoctors.length > 0 && (
                        <Card>
                            <CardHeader className="p-4">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MapPin className="h-4 w-4"/>
                                    Recommended Doctors Nearby
                                </CardTitle>
                                <CardDescription>Specialty: {message.content.recommendedDoctorSpecialty}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <ul className="space-y-3">
                                    {message.content.recommendedDoctors.map(doctor => (
                                        <li key={doctor.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={doctor.avatar} alt={doctor.name} />
                                                    <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{doctor.name}</p>
                                                    <p className="text-xs text-muted-foreground">{doctor.location}</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline">Book</Button>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>

      {!isBot && (
        <Avatar className="h-9 w-9">
            <AvatarFallback><User/></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
