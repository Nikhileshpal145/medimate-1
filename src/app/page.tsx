import { StatCard } from '@/app/components/stat-card';
import { NoShowPredictor } from '@/app/components/no-show-predictor';
import { DiseaseTrends } from '@/app/components/disease-trends';
import { RecentAppointments } from '@/app/components/recent-appointments';
import { Users, DollarSign, Calendar, Activity } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
        </div>
      </div>
    </div>
  );
}
