'use client';
import { useEffect, useState } from 'react';
import axios                   from 'axios';
import toast                   from 'react-hot-toast';
import styles                  from './budget.module.css';
import Card                    from '@/components/ui/Card/Card';
import StatCard                from '@/components/ui/StatCard/StatCard';
import BudgetBar               from '@/components/shared/BudgetBar/BudgetBar';
import Spinner                 from '@/components/ui/Spinner/Spinner';
import { useAuthStore }        from '@/store/authStore';
import { formatNaira }         from '@/utils/formatCurrency';

export default function BudgetPage() {
  const { token }             = useAuthStore();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [year,    setYear]    = useState(new Date().getFullYear());

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/budget?summary=true&year=${year}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(({ data: res }) => setData(res.data))
      .catch(() => toast.error('Failed to load budget data'))
      .finally(() => setLoading(false));
  }, [year, token]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <Spinner size={40} />
    </div>
  );

  const depts = data?.departments || [];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Budget Tracker</h2>
          <p className={styles.sub}>Fiscal Year {year} — Institution-wide overview</p>
        </div>
        <select
          className={styles.yearSelect}
          value={year}
          onChange={(e) => setYear(+e.target.value)}
        >
          {[2022, 2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Summary stats */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Budget"
          value={formatNaira(data?.totalAllocated || 0)}
          icon="bi-bank"
        />
        <StatCard
          label="Total Spent"
          value={formatNaira(data?.totalSpent || 0)}
          accent="var(--red)"
          icon="bi-arrow-up-circle"
          sub={`${data?.totalAllocated
            ? Math.round((data.totalSpent / data.totalAllocated) * 100)
            : 0}% utilised`}
        />
        <StatCard
          label="Committed"
          value={formatNaira(data?.totalCommitted || 0)}
          accent="var(--gold)"
          icon="bi-hourglass-split"
          sub="Pending disbursement"
        />
        <StatCard
          label="Available"
          value={formatNaira(data?.totalAvailable || 0)}
          accent="var(--accent)"
          icon="bi-wallet2"
        />
      </div>

      {/* Department breakdown table */}
      <Card>
        <h5 className={styles.cardTitle}>Department Budget Breakdown</h5>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {['Department','Allocated','Spent','Committed','Available','Utilization'].map((h) => (
                  <th key={h} className={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {depts.map((b) => {
                const pct   = b.utilization || 0;
                const color = pct > 90 ? 'var(--red)' : pct > 70 ? 'var(--gold)' : 'var(--accent)';
                return (
                  <tr key={b.id} className={styles.tr}>
                    <td className={styles.td} style={{ fontWeight: 600 }}>
                      {b.department?.name}
                    </td>
                    <td className={styles.td} style={{ fontFamily: 'var(--font-mono)' }}>
                      {formatNaira(b.allocated)}
                    </td>
                    <td className={styles.td} style={{ fontFamily: 'var(--font-mono)', color: 'var(--red)' }}>
                      {formatNaira(b.spent)}
                    </td>
                    <td className={styles.td} style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)' }}>
                      {formatNaira(b.committed)}
                    </td>
                    <td className={styles.td} style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                      {formatNaira(b.available)}
                    </td>
                    <td className={styles.td} style={{ width: 160 }}>
                      <div className={styles.barWrap}>
                        <div className={styles.barTrack}>
                          <div
                            className={styles.barFill}
                            style={{ width: `${Math.min(pct, 100)}%`, background: color }}
                          />
                        </div>
                        <span style={{ color, fontWeight: 700, fontSize: 12, minWidth: 36 }}>
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Visual budget bars */}
      <Card style={{ marginTop: 20 }}>
        <h5 className={styles.cardTitle}>Visual Utilization</h5>
        <div className={styles.barsGrid}>
          {depts.map((b) => (
            <BudgetBar
              key={b.id}
              label={b.department?.name}
              allocated={b.allocated}
              spent={b.spent}
              committed={b.committed}
            />
          ))}
        </div>
      </Card>
    </div>
  );
                                              }
