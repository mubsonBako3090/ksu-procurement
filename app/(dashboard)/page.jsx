'use client';
import { useAuthStore } from '@/store/authStore';
import RequesterDashboard   from './dashboards/RequesterDashboard';
import HODDashboard         from './dashboards/HODDashboard';
import ProcurementDashboard from './dashboards/ProcurementDashboard';
import FinanceDashboard     from './dashboards/FinanceDashboard';
import VCDashboard          from './dashboards/VCDashboard';
import AdminDashboard       from './dashboards/AdminDashboard';

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
                return DASHBOARDS[user?.role] || <RequesterDashboard />;
                }