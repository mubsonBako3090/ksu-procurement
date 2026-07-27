'use client';
import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import { useAuthStore }        from '@/store/authStore';
import Spinner                 from '@/components/ui/Spinner/Spinner';

export default function AuthGuard({ children }) {
  const { token, user, hydrated } = useAuthStore();
  const router                    = useRouter();
  const [ready, setReady]         = useState(false);

  useEffect(() => {
    // Wait until Zustand has rehydrated from localStorage
    if (!hydrated) return;

    if (!token || !user) {
      router.push('/login');
    } else {
      setReady(true);
    }
  }, [hydrated, token, user, router]);

  // Show spinner while waiting for hydration
  if (!hydrated || !ready) {
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
        <Spinner size={40} />
        <span style={{ color: 'var(--muted)', fontSize: 14 }}>
          Loading...
        </span>
      </div>
    );
  }

  return children;
}
