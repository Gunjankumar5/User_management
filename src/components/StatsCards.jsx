import { FiUsers, FiBriefcase, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { useMemo } from 'react';
import { getCities, getCompanies } from '../utils/helpers';
import styles from './StatsCards.module.css';

function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div className={styles.card} style={{ '--accent': color }}>
      <div className={styles.iconWrap}>
        <Icon size={20} />
      </div>
      <div className={styles.content}>
        {loading ? (
          <div className={styles.skeleton} />
        ) : (
          <span className={styles.value}>{value}</span>
        )}
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}

function StatsCards({ users, loading }) {
  const companies = useMemo(() => getCompanies(users).length, [users]);
  const cities    = useMemo(() => getCities(users).length, [users]);

  const stats = [
    { icon: FiUsers,       label: 'Total Users',     value: users.length, color: '#3b5bdb' },
    { icon: FiBriefcase,   label: 'Companies',       value: companies,    color: '#0ca678' },
    { icon: FiMapPin,      label: 'Cities',          value: cities,       color: '#e67700' },
    { icon: FiCheckCircle, label: 'Active Records',  value: users.length, color: '#2f9e44' },
  ];

  return (
    <div className={styles.grid}>
      {stats.map(stat => (
        <StatCard key={stat.label} {...stat} loading={loading} />
      ))}
    </div>
  );
}

export default StatsCards;
