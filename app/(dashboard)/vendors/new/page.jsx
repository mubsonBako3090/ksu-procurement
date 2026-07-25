'use client';
import { useState }     from 'react';
import { useRouter }    from 'next/navigation';
import axios            from 'axios';
import toast            from 'react-hot-toast';
import styles           from './new.module.css';
import Card             from '@/components/ui/Card/Card';
import Input            from '@/components/ui/Input/Input';
import Textarea         from '@/components/ui/Textarea/Textarea';
import Button           from '@/components/ui/Button/Button';
import { useAuthStore } from '@/store/authStore';

export default function NewVendorPage() {
  const { token } = useAuthStore();
  const router    = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:      '',
    email:     '',
    phone:     '',
    address:   '',
    location:  '',
    rcNumber:  '',
    tinNumber: '',
    notes:     '',
  });

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Vendor name is required');
    setLoading(true);
    try {
      await axios.post('/api/vendors', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Vendor registered successfully!');
      router.push('/vendors');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <i className="bi bi-arrow-left" /> Back
        </button>
        <div>
          <h2 className={styles.title}>Register New Vendor</h2>
          <p className={styles.sub}>Add a vendor to the KSU procurement directory</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card style={{ maxWidth: 700 }}>
          <h5 className={styles.cardTitle}>Vendor Information</h5>
          <div className={styles.grid2}>
            <div className={styles.colSpan2}>
              <Input
                label="Vendor / Company Name *"
                value={form.name}
                onChange={set('name')}
                placeholder="e.g. TechBridge Nigeria Ltd"
                icon="bi-building"
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="info@vendor.com"
              icon="bi-envelope"
            />
            <Input
              label="Phone Number"
              value={form.phone}
              onChange={set('phone')}
              placeholder="080XXXXXXXX"
              icon="bi-telephone"
            />
            <Input
              label="RC Number"
              value={form.rcNumber}
              onChange={set('rcNumber')}
              placeholder="RC123456"
              icon="bi-hash"
            />
            <Input
              label="TIN Number"
              value={form.tinNumber}
              onChange={set('tinNumber')}
              placeholder="Tax Identification Number"
              icon="bi-card-text"
            />
            <Input
              label="Location / City"
              value={form.location}
              onChange={set('location')}
              placeholder="e.g. Kaduna"
              icon="bi-geo-alt"
            />
            <div className={styles.colSpan2}>
              <Textarea
                label="Full Address"
                value={form.address}
                onChange={set('address')}
                placeholder="Street address..."
                style={{ minHeight: 70 }}
              />
            </div>
            <div className={styles.colSpan2}>
              <Textarea
                label="Notes (Optional)"
                value={form.notes}
                onChange={set('notes')}
                placeholder="Any additional information about this vendor..."
                style={{ minHeight: 70 }}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} icon="bi-check-lg">
              Register Vendor
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
      }
