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
      .catch(err => {
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
    const tempId = Date.now();
    const optimistic = { ...userData, id: tempId, _pending: true, _local: true };
    setUsers(prev => [optimistic, ...prev]);

    try {
      const created = await createUser(userData);
      setUsers(prev => prev.map(u => u.id === tempId ? { ...created, id: tempId, _local: true } : u));
      toast.success('User created successfully');
      return true;
    } catch {
      setUsers(prev => prev.filter(u => u.id !== tempId));
      toast.error('Something went wrong. Could not create user.');
      return false;
    }
  }, []);

  const editUser = useCallback(async (id, userData) => {
    const currentUser = users.find(user => user.id === id);

    if (currentUser?._local) {
      setUsers(prev => prev.map(user => user.id === id ? { ...user, ...userData, _local: true } : user));
      toast.success('User updated');
      return true;
    }

    let previousUsers = null;
    let updatedUser = null;

    setUsers(prev => {
      previousUsers = prev;
      const currentUser = prev.find(user => user.id === id);
      if (!currentUser) return prev;

      updatedUser = { ...currentUser, ...userData };
      return prev.map(user => user.id === id ? updatedUser : user);
    });

    try {
      const savedUser = await updateUser(id, updatedUser ?? userData);
      setUsers(prev => prev.map(user => user.id === id ? { ...user, ...savedUser } : user));
      toast.success('User updated');
      return true;
    } catch (error) {
      if (previousUsers) {
        setUsers(previousUsers);
      }
      toast.error(error?.response?.data?.message || 'Something went wrong. Could not update user.');
      return false;
    }
  }, [users]);

  const removeUser = useCallback(async (id) => {
    const currentUser = users.find(user => user.id === id);

    if (currentUser?._local) {
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('User deleted');
      return true;
    }

    let previousUsers = null;
    setUsers(prev => {
      previousUsers = prev;
      return prev.filter(u => u.id !== id);
    });

    try {
      await deleteUser(id);
      toast.success('User deleted');
      return true;
    } catch {
      if (previousUsers) {
        setUsers(previousUsers);
      }
      toast.error('Something went wrong. Could not delete user.');
      return false;
    }
  }, [users]);

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
