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
```

## Architecture

### Data Flow
```
Supabase Auth → AuthContext → useAuth hook → Components
Supabase DB   → storage.js  → useApplications hook → Components
```

### Key Patterns

**Data Layer** (`src/services/storage.js`): All Supabase operations (auth, profiles, applications, file storage) go through this service. Components never import Supabase client directly.

**Auth Flow**: `AuthContext` wraps `storage.js` auth methods. Listens to `onAuthStateChange` for session sync. Admin detection via `is_admin` boolean in `profiles` table (not email matching).

**Application Status**: Three states - `Pending`, `Approved`, `Rejected`. Users can CRUD their own applications; admins can view all and change status. RLS policies enforce this at database level.

### Component Organization
- `auth/` - Login, Signup
- `user/` - UserDashboard, ApplicationForm, ApplicationDetails
- `admin/` - AdminDashboard
- `shared/` - Button, Input, StatusBadge (reusable primitives)

### Supabase Schema

**Tables:**
- `profiles` - extends auth.users with `first_name`, `last_name`, `is_admin`
- `applications` - user applications with all form fields and status

**Key RLS patterns:**
- Users: `auth.uid() = user_id` for own data
- Admins: subquery checking `profiles.is_admin = TRUE`

**Triggers:**
- `handle_new_user()` - auto-creates profile on signup
- `update_updated_at()` - timestamp maintenance

### Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Testing Attributes

All interactive elements have `data-testid` attributes. Pattern: `{context}-{element}-{id}` (e.g., `app-edit-btn-123`, `admin-app-row-456`).

## Supabase Operations

Use Supabase MCP tools for schema operations. Reference `supabase-integration-prompt.md` for full migration guide including database schema, RLS policies, and triggers.

To create an admin user:
```sql
UPDATE profiles SET is_admin = TRUE WHERE email = 'admin@example.com';
```
