import { useNavigate } from 'react-router-dom';
import { FiCompass } from 'react-icons/fi';
import styles from './NotFound.module.css';
import { APP_NAME } from '../utils/constants';

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.iconWrap}>
          <FiCompass size={40} />
        </div>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.desc}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button className={styles.homeBtn} onClick={() => navigate('/')}>
          Back to {APP_NAME}
        </button>
      </div>
    </div>
  );
}

export default NotFound;
