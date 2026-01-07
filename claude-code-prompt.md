# React Migration Prompt for Claude Code

## Project Overview

Migrate the attached HTML prototype (`index.html`) to a production-ready React application. This is an **Application Portal** with user signup, login, application CRUD operations, and admin approval workflow.

## Goals

1. **Preserve all functionality** from the HTML prototype exactly
2. **Maintain testability** - add `data-testid` attributes to all interactive elements
3. **Keep it deterministic** - same inputs should produce same outputs (for automation testing)
4. **Prepare for Supabase** - abstract data layer so localStorage can be swapped for Supabase later

---

## Folder Structure

Create the following structure:

```
application-portal/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── index.js
│   │   ├── user/
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── ApplicationForm.jsx
│   │   │   ├── ApplicationDetails.jsx
│   │   │   ├── ApplicationTable.jsx
│   │   │   └── index.js
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminTable.jsx
│   │   │   └── index.js
│   │   └── shared/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── StatusBadge.jsx
│   │       └── index.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useApplications.js
│   ├── services/
│   │   └── storage.js          # localStorage abstraction (will become Supabase)
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── constants/
│   │   └── index.js
│   ├── styles/
│   │   └── index.css           # Global styles matching the HTML prototype
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

---

## Technical Requirements

### 1. Framework & Tools
- Use **Vite** as the build tool (not Create React App)
- Use **React 18+** with functional components and hooks
- No external UI libraries (keep vanilla CSS matching the prototype)
- No TypeScript (plain JavaScript for simplicity)

### 2. State Management
- Use **React Context** for auth state (AuthContext)
- Use **useState/useEffect** for local component state
- No Redux or other state libraries

### 3. Data Layer Abstraction (`src/services/storage.js`)
Create a storage service that mirrors the localStorage API but can be swapped for Supabase later:

```javascript
// src/services/storage.js
export const storage = {
  // Users
  getUsers: async () => { /* ... */ },
  createUser: async (user) => { /* ... */ },
  
  // Applications
  getApplications: async (userId = null) => { /* ... */ },
  createApplication: async (app) => { /* ... */ },
  updateApplication: async (id, updates) => { /* ... */ },
  deleteApplication: async (id) => { /* ... */ },
  
  // Auth
  getCurrentUser: async () => { /* ... */ },
  setCurrentUser: async (user) => { /* ... */ },
  clearSession: async () => { /* ... */ },
};
```

### 4. Constants (`src/constants/index.js`)
```javascript
export const ADMIN_EMAIL = 'admin@example.com';
export const ADMIN_PASS = '1234567890';

export const STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};
```

### 5. Test IDs (Critical for Automation)
Add `data-testid` attributes to ALL interactive elements. Use this naming convention:

**Auth:**
- `login-section`, `login-email`, `login-password`, `login-submit`
- `signup-section`, `signup-firstname`, `signup-lastname`, `signup-email`, `signup-password`, `signup-submit`, `signup-back`

**User Dashboard:**
- `user-dashboard`, `user-logout`, `new-application-btn`
- `user-apps-table`, `app-row-{id}`
- `app-details-btn-{id}`, `app-edit-btn-{id}`, `app-delete-btn-{id}`

**Application Form:**
- `application-form`
- `app-title`, `app-email`, `app-password`, `app-phone`, `app-website`
- `app-number`, `app-range`, `app-date`, `app-time`, `app-datetime`
- `app-color`, `app-file`, `app-category`, `app-checkbox`, `app-description`
- `app-submit`, `app-cancel`

**Application Details:**
- `application-details`, `details-title`, `details-email`, `details-status`, `details-close`

**Admin Dashboard:**
- `admin-dashboard`, `admin-logout`, `admin-apps-table`
- `admin-app-row-{id}`, `approve-btn-{id}`, `reject-btn-{id}`

---

## Component Specifications

### Login.jsx
- Fields: email, password
- Validation: Check against stored users OR admin credentials
- On success: Set current user in context, navigate to appropriate dashboard
- Show error message for invalid credentials

### Signup.jsx
- Fields: firstName, lastName, email, password
- Validation: Password minimum 6 characters
- On success: Save user, redirect to login

### ApplicationForm.jsx
Must include ALL these input types (matching the HTML prototype):
- `text` (Title)
- `email` (Email)
- `password` (Password)
- `tel` (Phone)
- `url` (Website)
- `number` (Number)
- `range` (Range slider)
- `date` (Date)
- `time` (Time)
- `datetime-local` (Date & Time)
- `color` (Color picker)
- `file` (File upload)
- `select` (Category dropdown with options A, B)
- `checkbox` (Accept Terms)
- `textarea` (Description)

Form should support both **create** and **edit** modes.

### StatusBadge.jsx
Display status with appropriate colors:
- Pending: yellow background (#fef3c7), brown text (#92400e)
- Approved: green background (#dcfce7), green text (#166534)
- Rejected: red background (#fee2e2), red text (#991b1b)

---

## Styling Requirements

Keep the exact same visual design from the HTML prototype:
- CSS variables for colors (--primary, --bg, --card, --border, --text, --muted, --success, --danger, --warning)
- Same border-radius values (14px for cards, 8px for inputs)
- Same box-shadow for cards
- Same grid layout for form (2 columns)
- Same table styling
- Same auth card styling (max-width: 420px, centered)

---

## Application Data Structure

```javascript
{
  id: Date.now(),           // Unique identifier
  user: 'user@email.com',   // Owner's email
  title: 'Application Title',
  email: 'contact@email.com',
  password: '',             // Optional fields below
  phone: '',
  website: '',
  number: 0,
  range: 50,
  date: '',
  time: '',
  datetime: '',
  color: '#000000',
  file: null,
  category: 'A',
  termsAccepted: false,
  description: '',
  status: 'Pending'         // Pending | Approved | Rejected
}
```

---

## User Flow

1. **New User**: Signup → Login → User Dashboard → Create/Edit/Delete Applications
2. **Existing User**: Login → User Dashboard → View/Manage Applications
3. **Admin**: Login (admin@example.com / 1234567890) → Admin Dashboard → Approve/Reject Applications

---

## Verification Checklist

After migration, verify:
- [ ] User can sign up with validation (password min 6 chars)
- [ ] User can log in with created account
- [ ] Admin can log in with admin credentials
- [ ] User can create new application with all field types
- [ ] User can edit existing application
- [ ] User can delete application
- [ ] User can view application details
- [ ] Admin can see all applications from all users
- [ ] Admin can approve/reject applications
- [ ] Status badges display correct colors
- [ ] Logout clears session and returns to login
- [ ] All data-testid attributes are present
- [ ] Visual design matches the HTML prototype

---

## Commands to Run

After creating the project:

```bash
cd application-portal
npm install
npm run dev
```

---

## Attached File

The original HTML prototype is attached. Use it as the source of truth for:
- Visual design and CSS
- Functionality and user flows
- Form field types and validation
