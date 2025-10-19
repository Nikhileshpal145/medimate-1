import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { appointments } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader } from '@/components/page-header';

export default function AppointmentsPage() {
  const today = new Date();
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <PageHeader 
          title="Appointments"
          description="Manage and schedule patient appointments."
        />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 flex justify-center items-start">
            <Calendar
                mode="single"
                selected={today}
                className="p-3"
            />
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Schedule for {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</CardTitle>
            <CardDescription>You have {appointments.length} appointments today.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {appointments.map((appt) => (
                <li key={appt.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary">
                  <Avatar>
                    <AvatarImage src={appt.patientAvatar} alt={appt.patientName} />
                    <AvatarFallback>{appt.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{appt.patientName}</p>
                    <p className="text-sm text-muted-foreground">with {appt.doctor}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appt.time}</p>
                    <p className="text-sm text-muted-foreground">{appt.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
