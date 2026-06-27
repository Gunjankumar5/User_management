# UserBase — User Management Application

A production-ready CRUD User Management dashboard built with React + Vite and the JSONPlaceholder API.

## Features
- Full CRUD (Create, Read, Update, Delete) with JSONPlaceholder API
- Modern SaaS dashboard UI with statistics cards
- Instant client-side search (name, email, company)
- Skeleton loaders for loading states
- Toast notifications for every action (React Toastify)
- Optimistic updates with automatic rollback on failure
- Professional delete confirmation modal
- User details profile page
- React Router with /, /users/:id, and 404 route
- Responsive — desktop table collapses to stacked cards on mobile
- Graceful error handling

## Tech Stack
- React 18 + Vite
- React Router DOM
- Axios
- React Toastify
- React Icons (Feather set)
- CSS Modules

API: https://jsonplaceholder.typicode.com/users

## Getting Started

```bash
git clone https://github.com/your-username/user-management.git
cd user-management
npm install
npm run dev
# Open http://localhost:5173
```

## Folder Structure
```
src/
├── components/   # Navbar, Footer, UserTable, UserRow, UserFormModal, DeleteModal, etc.
├── hooks/        # useUsers.js
├── pages/        # Dashboard, UserDetails, NotFound
├── services/     # api.js
├── styles/       # global.css
└── utils/        # constants.js, helpers.js
```

## Deployment

### Vercel
```bash
npm install -g vercel && vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```
