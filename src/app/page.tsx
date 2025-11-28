import { StatCard } from '@/app/components/stat-card';
import { NoShowPredictor } from '@/app/components/no-show-predictor';
import { DiseaseTrends } from '@/app/components/disease-trends';
import { RecentAppointments } from '@/app/components/recent-appointments';
import { Users, DollarSign, Calendar, Activity, Wand2, FlaskConical, ScanLine, BrainCircuit, Bot } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
    {
        title: 'Smart Symptom Checker + Appointment Priority System',
        description: 'Most practical + easy to demo.',
        icon: <Bot className="h-6 w-6 text-primary" />,
    },
    {
        title: 'Prescription OCR + Interaction Checker',
        description: 'People love real-life use.',
        icon: <ScanLine className="h-6 w-6 text-primary" />,
    },
    {
        title: 'Fake Medicine Detection with AI',
        description: 'Huge demand.',
        icon: <Wand2 className="h-6 w-6 text-primary" />,
    },
    {
        title: 'Lab Report AI Summarizer',
        description: 'Strong ML + NLP demo.',
        icon: <FlaskConical className="h-6 w-6 text-primary" />,
    },
    {
        title: 'Mental Health Emotion AI',
        description: 'Very impactful.',
        icon: <BrainCircuit className="h-6 w-6 text-primary" />,
    },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value="1,254"
          change="+12% this month"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Revenue"
          value="$24,300"
          change="+8% this month"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Appointments"
          value="432"
          change="+21% this week"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Active Cases"
          value="78"
          change="-5% this week"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentAppointments />
        </div>

        <div className="flex flex-col gap-6">
          <NoShowPredictor />
          <DiseaseTrends />
           <Card>
            <CardHeader>
              <CardTitle>Upcoming Features</CardTitle>
              <CardDescription>Exciting new AI-powered capabilities in development.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0">{feature.icon}</div>
                            <div>
                                <h4 className="font-semibold">{feature.title}</h4>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
