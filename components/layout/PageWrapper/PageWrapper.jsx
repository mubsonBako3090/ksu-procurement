import styles  from './PageWrapper.module.css';
import Sidebar from '../Sidebar/Sidebar';
import Topbar  from '../Topbar/Topbar';

export default function PageWrapper({ children }) {
  return (
      <div className={styles.wrapper}>
            <Sidebar />
                  <div className={styles.main}>
                          <Topbar />
                                  <div className={styles.content}>
                                            {children}
                                                    </div>
                                                          </div>
                                                              </div>
                                                                );
                                                                }