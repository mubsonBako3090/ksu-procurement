'use client';
import { useEffect, useState }      from 'react';
import { useRouter, useParams }     from 'next/navigation';
import axios                        from 'axios';
import toast                        from 'react-hot-toast';
import styles                       from './detail.module.css';
import Card                         from '@/components/ui/Card/Card';
import Badge                        from '@/components/ui/Badge/Badge';
import Button                       from '@/components/ui/Button/Button';
import Spinner                      from '@/components/ui/Spinner/Spinner';
import ApprovalTimeline             from '@/components/shared/ApprovalTimeline/ApprovalTimeline';
import PriorityTag                  from '@/components/shared/PriorityTag/PriorityTag';
import { useAuthStore }             from '@/store/authStore';
import { formatNaira }              from '@/utils/formatCurrency';
import { formatDate }               from '@/utils/formatDate';
import { canApprove }               from '@/utils/roleHelpers';

export default function RequisitionDetailPage() {
  const { token, user }       = useAuthStore();
  const router                = useRouter();
  const { id }                = useParams();
  const [req,     setReq]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [acting,  setActing]  = useState(false);

  const fetchReq = async () => {
    try {
      const { data } = await axios.get(`/api/requisitions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReq(data.data);
    } catch {
      toast.error('Failed to load requisition');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReq(); }, [id]);

  const handleApprove = async () => {
    setActing(true);
    try {
      await axios.post(
        `/api/approvals/${id}/approve`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Requisition approved!');
      setComment('');
      fetchReq();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      return toast.error('Please provide a reason for rejection');
    }
    setActing(true);
    try {
      await axios.post(
        `/api/approvals/${id}/reject`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Requisition rejected');
      setComment('');
      fetchReq();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    } finally {
      setActing(false);
    }
  };

  const handleWithdraw = async () => {
    setActing(true);
    try {
      await axios.post(
        `/api/requisitions/${id}/withdraw`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Requisition withdrawn');
      fetchReq();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw');
    } finally {
      setActing(false);
    }
  };

  const userCanApprove = req && canApprove(user?.role, req.status);

  // ✅ Fixed: compare as strings
  const isOwner =
    req?.requester?._id?.toString() === user?.id?.toString();

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <Spinner size={40} />
    </div>
  );

  if (!req) return (
    <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
      Requisition not found.
    </div>
  );

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <i className="bi bi-arrow-left" /> Back
        </button>
        <div className={styles.titleRow}>
          <div>
            <div className={styles.reqNumber}>{req.reqNumber}</div>
            <h2 className={styles.title}>{req.title}</h2>
          </div>
          <div className={styles.badges}>
            <Badge status={req.status} />
            <PriorityTag priority={req.priority} />
            {req.lpoGenerated && (
              <span className={styles.lpoBadge}>
                <i className="bi bi-file-check" /> LPO Generated
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left column */}
        <div className={styles.leftCol}>
          <Card style={{ marginBottom: 20 }}>
            <h5 className={styles.cardTitle}>Requisition Details</h5>
            <div className={styles.detailGrid}>
              {[
                ['Requester',   req.requester?.name],
                ['Department',  req.department?.name],
                ['Category',    req.category],
                ['Date Raised', formatDate(req.createdAt)],
                ['Required By', req.requiredDate
                  ? formatDate(req.requiredDate)
                  : 'Not specified'],
                ['Vendor',      req.vendor?.name || 'Not assigned'],
              ].map(([k, v]) => (
                <div key={k} className={styles.detailItem}>
                  <div className={styles.detailKey}>{k}</div>
                  <div className={styles.detailVal}>{v || '—'}</div>
                </div>
              ))}
            </div>

            {req.justification && (
              <div className={styles.justification}>
                <div className={styles.detailKey}>Justification</div>
                <p className={styles.justText}>{req.justification}</p>
              </div>
            )}

            {req.rejectionReason && (
              <div className={styles.rejectionBox}>
                <i className="bi bi-x-circle" />
                <div>
                  <strong>Rejection Reason:</strong>
                  <p style={{ margin: '4px 0 0', fontSize: 13 }}>
                    {req.rejectionReason}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Line items */}
          <Card>
            <h5 className={styles.cardTitle}>Line Items</h5>
            <div className={styles.itemsTable}>
              <div className={styles.itemsHeader}>
                <span>Description</span>
                <span>Qty</span>
                <span>Unit</span>
                <span>Unit Price</span>
                <span>Total</span>
              </div>
              {req.items?.map((item, i) => (
                <div key={i} className={styles.itemRow}>
                  <span>{item.description}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    {item.quantity}
                  </span>
                  <span style={{ color: 'var(--muted)' }}>{item.unit}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    {formatNaira(item.unitPrice)}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color:      'var(--accent)',
                  }}>
                    {formatNaira(item.totalPrice)}
                  </span>
                </div>
              ))}
              <div className={styles.totalRow}>
                <span>Total Amount</span>
                <span className={styles.totalAmount}>
                  {formatNaira(req.totalAmount)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          <Card style={{ marginBottom: 20 }}>
            <h5 className={styles.cardTitle}>Approval Workflow</h5>
            <ApprovalTimeline approvals={req.approvals || []} />
          </Card>

          {/* Action panel */}
          {userCanApprove && (
            <Card className={styles.actionCard}>
              <div className={styles.actionTitle}>
                <i className="bi bi-lightning-charge" /> Action Required
              </div>
              <p className={styles.actionSub}>
                This requisition is awaiting your review as{' '}
                <strong>{user?.role}</strong>.
              </p>
              <div className={styles.commentWrap}>
                <label className={styles.commentLabel}>Comment</label>
                <textarea
                  className={styles.commentBox}
                  placeholder="Add your review comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>
              <div className={styles.actionBtns}>
                <Button
                  onClick={handleApprove}
                  loading={acting}
                  icon="bi-check-lg"
                  style={{ flex: 1 }}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  onClick={handleReject}
                  loading={acting}
                  icon="bi-x-lg"
                  style={{ flex: 1 }}
                >
                  Reject
                </Button>
              </div>
            </Card>
          )}

          {/* ✅ Fixed withdraw button — correct string comparison */}
          {req.status === 'pending_hod' && isOwner && (
            <Card style={{ marginTop: 16 }}>
              <Button
                variant="ghost"
                onClick={handleWithdraw}
                loading={acting}
                icon="bi-arrow-counterclockwise"
                fullWidth
              >
                Withdraw Requisition
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
