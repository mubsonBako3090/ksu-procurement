import AuthGuard from '@/components/layout/AuthGuard/AuthGuard';
import PageWrapper from '@/components/layout/PageWrapper/PageWrapper';

export default function DashboardLayout({ children }) {
  return (
      <AuthGuard>
            <PageWrapper>{children}</PageWrapper>
                </AuthGuard>
                  );
                  }