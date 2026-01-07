# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Application Portal - a React application for managing user applications with admin approval workflow. Currently uses localStorage for data persistence, with architecture designed for Supabase migration.

## Commands

```bash
# Development (from application-portal directory)
cd application-portal
npm install
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## Architecture

### Data Flow
```
AuthContext (user state) → useAuth hook → Components
storage.js (data layer) → useApplications hook → Components
```

### Key Patterns

**Data Layer Abstraction** (`src/services/storage.js`): All data operations go through this service. Currently localStorage-backed with async API designed for Supabase swap. Never access localStorage directly from components.

**Auth Flow**: `AuthContext` manages user state. Admin detection via email match (`admin@example.com`) or `isAdmin` flag. Protected routes in `App.jsx` redirect based on auth state and admin status.

**Application Status**: Three states - `Pending`, `Approved`, `Rejected`. Users can CRUD their own applications; admins can view all and change status.

### Component Organization
- `auth/` - Login, Signup
- `user/` - UserDashboard, ApplicationForm, ApplicationDetails
- `admin/` - AdminDashboard
- `shared/` - Button, Input, StatusBadge (reusable primitives)

### Testing Attributes
All interactive elements have `data-testid` attributes for automation testing. Pattern: `{context}-{element}-{id}` (e.g., `app-edit-btn-123`, `admin-app-row-456`).

## Supabase Migration

Reference `supabase-integration-prompt.md` for full migration guide including:
- Database schema (profiles, applications tables)
- RLS policies for user/admin access control
- Auth integration replacing localStorage
- Use Supabase MCP tools for schema operations

## Constants

Admin credentials: `admin@example.com` / `1234567890` (defined in `src/constants/index.js`)
