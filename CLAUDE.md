# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Application Portal - a React application for managing user applications with admin approval workflow. Uses Supabase for authentication, database, and file storage.

## Commands

```bash
# Development (from application-portal directory)
cd application-portal
npm install
npm run dev      # Start dev server at localhost:5173
npm run build    # Production build
npm run preview  # Preview production build

# From root directory (Vercel deployment uses these)
npm run install  # Runs npm install in application-portal
npm run build    # Runs npm run build in application-portal
```

## Architecture

### Data Flow
```
Supabase Auth → AuthContext → useAuth hook → Components
Supabase DB   → storage.js  → useApplications hook → Components
ThemeContext  → useTheme hook → Components (light/dark mode)
```

### Key Patterns

**Data Layer** (`src/services/storage.js`): All Supabase operations (auth, profiles, applications, file storage) go through this service. Components never import Supabase client directly.

**Auth Flow**: `AuthContext` wraps `storage.js` auth methods. Listens to `onAuthStateChange` for session sync. Admin detection via `is_admin` boolean in `profiles` table (not email matching).

**Application Status**: Three states defined in `src/constants/index.js` - `Pending`, `Approved`, `Rejected`. Users can CRUD their own applications; admins can view all and change status. RLS policies enforce this at database level.

**Route Protection**: `App.jsx` defines `UserRoute` (redirects admins to `/admin`) and `AdminRoute` (redirects non-admins to `/dashboard`). Both wrap content in `Layout` with `SearchProvider`.

**Routes:**
- `/login`, `/signup` - Auth pages (public)
- `/dashboard`, `/applications` - User pages (wrapped in `UserLayout`)
- `/admin`, `/admin/applications` - Admin pages (wrapped in `AdminLayout`)

**Theme System**: `ThemeContext` manages light/dark mode via `data-theme` attribute on document root. Persisted in localStorage.

### Component Organization
- `auth/` - Login, Signup with shared Auth.css
- `user/` - UserDashboard, ApplicationForm, ApplicationDetails with Dashboard.css
- `admin/` - AdminDashboard
- `shared/` - Layout, Navbar, Sidebar, Button, Input, StatusBadge, ThemeToggle, Toast, ConfirmDialog

### Hooks & Context
- `useAuth()` - Returns `{ user, profile, isAdmin, loading, login, logout, signup }`
- `useApplications()` - Returns `{ applications, loading, error, createApplication, updateApplication, deleteApplication, setStatus, refresh }`
- `useTheme()` - Returns `{ theme, toggleTheme, isDark }`
- `SearchContext` - Global search state shared across dashboard pages
- `ToastContext` - Toast notifications system

### Supabase Schema

**Tables:**
- `profiles` - extends auth.users with `first_name`, `last_name`, `is_admin`
- `applications` - user applications with all form fields and status

**Storage Bucket:** `application-files` - files uploaded with applications

**Key RLS patterns:**
- Users: `auth.uid() = user_id` for own data
- Admins: subquery checking `profiles.is_admin = TRUE`

**Triggers:**
- `handle_new_user()` - auto-creates profile on signup
- `update_updated_at()` - timestamp maintenance

### Environment Variables

Required in `application-portal/.env`:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Testing Attributes

All interactive elements have `data-testid` attributes. Pattern: `{context}-{element}-{id}` (e.g., `app-edit-btn-123`, `admin-app-row-456`).

## Deployment

Deployed to Vercel. Root `vercel.json` configures build to output to `application-portal/dist` with SPA rewrites.

## Supabase Operations

Use Supabase MCP tools for schema operations.

To create an admin user:
```sql
UPDATE profiles SET is_admin = TRUE WHERE email = 'admin@example.com';
```
