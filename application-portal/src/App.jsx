import { Routes, Route, Navigate } from 'react-router-dom';
import { Login, Signup } from './components/auth';
import { UserDashboard, ApplicationsPage } from './components/user';
import { AdminDashboard, AdminApplicationsPage } from './components/admin';
import { Layout } from './components/shared';
import { useAuth } from './hooks/useAuth';
import { SearchProvider } from './context/SearchContext';

// Route for regular users only (redirects admins to admin dashboard)
function UserRoute({ children }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

// Route for admin users only (redirects non-admins to user dashboard)
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

function UserLayout({ children }) {
  return (
    <UserRoute>
      <SearchProvider>
        <Layout>{children}</Layout>
      </SearchProvider>
    </UserRoute>
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

      {/* User routes */}
      <Route
        path="/dashboard"
        element={
          <UserLayout>
            <UserDashboard />
          </UserLayout>
        }
      />
      <Route
        path="/applications"
        element={
          <UserLayout>
            <ApplicationsPage />
          </UserLayout>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/applications"
        element={
          <AdminLayout>
            <AdminApplicationsPage />
          </AdminLayout>
        }
      />
    </Routes>
  );
}

export default App;
