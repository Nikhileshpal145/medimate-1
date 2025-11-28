'use client';

import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

// This provider is intended to be used in the root layout of your application.
// It will initialize Firebase on the client side and provide the Firebase app, auth, and firestore instances to all child components.
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { app, auth, firestore } = initializeFirebase();
  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
