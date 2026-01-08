import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import './Sidebar.css';
import './Navbar.css';

export function Layout({ children, onNewApplication }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout-with-sidebar">
      {/* Mobile menu toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
        data-testid="mobile-menu-toggle"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar onNewApplication={onNewApplication} />
      </aside>

      {/* Main content wrapper */}
      <div className="layout-content">
        {/* Top Navbar */}
        <Navbar />

        {/* Main content area */}
        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
}
