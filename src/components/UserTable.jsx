import { useNavigate } from 'react-router-dom';
import UserRow from './UserRow';
import Loader from './Loader';
import EmptyState from './EmptyState';
import { getInitials, getAvatarColor } from '../utils/helpers';
import styles from './UserTable.module.css';

function UserTable({ users, loading, searchQuery, onEdit, onDelete, onAddUser }) {
  return (
    <div className={styles.tableWrap}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>All Users</h2>
          {!loading && (
            <span className={styles.count}>
              {users.length} {users.length === 1 ? 'user' : 'users'}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
          )}
        </div>
      </div>

      {/* Desktop table */}
      <div className={styles.overflow}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Avatar</th>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Phone</th>
              <th className={styles.th}>Company</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <Loader rows={8} />
            ) : users.length === 0 ? (
              <EmptyState query={searchQuery} onAddUser={onAddUser} />
            ) : (
              users.map(user => (
                <UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className={styles.cardList}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.cardSkeleton} />
          ))
        ) : users.length === 0 ? (
          <div className={styles.mobileEmpty}>
            <p>{searchQuery ? `No results for "${searchQuery}"` : 'No users yet'}</p>
            {!searchQuery && (
              <button className={styles.addCta} onClick={onAddUser}>Add user</button>
            )}
          </div>
        ) : (
          users.map(user => (
            <MobileCard key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}

// Card displayed on small screens
function MobileCard({ user, onEdit, onDelete }) {
  const navigate = useNavigate();
  return (
    <div className={styles.card} onClick={() => navigate(`/users/${user.id}`)}>
      <div className={styles.cardTop}>
        <div
          className={styles.cardAvatar}
          style={{ background: getAvatarColor(user.name) }}
        >
          {getInitials(user.name)}
        </div>
        <div>
          <div className={styles.cardName}>{user.name}</div>
          <div className={styles.cardSub}>{user.email}</div>
        </div>
      </div>
      <div className={styles.cardMeta}>
        <span>{user.phone}</span>
        <span className={styles.cardCompany}>{user.company?.name}</span>
      </div>
      <div className={styles.cardActions}>
        <button
          className={styles.cardEdit}
          onClick={e => { e.stopPropagation(); onEdit(user); }}
        >
          Edit
        </button>
        <button
          className={styles.cardDelete}
          onClick={e => { e.stopPropagation(); onDelete(user); }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default UserTable;
