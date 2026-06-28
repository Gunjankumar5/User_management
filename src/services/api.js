import axios from 'axios';
import { normalizeUser, normalizeUsers } from '../utils/helpers';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const STORAGE_KEY = 'userbase.users';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

function readStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? normalizeUsers(parsed) : null;
  } catch {
    return null;
  }
}

function writeStoredUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore storage failures and keep the in-memory result.
  }
}

function sortUsers(users) {
  return [...users].sort((left, right) => Number(right.id) - Number(left.id));
}

function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildUsername(name = '', id = '') {
  return slugify(name) || `user-${id}`;
}

function buildCompany(name = '') {
  const baseName = name.trim().split(/\s+/)[0] || 'User';

  return {
    name: `${baseName} Team`,
    catchPhrase: `${baseName} focused collaboration`,
    bs: 'user management',
  };
}

function buildAddress(name = '', id = '') {
  const slug = slugify(name) || `user-${id}`;

  return {
    street: `${slug} street`,
    suite: `Suite ${String(id).padStart(3, '0')}`,
    city: 'Remote',
    zipcode: String(10000 + (Number(id) % 90000 || 0)),
    geo: {
      lat: '0.0000',
      lng: '0.0000',
    },
  };
}

async function fetchSeedUsers() {
  const response = await client.get('/users');
  return normalizeUsers(response.data);
}

async function loadUsers() {
  const storedUsers = readStoredUsers();
  if (storedUsers) return storedUsers;

  try {
    const seedUsers = await fetchSeedUsers();
    writeStoredUsers(seedUsers);
    return seedUsers;
  } catch {
    writeStoredUsers([]);
    return [];
  }
}

function toNumericId(id) {
  const numericId = Number(id);
  return Number.isFinite(numericId) ? numericId : id;
}

function nextUserId(users) {
  const maxId = users.reduce((max, user) => {
    const numericId = Number(user.id);
    return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
  }, 0);

  return maxId + 1;
}

export async function getUsers() {
  return sortUsers(await loadUsers());
}

export async function getUserById(id) {
  const users = await getUsers();
  const user = users.find(entry => String(entry.id) === String(id));

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function createUser(userData) {
  const users = await loadUsers();
  const nextId = nextUserId(users);
  const createdUser = normalizeUser({
    ...userData,
    id: nextId,
    username: userData.username || buildUsername(userData.name, nextId),
    company: userData.company || buildCompany(userData.name),
    address: userData.address || buildAddress(userData.name, nextId),
  });

  const nextUsers = sortUsers([createdUser, ...users]);
  writeStoredUsers(nextUsers);
  return createdUser;
}

export async function updateUser(id, userData) {
  const users = await loadUsers();
  let updatedUser = null;

  const nextUsers = users.map(user => {
    if (String(user.id) !== String(id)) return user;
    updatedUser = normalizeUser({
      ...user,
      ...userData,
      id: toNumericId(user.id),
    });
    return updatedUser;
  });

  if (!updatedUser) {
    throw new Error('User not found');
  }

  writeStoredUsers(nextUsers);
  return updatedUser;
}

export async function deleteUser(id) {
  const users = await loadUsers();
  const nextUsers = users.filter(user => String(user.id) !== String(id));

  if (nextUsers.length === users.length) {
    throw new Error('User not found');
  }

  writeStoredUsers(nextUsers);
  return { id };
}
