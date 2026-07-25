'use client';
import { useState }     from 'react';
import { useRouter }    from 'next/navigation';
import axios            from 'axios';
import toast            from 'react-hot-toast';
import styles           from './new.module.css';
import Card             from '@/components/ui/Card/Card';
import Button           from '@/components/ui/Button/Button';
import Input            from '@/components/ui/Input/Input';
import Select           from '@/components/ui/Select/Select';
import Textarea         from '@/components/ui/Textarea/Textarea';
import { useAuthStore } from '@/store/authStore';
import { formatNaira }  from '@/utils/formatCurrency';

const DEPARTMENTS = [
  'ICT Department','Faculty of Engineering','Faculty of Sciences',
  'Library','Registry','Finance Department','Works and Maintenance',
  'Medical Centre','Student Affairs','Bursary',
];

const CATEGORIES = [
  'IT Equipment','Office Supplies','Furniture','Laboratory Materials',
  'Stationery','Cleaning Supplies','Medical Supplies',
  'Books & Journals','Electrical Items','Vehicles & Spare Parts',
];

const UNITS = [
  'units','bags','cartons','reams','litres','kg',
  'sets','pairs','bottles','lots','boxes',
];

const EMPTY_ITEM = { description: '', quantity: 1, unit: 'units', unitPrice: 0 };

export default function NewRequisitionPage() {
  const { token, user } = useAuthStore();
  const router          = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title:         '',
    department:    user?.department || '',
    category:      '',
    priority:      'medium',
    justification: '',
    requiredDate:  '',
    items:         [{ ...EMPTY_ITEM }],
  });

  const [errors, setErrors] = useState({});

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const setItem = (i, k) => (e) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((it, idx) =>
        idx === i ? { ...it, [k]: k === 'description' || k === 'unit' ? e.target.value : +e.target.value } : it
      ),
    }));

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }));

  const removeItem = (i) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  const totalAmount = form.items.reduce(
    (s, it) => s + (it.quantity || 0) * (it.unitPrice || 0), 0
  );

  const validateStep1 = () => {
    const e = {};
    if (!form.title.trim())         e.title         = 'Title is required';
    if (!form.category)             e.category       = 'Category is required';
    if (!form.justification.trim()) e.justification  = 'Justification is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    form.items.forEach((it, i) => {
      if (!it.description.trim()) e[`item_${i}_desc`]  = 'Required';
      if (it.unitPrice <= 0)      e[`item_${i}_price`] = 'Must be > 0';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (asDraft = false) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        '/api/requisitions',
        { ...form, totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reqId = data.data._id;

      if (!asDraft) {
        await axios.post(
          `/api/requisitions/${reqId}/submit`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Requisition submitted for approval!');
      } else {
        toast.success('Requisition saved as draft');
      }

      router.push('/requisitions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Basic Info', 'Line Items', 'Review & Submit'];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <i className="bi bi-arrow-left" /> Back
        </button>
        <div>
          <h2 className={styles.title}>New Procurement Requisition</h2>
          <p className={styles.sub}>Kaduna State University</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className={styles.steps}>
        {steps.map((s, i) => (
          <div key={i} className={styles.stepWrapper}>
            <div className={styles.stepItem}>
              <div
                className={[
                  styles.stepDot,
                  i + 1 < step  ? styles.done    : '',
                  i + 1 === step ? styles.active  : '',
                ].join(' ')}
              >
                {i + 1 < step
                  ? <i className="bi bi-check-lg" />
                  : i + 1
                }
              </div>
              <div
                className={[
                  styles.stepLabel,
                  i + 1 === step ? styles.activeLabel : '',
                ].join(' ')}
              >
                {s}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                className={styles.stepLine}
                style={{ background: i + 1 < step ? 'var(--accent)' : 'var(--border)' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 — Basic Info */}
      {step === 1 && (
        <Card className={styles.card}>
          <h5 className={styles.cardTitle}>Basic Information</h5>
          <div className={styles.grid2}>
            <div className={styles.colSpan2}>
              <Input
                label="Requisition Title *"
                value={form.title}
                onChange={set('title')}
                placeholder="e.g. Laptop Computers for ICT Lab"
                error={errors.title}
              />
            </div>
            <Select
              label="Department *"
              value={form.department}
              onChange={set('department')}
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
            <Select
              label="Category *"
              value={form.category}
              onChange={set('category')}
              error={errors.category}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
            <Select
              label="Priority"
              value={form.priority}
              onChange={set('priority')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
            <Input
              label="Required By Date"
              type="date"
              value={form.requiredDate}
              onChange={set('requiredDate')}
            />
            <div className={styles.colSpan2}>
              <Textarea
                label="Justification / Purpose *"
                value={form.justification}
                onChange={set('justification')}
                placeholder="Explain why this procurement is necessary..."
                error={errors.justification}
                style={{ minHeight: 100 }}
              />
            </div>
          </div>
          <div className={styles.stepActions}>
            <Button
              onClick={() => { if (validateStep1()) setStep(2); }}
              icon="bi-arrow-right"
            >
              Next: Line Items
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2 — Line Items */}
      {step === 2 && (
        <Card className={styles.card}>
          <h5 className={styles.cardTitle}>Line Items</h5>

          {form.items.map((item, i) => (
            <div key={i} className={styles.itemCard}>
              <div className={styles.itemHeader}>
                <span className={styles.itemNum}>Item {i + 1}</span>
                {form.items.length > 1 && (
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(i)}
                    type="button"
                  >
                    <i className="bi bi-trash" /> Remove
                  </button>
                )}
              </div>
              <div className={styles.grid4}>
                <div className={styles.colSpan2}>
                  <Input
                    label="Description *"
                    value={item.description}
                    onChange={setItem(i, 'description')}
                    placeholder="Item description"
                    error={errors[`item_${i}_desc`]}
                  />
                </div>
                <Input
                  label="Quantity"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={setItem(i, 'quantity')}
                />
                <Select
                  label="Unit"
                  value={item.unit}
                  onChange={setItem(i, 'unit')}
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </Select>
                <div className={styles.colSpan2}>
                  <Input
                    label="Unit Price (₦) *"
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={setItem(i, 'unitPrice')}
                    error={errors[`item_${i}_price`]}
                  />
                </div>
                <div className={styles.colSpan2}>
                  <div className={styles.subtotal}>
                    Subtotal:
                    <strong style={{ color: 'var(--accent)', marginLeft: 6 }}>
                      {formatNaira((item.quantity || 0) * (item.unitPrice || 0))}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button className={styles.addItemBtn} onClick={addItem} type="button">
            <i className="bi bi-plus-lg" /> Add Another Item
          </button>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total Amount:</span>
            <span className={styles.totalValue}>{formatNaira(totalAmount)}</span>
          </div>

          <div className={styles.stepActions}>
            <Button variant="ghost" onClick={() => setStep(1)} icon="bi-arrow-left">
              Back
            </Button>
            <Button
              onClick={() => { if (validateStep2()) setStep(3); }}
              icon="bi-arrow-right"
            >
              Next: Review
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3 — Review */}
      {step === 3 && (
        <Card className={styles.card}>
          <h5 className={styles.cardTitle}>Review & Submit</h5>

          {/* Summary */}
          <div className={styles.reviewGrid}>
            {[
              ['Title',       form.title],
              ['Department',  form.department],
              ['Category',    form.category],
              ['Priority',    form.priority.toUpperCase()],
              ['Required By', form.requiredDate || 'Not specified'],
              ['Total Amount',formatNaira(totalAmount)],
            ].map(([k, v]) => (
              <div key={k} className={styles.reviewItem}>
                <div className={styles.reviewKey}>{k}</div>
                <div
                  className={styles.reviewVal}
                  style={{ color: k === 'Total Amount' ? 'var(--accent)' : 'var(--text)' }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>

          {/* Justification */}
          <div className={styles.reviewSection}>
            <div className={styles.reviewKey}>Justification</div>
            <div className={styles.reviewJustification}>{form.justification}</div>
          </div>

          {/* Items table */}
          <div className={styles.reviewSection}>
            <div className={styles.reviewKey}>Line Items ({form.items.length})</div>
            <div className={styles.itemsReview}>
              {form.items.map((it, i) => (
                <div key={i} className={styles.itemReviewRow}>
                  <span className={styles.itemReviewDesc}>
                    {i + 1}. {it.description}
                  </span>
                  <span className={styles.itemReviewMeta}>
                    {it.quantity} {it.unit} × {formatNaira(it.unitPrice)}
                  </span>
                  <span className={styles.itemReviewTotal}>
                    {formatNaira((it.quantity || 0) * (it.unitPrice || 0))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className={styles.warning}>
            <i className="bi bi-exclamation-triangle" />
            By submitting, this requisition will be sent for HOD approval.
            Ensure all details are correct before proceeding.
          </div>

          <div className={styles.stepActions}>
            <Button variant="ghost" onClick={() => setStep(2)} icon="bi-arrow-left">
              Back
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleSubmit(true)}
              loading={loading}
              icon="bi-save"
            >
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              loading={loading}
              icon="bi-send"
            >
              Submit Requisition
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
