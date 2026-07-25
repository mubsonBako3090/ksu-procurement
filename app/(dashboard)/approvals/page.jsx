'use client';
import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import axios                   from 'axios';
import toast                   from 'react-hot-toast';
import styles                  from './approvals.module.css';
import Card                    from '@/components/ui/Card/Card';
import Badge                   from '@/components/ui/Badge/Badge';
import Button                  from '@/components/ui/Button/Button';
import Spinner                 from '@/components/ui/Spinner/Spinner';
import EmptyState              from '@/components/shared/EmptyState/EmptyState';
import PriorityTag             from '@/components/shared/PriorityTag/PriorityTag';
import { useAuthStore }        from '@/store/authStore';
import { formatNaira }         from '@/utils/formatCurrency';
import { formatDate }          from '@/utils/formatDate';
import { ROLE_LABELS }         from '@/utils/roleHelpers';

export default function ApprovalsPage() {
  const { token, user }       = useAuthStore();
  const router                = useRouter();
  const [queue,   setQueue]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/approvals', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(({ data }) => setQueue(data.data || []))
      .catch(() => toast.error('Failed to load approvals'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <Spinner size={40} />
    </div>
  );

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Approvals Queue</h2>
          <p className={styles.sub}>
            Logged in as: <span style={{ color: 'var(--accent)' }}>{user?.name}</span>
            {' '}({ROLE_LABELS[user?.role]})
          </p>
        </div>
        {queue.length > 0 && (
          <span className={styles.countBadge}>
            {queue.length} pending
          </span>
        )}
      </div>

      {queue.length === 0 ? (
        <Card>
          <EmptyState
            icon="bi-check2-all"
            title="All Clear!"
            message="No requisitions are pending your approval at this time."
          />
        </Card>
      ) : (
        <div className={styles.queueList}>
          {queue.map((req) => (
            <div key={req._id} className={styles.queueCard}>
              <div className={styles.queueTop}>
                <div className={styles.queueLeft}>
                  <span className={styles.reqNum}>{req.reqNumber}</span>
                  <h4 className={styles.reqTitle}>{req.title}</h4>
                  <div className={styles.reqMeta}>
                    <span>
                      <i className="bi bi-person" /> {req.requester?.name}
                    </span>
                    <span>
                      <i className="bi bi-building" /> {req.department?.name}
                    </span>
                    <span>
                      <i className="bi bi-calendar3" /> {formatDate(req.createdAt)}
                    </span>
                  </div>
                </div>
                <div className={styles.queueRight}>
                  <div className={styles.amount}>{formatNaira(req.totalAmount)}</div>
                  <PriorityTag priority={req.priority} />
                  <div style={{ marginTop: 6 }}>
                    <Badge status={req.status} />
                  </div>
                </div>
              </div>

              <div className={styles.queueBottom}>
                <span className={styles.itemCount}>
                  <i className="bi bi-list-ul" /> {req.items?.length || 0} item(s)
                </span>
                <Button
                  onClick={() => router.push(`/requisitions/${req._id}`)}
                  icon="bi-eye"
                  size="sm"
                >
                  Review & Act
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
