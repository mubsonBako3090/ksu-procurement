import styles from './PriorityTag.module.css';
import { priorityMeta } from '@/utils/statusHelpers';

export default function PriorityTag({ priority }) {
  const meta = priorityMeta(priority);
    return (
        <span className={`${styles.tag} ${styles[meta.color]}`}>
              {meta.label}
                  </span>
                    );
                    }