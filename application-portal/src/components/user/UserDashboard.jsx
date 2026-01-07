import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useApplications } from '../../hooks/useApplications';
import { Button, StatusBadge } from '../shared';
import { ApplicationForm } from './ApplicationForm';
import { ApplicationDetails } from './ApplicationDetails';

export function UserDashboard() {
  const { logout } = useAuth();
  const { applications, createApplication, updateApplication, deleteApplication } =
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
    await deleteApplication(id);
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

  return (
    <section className="container" data-testid="user-dashboard">
      <div className="header">
        <h2>User Dashboard</h2>
        <Button variant="secondary" onClick={handleLogout} testId="user-logout">
          Logout
        </Button>
      </div>

      <Button variant="primary" onClick={handleNewApplication} testId="new-application-btn">
        + New Application
      </Button>

      <table data-testid="user-apps-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} data-testid={`app-row-${app.id}`}>
              <td>{app.title}</td>
              <td>{app.email}</td>
              <td>
                <StatusBadge status={app.status} />
              </td>
              <td className="action-buttons">
                <Button
                  onClick={() => handleDetails(app)}
                  testId={`app-details-btn-${app.id}`}
                >
                  Details
                </Button>
                <Button
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
