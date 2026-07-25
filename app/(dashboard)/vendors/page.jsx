'use client';
import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import axios                   from 'axios';
import toast                   from 'react-hot-toast';
import styles                  from './vendors.module.css';
import Card                    from '@/components/ui/Card/Card';
import Button                  from '@/components/ui/Button/Button';
import Spinner                 from '@/components/ui/Spinner/Spinner';
import EmptyState              from '@/components/shared/EmptyState/EmptyState';
import { useAuthStore }        from '@/store/authStore';

export default function VendorsPage() {
  const { token, user }         = useAuthStore();
  const router                  = useRouter();
  const [vendors,  setVendors]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');

  useEffect(() => {
    axios.get('/api/vendors', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(({ data }) => setVendors(data.data || []))
      .catch(() => toast.error('Failed to load vendors'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleVerify = async (id) => {
    try {
      await axios.post(`/api/vendors/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Vendor verified!');
      setVendors((vs) =>
        vs.map((v) => v._id === id ? { ...v, isVerified: true } : v)
      );
    } catch {
      toast.error('Failed to verify vendor');
    }
  };

  const filtered = vendors.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                        v.location?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ||
                       (filter === 'verified' && v.isVerified) ||
                       (filter === 'unverified' && !v.isVerified);
    return matchSearch && matchFilter;
  });

  const stars = (r) => '★'.repeat(Math.round(r || 0)) + '☆'.repeat(5 - Math.round(r || 0));

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
          <h2 className={styles.title}>Vendor Directory</h2>
          <p className={styles.sub}>{filtered.length} vendors</p>
        </div>
        {['procurement', 'admin'].includes(user?.role) && (
          <Button onClick={() => router.push('/vendors/new')} icon="bi-plus-lg">
            Register Vendor
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <i className={`bi bi-search ${styles.searchIcon}`} />
          <input
            className={styles.search}
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterTabs}>
          {['all', 'verified', 'unverified'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[styles.filterTab, filter === f ? styles.activeTab : ''].join(' ')}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon="bi-building-x"
            title="No Vendors Found"
            message="No vendors match your search criteria."
            action={['procurement','admin'].includes(user?.role) ? 'Register Vendor' : undefined}
            onAction={() => router.push('/vendors/new')}
          />
        </Card>
      ) : (
        <div className={styles.vendorGrid}>
          {filtered.map((v) => (
            <div key={v._id} className={styles.vendorCard}>
              <div className={styles.vendorTop}>
                <div className={styles.vendorIcon}>
                  <i className="bi bi-building" />
                </div>
                <span className={v.isVerified ? styles.verifiedBadge : styles.unverifiedBadge}>
                  {v.isVerified
                    ? <><i className="bi bi-patch-check-fill" /> Verified</>
                    : 'Unverified'
                  }
                </span>
              </div>

              <h5 className={styles.vendorName}>{v.name}</h5>

              <div className={styles.vendorMeta}>
                {v.location && (
                  <span><i className="bi bi-geo-alt" /> {v.location}</span>
                )}
                {v.phone && (
                  <span><i className="bi bi-telephone" /> {v.phone}</span>
                )}
                {v.rcNumber && (
                  <span><i className="bi bi-hash" /> RC: {v.rcNumber}</span>
                )}
              </div>

              <div className={styles.vendorRating}>
                <span className={styles.stars}>{stars(v.rating)}</span>
                <span className={styles.ratingNum}>{(v.rating || 0).toFixed(1)}/5.0</span>
              </div>

              {!v.isVerified && ['procurement', 'admin'].includes(user?.role) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVerify(v._id)}
                  icon="bi-patch-check"
                  fullWidth
                  style={{ marginTop: 12 }}
                >
                  Verify Vendor
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
