import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApplications } from '../../hooks/useApplications';
import { useToast } from '../../context/ToastContext';
import { Button, StatusBadge, ConfirmDialog } from '../shared';
import { ApplicationForm } from './ApplicationForm';
import { ApplicationDetails } from './ApplicationDetails';
import './Dashboard.css';

export function UserDashboard() {
  const { profile } = useAuth();
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
      </div>

      {!showForm && !viewingApp && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          padding: '2rem'
        }}>
          <img
            src="/dashboard-character.png"
            alt="Dashboard Character"
            style={{
              maxWidth: '100%',
              maxHeight: '800px',
              objectFit: 'contain'
            }}
          />
        </div>
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
