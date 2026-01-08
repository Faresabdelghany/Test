import { useState } from 'react';
import { useApplications } from '../../hooks/useApplications';
import { useToast } from '../../context/ToastContext';
import { Button, StatusBadge, ConfirmDialog } from '../shared';
import { ApplicationDetails } from '../user/ApplicationDetails';
import { STATUS } from '../../constants';
import '../user/Dashboard.css';

export function AdminApplicationsPage() {
  const { applications, loading, setStatus } = useApplications();
  const { success, error } = useToast();

  const [viewingApp, setViewingApp] = useState(null);
  const [actionConfirm, setActionConfirm] = useState({ open: false, id: null, action: null });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDetails = (app) => {
    setViewingApp(app);
  };

  const handleDetailsClose = () => {
    setViewingApp(null);
  };

  const handleApprove = (id) => {
    setActionConfirm({ open: true, id, action: 'approve' });
  };

  const handleReject = (id) => {
    setActionConfirm({ open: true, id, action: 'reject' });
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      const newStatus = actionConfirm.action === 'approve' ? STATUS.APPROVED : STATUS.REJECTED;
      await setStatus(actionConfirm.id, newStatus);
      success(`Application ${actionConfirm.action === 'approve' ? 'approved' : 'rejected'} successfully`);
      setActionConfirm({ open: false, id: null, action: null });
    } catch (err) {
      error(`Failed to ${actionConfirm.action} application`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setActionConfirm({ open: false, id: null, action: null });
  };

  const pendingCount = applications.filter(app => app.status === 'Pending').length;
  const approvedCount = applications.filter(app => app.status === 'Approved').length;
  const rejectedCount = applications.filter(app => app.status === 'Rejected').length;

  return (
    <section className="dashboard applications-page" data-testid="admin-applications-page">
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1>All Applications</h1>
          <p className="dashboard-subtitle">
            Review and manage all user applications
          </p>
        </div>
      </div>

      {!viewingApp && (
        <>
          {/* Stats */}
          <div className="stats-grid">
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

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No applications yet</h3>
              <p>Applications from users will appear here</p>
            </div>
          ) : (
            <div className="table-container">
              <table data-testid="admin-applications-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Applicant</th>
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
                      data-testid={`admin-app-row-${app.id}`}
                    >
                      <td className="table-title">{app.title}</td>
                      <td>
                        {app.profiles?.first_name} {app.profiles?.last_name}
                      </td>
                      <td>{app.email || app.profiles?.email}</td>
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
                          testId={`admin-app-view-btn-${app.id}`}
                        >
                          View
                        </Button>
                        {app.status === STATUS.PENDING && (
                          <>
                            <Button
                              variant="success"
                              onClick={() => handleApprove(app.id)}
                              testId={`admin-app-approve-btn-${app.id}`}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleReject(app.id)}
                              testId={`admin-app-reject-btn-${app.id}`}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {app.status !== STATUS.PENDING && (
                          <span className="action-complete">
                            {app.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {viewingApp && (
        <ApplicationDetails application={viewingApp} onClose={handleDetailsClose} />
      )}

      <ConfirmDialog
        isOpen={actionConfirm.open}
        title={actionConfirm.action === 'approve' ? 'Approve Application' : 'Reject Application'}
        message={
          actionConfirm.action === 'approve'
            ? 'Are you sure you want to approve this application?'
            : 'Are you sure you want to reject this application? The applicant will be notified.'
        }
        confirmText={actionConfirm.action === 'approve' ? 'Approve' : 'Reject'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={isProcessing}
      />
    </section>
  );
}
