import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiChevronRight } from 'react-icons/fi';
import Avatar from './Avatar';
import { formatWebsite } from '../utils/helpers';
import styles from './UserRow.module.css';

function UserRow({ user, onEdit, onDelete }) {
  const navigate = useNavigate();
  const username = user.username ? `@${user.username}` : 'Not provided';
  const companyName = user.company?.name || 'Not provided';
  const phone = user.phone || 'Not provided';

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    onEdit(user);
  }, [user, onEdit]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(user);
  }, [user, onDelete]);

  const goToDetails = useCallback(() => {
    navigate(`/users/${user.id}`);
  }, [user.id, navigate]);

  return (
    <tr className={styles.row} onClick={goToDetails} tabIndex={0} onKeyDown={e => e.key === 'Enter' && goToDetails()}>
      <td className={styles.cell}>
        <Avatar name={user.name} size={38} />
      </td>
      <td className={styles.cell}>
        <span className={styles.name}>{user.name}</span>
        <span className={styles.username}>{username}</span>
      </td>
      <td className={styles.cell}>
        <a href={`mailto:${user.email}`} className={styles.link} onClick={e => e.stopPropagation()}>
          {user.email}
        </a>
      </td>
      <td className={styles.cell}>
        <span className={styles.text}>{phone}</span>
      </td>
      <td className={styles.cell}>
        <span className={styles.badge}>{companyName}</span>
      </td>
      <td className={styles.cell}>
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.edit}`}
            onClick={handleEdit}
            aria-label={`Edit ${user.name}`}
          >
            <FiEdit2 size={14} />
            <span>Edit</span>
          </button>
          <button
            className={`${styles.btn} ${styles.danger}`}
            onClick={handleDelete}
            aria-label={`Delete ${user.name}`}
          >
            <FiTrash2 size={14} />
            <span>Delete</span>
          </button>
          <FiChevronRight size={16} className={styles.arrow} />
        </div>
      </td>
    </tr>
  );
}

export default UserRow;
