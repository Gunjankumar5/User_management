import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft, FiMail, FiPhone, FiGlobe, FiBriefcase,
  FiMapPin, FiUser, FiAlertCircle
} from 'react-icons/fi';
import { getUserById } from '../services/api';
import Avatar from '../components/Avatar';
import Footer from '../components/Footer';
import { formatWebsite } from '../utils/helpers';
import { APP_NAME } from '../utils/constants';
import styles from './UserDetails.module.css';

function openMailClient(email) {
  if (!email) return;
  window.location.href = `mailto:${email}`;
}

function UserDetails() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getUserById(id)
      .then(data => { if (!cancelled) setUser(data); })
      .catch(() => { if (!cancelled) setError('User not found or failed to load.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <DetailsLoader />;
  if (error)   return <DetailsError message={error} onBack={() => navigate('/')} />;

  const username = user.username ? `@${user.username}` : 'Not provided';
  const companyName = user.company?.name || 'Not provided';
  const catchPhrase = user.company?.catchPhrase || 'Not provided';
  const business = user.company?.bs || 'Not provided';
  const street = [user.address?.street, user.address?.suite].filter(Boolean).join(', ') || 'Not provided';
  const city = [user.address?.city, user.address?.zipcode].filter(Boolean).join(', ') || 'Not provided';
  const geo = [user.address?.geo?.lat, user.address?.geo?.lng].filter(Boolean).join(', ') || 'Not provided';
  const website = user.website ? formatWebsite(user.website) : '';

  return (
    <div className={styles.layout}>
      {/* Minimal nav */}
      <header className={styles.topBar}>
        <div className={styles.topInner}>
          <Link to="/" className={styles.logoLink}>{APP_NAME}</Link>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <FiArrowLeft size={15} />
            Back to dashboard
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Profile hero */}
          <div className={styles.hero}>
            <div className={styles.heroLeft}>
              <Avatar name={user.name} size={76} />
              <div>
                <h1 className={styles.name}>{user.name}</h1>
                <p className={styles.username}>{username}</p>
                <span className={styles.companyBadge}>{companyName}</span>
              </div>
            </div>
            <div className={styles.heroRight}>
              <button type="button" className={styles.contactBtn} onClick={() => openMailClient(user.email)}>
                <FiMail size={15} /> Send email
              </button>
            </div>
          </div>

          {/* Detail cards */}
          <div className={styles.grid}>
            <InfoCard title="Contact" icon={FiMail}>
              <DetailRow icon={FiMail}  label="Email"   value={<button type="button" className={styles.linkButton} onClick={() => openMailClient(user.email)}>{user.email}</button>} />
              <DetailRow icon={FiPhone} label="Phone"   value={user.phone || 'Not provided'} />
              <DetailRow icon={FiGlobe} label="Website" value={
                website ? (
                  <a href={`https://${website}`} target="_blank" rel="noreferrer" className={styles.link}>
                    {website}
                  </a>
                ) : (
                  'Not provided'
                )
              } />
            </InfoCard>

            <InfoCard title="Company" icon={FiBriefcase}>
              <DetailRow icon={FiBriefcase} label="Name"        value={companyName} />
              <DetailRow icon={FiUser}      label="Catchphrase" value={catchPhrase} />
              <DetailRow icon={FiBriefcase} label="Business"    value={business} />
            </InfoCard>

            <InfoCard title="Address" icon={FiMapPin}>
              <DetailRow icon={FiMapPin} label="Street"  value={street} />
              <DetailRow icon={FiMapPin} label="City"    value={city} />
              <DetailRow icon={FiGlobe} label="Geo"      value={geo} />
            </InfoCard>

            <InfoCard title="Account" icon={FiUser}>
              <DetailRow icon={FiUser}  label="User ID"  value={`#${user.id}`} />
              <DetailRow icon={FiUser}  label="Username" value={username} />
            </InfoCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Sub-components

function InfoCard({ title, icon: Icon, children }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Icon size={15} />
        <span>{title}</span>
      </div>
      <div className={styles.cardBody}>{children}</div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className={styles.detailRow}>
      <div className={styles.detailLabel}>
        <Icon size={13} />
        <span>{label}</span>
      </div>
      <div className={styles.detailValue}>{value}</div>
    </div>
  );
}

function DetailsLoader() {
  return (
    <div className={styles.layout}>
      <div className={styles.loaderWrap}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.skeletonCard} />
        ))}
      </div>
    </div>
  );
}

function DetailsError({ message, onBack }) {
  return (
    <div className={styles.layout}>
      <div className={styles.errorWrap}>
        <FiAlertCircle size={40} />
        <h2>Something went wrong</h2>
        <p>{message}</p>
        <button className={styles.backBtn2} onClick={onBack}>Go back</button>
      </div>
    </div>
  );
}

export default UserDetails;
