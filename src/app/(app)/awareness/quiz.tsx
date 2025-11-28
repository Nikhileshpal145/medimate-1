
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

const quizQuestions = [
  {
    question: "What is the main purpose of antibiotics?",
    options: ["To treat viral infections", "To treat bacterial infections", "To relieve pain", "To reduce fever"],
    correctAnswer: "To treat bacterial infections",
    explanation: "Antibiotics are powerful medicines that fight bacterial infections. They don't work on viruses, such as those that cause colds or flu."
  },
  {
    question: "Which of these is a good source of Vitamin C?",
    options: ["Oranges", "Milk", "Bread", "Chicken"],
    correctAnswer: "Oranges",
    explanation: "Citrus fruits like oranges are excellent sources of Vitamin C, which is important for the immune system."
  }
];

export function HealthQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleAnswer = (option: string) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex((prev) => (prev + 1) % quizQuestions.length);
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Weekly Health Quiz</CardTitle>
        <CardDescription>Test your knowledge on common health topics.</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, index) => (
                <Button 
                    key={index}
                    variant="outline"
                    className={cn("h-auto py-3 justify-start text-left whitespace-normal", {
                        "bg-green-100 border-green-400 text-green-900 hover:bg-green-200": showFeedback && option === currentQuestion.correctAnswer,
                        "bg-red-100 border-red-400 text-red-900 hover:bg-red-200": showFeedback && selectedAnswer === option && !isCorrect,
                    })}
                    onClick={() => handleAnswer(option)}
                    disabled={showFeedback}
                >
                    {option}
                </Button>
            ))}
        </div>
        {showFeedback && (
            <div className={cn(
                "mt-4 p-4 rounded-lg flex items-start gap-3",
                isCorrect ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"
            )}>
                {isCorrect ? <CheckCircle className="h-5 w-5 mt-0.5"/> : <XCircle className="h-5 w-5 mt-0.5"/>}
                <div>
                    <h4 className="font-semibold">{isCorrect ? "Correct!" : "Not quite."}</h4>
                    <p className="text-sm">{currentQuestion.explanation}</p>
                    <Button onClick={handleNext} size="sm" className="mt-3">Next Question</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
