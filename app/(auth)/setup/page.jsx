'use client';
import { useState, useEffect } from 'react';
import { useRouter }           from 'next/navigation';
import Link                    from 'next/link';
import axios                   from 'axios';
import toast                   from 'react-hot-toast';
import styles                  from './setup.module.css';
import Spinner                 from '@/components/ui/Spinner/Spinner';
// Add import
import { useAuthStore } from '@/store/authStore';



export default function SetupPage() {
  const { setAuth } = useAuthStore();
  const router   = useRouter();
  const [checking, setChecking]  = useState(true);
  const [allowed,  setAllowed]   = useState(false);
  const [loading,  setLoading]   = useState(false);
  const [showPass, setShowPass]  = useState(false);
  const [done,     setDone]      = useState(false);

  const [form, setForm] = useState({
    name:     '',
    email:    '',
    password: '',
    phone:    '',
    staffId:  'KSU/ADM/001',
  });

  const [errors, setErrors] = useState({});

  // Check if setup is required
  useEffect(() => {
    axios
      .get('/api/auth/setup')
      .then(({ data }) => {
        if (data.data.setupRequired) {
          setAllowed(true);
        } else {
          // Already set up — redirect to login
          router.push('/login');
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setChecking(false));
  }, [router]);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name     = 'Full name is required';
    if (!form.email.trim())       e.email    = 'Email is required';
    if (!form.password)           e.password = 'Password is required';
    if (form.password.length < 8) e.password = 'Min. 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);
  try {
    // Step 1 — Create admin account
    await axios.post('/api/auth/setup', form);

    toast.success('Admin account created! Logging you in...');

    // Step 2 — Auto login
    const { data } = await axios.post('/api/auth/login', {
      email:    form.email,
      password: form.password,
    });

    const { token: newToken, user: newUser } = data.data;

    // Step 3 — Save auth
    setAuth(newToken, newUser);

    setDone(true);

    // Step 4 — Redirect
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);

  } catch (err) {
    toast.error(err.response?.data?.message || 'Setup failed');
    setLoading(false);
  }
};

  if (checking) {
    return (
      <div className={styles.page}>
        <div className={styles.center}>
          <Spinner size={40} />
          <p style={{ color: 'var(--muted)', marginTop: 16, fontSize: 14 }}>
            Checking system status...
          </p>
        </div>
      </div>
    );
  }

  if (!allowed) return null;

  if (done) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successBox}>
            <div className={styles.successIcon}>
              <i className="bi bi-check-circle-fill" />
            </div>
            <h2 className={styles.successTitle}>Setup Complete!</h2>
            <p className={styles.successMsg}>
              Your admin account has been created and all departments
              have been set up. Redirecting to login...
            </p>
            <Spinner size={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Header */}
        <div className={styles.logoBox}>
          <div className={styles.logo}>K</div>
          <h1 className={styles.appName}>System Setup</h1>
          <p className={styles.appSub}>
            KSU Procurement System — First Time Setup
          </p>
        </div>

        {/* Info banner */}
        <div className={styles.infoBanner}>
          <i className="bi bi-info-circle-fill" />
          <div>
            <strong>Welcome!</strong> No accounts exist yet. Create the
            first admin account to get started. This page will
            disappear once an admin is created.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.field}>
            <label className={styles.label}>Full Name *</label>
            <div className={styles.inputWrap}>
              <i className={`bi bi-person ${styles.inputIcon}`} />
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="e.g. System Administrator"
                className={[
                  styles.input,
                  errors.name ? styles.inputError : '',
                ].join(' ')}
              />
            </div>
            {errors.name && (
              <span className={styles.errorMsg}>{errors.name}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email Address *</label>
            <div className={styles.inputWrap}>
              <i className={`bi bi-envelope ${styles.inputIcon}`} />
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="admin@ksu.edu.ng"
                className={[
                  styles.input,
                  errors.email ? styles.inputError : '',
                ].join(' ')}
              />
            </div>
            {errors.email && (
              <span className={styles.errorMsg}>{errors.email}</span>
            )}
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>Staff ID</label>
              <div className={styles.inputWrap}>
                <i className={`bi bi-hash ${styles.inputIcon}`} />
                <input
                  type="text"
                  value={form.staffId}
                  onChange={set('staffId')}
                  placeholder="KSU/ADM/001"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Phone</label>
              <div className={styles.inputWrap}>
                <i className={`bi bi-telephone ${styles.inputIcon}`} />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="080XXXXXXXX"
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password *</label>
            <div className={styles.inputWrap}>
              <i className={`bi bi-lock ${styles.inputIcon}`} />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="Min. 8 characters"
                className={[
                  styles.input,
                  errors.password ? styles.inputError : '',
                ].join(' ')}
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass((s) => !s)}
                tabIndex={-1}
              >
                <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorMsg}>{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? (
              <><Spinner size={18} color="#000" /> Creating Admin Account…</>
            ) : (
              <><i className="bi bi-shield-check" /> Create Admin Account</>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account?{' '}
          <Link href="/login" className={styles.loginLink}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
