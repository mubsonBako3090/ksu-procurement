'use client';
import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import axios                   from 'axios';
import toast                   from 'react-hot-toast';
import styles                  from './lpo.module.css';
import Card                    from '@/components/ui/Card/Card';
import Badge                   from '@/components/ui/Badge/Badge';
import Button                  from '@/components/ui/Button/Button';
import Table                   from '@/components/ui/Table/Table';
import EmptyState              from '@/components/shared/EmptyState/EmptyState';
import { useAuthStore }        from '@/store/authStore';
import { formatNaira }         from '@/utils/formatCurrency';
import { formatDate }          from '@/utils/formatDate';

export default function LPOPage() {
  const { token }             = useAuthStore();
  const router                = useRouter();
  const [lpos,    setLpos]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/lpo', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(({ data }) => setLpos(data.data || []))
      .catch(() => toast.error('Failed to load LPOs'))
      .finally(() => setLoading(false));
  }, [token]);

  const columns = [
    {
      key:    'lpoNumber',
      label:  'LPO Number',
      render: (val) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>
          {val}
        </span>
      ),
    },
    {
      key:    'requisition',
      label:  'Requisition',
      render: (val) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{val?.title}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            {val?.reqNumber}
          </div>
        </div>
      ),
    },
    {
      key:    'vendor',
      label:  'Vendor',
      render: (val) => val?.name || '—',
    },
    {
      key:    'requisition',
      label:  'Department',
      render: (val) => val?.department?.name || '—',
    },
    {
      key:    'requisition',
      label:  'Amount',
      render: (val) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>
          {formatNaira(val?.totalAmount)}
        </span>
      ),
    },
    {
      key:    'status',
      label:  'Status',
      render: (val) => <Badge status={val} />,
    },
    {
      key:    'createdAt',
      label:  'Date Issued',
      render: (val) => (
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{formatDate(val)}</span>
      ),
    },
    {
      key:    '_id',
      label:  '',
      render: (val) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => { e.stopPropagation(); router.push(`/lpo/${val}`); }}
          icon="bi-eye"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>LPO & Purchase Orders</h2>
          <p className={styles.sub}>{lpos.length} orders issued</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className={styles.summaryGrid}>
        {[
          { label: 'Total LPOs',    value: lpos.length,                                           color: 'var(--text)'   },
          { label: 'Issued',        value: lpos.filter((l) => l.status === 'issued').length,      color: 'var(--accent)' },
          { label: 'Delivered',     value: lpos.filter((l) => l.status === 'delivered').length,   color: 'var(--blue)'   },
          { label: 'Closed',        value: lpos.filter((l) => l.status === 'closed').length,      color: 'var(--muted)'  },
        ].map((s) => (
          <Card key={s.label}>
            <div className={styles.summaryLabel}>{s.label}</div>
            <div className={styles.summaryValue} style={{ color: s.color }}>{s.value}</div>
          </Card>
        ))}
      </div>

      <Table
        columns={columns}
        data={lpos}
        loading={loading}
        onRowClick={(row) => router.push(`/lpo/${row._id}`)}
        emptyMessage="No purchase orders yet"
        emptyIcon="bi-file-earmark-x"
      />
    </div>
  );
}
