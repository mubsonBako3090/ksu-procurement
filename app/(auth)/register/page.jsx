'use client';
import { useState, useEffect } from 'react';
import { useRouter }           from 'next/navigation';
import Link                    from 'next/link';
import axios                   from 'axios';
import toast                   from 'react-hot-toast';
import styles                  from './register.module.css';
import Spinner                 from '@/components/ui/Spinner/Spinner';
// Add this import at the top of register/page.jsx
import { useAuthStore } from '@/store/authStore';

const ROLE_OPTIONS = [
  { value: 'requester',   label: 'Requester — Submit procurement requests' },
  { value: 'hod',         label: 'HOD — Head of Department approvals'      },
  { value: 'procurement', label: 'Procurement Officer'                      },
  { value: 'finance',     label: 'Finance / Bursar'                         },
  { value: 'vc',          label: 'Vice Chancellor'                          },
  { value: 'admin',       label: 'System Administrator',  desc: 'Full system access'             },
];

export default function RegisterPage() {
  
// Add this inside the component
const { setAuth } = useAuthStore();
  const router   = useRouter();
  const [loading,  setLoading]  = useState(false);
  const [depts,    setDepts]    = useState([]);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: '',
    role:            'requester',
    department:      '',
    phone:           '',
    staffId:         '',
  });

  const [errors, setErrors] = useState({});

  // Fetch departments
  useEffect(() => {
    axios
      .get('/api/departments/public')
      .then(({ data }) => setDepts(data.data || []))
      .catch(() => setDepts([]));
  }, []);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())                    e.name            = 'Full name is required';
    if (!form.email.trim())                   e.email           = 'Email address is required';
    if (!form.email.includes('@ksu.edu.ng') &&
        !form.email.includes('@gmail.com'))   e.email           = 'Use your KSU email address';
    if (!form.password)                       e.password        = 'Password is required';
    if (form.password.length < 8)            e.password        = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.role)                           e.role            = 'Please select your role';
    if (!form.staffId.trim())                 e.staffId         = 'Staff ID is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);
  try {
  } const {
      name, email, password,
      role, department, phone, staffId,
    } = form;

    // Step 1 — Register
    await axios.post('/api/auth/register', {
      name,
      email,
      password,
      role,
      department: department || null,
      phone,
      staffId,
    });

    toast.success('Account created! Logging you in...');

    // Step 2 — Auto login
    const { data } = await axios.post('/api/auth/login', {
      email,
      password,
    });

    const { token, user } = data.data;

    // Step 3 — Save to store
    setAuth(token, user);

    toast.success(`Welcome, ${user.name}!`);

    // Step 4 — Go to dashboard
    router.replace('/dashboard');

  } catch (err) {
    toast.error(
      err.response?.data?.message || 'Registration failed'
    );
    setLoading(false);
  }
};

    const { token: newToken, user: newUser } = data.data;

    // Step 3 — Save auth state
    setAuth(newToken, newUser);

    toast.success(`Welcome, ${newUser.name}!`);

    // Step 4 — Redirect to dashboard after short delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 100);

  } catch (err) {
    toast.error(
      err.response?.data?.message || 'Registration failed'
    );
    setLoading(false);
  }
};

  const passwordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8)          score++;
    if (/[A-Z]/.test(pwd))        score++;
    if (/[0-9]/.test(pwd))        score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map = [
      { level: 0, label: '',          color: '' },
      { level: 1, label: 'Weak',      color: 'var(--red)'    },
      { level: 2, label: 'Fair',      color: 'var(--gold)'   },
      { level: 3, label: 'Good',      color: 'var(--blue)'   },
      { level: 4, label: 'Strong',    color: 'var(--accent)' },
    ];
    return map[score];
  };

  const strength = passwordStrength(form.password);

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Logo */}
        <div className={styles.logoBox}>
          <div className={styles.logo}>K</div>
          <h1 className={styles.appName}>Create Your Account</h1>
          <p className={styles.appSub}>KSU Procurement System — Kaduna State University</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Name */}
          <div className={styles.field}>
            <label className={styles.label}>Full Name *</label>
            <div className={styles.inputWrap}>
              <i className={`bi bi-person ${styles.inputIcon}`} />
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="e.g. Dr. Amina Bello"
                className={[styles.input, errors.name ? styles.inputError : ''].join(' ')}
                autoComplete="name"
              />
            </div>
            {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label}>Email Address *</label>
            <div className={styles.inputWrap}>
              <i className={`bi bi-envelope ${styles.inputIcon}`} />
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@ksu.edu.ng"
                className={[styles.input, errors.email ? styles.inputError : ''].join(' ')}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>

          {/* Two column row */}
          <div className={styles.row2}>
            {/* Staff ID */}
            <div className={styles.field}>
              <label className={styles.label}>Staff ID *</label>
              <div className={styles.inputWrap}>
                <i className={`bi bi-badge-id ${styles.inputIcon}`} />
                <input
                  type="text"
                  value={form.staffId}
                  onChange={set('staffId')}
                  placeholder="KSU/STF/001"
                  className={[styles.input, errors.staffId ? styles.inputError : ''].join(' ')}
                />
              </div>
              {errors.staffId && <span className={styles.errorMsg}>{errors.staffId}</span>}
            </div>

            {/* Phone */}
            <div className={styles.field}>
              <label className={styles.label}>Phone Number</label>
              <div className={styles.inputWrap}>
                <i className={`bi bi-telephone ${styles.inputIcon}`} />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="080XXXXXXXX"
                  className={styles.input}
                  autoComplete="tel"
                />
              </div>
            </div>
          </div>

          {/* Two column row */}
          <div className={styles.row2}>
            {/* Role */}
            <div className={styles.field}>
              <label className={styles.label}>Your Role *</label>
              <div className={styles.selectWrap}>
                <i className={`bi bi-person-badge ${styles.inputIcon}`} />
                <select
                  value={form.role}
                  onChange={set('role')}
                  className={[styles.select, errors.role ? styles.inputError : ''].join(' ')}
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.role && <span className={styles.errorMsg}>{errors.role}</span>}
            </div>

            {/* Department */}
            <div className={styles.field}>
              <label className={styles.label}>Department</label>
              <div className={styles.selectWrap}>
                <i className={`bi bi-building ${styles.inputIcon}`} />
                <select
                  value={form.department}
                  onChange={set('department')}
                  className={styles.select}
                >
                  <option value="">Select department</option>
                  {depts.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label}>Password *</label>
            <div className={styles.inputWrap}>
              <i className={`bi bi-lock ${styles.inputIcon}`} />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="Min. 8 characters"
                className={[styles.input, errors.password ? styles.inputError : ''].join(' ')}
                style={{ paddingRight: 44 }}
                autoComplete="new-password"
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

            {/* Password strength indicator */}
            {form.password && (
              <div className={styles.strengthWrap}>
                <div className={styles.strengthBars}>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={styles.strengthBar}
                      style={{
                        background:
                          i <= strength.level
                            ? strength.color
                            : 'var(--border)',
                      }}
                    />
                  ))}
                </div>
                {strength.label && (
                  <span
                    className={styles.strengthLabel}
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </span>
                )}
              </div>
            )}

            {errors.password && (
              <span className={styles.errorMsg}>{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className={styles.field}>
            <label className={styles.label}>Confirm Password *</label>
            <div className={styles.inputWrap}>
              <i className={`bi bi-lock-fill ${styles.inputIcon}`} />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                placeholder="Repeat your password"
                className={[
                  styles.input,
                  errors.confirmPassword ? styles.inputError : '',
                  form.confirmPassword && form.confirmPassword === form.password
                    ? styles.inputSuccess
                    : '',
                ].join(' ')}
                style={{ paddingRight: 44 }}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowConfirm((s) => !s)}
                tabIndex={-1}
              >
                <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
            {form.confirmPassword && form.confirmPassword === form.password && (
              <span className={styles.matchMsg}>
                <i className="bi bi-check-circle-fill" /> Passwords match
              </span>
            )}
            {errors.confirmPassword && (
              <span className={styles.errorMsg}>{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? (
              <><Spinner size={18} color="#000" /> Creating Account…</>
            ) : (
              <><i className="bi bi-person-plus" /> Create Account</>
            )}
          </button>
        </form>

        {/* Login link */}
        <div className={styles.loginRow}>
          <span className={styles.loginText}>Already have an account?</span>
          <Link href="/login" className={styles.loginLink}>
            Sign in →
          </Link>
        </div>

        {/* Note */}
        <div className={styles.note}>
          <i className="bi bi-info-circle" />
          <span>
            Your account will be activated after admin verification.
            Use your official KSU email address.
          </span>
        </div>

      </div>
    </div>
  );
        }
