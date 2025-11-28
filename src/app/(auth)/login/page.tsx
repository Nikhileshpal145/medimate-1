'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { useEffect } from 'react';

export default function LoginPage() {
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    router.push('/');
                }
            })
            .catch((error) => {
                console.error('Error getting redirect result', error);
            });
    }, [auth, router]);

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithRedirect(auth, provider);
        } catch (error) {
            console.error('Error signing in with Google', error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Choose your favorite sign in method</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                    <FcGoogle className="mr-2 h-4 w-4" />
                    Sign in with Google
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
