import { useState, useEffect, useCallback } from 'react';
import { FiX } from 'react-icons/fi';
import { validateUserForm } from '../utils/helpers';
import styles from './UserFormModal.module.css';

const EMPTY_FORM = { name: '', email: '', phone: '', website: '' };

function UserFormModal({ isOpen, user, onClose, onSubmit }) {
  const isEditing = Boolean(user);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name:    user.name    ?? '',
        email:   user.email   ?? '',
        phone:   user.phone   ?? '',
        website: user.website ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [user, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const validationErrors = validateUserForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    const ok = await onSubmit(form);
    setSaving(false);
    if (ok) onClose();
  }, [form, onSubmit, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={isEditing ? 'Edit user' : 'Add user'}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEditing ? 'Edit user' : 'Add new user'}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close modal">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.body}>
            <Field
              label="Full name"
              name="name"
              type="text"
              placeholder="Jane Doe"
              value={form.name}
              error={errors.name}
              onChange={handleChange}
              autoFocus
            />
            <Field
              label="Email address"
              name="email"
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              error={errors.email}
              onChange={handleChange}
            />
            <Field
              label="Phone number"
              name="phone"
              type="tel"
              placeholder="+1 555 000 0000"
              value={form.phone}
              error={errors.phone}
              onChange={handleChange}
            />
            <Field
              label="Website"
              name="website"
              type="text"
              placeholder="example.com"
              value={form.website}
              error={errors.website}
              onChange={handleChange}
            />
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={saving}>
              {saving ? <span className={styles.spinner} /> : null}
              {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create user'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, type, placeholder, value, error, onChange, autoFocus }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        autoFocus={autoFocus}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default UserFormModal;
