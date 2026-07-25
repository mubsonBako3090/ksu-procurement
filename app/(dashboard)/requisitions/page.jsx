'use client';
import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import axios                   from 'axios';
import toast                   from 'react-hot-toast';
import styles                  from './requisitions.module.css';
import Badge                   from '@/components/ui/Badge/Badge';
import Button                  from '@/components/ui/Button/Button';
import Table                   from '@/components/ui/Table/Table';
import Spinner                 from '@/components/ui/Spinner/Spinner';
import EmptyState              from '@/components/shared/EmptyState/EmptyState';
import PriorityTag             from '@/components/shared/PriorityTag/PriorityTag';
import { useAuthStore }        from '@/store/authStore';
import { formatNaira }         from '@/utils/formatCurrency';
import { formatDate }          from '@/utils/formatDate';

const STATUSES = [
  'all',
  'draft',
  'pending_hod',
  'pending_procurement',
  'pending_finance',
  'pending_vc',
  'approved',
  'rejected',
];

const CATEGORIES = [
  'All Categories',
  'IT Equipment',
  'Office Supplies',
  'Furniture',
  'Laboratory Materials',
  'Stationery',
  'Cleaning Supplies',
  'Medical Supplies',
  'Books & Journals',
  'Electrical Items',
  'Vehicles & Spare Parts',
];

export default function RequisitionsPage() {
  const { token, user }       = useAuthStore();
  const router                = useRouter();
  const [reqs,    setReqs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState('all');
  const [category,setCategory]= useState('');

  const fetchReqs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (status   !== 'all') params.status   = status;
      if (category !== '' && category !== 'All Categories') params.category = category;

      const { data } = await axios.get('/api/requisitions', {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setReqs(data.data || []);
    } catch {
      toast.error('Failed to load requisitions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReqs(); }, [status, category]);

  const filtered = reqs.filter((r) =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.reqNumber?.toLowerCase().includes(search.toLowerCase()) ||
    r.department?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key:    'reqNumber',
      label:  'REQ ID',
      render: (val) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>
          {val}
        </span>
      ),
    },
    {
      key:    'title',
      label:  'Title',
      render: (val) => (
        <span style={{ fontWeight: 600 }}>{val}</span>
      ),
    },
    {
      key:    'department',
      label:  'Department',
      render: (val) => val?.name || '—',
    },
    {
      key:    'category',
      label:  'Category',
    },
    {
      key:    'totalAmount',
      label:  'Amount',
      render: (val) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>
          {formatNaira(val)}
        </span>
      ),
    },
    {
      key:    'priority',
      label:  'Priority',
      render: (val) => <PriorityTag priority={val} />,
    },
    {
      key:    'status',
      label:  'Status',
      render: (val) => <Badge status={val} />,
    },
    {
      key:    'createdAt',
      label:  'Date',
      render: (val) => (
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>
          {formatDate(val)}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Requisitions</h2>
          <p className={styles.sub}>
            {filtered.length} of {reqs.length} records
          </p>
        </div>
        {['requester', 'admin'].includes(user?.role) && (
          <Button
            onClick={() => router.push('/requisitions/new')}
            icon="bi-plus-lg"
          >
            New Requisition
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {/* Search */}
        <div className={styles.searchWrap}>
          <i className={`bi bi-search ${styles.searchIcon}`} />
          <input
            className={styles.search}
            placeholder="Search by title, ID or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div className={styles.statusTabs}>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={[
                styles.statusTab,
                status === s ? styles.activeTab : '',
              ].join(' ')}
            >
              {s === 'all' ? 'All' : s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Category */}
        <select
          className={styles.categorySelect}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filtered}
        loading={loading}
        onRowClick={(row) => router.push(`/requisitions/${row._id}`)}
        emptyMessage="No requisitions found"
        emptyIcon="bi-clipboard-x"
      />
    </div>
  );
}
