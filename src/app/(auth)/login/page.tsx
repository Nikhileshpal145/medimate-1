'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Stethoscope, User } from 'lucide-react';

export default function LoginPage() {

    const handleLogin = (role: 'doctor' | 'patient') => {
        // In a real app, you'd perform authentication here.
        // For this mock version, we'll just store the role and redirect.
        localStorage.setItem('userRole', role);
        window.location.href = '/';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Select a role to log in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button variant="outline" className="w-full" onClick={() => handleLogin('doctor')}>
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Login as Doctor
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleLogin('patient')}>
                    <User className="mr-2 h-4 w-4" />
                    Login as Patient
                </Button>
            </CardContent>
            <CardFooter className='justify-center'>
                <p className='text-sm text-muted-foreground'>
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className='text-primary hover:underline'>Sign up</Link>
                </p>
            </CardFooter>
        </Card>
    );
}
