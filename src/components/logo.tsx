import { Stethoscope } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2" data-testid="logo">
      <Stethoscope className="h-6 w-6 text-primary" />
      <h1 className="text-lg font-bold text-primary">MediMate Rx</h1>
    </div>
  );
}
