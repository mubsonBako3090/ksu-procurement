import styles from './BudgetBar.module.css';
import { formatNaira } from '@/utils/formatCurrency';

export default function BudgetBar({ label, allocated, spent, committed }) {
  const total    = spent + committed;
    const pct      = allocated ? Math.min(Math.round((total / allocated) * 100), 100) : 0;
      const spentPct = allocated ? Math.min(Math.round((spent  / allocated) * 100), 100) : 0;
        const color    = pct > 90 ? 'var(--red)' : pct > 70 ? 'var(--gold)' : 'var(--accent)';

          return (
              <div className={styles.wrapper}>
                    <div className={styles.header}>
                            <span className={styles.label}>{label}</span>
                                    <span className={styles.pct} style={{ color }}>{pct}%</span>
                                          </div>
                                                <div className={styles.track}>
                                                        <div className={styles.committed} style={{ width: `${pct}%`,      background: color + '44' }} />
                                                                <div className={styles.spent}     style={{ width: `${spentPct}%`, background: color        }} />
                                                                      </div>
                                                                            <div className={styles.legend}>
                                                                                    <span>Spent: <strong>{formatNaira(spent)}</strong></span>
                                                                                            <span>of {formatNaira(allocated)}</span>
                                                                                                  </div>
                                                                                                      </div>
                                                                                                        );
                                                                                                        }