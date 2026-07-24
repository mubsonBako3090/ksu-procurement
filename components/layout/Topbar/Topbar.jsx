'use client';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Topbar.module.css';
import { useAuthStore } from '@/store/authStore';

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
    '/requisitions': 'Requisitions',
      '/approvals':    'Approvals Queue',
        '/vendors':      'Vendor Directory',
          '/lpo':          'LPO & Orders',
            '/budget':       'Budget Tracker',
              '/reports':      'Reports & Analytics',
                '/audit':        'Audit Trail',
                  '/settings':     'System Settings',
                  };

                  export default function Topbar() {
                    const pathname = usePathname();
                      const router   = useRouter();
                        const { user } = useAuthStore();

                          const title =
                              PAGE_TITLES[pathname] ||
                                  (pathname.includes('/requisitions/') ? 'Requisition Detail' :
                                       pathname.includes('/lpo/')          ? 'LPO Document'       :
                                            pathname.includes('/vendors/')      ? 'Vendor Detail'      :
                                                 'KSU Procurement');

                                                   return (
                                                       <header className={styles.topbar}>
                                                             <div>
                                                                     <div className={styles.title}>{title}</div>
                                                                             <div className={styles.sub}>
                                                                                       Kaduna State University &bull; FY {new Date().getFullYear()}
                                                                                               </div>
                                                                                                     </div>

                                                                                                           <div className={styles.actions}>
                                                                                                                   {user?.role === 'requester' && (
                                                                                                                             <button
                                                                                                                                         className={styles.newBtn}
                                                                                                                                                     onClick={() => router.push('/requisitions/new')}
                                                                                                                                                               >
                                                                                                                                                                           <i className="bi bi-plus-lg" />
                                                                                                                                                                                       New Request
                                                                                                                                                                                                 </button>
                                                                                                                                                                                                         )}
                                                                                                                                                                                                                 <div className={styles.datePill}>
                                                                                                                                                                                                                           <i className="bi bi-calendar3" />
                                                                                                                                                                                                                                     {new Date().toDateString()}
                                                                                                                                                                                                                                             </div>
                                                                                                                                                                                                                                                   </div>
                                                                                                                                                                                                                                                       </header>
                                                                                                                                                                                                                                                         );
                                                                                                                                                                                                                                                         }