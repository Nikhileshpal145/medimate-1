'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '..';
import { AppUser } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const userDocRef = doc(firestore, 'users', firebaseUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data() as Omit<AppUser, keyof User>;
            setUser({ ...firebaseUser, ...userData });
          } else {
            // This case might happen if the user exists in Auth but not in Firestore
            // For now we can just set the firebase user, but a robust app might handle this discrepancy
             setUser(firebaseUser as AppUser);
          }
          setIsLoading(false);
        }, (error) => {
          console.error("Error fetching user data from Firestore:", error);
          // Fallback to auth user if firestore fails
          setUser(firebaseUser as AppUser); 
          setIsLoading(false);
        });
        return () => unsubscribeFirestore();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth, firestore, router]);

  return { data: user, isLoading };
}
