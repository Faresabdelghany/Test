# Supabase Backend Integration Prompt for Claude Code

## Project Overview

Integrate Supabase as the backend for the Application Portal React app. Replace all localStorage operations with Supabase database and authentication.

**Important:** Use **Supabase MCP** (Model Context Protocol) for all database schema access, table operations, and query execution. This gives you direct access to inspect the schema and run operations.

---

## Prerequisites

Before starting, ensure:
1. Supabase MCP is connected and available
2. A Supabase project is created
3. You have the Supabase project URL and anon key

---

## Database Schema

Use Supabase MCP to create the following tables:

### 1. Profiles Table (extends Supabase Auth)

```sql
-- Use Supabase MCP to execute this schema

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Admin policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
  ON profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```

### 2. Applications Table

```sql
CREATE TABLE applications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT,
  phone TEXT,
  website TEXT,
  number_value INTEGER,
  range_value INTEGER DEFAULT 50,
  date_value DATE,
  time_value TIME,
  datetime_value TIMESTAMPTZ,
  color_value TEXT DEFAULT '#000000',
  file_url TEXT,
  category TEXT DEFAULT 'A',
  terms_accepted BOOLEAN DEFAULT FALSE,
  description TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Users can CRUD their own applications
CREATE POLICY "Users can view own applications" 
  ON applications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications" 
  ON applications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" 
  ON applications FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" 
  ON applications FOR DELETE 
  USING (auth.uid() = user_id);

-- Admins can view and update all applications
CREATE POLICY "Admins can view all applications" 
  ON applications FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update all applications" 
  ON applications FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```

### 3. Auto-update Timestamps Trigger

```sql
-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to profiles
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Apply to applications
CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### 4. Auto-create Profile on Signup

```sql
-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

### 5. Create Admin User

```sql
-- After creating admin user via Supabase Auth, run this to mark as admin:
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'admin@example.com';
```

---

## Using Supabase MCP

Throughout this integration, use Supabase MCP to:

1. **Inspect existing schema:**
   ```
   Use Supabase MCP to list all tables and their columns
   ```

2. **Execute SQL statements:**
   ```
   Use Supabase MCP to run the CREATE TABLE statements above
   ```

3. **Verify RLS policies:**
   ```
   Use Supabase MCP to list all policies on the applications table
   ```

4. **Test queries:**
   ```
   Use Supabase MCP to SELECT * FROM applications to verify data
   ```

5. **Debug issues:**
   ```
   Use Supabase MCP to check if the trigger functions exist
   ```

---

## File Changes Required

### 1. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Create Supabase Client (`src/services/supabase.js`)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3. Environment Variables (`.env`)

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Update Storage Service (`src/services/storage.js`)

Replace localStorage implementation with Supabase:

```javascript
import { supabase } from './supabase';

export const storage = {
  // ============ AUTH ============
  
  signUp: async ({ email, password, firstName, lastName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  getCurrentSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  // ============ PROFILES ============

  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  isAdmin: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data?.is_admin || false;
  },

  // ============ APPLICATIONS ============

  getApplications: async (userId = null) => {
    let query = supabase
      .from('applications')
      .select('*, profiles(email, first_name, last_name)')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  getApplication: async (id) => {
    const { data, error } = await supabase
      .from('applications')
      .select('*, profiles(email, first_name, last_name)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  createApplication: async (application) => {
    const { data, error } = await supabase
      .from('applications')
      .insert(application)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateApplication: async (id, updates) => {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteApplication: async (id) => {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Admin: Update application status
  updateApplicationStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
```

### 5. Update Auth Context (`src/context/AuthContext.jsx`)

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session on mount
    const initAuth = async () => {
      try {
        const currentUser = await storage.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const userProfile = await storage.getProfile(currentUser.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = storage.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          const userProfile = await storage.getProfile(session.user.id);
          setProfile(userProfile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async ({ email, password, firstName, lastName }) => {
    const data = await storage.signUp({ email, password, firstName, lastName });
    return data;
  };

  const signIn = async ({ email, password }) => {
    const data = await storage.signIn({ email, password });
    if (data.user) {
      const userProfile = await storage.getProfile(data.user.id);
      setProfile(userProfile);
    }
    return data;
  };

  const signOut = async () => {
    await storage.signOut();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    isAdmin: profile?.is_admin || false,
    isAuthenticated: !!user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 6. Update useApplications Hook (`src/hooks/useApplications.js`)

```javascript
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../services/storage';
import { useAuth } from '../context/AuthContext';

export function useApplications() {
  const { user, isAdmin } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Admins see all applications, users see only their own
      const data = await storage.getApplications(isAdmin ? null : user.id);
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const createApplication = async (applicationData) => {
    const newApp = await storage.createApplication({
      ...applicationData,
      user_id: user.id,
    });
    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const updateApplication = async (id, updates) => {
    const updated = await storage.updateApplication(id, updates);
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? updated : app))
    );
    return updated;
  };

  const deleteApplication = async (id) => {
    await storage.deleteApplication(id);
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const updateStatus = async (id, status) => {
    const updated = await storage.updateApplicationStatus(id, status);
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? updated : app))
    );
    return updated;
  };

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    updateStatus,
  };
}
```

---

## File Upload (Optional Enhancement)

If you want to support actual file uploads:

### 1. Create Storage Bucket via Supabase MCP

```sql
-- Use Supabase MCP to create a storage bucket
-- Or create via Supabase Dashboard: Storage > New Bucket > "application-files"
```

### 2. Add File Upload Functions to Storage Service

```javascript
// Add to src/services/storage.js

uploadFile: async (file, userId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('application-files')
    .upload(fileName, file);
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('application-files')
    .getPublicUrl(fileName);
  
  return publicUrl;
},

deleteFile: async (fileUrl) => {
  const path = fileUrl.split('/application-files/')[1];
  const { error } = await supabase.storage
    .from('application-files')
    .remove([path]);
  if (error) throw error;
},
```

---

## Migration Steps

1. **Use Supabase MCP to create the database schema** (run all SQL statements above)

2. **Verify schema with Supabase MCP:**
   - List tables: profiles, applications
   - Check columns match the schema
   - Verify RLS policies are active

3. **Create admin user:**
   - Sign up via the app with email: `admin@example.com`
   - Use Supabase MCP to run: `UPDATE profiles SET is_admin = TRUE WHERE email = 'admin@example.com';`

4. **Update React code:**
   - Install @supabase/supabase-js
   - Create supabase.js client
   - Update storage.js with Supabase operations
   - Update AuthContext for Supabase Auth
   - Update useApplications hook

5. **Add environment variables:**
   - Create .env with Supabase credentials
   - Add .env to .gitignore

6. **Test all flows:**
   - User signup/login
   - Application CRUD
   - Admin login and status updates
   - Verify RLS is working (users can only see own data)

---

## Verification Checklist

Use Supabase MCP to verify:

- [ ] Tables created: `profiles`, `applications`
- [ ] RLS enabled on both tables
- [ ] Policies created for user and admin access
- [ ] Triggers working for timestamps and profile creation
- [ ] Admin user marked with `is_admin = TRUE`

Test in the application:

- [ ] New user can sign up (profile auto-created)
- [ ] User can log in
- [ ] User can create application (saved to Supabase)
- [ ] User can only see their own applications
- [ ] User can edit/delete their applications
- [ ] Admin can log in
- [ ] Admin can see ALL applications
- [ ] Admin can approve/reject applications
- [ ] Status changes persist in database
- [ ] Logout clears session properly

---

## Troubleshooting with Supabase MCP

If something isn't working, use Supabase MCP to debug:

1. **Check if user exists:**
   ```sql
   SELECT * FROM auth.users WHERE email = 'user@example.com';
   ```

2. **Check if profile was created:**
   ```sql
   SELECT * FROM profiles WHERE email = 'user@example.com';
   ```

3. **Check RLS policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'applications';
   ```

4. **Test as specific user (bypass RLS for debugging):**
   ```sql
   -- Temporarily disable RLS (use with caution!)
   ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
   -- Re-enable after debugging
   ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
   ```

5. **Check application data:**
   ```sql
   SELECT * FROM applications ORDER BY created_at DESC LIMIT 10;
   ```

---

## Notes

- Supabase Auth handles password hashing automatically
- RLS ensures users can only access their own data at the database level
- The admin check uses a subquery to verify admin status
- All timestamps are handled by PostgreSQL triggers
- The profile is auto-created when a user signs up via the trigger
