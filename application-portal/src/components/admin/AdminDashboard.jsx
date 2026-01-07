import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useApplications } from '../../hooks/useApplications';
import { Button, StatusBadge, ThemeToggle } from '../shared';
import { STATUS } from '../../constants';
import '../user/Dashboard.css';

export function AdminDashboard() {
  const { logout, profile } = useAuth();
  const { applications, loading, setStatus } = useApplications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleApprove = async (id) => {
    await setStatus(id, STATUS.APPROVED);
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this application?')) {
      await setStatus(id, STATUS.REJECTED);
    }
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
        <div className="dashboard-header-actions">
          <ThemeToggle />
          <Button variant="secondary" onClick={handleLogout} testId="admin-logout">
            Logout
          </Button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">Awaiting Review</div>
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
          <div className="empty-icon">📊</div>
          <h3>No applications yet</h3>
          <p>Applications will appear here once users start submitting</p>
        </div>
      ) : (
        <div className="table-container">
          <table data-testid="admin-apps-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Title</th>
                <th>Email</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr 
                  key={app.id} 
                  data-testid={`admin-app-row-${app.id}`}
                >
                  <td className="table-title">
                    {app.profiles?.email || app.profiles?.first_name 
                      ? `${app.profiles.first_name || ''} ${app.profiles.last_name || ''}`.trim() || app.profiles.email
                      : 'Unknown'}
                  </td>
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
                    {app.status === 'Pending' && (
                      <>
                        <Button
                          variant="success"
                          onClick={() => handleApprove(app.id)}
                          testId={`approve-btn-${app.id}`}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleReject(app.id)}
                          testId={`reject-btn-${app.id}`}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {app.status !== 'Pending' && (
                      <span className="action-complete">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
