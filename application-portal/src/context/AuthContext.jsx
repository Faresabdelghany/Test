import { createContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';

export const AuthContext = createContext(null);

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
    const {
      data: { subscription },
    } = storage.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        try {
          const userProfile = await storage.getProfile(session.user.id);
          setProfile(userProfile);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await storage.signIn({ email, password });
      if (data.user) {
        const userProfile = await storage.getProfile(data.user.id);
        setProfile(userProfile);
        return { success: true, isAdmin: userProfile?.is_admin || false };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await storage.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const signup = async (userData) => {
    try {
      if (userData.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      await storage.signUp({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const isAdmin = profile?.is_admin || false;

  const value = {
    user,
    profile,
    isAdmin,
    loading,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
