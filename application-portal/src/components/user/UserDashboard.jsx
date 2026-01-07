import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useApplications } from '../../hooks/useApplications';
import { Button, StatusBadge, ThemeToggle } from '../shared';
import { ApplicationForm } from './ApplicationForm';
import { ApplicationDetails } from './ApplicationDetails';
import './Dashboard.css';

export function UserDashboard() {
  const { logout, profile } = useAuth();
  const { applications, loading, createApplication, updateApplication, deleteApplication } =
    useApplications();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [viewingApp, setViewingApp] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNewApplication = () => {
    setEditingApp(null);
    setViewingApp(null);
    setShowForm(true);
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setViewingApp(null);
    setShowForm(true);
  };

  const handleDetails = (app) => {
    setViewingApp(app);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      await deleteApplication(id);
    }
  };

  const handleFormSubmit = async (data) => {
    if (editingApp) {
      await updateApplication(editingApp.id, data);
    } else {
      await createApplication(data);
    }
    setShowForm(false);
    setEditingApp(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingApp(null);
  };

  const handleDetailsClose = () => {
    setViewingApp(null);
  };

  const pendingCount = applications.filter(app => app.status === 'Pending').length;
  const approvedCount = applications.filter(app => app.status === 'Approved').length;
  const rejectedCount = applications.filter(app => app.status === 'Rejected').length;

  return (
    <section className="container dashboard" data-testid="user-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, {profile?.first_name || 'User'}
          </p>
        </div>
        <div className="dashboard-header-actions">
          <ThemeToggle />
          <Button variant="secondary" onClick={handleLogout} testId="user-logout">
            Logout
          </Button>
        </div>
      </div>

      {!showForm && !viewingApp && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{applications.length}</div>
              <div className="stat-label">Total Applications</div>
            </div>
            <div className="stat-card stat-pending">
              <div className="stat-value">{pendingCount}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card stat-approved">
              <div className="stat-value">{approvedCount}</div>
              <div className="stat-label">Approved</div>
            </div>
            <div className="stat-card stat-rejected">
              <div className="stat-value">{rejectedCount}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>

          <div className="dashboard-actions">
            <Button 
              variant="primary" 
              onClick={handleNewApplication} 
              testId="new-application-btn"
              className="new-app-button"
            >
              <span>+</span> New Application
            </Button>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No applications yet</h3>
              <p>Create your first application to get started</p>
              <Button variant="primary" onClick={handleNewApplication}>
                Create Application
              </Button>
            </div>
          ) : (
            <div className="table-container">
              <table data-testid="user-apps-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr 
                      key={app.id} 
                      data-testid={`app-row-${app.id}`}
                    >
                      <td className="table-title">{app.title}</td>
                      <td>{app.email}</td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="table-date">
                        {app.created_at 
                          ? new Date(app.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : '-'}
                      </td>
                      <td className="action-buttons">
                        <Button
                          variant="secondary"
                          onClick={() => handleDetails(app)}
                          testId={`app-details-btn-${app.id}`}
                        >
                          View
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleEdit(app)}
                          testId={`app-edit-btn-${app.id}`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(app.id)}
                          testId={`app-delete-btn-${app.id}`}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showForm && (
        <ApplicationForm
          application={editingApp}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {viewingApp && (
        <ApplicationDetails application={viewingApp} onClose={handleDetailsClose} />
      )}
    </section>
  );
}
