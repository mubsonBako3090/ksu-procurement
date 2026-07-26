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

// Action button per role
const ROLE_ACTIONS = {
  requester: {
    label: '+ New Request',
    icon:  'bi-plus-lg',
    href:  '/requisitions/new',
    variant: 'accent',
  },
  hod: {
    label: 'Review Approvals',
    icon:  'bi-check-circle',
    href:  '/approvals',
    variant: 'gold',
  },
  procurement: {
    label: 'Approval Queue',
    icon:  'bi-list-check',
    href:  '/approvals',
    variant: 'gold',
  },
  finance: {
    label: 'Approval Queue',
    icon:  'bi-list-check',
    href:  '/approvals',
    variant: 'gold',
  },
  vc: {
    label: 'Final Approvals',
    icon:  'bi-shield-check',
    href:  '/approvals',
    variant: 'gold',
  },
  admin: {
    label: 'System Settings',
    icon:  'bi-gear',
    href:  '/settings',
    variant: 'blue',
  },
};

const VARIANT_STYLES = {
  accent: { background: 'var(--accent)', color: '#000' },
  gold:   { background: 'var(--gold)',   color: '#000' },
  blue:   { background: 'var(--blue)',   color: '#fff' },
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

  const action = user?.role ? ROLE_ACTIONS[user.role] : null;

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <div className={styles.title}>{title}</div>
        <div className={styles.sub}>
          Kaduna State University &bull; FY {new Date().getFullYear()}
        </div>
      </div>

      <div className={styles.right}>
        {/* Role badge */}
        {user && (
          <div className={styles.roleBadge}>
            <i className="bi bi-person-circle" />
            <span>{user.name?.split(' ')[0]}</span>
            <span className={styles.roleTag}>
              {user.role?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Role-specific action button */}
        {action && (
          <button
            className={styles.actionBtn}
            style={VARIANT_STYLES[action.variant]}
            onClick={() => router.push(action.href)}
          >
            <i className={`bi ${action.icon}`} />
            {action.label}
          </button>
        )}

        {/* Date */}
        <div className={styles.datePill}>
          <i className="bi bi-calendar3" />
          {new Date().toDateString()}
        </div>
      </div>
    </header>
  );
        }
