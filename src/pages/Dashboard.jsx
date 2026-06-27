import { useState, useCallback } from 'react';
import { useUsers } from '../hooks/useUsers';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import UserTable from '../components/UserTable';
import UserFormModal from '../components/UserFormModal';
import DeleteModal from '../components/DeleteModal';
import Footer from '../components/Footer';
import styles from './Dashboard.module.css';

function Dashboard() {
  const {
    users,
    filteredUsers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    addUser,
    editUser,
    removeUser,
  } = useUsers();

  // Which user is being edited (null = create mode)
  const [formTarget, setFormTarget]   = useState(null);
  const [formOpen, setFormOpen]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen]   = useState(false);

  const openCreate = useCallback(() => {
    setFormTarget(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((user) => {
    setFormTarget(user);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((user) => {
    setDeleteTarget(user);
    setDeleteOpen(true);
  }, []);

  // Called by UserFormModal on submit
  const handleFormSubmit = useCallback(async (data) => {
    if (formTarget) {
      return editUser(formTarget.id, data);
    }
    return addUser(data);
  }, [formTarget, editUser, addUser]);

  return (
    <div className={styles.layout}>
      <Navbar
        onAddUser={openCreate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Page heading */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>User Management</h1>
              <p className={styles.pageDesc}>Manage your team and user records</p>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              {error}
            </div>
          )}

          {/* Stats row */}
          <StatsCards users={users} loading={loading} />

          {/* User table */}
          <UserTable
            users={filteredUsers}
            loading={loading}
            searchQuery={searchQuery}
            onEdit={openEdit}
            onDelete={openDelete}
            onAddUser={openCreate}
          />
        </div>
      </main>

      <Footer />

      {/* Create / Edit modal */}
      <UserFormModal
        isOpen={formOpen}
        user={formTarget}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete confirmation */}
      <DeleteModal
        isOpen={deleteOpen}
        user={deleteTarget}
        onClose={() => setDeleteOpen(false)}
        onConfirm={removeUser}
      />
    </div>
  );
}

export default Dashboard;
