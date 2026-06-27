import axios from 'axios';
import { normalizeUser, normalizeUsers } from '../utils/helpers';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Shared axios instance with base config
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Fetch all users
export async function getUsers() {
  const response = await client.get('/users');
  return normalizeUsers(response.data);
}

// Fetch a single user by ID
export async function getUserById(id) {
  const response = await client.get(`/users/${id}`);
  return normalizeUser(response.data);
}

// Create a new user (JSONPlaceholder simulates this)
export async function createUser(userData) {
  const response = await client.post('/users', userData);
  return normalizeUser(response.data);
}

// Update an existing user
export async function updateUser(id, userData) {
  const response = await client.put(`/users/${id}`, userData);
  return normalizeUser(response.data);
}

// Delete a user
export async function deleteUser(id) {
  const response = await client.delete(`/users/${id}`);
  return response.data;
}
