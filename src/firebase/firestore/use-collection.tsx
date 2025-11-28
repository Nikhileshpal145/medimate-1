'use client';
import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  Query,
  DocumentData,
  query,
  where,
  collectionGroup,
} from 'firebase/firestore';
import { useFirestore } from '..';

export function useCollection<T>(path: string, options?: {
  where?: [string, '==', any];
  group?: boolean;
}) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let q: Query<DocumentData>;
    if (options?.group) {
        q = collectionGroup(firestore, path);
    } else {
        q = collection(firestore, path) as Query<DocumentData>;
    }
    
    if (options?.where) {
      q = query(q, where(options.where[0], options.where[1], options.where[2]));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() } as T;
        });
        setData(documents);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching collection:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path, options?.where, options?.group]);

  return { data, isLoading };
}
