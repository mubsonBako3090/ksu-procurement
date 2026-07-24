'use client';
import Link        from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles      from './Sidebar.module.css';
import { useAuthStore }  from '@/store/authStore';
import { NAV_BY_ROLE, ROLE_LABELS, getInitials } from '@/utils/roleHelpers';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
    const pathname         = usePathname();
      const router           = useRouter();
        const nav              = NAV_BY_ROLE[user?.role] || [];

          const handleLogout = () => {
              logout();
                  router.push('/login');
                    };

                      const isActive = (href) =>
                          href === '/dashboard'
                                ? pathname === '/dashboard'
                                      : pathname.startsWith(href);

                                        return (
                                            <aside className={styles.sidebar}>
                                                  {/* Logo */}
                                                        <div className={styles.logo}>
                                                                <div className={styles.logoIcon}>K</div>
                                                                        <div>
                                                                                  <div className={styles.logoTitle}>KSU Procurement</div>
                                                                                            <div className={styles.logoSub}>Kaduna State University</div>
                                                                                                    </div>
                                                                                                          </div>

                                                                                                                {/* Navigation */}
                                                                                                                      <nav className={styles.nav}>
                                                                                                                              {nav.map((item) => (
                                                                                                                                        <Link
                                                                                                                                                    key={item.href}
                                                                                                                                                                href={item.href}
                                                                                                                                                                            className={[
                                                                                                                                                                                          styles.navItem,
                                                                                                                                                                                                        isActive(item.href) ? styles.active : '',
                                                                                                                                                                                                                    ].join(' ')}
                                                                                                                                                                                                                              >
                                                                                                                                                                                                                                          <i className={`bi ${item.icon} ${styles.navIcon}`} />
                                                                                                                                                                                                                                                      <span>{item.label}</span>
                                                                                                                                                                                                                                                                </Link>
                                                                                                                                                                                                                                                                        ))}
                                                                                                                                                                                                                                                                              </nav>

                                                                                                                                                                                                                                                                                    {/* User profile */}
                                                                                                                                                                                                                                                                                          <div className={styles.profile}>
                                                                                                                                                                                                                                                                                                  <div className={styles.avatar}>
                                                                                                                                                                                                                                                                                                            {getInitials(user?.name)}
                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                            <div className={styles.profileInfo}>
                                                                                                                                                                                                                                                                                                                                      <div className={styles.profileName}>{user?.name}</div>
                                                                                                                                                                                                                                                                                                                                                <div className={styles.profileRole}>
                                                                                                                                                                                                                                                                                                                                                            {ROLE_LABELS[user?.role]}
                                                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                                                                      <button
                                                                                                                                                                                                                                                                                                                                                                                                className={styles.logoutBtn}
                                                                                                                                                                                                                                                                                                                                                                                                          onClick={handleLogout}
                                                                                                                                                                                                                                                                                                                                                                                                                    title="Sign Out"
                                                                                                                                                                                                                                                                                                                                                                                                                            >
                                                                                                                                                                                                                                                                                                                                                                                                                                      <i className="bi bi-box-arrow-right" />
                                                                                                                                                                                                                                                                                                                                                                                                                                              </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                        </aside>
                                                                                                                                                                                                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                                                                                                                                                                                                          }