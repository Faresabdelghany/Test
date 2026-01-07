import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useApplications } from '../../hooks/useApplications';
import { Button, StatusBadge } from '../shared';
import { STATUS } from '../../constants';

export function AdminDashboard() {
  const { logout } = useAuth();
  const { applications, setStatus } = useApplications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleApprove = async (id) => {
    await setStatus(id, STATUS.APPROVED);
  };

  const handleReject = async (id) => {
    await setStatus(id, STATUS.REJECTED);
  };

  return (
    <section className="container" data-testid="admin-dashboard">
      <div className="header">
        <h2>Admin Dashboard</h2>
        <Button variant="secondary" onClick={handleLogout} testId="admin-logout">
          Logout
        </Button>
      </div>

      <table data-testid="admin-apps-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Title</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} data-testid={`admin-app-row-${app.id}`}>
              <td>{app.profiles?.email || 'Unknown'}</td>
              <td>{app.title}</td>
              <td>{app.email}</td>
              <td>
                <StatusBadge status={app.status} />
              </td>
              <td className="action-buttons">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
