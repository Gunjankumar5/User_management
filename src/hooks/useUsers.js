import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getUsers()
      .then(data => {
        if (!cancelled) setUsers(data);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to load users. Please check your connection.');
          toast.error('Could not fetch users.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(u =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.company?.name?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const addUser = useCallback(async (userData) => {
    try {
      const created = await createUser(userData);
      setUsers(prev => [created, ...prev]);
      toast.success('User created successfully');
      return true;
    } catch {
      toast.error('Something went wrong. Could not create user.');
      return false;
    }
  }, []);

  const editUser = useCallback(async (id, userData) => {
    try {
      const savedUser = await updateUser(id, userData);
      setUsers(prev => prev.map(user => String(user.id) === String(id) ? savedUser : user));
      toast.success('User updated');
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong. Could not update user.');
      return false;
    }
  }, []);

  const removeUser = useCallback(async (id) => {
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(user => String(user.id) !== String(id)));
      toast.success('User deleted');
      return true;
    } catch {
      toast.error('Something went wrong. Could not delete user.');
      return false;
    }
  }, []);

  return {
    users,
    filteredUsers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    addUser,
    editUser,
    removeUser,
  };
}
