import { FiUsers } from 'react-icons/fi';
import styles from './EmptyState.module.css';

function EmptyState({ query, onAddUser }) {
  const isSearch = Boolean(query);

  return (
    <tr>
      <td colSpan={6}>
        <div className={styles.wrap}>
          <div className={styles.illustration}>
            <FiUsers size={40} />
          </div>
          <h3 className={styles.title}>
            {isSearch ? 'No results found' : 'No users yet'}
          </h3>
          <p className={styles.desc}>
            {isSearch
              ? `No users match "${query}". Try a different name, email, or company.`
              : 'Get started by adding your first user to the system.'}
          </p>
          {!isSearch && (
            <button className={styles.cta} onClick={onAddUser}>
              Add your first user
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default EmptyState;
