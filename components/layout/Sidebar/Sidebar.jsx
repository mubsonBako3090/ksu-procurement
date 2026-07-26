'use client';
import Link              from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles            from './Sidebar.module.css';
import { useAuthStore }  from '@/store/authStore';
import { NAV_BY_ROLE, ROLE_LABELS, getInitials } from '@/utils/roleHelpers';

// Color per role
const ROLE_COLORS = {
  requester:   '#00C37B',
  hod:         '#F5A623',
  procurement: '#3B82F6',
  finance:     '#A855F7',
  vc:          '#E84545',
  admin:       '#6B7A99',
};

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const pathname         = usePathname();
  const router           = useRouter();
  const nav              = NAV_BY_ROLE[user?.role] || [];
  const roleColor        = ROLE_COLORS[user?.role] || 'var(--accent)';

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

      {/* Role indicator banner */}
      <div
        className={styles.roleBanner}
        style={{ background: roleColor + '15', borderColor: roleColor + '30' }}
      >
        <i
          className="bi bi-person-fill-check"
          style={{ color: roleColor, fontSize: 14 }}
        />
        <div>
          <div className={styles.roleBannerName}>{user?.name}</div>
          <div
            className={styles.roleBannerRole}
            style={{ color: roleColor }}
          >
            {ROLE_LABELS[user?.role]}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navLabel}>Navigation</div>
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
            {isActive(item.href) && (
              <div
                className={styles.activeIndicator}
                style={{ background: roleColor }}
              />
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom profile */}
      <div className={styles.profile}>
        <div
          className={styles.avatar}
          style={{ background: roleColor, color: roleColor === '#6B7A99' ? '#fff' : '#000' }}
        >
          {getInitials(user?.name)}
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.profileName}>{user?.name}</div>
          <div
            className={styles.profileRole}
            style={{ color: roleColor }}
          >
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
