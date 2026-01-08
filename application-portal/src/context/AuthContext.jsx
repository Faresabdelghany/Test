import { createContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check current session on mount - use getSession() for fast local check
    const initAuth = async () => {
      try {
        const session = await storage.getCurrentSession();
        if (session?.user && mounted) {
          setUser(session.user);
          try {
            const userProfile = await storage.getProfile(session.user.id);
            if (mounted) {
              setProfile(userProfile);
            }
          } catch (profileError) {
            // Profile fetch failed, but user is still authenticated
            console.error('Failed to fetch profile:', profileError);
          }
        }
      } catch (error) {
        if (mounted && error.name !== 'AbortError') {
          console.error('Auth init error:', error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = storage.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        try {
          const userProfile = await storage.getProfile(session.user.id);
          if (mounted) {
            setProfile(userProfile);
          }
        } catch (error) {
          if (mounted && error.name !== 'AbortError') {
            console.error('Failed to fetch profile:', error);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
    // Clear local state first for immediate UI feedback
    setUser(null);
    setProfile(null);

    try {
      await storage.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if signOut fails, we've already cleared local state
      // so user will be redirected to login
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

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-primary, #f5f5f5)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border-color, #e0e0e0)',
          borderTopColor: 'var(--accent-color, #6366f1)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
