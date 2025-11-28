'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useFirestore } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { doc, setDoc } from 'firebase/firestore';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
    const auth = useAuth();
    const firestore = useFirestore();
    const router = useRouter();
    const [role, setRole] = useState<'doctor' | 'patient'>('patient');
    const { toast } = useToast();

    useEffect(() => {
        getRedirectResult(auth)
            .then(async (result) => {
                if (result) {
                    const user = result.user;
                    // Persist the selected role from sessionStorage
                    const savedRole = sessionStorage.getItem('signupRole') || 'patient';
                    if (user) {
                        await setDoc(doc(firestore, 'users', user.uid), {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL,
                            role: savedRole,
                        }, { merge: true });
                        sessionStorage.removeItem('signupRole');
                    }
                    router.push('/');
                }
            })
            .catch((error) => {
                console.error('Error getting redirect result', error);
                sessionStorage.removeItem('signupRole');
            });
    }, [auth, firestore, router]);

    const handleGoogleSignIn = async () => {
        if (!role) {
            toast({
                title: 'Role not selected',
                description: 'Please select a role to sign up.',
                variant: 'destructive',
            });
            return;
        }

        const provider = new GoogleAuthProvider();
        try {
            // Save role to sessionStorage before redirect
            sessionStorage.setItem('signupRole', role);
            await signInWithRedirect(auth, provider);
        } catch (error) {
            console.error('Error signing in with Google', error);
            sessionStorage.removeItem('signupRole');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Choose your role and sign up</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <RadioGroup defaultValue="patient" onValueChange={(value: 'doctor' | 'patient') => setRole(value)}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="patient" id="patient" />
                        <Label htmlFor="patient">I am a Patient</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="doctor" id="doctor" />
                        <Label htmlFor="doctor">I am a Doctor</Label>
                    </div>
                </RadioGroup>

                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                    <FcGoogle className="mr-2 h-4 w-4" />
                    Sign up with Google
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
