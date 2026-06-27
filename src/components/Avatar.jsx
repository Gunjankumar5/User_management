import { getInitials, getAvatarColor } from '../utils/helpers';
import styles from './Avatar.module.css';

function Avatar({ name = '', size = 38 }) {
  const initials = getInitials(name);
  const bg       = getAvatarColor(name);

  return (
    <div
      className={styles.avatar}
      style={{ width: size, height: size, background: bg, fontSize: size * 0.36 }}
      title={name}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
}

export default Avatar;
