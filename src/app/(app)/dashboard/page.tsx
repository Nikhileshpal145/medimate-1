import {
  Activity,
  Droplets,
  HeartPulse,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/app/components/stat-card';
import { RecentAppointments } from '@/app/components/recent-appointments';
import { NoShowPredictor } from '@/app/components/no-show-predictor';
import { DiseaseTrends } from '@/app/components/disease-trends';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Welcome Back, Doctor!"
        description="Here's a quick overview of your clinic's status today."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value="1,200"
          change="+12% from last month"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Appointments Today"
          value="34"
          change="+5 since yesterday"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Blood Units Available"
          value="83"
          change="-10 units from last week"
          icon={<Droplets className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Avg. Heart Rate"
          value="78 BPM"
          change="Within normal range"
          icon={<HeartPulse className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentAppointments />
        </div>
        <div className="space-y-6">
          <NoShowPredictor />
          <DiseaseTrends />
        </div>
      </div>
    </div>
  );
}
