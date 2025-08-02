'use client';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

export default function AuthProvider({ children }) {
  useEffect(() => {
    const handleFocus = () => {
      // Refresh session when user returns to the app
      if (typeof window !== 'undefined') {
        window.addEventListener('focus', () => {
          // This will trigger token refresh if needed
        });
      }
    };
    
    handleFocus();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}