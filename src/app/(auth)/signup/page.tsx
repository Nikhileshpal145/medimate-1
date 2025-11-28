'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useFirestore } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            // Save user role in Firestore
            if (user) {
                await setDoc(doc(firestore, 'users', user.uid), {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    role: role,
                });
            }

            router.push('/');
        } catch (error) {
            console.error('Error signing in with Google', error);
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
