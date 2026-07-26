'use client';
import { useEffect }    from 'react';
import { useRouter }    from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Spinner          from '@/components/ui/Spinner/Spinner';

export default function AuthGuard({ children }) {
  const { token, user } = useAuthStore();
  const router          = useRouter();

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
    }
  }, [token, user, router]);

  if (!token || !user) {
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
