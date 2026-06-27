import { FiHeart } from 'react-icons/fi';
import styles from './Footer.module.css';
import { APP_NAME, APP_VERSION, DEVELOPER } from '../utils/constants';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.left}>
          {APP_NAME} {APP_VERSION}
        </span>
        <span className={styles.right}>
          {DEVELOPER}
        </span>
      </div>
    </footer>
  );
}

export default Footer;
