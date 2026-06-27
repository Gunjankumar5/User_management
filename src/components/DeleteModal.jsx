import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import Avatar from './Avatar';
import styles from './DeleteModal.module.css';

function DeleteModal({ isOpen, user, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => { if (isOpen) setDeleting(false); }, [isOpen]);

  const handleConfirm = async () => {
    setDeleting(true);
    const ok = await onConfirm(user.id);
    setDeleting(false);
    if (ok) onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Confirm delete">
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <FiX size={16} />
        </button>

        <div className={styles.iconWrap}>
          <FiAlertTriangle size={26} />
        </div>

        <h2 className={styles.title}>Delete user?</h2>

        <div className={styles.userPreview}>
          <Avatar name={user.name} size={42} />
          <div>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
        </div>

        <p className={styles.desc}>
          This action cannot be undone. The user and all associated data will be permanently removed.
        </p>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={deleting}>
            Cancel
          </button>
          <button className={styles.deleteBtn} onClick={handleConfirm} disabled={deleting}>
            {deleting ? <span className={styles.spinner} /> : null}
            {deleting ? 'Deleting…' : 'Delete user'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
