'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
    const router = useRouter();
    const [role, setRole] = useState<'doctor' | 'patient'>('patient');
    const { toast } = useToast();

    const handleSignUp = () => {
        if (!role) {
            toast({
                title: 'Role not selected',
                description: 'Please select a role to sign up.',
                variant: 'destructive',
            });
            return;
        }
        // In a real app, you'd create a user here.
        // For this mock version, we'll just store the role and redirect.
        localStorage.setItem('userRole', role);
        router.push('/');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Choose your role to create an account</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <RadioGroup defaultValue="patient" value={role} onValueChange={(value: 'doctor' | 'patient') => setRole(value)}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="patient" id="patient" />
                        <Label htmlFor="patient">I am a Patient</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="doctor" id="doctor" />
                        <Label htmlFor="doctor">I am a Doctor</Label>
                    </div>
                </RadioGroup>

                <Button className="w-full" onClick={handleSignUp}>
                    Create Account
                </Button>
            </CardContent>
             <CardFooter className='justify-center'>
                <p className='text-sm text-muted-foreground'>
                    Already have an account?{' '}
                    <Link href="/login" className='text-primary hover:underline'>Login</Link>
                </p>
            </CardFooter>
        </Card>
    );
}
