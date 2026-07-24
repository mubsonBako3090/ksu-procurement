import styles from './EmptyState.module.css';
import Button from '../../ui/Button/Button';

export default function EmptyState({
  icon    = 'bi-inbox',
    title,
      message,
        action,
          onAction,
            variant = 'primary',
            }) {
              return (
                  <div className={styles.wrapper}>
                        <i className={`bi ${icon} ${styles.icon}`} />
                              <h5 className={styles.title}>{title}</h5>
                                    {message && <p className={styles.message}>{message}</p>}
                                          {action && (
                                                  <Button onClick={onAction} variant={variant}>
                                                            {action}
                                                                    </Button>
                                                                          )}
                                                                              </div>
                                                                                );
                                                                                }