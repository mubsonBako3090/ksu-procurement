'use client';
import { useAuthStore }     from '@/store/authStore';
import RequesterDashboard   from '../dashboards/RequesterDashboard';
import HODDashboard         from '../dashboards/HODDashboard';
import ProcurementDashboard from '../dashboards/ProcurementDashboard';
import FinanceDashboard     from '../dashboards/FinanceDashboard';
import VCDashboard          from '../dashboards/VCDashboard';
import AdminDashboard       from '../dashboards/AdminDashboard';
import Spinner              from '@/components/ui/Spinner/Spinner';

const DASHBOARDS = {
  requester:   <RequesterDashboard />,
  hod:         <HODDashboard />,
  procurement: <ProcurementDashboard />,
  finance:     <FinanceDashboard />,
  vc:          <VCDashboard />,
  admin:       <AdminDashboard />,
};

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        height:         '60vh',
        flexDirection:  'column',
        gap:            16,
      }}>
        <Spinner size={40} />
        <span style={{ color: 'var(--muted)', fontSize: 14 }}>
          Loading your dashboard...
        </span>
      </div>
    );
  }

  return DASHBOARDS[user.role] || <RequesterDashboard />;
}
