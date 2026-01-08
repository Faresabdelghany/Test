import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApplications } from '../../hooks/useApplications';
import { useToast } from '../../context/ToastContext';
import { Button, StatusBadge, ConfirmDialog } from '../shared';
import { STATUS } from '../../constants';
import '../user/Dashboard.css';

export function AdminDashboard() {
  const { profile } = useAuth();
  const { applications, loading, setStatus } = useApplications();
  const { success, error } = useToast();

  const [rejectConfirm, setRejectConfirm] = useState({ open: false, id: null });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (id) => {
    setIsProcessing(true);
    try {
      await setStatus(id, STATUS.APPROVED);
      success('Application approved successfully');
    } catch (err) {
      error('Failed to approve application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = (id) => {
    setRejectConfirm({ open: true, id });
  };

  const handleRejectConfirm = async () => {
    setIsProcessing(true);
    try {
      await setStatus(rejectConfirm.id, STATUS.REJECTED);
      success('Application rejected');
      setRejectConfirm({ open: false, id: null });
    } catch (err) {
      error('Failed to reject application');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectCancel = () => {
    setRejectConfirm({ open: false, id: null });
  };

  const pendingCount = applications.filter(app => app.status === 'Pending').length;
  const approvedCount = applications.filter(app => app.status === 'Approved').length;
  const rejectedCount = applications.filter(app => app.status === 'Rejected').length;
  const totalCount = applications.length;

  return (
    <section className="container dashboard" data-testid="admin-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1>Admin Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage all applications • {profile?.first_name || 'Admin'}
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '2rem'
      }}>
        <img
          src="/dashboard-character.png"
          alt="Testing System - Dashboard Placeholder"
          style={{
            maxWidth: '100%',
            maxHeight: '800px',
            objectFit: 'contain'
          }}
        />
      </div>

      <ConfirmDialog
        isOpen={rejectConfirm.open}
        title="Reject Application"
        message="Are you sure you want to reject this application? The applicant will be notified."
        confirmText="Reject"
        onConfirm={handleRejectConfirm}
        onCancel={handleRejectCancel}
        loading={isProcessing}
      />
    </section>
  );
}
