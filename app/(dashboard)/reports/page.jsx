'use client';
import { useEffect, useState } from 'react';
import axios                   from 'axios';
import toast                   from 'react-hot-toast';
import styles                  from './reports.module.css';
import Card                    from '@/components/ui/Card/Card';
import StatCard                from '@/components/ui/StatCard/StatCard';
import Button                  from '@/components/ui/Button/Button';
import Spinner                 from '@/components/ui/Spinner/Spinner';
import { useAuthStore }        from '@/store/authStore';
import { formatNaira }         from '@/utils/formatCurrency';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function ReportsPage() {
  const { token }               = useAuthStore();
  const [summary,  setSummary]  = useState(null);
  const [byDept,   setByDept]   = useState([]);
  const [byStatus, setByStatus] = useState([]);
  const [monthly,  setMonthly]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [year,     setYear]     = useState(new Date().getFullYear());
  const [exporting,setExporting]= useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const h = { Authorization: `Bearer ${token}` };
      const [s, d, st, m] = await Promise.all([
        axios.get(`/api/reports/summary?year=${year}`,        { headers: h }),
        axios.get(`/api/reports/by-department?year=${year}`,  { headers: h }),
        axios.get('/api/reports/by-status',                   { headers: h }),
        axios.get(`/api/reports/monthly?year=${year}`,        { headers: h }),
      ]);
      setSummary(s.data.data);
      setByDept(d.data.data   || []);
      setByStatus(st.data.data || []);
      setMonthly(m.data.data  || []);
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [year]);

  const handleExport = async (type) => {
    setExporting(type);
    try {
      const res = await axios.get(
        `/api/reports/export/${type}?year=${year}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' }
      );
      const mime = type === 'csv' ? 'text/csv' : 'application/pdf';
      const ext  = type === 'csv' ? 'csv' : 'pdf';
      const url  = URL.createObjectURL(new Blob([res.data], { type: mime }));
      const link = document.createElement('a');
      link.href  = url;
      link.download = `KSU-Procurement-Report-${year}.${ext}`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`${type.toUpperCase()} exported!`);
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting('');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <Spinner size={40} />
    </div>
  );

  const maxMonthly = Math.max(...monthly.map((m) => m.count || 0), 1);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Reports & Analytics</h2>
          <p className={styles.sub}>Fiscal Year {year}</p>
        </div>
        <div className={styles.headerActions}>
          <select
            className={styles.yearSelect}
            value={year}
            onChange={(e) => setYear(+e.target.value)}
          >
            {[2022, 2023, 2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <Button
            variant="ghost"
            onClick={() => handleExport('csv')}
            loading={exporting === 'csv'}
            icon="bi-filetype-csv"
          >
            Export CSV
          </Button>
          <Button
            variant="gold"
            onClick={() => handleExport('pdf')}
            loading={exporting === 'pdf'}
            icon="bi-file-earmark-pdf"
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Requisitions" value={summary?.total    || 0}  icon="bi-clipboard-text" />
        <StatCard label="Approved"           value={summary?.approved || 0}  icon="bi-check-circle"   accent="var(--accent)" />
        <StatCard label="Pending"            value={summary?.pending  || 0}  icon="bi-hourglass"      accent="var(--gold)"   />
        <StatCard label="Rejected"           value={summary?.rejected || 0}  icon="bi-x-circle"       accent="var(--red)"    />
        <StatCard
          label="Total Approved Value"
          value={formatNaira(summary?.totalValue || 0)}
          icon="bi-cash-stack"
          accent="var(--blue)"
          style={{ gridColumn: 'span 4' }}
        />
      </div>

      <div className={styles.grid2}>
        {/* By Department */}
        <Card>
          <h5 className={styles.cardTitle}>Spend by Department</h5>
          {byDept.length === 0 ? (
            <div className={styles.empty}>No data available</div>
          ) : (
            byDept.map((d) => {
              const maxVal = Math.max(...byDept.map((x) => x.total || 0), 1);
              const pct    = Math.round((d.total / maxVal) * 100);
              return (
                <div key={d._id} className={styles.deptRow}>
                  <div className={styles.deptInfo}>
                    <span className={styles.deptName}>
                      {d.department?.name || 'Unknown'}
                    </span>
                    <span className={styles.deptCount}>{d.count} req(s)</span>
                  </div>
                  <div className={styles.deptBar}>
                    <div
                      className={styles.deptBarFill}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={styles.deptVal}>{formatNaira(d.total)}</span>
                </div>
              );
            })
          )}
        </Card>

        {/* By Status */}
        <Card>
          <h5 className={styles.cardTitle}>Requisition Status Breakdown</h5>
          {byStatus.map((s) => {
            const total = byStatus.reduce((acc, x) => acc + (x.count || 0), 0);
            const pct   = total ? Math.round(((s.count || 0) / total) * 100) : 0;
            const colors = {
              approved:    'var(--accent)',
              rejected:    'var(--red)',
              draft:       'var(--muted)',
            };
            const color = colors[s._id] || 'var(--gold)';
            return (
              <div key={s._id} className={styles.statusRow}>
                <span className={styles.statusLabel}>
                  {s._id?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
                <div className={styles.statusBar}>
                  <div
                    className={styles.statusBarFill}
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <span className={styles.statusCount} style={{ color }}>
                  {s.count}
                </span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Monthly trend */}
      <Card>
        <h5 className={styles.cardTitle}>Monthly Requisition Trend — {year}</h5>
        <div className={styles.monthlyChart}>
          {MONTHS.map((m, i) => {
            const data = monthly.find((x) => x._id === i + 1);
            const count = data?.count || 0;
            const h     = maxMonthly ? Math.round((count / maxMonthly) * 100) : 0;
            return (
              <div key={m} className={styles.monthCol}>
                <div className={styles.monthBarWrap}>
                  <div
                    className={styles.monthBar}
                    style={{ height: `${h}%` }}
                    title={`${count} requisitions`}
                  />
                </div>
                <span className={styles.monthLabel}>{m}</span>
                <span className={styles.monthCount}>{count}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
              }
