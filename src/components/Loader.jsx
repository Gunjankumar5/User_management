import styles from './Loader.module.css';

// Single skeleton row for the table
function SkeletonRow() {
  return (
    <tr className={styles.row}>
      <td><div className={`${styles.bone} ${styles.circle}`} /></td>
      <td><div className={`${styles.bone} ${styles.long}`} /></td>
      <td><div className={`${styles.bone} ${styles.medium}`} /></td>
      <td><div className={`${styles.bone} ${styles.medium}`} /></td>
      <td><div className={`${styles.bone} ${styles.short}`} /></td>
      <td><div className={styles.actions}><div className={`${styles.bone} ${styles.btn}`} /><div className={`${styles.bone} ${styles.btn}`} /></div></td>
    </tr>
  );
}

// Renders N skeleton rows inside a table tbody
function Loader({ rows = 8 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </>
  );
}

export default Loader;
