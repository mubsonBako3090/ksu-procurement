'use client';
import { useEffect, useState } from 'react';
import axios                   from 'axios';
import toast                   from 'react-hot-toast';
import styles                  from './audit.module.css';
import Card                    from '@/components/ui/Card/Card';
import Spinner                 from '@/components/ui/Spinner/Spinner';
import EmptyState              from '@/components/shared/EmptyState/EmptyState';
import { useAuthStore }        from '@/store/authStore';
import { formatDateTime }      from '@/utils/formatDate';

export default function AuditTrailPage() {
  const { token }             = useAuthStore();
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    axios.get('/api/audit', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(({ data }) => setLogs(data.data || []))
      .catch(() => toast.error('Failed to load audit logs'))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = logs.filter((l) =>
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.details?.toLowerCase().includes(search.toLowerCase()) ||
    l.requisition?.reqNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const actionColor = (action) => {
    if (action?.includes('APPROVED'))  return 'var(--accent)';
    if (action?.includes('REJECTED'))  return 'var(--red)';
    if (action?.includes('SUBMITTED')) return 'var(--gold)';
    if (action?.includes('CREATED'))   return 'var(--blue)';
    if (action?.includes('LPO'))       return 'var(--purple)';
    return 'var(--muted)';
  };

  const actionIcon = (action) => {
    if (action?.includes('APPROVED'))  return 'bi-check-circle-fill';
    if (action?.includes('REJECTED'))  return 'bi-x-circle-fill';
    if (action?.includes('SUBMITTED')) return 'bi-send-fill';
    if (action?.includes('CREATED'))   return 'bi-plus-circle-fill';
    if (action?.includes('LPO'))       return 'bi-file-text-fill';
    if (action?.includes('WITHDRAWN')) return 'bi-arrow-counterclockwise';
    if (action?.includes('UPDATED'))   return 'bi-pencil-fill';
    return 'bi-dot';
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <Spinner size={40} />
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Audit Trail</h2>
          <p className={styles.sub}>{filtered.length} activity logs</p>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <i className={`bi bi-search ${styles.searchIcon}`} />
        <input
          className={styles.search}
          placeholder="Search by action, user, or requisition..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Logs */}
      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon="bi-search"
            title="No Logs Found"
            message="No audit records match your search."
          />
        ) : (
          <div className={styles.logList}>
            {filtered.map((log, i) => {
              const color = actionColor(log.action);
              const icon  = actionIcon(log.action);
              return (
                <div key={log._id || i} className={styles.logItem}>
                  <div className={styles.logTrack}>
                    <div
                      className={styles.logDot}
                      style={{ background: color + '22', border: `2px solid ${color}` }}
                    >
                      <i className={`bi ${icon}`} style={{ fontSize: 12, color }} />
                    </div>
                    {i < filtered.length - 1 && (
                      <div className={styles.logLine} />
                    )}
                  </div>

                  <div className={styles.logContent}>
                    <div className={styles.logHeader}>
                      {log.requisition?.reqNumber && (
                        <span className={styles.logReqNum}>
                          {log.requisition.reqNumber}
                        </span>
                      )}
                      <span
                        className={styles.logAction}
                        style={{ color }}
                      >
                        {log.action?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {log.details && (
                      <div className={styles.logDetails}>{log.details}</div>
                    )}
                    <div className={styles.logMeta}>
                      <span>
                        <i className="bi bi-person" /> {log.user?.name}
                      </span>
                      <span style={{ textTransform: 'capitalize', fontSize: 11 }}>
                        ({log.user?.role})
                      </span>
                      <span>
                        <i className="bi bi-clock" /> {formatDateTime(log.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
