import { FiSearch, FiX } from 'react-icons/fi';
import styles from './SearchBar.module.css';

function SearchBar({ value, onChange }) {
  return (
    <div className={styles.wrap}>
      <FiSearch className={styles.icon} size={15} />
      <input
        type="text"
        className={styles.input}
        placeholder="Search by name, email, or company…"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button
          className={styles.clear}
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <FiX size={14} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
