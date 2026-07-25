'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios                    from 'axios';
import toast                    from 'react-hot-toast';
import styles                   from './lpo-detail.module.css';
import Card                     from '@/components/ui/Card/Card';
import Badge                    from '@/components/ui/Badge/Badge';
import Button                   from '@/components/ui/Button/Button';
import Spinner                  from '@/components/ui/Spinner/Spinner';
import { useAuthStore }         from '@/store/authStore';
import { formatNaira }          from '@/utils/formatCurrency';
import { formatDate }           from '@/utils/formatDate';

export default function LPODetailPage() {
  const { token }             = useAuthStore();
  const router                = useRouter();
  const { id }                = useParams();
  const [lpo,     setLpo]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    axios.get(`/api/lpo/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(({ data }) => setLpo(data.data))
      .catch(() => toast.error('Failed to load LPO'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await axios.get(`/api/lpo/${id}/pdf`, {
        headers:      { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url  = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href  = url;
      link.download = `LPO-${lpo?.lpoNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <Spinner size={40} />
    </div>
  );

  if (!lpo) return (
    <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
      LPO not found.
    </div>
  );

  const req  = lpo.requisition;
  const dept = req?.department;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <i className="bi bi-arrow-left" /> Back
        </button>
        <div className={styles.headerInfo}>
          <div>
            <span className={styles.lpoNum}>{lpo.lpoNumber}</span>
            <h2 className={styles.title}>Local Purchase Order</h2>
          </div>
          <div className={styles.headerActions}>
            <Badge status={lpo.status} />
            <Button
              onClick={handleDownload}
              loading={downloading}
              icon="bi-download"
              variant="gold"
            >
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* LPO Document Preview */}
      <Card className={styles.lpoDoc}>
        {/* Institution header */}
        <div className={styles.docHeader}>
          <div className={styles.docLogo}>K</div>
          <div className={styles.docHeaderText}>
            <h3>KADUNA STATE UNIVERSITY</h3>
            <p>Kafanchan Road, Kaduna State, Nigeria</p>
            <p>Tel: 062-XXXXXXX | Email: procurement@ksu.edu.ng</p>
          </div>
        </div>

        <div className={styles.docDivider} />
        <h4 className={styles.docTitle}>LOCAL PURCHASE ORDER (LPO)</h4>

        {/* Meta */}
        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaKey}>LPO Number:</span>
            <span className={styles.metaVal}>{lpo.lpoNumber}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaKey}>Date Issued:</span>
            <span className={styles.metaVal}>{formatDate(lpo.createdAt)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaKey}>REQ Number:</span>
            <span className={styles.metaVal}>{req?.reqNumber}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaKey}>Department:</span>
            <span className={styles.metaVal}>{dept?.name}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaKey}>Vendor:</span>
            <span className={styles.metaVal}>{lpo.vendor?.name}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaKey}>Issued By:</span>
            <span className={styles.metaVal}>{lpo.issuedBy?.name}</span>
          </div>
          {lpo.vendor?.address && (
            <div className={styles.metaItem}>
              <span className={styles.metaKey}>Vendor Address:</span>
              <span className={styles.metaVal}>{lpo.vendor.address}</span>
            </div>
          )}
          {lpo.expectedDeliveryDate && (
            <div className={styles.metaItem}>
              <span className={styles.metaKey}>Expected Delivery:</span>
              <span className={styles.metaVal}>{formatDate(lpo.expectedDeliveryDate)}</span>
            </div>
          )}
        </div>

        {/* Items table */}
        <div className={styles.itemsTable}>
          <div className={styles.tableHeader}>
            <span>S/N</span>
            <span>Description</span>
            <span>Qty</span>
            <span>Unit</span>
            <span>Unit Price (₦)</span>
            <span>Total (₦)</span>
          </div>
          {req?.items?.map((item, i) => (
            <div key={i} className={styles.tableRow}>
              <span>{i + 1}</span>
              <span>{item.description}</span>
              <span>{item.quantity}</span>
              <span>{item.unit}</span>
              <span>{formatNaira(item.unitPrice)}</span>
              <span style={{ fontWeight: 700 }}>{formatNaira(item.totalPrice)}</span>
            </div>
          ))}
          <div className={styles.tableTotal}>
            <span>TOTAL AMOUNT:</span>
            <span className={styles.totalAmount}>{formatNaira(req?.totalAmount)}</span>
          </div>
        </div>

        {/* Signatures */}
        <div className={styles.signatures}>
          {['Procurement Officer', 'Bursar / Finance', 'Vice Chancellor'].map((sig) => (
            <div key={sig} className={styles.sigBox}>
              <div className={styles.sigLine} />
              <div className={styles.sigLabel}>{sig}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
