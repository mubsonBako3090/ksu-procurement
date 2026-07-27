'use client';
import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import { useAuthStore }        from '@/store/authStore';
import Spinner                 from '@/components/ui/Spinner/Spinner';

export default function AuthGuard({ children }) {
  const router               = useRouter();
  const { token, hydrated }  = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Do nothing until Zustand has loaded from localStorage
    if (!hydrated) return;

    if (!token) {
      // No token — send to login
      router.replace('/login');
    } else {
      // Token exists — allow access
      setChecked(true);
    }
  }, [hydrated, token, router]);

  // Show spinner while:
  // 1. Zustand is still loading from localStorage
  // 2. We have a token but haven't confirmed yet
  if (!hydrated || !checked) {
    return (
      <div style={{
        minHeight:      '100vh',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'var(--bg)',
        flexDirection:  'column',
        gap:            16,
      }}>
        <Spinner size={36} />
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>
          Please wait...
        </span>
      </div>
    );
  }

  // Token confirmed — show the page
  return <>{children}</>;
}
