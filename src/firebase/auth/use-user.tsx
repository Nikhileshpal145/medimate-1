'use client';
import { useEffect, useState } from 'react';
import { AppUser } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Mock user data for different roles
const mockUsers = {
  doctor: {
    uid: 'mock-doctor-uid',
    email: 'doctor@medimate.com',
    displayName: 'Dr. Patel',
    photoURL: PlaceHolderImages.find(img => img.id === 'avatar-1')?.imageUrl || '',
    role: 'doctor',
  },
  patient: {
    uid: 'mock-patient-uid',
    email: 'patient@medimate.com',
    displayName: 'Ananya Reddy',
    photoURL: PlaceHolderImages.find(img => img.id === 'avatar-6')?.imageUrl || '',
    role: 'patient',
  },
};


export function useUser() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // On component mount, check localStorage for the user role
    const storedRole = localStorage.getItem('userRole') as 'doctor' | 'patient' | null;

    if (storedRole && mockUsers[storedRole]) {
      // If a role is found, set the corresponding mock user
      setUser(mockUsers[storedRole] as AppUser);
    } else {
      // If no role is found, the user is not logged in
      setUser(null);
    }

    const handleStorageChange = () => {
        const updatedRole = localStorage.getItem('userRole') as 'doctor' | 'patient' | null;
        if (updatedRole && mockUsers[updatedRole]) {
            setUser(mockUsers[updatedRole] as AppUser);
        } else {
            setUser(null);
        }
    }

    window.addEventListener('storage', handleStorageChange);
    
    setIsLoading(false);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  return { data: user, isLoading };
}
