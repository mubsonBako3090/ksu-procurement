'use client';
import { useState }      from 'react';
import { useRouter }     from 'next/navigation';
import Link              from 'next/link';
import axios             from 'axios';
import toast             from 'react-hot-toast';
import { useAuthStore }  from '@/store/authStore';
import styles            from './login.module.css';
import Spinner           from '@/components/ui/Spinner/Spinner';

const DEMO_USERS = [
  { role: 'Requester',   email: 'requester@ksu.edu.ng'   },
  { role: 'HOD',         email: 'hod@ksu.edu.ng'         },
  { role: 'Procurement', email: 'procurement@ksu.edu.ng' },
  { role: 'Finance',     email: 'finance@ksu.edu.ng'     },
  { role: 'VC',          email: 'vc@ksu.edu.ng'          },
  { role: 'Admin',       email: 'admin@ksu.edu.ng'       },
];

export default function LoginPage() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { setAuth } = useAuthStore();
  const router      = useRouter();

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return toast.error('Please fill in all fields');
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      setAuth(data.data.token, data.data.user);
      toast.success(`Welcome, ${data.data.user.name}!`);
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const autoFill = (email) =>
    setForm({ email, password: 'Password@123' });

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Logo */}
        <div className={styles.logoBox}>
          <div className={styles.logo}>K</div>
          <h1 className={styles.appName}>KSU Procurement System</h1>
          <p className={styles.appSub}>Kaduna State University</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrap}>
              <i className={`bi bi-envelope ${styles.inputIcon}`} />
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@ksu.edu.ng"
                className={styles.input}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <i className={`bi bi-lock ${styles.inputIcon}`} />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="••••••••"
                className={styles.input}
                style={{ paddingRight: 44 }}
                required
                autoComplete="current-password"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? (
              <><Spinner size={18} color="#000" /> Signing in…</>
            ) : (
              <><i className="bi bi-box-arrow-in-right" /> Sign In</>
            )}
          </button>
        </form>

        {/* Register link */}
        <div className={styles.registerRow}>
          <span className={styles.registerText}>
            New staff member?
          </span>
          <Link href="/register" className={styles.registerLink}>
            Create an account →
          </Link>
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <span>Demo Credentials</span>
        </div>

        {/* Demo credentials */}
        <div className={styles.demoBox}>
          <div className={styles.demoGrid}>
            {DEMO_USERS.map((u) => (
              <button
                key={u.role}
                className={styles.demoBtn}
                onClick={() => autoFill(u.email)}
                type="button"
              >
                <span className={styles.demoRole}>{u.role}</span>
                <span className={styles.demoEmail}>{u.email}</span>
              </button>
            ))}
          </div>
          <p className={styles.demoPass}>
            Password: <strong>Password@123</strong>
            {' '}— click any role to autofill
          </p>
        </div>

      </div>
    </div>
  );
}
