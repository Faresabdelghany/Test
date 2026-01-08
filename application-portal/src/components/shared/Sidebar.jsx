import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

// SVG Icons
const GridIcon = () => (
  <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ChevronIcon = ({ isOpen }) => (
  <svg
    className={`sidebar-chevron ${isOpen ? 'open' : ''}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export function Sidebar({ onNewApplication }) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [exploreOpen, setExploreOpen] = useState(true);

  const handleNewApplication = () => {
    if (onNewApplication) {
      onNewApplication();
    }
    navigate(isAdmin ? '/admin' : '/dashboard');
  };

  return (
    <aside className="sidebar" data-testid="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="sidebar-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h6v6H9z" />
          </svg>
        </span>
        <span className="sidebar-title">Application Portal</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Explore Section - Expandable */}
        <div className="sidebar-section">
          <button
            className="sidebar-section-header"
            onClick={() => setExploreOpen(!exploreOpen)}
            aria-expanded={exploreOpen}
          >
            <span>Explore</span>
            <ChevronIcon isOpen={exploreOpen} />
          </button>

          <div className={`sidebar-section-content ${exploreOpen ? 'open' : ''}`}>
            <NavLink
              to={isAdmin ? "/admin" : "/dashboard"}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              data-testid="sidebar-dashboard"
            >
              <GridIcon />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/applications"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              data-testid="sidebar-applications"
            >
              <DocumentIcon />
              <span>Applications</span>
            </NavLink>
          </div>
        </div>

        {/* Quick Action */}
        {!isAdmin && (
          <button
            className="sidebar-action-btn"
            onClick={handleNewApplication}
            data-testid="sidebar-new-app"
          >
            <PlusIcon />
            <span>New Application</span>
          </button>
        )}
      </nav>
    </aside>
  );
}
