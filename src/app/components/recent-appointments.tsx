import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
  import { Badge } from '@/components/ui/badge';
  import { appointments } from '@/lib/data';
  import { cn } from '@/lib/utils';
  
  export function RecentAppointments() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
          <CardDescription>
            A summary of today's scheduled patient visits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                        <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{appointment.patientName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn({
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': appointment.status === 'Scheduled',
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': appointment.status === 'Completed',
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': appointment.status === 'Cancelled',
                      })}
                      variant="secondary"
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
  