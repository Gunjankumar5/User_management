import { Link } from 'react-router-dom';
import { FiUsers, FiUserPlus } from 'react-icons/fi';
import SearchBar from './SearchBar';
import styles from './Navbar.module.css';
import { APP_NAME } from '../utils/constants';

function Navbar({ onAddUser, searchQuery, onSearchChange }) {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        {/* Logo + title */}
        <Link to="/" className={styles.brand}>
          <span className={styles.logoIcon}>
            <FiUsers size={20} />
          </span>
          <span className={styles.logoText}>{APP_NAME}</span>
        </Link>

        {/* Search */}
        <div className={styles.searchWrap}>
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        {/* Add user CTA */}
        <button className={styles.addBtn} onClick={onAddUser}>
          <FiUserPlus size={16} />
          <span>Add User</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
