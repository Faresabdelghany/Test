import { Routes, Route, Navigate } from 'react-router-dom';
import { Login, Signup } from './components/auth';
import { UserDashboard, ApplicationsPage } from './components/user';
import { AdminDashboard } from './components/admin';
import { Layout } from './components/shared';
import { useAuth } from './hooks/useAuth';
import { SearchProvider } from './context/SearchContext';

function ProtectedRoute({ children }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <SearchProvider>
        <Layout>{children}</Layout>
      </SearchProvider>
    </ProtectedRoute>
  );
}

function AdminLayout({ children }) {
  return (
    <AdminRoute>
      <SearchProvider>
        <Layout>{children}</Layout>
      </SearchProvider>
    </AdminRoute>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <UserDashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedLayout>
            <ApplicationsPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />
    </Routes>
  );
}

export default App;
