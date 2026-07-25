'use client';
import { useState }     from 'react';
import axios            from 'axios';
import toast            from 'react-hot-toast';
import styles           from './settings.module.css';
import Card             from '@/components/ui/Card/Card';
import Input            from '@/components/ui/Input/Input';
import Button           from '@/components/ui/Button/Button';
import { useAuthStore } from '@/store/authStore';

export default function SettingsPage() {
  const { token, user, updateUser } = useAuthStore();
  const [pwForm,     setPwForm]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading,  setPwLoading]  = useState(false);

  const setPw = (k) => (e) =>
    setPwForm((f) => ({ ...f, [k]: e.target.value }));

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (pwForm.newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    setPwLoading(true);
    try {
      await axios.post('/api/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const INFO_ITEMS = [
    ['Institution',     'Kaduna State University'],
    ['Campus',          'Main Campus, Kafanchan Road, Kaduna'],
    ['Fiscal Year',     'January — December'],
    ['Currency',        'Nigerian Naira (₦)'],
    ['System Version',  'v1.0.0'],
  ];

  const THRESHOLD_ITEMS = [
    ['Direct Purchase Limit',  '₦50,000'],
    ['HOD Approval Required',  '₦50,001 — ₦500,000'],
    ['Finance/VC Approval',    '₦500,001 — ₦2,000,000'],
    ['VC Final Approval',      'Above ₦2,000,000'],
  ];

  const WORKFLOW_ITEMS = [
    ['Level 1', 'Head of Department (HOD)'],
    ['Level 2', 'Procurement Officer'],
    ['Level 3', 'Finance / Bursar'],
    ['Level 4', 'Vice Chancellor'],
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>System Settings</h2>
        <p className={styles.sub}>
          Logged in as: <strong style={{ color: 'var(--accent)' }}>{user?.name}</strong>
        </p>
      </div>

      <div className={styles.grid}>
        {/* Institution Info */}
        <Card>
          <div className={styles.cardHeader}>
            <i className="bi bi-building" style={{ color: 'var(--accent)' }} />
            <h5 className={styles.cardTitle}>Institution Details</h5>
          </div>
          {INFO_ITEMS.map(([k, v]) => (
            <div key={k} className={styles.infoRow}>
              <span className={styles.infoKey}>{k}</span>
              <span className={styles.infoVal}>{v}</span>
            </div>
          ))}
        </Card>

        {/* Procurement Thresholds */}
        <Card>
          <div className={styles.cardHeader}>
            <i className="bi bi-cash-coin" style={{ color: 'var(--gold)' }} />
            <h5 className={styles.cardTitle}>Procurement Thresholds</h5>
          </div>
          {THRESHOLD_ITEMS.map(([k, v]) => (
            <div key={k} className={styles.infoRow}>
              <span className={styles.infoKey}>{k}</span>
              <span className={styles.infoVal} style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                {v}
              </span>
            </div>
          ))}
        </Card>

        {/* Approval Workflow */}
        <Card>
          <div className={styles.cardHeader}>
            <i className="bi bi-diagram-3" style={{ color: 'var(--blue)' }} />
            <h5 className={styles.cardTitle}>Approval Workflow</h5>
          </div>
          {WORKFLOW_ITEMS.map(([level, role], i) => (
            <div key={level} className={styles.workflowRow}>
              <div
                className={styles.workflowDot}
                style={{ background: `var(--accent)` }}
              >
                {i + 1}
              </div>
              <div>
                <div className={styles.workflowLevel}>{level}</div>
                <div className={styles.workflowRole}>{role}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Change Password */}
        <Card>
          <div className={styles.cardHeader}>
            <i className="bi bi-shield-lock" style={{ color: 'var(--purple)' }} />
            <h5 className={styles.cardTitle}>Change Password</h5>
          </div>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input
              label="Current Password"
              type="password"
              value={pwForm.currentPassword}
              onChange={setPw('currentPassword')}
              placeholder="Enter current password"
              icon="bi-lock"
              required
            />
            <Input
              label="New Password"
              type="password"
              value={pwForm.newPassword}
              onChange={setPw('newPassword')}
              placeholder="Min. 8 characters"
              icon="bi-lock-fill"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={pwForm.confirmPassword}
              onChange={setPw('confirmPassword')}
              placeholder="Repeat new password"
              icon="bi-shield-check"
              required
            />
            <Button
              type="submit"
              loading={pwLoading}
              icon="bi-check-lg"
              fullWidth
            >
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
     }
