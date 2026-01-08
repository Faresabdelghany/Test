import { useState } from 'react';
import { useApplications } from '../../hooks/useApplications';
import { useToast } from '../../context/ToastContext';
import { Button, StatusBadge, ConfirmDialog } from '../shared';
import { ApplicationForm } from './ApplicationForm';
import { ApplicationDetails } from './ApplicationDetails';
import './Dashboard.css';

export function ApplicationsPage() {
  const { applications, loading, createApplication, updateApplication, deleteApplication } =
    useApplications();
  const { success, error } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [viewingApp, setViewingApp] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteApplication(deleteConfirm.id);
      success('Application deleted successfully');
      setDeleteConfirm({ open: false, id: null });
    } catch (err) {
      error('Failed to delete application');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, id: null });
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingApp) {
        await updateApplication(editingApp.id, data);
        success('Application updated successfully');
      } else {
        await createApplication(data);
        success('Application created successfully');
      }
      setShowForm(false);
      setEditingApp(null);
    } catch (err) {
      error(err.message || 'Failed to save application');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingApp(null);
  };

  const handleDetailsClose = () => {
    setViewingApp(null);
  };

  return (
    <section className="dashboard applications-page" data-testid="applications-page">
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1>Applications</h1>
          <p className="dashboard-subtitle">
            Manage all your applications
          </p>
        </div>
      </div>

      {!showForm && !viewingApp && (
        <>
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
              <table data-testid="applications-table">
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
                          onClick={() => handleDeleteClick(app.id)}
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

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={isDeleting}
      />
    </section>
  );
}
