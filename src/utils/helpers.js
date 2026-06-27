import { AVATAR_COLORS } from './constants';

// Get initials from full name (e.g. "John Doe" → "JD")
export function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');
}

// Pick a consistent avatar background color based on name
export function getAvatarColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '') || 'user';
}

function buildDisplayEmail(name = '', username = '', id = '') {
  const localPart = slugify(`${name}.${username || id}`);
  return `${localPart}@userbase.dev`;
}

function buildDisplayPhone(id = 0) {
  const normalizedId = String(id).padStart(4, '0');
  return `+1 (555) 010-${normalizedId}`;
}

// Normalize API users while preserving the contact data returned by the API.
export function normalizeUser(user = {}) {
  return {
    ...user,
    email: user.email || buildDisplayEmail(user.name, user.username, user.id),
    phone: user.phone || buildDisplayPhone(user.id),
  };
}

// Normalize a list of API users.
export function normalizeUsers(users = []) {
  return users.map(normalizeUser);
}

// Basic email validation
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Basic phone validation for common user-facing formats, including extensions.
export function isValidPhone(phone) {
  return /^\+?[\d\s\-().]{7,32}(?:\s?(?:x|ext\.?|#)\s?\d{1,6})?$/i.test(phone);
}

// Basic URL validation
export function isValidUrl(url) {
  try {
    // Allow bare domains like "hildegard.org"
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

// Validate the user form fields and return an errors object
export function validateUserForm({ name, email, phone, website }) {
  const errors = {};
  if (!name?.trim()) errors.name = 'Name is required';
  else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters';

  if (!email?.trim()) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';

  if (!phone?.trim()) errors.phone = 'Phone is required';
  else if (!isValidPhone(phone)) errors.phone = 'Enter a valid phone number, such as 1-770-736-8031 x56442';

  if (!website?.trim()) errors.website = 'Website is required';
  else if (!isValidUrl(website)) errors.website = 'Enter a valid URL (e.g. example.com)';

  return errors;
}

// Format a website URL for display (strip https://)
export function formatWebsite(url = '') {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

// Derive unique city names from users array
export function getCities(users) {
  return [...new Set(users.map(u => u.address?.city).filter(Boolean))];
}

// Derive unique company names from users array
export function getCompanies(users) {
  return [...new Set(users.map(u => u.company?.name).filter(Boolean))];
}
