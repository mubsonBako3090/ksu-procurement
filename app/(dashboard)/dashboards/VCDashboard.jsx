'use client';
import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import axios                   from 'axios';
import styles                  from '@/app/(dashboard)/dashboard.module.css';
import Card                    from '@/components/ui/Card/Card';
import StatCard                from '@/components/ui/StatCard/StatCard';
import BudgetBar               from '@/components/shared/BudgetBar/BudgetBar';
import Badge                   from '@/components/ui/Badge/Badge';
import Button                  from '@/components/ui/Button/Button';
import Spinner                 from '@/components/ui/Spinner/Spinner';
import { useAuthStore }        from '@/store/authStore';
import { formatNaira }         from '@/utils/formatCurrency';
import { formatDate }          from '@/utils/formatDate';

export default function VCDashboard() {
      const { token }             = useAuthStore();
        const router                = useRouter();
          const [summary, setSummary] = useState(null);
            const [queue,   setQueue]   = useState([]);
              const [budget,  setBudget]  = useState(null);
                const [loading, setLoading] = useState(true);

                  useEffect(() => {
                        const h = { Authorization: `Bearer ${token}` };
                            Promise.all([
                                      axios.get('/api/reports/summary',   { headers: h }),
                                            axios.get('/api/approvals',         { headers: h }),
                                                  axios.get('/api/budget?summary=true', { headers: h }),
                            ]).then(([r1, r2, r3]) => {
                                      setSummary(r1.data.data || null);
                                            setQueue(r2.data.data   || []);
                                                  setBudget(r3.data.data  || null);
                            }).finally(() => setLoading(false));
                  }, [token]);

                    if (loading) return (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                                  <Spinner />
                                      </div>
                    );

                      return (
                            <div className={styles.page}>
                                  <div className={styles.welcome}>
                                          <div className={styles.welcomeText}>
                                                    <h2>Vice Chancellor's Overview 🎓</h2>
                                                              <p>Institution-wide procurement summary for FY {summary?.fiscalYear}.</p>
                                                                      </div>
                                                                              {queue.length > 0 && (
                                                                                          <Button onClick={() => router.push('/approvals')} variant="gold" icon="bi-bell">
                                                                                                      {queue.length} Final Approval Pending
                                                                                                                </Button>
                                                                              )}
                                                                                    </div>

                                                                                          <div className={styles.statsGrid}>
                                                                                                  <StatCard label="Total Requisitions" value={summary?.total || 0}                   icon="bi-clipboard-text"  />
                                                                                                          <StatCard label="Approved"           value={summary?.approved || 0}                icon="bi-check-circle"    accent="var(--accent)" />
                                                                                                                  <StatCard label="Pending Final Approval" value={queue.length}                      icon="bi-hourglass"       accent="var(--gold)"   />
                                                                                                                          <StatCard label="Approved Value"     value={formatNaira(summary?.totalValue || 0)} icon="bi-cash-stack"      accent="var(--blue)"   />
                                                                                                                                </div>

                                                                                                                                      <div className={styles.grid2}>
                                                                                                                                              {/* Final approval queue */}
                                                                                                                                                      <Card>
                                                                                                                                                                <div className={styles.sectionHeader}>
                                                                                                                                                                            <div className={styles.sectionTitle}>Awaiting Final Approval</div>
                                                                                                                                                                                        <button className={styles.viewAll} onClick={() => router.push('/approvals')}>
                                                                                                                                                                                                      View all →
                                                                                                                                                                                                                  </button>
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                      {queue.length === 0 ? (
                                                                                                                                                                                                                                                    <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)' }}>
                                                                                                                                                                                                                                                                  <i className="bi bi-check-all" style={{ fontSize: 36, color: 'var(--accent)' }} />
                                                                                                                                                                                                                                                                                <div style={{ marginTop: 8 }}>No pending final approvals</div>
                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                      ) : (
                                                                                                                                                                                                                                                    queue.slice(0, 5).map((r) => (
                                                                                                                                                                                                                                                                      <div
                                                                                                                                                                                                                                                                                      key={r._id}
                                                                                                                                                                                                                                                                                                      className={styles.approvalCard}
                                                                                                                                                                                                                                                                                                                      onClick={() => router.push(`/requisitions/${r._id}`)}
                                                                                                                                                                                                                                                                                                                                    >
                                                                                                                                                                                                                                                                                                                                                    <div className={styles.approvalId}>{r.reqNumber}</div>
                                                                                                                                                                                                                                                                                                                                                                    <div className={styles.approvalTitle}>{r.title}</div>
                                                                                                                                                                                                                                                                                                                                                                                    <div className={styles.approvalMeta}>
                                                                                                                                                                                                                                                                                                                                                                                                      {r.department?.name} •
                                                                                                                                                                                                                                                                                                                                                                                                                        <strong style={{ color: 'var(--accent)', marginLeft: 4 }}>
                                                                                                                                                                                                                                                                                                                                                                                                                                            {formatNaira(r.totalAmount)}
                                                                                                                                                                                                                                                                                                                                                                                                                                                              </strong>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <span style={{ marginLeft: 6, textTransform: 'uppercase', fontWeight: 700, color: 'var(--red)', fontSize: 11 }}>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    {r.priority}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      </span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                    ))
                                                                                                                                                                                                                                      )}
                                                                                                                                                                                                                                              </Card>

                                                                                                                                                                                                                                                      {/* Institution budget */}
                                                                                                                                                                                                                                                              <Card>
                                                                                                                                                                                                                                                                        <div className={styles.sectionHeader}>
                                                                                                                                                                                                                                                                                    <div className={styles.sectionTitle}>Institution Budget Status</div>
                                                                                                                                                                                                                                                                                                <button className={styles.viewAll} onClick={() => router.push('/budget')}>
                                                                                                                                                                                                                                                                                                              Full view →
                                                                                                                                                                                                                                                                                                                          </button>
                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                              {(budget?.departments || []).slice(0, 5).map((b) => (
                                                                                                                                                                                                                                                                                                                                                            <BudgetBar
                                                                                                                                                                                                                                                                                                                                                                          key={b.id}
                                                                                                                                                                                                                                                                                                                                                                                        label={b.department?.name || '—'}
                                                                                                                                                                                                                                                                                                                                                                                                      allocated={b.allocated}
                                                                                                                                                                                                                                                                                                                                                                                                                    spent={b.spent}
                                                                                                                                                                                                                                                                                                                                                                                                                                  committed={b.committed}
                                                                                                                                                                                                                                                                                                                                                                                                                                              />
                                                                                                                                                                                                                                                                                                                                              ))}
                                                                                                                                                                                                                                                                                                                                                      </Card>
                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                </div>
                      );
}
